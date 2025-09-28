"""
Test Favorites CRUD Operations
Tests all CRUD functionality for user favorites
"""

import sys
import time
from api_client import SimpleCRUDAPIClient
from colorama import Fore, Style

def test_favorites_crud():
    """Test all Favorites CRUD operations"""
    print(f"{Fore.CYAN}{'='*60}")
    print(f"{Fore.CYAN}🚀 TESTING FAVORITES CRUD OPERATIONS")
    print(f"{Fore.CYAN}{'='*60}")
    
    client = SimpleCRUDAPIClient()
    passed_tests = 0
    total_tests = 0
    test_user_email = f"favoritest_{int(time.time())}@example.com"
    sample_md5_hash = "032477c9bdd128dd1e1c3b3b7fe283f4"  # Real hash from DB
    sample_md5_hash_2 = "1366f6f446e18cd51b472f28fdc42b2d"  # Real hash from DB
    
    try:
        # Setup: Create test user and authenticate
        print(f"\n{Fore.YELLOW}🔧 Setup: Creating test user...")
        register_result = client.register_user(
            username=f"favoritest_{int(time.time())}",
            email=test_user_email,
            password="favoritepassword123",
            full_name="Favorites Test User"
        )
        
        if not register_result.get("success"):
            # Try to login if user exists
            login_result = client.login_user(test_user_email, "favoritepassword123")
            if not login_result.get("success"):
                print(f"{Fore.RED}❌ Cannot create or login test user")
                return 0, 1
        
        print(f"{Fore.GREEN}✅ Test user authenticated")
        
        # Test 1: Health Check
        total_tests += 1
        print(f"\n{Fore.YELLOW}🏥 Test 1: Health Check")
        health_result = client.health_check()
        if health_result.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Health Check: PASSED")
        else:
            print(f"{Fore.RED}❌ Health Check: FAILED")
        
        # Test 2: Get All Favorites (Initial - Should be Empty)
        total_tests += 1
        print(f"\n{Fore.YELLOW}📋 Test 2: Get All Favorites (Initial)")
        initial_favorites = client.get_all_favorites()
        if initial_favorites.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Get All Favorites: PASSED")
            initial_count = initial_favorites.get("count", 0)
            print(f"   📊 Initial favorites count: {initial_count}")
        else:
            print(f"{Fore.RED}❌ Get All Favorites: FAILED")
        
        # Test 3: Add Paket to Favorites
        total_tests += 1
        print(f"\n{Fore.YELLOW}➕ Test 3: Add Paket to Favorites")
        add_favorite_result = client.add_to_favorites(md5_hash=sample_md5_hash, notes="Test favorite")
        if add_favorite_result.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Add to Favorites: PASSED")
        else:
            print(f"{Fore.RED}❌ Add to Favorites: FAILED")
        
        # Test 4: Check Favorite Status
        total_tests += 1
        print(f"\n{Fore.YELLOW}🔍 Test 4: Check Favorite Status")
        check_favorite_result = client.check_favorite_status(md5_hash=sample_md5_hash)
        if check_favorite_result.get("success") and check_favorite_result.get("data", {}).get("is_favorite"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Check Favorite Status: PASSED")
        else:
            print(f"{Fore.RED}❌ Check Favorite Status: FAILED")
        
        # Test 5: Add Duplicate Favorite (Should Fail)
        total_tests += 1
        print(f"\n{Fore.YELLOW}⚠️ Test 5: Add Duplicate Favorite (Should Fail)")
        duplicate_favorite_result = client.add_to_favorites(md5_hash=sample_md5_hash)
        if not duplicate_favorite_result.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Add Duplicate Favorite (Should Fail): PASSED")
        else:
            print(f"{Fore.RED}❌ Add Duplicate Favorite (Should Fail): FAILED")
        
        # Test 6: Get Favorites Statistics
        total_tests += 1
        print(f"\n{Fore.YELLOW}📊 Test 6: Get Favorites Statistics")
        stats_result = client.get_favorites_stats()
        if stats_result.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Get Favorites Statistics: PASSED")
            stats_data = stats_result.get("data", {})
            print(f"   📊 Total favorites: {stats_data.get('total_favorites')}")
            print(f"   📊 Recent favorites: {stats_data.get('recent_favorites')}")
        else:
            print(f"{Fore.RED}❌ Get Favorites Statistics: FAILED")
        
        # Test 7: Add More Favorites
        total_tests += 1
        print(f"\n{Fore.YELLOW}➕ Test 7: Add More Favorites")
        add_more_result = client.add_to_favorites(md5_hash=sample_md5_hash_2, notes="Second test favorite")
        if add_more_result.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Add More Favorites: PASSED")
        else:
            print(f"{Fore.RED}❌ Add More Favorites: FAILED")
        
        # Test 8: Get All Favorites (After Adding)
        total_tests += 1
        print(f"\n{Fore.YELLOW}📋 Test 8: Get All Favorites (After Adding)")
        after_add_favorites = client.get_all_favorites()
        if after_add_favorites.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Get All Favorites (After Adding): PASSED")
            final_count = after_add_favorites.get("count", 0)
            print(f"   📊 Final favorites count: {final_count}")
        else:
            print(f"{Fore.RED}❌ Get All Favorites (After Adding): FAILED")
        
        # Test 9: Remove Specific Favorite
        total_tests += 1
        print(f"\n{Fore.YELLOW}🗑️ Test 9: Remove Specific Favorite")
        remove_favorite_result = client.remove_from_favorites(md5_hash=sample_md5_hash)
        if remove_favorite_result.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Remove Specific Favorite: PASSED")
        else:
            print(f"{Fore.RED}❌ Remove Specific Favorite: FAILED")
        
        # Test 10: Check Removed Favorite Status
        total_tests += 1
        print(f"\n{Fore.YELLOW}🔍 Test 10: Check Removed Favorite Status")
        check_removed_result = client.check_favorite_status(md5_hash=sample_md5_hash)
        if check_removed_result.get("success") and not check_removed_result.get("data", {}).get("is_favorite"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Check Removed Favorite Status: PASSED")
        else:
            print(f"{Fore.RED}❌ Check Removed Favorite Status: FAILED")
        
        # Test 11: Add Non-Existent Paket to Favorites (Should Fail)
        total_tests += 1
        print(f"\n{Fore.YELLOW}❌ Test 11: Add Non-Existent Paket (Should Fail)")
        non_existent_result = client.add_to_favorites(md5_hash="nonexistent_hash_12345")
        if not non_existent_result.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Add Non-Existent Paket (Should Fail): PASSED")
        else:
            print(f"{Fore.RED}❌ Add Non-Existent Paket (Should Fail): FAILED")
        
        # Test 12: Clear All Favorites
        total_tests += 1
        print(f"\n{Fore.YELLOW}🧹 Test 12: Clear All Favorites")
        clear_all_result = client.clear_all_favorites()
        if clear_all_result.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Clear All Favorites: PASSED")
            message = clear_all_result.get("message", "")
            print(f"   📝 {message}")
        else:
            print(f"{Fore.RED}❌ Clear All Favorites: FAILED")
        
        # Test 13: Verify All Favorites Cleared
        total_tests += 1
        print(f"\n{Fore.YELLOW}🔍 Test 13: Verify All Favorites Cleared")
        verify_clear_result = client.get_all_favorites()
        if verify_clear_result.get("success") and verify_clear_result.get("count", 0) == 0:
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Verify All Favorites Cleared: PASSED")
        else:
            print(f"{Fore.RED}❌ Verify All Favorites Cleared: FAILED")
        
        # Cleanup: Delete test user
        print(f"\n{Fore.YELLOW}🧹 Cleanup: Deleting test user...")
        client.delete_user_account()
        print(f"{Fore.GREEN}✅ Test user deleted")
        
    except Exception as e:
        print(f"{Fore.RED}❌ Test execution failed: {e}")
    
    # Test Summary
    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"{Fore.CYAN}📊 FAVORITES CRUD TEST SUMMARY")
    print(f"{Fore.CYAN}{'='*60}")
    print(f"{Fore.GREEN}✅ Passed: {passed_tests}/{total_tests}")
    print(f"{Fore.RED}❌ Failed: {total_tests - passed_tests}/{total_tests}")
    print(f"{Fore.BLUE}📈 Success Rate: {round((passed_tests / total_tests) * 100, 1)}%")
    
    if passed_tests == total_tests:
        print(f"\n{Fore.GREEN}🎉 ALL FAVORITES CRUD TESTS PASSED!")
    else:
        print(f"\n{Fore.YELLOW}⚠️ Some favorites CRUD tests failed.")
    
    return passed_tests, total_tests

if __name__ == "__main__":
    test_favorites_crud()
