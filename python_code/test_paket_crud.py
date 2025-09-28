"""
Test Paket CRUD Operations
Tests all CRUD functionality for paket_pengadaan
"""

import sys
import time
from api_client import SimpleCRUDAPIClient
from colorama import Fore, Style

def test_paket_crud():
    """Test all Paket CRUD operations"""
    print(f"{Fore.CYAN}{'='*60}")
    print(f"{Fore.CYAN}🚀 TESTING PAKET CRUD OPERATIONS")
    print(f"{Fore.CYAN}{'='*60}")
    
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
        
        # Test 2: Get All Paket (Initial)
        total_tests += 1
        print(f"\n{Fore.YELLOW}📋 Test 2: Get All Paket (Initial)")
        all_paket = client.get_all_paket()
        if all_paket.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Get All Paket: PASSED")
            initial_count = len(all_paket.get("data", []))
            print(f"   📊 Initial paket count: {initial_count}")
        else:
            print(f"{Fore.RED}❌ Get All Paket: FAILED")
        
        # Test 3: Search Paket
        total_tests += 1
        print(f"\n{Fore.YELLOW}🔍 Test 3: Search Paket")
        search_result = client.get_all_paket(search="Laptop")
        if search_result.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Search Paket: PASSED")
            print(f"   📊 Search results: {len(search_result.get('data', []))} items")
        else:
            print(f"{Fore.RED}❌ Search Paket: FAILED")
        
        # Test 4: Create New Paket
        total_tests += 1
        print(f"\n{Fore.YELLOW}➕ Test 4: Create New Paket")
        new_paket = client.create_paket(
            nama_paket="Python Test Paket",
            kode_paket="PTP001",
            nilai_pagu_paket=75000000,
            file_name="python_test_paket.pdf",
            md5_hash=f"python_hash_{int(time.time())}",
            tanggal_pembuatan="2024-01-15",
            tanggal_penutupan="2024-02-15",
            kl_pd_instansi="Dinas Teknologi",
            satuan_kerja="Bagian IT",
            jenis_pengadaan="Barang",
            metode_pengadaan="Tender Terbuka",
            nilai_hps_paket=67500000,
            lokasi_pekerjaan="Jakarta",
            syarat_kualifikasi="Perusahaan harus memiliki SIUP dan NPWP",
            peserta_non_tender="Tidak ada",
            html_content="<p>Detail pengadaan Python Test Paket</p>"
        )
        created_id = None
        if new_paket.get("success") and new_paket.get("data", {}).get("id"):
            passed_tests += 1
            created_id = new_paket["data"]["id"]
            print(f"{Fore.GREEN}✅ Create Paket: PASSED")
            print(f"   🆔 Created paket ID: {created_id}")
        else:
            print(f"{Fore.RED}❌ Create Paket: FAILED")
        
        # Test 5: Get Paket by ID
        if created_id:
            total_tests += 1
            print(f"\n{Fore.YELLOW}🔍 Test 5: Get Paket by ID")
            paket_by_id = client.get_paket_by_id(created_id)
            if paket_by_id.get("success"):
                passed_tests += 1
                print(f"{Fore.GREEN}✅ Get Paket by ID: PASSED")
            else:
                print(f"{Fore.RED}❌ Get Paket by ID: FAILED")
        
        # Test 6: Update Paket
        if created_id:
            total_tests += 1
            print(f"\n{Fore.YELLOW}✏️ Test 6: Update Paket")
            update_result = client.update_paket(
                created_id,
                nama_paket="Updated Python Test Paket",
                nilai_pagu_paket=85000000,
                nilai_hps_paket=76500000,
                lokasi_pekerjaan="Bandung"
            )
            if update_result.get("success"):
                passed_tests += 1
                print(f"{Fore.GREEN}✅ Update Paket: PASSED")
            else:
                print(f"{Fore.RED}❌ Update Paket: FAILED")
        
        # Test 7: Get All Paket (After Create)
        total_tests += 1
        print(f"\n{Fore.YELLOW}📋 Test 7: Get All Paket (After Create)")
        all_paket_after = client.get_all_paket()
        if all_paket_after.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Get All Paket (After Create): PASSED")
            final_count = len(all_paket_after.get("data", []))
            print(f"   📊 Final paket count: {final_count}")
            if created_id:
                print(f"   📈 Count increased: {final_count > initial_count}")
        else:
            print(f"{Fore.RED}❌ Get All Paket (After Create): FAILED")
        
        # Test 8: Get Non-Existent Paket (Should Fail)
        total_tests += 1
        print(f"\n{Fore.YELLOW}❌ Test 8: Get Non-Existent Paket (Should Fail)")
        non_existent = client.get_paket_by_id(99999)
        if not non_existent.get("success"):
            passed_tests += 1
            print(f"{Fore.GREEN}✅ Get Non-Existent Paket (Should Fail): PASSED")
        else:
            print(f"{Fore.RED}❌ Get Non-Existent Paket (Should Fail): FAILED")
        
        # Test 9: Delete Paket
        if created_id:
            total_tests += 1
            print(f"\n{Fore.YELLOW}🗑️ Test 9: Delete Paket")
            delete_result = client.delete_paket(created_id)
            if delete_result.get("success"):
                passed_tests += 1
                print(f"{Fore.GREEN}✅ Delete Paket: PASSED")
            else:
                print(f"{Fore.RED}❌ Delete Paket: FAILED")
        
        # Test 10: Verify Deletion
        if created_id:
            total_tests += 1
            print(f"\n{Fore.YELLOW}🔍 Test 10: Verify Deletion")
            verify_deletion = client.get_paket_by_id(created_id)
            if not verify_deletion.get("success"):
                passed_tests += 1
                print(f"{Fore.GREEN}✅ Verify Deletion: PASSED")
            else:
                print(f"{Fore.RED}❌ Verify Deletion: FAILED")
        
    except Exception as e:
        print(f"{Fore.RED}❌ Test execution failed: {e}")
    
    # Test Summary
    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"{Fore.CYAN}📊 PAKET CRUD TEST SUMMARY")
    print(f"{Fore.CYAN}{'='*60}")
    print(f"{Fore.GREEN}✅ Passed: {passed_tests}/{total_tests}")
    print(f"{Fore.RED}❌ Failed: {total_tests - passed_tests}/{total_tests}")
    print(f"{Fore.BLUE}📈 Success Rate: {round((passed_tests / total_tests) * 100, 1)}%")
    
    if passed_tests == total_tests:
        print(f"\n{Fore.GREEN}🎉 ALL PAKET CRUD TESTS PASSED!")
    else:
        print(f"\n{Fore.YELLOW}⚠️ Some paket CRUD tests failed.")
    
    return passed_tests, total_tests

if __name__ == "__main__":
    test_paket_crud()
