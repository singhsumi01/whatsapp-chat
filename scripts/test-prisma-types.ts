/**
 * Test Prisma Client Types
 * Verify that new SaaS models are available in Prisma client
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPrismaTypes() {
  console.log('🔍 Testing Prisma Client types...\n');

  // Test 1: SubscriptionPlan model exists
  try {
    const plans = await prisma.subscriptionPlan.findMany();
    console.log('✅ subscriptionPlan model available');
    console.log(`   Found ${plans.length} plan(s)`);
  } catch (error) {
    console.log('❌ subscriptionPlan model NOT available');
  }

  // Test 2: Subscription model exists
  try {
    const subscriptions = await prisma.subscription.findMany();
    console.log('✅ subscription model available');
    console.log(`   Found ${subscriptions.length} subscription(s)`);
  } catch (error) {
    console.log('❌ subscription model NOT available');
  }

  // Test 3: Payment model exists
  try {
    const payments = await prisma.payment.findMany();
    console.log('✅ payment model available');
    console.log(`   Found ${payments.length} payment(s)`);
  } catch (error) {
    console.log('❌ payment model NOT available');
  }

  // Test 4: UsageRecord model exists
  try {
    const usageRecords = await prisma.usageRecord.findMany();
    console.log('✅ usageRecord model available');
    console.log(`   Found ${usageRecords.length} usage record(s)`);
  } catch (error) {
    console.log('❌ usageRecord model NOT available');
  }

  // Test 5: User.subscription relation works
  try {
    const user = await prisma.user.findFirst({
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });
    console.log('✅ User.subscription relation available');
    if (user) {
      console.log(`   User ${user.id}: subscription status = ${user.subscription?.status || 'NONE'}`);
    }
  } catch (error) {
    console.log('❌ User.subscription relation NOT available');
  }

  // Test 6: User.isActive field exists
  try {
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        isActive: true,
      },
    });
    console.log('✅ User.isActive field available');
    if (user) {
      console.log(`   User ${user.id}: isActive = ${user.isActive}`);
    }
  } catch (error) {
    console.log('❌ User.isActive field NOT available');
  }

  console.log('\n🎉 All Prisma type tests completed!');
}

testPrismaTypes()
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
