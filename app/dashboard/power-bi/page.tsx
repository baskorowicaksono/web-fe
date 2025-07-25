'use client'

import { useState, useEffect, useRef } from 'react'
import { ExternalLink, Maximize, Minimize, RefreshCw, Settings, Eye, EyeOff, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface PowerBIEmbedConfig {
  embedUrl: string
  reportId: string
  groupId?: string
  title: string
  description: string
}

export default function PowerBIDashboardPage() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [embedConfig, setEmbedConfig] = useState<PowerBIEmbedConfig>({
    embedUrl: 'https://app.powerbi.com/view?r=eyJrIjoiYTc0ZWJlNzQtMGNmOC00YjczLThmOWUtYzY1MDFkZDc0ZDZjIiwidCI6ImNhMzc0OTJlLWY0MTAtNDI3Yi1hYjM5LTA1NWJkYzE4Y2UwMiIsImMiOjEwfQ%3D%3D', // You'll need to fill this with your actual Power BI embed URL
    reportId: '',
    groupId: '',
    title: 'Financial Analytics Dashboard',
    description: 'Real-time financial metrics and business intelligence'
  })
  const [showFilters, setShowFilters] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const refreshDashboard = () => {
    setIsLoading(true)
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
    setTimeout(() => setIsLoading(false), 1500)
    toast.success('Dashboard refreshed')
  }

  const openInPowerBI = () => {
    if (embedConfig.embedUrl) {
      // Open the full Power BI report in a new tab
      const powerBIUrl = embedConfig.embedUrl.replace('/reportEmbed?', '/view?')
      window.open(powerBIUrl, '_blank')
    } else {
      toast.error('Please configure your Power BI embed URL first')
    }
  }

  const handleConfigSubmit = (config: PowerBIEmbedConfig) => {
    setEmbedConfig(config)
    setShowSettings(false)
    refreshDashboard()
    toast.success('Power BI configuration updated')
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="animate-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Power BI Dashboard</h1>
            <p className="text-neutral-600 text-lg">
              {embedConfig.description}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSettings(true)}
              className="btn-ghost"
              title="Dashboard Settings"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
            <button
              onClick={refreshDashboard}
              className="btn-secondary"
              title="Refresh Dashboard"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={openInPowerBI}
              className="btn-primary"
              title="Open in Power BI"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in Power BI
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Controls */}
      <div className="flex items-center justify-between card animate-slide-up">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
            <span className="text-sm text-neutral-600">
              {isLoading ? 'Loading...' : 'Live Dashboard'}
            </span>
          </div>
          <div className="text-sm text-neutral-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
            title={showFilters ? 'Hide Filters' : 'Show Filters'}
          >
            {showFilters ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          
          <button
            onClick={handleFullscreen}
            className="p-2 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Power BI Embed Container */}
      <div className="relative card overflow-hidden animate-slide-up" style={{ minHeight: '600px' }}>
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
              <p className="text-neutral-600">Loading Power BI Dashboard...</p>
            </div>
          </div>
        )}

        {/* Configuration Prompt (when no embed URL is set) */}
        {!embedConfig.embedUrl && !isLoading && (
          <div className="h-96 flex items-center justify-center bg-neutral-50 rounded-lg">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Configure Power BI Dashboard
              </h3>
              <p className="text-neutral-600 mb-4">
                Add your Power BI embed URL and report details to display your dashboard here.
              </p>
              <button
                onClick={() => setShowSettings(true)}
                className="btn-primary"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configure Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Power BI iFrame */}
        {embedConfig.embedUrl && (
          <iframe
            ref={iframeRef}
            src={embedConfig.embedUrl}
            className="w-full border-none rounded-lg"
            style={{ height: '800px' }}
            title={embedConfig.title}
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              toast.error('Failed to load Power BI dashboard')
            }}
          />
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Dashboard Health</h3>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Status</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Data Refresh</span>
              <span className="text-neutral-900">Auto</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Last Sync</span>
              <span className="text-neutral-900">2 min ago</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Performance</h3>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Load Time</span>
              <span className="text-neutral-900">1.2s</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Queries</span>
              <span className="text-neutral-900">24/min</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Users</span>
              <span className="text-neutral-900">8 active</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            <button 
              onClick={openInPowerBI}
              className="w-full text-left text-sm text-neutral-600 hover:text-primary-600 transition-colors"
            >
              → Open in Power BI
            </button>
            <button 
              onClick={refreshDashboard}
              className="w-full text-left text-sm text-neutral-600 hover:text-primary-600 transition-colors"
            >
              → Refresh Data
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="w-full text-left text-sm text-neutral-600 hover:text-primary-600 transition-colors"
            >
              → Configure Settings
            </button>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <PowerBISettingsModal
          config={embedConfig}
          onSave={handleConfigSubmit}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

// Settings Modal Component
interface SettingsModalProps {
  config: PowerBIEmbedConfig
  onSave: (config: PowerBIEmbedConfig) => void
  onClose: () => void
}

const PowerBISettingsModal = ({ config, onSave, onClose }: SettingsModalProps) => {
  const [formData, setFormData] = useState(config)

  const handleSubmit = () => {
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">
              Power BI Dashboard Configuration
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Dashboard Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="input-field"
                placeholder="Enter dashboard title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="input-field resize-none"
                placeholder="Describe your dashboard..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Power BI Embed URL *
              </label>
              <textarea
                value={formData.embedUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, embedUrl: e.target.value }))}
                rows={4}
                className="input-field resize-none font-mono text-xs"
                placeholder="https://app.powerbi.com/reportEmbed?reportId=..."
              />
              <p className="text-xs text-neutral-500 mt-1">
                Get this URL from your Power BI report's "Embed" section
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Report ID
                </label>
                <input
                  type="text"
                  value={formData.reportId}
                  onChange={(e) => setFormData(prev => ({ ...prev, reportId: e.target.value }))}
                  className="input-field font-mono text-xs"
                  placeholder="12345678-1234-1234-1234-123456789012"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Workspace ID (Optional)
                </label>
                <input
                  type="text"
                  value={formData.groupId}
                  onChange={(e) => setFormData(prev => ({ ...prev, groupId: e.target.value }))}
                  className="input-field font-mono text-xs"
                  placeholder="12345678-1234-1234-1234-123456789012"
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">How to get your embed URL:</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Open your Power BI report</li>
                <li>2. Click "File" → "Embed Report" → "Website or Portal"</li>
                <li>3. Copy the embed URL from the iframe code</li>
                <li>4. Paste it in the field above</li>
              </ol>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-neutral-200">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.embedUrl}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}