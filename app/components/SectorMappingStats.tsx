'use client'

import { SectorMapping } from '../../lib/types/sector-mapping'

interface SectorMappingStatsProps {
  mappings: SectorMapping[]
}

export default function SectorMappingStats({ mappings }: SectorMappingStatsProps) {
  const stats = {
    total: mappings.length,
    active: mappings.filter(m => m.status === 'active').length,
    pending: mappings.filter(m => m.status === 'pending_approval').length,
    draft: mappings.filter(m => m.status === 'draft').length,
    upcomingEffective: mappings.filter(m => 
      new Date(m.effectiveStartDate) > new Date() && m.status === 'approved'
    ).length
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <div className="stat-card hover-lift">
        <div className="flex items-center justify-between mb-4">
          <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        <p className="stat-label">Total Mappings</p>
        <p className="stat-value">{stats.total}</p>
      </div>

      <div className="stat-card hover-lift">
        <div className="flex items-center justify-between mb-4">
          <div className="p-4 bg-green-50 rounded-2xl text-green-600">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p className="stat-label">Active</p>
        <p className="stat-value">{stats.active}</p>
      </div>

      <div className="stat-card hover-lift">
        <div className="flex items-center justify-between mb-4">
          <div className="p-4 bg-yellow-50 rounded-2xl text-yellow-600">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p className="stat-label">Pending Approval</p>
        <p className="stat-value">{stats.pending}</p>
      </div>

      <div className="stat-card hover-lift">
        <div className="flex items-center justify-between mb-4">
          <div className="p-4 bg-gray-50 rounded-2xl text-gray-600">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        </div>
        <p className="stat-label">Draft</p>
        <p className="stat-value">{stats.draft}</p>
      </div>

      <div className="stat-card hover-lift">
        <div className="flex items-center justify-between mb-4">
          <div className="p-4 bg-purple-50 rounded-2xl text-purple-600">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4M4 21h16a2 2 0 002-2v-6a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <p className="stat-label">Upcoming</p>
        <p className="stat-value">{stats.upcomingEffective}</p>
      </div>
    </div>
  )
}