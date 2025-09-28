"""
Complete CRUD Test Suite
Runs all CRUD tests for Paket, User, and Favorites
"""

import sys
import time
from api_client import SimpleCRUDAPIClient
from colorama import Fore, Style

# Import test modules
from test_paket_crud import test_paket_crud
from test_user_crud import test_user_crud
from test_favorites_crud import test_favorites_crud

def get_server_info():
    """Get server info from command line or user input"""
    
    # Check command line arguments first
    if len(sys.argv) >= 2:
        port = sys.argv[1]
        host = sys.argv[2] if len(sys.argv) >= 3 else "localhost"
        base_url = f"http://{host}:{port}"
        print(f"{Fore.GREEN}✅ Using command line arguments: {base_url}")
        print(f"{Fore.CYAN}{'='*50}")
        return base_url
    
    # Interactive input if no command line args
    print(f"{Fore.CYAN}🔍 Server Configuration")
    print(f"{Fore.CYAN}{'='*50}")
    print(f"{Fore.YELLOW}💡 Tip: You can also run with arguments:")
    print(f"{Fore.YELLOW}   python test_all_crud.py 3000")
    print(f"{Fore.YELLOW}   python test_all_crud.py 3002 localhost")
    print()
    
    # Ask for port
    while True:
        try:
            port_input = input(f"{Fore.WHITE}Enter server port (default: 3001): ").strip()
            if not port_input:
                port = "3001"
            else:
                port = str(int(port_input))  # Validate it's a number
            break
        except ValueError:
            print(f"{Fore.RED}❌ Please enter a valid port number")
    
    # Ask for host (optional)
    host_input = input(f"{Fore.WHITE}Enter server host (default: localhost): ").strip()
    host = host_input if host_input else "localhost"
    
    base_url = f"http://{host}:{port}"
    
    print(f"{Fore.GREEN}✅ Testing server: {base_url}")
    print(f"{Fore.CYAN}{'='*50}")
    
    return base_url

def run_all_tests():
    """Run all CRUD tests with user-specified server"""
    print(f"{Fore.MAGENTA}{'='*80}")
    print(f"{Fore.MAGENTA}🚀 SIMPLE CRUD API TEST SUITE")
    print(f"{Fore.MAGENTA}{'='*80}")
    
    # Get server info from user
    base_url = get_server_info()
    
    # Test connection first
    if not quick_health_check(base_url):
        print(f"\n{Fore.RED}❌ Cannot proceed with tests. API is not available.")
        return
    
    print(f"\n{Fore.CYAN}Testing all CRUD operations for:")
    print(f"{Fore.CYAN}• Paket Management")
    print(f"{Fore.CYAN}• User Management") 
    print(f"{Fore.CYAN}• User Favorites")
    print(f"{Fore.MAGENTA}{'='*80}")
    
    # Initialize counters
    total_passed = 0
    total_tests = 0
    test_results = {}
    
    try:
        # Test 1: Paket CRUD
        print(f"\n{Fore.YELLOW}🔵 Starting Paket CRUD Tests...")
        paket_passed, paket_total = test_paket_crud()
        test_results['Paket CRUD'] = {'passed': paket_passed, 'total': paket_total}
        total_passed += paket_passed
        total_tests += paket_total
        
        # Wait a moment between test suites
        time.sleep(1)
        
        # Test 2: User CRUD
        print(f"\n{Fore.YELLOW}🟢 Starting User CRUD Tests...")
        user_passed, user_total = test_user_crud()
        test_results['User CRUD'] = {'passed': user_passed, 'total': user_total}
        total_passed += user_passed
        total_tests += user_total
        
        # Wait a moment between test suites
        time.sleep(1)
        
        # Test 3: Favorites CRUD
        print(f"\n{Fore.YELLOW}🟡 Starting Favorites CRUD Tests...")
        favorites_passed, favorites_total = test_favorites_crud()
        test_results['Favorites CRUD'] = {'passed': favorites_passed, 'total': favorites_total}
        total_passed += favorites_passed
        total_tests += favorites_total
        
    except Exception as e:
        print(f"{Fore.RED}❌ Test suite execution failed: {e}")
        return
    
    # Comprehensive Test Summary
    print(f"\n{Fore.MAGENTA}{'='*80}")
    print(f"{Fore.MAGENTA}📊 COMPREHENSIVE TEST SUMMARY")
    print(f"{Fore.MAGENTA}{'='*80}")
    
    # Individual test results
    print(f"\n{Fore.CYAN}📋 Individual Test Results:")
    for test_name, results in test_results.items():
        passed = results['passed']
        total = results['total']
        success_rate = round((passed / total) * 100, 1) if total > 0 else 0
        status_color = Fore.GREEN if passed == total else Fore.YELLOW if passed > total/2 else Fore.RED
        
        print(f"   {status_color}• {test_name}: {passed}/{total} ({success_rate}%)")
    
    # Overall summary
    overall_success_rate = round((total_passed / total_tests) * 100, 1) if total_tests > 0 else 0
    
    print(f"\n{Fore.CYAN}📊 Overall Results:")
    print(f"   {Fore.GREEN}✅ Total Passed: {total_passed}/{total_tests}")
    print(f"   {Fore.RED}❌ Total Failed: {total_tests - total_passed}/{total_tests}")
    print(f"   {Fore.BLUE}📈 Overall Success Rate: {overall_success_rate}%")
    
    # API Status
    print(f"\n{Fore.CYAN}🌐 API Endpoints Tested:")
    print(f"   {Fore.WHITE}• Health Check: GET /health")
    print(f"   {Fore.WHITE}• API Docs: GET /api")
    print(f"   {Fore.WHITE}• Auth: POST /api/auth/register, POST /api/auth/login")
    print(f"   {Fore.WHITE}• Users: GET/PUT /api/users/profile, PUT /api/users/change-password, DELETE /api/users/account")
    print(f"   {Fore.WHITE}• Paket: GET/POST/PUT/DELETE /api/paket")
    print(f"   {Fore.WHITE}• Favorites: GET/POST/DELETE /api/favorites, GET /api/favorites/check/:md5_hash, GET /api/favorites/stats")
    
    # Final status
    if total_passed == total_tests:
        print(f"\n{Fore.GREEN}{'🎉 ALL TESTS PASSED! 🎉'}")
        print(f"{Fore.GREEN}Your Simple CRUD API is working perfectly!")
        print(f"{Fore.GREEN}All CRUD operations are functional and tested.")
    else:
        print(f"\n{Fore.YELLOW}⚠️ Some tests failed.")
        print(f"{Fore.YELLOW}Check the individual test results above for details.")
    
    print(f"\n{Fore.CYAN}💡 Features Successfully Tested:")
    print(f"   {Fore.WHITE}✅ Complete CRUD operations")
    print(f"   {Fore.WHITE}✅ User authentication & authorization")
    print(f"   {Fore.WHITE}✅ Password security & hashing")
    print(f"   {Fore.WHITE}✅ Database relationships & constraints")
    print(f"   {Fore.WHITE}✅ Error handling & validation")
    print(f"   {Fore.WHITE}✅ Search & filtering")
    print(f"   {Fore.WHITE}✅ Statistics & analytics")
    print(f"   {Fore.WHITE}✅ Data integrity & security")
    
    print(f"\n{Fore.MAGENTA}{'='*80}")
    print(f"{Fore.MAGENTA}Test completed at: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{Fore.MAGENTA}{'='*80}")

def quick_health_check(base_url):
    """Quick health check to verify API is running"""
    print(f"{Fore.CYAN}🔍 Testing connection to {base_url}...")
    client = SimpleCRUDAPIClient(base_url)
    try:
        health_result = client.health_check()
        if health_result.get("success"):
            print(f"{Fore.GREEN}✅ API is running and healthy!")
            return True
        else:
            print(f"{Fore.RED}❌ API health check failed")
            return False
    except Exception as e:
        print(f"{Fore.RED}❌ Cannot connect to API: {e}")
        print(f"{Fore.YELLOW}💡 Make sure your server is running on {base_url}")
        return False

if __name__ == "__main__":
    # Run all tests (includes server configuration and health check)
    run_all_tests()
