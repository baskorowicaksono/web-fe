'use client'

import { useState } from 'react'
import { SectorMapping } from '../../lib/types/sector-mapping'

interface SectorMappingListProps {
  mappings: SectorMapping[]
  loading: boolean,
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  },
  onNextPage?: () => void
  onPreviousPage?: () => void
  onApprove?: (ids: string[]) => Promise<void>
  onDelete?: (ids: string[]) => Promise<void>
  onUpdate?: (id: string, updates: Partial<SectorMapping>) => Promise<void>
}

export default function SectorMappingList({ mappings, loading }: SectorMappingListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'draft'>('all')
  const [sortBy, setSortBy] = useState<'effectiveStartDate' | 'createdAt' | 'sectorName'>('createdAt')

  const filteredMappings = mappings.filter(mapping => {
    if (filter === 'all') return true
    if (filter === 'pending') return mapping.status === 'pending_approval'
    return mapping.status === filter
  })

  const sortedMappings = [...filteredMappings].sort((a, b) => {
    if (sortBy === 'effectiveStartDate') {
      return new Date(b.effectiveStartDate).getTime() - new Date(a.effectiveStartDate).getTime()
    }
    if (sortBy === 'sectorName') {
      return a.sectorName.localeCompare(b.sectorName)
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const getStatusBadge = (status: SectorMapping['status']) => {
    const badges = {
      draft: 'badge-neutral',
      pending_approval: 'badge-warning',
      active: 'badge-success',
      approved: 'badge-primary'
    }
    
    const labels = {
      draft: 'Draft',
      pending_approval: 'Pending',
      active: 'Active',
      approved: 'Approved'
    }

    return (
      <span className={`badge ${badges[status]}`}>
        {labels[status]}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner w-8 h-8"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-semibold text-neutral-900">Sector Mappings</h3>
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="text-sm border border-neutral-200 rounded-xl px-4 py-2 bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending Approval</option>
            <option value="draft">Draft</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border border-neutral-200 rounded-xl px-4 py-2 bg-white"
          >
            <option value="createdAt">Sort by Created</option>
            <option value="effectiveStartDate">Sort by Effective Date</option>
            <option value="sectorName">Sort by Sector Name</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Whole Effective Sector Name</th>
              <th className="px-6 py-4">Sector Group</th>
              <th className="px-6 py-4">Effective Start Date</th>
              <th className="px-6 py-4">End Date</th>
              <th className="px-6 py-4">Created By</th>
              <th className="px-6 py-4">Updated By</th>
              <th className="px-6 py-4">Approved By</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {sortedMappings.map((mapping) => (
              <tr key={mapping.id} className="table-row">
                <td className="px-6 py-4">
                  <button className="btn-secondary btn-small">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-neutral-900">{mapping.sectorName}</p>
                    <div className="mt-1">
                      {getStatusBadge(mapping.status)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {mapping.sectorGroups.map((group, index) => (
                      <div key={index} className="text-sm text-neutral-600 p-2 bg-neutral-50 rounded-lg">
                        &lt;{group}&gt;
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {new Date(mapping.effectiveStartDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 text-sm">
                  {mapping.endDate ? (
                    new Date(mapping.endDate).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })
                  ) : (
                    <span className="text-neutral-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">{mapping.createdBy}</td>
                <td className="px-6 py-4 text-sm">
                  {mapping.updatedBy || (
                    <span className="text-neutral-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {mapping.approvedBy || (
                    <span className="text-neutral-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedMappings.length === 0 && (
        <div className="text-center py-16">
          <svg className="w-16 h-16 text-neutral-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-neutral-600 font-medium text-lg">No sector mappings found</p>
          <p className="text-neutral-500">Upload your first Excel file to get started</p>
        </div>
      )}
    </div>
  )
}