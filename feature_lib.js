const c4c_features = [
    '{{First Name}}',
    '{{Last Name}}',
    '{{Position}}',
    '{{Hire Date}}',
    '{{Hourly Wage}}'
];

const beta_features = [
    '{{Position}}',
    '{{Hourly Wage}}'
]

const nro_features = [
    '{{Position}}',
    '{{Hourly Wage}}'
]

function SheetSwitchCase() {
    const sheetName = CheckSheetName();
    let selectedTempID;
    let features;

    switch (sheetName) {
        case 'Sheet1':
            // 
            break;
        case 'Beta':
            selectedTempID = '1pMIhO_XuzwWNq4RwE8pxul4c7Yhd83FDrrTKiPX5HoI'
            features = beta_features;
            break;
        case 'Data':
            selectedTempID = '1OYZ49i2uIXzOaECpIRde93C3FZpjppxVSi4jjT8oYZM'
            features = c4c_features;
            break;
        case 'NRO':
            selectedTempID = 'templateID'
            features = nro_features;
            break;
        default:
            // Action for any other sheet
            displayInfo('You are on an unrecognized sheet: ' + sheetName);
            break;
    }
    return { selectedTempID, features }
}

function featureGen(features, body, row) {
    features.forEach((feature, index) => {
        body.replaceText(feature, row[index]);
    });
}