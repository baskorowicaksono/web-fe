'use client'

import { useState } from 'react'

interface FilterState {
  status: string
  dateRange: string
  sectorCode: string
  createdBy: string
}

interface SectorMappingFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  onExport: () => void
}

export default function SectorMappingFilters({ onFiltersChange, onExport }: SectorMappingFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    dateRange: 'all',
    sectorCode: '',
    createdBy: ''
  })

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters = {
      status: 'all',
      dateRange: 'all',
      sectorCode: '',
      createdBy: ''
    }
    setFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">Filters</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={clearFilters}
            className="btn-ghost"
          >
            Clear All
          </button>
          <button
            onClick={onExport}
            className="btn-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Status Filter */}
        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="input-field rounded-xl"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="form-group">
          <label className="form-label">Date Range</label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="input-field rounded-xl"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>

        {/* Sector Name Filter */}
        <div className="form-group">
          <label className="form-label">Sector Name</label>
          <input
            type="text"
            value={filters.sectorCode}
            onChange={(e) => handleFilterChange('sectorCode', e.target.value)}
            className="input-field rounded-xl"
            placeholder="Search by sector name..."
          />
        </div>

        {/* Created By Filter */}
        <div className="form-group">
          <label className="form-label">Created By</label>
          <input
            type="text"
            value={filters.createdBy}
            onChange={(e) => handleFilterChange('createdBy', e.target.value)}
            className="input-field rounded-xl"
            placeholder="Search by creator..."
          />
        </div>
      </div>
    </div>
  )
}