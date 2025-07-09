import * as XLSX from 'xlsx'
import { ExcelSectorData } from './types/sector-mapping'

export class ExcelUtils {
  // Create Excel template file
  static createExcelTemplate(): void {
    const headers = [
      'Sector Code',
      'Existing Sector KLM Type',
      'Existing Sector Group',
      'New Sector KLM Type',
      'New Sector Group',
    ]

    const sampleData = [
      [
        '001100',
        'Sektor Tertentu',
        'Sektor Perumahan, termasuk Perumahan Rakyat',
        '',
        '',
      ],
      [
        '001120',
        'Non KLM',
        'Non KLM',
        '',
        '',
      ]
    ]

    // Create workbook
    const wb = XLSX.utils.book_new()
    
    // Create worksheet with headers and sample data
    const wsData = [headers, ...sampleData]
    const ws = XLSX.utils.aoa_to_sheet(wsData)

    // Set column widths
    const colWidths = [
      { wch: 15 }, // Sector Code
      { wch: 35 }, // Existing Sector KLM Type
      { wch: 30 }, // Existing Sector Group
      { wch: 35 }, // New Sector KLM Type
      { wch: 30 }, // New Sector Group
    ]
    ws['!cols'] = colWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sector Mapping Template')

    // Download file
    XLSX.writeFile(wb, 'sector_mapping_template.xlsx')
  }

  // Parse Excel file
  static async parseExcelFile(file: File): Promise<ExcelSectorData[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          
          // Convert to JSON, skipping header row
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: [
                'Sector Code',
                'Existing Sector KLM Type',
                'Existing Sector Group',
                'New Sector KLM Type',
                'New Sector Group',
            ],
            range: 1 // Skip header row
          })

          // Transform data
          const mappings: ExcelSectorData[] = jsonData.map((row: any) => ({
            sectorCode: String(row['Sector Code']).trim(), // Will be generated or extracted
            sectorType: String(row['Existing Sector KLM Type']).trim(),
            existingGroup: String(row['Existing Group']).trim(),
            newGroupType: String(row['New Sector KLM Type']).trim()?? '',
            newGroupName: String(row['New Sector Group']).trim()?? '',
            effectiveDate: new Date().toISOString().split('T')[0],      // Currently set to today, will be updated in the future
            endDate: '',
            createdBy: row.createdBy?? 'system',
            updatedBy: row.updatedBy?? '',
            approvedBy: row.approvedBy?? ''
          })).filter((row : ExcelSectorData) => row.sectorType && row.sectorCode) // Filter out empty rows
          
          resolve(mappings)
        } catch (error) {
          reject(new Error('Failed to parse Excel file'))
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }

  // Validate Excel data
  static validateExcelData(mappings: ExcelSectorData[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    mappings.forEach((mapping, index) => {
      const rowNum = index + 2 // Account for header and 0-based index
      
      if (!mapping.sectorType) {
        errors.push(`Row ${rowNum}: Sector Name is required`)
      }
      
      if (!mapping.existingGroup) {
        errors.push(`Row ${rowNum}: Sector Group is required`)
      }
      
      if (!mapping.effectiveDate) {
        errors.push(`Row ${rowNum}: Effective Start Date is required`)
      }
    })
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}