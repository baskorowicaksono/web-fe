'use client'

import { useState, useEffect } from 'react'
import { SectorMapping, ExcelSectorData } from '../types/sector-mapping'
import { ExcelUtils } from '../excel-utils'

export function useSectorMappings() {
  const [mappings, setMappings] = useState<SectorMapping[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadMappings = async (
    file: File, 
    sectorName: string, 
    effectiveDate: string
  ): Promise<void> => {
    setLoading(true)
    try {
      // Parse Excel file
      const excelData = await ExcelUtils.parseExcelFile(file)
      
      // Create new mappings with the correct interface structure
      const newMappings: SectorMapping[] = excelData.map((data, index) => ({
        id: `new_${Date.now()}_${index}`,
        action: 'download', // ← Added action field
        sectorName: data.sectorType || sectorName, // Use from Excel or fallback to form input
        sectorGroups: data.existingGroup ? data.existingGroup.split('\n').filter(g => g.trim()) : ['Default Group'], // ← Added sectorGroups
        effectiveStartDate: data.effectiveDate || effectiveDate, // ← Renamed from effectiveDate
        endDate: data.endDate, // Optional field
        createdBy: data.createdBy || 'current_user',
        updatedBy: data.updatedBy, // Optional field
        approvedBy: data.approvedBy, // Optional field
        status: 'draft' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString() // ← Added updatedAt field
      }))

      setMappings(prev => [...newMappings, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteMappings = async (ids: string[]) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Remove mappings from state
      setMappings(prev => prev.filter(mapping => !ids.includes(mapping.id)))
    } catch (err) {
      setError('Failed to delete mappings')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const approveMappings = async (ids: string[]) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update status to approved
      setMappings(prev => prev.map(mapping => 
        ids.includes(mapping.id) 
          ? { ...mapping, status: 'approved' as const, approvedBy: 'current_user', updatedAt: new Date().toISOString() }
          : mapping
      ))
    } catch (err) {
      setError('Failed to approve mappings')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateMapping = async (id: string, updates: Partial<SectorMapping>) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update mapping in state
      setMappings(prev => prev.map(mapping => 
        mapping.id === id 
          ? { ...mapping, ...updates, updatedAt: new Date().toISOString() }
          : mapping
      ))
    } catch (err) {
      setError('Failed to update mapping')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchMappings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data with correct interface structure
      const mockMappings: SectorMapping[] = [
        {
          id: '1',
          action: 'download',
          sectorName: 'KLM Economical Sector since Apr 2025',
          sectorGroups: ['Sector Group 1', 'Sector Group 2', 'Sector Group n'],
          effectiveStartDate: '2025-04-01',
          createdBy: 'xxx',
          approvedBy: 'xxx',
          status: 'approved',
          createdAt: '2024-12-01T10:00:00Z',
          updatedAt: '2024-12-01T10:00:00Z'
        },
        {
          id: '2',
          action: 'download',
          sectorName: 'KLM Economical Sector since Jan 2025',
          sectorGroups: ['Sector Group 1', 'Sector Group 2', 'Sector Group n'],
          effectiveStartDate: '2025-01-01',
          endDate: '2025-03-31',
          createdBy: 'xxx',
          updatedBy: 'xxx',
          approvedBy: 'xxx',
          status: 'active',
          createdAt: '2024-11-01T10:00:00Z',
          updatedAt: '2024-11-01T10:00:00Z'
        }
      ]
      
      setMappings(mockMappings)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch mappings')
    } finally {
      setLoading(false)
    }
  }

  // Load initial data
  useEffect(() => {
    fetchMappings()
  }, [])

  return {
    mappings,
    loading,
    error,
    uploadMappings,
    deleteMappings,
    approveMappings,
    updateMapping,
    refresh: fetchMappings
  }
}

// Alternative simple version if you don't need the full hook functionality
export function useSimpleSectorMappings() {
  const [mappings, setMappings] = useState<SectorMapping[]>([
    {
      id: '1',
      action: 'download',
      sectorName: 'KLM Economical Sector since Apr 2025',
      sectorGroups: ['Sector Group 1', 'Sector Group 2', 'Sector Group n'],
      effectiveStartDate: '2025-04-01',
      createdBy: 'xxx',
      approvedBy: 'xxx',
      status: 'approved',
      createdAt: '2024-12-01T10:00:00Z',
      updatedAt: '2024-12-01T10:00:00Z'
    },
    {
      id: '2',
      action: 'download',
      sectorName: 'KLM Economical Sector since Jan 2025',
      sectorGroups: ['Sector Group 1', 'Sector Group 2', 'Sector Group n'],
      effectiveStartDate: '2025-01-01',
      endDate: '2025-03-31',
      createdBy: 'xxx',
      updatedBy: 'xxx',
      approvedBy: 'xxx',
      status: 'active',
      createdAt: '2024-11-01T10:00:00Z',
      updatedAt: '2024-11-01T10:00:00Z'
    }
  ])
  
  const [loading, setLoading] = useState(false)

  const addMappings = (newMappings: SectorMapping[]) => {
    setMappings(prev => [...newMappings, ...prev])
  }

  return {
    mappings,
    loading,
    addMappings,
    setMappings
  }
}