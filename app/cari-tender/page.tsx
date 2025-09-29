"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { PaketDataTable } from "@/components/paket-data-table"
import { SiteHeader } from "@/components/site-header"
import { TenderSearchForm } from "@/components/tender-search-form"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export interface SearchParams {
  keyword: string
  hpsMin: string
  hpsMax: string
  todayOnly: boolean
  last30Days: boolean
}

export default function Page() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: "",
    hpsMin: "",
    hpsMax: "",
    todayOnly: false,
    last30Days: false
  })

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params)
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <TenderSearchForm onSearch={handleSearch} />
              <PaketDataTable searchParams={searchParams} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
