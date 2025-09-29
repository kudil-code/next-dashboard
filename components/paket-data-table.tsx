"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { DataTable } from "./data-table"

// Paket data type based on MySQL schema
export interface PaketData {
  id: number
  md5_hash: string
  kode_paket: string
  nama_paket: string
  kl_pd_instansi: string
  tanggal_pembuatan: string
  nilai_hps_paket: number
  lokasi_pekerjaan: string
  is_favorite?: boolean
}

export function PaketDataTable() {
  const [data, setData] = useState<PaketData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  // Function to check favorite status for a single item
  const checkFavoriteStatus = async (md5Hash: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return false

      const response = await fetch(`/api/favorites/check/${md5Hash}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        return result.success ? result.data.is_favorite : false
      }
      return false
    } catch (error) {
      console.error('Error checking favorite status:', error)
      return false
    }
  }

  // Function to check favorite status for all items
  const checkAllFavoriteStatuses = async (items: PaketData[]): Promise<PaketData[]> => {
    const token = localStorage.getItem('token')
    if (!token) return items

    try {
      // Check all favorite statuses in parallel
      const favoriteChecks = await Promise.all(
        items.map(async (item) => {
          const isFavorite = await checkFavoriteStatus(item.md5_hash)
          return { ...item, is_favorite: isFavorite }
        })
      )
      return favoriteChecks
    } catch (error) {
      console.error('Error checking favorite statuses:', error)
      return items
    }
  }

  // Function to refresh data (useful after favorite changes)
  const refreshData = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch('/api/paket?limit=1000')
      
      if (response.ok) {
        const result = await response.json()
        
        if (result.success && result.data) {
          const transformedData = result.data.map((item: any) => ({
            id: item.id,
            md5_hash: item.md5_hash || '',
            kode_paket: item.kode_paket || '',
            nama_paket: item.nama_paket || '',
            kl_pd_instansi: item.kl_pd_instansi || '',
            tanggal_pembuatan: item.tanggal_pembuatan || '',
            nilai_hps_paket: parseFloat(item.nilai_hps_paket) || 0,
            lokasi_pekerjaan: item.lokasi_pekerjaan || '',
          }))
          
          const dataWithFavorites = await checkAllFavoriteStatuses(transformedData)
          setData(dataWithFavorites)
        }
      }
    } catch (error) {
      console.error('Error refreshing data:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/paket?limit=1000')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (result.success && result.data) {
          // Transform the data to match our schema
          const transformedData = result.data.map((item: any) => ({
            id: item.id,
            md5_hash: item.md5_hash || '',
            kode_paket: item.kode_paket || '',
            nama_paket: item.nama_paket || '',
            kl_pd_instansi: item.kl_pd_instansi || '',
            tanggal_pembuatan: item.tanggal_pembuatan || '',
            nilai_hps_paket: parseFloat(item.nilai_hps_paket) || 0,
            lokasi_pekerjaan: item.lokasi_pekerjaan || '',
          }))
          
          // Check favorite status for all items
          const dataWithFavorites = await checkAllFavoriteStatuses(transformedData)
          setData(dataWithFavorites)
          
          // Set total count if available
          if (result.pagination) {
            setTotalCount(result.pagination.total)
          }
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err) {
        console.error('Error fetching paket data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat data paket...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Error: {error}</p>
          <p className="text-sm text-muted-foreground">
            Pastikan MySQL database berjalan dan terhubung
          </p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Tidak ada data paket tersedia</p>
          {totalCount > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Total data di database: {totalCount}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-6">
      {totalCount > 0 && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Menampilkan {data.length} dari {totalCount} data paket
          </p>
        </div>
      )}
      <DataTable data={data} onFavoriteChange={refreshData} />
    </div>
  )
}
