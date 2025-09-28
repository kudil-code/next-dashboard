#!/usr/bin/env python3
"""
Test script untuk menguji performance caching pada API stats
"""

import requests
import time
import json
from datetime import datetime
import sys

def test_stats_caching():
    base_url = "http://localhost:3000"
    
    print("=" * 80)
    print("📊 STATS CACHE PERFORMANCE TEST")
    print("=" * 80)
    print(f"📅 Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 Server URL: {base_url}")
    print(f"🎯 Target API: /api/stats (statistics data)")
    print("=" * 80)
    print()
    
    results = []
    
    for i in range(1, 4):
        print(f"🔄 Request #{i} - Sending to: {base_url}/api/stats")
        
        start_time = time.time()
        try:
            response = requests.get(f"{base_url}/api/stats", timeout=30)
            end_time = time.time()
            
            response_time = (end_time - start_time) * 1000
            
            cache_status = response.headers.get('X-Cache-Status', 'N/A')
            cache_key = response.headers.get('X-Cache-Key', 'N/A')
            cache_ttl = response.headers.get('X-Cache-TTL', 'N/A')
            
            if response.status_code == 200:
                data = response.json()
                total_tender = data.get('totalTender', 0)
                this_month = data.get('thisMonthCount', 0)
            else:
                total_tender = 0
                this_month = 0
            
            status_emoji = "✅" if response.status_code == 200 else "❌"
            cache_emoji = "🚀" if cache_status == "HIT" else "🐌"
            
            print(f"   {status_emoji} Status: {response.status_code}")
            print(f"   ⏱️  Response Time: {response_time:.2f}ms")
            print(f"   {cache_emoji} Cache Status: {cache_status}")
            print(f"   🔑 Cache Key: {cache_key}")
            print(f"   ⏰ Cache TTL: {cache_ttl}s")
            print(f"   📊 Total Tender: {total_tender}, This Month: {this_month}")
            print()
            
            results.append({
                'request': i,
                'response_time': response_time,
                'cache_status': cache_status,
                'success': response.status_code == 200
            })
            
        except Exception as e:
            print(f"   ❌ Error: {e}")
            print()
        
        if i < 3:
            time.sleep(1)
    
    # Summary
    print("=" * 80)
    print("📊 SUMMARY")
    print("=" * 80)
    
    successful = [r for r in results if r['success']]
    cache_hits = [r for r in successful if r['cache_status'] == 'HIT']
    cache_misses = [r for r in successful if r['cache_status'] == 'MISS']
    
    if successful:
        avg_time = sum(r['response_time'] for r in successful) / len(successful)
        print(f"✅ Successful Requests: {len(successful)}/3")
        print(f"⏱️  Average Response Time: {avg_time:.2f}ms")
        print(f"🐌 Cache Misses: {len(cache_misses)}")
        print(f"🚀 Cache Hits: {len(cache_hits)}")
        
        if cache_misses and cache_hits:
            miss_time = cache_misses[0]['response_time']
            hit_time = cache_hits[0]['response_time']
            improvement = ((miss_time - hit_time) / miss_time) * 100
            print(f"📊 Performance Improvement: {improvement:.1f}% faster")
            print(f"⚡ Speed Boost: {miss_time:.0f}ms → {hit_time:.0f}ms")
    
    print("=" * 80)

if __name__ == "__main__":
    test_stats_caching()
