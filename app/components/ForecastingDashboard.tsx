// app/components/ForecastingDashboard.tsx
'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { TrendingUp, Download } from 'lucide-react'

const forecastData = [
  { month: 'Jan', actual: 2.1, predicted: 2.0, confidence: 0.95 },
  { month: 'Feb', actual: 2.3, predicted: 2.2, confidence: 0.94 },
  { month: 'Mar', actual: 2.5, predicted: 2.4, confidence: 0.96 },
  { month: 'Apr', actual: 2.4, predicted: 2.3, confidence: 0.93 },
  { month: 'May', actual: 2.6, predicted: 2.5, confidence: 0.95 },
  { month: 'Jun', actual: null, predicted: 2.7, confidence: 0.92 },
  { month: 'Jul', actual: null, predicted: 2.8, confidence: 0.91 },
  { month: 'Aug', actual: null, predicted: 2.9, confidence: 0.89 },
]

const models = [
  { id: 1, name: 'Inflation Forecast Model', accuracy: 96.2, lastRun: '2 hours ago', status: 'active' },
  { id: 2, name: 'GDP Growth Predictor', accuracy: 94.8, lastRun: '5 hours ago', status: 'active' },
  { id: 3, name: 'Interest Rate Forecast', accuracy: 92.3, lastRun: '1 day ago', status: 'inactive' },
]

export default function ForecastingDashboard() {
  const [selectedModel, setSelectedModel] = useState(models[0])
  const [timeRange, setTimeRange] = useState('6months')

  return (
    <div className="space-y-6">
      {/* Model Selection */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Active Models</h3>
          <button className="btn-primary">
            <TrendingUp className="h-4 w-4 mr-2" />
            New Model
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {models.map((model) => (
            <div
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedModel.id === model.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{model.name}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  model.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {model.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">Accuracy: {model.accuracy}%</p>
              <p className="text-xs text-gray-500">Last run: {model.lastRun}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{selectedModel.name} - Forecast</h3>
          <div className="flex items-center space-x-2">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1"
            >
              <option value="3months">3 Months</option>
              <option value="6months">6 Months</option>
              <option value="1year">1 Year</option>
            </select>
            <button className="btn-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#0ea5e9" 
                strokeWidth={2}
                name="Actual"
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Predicted"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Accuracy</span>
              <span className="text-sm font-medium text-gray-900">{selectedModel.accuracy}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">RMSE</span>
              <span className="text-sm font-medium text-gray-900">0.12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">MAE</span>
              <span className="text-sm font-medium text-gray-900">0.08</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">R²</span>
              <span className="text-sm font-medium text-gray-900">0.94</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Confidence Intervals</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="confidence" 
                  stroke="#8884d8" 
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}