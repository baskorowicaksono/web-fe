// app/components/DataUpdateStatus.tsx
'use client'

import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function DataUpdateStatus() {
  const lastUpdate = new Date(2024, 11, 1) // December 1, 2024
  const nextUpdate = new Date(2025, 0, 1) // January 1, 2025
  const daysUntilUpdate = Math.ceil((nextUpdate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Data Update Status</h3>
        <Calendar className="h-5 w-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Last Update</p>
            <p className="text-sm text-gray-500">
              {lastUpdate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Next Update</p>
            <p className="text-sm text-gray-500">
              {nextUpdate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            daysUntilUpdate <= 7 ? 'bg-orange-100' : 'bg-gray-100'
          }`}>
            <AlertCircle className={`h-5 w-5 ${
              daysUntilUpdate <= 7 ? 'text-orange-600' : 'text-gray-600'
            }`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Days Until Update</p>
            <p className="text-sm text-gray-500">{daysUntilUpdate} days</p>
          </div>
        </div>
      </div>
    </div>
  )
}