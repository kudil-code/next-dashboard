"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { IconHeart, IconHeartFilled } from "@tabler/icons-react"
import { toast } from "sonner"

interface FavoriteButtonProps {
  md5Hash: string
  className?: string
  onFavoriteChange?: () => void
}

interface FavoriteStatus {
  is_favorite: boolean
  favorite_id: string | null
  notes: string | null
  favorited_at: string | null
}

export function FavoriteButton({ md5Hash, className, onFavoriteChange }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  // Check favorite status on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!md5Hash) {
        console.log('FavoriteButton: No md5_hash provided')
        return
      }
      
      try {
        setIsChecking(true)
        const token = localStorage.getItem('token')
        
        if (!token) {
          console.error('FavoriteButton: No authentication token found')
          return
        }
        
        const response = await fetch(`/api/favorites/check/${md5Hash}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setIsFavorite(result.data.is_favorite)
          }
        } else {
          console.error('FavoriteButton: API error:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('FavoriteButton: Error checking favorite status:', error)
      } finally {
        setIsChecking(false)
      }
    }

    checkFavoriteStatus()
  }, [md5Hash])

  const handleToggleFavorite = async () => {
    if (!md5Hash || isLoading) return

    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        toast.error('Sesi login tidak ditemukan')
        return
      }
      
      if (isFavorite) {
        // Remove from favorites
        const response = await fetch(`/api/favorites/${md5Hash}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setIsFavorite(false)
            toast.success('Dihapus dari favorit')
            onFavoriteChange?.()
          } else {
            toast.error(result.error || 'Gagal menghapus dari favorit')
          }
        } else {
          toast.error('Gagal menghapus dari favorit')
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            md5_hash: md5Hash,
            notes: ''
          }),
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setIsFavorite(true)
            toast.success('Ditambahkan ke favorit')
            onFavoriteChange?.()
          } else {
            toast.error(result.error || 'Gagal menambahkan ke favorit')
          }
        } else {
          toast.error('Gagal menambahkan ke favorit')
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('Terjadi kesalahan saat mengubah status favorit')
    } finally {
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <Button 
        variant="outline" 
        className={className}
        disabled
      >
        <IconHeart className="h-4 w-4 mr-2" />
        Memuat...
      </Button>
    )
  }

  return (
    <Button 
      variant="outline"
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`${className} ${isFavorite ? 'text-red-500 border-red-500 hover:bg-red-50' : ''}`}
    >
      {isFavorite ? (
        <IconHeartFilled className="h-4 w-4 mr-2 text-red-500" />
      ) : (
        <IconHeart className="h-4 w-4 mr-2" />
      )}
      {isLoading ? 'Memproses...' : (isFavorite ? 'Favorit' : 'Tambah Favorit')}
    </Button>
  )
}
