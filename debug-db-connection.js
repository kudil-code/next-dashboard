// Debug script to check what's actually in the database
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

async function debugDatabase() {
  let connection;
  
  try {
    console.log('🔍 DEBUGGING DATABASE CONNECTION...');
    console.log('=====================================');
    console.log('Database Config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port
    });
    
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully!');
    
    // Check what databases exist
    console.log('\n📋 Available databases:');
    const [databases] = await connection.execute('SHOW DATABASES');
    databases.forEach(db => {
      console.log(`   - ${db.Database}`);
    });
    
    // Check current database
    const [currentDb] = await connection.execute('SELECT DATABASE() as current_db');
    console.log(`\n🎯 Currently using database: ${currentDb[0].current_db}`);
    
    // Check if users table exists
    console.log('\n📊 Checking users table...');
    const [tables] = await connection.execute('SHOW TABLES LIKE "users"');
    if (tables.length > 0) {
      console.log('✅ Users table exists');
      
      // Get table structure
      const [structure] = await connection.execute('DESCRIBE users');
      console.log('\n📋 Users table structure:');
      structure.forEach(col => {
        console.log(`   ${col.Field} - ${col.Type} - ${col.Null} - ${col.Key} - ${col.Default}`);
      });
      
      // Count total users
      const [count] = await connection.execute('SELECT COUNT(*) as total FROM users');
      console.log(`\n👥 Total users in database: ${count[0].total}`);
      
      // Show all users
      const [users] = await connection.execute('SELECT user_id, username, email, full_name, role, created_at FROM users ORDER BY user_id');
      console.log('\n📋 All users in database:');
      users.forEach(user => {
        console.log(`   ID: ${user.user_id} | ${user.username} | ${user.email} | ${user.full_name} | ${user.role} | ${user.created_at}`);
      });
      
    } else {
      console.log('❌ Users table does not exist');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

debugDatabase().catch(console.error);
