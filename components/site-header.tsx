"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface UserProfile {
  user_id: number
  username: string
  email: string
  full_name: string
  nama: string
  created_at: string
}

export function SiteHeader() {
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.data)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    fetchUserProfile()
  }, [])

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Documents</h1>
        <div className="ml-auto flex items-center gap-2">
          {user && (
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-sm font-medium text-foreground">
                {user.username}
              </span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
