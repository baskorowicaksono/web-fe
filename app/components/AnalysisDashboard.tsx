// app/components/AnalysisDashboard.tsx
'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts'
import { Brain, Zap, Target, AlertTriangle } from 'lucide-react'

const correlationData = [
  { variable: 'Interest Rate', correlation: 0.85, impact: 'High' },
  { variable: 'GDP Growth', correlation: 0.72, impact: 'Medium' },
  { variable: 'Unemployment', correlation: -0.68, impact: 'Medium' },
  { variable: 'Oil Prices', correlation: 0.43, impact: 'Low' },
  { variable: 'Exchange Rate', correlation: -0.56, impact: 'Low' },
]

const scenarioData = [
  { scenario: 'Base Case', probability: 0.45, outcome: 2.5 },
  { scenario: 'Optimistic', probability: 0.25, outcome: 3.2 },
  { scenario: 'Pessimistic', probability: 0.30, outcome: 1.8 },
]

const riskFactors = [
  { factor: 'Market Volatility', risk: 'High', impact: 'Severe', probability: 0.25 },
  { factor: 'Policy Changes', risk: 'Medium', impact: 'Moderate', probability: 0.40 },
  { factor: 'External Shocks', risk: 'Low', impact: 'Severe', probability: 0.15 },
  { factor: 'Data Quality', risk: 'Low', impact: 'Minor', probability: 0.20 },
]

export default function AnalysisDashboard() {
  const [selectedAnalysis, setSelectedAnalysis] = useState('correlation')

  return (
    <div className="space-y-6">
      {/* Analysis Type Selector */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Analysis Type</h3>
          <button className="btn-primary">
            <Brain className="h-4 w-4 mr-2" />
            Run New Analysis
          </button>
        </div>
        <div className="flex space-x-2">
          {[
            { id: 'correlation', label: 'Correlation Analysis', icon: Target },
            { id: 'scenario', label: 'Scenario Planning', icon: Zap },
            { id: 'risk', label: 'Risk Assessment', icon: AlertTriangle },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedAnalysis(type.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedAnalysis === type.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <type.icon className="h-4 w-4" />
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Results */}
      {selectedAnalysis === 'correlation' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Variable Correlations</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={correlationData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[-1, 1]} />
                  <YAxis dataKey="variable" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="correlation">
                    {correlationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.correlation > 0 ? '#10b981' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Analysis</h3>
            <div className="space-y-4">
              {correlationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.variable}</p>
                    <p className="text-xs text-gray-500">Correlation: {item.correlation.toFixed(2)}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.impact === 'High' ? 'bg-red-100 text-red-800' :
                    item.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedAnalysis === 'scenario' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario Outcomes</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={scenarioData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="probability" name="Probability" />
                  <YAxis dataKey="outcome" name="Outcome" />
                  <Tooltip />
                  <Scatter name="Scenarios" dataKey="outcome" fill="#0ea5e9" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario Details</h3>
            <div className="space-y-4">
              {scenarioData.map((scenario, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{scenario.scenario}</h4>
                    <span className="text-sm text-gray-600">{(scenario.probability * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-sm text-gray-600">Expected Outcome: {scenario.outcome}%</p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${scenario.probability * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedAnalysis === 'risk' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment Matrix</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Factor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Impact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Probability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {riskFactors.map((risk, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {risk.factor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        risk.risk === 'High' ? 'bg-red-100 text-red-800' :
                        risk.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {risk.risk}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {risk.impact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(risk.probability * 100).toFixed(0)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-primary-600 hover:text-primary-900 text-sm">
                        Mitigate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

