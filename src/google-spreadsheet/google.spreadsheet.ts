import  moment  from 'moment';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

require('dotenv').config();

export default class GoogleSpreadsheet {
    private readonly earliestDateTimeCell: string;
    private readonly auth: any;
    private readonly spreadsheetId: any;

    private googleSheetsInstance: any;

    private readonly sheet: string;

    constructor(sheet:string) {
    	this.earliestDateTimeCell = 'G2';
    	this.sheet = sheet;

    	this.auth = new GoogleAuth({
    		keyFile: process.env.KEY_FILE,
    		scopes: process.env.SCOPES,
    	});

    	const authClientObject:any = this.auth.getClient();

    	this.googleSheetsInstance = google.sheets({
    		version: 'v4',
    		auth: authClientObject
    	});

    	this.spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    }

    async getEarliestDateTime() {
    	const earliestDateTime = await this.googleSheetsInstance.spreadsheets.values.get({
    		auth: this.auth,
    		spreadsheetId: this.spreadsheetId,
    		range: `${this.sheet}!F2`
    	});
    	return earliestDateTime;
    }

    async getDateTime(earliestDateTime: any)  {
    	let dateTime: string;

    	try {
    		dateTime = moment(earliestDateTime.data.values[0][0]).add(1, 'seconds').toISOString();
    	} catch {
    		dateTime = moment().subtract(5, 'years').toISOString();
    	}

    	console.log('dateTime = ' + dateTime);

    	return dateTime;
    }

    async removeEarliestDateTime() {
    	await this.googleSheetsInstance.spreadsheets.values.clear({
    		auth: this.auth,
    		spreadsheetId: this.spreadsheetId,
    		range: `${this.sheet}!${this.earliestDateTimeCell}`
    	});
    }

    async updateEarliestDateTime(dateTime: string) {
    	await this.googleSheetsInstance.spreadsheets.values.append({
    		auth: this.auth,
    		spreadsheetId: this.spreadsheetId,
    		range: `${this.sheet}!${this.earliestDateTimeCell}`,
    		valueInputOption: 'USER_ENTERED',
    		insertDataOption: 'OVERWRITE',
    		resource: {values: [[dateTime]]},
    	});
    }

    async appendAll(result: Array<any>) {
    	await this.googleSheetsInstance.spreadsheets.values.append({
    		auth: this.auth,
    		spreadsheetId: this.spreadsheetId,
    		range: `${this.sheet}!A4:K4`,
    		valueInputOption: 'USER_ENTERED',
    		resource: {
    			values: result
    		},
    	});
    }
}