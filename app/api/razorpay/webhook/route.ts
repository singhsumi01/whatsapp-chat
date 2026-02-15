/**
 * POST /api/razorpay/webhook
 * Handle Razorpay webhooks for automated payment updates
 * 
 * Webhook events handled:
 * - payment.captured: Payment successful
 * - payment.failed: Payment failed
 * - subscription.cancelled: Subscription cancelled (future)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyWebhookSignature, calculateNextBillingPeriod } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      console.error('Missing webhook signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;

    console.log(`📨 Webhook received: ${event}`);

    // Handle different webhook events
    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(paymentEntity);
        break;

      case 'payment.failed':
        await handlePaymentFailed(paymentEntity);
        break;

      case 'payment.authorized':
        await handlePaymentAuthorized(paymentEntity);
        break;

      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle payment.captured event
 */
async function handlePaymentCaptured(payment: any) {
  if (!payment) return;

  const { id: paymentId, order_id: orderId, amount, notes } = payment;
  const userId = notes?.userId;

  if (!userId) {
    console.error('No userId in payment notes');
    return;
  }

  // Find user's subscription
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    console.error(`Subscription not found for user: ${userId}`);
    return;
  }

  // Calculate billing period
  const { currentPeriodStart, currentPeriodEnd } = calculateNextBillingPeriod();

  // Update subscription to ACTIVE
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: 'ACTIVE',
      startDate: subscription.startDate || currentPeriodStart,
      currentPeriodStart,
      currentPeriodEnd,
    },
  });

  // Create payment record if not exists
  const existingPayment = await prisma.payment.findUnique({
    where: { razorpayPaymentId: paymentId },
  });

  if (!existingPayment) {
    await prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        userId,
        amount: amount / 100, // Convert from paise
        currency: 'INR',
        status: 'CAPTURED',
        razorpayPaymentId: paymentId,
        razorpayOrderId: orderId,
        paymentMethod: payment.method,
        billingPeriodStart: currentPeriodStart,
        billingPeriodEnd: currentPeriodEnd,
      },
    });
  }

  // Activate user
  await prisma.user.update({
    where: { id: userId },
    data: { isActive: true },
  });

  console.log(`✅ Payment captured for user: ${userId}`);
}

/**
 * Handle payment.failed event
 */
async function handlePaymentFailed(payment: any) {
  if (!payment) return;

  const { id: paymentId, order_id: orderId, amount, notes, error_description } = payment;
  const userId = notes?.userId;

  if (!userId) {
    console.error('No userId in payment notes');
    return;
  }

  // Find user's subscription
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    console.error(`Subscription not found for user: ${userId}`);
    return;
  }

  // Update subscription to PAST_DUE if it was ACTIVE
  if (subscription.status === 'ACTIVE') {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'PAST_DUE' },
    });
  }

  // Create failed payment record
  const { currentPeriodStart, currentPeriodEnd } = calculateNextBillingPeriod();

  await prisma.payment.create({
    data: {
      subscriptionId: subscription.id,
      userId,
      amount: amount / 100,
      currency: 'INR',
      status: 'FAILED',
      razorpayPaymentId: paymentId,
      razorpayOrderId: orderId,
      paymentMethod: payment.method,
      failureReason: error_description,
      billingPeriodStart: currentPeriodStart,
      billingPeriodEnd: currentPeriodEnd,
    },
  });

  console.log(`❌ Payment failed for user: ${userId} - ${error_description}`);
}

/**
 * Handle payment.authorized event
 */
async function handlePaymentAuthorized(payment: any) {
  if (!payment) return;

  const { id: paymentId, order_id: orderId, amount, notes } = payment;
  const userId = notes?.userId;

  if (!userId) {
    console.error('No userId in payment notes');
    return;
  }

  // Find user's subscription
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    console.error(`Subscription not found for user: ${userId}`);
    return;
  }

  // Create payment record with AUTHORIZED status
  const { currentPeriodStart, currentPeriodEnd } = calculateNextBillingPeriod();

  const existingPayment = await prisma.payment.findUnique({
    where: { razorpayPaymentId: paymentId },
  });

  if (!existingPayment) {
    await prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        userId,
        amount: amount / 100,
        currency: 'INR',
        status: 'AUTHORIZED',
        razorpayPaymentId: paymentId,
        razorpayOrderId: orderId,
        paymentMethod: payment.method,
        billingPeriodStart: currentPeriodStart,
        billingPeriodEnd: currentPeriodEnd,
      },
    });
  }

  console.log(`✅ Payment authorized for user: ${userId}`);
}
