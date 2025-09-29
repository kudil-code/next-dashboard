"use client"

import React from "react"
import { DataTableWrapper } from "./data-table-wrapper"

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
}

export function PaketDataTable() {
  return (
    <DataTableWrapper<PaketData>
      endpoint="/api/paket"
      limit={1000}
      emptyMessage="Tidak ada data paket tersedia"
      errorMessage="Pastikan MySQL database berjalan dan terhubung"
      loadingMessage="Memuat data paket..."
      showTotalCount={true}
      dataTransform={(item: any) => ({
        id: item.id,
        md5_hash: item.md5_hash || '',
        kode_paket: item.kode_paket || '',
        nama_paket: item.nama_paket || '',
        kl_pd_instansi: item.kl_pd_instansi || '',
        tanggal_pembuatan: item.tanggal_pembuatan || '',
        nilai_hps_paket: parseFloat(item.nilai_hps_paket) || 0,
        lokasi_pekerjaan: item.lokasi_pekerjaan || '',
      })}
    />
  )
}
