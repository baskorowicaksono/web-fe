import { NextRequest, NextResponse } from 'next/server'
import { SectorService } from '../../../../lib/services/sector.service'
import * as XLSX from 'xlsx'

export async function GET(request: NextRequest) {
  try {
    // Get template data combining sector codes with active mappings
    const templateData = await SectorService.getTemplateData()
    
    // Headers for the Excel template
    const headers = [
      'Sandi Sektor Ekonomi',        // Column A
      'Jenis Kelompok Eksisting',    // Column B  
      'Kelompok Sektor Eksisting',   // Column C
      'Jenis Kelompok Baru',         // Column D (empty)
      'Kelompok Sektor Baru'         // Column E (empty)
    ]
    
    // Convert template data to Excel format
    const excelData = templateData.map(row => [
      row.sectorCode,           // Column A: Sector Code
      row.tipe_kelompok,        // Column B: Existing Group Type
      row.nama_kelompok,        // Column C: Existing Group Name
      '',                       // Column D: Empty for user input
      ''                        // Column E: Empty for user input
    ])
    
    // Create worksheet data with headers
    const wsData = [headers, ...excelData]
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    
    // Set column widths
    const colWidths = [
      { wch: 20 }, // Sandi Sektor Ekonomi
      { wch: 25 }, // Jenis Kelompok Eksisting  
      { wch: 50 }, // Kelompok Sektor Eksisting
      { wch: 25 }, // Jenis Kelompok Baru
      { wch: 50 }, // Kelompok Sektor Baru
    ]
    ws['!cols'] = colWidths
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sector Mapping Template')
    
    // Generate Excel buffer
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `sector_mapping_template_${timestamp}.xlsx`
    
    // Return the Excel file as response
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': excelBuffer.length.toString()
      }
    })
    
  } catch (error) {
    console.error('Error generating Excel template:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate Excel template',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}