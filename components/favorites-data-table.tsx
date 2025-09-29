"use client"

import React from "react"
import { DataTableWrapper } from "./data-table-wrapper"

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
  return (
    <DataTableWrapper<FavoritesData>
      endpoint="/api/favorites"
      requiresAuth={true}
      emptyMessage="Belum ada paket yang difavoritkan"
      emptyDescription="Klik tombol favorit pada paket untuk menambahkannya ke daftar favorit"
      errorMessage="Pastikan Anda sudah login dan terhubung ke database"
      loadingMessage="Memuat data favorit..."
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
