/**
 * POST /api/clerk-webhook
 *
 * Clerk sends events here when a user is created or updated.
 * We store the user's email and name in NeonDB so they're
 * visible in the database alongside the Clerk user ID.
 *
 * Setup:
 *  1. Go to https://dashboard.clerk.com → Webhooks → Add endpoint
 *  2. URL: https://<your-domain>/api/clerk-webhook
 *  3. Subscribe to: user.created, user.updated
 *  4. Copy the Signing Secret → add to .env as CLERK_WEBHOOK_SECRET
 */

import { NextRequest, NextResponse } from 'next/server';
import { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveEmail(data: {
  email_addresses?: Array<{ id: string; email_address: string }>;
  primary_email_address_id?: string | null;
}): string | null {
  const emails = data.email_addresses;
  if (!emails?.length) return null;

  if (data.primary_email_address_id) {
    const primary = emails.find((e) => e.id === data.primary_email_address_id);
    if (primary) return primary.email_address;
  }

  return emails[0].email_address;
}

function resolveName(data: {
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
}): string | null {
  const parts = [data.first_name, data.last_name].filter(Boolean);
  if (parts.length) return parts.join(' ');
  return data.username ?? null;
}

// ─── Route handler ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[clerk-webhook] CLERK_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  // ── Verify Svix signature ──
  const svixId = req.headers.get('svix-id');
  const svixTimestamp = req.headers.get('svix-timestamp');
  const svixSignature = req.headers.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: 'Missing Svix headers' },
      { status: 400 }
    );
  }

  const rawBody = await req.text();

  let event: WebhookEvent;
  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(rawBody, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('[clerk-webhook] Signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid webhook signature' },
      { status: 400 }
    );
  }

  const { type, data } = event;

  // Only handle user events
  if (type !== 'user.created' && type !== 'user.updated') {
    console.log(`[clerk-webhook] Unhandled event type: ${type}`);
    return NextResponse.json({ received: true }, { status: 200 });
  }

  // At this point data is a UserJSON payload
  const userData = data as {
    id: string;
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    email_addresses: Array<{ id: string; email_address: string }>;
    primary_email_address_id: string | null;
  };

  const userId = userData.id;
  const email = resolveEmail(userData);
  const name = resolveName(userData);

  console.log(`[clerk-webhook] Event: ${type} | user: ${userId} | email: ${email} | name: ${name}`);

  // ── Handle events ──
  if (type === 'user.created') {
    try {
      await prisma.user.upsert({
        where: { id: userId },
        update: { email, name },
        create: { id: userId, email, name },
      });
      console.log(`[clerk-webhook] ✅ user.created — upserted user ${userId}`);
    } catch (err) {
      console.error(`[clerk-webhook] ❌ Failed to upsert user ${userId}:`, err);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }
  } else {
    // user.updated
    try {
      const exists = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });

      if (exists) {
        await prisma.user.update({
          where: { id: userId },
          data: { email, name },
        });
        console.log(`[clerk-webhook] ✅ user.updated — synced user ${userId}`);
      } else {
        // Create if missing (edge case: webhook arrives before first app visit)
        await prisma.user.create({
          data: { id: userId, email, name },
        });
        console.log(`[clerk-webhook] ✅ user.updated (new) — created user ${userId}`);
      }
    } catch (err) {
      console.error(`[clerk-webhook] ❌ Failed to update user ${userId}:`, err);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
