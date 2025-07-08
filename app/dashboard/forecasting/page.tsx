'use client'

import { useState } from 'react'

const models = [
  { id: 1, name: 'Inflation Forecast Model', accuracy: 96.2, lastRun: '2 hours ago', status: 'active' },
  { id: 2, name: 'GDP Growth Predictor', accuracy: 94.8, lastRun: '5 hours ago', status: 'active' },
  { id: 3, name: 'Interest Rate Forecast', accuracy: 92.3, lastRun: '1 day ago', status: 'inactive' },
]

export default function ForecastingPage() {
  const [selectedModel, setSelectedModel] = useState(models[0])

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">NTF Forecasting</h1>
        <p className="text-neutral-600 text-lg">
          Neural Tensor Factorization forecasting models for central bank data
        </p>
      </div>

      {/* Model Selection */}
      <div className="card animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Active Models</h3>
          <button className="btn-primary">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            New Model
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {models.map((model) => (
            <div
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-medium ${
                selectedModel.id === model.id
                  ? 'border-primary-500 bg-primary-50 shadow-soft'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-neutral-900">{model.name}</h4>
                <span className={`badge ${
                  model.status === 'active' ? 'badge-success' : 'badge-neutral'
                }`}>
                  {model.status}
                </span>
              </div>
              <p className="text-sm text-neutral-600">Accuracy: {model.accuracy}%</p>
              <p className="text-xs text-neutral-500">Last run: {model.lastRun}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="chart-container animate-slide-up">
        <div className="chart-header">
          <h3 className="chart-title">{selectedModel.name} - Forecast</h3>
          <div className="flex items-center space-x-2">
            <select className="text-sm border border-neutral-200 rounded-lg px-3 py-1 bg-white">
              <option value="3months">3 Months</option>
              <option value="6months">6 Months</option>
              <option value="1year">1 Year</option>
            </select>
            <button className="btn-secondary btn-small">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>
        <div className="h-80 bg-neutral-50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-neutral-600 font-medium">Interactive Forecast Chart</p>
            <p className="text-neutral-500 text-sm">Chart component will be integrated here</p>
          </div>
        </div>
      </div>

      {/* Model Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Model Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-600">Accuracy</span>
              <span className="text-sm font-medium text-neutral-900">{selectedModel.accuracy}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-600">RMSE</span>
              <span className="text-sm font-medium text-neutral-900">0.12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-600">MAE</span>
              <span className="text-sm font-medium text-neutral-900">0.08</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-600">R²</span>
              <span className="text-sm font-medium text-neutral-900">0.94</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Forecasts</h3>
          <div className="space-y-3">
            {[
              { date: 'Dec 2024', actual: 2.1, predicted: 2.0, accuracy: 95.2 },
              { date: 'Nov 2024', actual: 2.3, predicted: 2.2, accuracy: 95.7 },
              { date: 'Oct 2024', actual: 2.5, predicted: 2.4, accuracy: 96.0 },
            ].map((forecast, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{forecast.date}</p>
                  <p className="text-xs text-neutral-500">Actual: {forecast.actual}% | Predicted: {forecast.predicted}%</p>
                </div>
                <span className="text-sm font-medium text-green-600">{forecast.accuracy}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}