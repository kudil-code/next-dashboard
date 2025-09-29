import React from 'react'

interface LoadingSpinnerProps {
  message?: string
  className?: string
}

export function LoadingSpinner({ 
  message = "Memuat data...", 
  className = "h-64" 
}: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}
