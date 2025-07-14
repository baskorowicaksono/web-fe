import { NextRequest, NextResponse } from 'next/server'
import { ExcelUtils } from '../../../../lib/excel-utils'
import { SectorService } from '../../../../lib/services/sector.service'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const effectiveDate = formData.get('effectiveDate') as string
    const createdBy = formData.get('createdBy') as string
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    if (!effectiveDate) {
      return NextResponse.json(
        { error: 'Effective date is required' },
        { status: 400 }
      )
    }
    
    // Parse the Excel file
    const excelData = await ExcelUtils.parseExcelFile(file)
    
    // Validate the data
    const validation = ExcelUtils.validateExcelData(excelData)
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.errors 
        },
        { status: 400 }
      )
    }
    
    // Filter data to only include rows with new mappings
    const newMappings = excelData.filter(row => 
      row.newGroupType && row.newGroupName
    )
    
    if (newMappings.length === 0) {
      return NextResponse.json(
        { error: 'No new mappings found in the uploaded file' },
        { status: 400 }
      )
    }
    
    // Save to database
    const mappingsToSave = newMappings.map(mapping => ({
      sectorCode: mapping.sectorCode,
      newGroupType: mapping.newGroupType!,
      newGroupName: mapping.newGroupName!,
      effectiveDate: new Date(effectiveDate),
      createdBy: createdBy || 'system'
    }))
    
    await SectorService.saveSectorMappings(mappingsToSave)
    
    return NextResponse.json({
      success: true,
      message: `Successfully processed ${newMappings.length} sector mappings`,
      data: {
        totalRows: excelData.length,
        newMappings: newMappings.length,
        skippedRows: excelData.length - newMappings.length
      }
    })
    
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process upload',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}