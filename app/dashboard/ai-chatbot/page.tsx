'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, FileText, Sparkles, History, Plus, Search, MoreVertical } from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  sources?: string[]
}

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messageCount: number
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Halo! Saya adalah chatbot AI yang dipersonalisasi untuk Anda. Saya bisa membantu anda untuk menganalisa data, menggali insights, dan menjawab pertanyaan seputar makroprudensial. Bagaimana keperluan Anda?',
      role: 'assistant',
      timestamp: new Date(),
      sources: []
    }
  ])
  
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Mock chat sessions
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Analisis Pertumbuhan PDB Sektoral TW I 2025',
      lastMessage: 'Apa faktor utama penyebab turunnya pertumbuhan PDB?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
      messageCount: 8
    },
    {
      id: '2', 
      title: 'RBB Bank Mandiri Januari 2025 dan Analisis Risiko',
      lastMessage: 'Bagaimana proyeksi pertumbuhan kredit dan kaitannya dengan model bisnis bank dalam mencapai target RBB 2025?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      messageCount: 12
    },
    {
      id: '3',
      title: 'Demand Kredit Sektoral Juni 2025',
      lastMessage: 'Analisa sektor yang mengalami perlambatan pertumbuhan kredit paling tinggi untuk periode Juni 2025',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      messageCount: 5
    }
  ])

  // Mock available reports for context
  const availableReports = [
    'Laporan Pertumbuhan PDB Triwulan I 2025.pdf',
    'Target & Risk Assessment Report - PT Bank Mandiri Tbk.pdf',
    'Laporan Keuangan Perusahaan di Indonesia.pdf',
    'Laporan Indikator Ekonomi Triwulan II 2025.pdf'
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateMockResponse(userMessage.content),
        role: 'assistant',
        timestamp: new Date(),
        sources: getRandomSources()
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500 + Math.random() * 1000)
  }

  const generateMockResponse = (userInput: string): string => {
    const responses = [
      `KLM dapat mendorong pertumbuhan kredit dengan mengidentifikasi sektor-sektor yang memiliki daya ungkit tinggi dan mengoptimalkan struktur ekonomi. KLM dapat memperkuat kebijakan insentif untuk sektor-sektor seperti otomotif, pariwisata, dan ekonomi kreatif yang memiliki potensi pertumbuhan kredit tinggi. Dalam beberapa waktu ke belakang, Bank Indonesia sudah melakukan beberapa penguatan KLM melalui insentif pada sektor-sektor ekonomi yang mendorong pertumbuhan kredit. Apakah Anda mau tahu lebih dalam mengenai detail kebijakan KLM dari waktu ke waktu?`
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const getRandomSources = (): string[] => {
    const shuffled = availableReports.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.floor(Math.random() * 3) + 1)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const startNewChat = () => {
    setMessages([
      {
        id: '1',
        content: 'Halo! Saya adalah chatbot AI yang dipersonalisasi untuk Anda. Saya bisa membantu anda untuk menganalisa data, menggali insights, dan menjawab pertanyaan seputar makroprudensial. Bagaimana keperluan Anda?',
        role: 'assistant',
        timestamp: new Date(),
        sources: []
      }
    ])
    setCurrentSession(null)
    setShowHistory(false)
    toast.success('Started new chat')
  }

  const loadChatSession = (session: ChatSession) => {
    setCurrentSession(session)
    setMessages([
      {
        id: '1',
        content: `Loaded conversation: "${session.title}". How can I help you continue this analysis?`,
        role: 'assistant',
        timestamp: new Date(),
        sources: []
      }
    ])
    setShowHistory(false)
    toast.success(`Loaded ${session.title}`)
  }

  const formatTime = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [currentMessage])

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">AI Chatbot</h1>
        <p className="text-neutral-600 text-lg">
          Powered by your uploaded reports • Ask questions, get insights, analyze data
        </p>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden animate-slide-up" style={{ height: 'calc(100vh - 12rem)' }}>
        <div className="flex h-full">
          {/* Chat History Sidebar */}
          <div className={`transition-all duration-300 border-r border-neutral-200 ${
            showHistory ? 'w-80' : 'w-0'
          } overflow-hidden`}>
            <div className="h-full flex flex-col">
              {/* History Header */}
              <div className="p-4 border-b border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900">Riwayat</h3>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={startNewChat}
                  className="btn-primary w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Chat
                </button>
              </div>

              {/* Chat Sessions */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => loadChatSession(session)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 group ${
                      currentSession?.id === session.id
                        ? 'border-primary-200 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-neutral-900 text-sm truncate">
                          {session.title}
                        </h4>
                        <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                          {session.lastMessage}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-neutral-500">
                            {session.messageCount} messages
                          </span>
                          <span className="text-xs text-neutral-500">
                            {formatTime(session.timestamp)}
                          </span>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <button className="p-1 hover:bg-neutral-200 rounded">
                          <MoreVertical className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Chat Interface */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="border-b border-neutral-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    title="Chat History"
                  >
                    <History className="w-5 h-5 text-neutral-600" />
                  </button>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-neutral-900">
                        {currentSession ? currentSession.title : 'Personal AI Assistant'}
                      </h2>
                      <p className="text-sm text-neutral-600">
                        Powered by {availableReports.length} uploaded reports
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={startNewChat}
                  className="btn-ghost"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Chat
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-4 ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 max-w-3xl ${
                    message.role === 'user' ? 'flex justify-end' : ''
                  }`}>
                    <div className={`px-4 py-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-100 text-neutral-900'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>

                    {/* Sources */}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.sources.map((source, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-1 px-2 py-1 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-600 hover:bg-neutral-100 cursor-pointer transition-colors"
                            title={`Referenced from: ${source}`}
                          >
                            <FileText className="w-3 h-3" />
                            <span>{source}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className={`mt-1 text-xs text-neutral-500 ${
                      message.role === 'user' ? 'text-right' : ''
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-neutral-100 px-4 py-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-neutral-600">Analyzing your reports...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-neutral-200 p-6">
              <div className="flex items-end space-x-4">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about your financial reports, market trends, risk analysis..."
                    rows={1}
                    className="input-field resize-none"
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isLoading}
                  className="w-12 h-12 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Available Reports Info */}
              <div className="mt-4 flex items-center space-x-2 text-xs text-neutral-500">
                <FileText className="w-3 h-3" />
                <span>
                  Using {availableReports.length} reports: {availableReports.slice(0, 2).join(', ')}
                  {availableReports.length > 2 && ` and ${availableReports.length - 2} more`}
                </span>
              </div>

              {/* Quick Suggestions */}
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "Analyze Q4 performance trends",
                  "Compare risk levels by sector", 
                  "Summarize key market insights",
                  "What are the main financial highlights?"
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMessage(suggestion)}
                    className="px-3 py-1 text-xs bg-neutral-100 text-neutral-600 rounded-full hover:bg-neutral-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}