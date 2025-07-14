import { NextRequest, NextResponse } from 'next/server'
import { SectorService } from '../../../../lib/services/sector.service'

export async function GET(request: NextRequest) {
  try {
    // Fetch active mappings from sector_group_mappings table
    const activeMappings = await SectorService.getActiveSectorMappings()
    
    // Transform to the format expected by ExcelUtils
    const mappings = activeMappings.map(mapping => ({
      sectorCode: mapping.sectorCode,
      tipe_kelompok: mapping.tipe_kelompok,
      nama_kelompok: mapping.nama_kelompok,
      isActive: mapping.isActive,
      effectiveDate: mapping.effectiveDate,
      endDate: mapping.endDate
    }))
    
    return NextResponse.json({
      success: true,
      mappings,
      count: mappings.length
    })
  } catch (error) {
    console.error('Error fetching active mappings:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch active sector mappings',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}