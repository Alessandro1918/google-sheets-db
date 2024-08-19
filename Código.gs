function convertToJson(data) {
  var jsonData = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    for (var j = 0; j < row.length; j++) {
      obj[data[0][j]] = row[j];
    }
    // obj["id"] = i;  //Adds a new key/value pair (id/index) to the object
    jsonData.push(obj);
  }
  return jsonData
}

//Get entire sheet as json data
function doGet(e) {
  
  //Usage:
  // GET https://script.google.com/macros/s/AKfyc...7gI7A/exec (with default sheet=db1)
  // GET https://script.google.com/macros/s/AKfyc...7gI7A/exec?sheet=db1
  const sheetName = e.parameter["sheet"] || "db1";
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  let jsonData = convertToJson(data);

  return ContentService
    .createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON);
}