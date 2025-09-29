# Test Users and Passwords for Next.js Dashboard

This document contains a comprehensive list of test users for the Next.js dashboard application with different roles and scenarios.

## Test User Credentials

### Admin Users
| Username | Email | Password | Full Name | Role | Company | Phone | Description |
|----------|-------|----------|-----------|------|---------|-------|-------------|
| admin | admin@dashboard.com | Admin123! | System Administrator | admin | Dashboard Corp | +62 812 12345678 | Main admin user |
| superadmin | superadmin@dashboard.com | SuperAdmin456! | Super Administrator | admin | Tech Solutions | +62 813 23456789 | Super admin with full access |

### Regular Users
| Username | Email | Password | Full Name | Role | Company | Phone | Description |
|----------|-------|----------|-----------|------|---------|-------|-------------|
| john_doe | john.doe@example.com | Password123! | John Doe | user | ABC Company | +62 814 34567890 | Standard user account |
| jane_smith | jane.smith@example.com | SecurePass456! | Jane Smith | user | XYZ Corp | +62 815 45678901 | Regular user with company |
| mike_wilson | mike.wilson@test.com | TestPass789! | Mike Wilson | user | Test Industries | +62 816 56789012 | Test user account |
| sarah_jones | sarah.jones@demo.com | DemoPass123! | Sarah Jones | user | Demo Company | +62 817 67890123 | Demo user account |
| alex_brown | alex.brown@sample.com | SamplePass456! | Alex Brown | user | Sample Corp | +62 818 78901234 | Sample user account |

### Test Scenarios
| Username | Email | Password | Full Name | Role | Company | Phone | Description |
|----------|-------|----------|-----------|------|---------|-------|-------------|
| test_user1 | test1@example.com | Test123! | Test User One | user | Test Company 1 | +62 819 89012345 | Basic test user |
| test_user2 | test2@example.com | Test456! | Test User Two | user | Test Company 2 | +62 820 90123456 | Another test user |
| demo_user | demo@example.com | Demo123! | Demo User | user | Demo Corp | +62 821 01234567 | Demo account |
| sample_user | sample@example.com | Sample123! | Sample User | user | Sample Inc | +62 822 12345678 | Sample account |

### Edge Case Users
| Username | Email | Password | Full Name | Role | Company | Phone | Description |
|----------|-------|----------|-----------|------|---------|-------|-------------|
| long_username_test | long.username.test@example.com | LongPass123! | Long Username Test User | user | Long Company Name Corporation | +62 823 23456789 | Tests long username handling |
| special_chars | special.chars@example.com | Special123! | Special Chars User | user | Special & Co. | +62 824 34567890 | Tests special character handling |
| unicode_user | unicode@example.com | Unicode123! | Ünicode Üser | user | Ünicode Corp | +62 825 45678901 | Tests Unicode character support |

## Password Requirements

All passwords follow these requirements:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)

## Usage Instructions

### 1. Manual Registration
You can use these credentials to manually register users through the signup form at `/signup`.

### 2. Direct Database Insertion
Use the provided SQL script to insert these users directly into the database.

### 3. API Testing
Use these credentials to test the authentication endpoints:
- `POST /api/auth/register` - Register new users
- `POST /api/auth/login` - Login existing users

## Security Notes

⚠️ **IMPORTANT**: These are test credentials only. Do not use these passwords in production environments.

- All passwords are hashed using bcrypt with salt rounds of 10
- JWT tokens expire after 24 hours
- Users are created with `is_active = 1` by default
- Email verification is set to `email_verified = 0` by default

## Testing Scenarios

### Authentication Testing
1. **Valid Login**: Use any user credentials from the table above
2. **Invalid Email**: Try logging in with non-existent email
3. **Invalid Password**: Try logging in with wrong password
4. **Empty Fields**: Test with empty email/password fields

### User Management Testing
1. **Profile Updates**: Test updating user profiles
2. **Password Changes**: Test password change functionality
3. **Account Deletion**: Test account deletion (use test accounts only)

### Role-Based Testing
1. **Admin Access**: Test admin-only features with admin users
2. **User Access**: Test regular user features with standard users
3. **Permission Checks**: Verify role-based access controls

## Database Schema Reference

The users table structure:
```sql
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `nama` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telpon` varchar(20) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `email_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
);
```

## Quick Start

1. Choose a user from the table above
2. Navigate to `/login` in your application
3. Enter the email and password
4. Test the dashboard functionality

For registration testing, use `/signup` with any of the provided user details.
