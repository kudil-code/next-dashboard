"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { DataTable } from "./data-table"

// Favorites data type based on API response - mapped to match dashboard schema
export interface FavoritesData {
  id: number
  md5_hash: string
  kode_paket: string
  nama_paket: string
  kl_pd_instansi: string
  tanggal_pembuatan: string
  nilai_hps_paket: number
  lokasi_pekerjaan: string
}

export function FavoritesDataTable() {
  const [data, setData] = useState<FavoritesData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        
        if (!token) {
          throw new Error('No authentication token found')
        }

        const response = await fetch('/api/favorites', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (result.success && result.data) {
          // Transform the data to match dashboard schema exactly
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
          setData(transformedData)
          setTotalCount(result.count || transformedData.length)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err) {
        console.error('Error fetching favorites data:', err)
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
          <p className="text-muted-foreground">Memuat data favorit...</p>
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
            Pastikan Anda sudah login dan terhubung ke database
          </p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Belum ada paket yang difavoritkan</p>
          <p className="text-sm text-muted-foreground mt-2">
            Klik tombol favorit pada paket untuk menambahkannya ke daftar favorit
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {totalCount > 0 && (
        <div className="mb-4 px-4 lg:px-6">
          <p className="text-sm text-muted-foreground">
            Menampilkan {data.length} dari {totalCount} paket favorit
          </p>
        </div>
      )}
      <DataTable data={data} />
    </div>
  )
}
