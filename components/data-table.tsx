"use client"

import * as React from "react"
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FavoriteButton } from "@/components/favorite-button"
import { IconHeart, IconHeartFilled } from "@tabler/icons-react"

export const schema = z.object({
  id: z.number(),
  md5_hash: z.string(),
  kode_paket: z.string(),
  nama_paket: z.string(),
  kl_pd_instansi: z.string(),
  tanggal_pembuatan: z.string(),
  nilai_hps_paket: z.number(),
  lokasi_pekerjaan: z.string(),
  is_favorite: z.boolean().optional(),
})




export function DataTable({
  data: initialData,
  onFavoriteChange,
}: {
  data: z.infer<typeof schema>[]
  onFavoriteChange?: () => void
}) {
  const [data, setData] = React.useState(() => initialData)
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns: ColumnDef<z.infer<typeof schema>>[] = [
    {
      accessorKey: "is_favorite",
      header: () => <div className="w-12 text-center">Fav</div>,
      cell: ({ row }) => (
        <div className="w-12 flex justify-center">
          {row.original.is_favorite ? (
            <IconHeartFilled className="h-4 w-4 text-red-500" />
          ) : (
            <IconHeart className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "kode_paket",
      header: "Kode Paket",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <TableCellViewer item={row.original} onFavoriteChange={onFavoriteChange} />
            {row.original.is_favorite && (
              <Badge variant="secondary" className="text-xs bg-red-50 text-red-600 border-red-200">
                Favorit
              </Badge>
            )}
          </div>
        )
      },
      enableHiding: false,
    },
    {
      accessorKey: "nama_paket",
      header: "Nama Paket",
      cell: ({ row }) => (
        <div className="max-w-xs break-words leading-tight" title={row.original.nama_paket}>
          {row.original.nama_paket}
        </div>
      ),
    },
    {
      accessorKey: "kl_pd_instansi",
      header: () => <div className="w-32 text-center">KL PD Instansi</div>,
      cell: ({ row }) => (
        <div className="w-32 flex justify-center">
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {row.original.kl_pd_instansi}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "tanggal_pembuatan",
      header: () => <div className="w-24 text-center">TGL Pembuatan</div>,
      cell: ({ row }) => (
        <div className="w-24 text-center text-sm">
          {new Date(row.original.tanggal_pembuatan).toLocaleDateString('id-ID')}
        </div>
      ),
    },
    {
      accessorKey: "nilai_hps_paket",
      header: () => <div className="w-32 text-center">Nilai HPS</div>,
      cell: ({ row }) => (
        <div className="w-32 text-center font-medium">
          Rp {row.original.nilai_hps_paket.toLocaleString('id-ID')}
        </div>
      ),
    },
    {
      accessorKey: "lokasi_pekerjaan",
      header: "Lokasi Pekerjaan",
      cell: ({ row }) => (
        <div className="max-w-xs break-words leading-tight" title={row.original.lokasi_pekerjaan}>
          {row.original.lokasi_pekerjaan}
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })


  return (
    <div className="w-full flex-col justify-start gap-6">
      <div className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:whitespace-normal">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 50, 100].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


function TableCellViewer({ item, onFavoriteChange }: { item: z.infer<typeof schema>, onFavoriteChange?: () => void }) {
  const isMobile = useIsMobile()

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/paket/${item.id}/download`)
      
      if (!response.ok) {
        const errorData = await response.json()
        alert(`Error: ${errorData.error || 'Failed to download file'}`)
        return
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = `${item.kode_paket}.html`
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      // Create blob and download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download file. Please try again.')
    }
  }

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.kode_paket}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.kode_paket}</DrawerTitle>
          <DrawerDescription>
            Detail informasi paket pengadaan
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="kode_paket">Kode Paket</Label>
              <Input id="kode_paket" value={item.kode_paket} disabled />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="nama_paket">Nama Paket</Label>
              <Textarea 
                id="nama_paket" 
                value={item.nama_paket} 
                disabled 
                rows={3}
                className="resize-none"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="kl_pd_instansi">KL PD Instansi</Label>
              <Textarea 
                id="kl_pd_instansi" 
                value={item.kl_pd_instansi} 
                disabled 
                rows={2}
                className="resize-none"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="tanggal_pembuatan">Tanggal Pembuatan</Label>
              <Input 
                id="tanggal_pembuatan" 
                value={new Date(item.tanggal_pembuatan).toLocaleDateString('id-ID')} 
                disabled 
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="nilai_hps_paket">Nilai HPS</Label>
              <Input 
                id="nilai_hps_paket" 
                value={`Rp ${item.nilai_hps_paket.toLocaleString('id-ID')}`} 
                disabled 
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="lokasi_pekerjaan">Lokasi Pekerjaan</Label>
              <Textarea 
                id="lokasi_pekerjaan" 
                value={item.lokasi_pekerjaan} 
                disabled 
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
        </div>
        <DrawerFooter>
          <div className="flex flex-col gap-2">
            <FavoriteButton md5Hash={item.md5_hash} onFavoriteChange={onFavoriteChange} />
            <Button variant="outline">Tampilkan Tender Detail (HTML)</Button>
            <Button variant="outline" onClick={handleDownload}>
              Download
            </Button>
            <DrawerClose asChild>
              <Button>OK</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
