// Google Apps Script untuk menyimpan data ke Google Spreadsheet
// Copy kode ini ke script.google.com dan deploy sebagai Web App

function doPost(e) {
  try {
    // Parse data dari request
    const data = JSON.parse(e.postData.contents);
    
    // Buka spreadsheet
    const spreadsheetId = 'YOUR_SPREADSHEET_ID_HERE'; // Ganti dengan ID spreadsheet Anda
    const sheetName = 'Responses'; // Nama sheet
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    let sheet = spreadsheet.getSheetByName(sheetName);
    
    // Jika sheet belum ada, buat baru
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      // Tambahkan header
      sheet.getRange(1, 1, 1, 10).setValues([[
        'Timestamp',
        'Gratitude 1',
        'Gratitude 2',
        'Gratitude 3',
        'Confidence Level',
        'Support Friend',
        'Self Appreciation',
        'Video Reflection',
        'Date',
        'Time'
      ]]);
    }
    
    // Tambahkan data baru
    const lastRow = sheet.getLastRow();
    const newRow = lastRow + 1;
    
    // Format tanggal dan waktu
    const now = new Date();
    const date = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const time = Utilities.formatDate(now, Session.getScriptTimeZone(), 'HH:mm:ss');
    
    // Tulis data ke spreadsheet
    sheet.getRange(newRow, 1, 1, 10).setValues([[
      data.timestamp || new Date().toLocaleString(),
      data.page2.gratitude1 || '',
      data.page2.gratitude2 || '',
      data.page2.gratitude3 || '',
      data.page3.confidenceLevel || '',
      data.page4.supportFriend || '',
      data.page4.selfAppreciation || '',
      data.page5.videoReflection || '',
      date,
      time
    ]]);
    
    // Beri format pada baris baru
    sheet.getRange(newRow, 1, 1, 10).setHorizontalAlignment('left');
    sheet.getRange(newRow, 1, 1, 10).setVerticalAlignment('middle');
    sheet.autoResizeColumns(1, 10);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Data saved successfully',
        row: newRow 
      }))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        message: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Fungsi untuk testing (opsional)
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: 'active',
      message: 'CERDIK Google Apps Script is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}