import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface SectorCode {
  code: string
  name?: string
  description?: string
}

export interface ActiveMapping {
  sectorCode: string
  tipe_kelompok: string
  nama_kelompok: string
  isActive: boolean
  effectiveDate?: Date
  endDate?: Date
}

// Interface for raw database results from $queryRaw
interface RawSectorCodeResult {
  sector_code: string
}

interface RawActiveMappingResult {
  sector_code: string
  tipe_kelompok: string
  nama_kelompok: string
  is_active: boolean
  effective_date: Date
  end_date: Date | null
}

interface RawLatestActiveMappingResult {
  sector_code: string
  tipe_kelompok: string
  nama_kelompok: string
  effective_date: Date
  end_date: Date | null
  row_num: number
}

// Interface for template data
export interface TemplateData {
  sectorCode: string
  tipe_kelompok: string
  nama_kelompok: string
}

// Interface for save mappings parameters
export interface SaveMappingInput {
  sectorCode: string
  newGroupType?: string
  newGroupName?: string
  effectiveDate?: Date
  userId?: string
}

export class SectorService {
  static async getAllSectorCodes(): Promise<string[]> {
    try {
      const sectors = await prisma.$queryRaw<RawSectorCodeResult[]>`
        SELECT DISTINCT sector_code
        FROM economic_sectors
        ORDER BY sector_code ASC
      `
      
      return sectors.map((sector: RawSectorCodeResult) => sector.sector_code)
    } catch (error: unknown) {
      console.error('Error fetching sector codes:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(`Failed to fetch sector codes from database: ${errorMessage}`)
    }
  }

  /**
   * Fetch active mappings from sector_group_mappings table  
   * Based on your requirement: "latest active mapping for tipe_kelompok and nama_kelompok"
   */
  static async getActiveSectorMappings(): Promise<ActiveMapping[]> {
    try {
      // Replace with your actual database query
      // This is a placeholder - adjust table name and column names as needed
      const mappings = await prisma.$queryRaw<RawActiveMappingResult[]>`
        SELECT 
          sector_code,
          tipe_kelompok,
          nama_kelompok,
          is_active,
          effective_date,
          end_date
        FROM sector_group_mappings 
        WHERE is_active = true
        ORDER BY sector_code ASC, effective_date DESC
      `
      
      return mappings.map((mapping: RawActiveMappingResult): ActiveMapping => ({
        sectorCode: mapping.sector_code,
        tipe_kelompok: mapping.tipe_kelompok,
        nama_kelompok: mapping.nama_kelompok,
        isActive: mapping.is_active,
        effectiveDate: mapping.effective_date,
        endDate: mapping.end_date || undefined
      }))
    } catch (error: unknown) {
      console.error('Error fetching active mappings:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(`Failed to fetch active sector mappings from database: ${errorMessage}`)
    }
  }

  /**
   * Get template data combining sector codes with their active mappings
   * This generates the data structure needed for the Excel template
   */
  static async getTemplateData(): Promise<TemplateData[]> {
    try {
      // Get all sector codes
      const sectorCodes: string[] = await this.getAllSectorCodes()
      
      // Get active mappings
      const activeMappings: ActiveMapping[] = await this.getActiveSectorMappings()
      
      // Create a map for quick lookup
      const mappingMap = new Map<string, ActiveMapping>()
      activeMappings.forEach((mapping: ActiveMapping) => {
        mappingMap.set(mapping.sectorCode, mapping)
      })
      
      // Combine data according to requirements
      const templateData: TemplateData[] = sectorCodes.map((sectorCode: string): TemplateData => {
        const mapping: ActiveMapping | undefined = mappingMap.get(sectorCode)
        
        return {
          sectorCode,
          tipe_kelompok: mapping?.tipe_kelompok || '',    // Column B: Latest active tipe_kelompok or blank
          nama_kelompok: mapping?.nama_kelompok || ''     // Column C: Latest active nama_kelompok or blank
        }
      })
      
      return templateData
    } catch (error: unknown) {
      console.error('Error generating template data:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(`Failed to generate template data: ${errorMessage}`)
    }
  }

  /**
   * Alternative method if you need to get the most recent active mapping per sector
   * This handles cases where there might be multiple active mappings
   */
  static async getLatestActiveMappings(): Promise<ActiveMapping[]> {
    try {
      // This query gets the most recent active mapping for each sector code
      const mappings = await prisma.$queryRaw<RawLatestActiveMappingResult[]>`
        WITH ranked_mappings AS (
          SELECT
            sector_code,
            tipe_kelompok,
            nama_kelompok,
            effective_date,
            end_date,
            ROW_NUMBER() OVER (
              PARTITION BY sector_code
              ORDER BY effective_date DESC
            ) as row_num
          FROM sector_group_mappings
          WHERE is_active = true
        )
        SELECT 
          sector_code,
          tipe_kelompok,
          nama_kelompok,
          effective_date,
          end_date,
          row_num
        FROM ranked_mappings 
        WHERE row_num = 1
        ORDER BY sector_code ASC
      `
      
      return mappings.map((mapping: RawLatestActiveMappingResult): ActiveMapping => ({
        sectorCode: mapping.sector_code,
        tipe_kelompok: mapping.tipe_kelompok,
        nama_kelompok: mapping.nama_kelompok,
        isActive: true,
        effectiveDate: mapping.effective_date,
        endDate: mapping.end_date || undefined
      }))
    } catch (error: unknown) {
      console.error('Error fetching latest active mappings:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(`Failed to fetch latest active sector mappings: ${errorMessage}`)
    }
  }

  /**
   * Save new sector mappings from uploaded Excel file
   * This would be called when processing uploaded templates
   */
  static async saveSectorMappings(
    mappings: SaveMappingInput[], 
    userId: string
  ): Promise<{ savedCount: number; mappings: ActiveMapping[] }> {
    try {
      // Implementation would depend on your specific database schema and business logic
      // This is a placeholder for the actual implementation
      
      const savedMappings: ActiveMapping[] = []
      let savedCount = 0
      
      for (const mapping of mappings) {
        // Validate required fields
        if (!mapping.sectorCode) {
          console.warn('Skipping mapping with missing sector code:', mapping)
          continue
        }
        
        // For now, create a mock saved mapping
        const savedMapping: ActiveMapping = {
          sectorCode: mapping.sectorCode,
          tipe_kelompok: mapping.newGroupType || '',
          nama_kelompok: mapping.newGroupName || '',
          isActive: true,
          effectiveDate: mapping.effectiveDate || new Date()
        }
        
        savedMappings.push(savedMapping)
        savedCount++
      }
      
      return {
        savedCount,
        mappings: savedMappings
      }
    } catch (error: unknown) {
      console.error('Error saving sector mappings:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(`Failed to save sector mappings: ${errorMessage}`)
    }
  }
}