"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { IconSearch } from "@tabler/icons-react"
import { useState } from "react"

export default function CariTenderPage() {
  const [selectedDateOption, setSelectedDateOption] = useState<string>("")

  const handleDateOptionChange = (option: string) => {
    setSelectedDateOption(option)
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
              <div className="flex flex-col gap-2 px-4 lg:px-6">
                <h1 className="text-2xl font-bold tracking-tight">Cari Tender</h1>
                <p className="text-muted-foreground">
                  Temukan dan cari tender yang sesuai dengan kebutuhan Anda
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pencarian Tender</CardTitle>
                    <CardDescription>
                      Masukkan kata kunci atau kriteria pencarian untuk menemukan tender yang relevan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex gap-3">
                        <Input 
                          placeholder="Masukkan kata kunci pencarian..." 
                          className="flex-1 h-10"
                        />
                        <Button className="h-10 px-6">
                          <IconSearch className="mr-2 h-4 w-4" />
                          Cari
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="today" 
                              checked={selectedDateOption === "today"}
                              onCheckedChange={() => handleDateOptionChange("today")}
                            />
                            <label htmlFor="today" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Hari ini
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="last30days" 
                              checked={selectedDateOption === "last30days"}
                              onCheckedChange={() => handleDateOptionChange("last30days")}
                            />
                            <label htmlFor="last30days" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              30 hari sebelumnya
                            </label>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="text-sm font-medium">Nilai HPS Minimum</label>
                            <Input placeholder="Masukkan nilai minimum..." className="h-10" />
                          </div>
                          <div className="space-y-3">
                            <label className="text-sm font-medium">Nilai HPS Maksimum</label>
                            <Input placeholder="Masukkan nilai maksimum..." className="h-10" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Hasil Pencarian</CardTitle>
                    <CardDescription>
                      Tender yang ditemukan berdasarkan kriteria pencarian Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <IconSearch className="mx-auto h-16 w-16 mb-6 opacity-50" />
                      <p className="text-lg mb-2">Belum ada pencarian yang dilakukan</p>
                      <p className="text-sm">Gunakan form di atas untuk mencari tender</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
