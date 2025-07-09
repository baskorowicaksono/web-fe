'use client'

import { useState, useRef } from 'react'
import { ExcelSectorData } from '../../lib/types/sector-mapping'
import { ExcelUtils } from '../../lib/excel-utils'
import toast from 'react-hot-toast'

interface UploadSectorModalProps {
  onClose: () => void
  onSuccess: (file: File, sectorName: string, effectiveDate: string) => void
}

export default function UploadSectorModal({ onClose, onSuccess }: UploadSectorModalProps) {
  const [formData, setFormData] = useState({
    sectorName: '',
    effectiveDate: '',
    file: null as File | null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [previewData, setPreviewData] = useState<ExcelSectorData[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Please upload only Excel files (.xlsx or .xls)')
      return
    }

    setFormData(prev => ({ ...prev, file }))

    // Parse Excel file for preview
    try {
      const data = await ExcelUtils.parseExcelFile(file)
      
      // Validate data
      const validation = ExcelUtils.validateExcelData(data)
      if (!validation.isValid) {
        toast.error('File validation failed: ' + validation.errors.join(', '))
        return
      }

      setPreviewData(data)
      setShowPreview(true)
      toast.success(`Successfully parsed ${data.length} records`)
    } catch (error) {
      toast.error('Error reading Excel file. Please check the format.')
      console.error('File parsing error:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.file || !formData.sectorName || !formData.effectiveDate) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)

    try {
      await onSuccess(formData.file, formData.sectorName, formData.effectiveDate)
    } catch (error) {
      toast.error('Failed to upload sector mappings')
      console.error('Upload error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-semibold text-neutral-900">Upload Sector Mapping</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sector Name Input */}
          <div className="form-group">
            <label className="form-label">
              Sector Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.sectorName}
              onChange={(e) => setFormData(prev => ({ ...prev, sectorName: e.target.value }))}
              className="input-field"
              placeholder="Enter sector name (e.g., KLM Economical Sector)"
              required
            />
          </div>

          {/* Effective Date Input */}
          <div className="form-group">
            <label className="form-label">
              Effective Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.effectiveDate}
              onChange={(e) => setFormData(prev => ({ ...prev, effectiveDate: e.target.value }))}
              className="input-field"
              required
            />
          </div>

          {/* File Upload - Excel Only */}
          <div className="form-group">
            <label className="form-label">
              Upload Excel File <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-8 text-center hover:border-primary-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                required
              />
              <div className="space-y-4">
                <svg className="w-16 h-16 text-neutral-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-primary"
                  >
                    Choose Excel File
                  </button>
                  <p className="text-neutral-600 mt-3">or drag and drop</p>
                </div>
                <p className="text-sm text-neutral-500">
                  Excel files (.xlsx, .xls) up to 10MB
                </p>
                {formData.file && (
                  <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ {formData.file.name}
                    </p>
                    <p className="text-xs text-green-600">
                      Size: {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Data */}
          {showPreview && previewData.length > 0 && (
            <div className="form-group">
              <label className="form-label">Data Preview</label>
              <div className="border border-neutral-200 rounded-2xl overflow-hidden">
                <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200">
                  <p className="text-sm font-medium text-neutral-900">
                    Found {previewData.length} records in Excel file
                  </p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase">
                          Sector Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase">
                          Sector Group
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase">
                          Effective Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase">
                          Created By
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {previewData.slice(0, 10).map((row, index) => (
                        <tr key={index} className="hover:bg-neutral-50">
                          <td className="px-6 py-4 text-sm text-neutral-900">{row.sectorType}</td>
                          <td className="px-6 py-4 text-sm text-neutral-600">{row.existingGroup}</td>
                          <td className="px-6 py-4 text-sm text-neutral-600">{row.effectiveDate}</td>
                          <td className="px-6 py-4 text-sm text-neutral-600">{row.createdBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {previewData.length > 10 && (
                    <div className="px-6 py-4 bg-neutral-50 text-sm text-neutral-600 text-center">
                      ... and {previewData.length - 10} more records
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-8 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading || !formData.file}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="loading-spinner w-5 h-5 mr-3"></div>
                  Uploading...
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Mapping
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}