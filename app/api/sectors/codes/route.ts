import { NextRequest, NextResponse } from 'next/server'
import { SectorService } from '../../../../lib/services/sector.service'

export async function GET(request: NextRequest) {
  try {
    // Fetch unique sector codes from economic_sectors table
    const sectorCodes = await SectorService.getAllSectorCodes()
    
    return NextResponse.json({
      success: true,
      sectorCodes,
      count: sectorCodes.length
    })
  } catch (error) {
    console.error('Error fetching sector codes:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch sector codes',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}