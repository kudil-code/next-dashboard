"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/profile')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Dashboard</CardTitle>
          <CardDescription>
            Access your account to view your profile and subscription information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => router.push('/login')} 
            className="w-full"
            size="lg"
          >
            Login to Your Account
          </Button>
          <Button 
            onClick={() => router.push('/signup')} 
            variant="outline" 
            className="w-full"
            size="lg"
          >
            Create New Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
