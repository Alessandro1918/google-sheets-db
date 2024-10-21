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

function getRowIndexById(sheet, id) {
  const ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().flat() //2D array, flat => 1st collumn
  const rowIndex = ids.indexOf(id)  //TODO: fix bug: if "id" is "Number" instead of "String", it will return -1
  return rowIndex
}

//Get all items
//Usage: GET https://script.google.com/macros/s/AKfyc...7gI7A/exec?sheet=your-sheet-name
//Or:
//Get one item
//Usage: GET https://script.google.com/macros/s/AKfyc...7gI7A/exec?sheet=your-sheet-name&field_name=id&field_value=item-id
function doGet(e) {
  
  const sheetName = e.parameter["sheet"]
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName)
  const data = sheet.getDataRange().getValues()
  let jsonData = convertToJson(data)

  //Filter by some field: 
  //If true: GET - Filter all items, returning one;
  //Else: GET - Return all items.
  if ("field_name" in e.parameter) {
    const field_name = e.parameter["field_name"]
    const field_value = e.parameter["field_value"]
    jsonData = jsonData.filter(e => e[field_name] == field_value)
  }

  return ContentService
    .createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON)
}

//Save new item
//Usage:
//POST https://script.google.com/macros/s/AKfyc...7gI7A/exec?sheet=your-sheet-name
//Body: {"key1": "foo", "key2": "bar", "key3": 42, ...}
//OBS: field "id" auto generated, do not include in the request body.
//
//Edit current item
//Usage:
//POST https://script.google.com/macros/s/AKfyc...7gI7A/exec?sheet=your-sheet-name&id=your-product-id
//Body: {"key1": "foo", "key2": "bar", "key3": 42, ...}
//OBS: "id" field not included in the request body.
//
//Remove item
//POST https://script.google.com/macros/s/AKfyc...7gI7A/exec?sheet=your-sheet-name&id=your-product-id
//Body: -
function doPost(e) {

  const sheetName = e.parameter["sheet"]
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName)
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] //getValues => 2D array, [0] => 1st row

  //Request has body
  try {
    const body = JSON.parse(e.postData.contents)

    //Request has "id" param in the url
    //PUT - Edit current item
    if ("id" in e.parameter) {
      const id = e.parameter["id"]
      const rowIndex = getRowIndexById(sheet, id)
      let updatedRow = headers.map(header => {
        return body[header]
      })
      updatedRow = updatedRow.slice(1)  //all the collumns from the row but the first one (id)
      sheet.getRange(rowIndex + 2, 2, 1, updatedRow.length).setValues([updatedRow]) //+1 for 0-index, +1 for header
      return ContentService
        .createTextOutput(JSON.stringify({ statusCode: 200, result: "success", row: updatedRow }))
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
    const id = e.parameter["id"]
    const rowIndex = getRowIndexById(sheet, id)
    sheet.deleteRow(rowIndex + 2)   //+1 for 0-index, +1 for header
    return ContentService
      .createTextOutput(JSON.stringify({ statusCode: 204, result: "success" }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}