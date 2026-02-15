/**
 * Razorpay Integration Utilities
 * Handles payment processing for SaaS subscriptions
 */

import Razorpay from 'razorpay';
import crypto from 'crypto';

// Environment variables validation
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.warn('⚠️ Razorpay credentials not configured. Payment features will be disabled.');
}

/**
 * Initialize Razorpay instance
 */
export function getRazorpayInstance(): Razorpay | null {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return null;
  }

  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
}

/**
 * Create Razorpay order for subscription payment
 */
export async function createRazorpayOrder(amount: number, userId: string) {
  const razorpay = getRazorpayInstance();
  
  if (!razorpay) {
    throw new Error('Razorpay not configured');
  }

  try {
    // Receipt must be max 40 chars - use short format
    const shortId = userId.slice(-8); // Last 8 chars of userId
    const timestamp = Date.now().toString().slice(-10); // Last 10 digits
    const receipt = `rcpt_${shortId}_${timestamp}`; // Max ~25 chars
    
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise (smallest currency unit)
      currency: 'INR',
      receipt,
      notes: {
        userId,
        purpose: 'subscription_payment',
      },
    });

    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
}

/**
 * Verify Razorpay payment signature
 * This ensures the payment callback is genuine and not tampered with
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay secret key not configured');
  }

  try {
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Error verifying Razorpay signature:', error);
    return false;
  }
}

/**
 * Verify Razorpay webhook signature
 * This validates that webhooks are actually from Razorpay
 */
export function verifyWebhookSignature(
  body: string,
  signature: string
): boolean {
  if (!RAZORPAY_WEBHOOK_SECRET) {
    throw new Error('Razorpay webhook secret not configured');
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

/**
 * Fetch payment details from Razorpay
 */
export async function fetchPaymentDetails(paymentId: string) {
  const razorpay = getRazorpayInstance();
  
  if (!razorpay) {
    throw new Error('Razorpay not configured');
  }

  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw new Error('Failed to fetch payment details');
  }
}

/**
 * Create Razorpay customer
 */
export async function createRazorpayCustomer(
  name: string,
  email: string,
  contact: string
) {
  const razorpay = getRazorpayInstance();
  
  if (!razorpay) {
    throw new Error('Razorpay not configured');
  }

  try {
    const customer = await razorpay.customers.create({
      name,
      email,
      contact,
      fail_existing: 0, // Don't fail if customer already exists
    });

    return customer;
  } catch (error) {
    console.error('Error creating Razorpay customer:', error);
    throw new Error('Failed to create customer');
  }
}

/**
 * Calculate next billing period (30 days from now)
 */
export function calculateNextBillingPeriod(fromDate: Date = new Date()) {
  const currentPeriodStart = new Date(fromDate);
  const currentPeriodEnd = new Date(fromDate);
  currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30); // 30-day billing cycle

  return {
    currentPeriodStart,
    currentPeriodEnd,
  };
}

/**
 * Format amount for display (₹500.00)
 */
export function formatAmount(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Check if Razorpay is properly configured
 */
export function isRazorpayConfigured(): boolean {
  return !!(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);
}
