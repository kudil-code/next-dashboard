// Script to check current database status
// Run this with: node check-db-status.js

const mysql = require('mysql2/promise');

// Database configuration
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

async function checkDatabaseStatus() {
  let connection;
  
  try {
    console.log('🔍 Checking Database Status...');
    console.log('==============================');
    
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected successfully!');
    
    // Check subscription plans
    console.log('\n📋 SUBSCRIPTION PLANS:');
    console.log('======================');
    const [plans] = await connection.execute('SELECT * FROM subscription_plans ORDER BY plan_id');
    plans.forEach(plan => {
      const features = JSON.parse(plan.features);
      console.log(`ID: ${plan.plan_id} | ${plan.plan_display_name}`);
      console.log(`   Price: ${plan.price} IDR | Duration: ${plan.duration_months} months`);
      console.log(`   Max Favorites: ${plan.max_favorites} | Max Daily Views: ${plan.max_daily_views}`);
      console.log(`   Features: ${Object.keys(features).filter(k => features[k]).join(', ')}`);
      console.log('');
    });
    
    // Check all users with their subscriptions
    console.log('👥 ALL USERS WITH SUBSCRIPTIONS:');
    console.log('================================');
    const [usersWithSubs] = await connection.execute(`
      SELECT u.user_id, u.username, u.email, u.full_name, u.role, u.company_name, u.is_active,
             sp.plan_display_name, us.start_date, us.end_date, us.is_active as sub_active
      FROM users u
      LEFT JOIN user_subscriptions us ON u.user_id = us.user_id
      LEFT JOIN subscription_plans sp ON us.plan_id = sp.plan_id
      ORDER BY u.role DESC, sp.plan_id, u.username
    `);
    
    let currentPlan = '';
    usersWithSubs.forEach(user => {
      const planDisplay = user.plan_display_name || 'No Subscription';
      if (planDisplay !== currentPlan) {
        currentPlan = planDisplay;
        console.log(`\n${getPlanIcon(planDisplay)} ${planDisplay.toUpperCase()}:`);
        console.log('─'.repeat(50));
      }
      
      const status = user.is_active ? '✅ Active' : '❌ Inactive';
      const subStatus = user.sub_active ? '✅ Active' : '❌ Inactive';
      console.log(`   ${user.email} | ${user.full_name} | ${user.company_name}`);
      console.log(`   User: ${status} | Subscription: ${subStatus}`);
      if (user.start_date && user.end_date) {
        console.log(`   Subscription: ${user.start_date} to ${user.end_date}`);
      }
      console.log('');
    });
    
    // Summary statistics
    console.log('📊 SUMMARY STATISTICS:');
    console.log('======================');
    console.log(`Total Users: ${usersWithSubs.length}`);
    console.log(`Active Users: ${usersWithSubs.filter(u => u.is_active).length}`);
    console.log(`Admin Users: ${usersWithSubs.filter(u => u.role === 'admin').length}`);
    console.log(`Free Users: ${usersWithSubs.filter(u => u.plan_display_name === 'Free Plan').length}`);
    console.log(`Premium 3M Users: ${usersWithSubs.filter(u => u.plan_display_name === '3 Month Premium').length}`);
    console.log(`Premium 12M Users: ${usersWithSubs.filter(u => u.plan_display_name === '12 Month Premium').length}`);
    
    console.log('\n🎉 Database status check completed!');
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

function getPlanIcon(planName) {
  switch (planName) {
    case 'Free Plan': return '🆓';
    case '3 Month Premium': return '💎';
    case '12 Month Premium': return '👑';
    default: return '🔧';
  }
}

// Run the function
checkDatabaseStatus().catch(console.error);
