// Script to generate test users with properly hashed passwords
// Run this with: node generate-test-users.js

const bcrypt = require('bcrypt');

// Test user data with plain text passwords
const testUsers = [
  // Admin Users
  {
    username: 'admin',
    email: 'admin@dashboard.com',
    password: 'Admin123!',
    full_name: 'System Administrator',
    role: 'admin',
    company_name: 'Dashboard Corp',
    telpon: '+62 812 12345678',
    is_active: 1,
    email_verified: 1
  },
  {
    username: 'superadmin',
    email: 'superadmin@dashboard.com',
    password: 'SuperAdmin456!',
    full_name: 'Super Administrator',
    role: 'admin',
    company_name: 'Tech Solutions',
    telpon: '+62 813 23456789',
    is_active: 1,
    email_verified: 1
  },
  // Regular Users
  {
    username: 'john_doe',
    email: 'john.doe@example.com',
    password: 'Password123!',
    full_name: 'John Doe',
    role: 'user',
    company_name: 'ABC Company',
    telpon: '+62 814 34567890',
    is_active: 1,
    email_verified: 1
  },
  {
    username: 'jane_smith',
    email: 'jane.smith@example.com',
    password: 'SecurePass456!',
    full_name: 'Jane Smith',
    role: 'user',
    company_name: 'XYZ Corp',
    telpon: '+62 815 45678901',
    is_active: 1,
    email_verified: 1
  },
  {
    username: 'mike_wilson',
    email: 'mike.wilson@test.com',
    password: 'TestPass789!',
    full_name: 'Mike Wilson',
    role: 'user',
    company_name: 'Test Industries',
    telpon: '+62 816 56789012',
    is_active: 1,
    email_verified: 1
  },
  {
    username: 'sarah_jones',
    email: 'sarah.jones@demo.com',
    password: 'DemoPass123!',
    full_name: 'Sarah Jones',
    role: 'user',
    company_name: 'Demo Company',
    telpon: '+62 817 67890123',
    is_active: 1,
    email_verified: 1
  },
  {
    username: 'alex_brown',
    email: 'alex.brown@sample.com',
    password: 'SamplePass456!',
    full_name: 'Alex Brown',
    role: 'user',
    company_name: 'Sample Corp',
    telpon: '+62 818 78901234',
    is_active: 1,
    email_verified: 1
  },
  // Test Scenario Users
  {
    username: 'test_user1',
    email: 'test1@example.com',
    password: 'Test123!',
    full_name: 'Test User One',
    role: 'user',
    company_name: 'Test Company 1',
    telpon: '+62 819 89012345',
    is_active: 1,
    email_verified: 0
  },
  {
    username: 'test_user2',
    email: 'test2@example.com',
    password: 'Test456!',
    full_name: 'Test User Two',
    role: 'user',
    company_name: 'Test Company 2',
    telpon: '+62 820 90123456',
    is_active: 1,
    email_verified: 0
  },
  {
    username: 'demo_user',
    email: 'demo@example.com',
    password: 'Demo123!',
    full_name: 'Demo User',
    role: 'user',
    company_name: 'Demo Corp',
    telpon: '+62 821 01234567',
    is_active: 1,
    email_verified: 0
  },
  {
    username: 'sample_user',
    email: 'sample@example.com',
    password: 'Sample123!',
    full_name: 'Sample User',
    role: 'user',
    company_name: 'Sample Inc',
    telpon: '+62 822 12345678',
    is_active: 1,
    email_verified: 0
  },
  // Edge Case Users
  {
    username: 'long_username_test',
    email: 'long.username.test@example.com',
    password: 'LongPass123!',
    full_name: 'Long Username Test User',
    role: 'user',
    company_name: 'Long Company Name Corporation',
    telpon: '+62 823 23456789',
    is_active: 1,
    email_verified: 0
  },
  {
    username: 'special_chars',
    email: 'special.chars@example.com',
    password: 'Special123!',
    full_name: 'Special Chars User',
    role: 'user',
    company_name: 'Special & Co.',
    telpon: '+62 824 34567890',
    is_active: 1,
    email_verified: 0
  },
  {
    username: 'unicode_user',
    email: 'unicode@example.com',
    password: 'Unicode123!',
    full_name: 'Ünicode Üser',
    role: 'user',
    company_name: 'Ünicode Corp',
    telpon: '+62 825 45678901',
    is_active: 1,
    email_verified: 0
  }
];

async function generateHashedUsers() {
  console.log('-- Insert Test Users for Next.js Dashboard');
  console.log('-- Generated with properly hashed passwords using bcrypt');
  console.log('-- Run this script after setting up your database\n');

  for (const user of testUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    console.log(`INSERT INTO \`users\` (\`username\`, \`email\`, \`password\`, \`full_name\`, \`nama\`, \`role\`, \`company_name\`, \`telpon\`, \`is_active\`, \`email_verified\`) VALUES`);
    console.log(`('${user.username}', '${user.email}', '${hashedPassword}', '${user.full_name}', '${user.full_name}', '${user.role}', '${user.company_name}', '${user.telpon}', ${user.is_active}, ${user.email_verified});`);
    console.log('');
  }

  console.log('-- Verification Query (run this to check if users were inserted correctly)');
  console.log('SELECT user_id, username, email, full_name, role, company_name, is_active, email_verified, created_at');
  console.log('FROM users');
  console.log('WHERE email IN (');
  
  const emails = testUsers.map(user => `    '${user.email}'`).join(',\n');
  console.log(emails);
  console.log(')');
  console.log('ORDER BY role DESC, username;');
}

// Run the function
generateHashedUsers().catch(console.error);
