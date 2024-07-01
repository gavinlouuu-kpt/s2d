function getFolderFromThisSpreadsheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const folder = DriveApp.getFileById(ss.getId()).getParents().next()
    // console.log(`Name: ${folder.getName()} | ID: ${folder.getId()}`)
    return folder
}

function dynamicFolder() {
    const parentFolderID = getFolderFromThisSpreadsheet().getId();
    const parentFolder = DriveApp.getFolderById(parentFolderID);

    // Get today's date and format it
    const today = new Date();
    const formattedDate = Utilities.formatDate(today, Session.getScriptTimeZone(), 'yyyy-MM-dd');

    // Check if a folder with today's date already exists
    const folders = parentFolder.getFolders();
    while (folders.hasNext()) {
        const folder = folders.next();
        if (folder.getName() === formattedDate) {
            console.log('Folder already exists with name: ' + formattedDate);
            return folder.getId();
        }
    }

    // Create a new folder with today's date
    const newFolder = parentFolder.createFolder(formattedDate);
    console.log('New folder created with name: ' + formattedDate);
    return newFolder.getId();
}

function displayInfo(info) {
    // display info in google sheet live
    const ui = SpreadsheetApp.getUi();
    ui.alert('Active Sheet Name', 'The active sheet name is: ' + info, ui.ButtonSet.OK);
}

function CheckSheetName() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const sheetName = sheet.getName();
    return sheetName
}