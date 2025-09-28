"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { DataTable } from "./data-table"

// Paket data type based on MySQL schema
export interface PaketData {
  id: number
  kode_paket: string
  nama_paket: string
  kl_pd_instansi: string
  tanggal_pembuatan: string
  nilai_hps_paket: number
  lokasi_pekerjaan: string
}

export function PaketDataTable() {
  const [data, setData] = useState<PaketData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/paket')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (result.success && result.data) {
          // Transform the data to match our schema
          const transformedData = result.data.map((item: any) => ({
            id: item.id,
            kode_paket: item.kode_paket || '',
            nama_paket: item.nama_paket || '',
            kl_pd_instansi: item.kl_pd_instansi || '',
            tanggal_pembuatan: item.tanggal_pembuatan || '',
            nilai_hps_paket: parseFloat(item.nilai_hps_paket) || 0,
            lokasi_pekerjaan: item.lokasi_pekerjaan || '',
          }))
          setData(transformedData)
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
        </div>
      </div>
    )
  }

  return <DataTable data={data} />
}
