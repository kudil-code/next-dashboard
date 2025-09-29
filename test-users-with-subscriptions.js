// Script to generate test users with different subscription plans
// Run this with: node test-users-with-subscriptions.js

const bcrypt = require('bcrypt');

// First, let's create the subscription plans based on your 3-tier requirements
const subscriptionPlans = [
  {
    plan_id: 1,
    plan_name: 'free',
    plan_display_name: 'Free Plan',
    duration_months: 0,
    price: 0.00,
    max_favorites: 50,
    max_daily_views: 50,
    features: JSON.stringify({
      "all_search_functions": true,
      "daily_tender_limit": 50,
      "max_favorites": 50,
      "email_notifications": false,
      "unlimited_favorites": false,
      "unlimited_daily_view": false
    }),
    is_active: 1
  },
  {
    plan_id: 2,
    plan_name: 'premium_3month',
    plan_display_name: 'Premium 3 Months',
    duration_months: 3,
    price: 150000.00, // 150k IDR for 3 months
    max_favorites: 999999, // Unlimited (using high number)
    max_daily_views: 999999, // Unlimited (using high number)
    features: JSON.stringify({
      "all_search_functions": true,
      "unlimited_favorites": true,
      "unlimited_daily_view": true,
      "email_notifications": true,
      "daily_tender_limit": 999999
    }),
    is_active: 1
  },
  {
    plan_id: 3,
    plan_name: 'premium_12month',
    plan_display_name: 'Premium 12 Months',
    duration_months: 12,
    price: 500000.00, // 500k IDR for 12 months (better value)
    max_favorites: 999999, // Unlimited (using high number)
    max_daily_views: 999999, // Unlimited (using high number)
    features: JSON.stringify({
      "all_search_functions": true,
      "unlimited_favorites": true,
      "unlimited_daily_view": true,
      "email_notifications": true,
      "daily_tender_limit": 999999
    }),
    is_active: 1
  }
];

// Test users with different subscription plans
const testUsers = [
  // FREE PLAN USERS
  {
    username: 'free_user1',
    email: 'free1@example.com',
    password: 'FreePass123!',
    full_name: 'Free User One',
    role: 'user',
    company_name: 'Free Company 1',
    telpon: '+62 811 11111111',
    is_active: 1,
    email_verified: 1,
    subscription_plan: 'free'
  },
  {
    username: 'free_user2',
    email: 'free2@example.com',
    password: 'FreePass456!',
    full_name: 'Free User Two',
    role: 'user',
    company_name: 'Free Company 2',
    telpon: '+62 811 22222222',
    is_active: 1,
    email_verified: 1,
    subscription_plan: 'free'
  },

  // 3-MONTH PREMIUM USERS
  {
    username: 'premium3_user1',
    email: 'premium3_1@example.com',
    password: 'Premium3Pass123!',
    full_name: 'Premium 3M User One',
    role: 'user',
    company_name: 'Premium 3M Company 1',
    telpon: '+62 812 33333333',
    is_active: 1,
    email_verified: 1,
    subscription_plan: 'premium_3month'
  },
  {
    username: 'premium3_user2',
    email: 'premium3_2@example.com',
    password: 'Premium3Pass456!',
    full_name: 'Premium 3M User Two',
    role: 'user',
    company_name: 'Premium 3M Company 2',
    telpon: '+62 812 44444444',
    is_active: 1,
    email_verified: 1,
    subscription_plan: 'premium_3month'
  },

  // 12-MONTH PREMIUM USERS
  {
    username: 'premium12_user1',
    email: 'premium12_1@example.com',
    password: 'Premium12Pass123!',
    full_name: 'Premium 12M User One',
    role: 'user',
    company_name: 'Premium 12M Company 1',
    telpon: '+62 813 55555555',
    is_active: 1,
    email_verified: 1,
    subscription_plan: 'premium_12month'
  },
  {
    username: 'premium12_user2',
    email: 'premium12_2@example.com',
    password: 'Premium12Pass456!',
    full_name: 'Premium 12M User Two',
    role: 'user',
    company_name: 'Premium 12M Company 2',
    telpon: '+62 813 66666666',
    is_active: 1,
    email_verified: 1,
    subscription_plan: 'premium_12month'
  },

  // ADMIN USERS (no subscription needed)
  {
    username: 'admin',
    email: 'admin@dashboard.com',
    password: 'Admin123!',
    full_name: 'System Administrator',
    role: 'admin',
    company_name: 'Dashboard Corp',
    telpon: '+62 814 77777777',
    is_active: 1,
    email_verified: 1,
    subscription_plan: null
  }
];

async function generateUsersWithSubscriptions() {
  console.log('-- Setup Subscription Plans and Test Users for Next.js Dashboard');
  console.log('-- Generated with properly hashed passwords using bcrypt');
  console.log('-- Run this script after setting up your database\n');

  // First, insert subscription plans
  console.log('-- Step 1: Insert Subscription Plans');
  console.log('INSERT INTO `subscription_plans` (`plan_id`, `plan_name`, `plan_display_name`, `duration_months`, `price`, `max_favorites`, `max_daily_views`, `features`, `is_active`) VALUES');
  
  for (let i = 0; i < subscriptionPlans.length; i++) {
    const plan = subscriptionPlans[i];
    const isLast = i === subscriptionPlans.length - 1;
    console.log(`(${plan.plan_id}, '${plan.plan_name}', '${plan.plan_display_name}', ${plan.duration_months}, ${plan.price}, ${plan.max_favorites}, ${plan.max_daily_views}, '${plan.features}', ${plan.is_active})${isLast ? ';' : ','}`);
  }
  console.log('');

  // Then, insert users
  console.log('-- Step 2: Insert Test Users');
  for (const user of testUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    console.log(`INSERT INTO \`users\` (\`username\`, \`email\`, \`password\`, \`full_name\`, \`nama\`, \`role\`, \`company_name\`, \`telpon\`, \`is_active\`, \`email_verified\`) VALUES`);
    console.log(`('${user.username}', '${user.email}', '${hashedPassword}', '${user.full_name}', '${user.full_name}', '${user.role}', '${user.company_name}', '${user.telpon}', ${user.is_active}, ${user.email_verified});`);
    console.log('');
  }

  // Finally, create user subscriptions for non-admin users
  console.log('-- Step 3: Create User Subscriptions');
  console.log('-- Note: You need to get the user_id from the users table first');
  console.log('-- Then insert into user_subscriptions table\n');

  const subscriptionQueries = [];
  for (const user of testUsers) {
    if (user.subscription_plan && user.role === 'user') {
      const plan = subscriptionPlans.find(p => p.plan_name === user.subscription_plan);
      if (plan) {
        const startDate = new Date().toISOString().split('T')[0];
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + plan.duration_months);
        const endDateStr = endDate.toISOString().split('T')[0];

        subscriptionQueries.push({
          email: user.email,
          plan_name: plan.plan_name,
          start_date: startDate,
          end_date: endDateStr,
          price: plan.price
        });
      }
    }
  }

  console.log('-- Example subscription queries (replace USER_ID with actual user_id from users table):');
  for (const sub of subscriptionQueries) {
    console.log(`-- For user: ${sub.email}`);
    console.log(`INSERT INTO \`user_subscriptions\` (\`user_id\`, \`plan_id\`, \`start_date\`, \`end_date\`, \`is_active\`, \`auto_renew\`) VALUES`);
    console.log(`((SELECT user_id FROM users WHERE email = '${sub.email}'), (SELECT plan_id FROM subscription_plans WHERE plan_name = '${sub.plan_name}'), '${sub.start_date}', '${sub.end_date}', 1, 0);`);
    console.log('');
  }

  // Summary
  console.log('-- SUMMARY OF TEST USERS BY SUBSCRIPTION PLAN');
  console.log('-- ===========================================');
  console.log('');
  console.log('🆓 FREE PLAN USERS:');
  testUsers.filter(u => u.subscription_plan === 'free').forEach(u => {
    console.log(`   Email: ${u.email} | Password: ${u.password} | Company: ${u.company_name}`);
  });
  console.log('');
  console.log('💎 3-MONTH PREMIUM USERS:');
  testUsers.filter(u => u.subscription_plan === 'premium_3month').forEach(u => {
    console.log(`   Email: ${u.email} | Password: ${u.password} | Company: ${u.company_name}`);
  });
  console.log('');
  console.log('👑 12-MONTH PREMIUM USERS:');
  testUsers.filter(u => u.subscription_plan === 'premium_12month').forEach(u => {
    console.log(`   Email: ${u.email} | Password: ${u.password} | Company: ${u.company_name}`);
  });
  console.log('');
  console.log('🔧 ADMIN USERS:');
  testUsers.filter(u => u.role === 'admin').forEach(u => {
    console.log(`   Email: ${u.email} | Password: ${u.password} | Company: ${u.company_name}`);
  });
  console.log('');
  console.log('-- Verification Queries');
  console.log('SELECT * FROM subscription_plans ORDER BY plan_id;');
  console.log('SELECT u.username, u.email, u.full_name, sp.plan_display_name, us.start_date, us.end_date, us.is_active');
  console.log('FROM users u');
  console.log('LEFT JOIN user_subscriptions us ON u.user_id = us.user_id');
  console.log('LEFT JOIN subscription_plans sp ON us.plan_id = sp.plan_id');
  console.log('WHERE u.email IN (');
  const emails = testUsers.map(u => `    '${u.email}'`).join(',\n');
  console.log(emails);
  console.log(') ORDER BY sp.plan_id, u.username;');
}

// Run the function
generateUsersWithSubscriptions().catch(console.error);
