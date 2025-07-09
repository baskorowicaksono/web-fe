// api/sector-mappings/upload/route.ts - API endpoint example
import { NextRequest, NextResponse } from 'next/server'
import { ExcelParser } from '../../../excel_parser'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const sectorName = formData.get('sectorName') as string
    const effectiveDate = formData.get('effectiveDate') as string
    
    if (!file || !sectorName || !effectiveDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Parse Excel file
    const mappings = await ExcelParser.parseExcelFile(file)
    
    // Validate data
    const validation = ExcelParser.validateMappingData(mappings)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }
    
    // Here you would save to database
    // await saveSectorMappings(mappings, sectorName, effectiveDate)
    
    return NextResponse.json({
      success: true,
      message: `Successfully processed ${mappings.length} sector mappings`,
      data: mappings
    })
    
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Return all sector mappings
    // const mappings = await getSectorMappings()
    
    // Mock data for now
    const mappings = [
      {
        id: '1',
        sectorCode: '001110',
        sectorName: 'Sektor Tertentu',
        existingGroupName: 'Sektor Perumahan, termasuk Perumahan Rakyat',
        effectiveDate: '2025-04-01',
        createdBy: 'adhitia_wiraguna',
        approvedBy: 'lisa_r',
        status: 'approved',
        createdAt: '2024-12-01T10:00:00Z',
        updatedAt: '2024-12-01T10:00:00Z'
      }
    ]
    
    return NextResponse.json({ data: mappings })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch mappings' },
      { status: 500 }
    )
  }
}