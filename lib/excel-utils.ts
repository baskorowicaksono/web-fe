import * as XLSX from 'xlsx'
import { ExcelSectorData } from './types/sector-mapping'

export class ExcelUtils {

  // Create Excel template file with data from database
  static async createExcelTemplate(): Promise<void> {
    try {
      // Headers (keeping the same as requested)
      const headers = [
        'Sandi Sektor Ekonomi',
        'Jenis Kelompok Eksisting',
        'Kelompok Sektor Eksisting',
        'Jenis Kelompok Baru',
        'Kelompok Sektor Baru'
      ]

      const templateData = await this.fetchTemplateDataFromAPI()
      const wsData = [headers, ...templateData]

      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.aoa_to_sheet(wsData)

      const colWidths = [
        { wch: 20 },
        { wch: 25 },
        { wch: 50 },
        { wch: 25 },
        { wch: 50 },
      ]
      ws['!cols'] = colWidths

      XLSX.utils.book_append_sheet(wb, ws, 'Sector Mapping Template')

      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `sector_mapping_template_${timestamp}.xlsx`

      XLSX.writeFile(wb, filename)

    } catch (error) {
      console.error('Failed to create template from database:', error)
      this.createStaticTemplate()
    }
  }

  // Fetch template data from your web-be API
  private static async fetchTemplateDataFromAPI(): Promise<string[][]> {
    try {
      const economicSectors = await this.fetchEconomicSectorsFromAPI()
      const activeMappings = await this.fetchActiveSectorMappingsFromAPI()
      const templateData: string[][] = []

      for (const sector of economicSectors) {
        // Find the latest active mapping for this sector
        const mapping = activeMappings.find(m => m.sektorEkonomi === sector.sektorEkonomi)

        const row = [
          sector.sektorEkonomi,                    // Column A: Sector Code (sektor_ekonomi)
          mapping?.tipeKelompok || '',             // Column B: Active tipe_kelompok or blank
          mapping?.namaKelompok || '',             // Column C: Active nama_kelompok or blank  
          '',                                      // Column D: Empty (for user input)
          ''                                       // Column E: Empty (for user input)
        ]

        templateData.push(row)
      }
      return templateData
    } catch (error) {
      console.error('Error fetching template data from API:', error)
      throw error
    }
  }

  // Fetch economic sectors from your web-be API
  private static async fetchEconomicSectorsFromAPI(): Promise<Array<{
    sektorEkonomi: string
    ket10se?: string
  }>> {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
      const response = await fetch(`${apiBaseUrl}/api/sector-mappings/economic-sectors`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.data || []
    } catch (error) {
      console.error('Error fetching economic sectors from API:', error)
      return this.getFallbackEconomicSectors()
    }
  }

  // Fetch active sector group mappings from your web-be API
  private static async fetchActiveSectorMappingsFromAPI(): Promise<Array<{
    sektorEkonomi: string
    tipeKelompok: string
    namaKelompok: string
    groupId: number
    tanggalAwal: string
    tanggalAkhir?: string
    isActive: boolean
  }>> {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
      const response = await fetch(`${apiBaseUrl}/api/sector-mappings/active-mappings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      return result.data || []
      
    } catch (error) {
      console.error('Error fetching active sector mappings from API:', error)
      // Fallback to static data if API fails
      return this.getFallbackActiveMappings()
    }
  }

  // Fallback economic sectors (from your schema)
  private static getFallbackEconomicSectors(): Array<{
    sektorEkonomi: string
    ket10se?: string
  }> {
    return [
      { sektorEkonomi: '001110', ket10se: 'Housing Sector' },
      { sektorEkonomi: '001120', ket10se: 'Housing Sector' },
      { sektorEkonomi: '001130', ket10se: 'Housing Sector' },
      { sektorEkonomi: '001210', ket10se: 'Housing Sector' },
      { sektorEkonomi: '001220', ket10se: 'Housing Sector' },
      { sektorEkonomi: '001230', ket10se: 'Non KLM Sector' },
      { sektorEkonomi: '001300', ket10se: 'Non KLM Sector' },
      { sektorEkonomi: '002100', ket10se: 'Non KLM Sector' },
      { sektorEkonomi: '002200', ket10se: 'Non KLM Sector' },
      { sektorEkonomi: '002300', ket10se: 'Non KLM Sector' },
      { sektorEkonomi: '002900', ket10se: 'Non KLM Sector' },
      { sektorEkonomi: '003100', ket10se: 'Non KLM Sector' },
      { sektorEkonomi: '003200', ket10se: 'Non KLM Sector' },
      { sektorEkonomi: '003300', ket10se: 'Non KLM Sector' },
      { sektorEkonomi: '003900', ket10se: 'Non KLM Sector' },
      { sektorEkonomi: '011110', ket10se: 'Agriculture Sector' },
      { sektorEkonomi: '011130', ket10se: 'Agriculture Sector' },
      { sektorEkonomi: '011140', ket10se: 'Agriculture Sector' },
      { sektorEkonomi: '031111', ket10se: 'Fishery Sector' },
      { sektorEkonomi: '050000', ket10se: 'Mining Sector' },
      { sektorEkonomi: '101000', ket10se: 'Manufacturing Sector' },
      { sektorEkonomi: '102000', ket10se: 'Manufacturing Sector' },
      { sektorEkonomi: '380000', ket10se: 'Green Sector' }
    ]
  }

  // Fallback active mappings (based on your schema structure)
  private static getFallbackActiveMappings(): Array<{
    sektorEkonomi: string
    tipeKelompok: string
    namaKelompok: string
    groupId: number
    tanggalAwal: string
    tanggalAkhir?: string
    isActive: boolean
  }> {
    return [
      // Housing sector mappings (SEKTOR_TERTENTU)
      { sektorEkonomi: '001110', tipeKelompok: 'Sektor Tertentu', namaKelompok: 'Sektor Perumahan, termasuk Perumahan Rakyat', groupId: 1, tanggalAwal: '2024-01-01', isActive: true },
      { sektorEkonomi: '001120', tipeKelompok: 'Sektor Tertentu', namaKelompok: 'Sektor Perumahan, termasuk Perumahan Rakyat', groupId: 1, tanggalAwal: '2024-01-01', isActive: true },
      { sektorEkonomi: '001130', tipeKelompok: 'Sektor Tertentu', namaKelompok: 'Sektor Perumahan, termasuk Perumahan Rakyat', groupId: 1, tanggalAwal: '2024-01-01', isActive: true },
      { sektorEkonomi: '001210', tipeKelompok: 'Sektor Tertentu', namaKelompok: 'Sektor Perumahan, termasuk Perumahan Rakyat', groupId: 1, tanggalAwal: '2024-01-01', isActive: true },
      { sektorEkonomi: '001220', tipeKelompok: 'Sektor Tertentu', namaKelompok: 'Sektor Perumahan, termasuk Perumahan Rakyat', groupId: 1, tanggalAwal: '2024-01-01', isActive: true },
      
      // Non-KLM sectors
      { sektorEkonomi: '001230', tipeKelompok: 'Non KLM', namaKelompok: 'Non KLM', groupId: 2, tanggalAwal: '2024-01-01', isActive: true },
      { sektorEkonomi: '001300', tipeKelompok: 'Non KLM', namaKelompok: 'Non KLM', groupId: 2, tanggalAwal: '2024-01-01', isActive: true },
      { sektorEkonomi: '002100', tipeKelompok: 'Non KLM', namaKelompok: 'Non KLM', groupId: 2, tanggalAwal: '2024-01-01', isActive: true },
      { sektorEkonomi: '002200', tipeKelompok: 'Non KLM', namaKelompok: 'Non KLM', groupId: 2, tanggalAwal: '2024-01-01', isActive: true },
      { sektorEkonomi: '002300', tipeKelompok: 'Non KLM', namaKelompok: 'Non KLM', groupId: 2, tanggalAwal: '2024-01-01', isActive: true },
      { sektorEkonomi: '002900', tipeKelompok: 'Non KLM', namaKelompok: 'Non KLM', groupId: 2, tanggalAwal: '2024-01-01', isActive: true },
      { sektorEkonomi: '003100', tipeKelompok: 'Non KLM', namaKelompok: 'Non KLM', groupId: 2, tanggalAwal: '2024-01-01', isActive: true },
      { sektorEkonomi: '003200', tipeKelompok: 'Non KLM', namaKelompok: 'Non KLM', groupId: 2, tanggalAwal: '2024-01-01', isActive: true },
      { sektorEkonomi: '003300', tipeKelompok: 'Non KLM', namaKelompok: 'Non KLM', groupId: 2, tanggalAwal: '2024-01-01', isActive: true },
      { sektorEkonomi: '003900', tipeKelompok: 'Non KLM', namaKelompok: 'Non KLM', groupId: 2, tanggalAwal: '2024-01-01', isActive: true },
      
      // Agriculture, trade, and industry sectors (SEKTOR_TERTENTU)
      { sektorEkonomi: '011110', tipeKelompok: 'Sektor Tertentu', namaKelompok: 'Sektor Pertanian, Perdagangan, dan Industri Pengolahan', groupId: 3, tanggalAwal: '2024-01-01', isActive: true },
      { sektorEkonomi: '011130', tipeKelompok: 'Sektor Tertentu', namaKelompok: 'Sektor Pertanian, Perdagangan, dan Industri Pengolahan', groupId: 3, tanggalAwal: '2024-01-01', isActive: true },
      { sektorEkonomi: '011140', tipeKelompok: 'Sektor Tertentu', namaKelompok: 'Sektor Pertanian, Perdagangan, dan Industri Pengolahan', groupId: 3, tanggalAwal: '2024-01-01', isActive: true },
      { sektorEkonomi: '031111', tipeKelompok: 'Sektor Tertentu', namaKelompok: 'Sektor Pertanian, Perdagangan, dan Industri Pengolahan', groupId: 3, tanggalAwal: '2024-01-01', isActive: true },
      { sektorEkonomi: '101000', tipeKelompok: 'Sektor Tertentu', namaKelompok: 'Sektor Pertanian, Perdagangan, dan Industri Pengolahan', groupId: 3, tanggalAwal: '2024-01-01', isActive: true },
      { sektorEkonomi: '102000', tipeKelompok: 'Sektor Tertentu', namaKelompok: 'Sektor Pertanian, Perdagangan, dan Industri Pengolahan', groupId: 3, tanggalAwal: '2024-01-01', isActive: true },
      
      // Green sector (HIJAU)
      { sektorEkonomi: '380000', tipeKelompok: 'Hijau', namaKelompok: 'Hijau', groupId: 4, tanggalAwal: '2024-01-01', isActive: true }
    ]
  }

  // Fallback static template (same as simplified version)
  private static createStaticTemplate(): void {
    const headers = [
      'Sandi Sektor Ekonomi',
      'Jenis Kelompok Eksisting', 
      'Kelompok Sektor Eksisting',
      'Jenis Kelompok Baru',
      'Kelompok Sektor Baru'
    ]

    const fallbackEconomicSectors = this.getFallbackEconomicSectors()
    const fallbackMappings = this.getFallbackActiveMappings()
    
    // Create a map for quick lookup
    const mappingMap = new Map<string, any>()
    fallbackMappings.forEach(mapping => {
      mappingMap.set(mapping.sektorEkonomi, mapping)
    })
    
    // Generate template data
    const templateData = fallbackEconomicSectors.map(sector => {
      const mapping = mappingMap.get(sector.sektorEkonomi)
      return [
        sector.sektorEkonomi,
        mapping?.tipeKelompok || '',
        mapping?.namaKelompok || '',
        '',
        ''
      ]
    })

    // Create workbook
    const wb = XLSX.utils.book_new()
    const wsData = [headers, ...templateData]
    const ws = XLSX.utils.aoa_to_sheet(wsData)

    // Set column widths
    const colWidths = [
      { wch: 20 }, { wch: 25 }, { wch: 50 }, { wch: 25 }, { wch: 50 }
    ]
    ws['!cols'] = colWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sector Mapping Template')

    // Download file
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `sector_mapping_template_fallback_${timestamp}.xlsx`
    XLSX.writeFile(wb, filename)
  }

  // Parse Excel file (updated to handle Indonesian headers)
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
              'Sandi Sektor Ekonomi',
              'Jenis Kelompok Eksisting',
              'Kelompok Sektor Eksisting', 
              'Jenis Kelompok Baru',
              'Kelompok Sektor Baru'
            ],
            range: 1 // Skip header row
          })

          // Transform data to match your interface
          const mappings: ExcelSectorData[] = jsonData.map((row: any) => ({
            sectorCode: String(row['Sandi Sektor Ekonomi'] || '').trim(),
            sectorType: String(row['Jenis Kelompok Eksisting'] || '').trim(),
            existingGroup: String(row['Kelompok Sektor Eksisting'] || '').trim(),
            newGroupType: String(row['Jenis Kelompok Baru'] || '').trim(),
            newGroupName: String(row['Kelompok Sektor Baru'] || '').trim(),
            effectiveDate: new Date().toISOString().split('T')[0],
            endDate: '',
            createdBy: 'system',
            updatedBy: '',
            approvedBy: ''
          })).filter((row: ExcelSectorData) => row.sectorCode) // Filter out empty rows
          
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
      
      if (!mapping.sectorCode) {
        errors.push(`Row ${rowNum}: Sandi Sektor Ekonomi is required`)
      }
      
      // Validate sector code format (6 digits)
      if (mapping.sectorCode && !/^\d{6}$/.test(mapping.sectorCode)) {
        errors.push(`Row ${rowNum}: Sandi Sektor Ekonomi must be 6 digits`)
      }
      
      // If user filled new group type, group name is also required
      if (mapping.newGroupType && !mapping.newGroupName) {
        errors.push(`Row ${rowNum}: Kelompok Sektor Baru is required when Jenis Kelompok Baru is provided`)
      }
      
      if (mapping.newGroupName && !mapping.newGroupType) {
        errors.push(`Row ${rowNum}: Jenis Kelompok Baru is required when Kelompok Sektor Baru is provided`)
      }

      // Validate tipe_kelompok values against enum
      if (mapping.newGroupType) {
        const validTypes = ['Non KLM', 'Sektor Tertentu', 'Hijau']
        if (!validTypes.includes(mapping.newGroupType)) {
          errors.push(`Row ${rowNum}: Jenis Kelompok Baru must be one of: ${validTypes.join(', ')}`)
        }
      }

      // Business rule validation
      if (mapping.newGroupType === 'Non KLM' && mapping.newGroupName !== 'Non KLM') {
        errors.push(`Row ${rowNum}: When Jenis Kelompok Baru is "Non KLM", Kelompok Sektor Baru must also be "Non KLM"`)
      }

      if (mapping.newGroupType === 'Hijau' && mapping.newGroupName !== 'Hijau') {
        errors.push(`Row ${rowNum}: When Jenis Kelompok Baru is "Hijau", Kelompok Sektor Baru must also be "Hijau"`)
      }

      if (mapping.newGroupType === 'Sektor Tertentu' && 
          (mapping.newGroupName === 'Non KLM' || mapping.newGroupName === 'Hijau')) {
        errors.push(`Row ${rowNum}: When Jenis Kelompok Baru is "Sektor Tertentu", Kelompok Sektor Baru cannot be "Non KLM" or "Hijau"`)
      }
    })
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Save new mappings to database via API (using your backend service)
  static async saveMappingsToDatabase(
    mappings: ExcelSectorData[], 
    effectiveDate: string,
    createdBy: string
  ): Promise<void> {
    try {
      // Filter only rows with new mappings
      const newMappings = mappings.filter(row => 
        row.newGroupType && row.newGroupName
      )
      
      if (newMappings.length === 0) {
        throw new Error('No new mappings to save')
      }
      
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'
      const response = await fetch(`${apiBaseUrl}/api/sector-mappings/batch-upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          mappings: newMappings.map(mapping => ({
            sektorEkonomi: mapping.sectorCode,
            tipeKelompok: mapping.newGroupType,
            namaKelompok: mapping.newGroupName,
            effectiveStartDate: effectiveDate,
            createdBy
          }))
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to save mappings')
      }
      
      const result = await response.json()
      console.log('Mappings saved successfully:', result)
      
    } catch (error) {
      console.error('Error saving mappings to database:', error)
      throw error
    }
  }

  private static getAuthToken(): string | null {
    return localStorage.getItem('authToken') || null
  }
}