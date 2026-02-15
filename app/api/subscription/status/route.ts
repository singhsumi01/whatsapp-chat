/**
 * GET /api/subscription/status
 * Get current user's subscription status and details
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user with subscription details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5, // Last 5 payments
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If no subscription, return inactive status
    if (!user.subscription) {
      return NextResponse.json({
        hasSubscription: false,
        isActive: false,
        daysRemaining: null,
        status: 'INACTIVE',
        message: 'No subscription found. Please subscribe to access all features.',
      });
    }

    // Check if subscription billing period has ended
    const now = new Date();
    const isExpired = user.subscription.currentPeriodEnd 
      ? new Date(user.subscription.currentPeriodEnd) < now
      : true; // If no end date, consider expired

    // Calculate days remaining (only if not expired)
    let daysRemaining = 0;
    if (user.subscription.currentPeriodEnd && !isExpired) {
      const endDate = new Date(user.subscription.currentPeriodEnd);
      const diffTime = endDate.getTime() - now.getTime();
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Determine if user should have access
    // Access is granted if:
    // 1. Status is ACTIVE and billing period hasn't ended
    // 2. Status is CANCELLED but billing period hasn't ended (they paid for this period)
    const hasAccess = !isExpired && 
      (user.subscription.status === 'ACTIVE' || user.subscription.status === 'CANCELLED');

    // If subscription expired, update status in database (lazy expiration)
    if (isExpired && user.subscription.status !== 'EXPIRED') {
      await prisma.$transaction([
        prisma.subscription.update({
          where: { id: user.subscription.id },
          data: { status: 'EXPIRED' },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { isActive: false },
        }),
      ]);
    }

    // Also sync User.isActive with actual access status
    if (user.isActive !== hasAccess) {
      await prisma.user.update({
        where: { id: userId },
        data: { isActive: hasAccess },
      });
    }

    return NextResponse.json({
      hasSubscription: true,
      isActive: hasAccess, // Calculated dynamically, not from DB
      daysRemaining,
      subscription: {
        id: user.subscription.id,
        status: isExpired ? 'EXPIRED' : user.subscription.status,
        startDate: user.subscription.startDate,
        currentPeriodStart: user.subscription.currentPeriodStart,
        currentPeriodEnd: user.subscription.currentPeriodEnd,
        autoRenew: user.subscription.autoRenew,
        cancelledAt: user.subscription.cancelledAt,
        daysRemaining,
        isExpired,
        plan: {
          name: user.subscription.plan.name,
          displayName: user.subscription.plan.displayName,
          description: user.subscription.plan.description,
          price: Number(user.subscription.plan.price),
          currency: user.subscription.plan.currency,
        },
      },
      recentPayments: user.payments.map((payment) => ({
        id: payment.id,
        amount: Number(payment.amount),
        currency: payment.currency,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        billingPeriodStart: payment.billingPeriodStart,
        billingPeriodEnd: payment.billingPeriodEnd,
        createdAt: payment.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription status' },
      { status: 500 }
    );
  }
}
