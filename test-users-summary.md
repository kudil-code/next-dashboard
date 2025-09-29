# Test Users Summary - Next.js Dashboard

## Quick Reference - Login Credentials

### 🔑 Admin Users
| Email | Password | Role |
|-------|----------|------|
| admin@dashboard.com | Admin123! | admin |
| superadmin@dashboard.com | SuperAdmin456! | admin |

### 👤 Regular Users
| Email | Password | Role |
|-------|----------|------|
| john.doe@example.com | Password123! | user |
| jane.smith@example.com | SecurePass456! | user |
| mike.wilson@test.com | TestPass789! | user |
| sarah.jones@demo.com | DemoPass123! | user |
| alex.brown@sample.com | SamplePass456! | user |

### 🧪 Test Users
| Email | Password | Role |
|-------|----------|------|
| test1@example.com | Test123! | user |
| test2@example.com | Test456! | user |
| demo@example.com | Demo123! | user |
| sample@example.com | Sample123! | user |

### 🔍 Edge Case Users
| Email | Password | Role |
|-------|----------|------|
| long.username.test@example.com | LongPass123! | user |
| special.chars@example.com | Special123! | user |
| unicode@example.com | Unicode123! | user |

## 🚀 Quick Start Testing

### 1. Login Testing
1. Go to `/login` in your application
2. Use any email/password combination from the table above
3. Test both admin and user roles

### 2. Registration Testing
1. Go to `/signup` in your application
2. Use any of the user details from the full documentation
3. Test form validation and user creation

### 3. API Testing
Use these endpoints with the credentials above:
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user
- `GET /api/users/profile` - Get user profile (requires auth)

## 📁 Files Created

1. **`test-users.md`** - Complete documentation with all user details
2. **`insert-test-users.sql`** - SQL script with placeholder hashes
3. **`generate-test-users.js`** - Node.js script to generate proper bcrypt hashes
4. **`test-users-summary.md`** - This quick reference file

## 🔧 Setup Instructions

### Option 1: Use Generated SQL (Recommended)
1. Run the generated SQL from the terminal output above
2. Copy the INSERT statements and run them in your MySQL database

### Option 2: Manual Registration
1. Use the signup form with any of the user details
2. All passwords follow the required format

### Option 3: API Registration
1. Use the registration API endpoint with the user data
2. Passwords will be automatically hashed

## ⚠️ Security Notes

- These are **TEST CREDENTIALS ONLY**
- Do not use in production environments
- All passwords are properly hashed using bcrypt
- JWT tokens expire after 24 hours

## 🎯 Testing Scenarios

### Authentication Flow
- ✅ Valid login with correct credentials
- ❌ Invalid email/password combinations
- ❌ Empty form fields
- ✅ Password visibility toggle
- ✅ Form validation

### User Management
- ✅ Profile updates
- ✅ Password changes
- ✅ Account deletion (test accounts only)

### Role-Based Access
- ✅ Admin-only features with admin users
- ✅ User-only features with regular users
- ✅ Permission checks and access controls

---

**Need more details?** Check `test-users.md` for complete documentation with all user information, company details, and phone numbers.
