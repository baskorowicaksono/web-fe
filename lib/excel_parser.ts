import * as XLSX from 'xlsx'
import { ExcelSectorData } from './types/sector-mapping'

export class ExcelParser {
  static async parseExcelFile(file: File): Promise<ExcelSectorData[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: ['sectorCode', 'sectorType', 'existingGroup', 'newGroupType', 'newGroupName'],
            range: 1 // Skip header row
          })
          
          // Transform data
          const mappings: ExcelSectorData[] = jsonData.map((row: any) => ({
            sectorCode: row.sectorCode?.toString().trim() || '',
            sectorType: row.sectorType?.toString().trim() || '',
            existingGroup: row.existingGroup?.toString().trim() || '',
            newGroupType: row.newGroupType?.toString().trim(),
            newGroupName: row.newGroupName?.toString().trim(),
            effectiveDate: row.effectiveDate?.toString().trim(),
            createdBy: row.createdBy?.toString().trim(),
          })).filter(mapping => mapping.sectorCode) // Filter out empty rows
          
          resolve(mappings)
        } catch (error) {
          reject(new Error('Failed to parse Excel file'))
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }

  static validateMappingData(mappings: ExcelSectorData[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    mappings.forEach((mapping, index) => {
      const rowNum = index + 2 // Account for header and 0-based index
      
      if (!mapping.sectorCode) {
        errors.push(`Row ${rowNum}: Sector Code is required`)
      }
      
      if (!mapping.sectorType) {
        errors.push(`Row ${rowNum}: Sector Type is required`)
      }
      
      if (!mapping.existingGroup) {
        errors.push(`Row ${rowNum}: Existing Group is required`)
      }
      
      // Validate sector code format (assuming 6 digits)
      if (mapping.sectorCode && !/^\d{6}$/.test(mapping.sectorCode)) {
        errors.push(`Row ${rowNum}: Sector Code must be 6 digits`)
      }
    })
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

