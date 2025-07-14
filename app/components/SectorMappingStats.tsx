'use client'

import { SectorMappingStatsData } from "@/lib/types/sector-mapping"

interface SectorMappingStatsProps {
  stats: SectorMappingStatsData
  loading?: boolean
}

export default function SectorMappingStats({ stats, loading = false }: SectorMappingStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="stat-card animate-pulse">
            <div className="h-16 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
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
        <p className="stat-value">{stats.total.toLocaleString()}</p>
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
        <p className="stat-value">{stats.active.toLocaleString()}</p>
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
        <p className="stat-value">{stats.pending.toLocaleString()}</p>
      </div>

      <div className="stat-card hover-lift">
        <div className="flex items-center justify-between mb-4">
          <div className="p-4 bg-gray-50 rounded-2xl text-gray-600">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707L16.293 6.293A1 1 0 0015.586 6H7a2 2 0 00-2 2v11a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <p className="stat-label">Draft</p>
        <p className="stat-value">{stats.draft.toLocaleString()}</p>
      </div>

      <div className="stat-card hover-lift">
        <div className="flex items-center justify-between mb-4">
          <div className="p-4 bg-purple-50 rounded-2xl text-purple-600">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <p className="stat-label">Upcoming Effective</p>
        <p className="stat-value">{stats.upcomingEffective.toLocaleString()}</p>
      </div>
    </div>
  )
}