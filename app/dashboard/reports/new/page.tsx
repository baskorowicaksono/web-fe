// app/dashboard/reports/new/page.tsx
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, X, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface FormData {
  title: string
  description: string
  category: string
  tags: string
  reportDate: string
  author: string
  department: string
  confidentiality: string
  version: string
}

export default function NewReportPage() {
  const router = useRouter()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    tags: '',
    reportDate: '',
    author: '',
    department: '',
    confidentiality: 'public',
    version: '1.0'
  })

  const categories = [
    { value: 'buku', label: 'Buku' },
    { value: 'laporan', label: 'Laporan' },
    { value: 'risalah', label: 'Risalah' },
    { value: 'in-pn', label: 'IN/PN' },
    { value: 'other', label: 'Other' }
  ]

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0])
    }
  }

  const handleFileSelection = (file: File) => {
    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file only')
      return
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB')
      return
    }

    setUploadedFile(file)
    toast.success('File selected successfully!')
    
    // Auto-fill title if empty
    if (!formData.title) {
      const fileName = file.name.replace(/\.[^/.]+$/, "")
      setFormData(prev => ({ ...prev, title: fileName }))
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0])
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast.success('File removed')
  }

  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const simulateUpload = async () => {
    setIsUploading(true)
    setUploadProgress(0)
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setUploadProgress(i)
    }
    
    setIsUploading(false)
    toast.success('Report uploaded successfully!')
    
    // Redirect back to reports page
    setTimeout(() => {
      router.push('/dashboard/reports')
    }, 1500)
  }

  const handleSubmit = () => {
    if (!uploadedFile) {
      toast.error('Please select a PDF file to upload')
      return
    }
    
    if (!formData.title || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    simulateUpload()
  }

  const handleSaveDraft = () => {
    if (uploadedFile || formData.title) {
      toast.success('Draft saved successfully!')
    } else {
      toast.error('Nothing to save as draft')
    }
  }

  const isFormValid = uploadedFile && formData.title && formData.category

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-4 animate-slide-up">
        <Link 
          href="/dashboard/reports"
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Upload New Report</h1>
          <p className="text-neutral-600 mt-1">Upload and catalog PDF reports to the system</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* File Upload Section */}
        <div className="card animate-slide-up">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Upload PDF File</h3>
          
          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-neutral-300 hover:border-neutral-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-primary-50 rounded-full">
                  <Upload className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-neutral-900">
                    Drop your PDF file here, or{' '}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-primary-600 hover:text-primary-700 underline"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-sm text-neutral-500 mt-1">
                    Maximum file size: 50MB • PDF files only
                  </p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          ) : (
            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{uploadedFile.name}</p>
                    <p className="text-sm text-neutral-500">
                      {formatFileSize(uploadedFile.size)} • PDF Document
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-neutral-500" />
                </button>
              </div>
              
              {isUploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-neutral-600 mb-2">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Report Information */}
        <div className="card animate-slide-up">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">Report Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Report Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                className="input-field"
                placeholder="Enter report title..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => updateFormData('category', e.target.value)}
                className="input-field"
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Report Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Report Date
              </label>
              <input
                type="date"
                value={formData.reportDate}
                onChange={(e) => updateFormData('reportDate', e.target.value)}
                className="input-field"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Author/Creator
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => updateFormData('author', e.target.value)}
                className="input-field"
                placeholder="Report author name..."
              />
            </div>

            {/* Department */}
            <div>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => updateFormData('department', e.target.value)}
                className="input-field"
                placeholder="Department or division..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => updateFormData('tags', e.target.value)}
                className="input-field"
                placeholder="Comma-separated tags..."
              />
              <p className="text-xs text-neutral-500 mt-1">
                Separate multiple tags with commas (e.g., quarterly, analysis, market)
              </p>
            </div>

            {/* Version */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Version
              </label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => updateFormData('version', e.target.value)}
                className="input-field"
                placeholder="1.0"
              />
            </div>

            {/* Confidentiality */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Confidentiality Level
              </label>
              <select
                value={formData.confidentiality}
                onChange={(e) => updateFormData('confidentiality', e.target.value)}
                className="input-field"
              >
                <option value="public">Public</option>
                <option value="internal">Internal Use</option>
                <option value="confidential">Confidential</option>
                <option value="restricted">Restricted</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={4}
                className="input-field resize-none"
                placeholder="Brief description of the report content and purpose..."
              />
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {uploadedFile && isFormValid && (
          <div className="card animate-slide-up">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Upload Summary</h3>
            <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-neutral-600">File:</span>
                  <span className="ml-2 font-medium">{uploadedFile.name}</span>
                </div>
                <div>
                  <span className="text-neutral-600">Size:</span>
                  <span className="ml-2 font-medium">{formatFileSize(uploadedFile.size)}</span>
                </div>
                <div>
                  <span className="text-neutral-600">Title:</span>
                  <span className="ml-2 font-medium">{formData.title}</span>
                </div>
                <div>
                  <span className="text-neutral-600">Category:</span>
                  <span className="ml-2 font-medium">
                    {categories.find(c => c.value === formData.category)?.label}
                  </span>
                </div>
                {formData.author && (
                  <div>
                    <span className="text-neutral-600">Author:</span>
                    <span className="ml-2 font-medium">{formData.author}</span>
                  </div>
                )}
                {formData.department && (
                  <div>
                    <span className="text-neutral-600">Department:</span>
                    <span className="ml-2 font-medium">{formData.department}</span>
                  </div>
                )}
                <div>
                  <span className="text-neutral-600">Confidentiality:</span>
                  <span className="ml-2 font-medium capitalize">{formData.confidentiality}</span>
                </div>
                <div>
                  <span className="text-neutral-600">Version:</span>
                  <span className="ml-2 font-medium">{formData.version}</span>
                </div>
              </div>
              {formData.tags && (
                <div className="pt-2 border-t border-neutral-200">
                  <span className="text-neutral-600 text-sm">Tags:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.tags.split(',').map((tag, index) => (
                      <span 
                        key={index}
                        className="badge badge-neutral"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between animate-slide-up">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="btn-secondary"
          >
            Save as Draft
          </button>

          <div className="flex space-x-3">
            <Link
              href="/dashboard/reports"
              className="btn-ghost"
            >
              Cancel
            </Link>
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || isUploading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <div className="flex items-center space-x-2">
                  <div className="loading-spinner w-4 h-4"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Upload Report</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}