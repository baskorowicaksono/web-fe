import { useState, useEffect } from 'react'
import { SectorMapping, SectorMappingFilters, SectorMappingStatsData } from '../types/sector-mapping'
import { sectorMappingApi } from '../api/sector-mapping'
import toast from 'react-hot-toast'

export function useSectorMappings(initialFilters: SectorMappingFilters = {}) {
  const [mappings, setMappings] = useState<SectorMapping[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  })
  const [filters, setFilters] = useState<SectorMappingFilters>(initialFilters)

  // Fetch mappings
  const fetchMappings = async (newFilters?: SectorMappingFilters) => {
    try {
      setLoading(true)
      setError(null)
      
      const filtersToUse = newFilters || filters
      const result = await sectorMappingApi.getSectorMappings(filtersToUse)
      
      setMappings(result.data)
      setPagination(result.pagination)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch mappings'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Upload mappings from Excel
  const uploadMappings = async (
    file: File, 
    sectorName: string, 
    effectiveDate: string
  ): Promise<void> => {
    try {
      setLoading(true)
      const result = await sectorMappingApi.uploadExcel(file, sectorName, effectiveDate)
      
      // Add new mappings to the beginning of the list
      setMappings(prev => [...result.mappings, ...prev])
      
      toast.success(`Successfully uploaded ${result.uploadedCount} sector mappings`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete mappings
  const deleteMappings = async (ids: string[]) => {
    try {
      setLoading(true)
      const result = await sectorMappingApi.deleteSectorMappings(ids)
      
      // Remove deleted mappings from state
      setMappings(prev => prev.filter(mapping => !ids.includes(mapping.id)))
      
      toast.success(`Successfully deleted ${result.deletedCount} mappings`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete mappings'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Approve mappings
  const approveMappings = async (ids: string[]) => {
    try {
      setLoading(true)
      const result = await sectorMappingApi.approveSectorMappings(ids)
      
      // Update status to approved in state
      setMappings(prev => prev.map(mapping => 
        ids.includes(mapping.id) 
          ? { ...mapping, status: 'approved' as const, approvedBy: 'current_user', updatedAt: new Date().toISOString() }
          : mapping
      ))
      
      toast.success(`Successfully approved ${result.approvedCount} mappings`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve mappings'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update mapping
  const updateMapping = async (id: string, updates: Partial<SectorMapping>) => {
    try {
      setLoading(true)
      const updatedMapping = await sectorMappingApi.updateSectorMapping(id, updates)
      
      // Update mapping in state
      setMappings(prev => prev.map(mapping => 
        mapping.id === id ? updatedMapping : mapping
      ))
      
      toast.success('Mapping updated successfully')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update mapping'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update filters and refetch
  const updateFilters = (newFilters: SectorMappingFilters) => {
    setFilters(newFilters)
    fetchMappings(newFilters)
  }

  // Load next page
  const loadNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      const newFilters = { ...filters, page: pagination.page + 1 }
      updateFilters(newFilters)
    }
  }

  // Load previous page
  const loadPreviousPage = () => {
    if (pagination.page > 1) {
      const newFilters = { ...filters, page: pagination.page - 1 }
      updateFilters(newFilters)
    }
  }

  // Initial load
  useEffect(() => {
    fetchMappings()
  }, [])

  return {
    mappings,
    loading,
    error,
    pagination,
    filters,
    uploadMappings,
    deleteMappings,
    approveMappings,
    updateMapping,
    updateFilters,
    loadNextPage,
    loadPreviousPage,
    refresh: fetchMappings
  }
}

// Hook for sector mapping stats
export function useSectorMappingStats() {
  const [stats, setStats] = useState<SectorMappingStatsData>({
    total: 0,
    active: 0,
    pending: 0,
    draft: 0,
    upcomingEffective: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await sectorMappingApi.getStats()
      setStats(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refresh: fetchStats
  }
}

// Hook for dropdown data
export function useSectorDropdowns() {
  const [sectorGroups, setSectorGroups] = useState<any[]>([])
  const [economicSectors, setEconomicSectors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [groupsResult, sectorsResult] = await Promise.all([
        sectorMappingApi.getSectorGroups(),
        sectorMappingApi.getEconomicSectors()
      ])
      
      setSectorGroups(groupsResult)
      setEconomicSectors(sectorsResult)
    } catch (err) {
      toast.error('Failed to fetch dropdown data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    sectorGroups,
    economicSectors,
    loading,
    refresh: fetchData
  }
}