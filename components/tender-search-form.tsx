"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TenderSearchForm() {
  const [keyword, setKeyword] = useState("")
  const [hpsMin, setHpsMin] = useState("")
  const [hpsMax, setHpsMax] = useState("")
  const [todayOnly, setTodayOnly] = useState(false)
  const [last30Days, setLast30Days] = useState(false)

  const handleSearch = () => {
    // TODO: Implement search logic
    console.log("Search criteria:", {
      keyword,
      hpsMin,
      hpsMax,
      todayOnly,
      last30Days
    })
  }

  return (
    <Card className="mb-6">
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
            placeholder="Masukkan kata kunci..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        {/* HPS Range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hps-min">HPS Minimum</Label>
            <Input
              id="hps-min"
              type="number"
              placeholder="Min"
              value={hpsMin}
              onChange={(e) => setHpsMin(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hps-max">HPS Maximum</Label>
            <Input
              id="hps-max"
              type="number"
              placeholder="Max"
              value={hpsMax}
              onChange={(e) => setHpsMax(e.target.value)}
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

        {/* Search Button */}
        <div className="pt-4">
          <Button onClick={handleSearch} className="w-full">
            Cari Tender
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
