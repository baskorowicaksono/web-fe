// app/components/DashboardStats.tsx
'use client'

import { TrendingUp, TrendingDown, Activity, Calendar } from 'lucide-react'

const stats = [
  {
    name: 'Active Models',
    value: '12',
    change: '+2.5%',
    trend: 'up',
    icon: Activity,
  },
  {
    name: 'Forecast Accuracy',
    value: '94.2%',
    change: '+1.2%',
    trend: 'up',
    icon: TrendingUp,
  },
  {
    name: 'Data Sources',
    value: '8',
    change: '0%',
    trend: 'neutral',
    icon: Calendar,
  },
  {
    name: 'Processing Time',
    value: '2.3s',
    change: '-0.8s',
    trend: 'down',
    icon: TrendingDown,
  },
]

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.name} className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${
              stat.trend === 'up' ? 'bg-green-100' : 
              stat.trend === 'down' ? 'bg-red-100' : 
              'bg-gray-100'
            }`}>
              <stat.icon className={`h-6 w-6 ${
                stat.trend === 'up' ? 'text-green-600' : 
                stat.trend === 'down' ? 'text-red-600' : 
                'text-gray-600'
              }`} />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <span className={`text-sm font-medium ${
              stat.trend === 'up' ? 'text-green-600' : 
              stat.trend === 'down' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {stat.change}
            </span>
            <span className="text-sm text-gray-500 ml-2">from last month</span>
          </div>
        </div>
      ))}
    </div>
  )
}