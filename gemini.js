function storeSecret(secretKey) {
    // Here you should implement secure storage of the secretKey.
    // This example just logs the key; replace this with your secure storage solution.
    console.log("Received secret: " + secretKey);
    // For example, using PropertiesService to store the key securely:
    PropertiesService.getScriptProperties().setProperty('SECRET_KEY', secretKey);
}

function getSecret(key) {
    // Retrieve a secret based on the key
    var secret = PropertiesService.getScriptProperties().getProperty(key);
    return secret;
}

function seeSecret() {
    var secretKey = getSecret('SECRET_KEY');
    displayInfo(secretKey);
}

function sendPostRequest(prompt) {
    // var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent\?key\=AIzaSyB1oBNqJk4SiMLjVThf0ye5dwfhWIPXKBg';

    var secretKey = getSecret('SECRET_KEY'); // Retrieve your API key stored in script properties

    var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + encodeURIComponent(secretKey);

    var payload = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }]
    };

    var options = {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify(payload)
    };

    var response = UrlFetchApp.fetch(url, options);
    Logger.log(response.getContentText());
    return response;
}

function extractTextFromResponse(responseData) {
    // Parse JSON if it's a string (depends on how you're receiving the data)
    var json = (typeof responseData === 'string') ? JSON.parse(responseData) : responseData;

    // Access the desired information
    var candidates = json.candidates;
    if (candidates && candidates.length > 0) {
        var firstCandidate = candidates[0];
        var parts = firstCandidate.content.parts;
        var texts = parts.map(part => part.text); // This collects all texts into an array
        return texts.join("\n"); // Joins all text parts with a newline, adjust as needed
    }

    return "No text generated"; // Return a default message if no text could be extracted
}

// function s2Gem() {
//   const sheetName = CheckSheetName();
//   const sheet = SpreadsheetApp
//     .getActiveSpreadsheet()
//     .getSheetByName(sheetName)

//   const promptCol = 1; // Column number where prompts are read (e.g., Column A = 1)
//   const responseCol = 2; // Column number where responses are written (e.g., Column B = 2)

//   const rows = sheet.getDataRange().getValues(); //get values as a 2D array

//   rows.forEach(function(row, index){
//     //Here we check if this row is the headers, if so we skip it
//     if (index === 0) return;
//     if (row[request_col]) return; //check if a response has already been generated

//     const response = doc.getUrl(); //Store the url of our new document in a variable
//     sheet.getRange(index + 1, request_col+1).setValue(response) //Write link in the sheet. 
//   })
// }

function s2Gem() {
    // const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("AI_testing");

    const sheetName = CheckSheetName();
    const sheet = SpreadsheetApp
        .getActiveSpreadsheet()
        .getSheetByName(sheetName)

    const promptCol = 1; // Column number where prompts are read (e.g., Column A = 1)
    const responseCol = 2; // Column number where responses are written (e.g., Column B = 2)

    const rows = sheet.getDataRange().getValues(); // Get values as a 2D array

    rows.forEach(function (row, index) {
        // Skip the header row and check if the response cell is empty
        if (index === 0 || row[responseCol - 1]) return; // Adjust for zero-based index of arrays

        var prompt = row[promptCol - 1]; // Get the prompt from the correct column
        if (prompt) { // Check if there is actually a prompt to process
            var response = sendPostRequest(prompt); // Send the prompt to the API
            var textResponse = extractTextFromResponse(response.getContentText())
            // sheet.getRange(index + 1, responseCol).setValue(textResponse);
            sheet.getRange(index + 1, responseCol).setValue(textResponse);
        }
    });
}

// to parse pdf gemini will need the file first to be converted to images which can be done manually?
// however gemini pro has the capability of parsing pdf directly

function sendFileFromDrive() {
    // Step 1: Access the file on Google Drive
    var fileId = 'YOUR_FILE_ID';  // Replace with your actual file ID
    var file = DriveApp.getFileById(fileId);

    // Step 2: Read the file data
    var fileBlob = file.getBlob();
    var fileBytes = fileBlob.getBytes();
    var base64Data = Utilities.base64Encode(fileBytes);

    // Step 3: Send an HTTP POST request
    var url = 'https://your-api-endpoint.com/upload';  // Replace with your API endpoint
    var payload = JSON.stringify({
        filename: file.getName(),
        mimeType: fileBlob.getContentType(),
        data: base64Data
    });

    var options = {
        method: 'post',
        contentType: 'application/json',
        payload: payload,
        muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(url, options);
    Logger.log(response.getContentText());
}

