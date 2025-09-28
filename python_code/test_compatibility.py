"""
Python Code Compatibility Test
Tests if the Python code is compatible with the updated database structure
"""

import sys
import time
from api_client import SimpleCRUDAPIClient
from colorama import Fore, Style

def test_python_compatibility():
    """Test Python code compatibility with updated database structure"""
    print(f"{Fore.CYAN}{'='*80}")
    print(f"{Fore.CYAN}🐍 PYTHON CODE COMPATIBILITY TEST")
    print(f"{Fore.CYAN}{'='*80}")
    
    client = SimpleCRUDAPIClient()
    passed_tests = 0
    total_tests = 0
    
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
        
        # Test 2: Get All Paket (Check if data exists)
        total_tests += 1
        print(f"\n{Fore.YELLOW}📋 Test 2: Get All Paket")
        all_paket = client.get_all_paket()
        if all_paket.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Get All Paket: PASSED")
            paket_data = all_paket.get("data", [])
            print(f"   📊 Found {len(paket_data)} paket records")
            
            # Check if paket have md5_hash field
            if paket_data and "md5_hash" in paket_data[0]:
                print(f"   ✅ Paket records have md5_hash field")
            else:
                print(f"   ⚠️ Paket records may not have md5_hash field")
        else:
            print(f"{Fore.RED}❌ Get All Paket: FAILED")
        
        # Test 3: Create Paket with New Structure
        total_tests += 1
        print(f"\n{Fore.YELLOW}➕ Test 3: Create Paket with New Structure")
        new_paket = client.create_paket(
            nama_paket="Python Compatibility Test Paket",
            kode_paket=f"PCT{int(time.time())}",
            nilai_pagu_paket=100000000,
            file_name="compatibility_test.pdf",
            md5_hash=f"compat_hash_{int(time.time())}",
            tanggal_pembuatan="2024-01-15",
            tanggal_penutupan="2024-02-15",
            kl_pd_instansi="Dinas Teknologi",
            satuan_kerja="Bagian IT",
            jenis_pengadaan="Barang",
            metode_pengadaan="Tender Terbuka",
            nilai_hps_paket=90000000,
            lokasi_pekerjaan="Jakarta",
            syarat_kualifikasi="Perusahaan harus memiliki SIUP dan NPWP",
            peserta_non_tender="Tidak ada",
            html_content="<p>Detail pengadaan Python Compatibility Test</p>"
        )
        
        created_id = None
        created_md5_hash = None
        if new_paket.get("success") and new_paket.get("data", {}).get("id"):
            passed_tests += 1
            created_id = new_paket["data"]["id"]
            created_md5_hash = new_paket["data"].get("md5_hash")
            print(f"{Fore.GREEN}✅ Create Paket with New Structure: PASSED")
            print(f"   🆔 Created paket ID: {created_id}")
            print(f"   🔑 Created paket MD5: {created_md5_hash}")
        else:
            print(f"{Fore.RED}❌ Create Paket with New Structure: FAILED")
            print(f"   Response: {new_paket}")
        
        # Test 4: User Registration and Authentication
        total_tests += 1
        print(f"\n{Fore.YELLOW}👤 Test 4: User Registration")
        test_email = f"compat_test_{int(time.time())}@example.com"
        register_result = client.register_user(
            username=f"compat_test_{int(time.time())}",
            email=test_email,
            password="compatpassword123",
            full_name="Compatibility Test User"
        )
        
        if register_result.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ User Registration: PASSED")
            print(f"   📧 Test user email: {test_email}")
        else:
            print(f"{Fore.RED}❌ User Registration: FAILED")
            # Try to login if user exists
            print(f"   🔄 Trying to login with existing user...")
            login_result = client.login_user(test_email, "compatpassword123")
            if login_result.get("success"):
                passed_tests += 1
                print(f"{Fore.GREEN}✅ User Login (Existing): PASSED")
        
        # Test 5: Favorites with MD5 Hash (if we have a created paket)
        if created_md5_hash:
            total_tests += 1
            print(f"\n{Fore.YELLOW}⭐ Test 5: Favorites with MD5 Hash")
            add_favorite_result = client.add_to_favorites(
                md5_hash=created_md5_hash, 
                notes="Compatibility test favorite"
            )
            if add_favorite_result.get("success"):
                passed_tests += 1
                print(f"{Fore.GREEN}✅ Add to Favorites with MD5 Hash: PASSED")
                
                # Test check favorite status
                check_result = client.check_favorite_status(md5_hash=created_md5_hash)
                if check_result.get("success") and check_result.get("data", {}).get("is_favorite"):
                    print(f"   ✅ Check favorite status: PASSED")
                else:
                    print(f"   ⚠️ Check favorite status: May have issues")
                
                # Clean up favorite
                client.remove_from_favorites(md5_hash=created_md5_hash)
                print(f"   🧹 Cleaned up test favorite")
            else:
                print(f"{Fore.RED}❌ Add to Favorites with MD5 Hash: FAILED")
                print(f"   Response: {add_favorite_result}")
        else:
            print(f"\n{Fore.YELLOW}⚠️ Test 5: Skipped (No created paket with MD5 hash)")
        
        # Test 6: Clean up created paket
        if created_id:
            total_tests += 1
            print(f"\n{Fore.YELLOW}🗑️ Test 6: Clean up Created Paket")
            delete_result = client.delete_paket(created_id)
            if delete_result.get("success"):
                passed_tests += 1
                print(f"{Fore.GREEN}✅ Clean up Created Paket: PASSED")
            else:
                print(f"{Fore.RED}❌ Clean up Created Paket: FAILED")
        
        # Test 7: Clean up test user
        total_tests += 1
        print(f"\n{Fore.YELLOW}🧹 Test 7: Clean up Test User")
        delete_user_result = client.delete_user_account()
        if delete_user_result.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Clean up Test User: PASSED")
        else:
            print(f"{Fore.RED}❌ Clean up Test User: FAILED")
        
    except Exception as e:
        print(f"{Fore.RED}❌ Test execution failed: {e}")
        import traceback
        traceback.print_exc()
    
    # Test Summary
    print(f"\n{Fore.CYAN}{'='*80}")
    print(f"{Fore.CYAN}📊 PYTHON COMPATIBILITY TEST SUMMARY")
    print(f"{Fore.CYAN}{'='*80}")
    print(f"{Fore.GREEN}✅ Passed: {passed_tests}/{total_tests}")
    print(f"{Fore.RED}❌ Failed: {total_tests - passed_tests}/{total_tests}")
    print(f"{Fore.BLUE}📈 Success Rate: {round((passed_tests / total_tests) * 100, 1)}%")
    
    if passed_tests == total_tests:
        print(f"\n{Fore.GREEN}🎉 ALL PYTHON COMPATIBILITY TESTS PASSED!")
        print(f"{Fore.GREEN}✅ Python code is fully compatible with the updated database structure")
    else:
        print(f"\n{Fore.YELLOW}⚠️ Some Python compatibility tests failed.")
        print(f"{Fore.YELLOW}Check the individual test results above for details.")
    
    print(f"\n{Fore.CYAN}💡 Features Tested:")
    print(f"   {Fore.WHITE}✅ Health check and API connectivity")
    print(f"   {Fore.WHITE}✅ Paket CRUD with new database structure")
    print(f"   {Fore.WHITE}✅ User registration and authentication")
    print(f"   {Fore.WHITE}✅ Favorites with MD5 hash instead of paket_id")
    print(f"   {Fore.WHITE}✅ Data cleanup and resource management")
    
    print(f"\n{Fore.MAGENTA}{'='*80}")
    print(f"{Fore.MAGENTA}Test completed at: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{Fore.MAGENTA}{'='*80}")
    
    return passed_tests, total_tests

if __name__ == "__main__":
    test_python_compatibility()
