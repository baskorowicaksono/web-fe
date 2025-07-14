import { api } from '../auth'
import { SectorMapping, CreateSectorMappingRequest, SectorGroup, EconomicSector, SectorMappingStatsData, SectorMappingFilters } from '../types/sector-mapping'

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const sectorMappingApi = {
  // Get sector mappings with filters and pagination
  async getSectorMappings(filters: SectorMappingFilters = {}): Promise<PaginatedResponse<SectorMapping>> {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })

    const response = await api.get(`/sector-mappings?${params.toString()}`)
    return response.data
  },

  // Create new sector mapping
  async createSectorMapping(data: CreateSectorMappingRequest): Promise<SectorMapping> {
    const response = await api.post('/sector-mappings', data)
    return response.data.data
  },

  // Update sector mapping
  async updateSectorMapping(id: string, updates: Partial<CreateSectorMappingRequest>): Promise<SectorMapping> {
    const response = await api.put(`/sector-mappings/${id}`, updates)
    return response.data.data
  },

  // Approve sector mappings
  async approveSectorMappings(ids: string[]): Promise<{ approvedCount: number }> {
    const response = await api.post('/sector-mappings/approve', { ids })
    return response.data.data
  },

  // Delete sector mappings
  async deleteSectorMappings(ids: string[]): Promise<{ deletedCount: number }> {
    const response = await api.delete('/sector-mappings', { data: { ids } })
    return response.data.data
  },

  // Upload Excel file
  async uploadExcel(file: File, sectorName: string, effectiveDate: string): Promise<{ uploadedCount: number; mappings: SectorMapping[] }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('sectorName', sectorName)
    formData.append('effectiveDate', effectiveDate)

    const response = await api.post('/sector-mappings/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data.data
  },

  // Get sector groups for dropdown
  async getSectorGroups(): Promise<SectorGroup[]> {
    const response = await api.get('/sector-mappings/sector-groups')
    return response.data.data
  },

  // Get economic sectors for dropdown
  async getEconomicSectors(): Promise<EconomicSector[]> {
    const response = await api.get('/sector-mappings/economic-sectors')
    return response.data.data
  },

  // Get statistics
  async getStats(): Promise<SectorMappingStatsData> {
    const response = await api.get('/sector-mappings/stats')
    return response.data.data
  }
}