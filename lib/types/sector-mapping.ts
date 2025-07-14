export interface SectorMapping {
  id: string
  action: string                    // 'download', 'view', 'edit', etc.
  sectorName: string               // Whole Effective Sector Name
  sectorGroups: string[]           // Array of sector groups
  effectiveStartDate: string       // When mapping becomes effective
  endDate?: string                 // Optional end date
  createdBy: string               // Who created it
  updatedBy?: string              // Who last updated it (optional)
  approvedBy?: string             // Who approved it (optional)
  status: 'draft' | 'active' | 'pending_approval' | 'approved'
  createdAt: string               // ISO timestamp
  updatedAt: string               // ISO timestamp
}

export interface CreateSectorMappingRequest {
  sectorName: string
  groupId: number
  sektorEkonomi: string[]  // Array of sector codes to map
  tipeKelompok: 'NON_KLM' | 'SEKTOR_TERTENTU' | 'HIJAU'
  namaKelompok?: string
  prioritasSektor?: number
  effectiveStartDate: string
  endDate?: string
}

export interface SectorGroup {
  id: number
  namaGrup: string
  deskripsi?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface EconomicSector {
  sektorEkonomi: string
  ket10se?: string
  kategoriUtama?: string
  createdAt: string
}

export interface SectorMappingStatsData {
  total: number
  active: number
  pending: number
  draft: number
  upcomingEffective: number
}

export interface ExcelSectorData {
  sectorCode: string
  sectorType: string              // Maps to sectorName
  existingGroup: string           // Maps to sectorGroups (split by \n)
  newGroupType?: string
  newGroupName?: string
  effectiveDate: string           // Maps to effectiveStartDate
  endDate?: string
  createdBy: string
  updatedBy?: string
  approvedBy?: string
}

export interface SectorMappingFilters {
  status?: 'all' | 'draft' | 'active' | 'pending_approval' | 'approved'
  dateRange?: 'all' | 'today' | 'week' | 'month' | 'quarter'
  sectorCode?: string
  createdBy?: string
  page?: number
  limit?: number
}