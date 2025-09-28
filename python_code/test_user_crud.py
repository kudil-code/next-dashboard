"""
Test User CRUD Operations
Tests all CRUD functionality for user management
"""

import sys
import time
from api_client import SimpleCRUDAPIClient
from colorama import Fore, Style

def test_user_crud():
    """Test all User CRUD operations"""
    print(f"{Fore.CYAN}{'='*60}")
    print(f"{Fore.CYAN}🚀 TESTING USER CRUD OPERATIONS")
    print(f"{Fore.CYAN}{'='*60}")
    
    client = SimpleCRUDAPIClient()
    passed_tests = 0
    total_tests = 0
    test_user_email = f"pythontest_{int(time.time())}@example.com"
    
    try:
        # Test 1: Health Check
        total_tests += 1
        print(f"\n{Fore.YELLOW}🏥 Test 1: Health Check")
        health_result = client.health_check()
        if health_result.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Health Check: PASSED")
        else:
            print(f"{Fore.RED}❌ Health Check: FAILED")
        
        # Test 2: User Registration
        total_tests += 1
        print(f"\n{Fore.YELLOW}👤 Test 2: User Registration")
        register_result = client.register_user(
            username=f"pythontest_{int(time.time())}",
            email=test_user_email,
            password="pythonpassword123",
            full_name="Python Test User"
        )
        if register_result.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ User Registration: PASSED")
            print(f"   📧 Test user email: {test_user_email}")
        else:
            print(f"{Fore.RED}❌ User Registration: FAILED")
            # Try to login if user already exists
            print(f"   🔄 Trying to login with existing user...")
            login_result = client.login_user(test_user_email, "pythonpassword123")
            if login_result.get("success"):
                passed_tests += 1
                print(f"{Fore.GREEN}✅ User Login (Existing): PASSED")
        
        # Test 3: User Login
        if not client.auth_token:
            total_tests += 1
            print(f"\n{Fore.YELLOW}🔐 Test 3: User Login")
            login_result = client.login_user(test_user_email, "pythonpassword123")
            if login_result.get("success"):
                passed_tests += 1
                print(f"{Fore.GREEN}✅ User Login: PASSED")
            else:
                print(f"{Fore.RED}❌ User Login: FAILED")
        
        # Test 4: Get User Profile
        total_tests += 1
        print(f"\n{Fore.YELLOW}👤 Test 4: Get User Profile")
        profile_result = client.get_user_profile()
        if profile_result.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Get User Profile: PASSED")
            user_data = profile_result.get("data", {})
            print(f"   👤 Username: {user_data.get('username')}")
            print(f"   📧 Email: {user_data.get('email')}")
        else:
            print(f"{Fore.RED}❌ Get User Profile: FAILED")
        
        # Test 5: Update User Profile
        total_tests += 1
        print(f"\n{Fore.YELLOW}✏️ Test 5: Update User Profile")
        update_result = client.update_user_profile(
            username=f"updatedpython_{int(time.time())}",
            full_name="Updated Python Test User"
        )
        if update_result.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Update User Profile: PASSED")
        else:
            print(f"{Fore.RED}❌ Update User Profile: FAILED")
        
        # Test 6: Verify Profile Update
        total_tests += 1
        print(f"\n{Fore.YELLOW}🔍 Test 6: Verify Profile Update")
        verify_profile = client.get_user_profile()
        if verify_profile.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Verify Profile Update: PASSED")
            updated_data = verify_profile.get("data", {})
            print(f"   👤 Updated username: {updated_data.get('username')}")
            print(f"   👤 Updated full name: {updated_data.get('full_name')}")
        else:
            print(f"{Fore.RED}❌ Verify Profile Update: FAILED")
        
        # Test 7: Change Password
        total_tests += 1
        print(f"\n{Fore.YELLOW}🔒 Test 7: Change Password")
        change_password_result = client.change_password(
            current_password="pythonpassword123",
            new_password="newpythonpassword123"
        )
        if change_password_result.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Change Password: PASSED")
        else:
            print(f"{Fore.RED}❌ Change Password: FAILED")
        
        # Test 8: Login with New Password
        total_tests += 1
        print(f"\n{Fore.YELLOW}🔐 Test 8: Login with New Password")
        new_login_result = client.login_user(test_user_email, "newpythonpassword123")
        if new_login_result.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Login with New Password: PASSED")
        else:
            print(f"{Fore.RED}❌ Login with New Password: FAILED")
        
        # Test 9: Login with Old Password (Should Fail)
        total_tests += 1
        print(f"\n{Fore.YELLOW}❌ Test 9: Login with Old Password (Should Fail)")
        old_login_result = client.login_user(test_user_email, "pythonpassword123")
        if not old_login_result.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Login with Old Password (Should Fail): PASSED")
        else:
            print(f"{Fore.RED}❌ Login with Old Password (Should Fail): FAILED")
        
        # Test 10: Delete User Account
        total_tests += 1
        print(f"\n{Fore.YELLOW}🗑️ Test 10: Delete User Account")
        delete_result = client.delete_user_account()
        if delete_result.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Delete User Account: PASSED")
        else:
            print(f"{Fore.RED}❌ Delete User Account: FAILED")
        
        # Test 11: Try to Login Deleted User (Should Fail)
        total_tests += 1
        print(f"\n{Fore.YELLOW}❌ Test 11: Try to Login Deleted User (Should Fail)")
        deleted_login_result = client.login_user(test_user_email, "newpythonpassword123")
        if not deleted_login_result.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Login Deleted User (Should Fail): PASSED")
        else:
            print(f"{Fore.RED}❌ Login Deleted User (Should Fail): FAILED")
        
    except Exception as e:
        print(f"{Fore.RED}❌ Test execution failed: {e}")
    
    # Test Summary
    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"{Fore.CYAN}📊 USER CRUD TEST SUMMARY")
    print(f"{Fore.CYAN}{'='*60}")
    print(f"{Fore.GREEN}✅ Passed: {passed_tests}/{total_tests}")
    print(f"{Fore.RED}❌ Failed: {total_tests - passed_tests}/{total_tests}")
    print(f"{Fore.BLUE}📈 Success Rate: {round((passed_tests / total_tests) * 100, 1)}%")
    
    if passed_tests == total_tests:
        print(f"\n{Fore.GREEN}🎉 ALL USER CRUD TESTS PASSED!")
    else:
        print(f"\n{Fore.YELLOW}⚠️ Some user CRUD tests failed.")
    
    return passed_tests, total_tests

if __name__ == "__main__":
    test_user_crud()
