'use client'

import { useState } from 'react'

export default function AnalysisPage() {
  const [selectedAnalysis, setSelectedAnalysis] = useState('correlation')

  const correlationData = [
    { variable: 'Interest Rate', correlation: 0.85, impact: 'High' },
    { variable: 'GDP Growth', correlation: 0.72, impact: 'Medium' },
    { variable: 'Unemployment', correlation: -0.68, impact: 'Medium' },
    { variable: 'Oil Prices', correlation: 0.43, impact: 'Low' },
    { variable: 'Exchange Rate', correlation: -0.56, impact: 'Low' },
  ]

  const riskFactors = [
    { factor: 'Market Volatility', risk: 'High', impact: 'Severe', probability: 25 },
    { factor: 'Policy Changes', risk: 'Medium', impact: 'Moderate', probability: 40 },
    { factor: 'External Shocks', risk: 'Low', impact: 'Severe', probability: 15 },
    { factor: 'Data Quality', risk: 'Low', impact: 'Minor', probability: 20 },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Predictive Analysis</h1>
        <p className="text-neutral-600 text-lg">
          Advanced analytics and machine learning insights
        </p>
      </div>

      {/* Analysis Type Selector */}
      <div className="card animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Analysis Type</h3>
          <button className="btn-primary">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Run New Analysis
          </button>
        </div>
        <div className="flex space-x-2">
          {[
            { id: 'correlation', label: 'Correlation Analysis', icon: '📊' },
            { id: 'scenario', label: 'Scenario Planning', icon: '⚡' },
            { id: 'risk', label: 'Risk Assessment', icon: '⚠️' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedAnalysis(type.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedAnalysis === type.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <span>{type.icon}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Results */}
      {selectedAnalysis === 'correlation' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Variable Correlations</h3>
            <div className="space-y-4">
              {correlationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{item.variable}</p>
                    <p className="text-xs text-neutral-500">Correlation: {item.correlation.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-20 bg-neutral-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.correlation > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.abs(item.correlation) * 100}%` }}
                      />
                    </div>
                    <span className={`badge ${
                      item.impact === 'High' ? 'badge-error' :
                      item.impact === 'Medium' ? 'badge-warning' :
                      'badge-success'
                    }`}>
                      {item.impact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Impact Analysis</h3>
            <div className="h-64 bg-neutral-50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-neutral-600 font-medium">Correlation Visualization</p>
                <p className="text-neutral-500 text-sm">Interactive chart component</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedAnalysis === 'scenario' && (
        <div className="card animate-slide-up">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">Scenario Planning</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { scenario: 'Base Case', probability: 45, outcome: 2.5, color: 'bg-blue-500' },
              { scenario: 'Optimistic', probability: 25, outcome: 3.2, color: 'bg-green-500' },
              { scenario: 'Pessimistic', probability: 30, outcome: 1.8, color: 'bg-red-500' },
            ].map((scenario, index) => (
              <div key={index} className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-neutral-900">{scenario.scenario}</h4>
                  <span className="text-sm text-neutral-600">{scenario.probability}%</span>
                </div>
                <p className="text-sm text-neutral-600 mb-3">Expected Outcome: {scenario.outcome}%</p>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${scenario.color}`}
                    style={{ width: `${scenario.probability}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedAnalysis === 'risk' && (
        <div className="card animate-slide-up">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Risk Assessment Matrix</h3>
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th>Risk Factor</th>
                  <th>Risk Level</th>
                  <th>Impact</th>
                  <th>Probability</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {riskFactors.map((risk, index) => (
                  <tr key={index} className="table-row">
                    <td className="font-medium">{risk.factor}</td>
                    <td>
                      <span className={`badge ${
                        risk.risk === 'High' ? 'badge-error' :
                        risk.risk === 'Medium' ? 'badge-warning' :
                        'badge-success'
                      }`}>
                        {risk.risk}
                      </span>
                    </td>
                    <td>{risk.impact}</td>
                    <td>{risk.probability}%</td>
                    <td>
                      <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">
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