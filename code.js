function doGet(request) {
  //return HtmlService.createHtmlOutputFromFile('Index');
  return HtmlService.createTemplateFromFile('Index').evaluate();
}

function include(CSS) {
  return HtmlService.createHtmlOutputFromFile('CSS').getContent();
}

function createSheet() {
  
  try {
    var sheet = SpreadsheetApp.create("logSheet");
    var range = sheet.getRange("A1:D1");
    var values =[['Timestamp', 'Actions', 'Results', 'Learning']];
    range.setValues(values);
    
    //set the trigger to update time everytime new row appends
    ScriptApp.newTrigger("myFunction").forSpreadsheet(sheet).onEdit().create();
    
    var email = Session.getActiveUser().getEmail();
    sheet.addEditor(email);
    //sheet.addEditors(editors);
    Logger.log(email);
    var url = sheet.getUrl();
    Logger.log(url);
    return url;
  }
  catch(err) {
    Logger.log(err);
  }
}

/***
 trigger function to auto update timestamp 
***/
function myFunction() {
  
  var s = SpreadsheetApp.getActiveSheet();
  var cell = s.getActiveCell();
  var preCell;
  
  if(cell.getColumn() == 2) {
    preCell = cell.offset(0, -1);
    preCell.setValue(new Date());
  }
}

function auth() {
  var sheet = SpreadsheetApp.openById("1mb5wU82-l4pgGi7MpVC5JAJ0S5HAQx4SvAjw-v9SM4o");
  var email = Session.getActiveUser().getEmail();
  sheet.addEditor(email);
  var url = LogSubmitLibrary.createSheet();
  Logger.log(url);
  
}

/**
 update the main spreadsheet
**/
function submit(url) {
 
   //Logger.log(url);
   var sheet = SpreadsheetApp.openByUrl(url);
   var sheet2 = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1N1_cXALBs6zOwsuaO_DXnupYqlU5n4r2FyCPdFfQxc8/edit?usp=sharing").getActiveSheet();
   //var range = sheet.getRange(2, 1, sheet.getLastRow()-1, sheet.getLastColumn());
   //var activeRange = sheet.setActiveRange(2, 1, sheet.getLastRow()-1, 4);
   var range = sheet.getRange("A2:D100");
   var values = range.getValues();
   Logger.log(values);
   var arr = [];
   var i, j;
  
   for(i = 0; i < values.length; i++) {
     for(j = 0; j < 4; j++) {
          arr.push(values[i][j]);
     }
     //save the data in database sheet row by row
     sheet2.appendRow(arr);
     arr.length = 0;
   }
  
   Logger.log(arr);
   
   //clear the content of current sheet
   range.clear();   

}


