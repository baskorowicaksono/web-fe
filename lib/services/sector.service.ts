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

export class SectorService {
  static async getAllSectorCodes(): Promise<string[]> {
    try {
      const sectors = await prisma.$queryRaw<Array<{sector_code: string}>>`
        SELECT DISTINCT sector_code
        FROM economic_sectors
        ORDER BY sector_code ASC
      `
      
      return sectors.map(sector => sector.sector_code)
    } catch (error) {
      console.error('Error fetching sector codes:', error)
      throw new Error('Failed to fetch sector codes from database')
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
      const mappings = await prisma.$queryRaw<Array<{
        sector_code: string
        tipe_kelompok: string
        nama_kelompok: string
        is_active: boolean
        effective_date: Date
        end_date: Date | null
      }>>`
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
      
      return mappings.map(mapping => ({
        sectorCode: mapping.sector_code,
        tipe_kelompok: mapping.tipe_kelompok,
        nama_kelompok: mapping.nama_kelompok,
        isActive: mapping.is_active,
        effectiveDate: mapping.effective_date,
        endDate: mapping.end_date || undefined
      }))
    } catch (error) {
      console.error('Error fetching active mappings:', error)
      throw new Error('Failed to fetch active sector mappings from database')
    }
  }

  /**
   * Get template data combining sector codes with their active mappings
   * This generates the data structure needed for the Excel template
   */
  static async getTemplateData(): Promise<Array<{
    sectorCode: string
    tipe_kelompok: string
    nama_kelompok: string
  }>> {
    try {
      // Get all sector codes
      const sectorCodes = await this.getAllSectorCodes()
      
      // Get active mappings
      const activeMappings = await this.getActiveSectorMappings()
      
      // Create a map for quick lookup
      const mappingMap = new Map<string, ActiveMapping>()
      activeMappings.forEach(mapping => {
        mappingMap.set(mapping.sectorCode, mapping)
      })
      
      // Combine data according to requirements
      const templateData = sectorCodes.map(sectorCode => {
        const mapping = mappingMap.get(sectorCode)
        
        return {
          sectorCode,
          tipe_kelompok: mapping?.tipe_kelompok || '',    // Column B: Latest active tipe_kelompok or blank
          nama_kelompok: mapping?.nama_kelompok || ''     // Column C: Latest active nama_kelompok or blank
        }
      })
      
      return templateData
    } catch (error) {
      console.error('Error generating template data:', error)
      throw new Error('Failed to generate template data')
    }
  }

  /**
   * Alternative method if you need to get the most recent active mapping per sector
   * This handles cases where there might be multiple active mappings
   */
  static async getLatestActiveMappings(): Promise<ActiveMapping[]> {
    try {
      // This query gets the most recent active mapping for each sector code
      const mappings = await prisma.$queryRaw<Array<{
        sector_code: string
        tipe_kelompok: string
        nama_kelompok: string
        effective_date: Date
        end_date: Date | null
        row_num: number
      }>>`
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
      
      return mappings.map(mapping => ({
        sectorCode: mapping.sector_code,
        tipe_kelompok: mapping.tipe_kelompok,
        nama_kelompok: mapping.nama_kelompok,
        isActive: true,
        effectiveDate: mapping.effective_date,
        endDate: mapping.end_date || undefined
      }))
    } catch (error) {
      console.error('Error fetching latest active mappings:', error)
      throw new Error('Failed to fetch latest active sector mappings')
    }
  }

  /**
   * Save new sector mappings from uploaded Excel file
   * This would be called when processing uploaded templates
   */
  static async saveSectorMappings(mappings: Array<{
    sectorCode: string
    newGroupType?: string
    newGroupName?: string
    effectiveDate: Date
    createdBy: string
  }>): Promise<void> {
    try {
      // First, deactivate existing mappings if needed
      // Then insert new mappings
      
      await prisma.$transaction(async(tx) => {
        for (const mapping of mappings) {
          if (mapping.newGroupType && mapping.newGroupName) {
            // Only save if user filled in new values
            await tx.$executeRaw`
              INSERT INTO sector_group_mappings (
                sector_code, 
                tipe_kelompok, 
                nama_kelompok, 
                effective_date,
                is_active,
                created_by,
                created_at
              ) VALUES (
                ${mapping.sectorCode},
                ${mapping.newGroupType},
                ${mapping.newGroupName},
                ${mapping.effectiveDate},
                true,
                ${mapping.createdBy},
                NOW()
              )
            `
          }
        }
      })
    } catch (error) {
      console.error('Error saving sector mappings:', error)
      throw new Error('Failed to save sector mappings to database')
    }
  }

  /**
   * Cleanup function to close database connection
   */
  static async disconnect(): Promise<void> {
    await prisma.$disconnect()
  }
}