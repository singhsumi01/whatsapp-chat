/**
 * user-sync.ts
 * Shared utility for keeping the DB User record in sync with Clerk.
 *
 * Usage:
 *   import { getOrCreateUser } from '@/lib/user-sync';
 *   const user = await getOrCreateUser(userId);
 */

import { clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * Resolve a user's full name from Clerk's user object.
 * Falls back to first+last, then username.
 */
function resolveClerkName(clerkUser: {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
}): string | null {
  const parts = [clerkUser.firstName, clerkUser.lastName].filter(Boolean);
  if (parts.length) return parts.join(' ');
  return clerkUser.username ?? null;
}

/**
 * Resolve a user's primary email from Clerk's user object.
 */
function resolveClerkEmail(clerkUser: {
  emailAddresses?: Array<{ id: string; emailAddress: string }>;
  primaryEmailAddressId?: string | null;
}): string | null {
  const emails = clerkUser.emailAddresses;
  if (!emails?.length) return null;

  if (clerkUser.primaryEmailAddressId) {
    const primary = emails.find((e) => e.id === clerkUser.primaryEmailAddressId);
    if (primary) return primary.emailAddress;
  }

  return emails[0].emailAddress;
}

/**
 * Fetch Clerk user info and upsert the DB user with email + name.
 * Returns the up-to-date DB user record.
 */
export async function getOrCreateUser(userId: string) {
  // 1. Check if user already exists in DB
  const existing = await prisma.user.findUnique({ where: { id: userId } });

  if (existing) {
    // If both fields are already populated, return immediately
    if (existing.email && existing.name) return existing;

    // Otherwise, try to fill in any missing fields from Clerk
    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);
      const email = existing.email ?? resolveClerkEmail(clerkUser);
      const name = existing.name ?? resolveClerkName(clerkUser);

      if (email !== existing.email || name !== existing.name) {
        return await prisma.user.update({
          where: { id: userId },
          data: { email, name },
        });
      }
    } catch (err) {
      console.error(`[user-sync] Could not fetch Clerk user ${userId} to fill missing fields:`, err);
    }
    return existing;
  }

  // 2. User not in DB — fetch from Clerk and create
  let email: string | null = null;
  let name: string | null = null;

  try {
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    email = resolveClerkEmail(clerkUser);
    name = resolveClerkName(clerkUser);
  } catch (err) {
    console.error(`[user-sync] Could not fetch Clerk user ${userId}:`, err);
    // Still create the user in DB — email/name can be backfilled later
  }

  return await prisma.user.create({
    data: {
      id: userId,
      email,
      name,
    },
  });
}

/**
 * Sync (update) an existing DB user's email and name from Clerk.
 * Safe to call even if the user doesn't exist yet — it will create them.
 */
export async function syncUserFromClerk(userId: string): Promise<void> {
  try {
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const email = resolveClerkEmail(clerkUser);
    const name = resolveClerkName(clerkUser);

    await prisma.user.upsert({
      where: { id: userId },
      update: { email, name },
      create: { id: userId, email, name },
    });

    console.log(`[user-sync] Synced user ${userId}: name="${name}", email="${email}"`);
  } catch (err) {
    console.error(`[user-sync] Failed to sync user ${userId} from Clerk:`, err);
    throw err;
  }
}
