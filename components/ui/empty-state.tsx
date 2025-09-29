import React from 'react'

interface EmptyStateProps {
  message: string
  description?: string
  totalCount?: number
  className?: string
}

export function EmptyState({ 
  message, 
  description,
  totalCount,
  className = "h-64" 
}: EmptyStateProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <p className="text-muted-foreground">{message}</p>
        {description && (
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        )}
        {totalCount && totalCount > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            Total data di database: {totalCount}
          </p>
        )}
      </div>
    </div>
  )
}
