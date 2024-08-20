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

function generateNewId() {
  const response = UrlFetchApp.fetch("https://www.uuidtools.com/api/generate/v1")
  return JSON.parse(response.getContentText())[0]
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

  //If true: GET - Return one item
  //Else: GET - Return all items
  if ("id" in e.parameter) {
    const id = e.parameter["id"]
    jsonData = jsonData.filter(e => e["id"] == id)[0]
  }

  return ContentService
    .createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON)
}

//Save new item
//Usage:
//POST https://script.google.com/macros/s/AKfyc...7gI7A/exec?sheet=your-sheet-name
//Body: {"key1": "foo", "key2": "bar", "key3": 42, ...}
//OBS: field "id" auto generated, do not include in the request boby
//
//Edit current item
//Usage:
//POST https://script.google.com/macros/s/AKfyc...7gI7A/exec?sheet=your-sheet-name&id=your-product-id
//Body: {"key1": "foo", "key2": "bar", "key3": 42, ...}
//"id" field not included in the request body.
//Remove item from table
//POST https://script.google.com/macros/s/AKfyc...7gI7A/exec?sheet=your-sheet-name&id=your-product-id
//Body: -
function doPost(e) {

  const sheetName = e.parameter["sheet"]
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName)
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]

  //Request has body
  try {
    const body = JSON.parse(e.postData.contents)

    //Request has "id" param in the url
    //PUT - Edit current item
    if ("id" in e.parameter) {
      return ContentService
        .createTextOutput(JSON.stringify({ statusCode: 400, result: "TODO - PUT" }))
        .setMimeType(ContentService.MimeType.JSON)
    } 
    
    //Request does not have "id" param in the url
    //POST - Save new item
    else {
      const nextRow = sheet.getLastRow() + 1
      let newRow = headers.map(header => {
        return body[header]
      })
      newRow = [generateNewId(), ...newRow.slice(1)]  //id + all the collumns from the table but the first one (id)
      sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])
      return ContentService
        .createTextOutput(JSON.stringify({ statusCode: 201, result: "success", row: newRow }))
        .setMimeType(ContentService.MimeType.JSON)
    }
  }

  //Request does not have body
  //DELETE - Remove item from table
  catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ statusCode: 400, result: "TODO - DELETE" }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}