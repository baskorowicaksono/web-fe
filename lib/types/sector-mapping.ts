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