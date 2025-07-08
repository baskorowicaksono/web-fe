'use client'

import { useState } from 'react'

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  
  const reports = [
    { 
      id: 1, 
      title: 'Monthly Economic Analysis', 
      description: 'Comprehensive analysis of economic indicators and trends',
      type: 'Monthly',
      status: 'completed',
      generatedAt: '2024-12-01',
      size: '2.4 MB'
    },
    { 
      id: 2, 
      title: 'Quarterly Forecast Report', 
      description: 'Detailed quarterly forecasting and predictions',
      type: 'Quarterly',
      status: 'processing',
      generatedAt: '2024-11-28',
      size: 'Processing...'
    },
    { 
      id: 3, 
      title: 'Risk Assessment Summary', 
      description: 'Risk analysis and mitigation strategies',
      type: 'Weekly',
      status: 'completed',
      generatedAt: '2024-11-25',
      size: '1.8 MB'
    },
    { 
      id: 4, 
      title: 'Policy Impact Analysis', 
      description: 'Analysis of recent policy changes and their impact',
      type: 'Ad-hoc',
      status: 'completed',
      generatedAt: '2024-11-20',
      size: '3.1 MB'
    },
  ]

  const reportTemplates = [
    { name: 'Economic Indicators', description: 'Standard economic indicators report', icon: '📊' },
    { name: 'Forecast Analysis', description: 'Predictive analysis and forecasting', icon: '🔮' },
    { name: 'Risk Assessment', description: 'Comprehensive risk evaluation', icon: '⚠️' },
    { name: 'Custom Report', description: 'Build your own custom report', icon: '🔧' },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Reports</h1>
        <p className="text-neutral-600 text-lg">
          Generate and manage comprehensive analytical reports
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
        {reportTemplates.map((template, index) => (
          <button
            key={index}
            className="card hover:shadow-medium transition-all duration-200 text-left group"
          >
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">{template.icon}</span>
              <h3 className="font-medium text-neutral-900 group-hover:text-primary-600 transition-colors">
                {template.name}
              </h3>
            </div>
            <p className="text-sm text-neutral-600">{template.description}</p>
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="card animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Recent Reports</h3>
          <div className="flex items-center space-x-3">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border border-neutral-200 rounded-lg px-3 py-1 bg-white"
            >
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="quarterly">This Quarter</option>
              <option value="yearly">This Year</option>
            </select>
            <button className="btn-primary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Report
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  report.status === 'completed' ? 'bg-green-500' :
                  report.status === 'processing' ? 'bg-yellow-500' :
                  'bg-neutral-300'
                }`} />
                <div>
                  <h4 className="font-medium text-neutral-900">{report.title}</h4>
                  <p className="text-sm text-neutral-600">{report.description}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="badge badge-neutral">{report.type}</span>
                    <span className="text-xs text-neutral-500">Generated: {report.generatedAt}</span>
                    <span className="text-xs text-neutral-500">Size: {report.size}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {report.status === 'completed' && (
                  <>
                    <button className="btn-ghost btn-small">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button className="btn-secondary btn-small">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </>
                )}
                {report.status === 'processing' && (
                  <div className="flex items-center space-x-2">
                    <div className="loading-spinner w-4 h-4" />
                    <span className="text-sm text-neutral-600">Processing...</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}