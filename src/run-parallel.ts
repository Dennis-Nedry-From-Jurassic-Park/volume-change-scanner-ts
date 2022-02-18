import {updateSpreadsheet} from "./update-spreadsheet";

const parallel = require('run-parallel');

parallel([
    () => updateSpreadsheet("B2-IIS"),
    () => updateSpreadsheet("B2-BROK")
]);