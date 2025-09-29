"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface SearchParams {
  keyword: string
  hpsMin: string
  hpsMax: string
  todayOnly: boolean
  last30Days: boolean
}

interface TenderSearchFormProps {
  onSearch: (params: SearchParams) => void
}

export function TenderSearchForm({ onSearch }: TenderSearchFormProps) {
  const [keyword, setKeyword] = useState("")
  const [hpsMin, setHpsMin] = useState("")
  const [hpsMax, setHpsMax] = useState("")
  const [todayOnly, setTodayOnly] = useState(false)
  const [last30Days, setLast30Days] = useState(false)

  const handleSearch = () => {
    // Validate keyword minimum length
    if (keyword && keyword.trim().length < 4) {
      alert('Keyword minimal harus 4 huruf')
      return
    }
    
    // Validate HPS range
    const minValue = hpsMin ? parseFloat(hpsMin) : 0
    const maxValue = hpsMax ? parseFloat(hpsMax) : Infinity
    
    if (hpsMin && hpsMax && minValue > maxValue) {
      alert('Nilai HPS Minimum tidak boleh lebih besar dari HPS Maximum')
      return
    }
    
    const searchParams: SearchParams = {
      keyword,
      hpsMin,
      hpsMax,
      todayOnly,
      last30Days
    }
    
    onSearch(searchParams)
  }

  const handleReset = () => {
    setKeyword("")
    setHpsMin("")
    setHpsMax("")
    setTodayOnly(false)
    setLast30Days(false)
    
    const resetParams: SearchParams = {
      keyword: "",
      hpsMin: "",
      hpsMax: "",
      todayOnly: false,
      last30Days: false
    }
    
    onSearch(resetParams)
  }

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Cari Tender</CardTitle>
        </CardHeader>
      <CardContent className="space-y-4">
        {/* Keyword Search */}
        <div className="space-y-2">
          <Label htmlFor="keyword">Keyword</Label>
          <Input
            id="keyword"
            type="text"
            placeholder="Masukkan kata kunci (minimal 4 huruf)..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className={keyword && keyword.trim().length > 0 && keyword.trim().length < 4 ? "border-red-500 focus:border-red-500" : ""}
          />
          {keyword && keyword.trim().length > 0 && keyword.trim().length < 4 && (
            <p className="text-sm text-red-500">Keyword minimal harus 4 huruf</p>
          )}
        </div>

        {/* HPS Range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hps-min">HPS Minimum</Label>
            <Input
              id="hps-min"
              type="number"
              min="0"
              step="1000000"
              placeholder="Min (Rp)"
              value={hpsMin}
              onChange={(e) => {
                const value = e.target.value
                // Only allow positive numbers
                if (value === '' || (parseFloat(value) >= 0)) {
                  setHpsMin(value)
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hps-max">HPS Maximum</Label>
            <Input
              id="hps-max"
              type="number"
              min="0"
              step="1000000"
              placeholder="Max (Rp)"
              value={hpsMax}
              onChange={(e) => {
                const value = e.target.value
                // Only allow positive numbers
                if (value === '' || (parseFloat(value) >= 0)) {
                  setHpsMax(value)
                }
              }}
            />
          </div>
        </div>

        {/* Date Filters */}
        <div className="space-y-3">
          <Label>Filter Tanggal</Label>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="today"
                checked={todayOnly}
                onCheckedChange={(checked) => {
                  setTodayOnly(checked as boolean)
                  if (checked) setLast30Days(false)
                }}
              />
              <Label htmlFor="today" className="text-sm font-normal">
                Tender Hari Ini
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="last30"
                checked={last30Days}
                onCheckedChange={(checked) => {
                  setLast30Days(checked as boolean)
                  if (checked) setTodayOnly(false)
                }}
              />
              <Label htmlFor="last30" className="text-sm font-normal">
                30 Hari Terakhir
              </Label>
            </div>
          </div>
        </div>

        {/* Search Buttons */}
        <div className="pt-4 flex gap-2">
          <Button onClick={handleSearch} className="flex-1">
            Cari Tender
          </Button>
          <Button onClick={handleReset} variant="outline" className="flex-1">
            Reset
          </Button>
        </div>
      </CardContent>
      </Card>
    </div>
  )
}
