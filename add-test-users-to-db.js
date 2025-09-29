// Script to add test users to the database
// Run this with: node add-test-users-to-db.js

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Database configuration (same as your app)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'data_crud_v1',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Subscription plans based on your 3-tier requirements
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
    price: 150000.00,
    max_favorites: 999999,
    max_daily_views: 999999,
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
    price: 500000.00,
    max_favorites: 999999,
    max_daily_views: 999999,
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

// Test users
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
  // ADMIN USER
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

async function addTestUsersToDatabase() {
  let connection;
  
  try {
    console.log('🚀 Starting Database Setup...');
    console.log('=====================================');
    
    // Connect to database
    console.log('📡 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected successfully!');
    
    // Step 1: Insert subscription plans
    console.log('\n📋 Step 1: Setting up subscription plans...');
    
    for (const plan of subscriptionPlans) {
      try {
        // Check if plan already exists
        const [existing] = await connection.execute(
          'SELECT plan_id FROM subscription_plans WHERE plan_name = ?',
          [plan.plan_name]
        );
        
        if (existing.length > 0) {
          console.log(`   ⚠️  Plan '${plan.plan_name}' already exists, skipping...`);
          continue;
        }
        
        await connection.execute(
          `INSERT INTO subscription_plans (plan_id, plan_name, plan_display_name, duration_months, price, max_favorites, max_daily_views, features, is_active) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [plan.plan_id, plan.plan_name, plan.plan_display_name, plan.duration_months, plan.price, plan.max_favorites, plan.max_daily_views, plan.features, plan.is_active]
        );
        
        console.log(`   ✅ Added plan: ${plan.plan_display_name}`);
      } catch (error) {
        console.log(`   ❌ Error adding plan '${plan.plan_name}':`, error.message);
      }
    }
    
    // Step 2: Insert users
    console.log('\n👥 Step 2: Adding test users...');
    
    const addedUsers = [];
    for (const user of testUsers) {
      try {
        // Check if user already exists
        const [existing] = await connection.execute(
          'SELECT user_id FROM users WHERE email = ?',
          [user.email]
        );
        
        if (existing.length > 0) {
          console.log(`   ⚠️  User '${user.email}' already exists, skipping...`);
          continue;
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        // Insert user
        const [result] = await connection.execute(
          `INSERT INTO users (username, email, password, full_name, nama, role, company_name, telpon, is_active, email_verified) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [user.username, user.email, hashedPassword, user.full_name, user.full_name, user.role, user.company_name, user.telpon, user.is_active, user.email_verified]
        );
        
        const userId = result.insertId;
        addedUsers.push({ ...user, user_id: userId });
        console.log(`   ✅ Added user: ${user.email} (ID: ${userId})`);
        
      } catch (error) {
        console.log(`   ❌ Error adding user '${user.email}':`, error.message);
      }
    }
    
    // Step 3: Create user subscriptions
    console.log('\n💳 Step 3: Setting up user subscriptions...');
    
    for (const user of addedUsers) {
      if (user.subscription_plan && user.role === 'user') {
        try {
          // Check if subscription already exists
          const [existing] = await connection.execute(
            'SELECT id FROM user_subscriptions WHERE user_id = ?',
            [user.user_id]
          );
          
          if (existing.length > 0) {
            console.log(`   ⚠️  Subscription for user '${user.email}' already exists, skipping...`);
            continue;
          }
          
          const plan = subscriptionPlans.find(p => p.plan_name === user.subscription_plan);
          if (plan) {
            const startDate = new Date().toISOString().split('T')[0];
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + plan.duration_months);
            const endDateStr = endDate.toISOString().split('T')[0];
            
            await connection.execute(
              `INSERT INTO user_subscriptions (user_id, plan_id, start_date, end_date, is_active, auto_renew) 
               VALUES (?, ?, ?, ?, 1, 0)`,
              [user.user_id, plan.plan_id, startDate, endDateStr]
            );
            
            console.log(`   ✅ Added subscription for: ${user.email} (${plan.plan_display_name})`);
          }
        } catch (error) {
          console.log(`   ❌ Error adding subscription for '${user.email}':`, error.message);
        }
      }
    }
    
    // Step 4: Generate report
    console.log('\n📊 Step 4: Generating report...');
    
    // Get subscription plans
    const [plans] = await connection.execute('SELECT * FROM subscription_plans ORDER BY plan_id');
    console.log('\n📋 SUBSCRIPTION PLANS:');
    console.log('======================');
    plans.forEach(plan => {
      console.log(`ID: ${plan.plan_id} | ${plan.plan_display_name} | Price: ${plan.price} IDR | Duration: ${plan.duration_months} months`);
    });
    
    // Get users with their subscriptions
    const [usersWithSubs] = await connection.execute(`
      SELECT u.user_id, u.username, u.email, u.full_name, u.role, u.company_name, 
             sp.plan_display_name, us.start_date, us.end_date, us.is_active as sub_active
      FROM users u
      LEFT JOIN user_subscriptions us ON u.user_id = us.user_id
      LEFT JOIN subscription_plans sp ON us.plan_id = sp.plan_id
      WHERE u.email IN (${testUsers.map(() => '?').join(',')})
      ORDER BY sp.plan_id, u.username
    `, testUsers.map(u => u.email));
    
    console.log('\n👥 TEST USERS:');
    console.log('===============');
    
    const freeUsers = usersWithSubs.filter(u => u.plan_display_name === 'Free Plan');
    const premium3Users = usersWithSubs.filter(u => u.plan_display_name === 'Premium 3 Months');
    const premium12Users = usersWithSubs.filter(u => u.plan_display_name === 'Premium 12 Months');
    const adminUsers = usersWithSubs.filter(u => u.role === 'admin');
    
    if (freeUsers.length > 0) {
      console.log('\n🆓 FREE PLAN USERS:');
      freeUsers.forEach(user => {
        console.log(`   Email: ${user.email} | Password: ${testUsers.find(u => u.email === user.email)?.password} | Company: ${user.company_name}`);
      });
    }
    
    if (premium3Users.length > 0) {
      console.log('\n💎 3-MONTH PREMIUM USERS:');
      premium3Users.forEach(user => {
        console.log(`   Email: ${user.email} | Password: ${testUsers.find(u => u.email === user.email)?.password} | Company: ${user.company_name}`);
      });
    }
    
    if (premium12Users.length > 0) {
      console.log('\n👑 12-MONTH PREMIUM USERS:');
      premium12Users.forEach(user => {
        console.log(`   Email: ${user.email} | Password: ${testUsers.find(u => u.email === user.email)?.password} | Company: ${user.company_name}`);
      });
    }
    
    if (adminUsers.length > 0) {
      console.log('\n🔧 ADMIN USERS:');
      adminUsers.forEach(user => {
        console.log(`   Email: ${user.email} | Password: ${testUsers.find(u => u.email === user.email)?.password} | Company: ${user.company_name}`);
      });
    }
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('=====================================');
    console.log('✅ You can now test your application with the users above');
    console.log('🌐 Your Next.js server should be running on http://localhost:3000');
    console.log('🔑 Use the login credentials above to test different subscription tiers');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('Full error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n📡 Database connection closed.');
    }
  }
}

// Run the function
addTestUsersToDatabase().catch(console.error);
