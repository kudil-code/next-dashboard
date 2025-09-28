"use client"

import { useEffect, useState } from "react"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface TenderStats {
  totalTender: number
  thisMonthCount: number
  lastMonthCount: number
  percentageChange: number
}

export function SectionCards() {
  const [tenderStats, setTenderStats] = useState<TenderStats>({
    totalTender: 0,
    thisMonthCount: 0,
    lastMonthCount: 0,
    percentageChange: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTenderStats = async () => {
      try {
        console.log('Fetching tender stats from frontend...')
        const response = await fetch('/api/stats')
        console.log('Response status:', response.status)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Fetched data:', data)
        setTenderStats(data)
      } catch (error) {
        console.error('Error fetching tender stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTenderStats()
  }, [])
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $1,250.00
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Tender</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? '...' : (tenderStats.totalTender || 0).toLocaleString('id-ID')}
          </CardTitle>
          <CardAction>
            <Badge variant={(tenderStats.percentageChange || 0) >= 0 ? "default" : "outline"}>
              {(tenderStats.percentageChange || 0) >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {(tenderStats.percentageChange || 0) >= 0 ? '+' : ''}{tenderStats.percentageChange || 0}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {(tenderStats.percentageChange || 0) >= 0 ? (
              <>Growth {tenderStats.percentageChange || 0}% this month <IconTrendingUp className="size-4" /></>
            ) : (
              <>Down {Math.abs(tenderStats.percentageChange || 0)}% this month <IconTrendingDown className="size-4" /></>
            )}
          </div>
          <div className="text-muted-foreground">
            {tenderStats.thisMonthCount || 0} tender baru bulan ini
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            45,678
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  )
}
