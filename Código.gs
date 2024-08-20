function convertToJson(data) {
  var jsonData = []
  for (var i = 1; i < data.length; i++) {
    var row = data[i]
    var obj = {}
    for (var j = 0; j < row.length; j++) {
      obj[data[0][j]] = row[j]
    }
    // obj["id"] = i  //Adds a new key/value pair (id/index) to the object
    jsonData.push(obj)
  }
  return jsonData
}

//Get all items
//Usage: GET https://script.google.com/macros/s/AKfyc...7gI7A/exec?sheet=your-sheet-name
//Or:
//Get one item
//Usage: GET https://script.google.com/macros/s/AKfyc...7gI7A/exec?sheet=your-sheet-name&id=item-id
function doGet(e) {
  
  const sheetName = e.parameter["sheet"]
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName)
  const data = sheet.getDataRange().getValues()
  let jsonData = convertToJson(data)

  //If true, get one. Else, get all
  if ("id" in e.parameter) {
    const id = e.parameter["id"]
    jsonData = jsonData.filter(e => e["id"] == id)[0]
  }

  return ContentService
    .createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON)
}