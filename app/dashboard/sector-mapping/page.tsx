'use client'

import { useState } from 'react'
import SectorMappingList from '../../components/SectorMappingList'
import SectorMappingStats from '../../components/SectorMappingStats'
import SectorMappingFilters from '../../components/SectorMappingFilter'
import UploadSectorModal from '../../components/UploadSectorModal'
import { SectorMapping } from '../../../lib/types/sector-mapping'
import { ExcelUtils } from '../../../lib/excel-utils'
import * as XLSX from 'xlsx'
import toast from 'react-hot-toast'

const mockSectorMappings: SectorMapping[] = [
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

export default function SectorMappingPage() {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [sectorMappings, setSectorMappings] = useState<SectorMapping[]>(mockSectorMappings)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    sectorCode: '',
    createdBy: ''
  })

  const handleUploadSuccess = async (file: File, sectorName: string, effectiveDate: string) => {
    setIsLoading(true)
    
    try {
      // Parse the Excel file
      const excelData = await ExcelUtils.parseExcelFile(file)
      
      // Create new mappings from Excel data
      const newMappings: SectorMapping[] = excelData.map((data, index) => ({
        id: `new_${Date.now()}_${index}`,
        action: 'download',
        sectorName: data.sectorType,
        sectorGroups: data.existingGroup.split('\n').filter(g => g.trim()),
        effectiveStartDate: data.effectiveDate,
        endDate: data.endDate,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
        approvedBy: data.approvedBy,
        status: 'draft' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))

      setSectorMappings(prev => [...newMappings, ...prev])
      setShowUploadModal(false)
      toast.success(`Successfully uploaded ${newMappings.length} sector mappings from Excel file`)
      
    } catch (error) {
      toast.error('Failed to process Excel file')
      console.error('Upload error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadTemplate = () => {
    try {
      ExcelUtils.createExcelTemplate()
      toast.success('Excel template downloaded successfully')
    } catch (error) {
      toast.error('Failed to download template')
      console.error('Download error:', error)
    }
  }

  const handleExport = () => {
    try {
      // Create Excel export with current data
      const headers = [
        'Action',
        'Whole Effective Sector Name',
        'Sector Group',
        'Effective Start Date',
        'End Date',
        'Created By',
        'Updated By',
        'Approved By'
      ]
      
      const exportData = filteredMappings.map(mapping => [
        'Download',
        mapping.sectorName,
        mapping.sectorGroups.map(g => `<${g}>`).join('\n'),
        new Date(mapping.effectiveStartDate).toLocaleDateString('en-GB'),
        mapping.endDate ? new Date(mapping.endDate).toLocaleDateString('en-GB') : '',
        mapping.createdBy,
        mapping.updatedBy || '',
        mapping.approvedBy || ''
      ])

      // Create workbook
      const wb = XLSX.utils.book_new()
      const wsData = [headers, ...exportData]
      const ws = XLSX.utils.aoa_to_sheet(wsData)

      // Set column widths
      const colWidths = [
        { wch: 15 }, { wch: 35 }, { wch: 30 }, { wch: 18 },
        { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
      ]
      ws['!cols'] = colWidths

      XLSX.utils.book_append_sheet(wb, ws, 'Sector Mappings')
      XLSX.writeFile(wb, `sector_mappings_export_${new Date().toISOString().split('T')[0]}.xlsx`)
      
      toast.success('Export completed successfully')
    } catch (error) {
      toast.error('Failed to export data')
      console.error('Export error:', error)
    }
  }

  // Apply filters to mappings
  const filteredMappings = sectorMappings.filter(mapping => {
    if (filters.status !== 'all' && mapping.status !== filters.status) return false
    if (filters.sectorCode && !mapping.sectorName.toLowerCase().includes(filters.sectorCode.toLowerCase())) return false
    if (filters.createdBy && !mapping.createdBy.toLowerCase().includes(filters.createdBy.toLowerCase())) return false
    
    if (filters.dateRange !== 'all') {
      const createdDate = new Date(mapping.createdAt)
      const now = new Date()
      
      switch (filters.dateRange) {
        case 'today':
          if (createdDate.toDateString() !== now.toDateString()) return false
          break
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          if (createdDate < weekAgo) return false
          break
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          if (createdDate < monthAgo) return false
          break
        case 'quarter':
          const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          if (createdDate < quarterAgo) return false
          break
      }
    }
    
    return true
  })

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Sector Mapping Administration</h1>
        <p className="text-neutral-600 text-lg">
          Manage economic sector classifications and mappings
        </p>
      </div>

      {/* Statistics */}
      <div className="animate-slide-up">
        <SectorMappingStats mappings={sectorMappings} />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between animate-slide-up">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary btn-large"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Excel File
          </button>
          <button
            onClick={handleDownloadTemplate}
            className="btn-secondary btn-large"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Template
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="animate-slide-up">
        <SectorMappingFilters 
          onFiltersChange={setFilters}
          onExport={handleExport}
        />
      </div>

      {/* Mappings List */}
      <div className="animate-slide-up">
        <SectorMappingList 
          mappings={filteredMappings}
          loading={isLoading}
        />
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadSectorModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  )
}