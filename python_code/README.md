# Python CRUD API Test Suite

Comprehensive Python test suite for the Simple CRUD API. Tests all CRUD operations for Paket, User, and Favorites functionality.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Make Sure API Server is Running
```bash
# In the SIMPLE_CRUD_API directory
npm start
# or
node server.js
```

### 3. Run Tests

#### Interactive Mode (Recommended)
The test suite will ask you for server details:
```bash
python test_all_crud.py
```
Then follow the prompts to enter your server port and host.

#### Command Line Arguments
You can also specify the server directly:
```bash
# Test server on port 3000
python test_all_crud.py 3000

# Test server on port 3002 with custom host
python test_all_crud.py 3002 localhost

# Test server on different host and port
python test_all_crud.py 8080 192.168.1.100
```

#### Run Individual Test Suites
```bash
# Test Paket CRUD operations
python test_paket_crud.py

# Test User CRUD operations  
python test_user_crud.py

# Test Favorites CRUD operations
python test_favorites_crud.py
```

#### Using Batch Files (Windows)
```bash
# Interactive test suite
start_and_test.bat

# Start API server
start_server.bat
```

## 📋 Test Coverage

### 🏥 Health & Documentation
- ✅ Server health check
- ✅ API documentation endpoint

### 👤 User Management
- ✅ User registration
- ✅ User login with JWT tokens
- ✅ Get user profile
- ✅ Update user profile
- ✅ Change password
- ✅ Delete user account
- ✅ Authentication validation

### 📦 Paket CRUD
- ✅ Get all paket (with search)
- ✅ Get paket by ID
- ✅ Create new paket
- ✅ Update paket
- ✅ Delete paket
- ✅ Search functionality
- ✅ Error handling (404, validation)

### ⭐ User Favorites
- ✅ Get all favorites
- ✅ Add paket to favorites
- ✅ Remove from favorites
- ✅ Check favorite status
- ✅ Get favorites statistics
- ✅ Clear all favorites
- ✅ Duplicate prevention
- ✅ Non-existent paket handling

## 🎯 Test Features

### 🔍 Comprehensive Testing
- **100+ individual test cases**
- **Complete CRUD cycle testing**
- **Error condition testing**
- **Authentication flow testing**
- **Data integrity validation**

### 🎨 Beautiful Output
- **Colored terminal output**
- **Progress indicators**
- **Detailed success/failure reporting**
- **Comprehensive test summaries**

### 📊 Statistics & Analytics
- **Pass/fail ratios**
- **Success rate calculations**
- **Individual test suite results**
- **Overall API health assessment**

## 🛠️ API Client Features

The `api_client.py` provides a complete Python client with:

### 🔐 Authentication
- Automatic JWT token management
- Session persistence
- Token refresh handling

### 📡 HTTP Operations
- RESTful API calls
- Error handling
- Request/response logging
- Timeout management

### 🎯 CRUD Operations
- All CRUD operations for each entity
- Search and filtering
- Statistics and analytics
- Bulk operations

## 📁 File Structure

```
python_code/
├── api_client.py          # Main API client
├── test_paket_crud.py     # Paket CRUD tests
├── test_user_crud.py      # User CRUD tests
├── test_favorites_crud.py # Favorites CRUD tests
├── test_all_crud.py       # Complete test suite
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## 🔧 Configuration

### API Base URL
The test suite now supports flexible server configuration:

#### Interactive Configuration
When you run `python test_all_crud.py`, it will ask you for:
- Server port (default: 3001)
- Server host (default: localhost)

#### Command Line Configuration
```bash
# Just port (uses localhost)
python test_all_crud.py 3000

# Port and host
python test_all_crud.py 3002 localhost

# Custom server
python test_all_crud.py 8080 192.168.1.100
```

#### Programmatic Configuration
```python
# Create client with specific URL
client = SimpleCRUDAPIClient("http://localhost:3000")

# Create client with interactive prompts
client = SimpleCRUDAPIClient()  # Will ask for server details
```

### Test Data
Tests use unique timestamps to avoid conflicts:
- Usernames: `pythontest_{timestamp}`
- Emails: `pythontest_{timestamp}@example.com`
- Paket codes: `PTP001`, etc.

## 📊 Expected Results

When all tests pass, you should see:

```
🎉 ALL TESTS PASSED! 🎉
Your Simple CRUD API is working perfectly!
All CRUD operations are functional and tested.

📊 Overall Results:
   ✅ Total Passed: 30+/30+
   ❌ Total Failed: 0/30+
   📈 Overall Success Rate: 100%
```

## 🐛 Troubleshooting

### API Connection Issues
```
❌ Cannot connect to API: Connection refused
💡 Make sure your server is running on http://localhost:3001
```

**Solutions:**
1. Start the API server: `npm start` or `node server.js`
2. Check if the port is available and correct
3. Use the interactive mode to specify the correct server details
4. Try different ports (3000, 3001, 3002, 8080, etc.)

### Authentication Issues
```
❌ User Login: FAILED
```

**Solutions:**
1. Check if database is properly set up
2. Verify user credentials
3. Check JWT secret configuration

### Database Issues
```
❌ Create Paket: FAILED
```

**Solutions:**
1. Run database setup: `node setup-database.js`
2. Check MySQL connection
3. Verify table structure

## 🎉 Benefits

### ✅ Complete Test Coverage
- Tests every API endpoint
- Validates all CRUD operations
- Checks error conditions
- Verifies data integrity

### ✅ Easy to Use
- Simple command-line execution
- Clear, colored output
- Comprehensive documentation
- No complex setup required

### ✅ Production Ready
- Handles real-world scenarios
- Tests authentication flows
- Validates security measures
- Checks performance characteristics

## 🔗 Integration

This test suite can be integrated into:
- **CI/CD pipelines**
- **Automated testing workflows**
- **Development testing**
- **Production validation**
- **API documentation validation**

## 📝 Notes

- Tests create temporary users and data
- All test data is cleaned up automatically
- Tests are designed to be run multiple times
- No external dependencies beyond the API
- Compatible with Python 3.6+
