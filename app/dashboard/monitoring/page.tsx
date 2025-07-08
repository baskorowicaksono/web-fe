'use client'

export default function MonitoringPage() {
  const indicators = [
    { name: 'GDP Growth Rate', value: '2.8%', status: 'normal', trend: 'up', lastUpdate: '1 hour ago' },
    { name: 'Inflation Rate', value: '3.2%', status: 'warning', trend: 'up', lastUpdate: '30 mins ago' },
    { name: 'Unemployment Rate', value: '4.1%', status: 'normal', trend: 'down', lastUpdate: '2 hours ago' },
    { name: 'Interest Rate', value: '5.25%', status: 'normal', trend: 'stable', lastUpdate: '1 day ago' },
    { name: 'Exchange Rate (USD)', value: '1.08', status: 'critical', trend: 'down', lastUpdate: '15 mins ago' },
    { name: 'Stock Market Index', value: '4,850', status: 'normal', trend: 'up', lastUpdate: 'Real-time' },
  ]

  const alerts = [
    { 
      id: 1, 
      message: 'Exchange rate volatility detected', 
      severity: 'high', 
      time: '5 minutes ago',
      category: 'Currency'
    },
    { 
      id: 2, 
      message: 'Inflation rate approaching target threshold', 
      severity: 'medium', 
      time: '1 hour ago',
      category: 'Monetary Policy'
    },
    { 
      id: 3, 
      message: 'GDP forecast updated', 
      severity: 'low', 
      time: '3 hours ago',
      category: 'Economic Indicators'
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Real-time Monitoring</h1>
        <p className="text-neutral-600 text-lg">
          Monitor economic indicators and market conditions in real-time
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
        {indicators.map((indicator, index) => (
          <div key={index} className="card group hover:shadow-medium transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-neutral-900">{indicator.name}</h3>
              <div className={`w-3 h-3 rounded-full ${
                indicator.status === 'normal' ? 'bg-green-500' :
                indicator.status === 'warning' ? 'bg-yellow-500' :
                'bg-red-500'
              }`} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-neutral-900">{indicator.value}</span>
              <div className="flex items-center space-x-1">
                {indicator.trend === 'up' && (
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                  </svg>
                )}
                {indicator.trend === 'down' && (
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                  </svg>
                )}
                {indicator.trend === 'stable' && (
                  <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                )}
              </div>
            </div>
            <p className="text-xs text-neutral-500 mt-2">Updated {indicator.lastUpdate}</p>
          </div>
        ))}
      </div>

      {/* Alerts and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up">
        {/* Active Alerts */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Active Alerts</h3>
            <span className="badge badge-primary">{alerts.length} Active</span>
          </div>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 bg-neutral-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.severity === 'high' ? 'bg-red-500' :
                  alert.severity === 'medium' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-neutral-900">{alert.message}</p>
                    <span className={`badge ${
                      alert.severity === 'high' ? 'badge-error' :
                      alert.severity === 'medium' ? 'badge-warning' :
                      'badge-primary'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">{alert.category}</span>
                    <span className="text-xs text-neutral-500">{alert.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Live Market Data</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-neutral-600">Live</span>
            </div>
          </div>
          <div className="h-64 bg-neutral-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <p className="text-neutral-600 font-medium">Real-time Chart</p>
              <p className="text-neutral-500 text-sm">Live data visualization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}