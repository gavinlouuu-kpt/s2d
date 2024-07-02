// dynamically generate map from setup page v4
function createMapFromSheet(setupPage) {
    // Open the active spreadsheet and access the specific sheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(setupPage);

    // Determine the last row with data to define the range to read
    const lastRow = sheet.getLastRow();

    // If there's only one row or none, return to avoid errors when header is the only row
    if (lastRow < 2) {
        console.log("No data rows found.");
        return new Map(); // Return an empty map if there are no data rows
    }

    // Read the key-value pairs from columns A and B starting from the second row
    const keysRange = sheet.getRange(2, 1, lastRow - 1, 1); // Column A, start from row 2
    const valuesRange = sheet.getRange(2, 2, lastRow - 1, 1); // Column B, start from row 2
    const keys = keysRange.getValues();
    const values = valuesRange.getValues();

    // Create a new Map object
    let settingsMap = new Map();

    // Regular expression to extract document ID from Google Docs URL
    const docIdRegex = /[-\w]{25,}/;

    // Iterate over the keys and values arrays to populate the Map
    keys.forEach((keyRow, index) => {
        const key = keyRow[0];
        const url = values[index][0];
        const match = url.match(docIdRegex);
        if (key && url && match) { // Ensure that both key and URL are not empty and the ID is extracted
            const docId = match[0];
            settingsMap.set(key, docId);
        }
    });

    // Optional: Log the Map to verify its contents
    console.log(Array.from(settingsMap.entries())); // Convert Map to an array to log it

    return settingsMap; // Return the Map object
}

// // hard code map v3
// const cases = new Map([
//   ['Data', '1OYZ49i2uIXzOaECpIRde93C3FZpjppxVSi4jjT8oYZM'],
//   ['Beta', '1pMIhO_XuzwWNq4RwE8pxul4c7Yhd83FDrrTKiPX5HoI']
// ]);

function SheetSwitchCase() {
    const sheetName = CheckSheetName();
    const setupPage = 'Setup';
    cases = createMapFromSheet(setupPage);

    // Use Map for dynamic lookup
    const selectedTempID = cases.get(sheetName);

    if (selectedTempID) {
        return selectedTempID; // Return the ID if found
    } else {
        // Action for any other sheet
        displayInfo('You are on an unrecognized sheet: ' + sheetName);
        return null; // Or handle the error as needed
    }
}

function featureGen(features, body, row) {
    features.forEach((feature, index) => {
        body.replaceText(feature, row[index]);
    });
}