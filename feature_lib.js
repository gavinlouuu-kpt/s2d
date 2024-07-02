// const data_case = ['Data','1OYZ49i2uIXzOaECpIRde93C3FZpjppxVSi4jjT8oYZM']
// const beta_case = ['Beta','1pMIhO_XuzwWNq4RwE8pxul4c7Yhd83FDrrTKiPX5HoI']

// const cases = [
//   ['Data', '1OYZ49i2uIXzOaECpIRde93C3FZpjppxVSi4jjT8oYZM'],
//   ['Beta', '1pMIhO_XuzwWNq4RwE8pxul4c7Yhd83FDrrTKiPX5HoI']
// ];

// function SheetSwitchCase() {
//   const sheetName = CheckSheetName();
//   let selectedTempID;
//   let features;

//   switch (sheetName) {
//     case cases[0][0]:
//       selectedTempID = cases[0][1]
//       break;
//     case cases[1][0]:
//       selectedTempID = cases[1][1]
//       break;
//     default:
//       // Action for any other sheet
//       displayInfo('You are on an unrecognized sheet: ' + sheetName);
//       break;
//   }
//   return selectedTempID
// }

const cases = new Map([
    ['Data', '1OYZ49i2uIXzOaECpIRde93C3FZpjppxVSi4jjT8oYZM'],
    ['Beta', '1pMIhO_XuzwWNq4RwE8pxul4c7Yhd83FDrrTKiPX5HoI']
]);

function SheetSwitchCase() {
    const sheetName = CheckSheetName();

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