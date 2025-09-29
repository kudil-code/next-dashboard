"use client"

import React from 'react'
import { useDataFetch } from '@/hooks/use-data-fetch'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorState } from '@/components/ui/error-state'
import { EmptyState } from '@/components/ui/empty-state'
import { DataTable } from './data-table'

interface DataTableWrapperProps<T> {
  endpoint: string
  requiresAuth?: boolean
  limit?: number
  emptyMessage: string
  emptyDescription?: string
  errorMessage?: string
  loadingMessage?: string
  showTotalCount?: boolean
  dataTransform?: (item: any) => T
}

export function DataTableWrapper<T>({
  endpoint,
  requiresAuth = false,
  limit = 1000,
  emptyMessage,
  emptyDescription,
  errorMessage,
  loadingMessage,
  showTotalCount = true,
  dataTransform,
}: DataTableWrapperProps<T>) {
  const { data, loading, error, totalCount } = useDataFetch<T>({
    endpoint,
    requiresAuth,
    limit,
  })

  // Transform data if transform function provided
  const transformedData = dataTransform ? data.map(dataTransform) : data

  if (loading) {
    return <LoadingSpinner message={loadingMessage} />
  }

  if (error) {
    return <ErrorState error={error} message={errorMessage} />
  }

  if (transformedData.length === 0) {
    return (
      <EmptyState
        message={emptyMessage}
        description={emptyDescription}
        totalCount={showTotalCount ? totalCount : undefined}
      />
    )
  }

  return (
    <div>
      {showTotalCount && totalCount > 0 && (
        <div className="mb-4 px-4 lg:px-6">
          <p className="text-sm text-muted-foreground">
            Menampilkan {transformedData.length} dari {totalCount} data
          </p>
        </div>
      )}
      <DataTable data={transformedData} />
    </div>
  )
}
