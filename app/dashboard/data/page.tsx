'use client'

import { useState } from 'react'

export default function DataPage() {
  const [selectedSource, setSelectedSource] = useState('all')

  const dataSources = [
    { 
      id: 1, 
      name: 'Central Bank Database', 
      type: 'Primary',
      status: 'active',
      lastUpdate: '2024-12-01 09:00',
      records: 125420,
      frequency: 'Daily',
      quality: 98.5
    },
    { 
      id: 2, 
      name: 'Economic Indicators API', 
      type: 'External',
      status: 'active',
      lastUpdate: '2024-12-01 08:30',
      records: 89340,
      frequency: 'Real-time',
      quality: 96.2
    },
    { 
      id: 3, 
      name: 'Market Data Feed', 
      type: 'External',
      status: 'warning',
      lastUpdate: '2024-11-30 23:45',
      records: 245680,
      frequency: 'Real-time',
      quality: 94.8
    },
    { 
      id: 4, 
      name: 'Government Statistics', 
      type: 'External',
      status: 'active',
      lastUpdate: '2024-12-01 06:00',
      records: 67890,
      frequency: 'Monthly',
      quality: 99.1
    },
  ]

  const recentJobs = [
    { id: 1, name: 'Monthly Data Sync', status: 'completed', duration: '2m 34s', time: '1 hour ago' },
    { id: 2, name: 'Quality Check - Market Data', status: 'running', duration: '1m 12s', time: 'Running' },
    { id: 3, name: 'Data Validation', status: 'completed', duration: '4m 21s', time: '3 hours ago' },
    { id: 4, name: 'Archive Old Records', status: 'failed', duration: '0m 45s', time: '5 hours ago' },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Data Management</h1>
        <p className="text-neutral-600 text-lg">
          Manage data sources, quality, and synchronization
        </p>
      </div>

      {/* Data Sources Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
          </div>
          <p className="stat-label">Total Records</p>
          <p className="stat-value">528K</p>
          <p className="stat-change positive">+12.3K today</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="stat-label">Data Quality</p>
          <p className="stat-value">97.2%</p>
          <p className="stat-change positive">+0.3%</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="stat-label">Last Sync</p>
          <p className="stat-value">9:00 AM</p>
          <p className="stat-change neutral">On schedule</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="stat-label">Active Sources</p>
          <p className="stat-value">4</p>
          <p className="stat-change neutral">All operational</p>
        </div>
      </div>

      {/* Data Sources Table */}
      <div className="card animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Data Sources</h3>
          <div className="flex items-center space-x-3">
            <select 
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="text-sm border border-neutral-200 rounded-lg px-3 py-1 bg-white"
            >
              <option value="all">All Sources</option>
              <option value="primary">Primary</option>
              <option value="external">External</option>
            </select>
            <button className="btn-primary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Source
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th>Source Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Last Update</th>
                <th>Records</th>
                <th>Quality</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {dataSources.map((source) => (
                <tr key={source.id} className="table-row">
                  <td>
                    <div>
                      <p className="font-medium">{source.name}</p>
                      <p className="text-xs text-neutral-500">{source.frequency}</p>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${source.type === 'Primary' ? 'badge-primary' : 'badge-neutral'}`}>
                      {source.type}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      source.status === 'active' ? 'badge-success' :
                      source.status === 'warning' ? 'badge-warning' :
                      'badge-error'
                    }`}>
                      {source.status}
                    </span>
                  </td>
                  <td className="text-sm">{source.lastUpdate}</td>
                  <td className="font-medium">{source.records.toLocaleString()}</td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{source.quality}%</span>
                      <div className="w-16 bg-neutral-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full" 
                          style={{ width: `${source.quality}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button className="btn-ghost btn-small">Sync</button>
                      <button className="btn-secondary btn-small">Config</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up">
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Jobs</h3>
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    job.status === 'completed' ? 'bg-green-500' :
                    job.status === 'running' ? 'bg-blue-500 animate-pulse' :
                    'bg-red-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{job.name}</p>
                    <p className="text-xs text-neutral-500">Duration: {job.duration}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge ${
                    job.status === 'completed' ? 'badge-success' :
                    job.status === 'running' ? 'badge-primary' :
                    'badge-error'
                  }`}>
                    {job.status}
                  </span>
                  <p className="text-xs text-neutral-500 mt-1">{job.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Data Quality Trends</h3>
          <div className="h-48 bg-neutral-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-neutral-600 font-medium">Quality Trends Chart</p>
              <p className="text-neutral-500 text-sm">Data quality over time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}