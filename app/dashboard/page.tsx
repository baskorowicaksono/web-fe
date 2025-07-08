export default function Dashboard() {
  const stats = [
    {
      label: 'Active Models',
      value: '12',
      change: '+2.5%',
      changeType: 'positive' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      label: 'Forecast Accuracy',
      value: '94.2%',
      change: '+1.2%',
      changeType: 'positive' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Data Sources',
      value: '8',
      change: '0%',
      changeType: 'neutral' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      ),
    },
    {
      label: 'Processing Time',
      value: '2.3s',
      change: '-0.8s',
      changeType: 'positive' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Dashboard</h1>
        <p className="text-neutral-600 text-lg">
          Overview of your central bank analytics platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        {stats.map((stat, index) => (
          <div 
            key={stat.label} 
            className="stat-card" 
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
                {stat.icon}
              </div>
              <span className={`stat-change ${stat.changeType}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up">
        {/* Chart Card */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Performance Overview</h3>
            <button className="btn-secondary btn-small">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
          <div className="h-64 bg-neutral-50 rounded-xl flex items-center justify-center">
            <p className="text-neutral-500">Chart Component Here</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">Recent Analysis</h3>
          <div className="space-y-4">
            {[
              { title: 'Q4 2024 Inflation Forecast', type: 'NTF Forecasting', status: 'completed', accuracy: '96.2%' },
              { title: 'Interest Rate Impact Analysis', type: 'Predictive Analysis', status: 'processing', accuracy: 'Pending' },
              { title: 'Economic Indicators Report', type: 'Monitoring', status: 'completed', accuracy: '94.8%' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    item.status === 'completed' ? 'bg-green-500' : 
                    item.status === 'processing' ? 'bg-amber-500' : 'bg-neutral-300'
                  }`}></div>
                  <div>
                    <p className="font-medium text-neutral-900">{item.title}</p>
                    <p className="text-sm text-neutral-500">{item.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-neutral-900">{item.accuracy}</p>
                  <span className={`badge ${
                    item.status === 'completed' ? 'badge-success' : 
                    item.status === 'processing' ? 'badge-warning' : 'badge-neutral'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}