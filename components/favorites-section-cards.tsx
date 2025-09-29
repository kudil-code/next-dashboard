"use client"

import { useEffect, useState } from "react"
import { IconHeart, IconHeartFilled, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface FavoritesStats {
  totalFavorites: number
  thisMonthCount: number
  lastMonthCount: number
  percentageChange: number
}

export function FavoritesSectionCards() {
  const [favoritesStats, setFavoritesStats] = useState<FavoritesStats>({
    totalFavorites: 0,
    thisMonthCount: 0,
    lastMonthCount: 0,
    percentageChange: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavoritesStats = async () => {
      try {
        const token = localStorage.getItem('token')
        
        if (!token) {
          setLoading(false)
          return
        }

        const response = await fetch('/api/favorites', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            const totalFavorites = data.count || data.data.length
            
            // Calculate this month's favorites (simplified calculation)
            const thisMonth = new Date().getMonth()
            const thisYear = new Date().getFullYear()
            const thisMonthFavorites = data.data.filter((item: any) => {
              const favoritedDate = new Date(item.favorited_at)
              return favoritedDate.getMonth() === thisMonth && favoritedDate.getFullYear() === thisYear
            }).length
            
            setFavoritesStats({
              totalFavorites,
              thisMonthCount: thisMonthFavorites,
              lastMonthCount: Math.max(0, totalFavorites - thisMonthFavorites),
              percentageChange: totalFavorites > 0 ? Math.round((thisMonthFavorites / totalFavorites) * 100) : 0
            })
          }
        }
      } catch (error) {
        console.error('Error fetching favorites stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavoritesStats()
  }, [])

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Favorites</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? '...' : (favoritesStats.totalFavorites || 0).toLocaleString('id-ID')}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconHeartFilled className="text-red-500" />
              Favorit
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total paket yang difavoritkan <IconHeartFilled className="size-4 text-red-500" />
          </div>
          <div className="text-muted-foreground">
            Semua tender yang sudah disimpan
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Favorites This Month</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? '...' : (favoritesStats.thisMonthCount || 0).toLocaleString('id-ID')}
          </CardTitle>
          <CardAction>
            <Badge variant="default">
              <IconTrendingUp />
              +{favoritesStats.thisMonthCount || 0}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Ditambahkan bulan ini <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Favorit baru bulan {new Date().toLocaleDateString('id-ID', { month: 'long' })}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Favorites</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? '...' : (favoritesStats.totalFavorites || 0).toLocaleString('id-ID')}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconHeart />
              Aktif
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Semua favorit aktif <IconHeart className="size-4" />
          </div>
          <div className="text-muted-foreground">Siap untuk dipantau</div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Favorites Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? '...' : `${favoritesStats.percentageChange || 0}%`}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {favoritesStats.percentageChange || 0}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Persentase bulan ini <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Dari total favorit</div>
        </CardFooter>
      </Card>
    </div>
  )
}
