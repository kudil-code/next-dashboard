import React from 'react'

interface ErrorStateProps {
  error: string
  message?: string
  className?: string
}

export function ErrorState({ 
  error, 
  message = "Pastikan database berjalan dan terhubung",
  className = "h-64" 
}: ErrorStateProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <p className="text-destructive mb-2">Error: {error}</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}
