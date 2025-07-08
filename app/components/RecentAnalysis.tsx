// app/components/RecentAnalysis.tsx
'use client'

import { FileText, TrendingUp, Clock } from 'lucide-react'

const recentAnalyses = [
  {
    id: 1,
    title: 'Q4 2024 Inflation Forecast',
    type: 'NTF Forecasting',
    status: 'completed',
    timestamp: '2 hours ago',
    accuracy: '96.2%',
  },
  {
    id: 2,
    title: 'Interest Rate Impact Analysis',
    type: 'Predictive Analysis',
    status: 'processing',
    timestamp: '5 hours ago',
    accuracy: 'Pending',
  },
  {
    id: 3,
    title: 'Economic Indicators Report',
    type: 'Monitoring',
    status: 'completed',
    timestamp: '1 day ago',
    accuracy: '94.8%',
  },
]

export default function RecentAnalysis() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Analysis</h3>
        <FileText className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {recentAnalyses.map((analysis) => (
          <div key={analysis.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                analysis.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {analysis.status === 'completed' ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-yellow-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{analysis.title}</p>
                <p className="text-xs text-gray-500">{analysis.type} • {analysis.timestamp}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{analysis.accuracy}</p>
              <p className={`text-xs capitalize ${
                analysis.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {analysis.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}