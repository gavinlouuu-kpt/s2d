function extractTags(targetID) {
    // Open the Google Docs document by its ID
    var doc = DocumentApp.openById(targetID);

    // Access the body of the document
    var body = doc.getBody();

    // Get the full text of the document
    var text = body.getText();

    // Regular expression to match all instances of {{tag}}
    var regex = /{{\s*([^}]+)\s*}}/g;
    var match;
    var tags = [];          // To store raw tag names without braces
    var raw_tags = [];      // To store full tags with braces

    // Loop over all matches of the regex
    while ((match = regex.exec(text)) !== null) {
        // Trim any extra spaces around the tag name
        var tagName = match[1].trim();

        // Construct the full tag format and add it to the raw_tags list, excluding duplicates
        var fullTag = '{{' + tagName + '}}';
        if (!raw_tags.includes(fullTag)) {
            raw_tags.push(fullTag);
        }

        // Add the raw tag name to the tags list, excluding duplicates
        if (!tags.includes(tagName)) {
            tags.push(tagName);
        }
    }

    // Return both lists
    return { tags: tags, raw_tags: raw_tags };
}

function createSheetsFromMap(cases) {
    // Get the active Google Spreadsheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    // Iterate over each entry in the map
    cases.forEach((documentId, sheetName) => {
        // Create or clear the sheet
        let sheet = spreadsheet.getSheetByName(sheetName);
        if (sheet) {
            // If sheet exists, clear it
            // sheet.clear();
        } else {
            // If no such sheet exists, create it
            sheet = spreadsheet.insertSheet(sheetName);
        }

        // Use the extractTags function to get tags
        const tagsResult = extractTags(documentId);

        // Check if tagsResult.raw_tags is not undefined and has elements
        if (tagsResult && tagsResult.tags && tagsResult.tags.length > 0) {
            // Setting the extracted tags as headers in the first row of the new sheet
            sheet.getRange(1, 1, 1, tagsResult.tags.length).setValues([tagsResult.tags]);
        } else {
            // Log or handle the case where no tags are found
            console.log("No tags found in the document with ID: " + documentId);
        }
    });
}

// v4 dynamic map creation
function run_create() {
    const setupPage = 'Setup'
    cases = createMapFromSheet(setupPage)
    createSheetsFromMap(cases);
}