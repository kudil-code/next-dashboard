"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { User, Calendar, CreditCard, AlertCircle, CheckCircle } from "lucide-react"

interface UserProfile {
  user_id: number
  username: string
  email: string
  full_name: string
  nama: string
  created_at: string
}

interface SubscriptionData {
  id: number
  plan_name: string
  plan_display_name: string
  start_date: string
  end_date: string
  is_active: boolean
  auto_renew: boolean
  duration_months: number
  price: number
  max_favorites: number
  max_daily_views: number
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchUserProfile(token)
  }, [router])

  const fetchUserProfile = async (token: string) => {
    try {
      const [profileResponse, subscriptionResponse] = await Promise.all([
        fetch('/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('/api/users/subscription', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ])

      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setUser(profileData.data)
      }

      if (subscriptionResponse.ok) {
        const subscriptionData = await subscriptionResponse.json()
        setSubscription(subscriptionData.data)
      } else if (subscriptionResponse.status === 404) {
        // User has no subscription
        setSubscription(null)
      }

    } catch (err) {
      setError('Failed to load profile data')
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getSubscriptionStatus = () => {
    if (!subscription) return { status: 'No Subscription', color: 'secondary', icon: AlertCircle }
    
    const endDate = new Date(subscription.end_date)
    const today = new Date()
    const isExpired = endDate < today
    
    if (isExpired) {
      return { status: 'Expired', color: 'destructive', icon: AlertCircle }
    } else {
      const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      if (daysLeft <= 7) {
        return { status: `Expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`, color: 'warning', icon: AlertCircle }
      } else {
        return { status: 'Active', color: 'default', icon: CheckCircle }
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">{error || 'Failed to load user profile'}</p>
            <Button onClick={() => router.push('/login')} className="w-full">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const subscriptionStatus = getSubscriptionStatus()
  const StatusIcon = subscriptionStatus.icon

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* User Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Information
              </CardTitle>
              <CardDescription>
                Your account details and personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="text-lg font-semibold">{user.full_name || user.nama || 'Not provided'}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Username</label>
                <p className="text-lg font-semibold">{user.username || 'Not provided'}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-lg font-semibold">{user.email}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                <p className="text-lg font-semibold">{formatDate(user.created_at)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription Status
              </CardTitle>
              <CardDescription>
                Your current subscription plan and status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscription ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Plan</span>
                    <Badge variant="outline">{subscription.plan_display_name}</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Status</span>
                    <Badge 
                      variant={subscriptionStatus.color === 'destructive' ? 'destructive' : 
                              subscriptionStatus.color === 'warning' ? 'secondary' : 'default'}
                      className="flex items-center gap-1"
                    >
                      <StatusIcon className="h-3 w-3" />
                      {subscriptionStatus.status}
                    </Badge>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                    <p className="text-lg font-semibold">{formatDate(subscription.start_date)}</p>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">End Date</label>
                    <p className="text-lg font-semibold">{formatDate(subscription.end_date)}</p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Max Favorites</label>
                      <p className="text-lg font-semibold">{subscription.max_favorites}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Daily Views</label>
                      <p className="text-lg font-semibold">{subscription.max_daily_views}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have an active subscription. Subscribe to access premium features.
                  </p>
                  <Button className="w-full">
                    View Subscription Plans
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and account management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Calendar className="h-6 w-6" />
                <span>View Dashboard</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <CreditCard className="h-6 w-6" />
                <span>Manage Subscription</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <User className="h-6 w-6" />
                <span>Edit Profile</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
