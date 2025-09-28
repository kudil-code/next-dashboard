#!/usr/bin/env python3
"""
Test script untuk menguji performance caching pada API tender
Menjalankan 3x request untuk melihat perbedaan cache miss vs cache hit
"""

import requests
import time
import json
from datetime import datetime
import sys

class TenderCacheTester:
    def __init__(self, base_url="http://localhost:3000"):
        self.base_url = base_url
        self.results = []
        
    def print_header(self):
        """Print header informasi test"""
        print("=" * 80)
        print("🚀 TENDER CACHE PERFORMANCE TEST")
        print("=" * 80)
        print(f"📅 Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🌐 Server URL: {self.base_url}")
        print(f"🎯 Target API: /api/paket (tender data)")
        print("=" * 80)
        print()
        
    def test_server_connection(self):
        """Test apakah server Next.js berjalan"""
        try:
            response = requests.get(f"{self.base_url}/api/health", timeout=5)
            if response.status_code == 200:
                print("✅ Server connection: OK")
                return True
            else:
                print(f"❌ Server connection: FAILED (Status: {response.status_code})")
                return False
        except requests.exceptions.RequestException as e:
            print(f"❌ Server connection: FAILED ({str(e)})")
            return False
    
    def make_request(self, request_number):
        """Membuat request ke API dan mengukur performance"""
        url = f"{self.base_url}/api/paket?limit=10"
        
        print(f"🔄 Request #{request_number} - Sending to: {url}")
        
        # Measure response time
        start_time = time.time()
        try:
            response = requests.get(url, timeout=30)
            end_time = time.time()
            
            response_time = (end_time - start_time) * 1000  # Convert to milliseconds
            
            # Extract cache information from headers
            cache_status = response.headers.get('X-Cache-Status', 'N/A')
            cache_key = response.headers.get('X-Cache-Key', 'N/A')
            cache_ttl = response.headers.get('X-Cache-TTL', 'N/A')
            
            # Parse response data
            if response.status_code == 200:
                data = response.json()
                total_records = data.get('pagination', {}).get('total', 0)
                returned_records = len(data.get('data', []))
            else:
                total_records = 0
                returned_records = 0
                data = None
            
            # Store result
            result = {
                'request_number': request_number,
                'status_code': response.status_code,
                'response_time_ms': round(response_time, 2),
                'cache_status': cache_status,
                'cache_key': cache_key,
                'cache_ttl': cache_ttl,
                'total_records': total_records,
                'returned_records': returned_records,
                'success': response.status_code == 200
            }
            
            self.results.append(result)
            
            # Print result
            status_emoji = "✅" if response.status_code == 200 else "❌"
            cache_emoji = "🚀" if cache_status == "HIT" else "🐌"
            
            print(f"   {status_emoji} Status: {response.status_code}")
            print(f"   ⏱️  Response Time: {response_time:.2f}ms")
            print(f"   {cache_emoji} Cache Status: {cache_status}")
            print(f"   🔑 Cache Key: {cache_key}")
            print(f"   ⏰ Cache TTL: {cache_ttl}s")
            print(f"   📊 Records: {returned_records}/{total_records}")
            
            if response.status_code != 200:
                print(f"   ❌ Error: {response.text[:100]}...")
            
            print()
            return result
            
        except requests.exceptions.RequestException as e:
            end_time = time.time()
            response_time = (end_time - start_time) * 1000
            
            result = {
                'request_number': request_number,
                'status_code': 0,
                'response_time_ms': round(response_time, 2),
                'cache_status': 'ERROR',
                'cache_key': 'N/A',
                'cache_ttl': 'N/A',
                'total_records': 0,
                'returned_records': 0,
                'success': False,
                'error': str(e)
            }
            
            self.results.append(result)
            
            print(f"   ❌ Request failed: {str(e)}")
            print(f"   ⏱️  Time before failure: {response_time:.2f}ms")
            print()
            return result
    
    def run_test(self):
        """Menjalankan test 3x request"""
        self.print_header()
        
        # Test server connection first
        if not self.test_server_connection():
            print("❌ Cannot proceed - server is not accessible")
            return False
        
        print("🧪 Starting cache performance test...")
        print("📝 Expected behavior:")
        print("   - Request 1: Cache MISS (slow - database query)")
        print("   - Request 2: Cache HIT (fast - memory access)")
        print("   - Request 3: Cache HIT (fast - memory access)")
        print()
        
        # Run 3 requests
        for i in range(1, 4):
            self.make_request(i)
            if i < 3:  # Don't sleep after last request
                time.sleep(1)  # 1 second between requests
        
        return True
    
    def print_summary(self):
        """Print summary hasil test"""
        if not self.results:
            print("❌ No results to summarize")
            return
        
        print("=" * 80)
        print("📊 TEST SUMMARY")
        print("=" * 80)
        
        # Calculate statistics
        successful_requests = [r for r in self.results if r['success']]
        cache_hits = [r for r in successful_requests if r['cache_status'] == 'HIT']
        cache_misses = [r for r in successful_requests if r['cache_status'] == 'MISS']
        
        if successful_requests:
            avg_response_time = sum(r['response_time_ms'] for r in successful_requests) / len(successful_requests)
            min_response_time = min(r['response_time_ms'] for r in successful_requests)
            max_response_time = max(r['response_time_ms'] for r in successful_requests)
            
            print(f"📈 Performance Statistics:")
            print(f"   ✅ Successful Requests: {len(successful_requests)}/3")
            print(f"   ⏱️  Average Response Time: {avg_response_time:.2f}ms")
            print(f"   🐌 Slowest Response: {max_response_time:.2f}ms")
            print(f"   🚀 Fastest Response: {min_response_time:.2f}ms")
            print()
            
            print(f"🎯 Cache Performance:")
            print(f"   🐌 Cache Misses: {len(cache_misses)}")
            print(f"   🚀 Cache Hits: {len(cache_hits)}")
            
            if cache_misses and cache_hits:
                miss_time = cache_misses[0]['response_time_ms']
                hit_time = cache_hits[0]['response_time_ms']
                improvement = ((miss_time - hit_time) / miss_time) * 100
                print(f"   📊 Performance Improvement: {improvement:.1f}% faster")
                print(f"   ⚡ Speed Boost: {miss_time:.0f}ms → {hit_time:.0f}ms")
            
            print()
            
            # Detailed results table
            print("📋 Detailed Results:")
            print("-" * 80)
            print(f"{'Request':<8} {'Status':<8} {'Time (ms)':<10} {'Cache':<6} {'Records':<10}")
            print("-" * 80)
            
            for result in self.results:
                status = "✅" if result['success'] else "❌"
                cache_emoji = "🚀" if result['cache_status'] == 'HIT' else "🐌" if result['cache_status'] == 'MISS' else "❓"
                records = f"{result['returned_records']}/{result['total_records']}"
                
                print(f"#{result['request_number']:<7} {status:<8} {result['response_time_ms']:<10.1f} {cache_emoji:<6} {records:<10}")
            
            print("-" * 80)
            
            # Analysis
            print("\n🔍 Analysis:")
            if len(cache_misses) == 1 and len(cache_hits) == 2:
                print("   ✅ Perfect! Cache is working correctly")
                print("   ✅ First request hit database (cache miss)")
                print("   ✅ Subsequent requests served from cache (cache hit)")
            elif len(cache_misses) > 1:
                print("   ⚠️  Multiple cache misses detected")
                print("   ⚠️  Cache might not be working properly")
            elif len(cache_hits) == 0:
                print("   ❌ No cache hits detected")
                print("   ❌ Cache is not working")
            else:
                print("   ⚠️  Unexpected cache behavior")
        
        print("\n" + "=" * 80)
    
    def save_results(self, filename="cache_test_results.json"):
        """Save results to JSON file"""
        try:
            with open(filename, 'w') as f:
                json.dump({
                    'test_time': datetime.now().isoformat(),
                    'server_url': self.base_url,
                    'results': self.results
                }, f, indent=2)
            print(f"💾 Results saved to: {filename}")
        except Exception as e:
            print(f"❌ Failed to save results: {e}")

def main():
    """Main function"""
    # Check if custom URL provided
    base_url = "http://localhost:3000"
    if len(sys.argv) > 1:
        base_url = sys.argv[1]
    
    # Create tester and run test
    tester = TenderCacheTester(base_url)
    
    try:
        success = tester.run_test()
        if success:
            tester.print_summary()
            tester.save_results()
            
            # Exit with appropriate code
            successful_requests = [r for r in tester.results if r['success']]
            if len(successful_requests) >= 2:
                print("🎉 Test completed successfully!")
                sys.exit(0)
            else:
                print("❌ Test failed - insufficient successful requests")
                sys.exit(1)
        else:
            print("❌ Test failed - server not accessible")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n⏹️  Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
