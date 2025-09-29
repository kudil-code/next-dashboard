"use client"

import { useState, useEffect, useCallback } from 'react'

export interface FetchOptions {
  endpoint: string
  headers?: Record<string, string>
  limit?: number
  requiresAuth?: boolean
}

export interface FetchResult<T> {
  data: T[]
  loading: boolean
  error: string | null
  totalCount: number
  refetch: () => Promise<void>
}

export function useDataFetch<T>(options: FetchOptions): FetchResult<T> {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
      }

      // Add auth token if required
      if (options.requiresAuth) {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No authentication token found')
        }
        headers['Authorization'] = `Bearer ${token}`
      }

      // Prepare endpoint with limit
      const endpoint = options.limit 
        ? `${options.endpoint}${options.endpoint.includes('?') ? '&' : '?'}limit=${options.limit}`
        : options.endpoint

      const response = await fetch(endpoint, { headers })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success && result.data) {
        setData(result.data)
        setTotalCount(result.count || result.pagination?.total || result.data.length)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
      setData([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [options.endpoint, options.headers, options.limit, options.requiresAuth])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    totalCount,
    refetch: fetchData,
  }
}
