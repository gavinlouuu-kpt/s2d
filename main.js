function onOpen() {
    const ui = SpreadsheetApp.getUi();
    const menu = ui.createMenu('AutoFill Docs');
    menu.addItem('Create New Docs', 'createNewGoogleDocs')
    menu.addToUi();
    menu.addItem('Reset All', 'run_create')
    menu.addToUi();
}

function createNewGoogleDocs() {
    const todayFolderID = dynamicFolder();
    const destinationFolder = DriveApp.getFolderById(todayFolderID);
    const sheetName = CheckSheetName();
    const sheet = SpreadsheetApp
        .getActiveSpreadsheet()
        .getSheetByName(sheetName)
    // const { selectedTempID, features} = SheetSwitchCase(sheet);// template and feature selection
    const selectedTempID = SheetSwitchCase(sheet);// template and feature selection
    var extract = extractTags(selectedTempID)
    var features = extract.raw_tags;
    const DocumentRow = features.length;
    const googleDocTemplate = DriveApp.getFileById(selectedTempID);
    const rows = sheet.getDataRange().getValues(); //get values as a 2D array

    rows.forEach(function (row, index) {
        //Here we check if this row is the headers, if so we skip it
        if (index === 0) return;
        if (row[DocumentRow]) return; //check if a document has already been generated
        //Using the row data in a template literal, we make a copy of our template document in our destinationFolder
        const now = new Date();
        const formattedNow = Utilities.formatDate(now, Session.getScriptTimeZone(), 'MM-dd_HH-mm-ss');
        const copy = googleDocTemplate.makeCopy(`${row[1]}, ${row[0]} ${sheetName} ${formattedNow} Report`, destinationFolder)
        const doc = DocumentApp.openById(copy.getId())//open copy using the DocumentApp
        const body = doc.getBody();//get content in the body
        featureGen(features, body, row);//generate the features to substitute
        doc.saveAndClose(); //We make our changes permanent by saving and closing the document
        const url = doc.getUrl(); //Store the url of our new document in a variable
        sheet.getRange(index + 1, DocumentRow + 1).setValue(url) //Write link in the sheet. 
    })
}

