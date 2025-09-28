"""
Simple CRUD API Client
A Python client for testing all CRUD operations
"""

import requests
import json
import time
from typing import Dict, Any, Optional
from colorama import init, Fore, Style

# Initialize colorama for colored output
init(autoreset=True)

class SimpleCRUDAPIClient:
    def __init__(self, base_url: str = None):
        if base_url is None:
            # If no URL provided, ask user
            base_url = self._get_server_url()
        
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.auth_token = None
        
        print(f"{Fore.BLUE}🔗 Connected to: {self.base_url}")
    
    def _get_server_url(self):
        """Get server URL from user input"""
        print(f"{Fore.CYAN}No server URL provided. Please enter server details:")
        
        host = input(f"{Fore.WHITE}Host (default: localhost): ").strip() or "localhost"
        
        while True:
            try:
                port = input(f"{Fore.WHITE}Port (default: 3001): ").strip() or "3001"
                port = str(int(port))  # Validate
                break
            except ValueError:
                print(f"{Fore.RED}❌ Please enter a valid port number")
        
        return f"http://{host}:{port}"
        
    def _make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, 
                     params: Optional[Dict] = None, use_auth: bool = True) -> requests.Response:
        """Make HTTP request with proper headers and error handling"""
        url = f"{self.base_url}{endpoint}"
        headers = {"Content-Type": "application/json"}
        
        if use_auth and self.auth_token:
            headers["Authorization"] = f"Bearer {self.auth_token}"
        
        try:
            response = self.session.request(
                method=method,
                url=url,
                headers=headers,
                json=data,
                params=params,
                timeout=10
            )
            return response
        except requests.exceptions.RequestException as e:
            print(f"{Fore.RED}❌ Request failed: {e}")
            raise
    
    def _print_response(self, response: requests.Response, test_name: str) -> Dict:
        """Print formatted response and return JSON data"""
        status_color = Fore.GREEN if response.status_code < 400 else Fore.RED
        print(f"{status_color}📡 {test_name}")
        print(f"   Status: {response.status_code}")
        
        try:
            data = response.json()
            print(f"   Response: {json.dumps(data, indent=2)}")
            return data
        except json.JSONDecodeError:
            print(f"   Response: {response.text}")
            return {"raw": response.text}
    
    # Health Check
    def health_check(self) -> Dict:
        """Test server health"""
        response = self._make_request("GET", "/health", use_auth=False)
        return self._print_response(response, "Health Check")
    
    # API Documentation
    def get_api_docs(self) -> Dict:
        """Get API documentation"""
        response = self._make_request("GET", "/api", use_auth=False)
        return self._print_response(response, "API Documentation")
    
    # Authentication
    def register_user(self, username: str, email: str, password: str, full_name: str) -> Dict:
        """Register new user"""
        data = {
            "username": username,
            "email": email,
            "password": password,
            "full_name": full_name
        }
        response = self._make_request("POST", "/api/auth/register", data=data, use_auth=False)
        result = self._print_response(response, "User Registration")
        
        if response.status_code == 201 and result.get("success"):
            self.auth_token = result.get("token")
            print(f"{Fore.GREEN}✅ Authentication token saved")
        
        return result
    
    def login_user(self, email: str, password: str) -> Dict:
        """Login user"""
        data = {"email": email, "password": password}
        response = self._make_request("POST", "/api/auth/login", data=data, use_auth=False)
        result = self._print_response(response, "User Login")
        
        if response.status_code == 200 and result.get("success"):
            self.auth_token = result.get("token")
            print(f"{Fore.GREEN}✅ Authentication token saved")
        
        return result
    
    # User Management
    def get_user_profile(self) -> Dict:
        """Get user profile"""
        response = self._make_request("GET", "/api/users/profile")
        return self._print_response(response, "Get User Profile")
    
    def update_user_profile(self, username: str = None, full_name: str = None) -> Dict:
        """Update user profile"""
        data = {}
        if username:
            data["username"] = username
        if full_name:
            data["full_name"] = full_name
        
        response = self._make_request("PUT", "/api/users/profile", data=data)
        return self._print_response(response, "Update User Profile")
    
    def change_password(self, current_password: str, new_password: str) -> Dict:
        """Change user password"""
        data = {
            "currentPassword": current_password,
            "newPassword": new_password
        }
        response = self._make_request("PUT", "/api/users/change-password", data=data)
        return self._print_response(response, "Change Password")
    
    def delete_user_account(self) -> Dict:
        """Delete user account"""
        response = self._make_request("DELETE", "/api/users/account")
        return self._print_response(response, "Delete User Account")
    
    # Paket CRUD
    def get_all_paket(self, search: str = None, page: int = 1, limit: int = 10) -> Dict:
        """Get all paket with optional search"""
        params = {"page": page, "limit": limit}
        if search:
            params["q"] = search
        
        response = self._make_request("GET", "/api/paket", params=params, use_auth=False)
        return self._print_response(response, "Get All Paket")
    
    def get_paket_by_id(self, paket_id: int) -> Dict:
        """Get paket by ID"""
        response = self._make_request("GET", f"/api/paket/{paket_id}", use_auth=False)
        return self._print_response(response, f"Get Paket by ID ({paket_id})")
    
    def create_paket(self, nama_paket: str, kode_paket: str, nilai_pagu_paket: float,
                    file_name: str = None, md5_hash: str = None, tanggal_pembuatan: str = None,
                    tanggal_penutupan: str = None, kl_pd_instansi: str = None, 
                    satuan_kerja: str = None, jenis_pengadaan: str = None, 
                    metode_pengadaan: str = None, nilai_hps_paket: float = None,
                    lokasi_pekerjaan: str = None, syarat_kualifikasi: str = None,
                    peserta_non_tender: str = None, html_content: str = None) -> Dict:
        """Create new paket with all required fields"""
        data = {
            "nama_paket": nama_paket,
            "kode_paket": kode_paket,
            "nilai_pagu_paket": nilai_pagu_paket,
            "file_name": file_name or f"paket_{kode_paket}.pdf",
            "md5_hash": md5_hash or f"hash_{kode_paket}_{int(time.time())}",
            "tanggal_pembuatan": tanggal_pembuatan or "2024-01-01",
            "tanggal_penutupan": tanggal_penutupan,
            "kl_pd_instansi": kl_pd_instansi or "Dinas Teknologi",
            "satuan_kerja": satuan_kerja or "Bagian IT",
            "jenis_pengadaan": jenis_pengadaan or "Barang",
            "metode_pengadaan": metode_pengadaan or "Tender Terbuka",
            "nilai_hps_paket": nilai_hps_paket or nilai_pagu_paket * 0.9,
            "lokasi_pekerjaan": lokasi_pekerjaan or "Jakarta",
            "syarat_kualifikasi": syarat_kualifikasi or "Perusahaan harus memiliki SIUP dan NPWP",
            "peserta_non_tender": peserta_non_tender or "Tidak ada",
            "html_content": html_content or f"<p>Detail pengadaan {nama_paket}</p>"
        }
        
        response = self._make_request("POST", "/api/paket", data=data, use_auth=False)
        return self._print_response(response, "Create Paket")
    
    def update_paket(self, paket_id: int, **kwargs) -> Dict:
        """Update paket"""
        response = self._make_request("PUT", f"/api/paket/{paket_id}", data=kwargs, use_auth=False)
        return self._print_response(response, f"Update Paket ({paket_id})")
    
    def delete_paket(self, paket_id: int) -> Dict:
        """Delete paket"""
        response = self._make_request("DELETE", f"/api/paket/{paket_id}", use_auth=False)
        return self._print_response(response, f"Delete Paket ({paket_id})")
    
    # Favorites CRUD
    def get_all_favorites(self) -> Dict:
        """Get all user favorites"""
        response = self._make_request("GET", "/api/favorites")
        return self._print_response(response, "Get All Favorites")
    
    def add_to_favorites(self, md5_hash: str, notes: str = None) -> Dict:
        """Add paket to favorites using md5_hash"""
        data = {"md5_hash": md5_hash}
        if notes:
            data["notes"] = notes
        response = self._make_request("POST", "/api/favorites", data=data)
        return self._print_response(response, f"Add to Favorites (MD5: {md5_hash})")
    
    def remove_from_favorites(self, md5_hash: str) -> Dict:
        """Remove paket from favorites using md5_hash"""
        response = self._make_request("DELETE", f"/api/favorites/{md5_hash}")
        return self._print_response(response, f"Remove from Favorites (MD5: {md5_hash})")
    
    def check_favorite_status(self, md5_hash: str) -> Dict:
        """Check if paket is in favorites using md5_hash"""
        response = self._make_request("GET", f"/api/favorites/check/{md5_hash}")
        return self._print_response(response, f"Check Favorite Status (MD5: {md5_hash})")
    
    def get_favorites_stats(self) -> Dict:
        """Get favorites statistics"""
        response = self._make_request("GET", "/api/favorites/stats")
        return self._print_response(response, "Get Favorites Statistics")
    
    def clear_all_favorites(self) -> Dict:
        """Clear all favorites"""
        response = self._make_request("DELETE", "/api/favorites")
        return self._print_response(response, "Clear All Favorites")
