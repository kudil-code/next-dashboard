// Simple script to add just one test user
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function addSimpleUser() {
  let connection;
  
  try {
    // Try different possible database configurations
    const configs = [
      { host: 'localhost', user: 'root', password: '', database: 'data_crud_v1', port: 3306 },
      { host: 'localhost', user: 'root', password: '', database: 'tender_management', port: 3306 },
      { host: 'localhost', user: 'root', password: '', database: 'crud_api_db', port: 3306 }
    ];
    
    for (const config of configs) {
      try {
        console.log(`Trying database: ${config.database}`);
        connection = await mysql.createConnection(config);
        
        // Check if users table exists
        const [tables] = await connection.execute('SHOW TABLES LIKE "users"');
        if (tables.length === 0) {
          console.log(`   No users table in ${config.database}`);
          await connection.end();
          continue;
        }
        
        // Count existing users
        const [count] = await connection.execute('SELECT COUNT(*) as total FROM users');
        console.log(`   Found ${count[0].total} users in ${config.database}`);
        
        // Add a simple test user
        const hashedPassword = await bcrypt.hash('TestPass123!', 10);
        
        await connection.execute(
          `INSERT INTO users (username, email, password, full_name, nama, role, company_name, is_active, email_verified) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          ['testuser', 'test@example.com', hashedPassword, 'Test User', 'Test User', 'user', 'Test Company', 1, 1]
        );
        
        console.log(`   ✅ Added test user to ${config.database}`);
        
        // Show all users
        const [users] = await connection.execute('SELECT user_id, username, email, full_name FROM users ORDER BY user_id');
        console.log(`   Users in ${config.database}:`);
        users.forEach(user => {
          console.log(`     ID: ${user.user_id} | ${user.username} | ${user.email} | ${user.full_name}`);
        });
        
        await connection.end();
        break;
        
      } catch (error) {
        console.log(`   ❌ Error with ${config.database}: ${error.message}`);
        if (connection) {
          await connection.end();
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
}

addSimpleUser().catch(console.error);
