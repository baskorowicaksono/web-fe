// app/components/QuickActions.tsx
'use client'

import Link from 'next/link'
import { TrendingUp, BarChart3, FileText, Database } from 'lucide-react'

const quickActions = [
  {
    name: 'New NTF Forecast',
    description: 'Create a new forecasting model',
    href: '/dashboard/forecasting/new',
    icon: TrendingUp,
    color: 'bg-blue-500',
  },
  {
    name: 'Run Analysis',
    description: 'Start predictive analysis',
    href: '/dashboard/analysis/new',
    icon: BarChart3,
    color: 'bg-green-500',
  },
  {
    name: 'Generate Report',
    description: 'Create comprehensive report',
    href: '/dashboard/reports/new',
    icon: FileText,
    color: 'bg-purple-500',
  },
  {
    name: 'Update Data',
    description: 'Refresh data sources',
    href: '/dashboard/data/update',
    icon: Database,
    color: 'bg-orange-500',
  },
]

export default function QuickActions() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className={`p-2 rounded-lg ${action.color}`}>
              <action.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{action.name}</p>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}