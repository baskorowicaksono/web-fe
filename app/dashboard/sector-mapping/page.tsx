'use client'

import { useState } from 'react'
import SectorMappingList from '../../components/SectorMappingList'
import SectorMappingStats from '../../components/SectorMappingStats'
import SectorMappingFilters from '../../components/SectorMappingFilter'
import UploadSectorModal from '../../components/UploadSectorModal'
import { useSectorMappings, useSectorMappingStats } from '../../../lib/hooks/useSectorMapping'
import { ExcelUtils } from '../../../lib/excel-utils'
import * as XLSX from 'xlsx'
import toast from 'react-hot-toast'

export default function SectorMappingPage() {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all' as const,
    dateRange: 'all' as const,
    sectorCode: '',
    createdBy: ''
  })

  // Use the updated hooks
  const {
    mappings,
    loading,
    error,
    pagination,
    uploadMappings,
    deleteMappings,
    approveMappings,
    updateMapping,
    updateFilters,
    loadNextPage,
    loadPreviousPage
  } = useSectorMappings(filters)

  const { stats, loading: statsLoading } = useSectorMappingStats()

  const handleUploadSuccess = async (file: File, sectorName: string, effectiveDate: string) => {
    try {
      await uploadMappings(file, sectorName, effectiveDate)
      setShowUploadModal(false)
    } catch (error) {
      console.error('Upload error:', error)
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
      
      const exportData = mappings.map(mapping => [
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

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
    updateFilters({ ...newFilters, page: 1 }) // Reset to first page when filters change
  }

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
        <SectorMappingStats stats={stats} loading={statsLoading} />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between animate-slide-up">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary btn-large"
            disabled={loading}
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
          onFiltersChange={handleFiltersChange}
          onExport={handleExport}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Mappings List */}
      <div className="animate-slide-up">
        <SectorMappingList 
          mappings={mappings}
          loading={loading}
          pagination={pagination}
          onNextPage={loadNextPage}
          onPreviousPage={loadPreviousPage}
          onApprove={approveMappings}
          onDelete={deleteMappings}
          onUpdate={updateMapping}
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