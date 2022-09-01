import secrets from '../ms-base/src/utility-methods/env';

import {TinkoffInvestApi} from 'tinkoff-invest-api';
import {
    BrokerReportResponse,
    DividendsForeignIssuerReport,
    GetBrokerReportRequest,
    GetDividendsForeignIssuerReportRequest,
    GetDividendsForeignIssuerResponse
} from 'tinkoff-invest-api/cjs/generated/operations';
import GoogleSpreadsheet from '../ms-base/src/google-spreadsheet/google.spreadsheet';
import {instrumentsService} from "../ms-ti-base/instruments.service";
import {DIVIDENDS_SHEET} from "../ms-ti-base/google.spreadsheet";
import {toNum} from "../ms-ti-base/number";
import {delay} from "../ms-ti-base/wait";

const token = secrets.token!;

const api = new TinkoffInvestApi({ token: token });

const generate_and_save_broker_report = async () => {
    // const generateBrokerReportRequest: GenerateBrokerReportRequest = {
    //     accountId: ACCOUNT.IIS,
    //     from: moment('01.01.2022', "DD/MM/YYYY").toDate(),
    //     to: moment('01.02.2022', "DD/MM/YYYY").toDate()
    // };

    // const brokerReportResponse: BrokerReportResponse = await api.operations.getBrokerReport({generateBrokerReportRequest});

    // const taskId = brokerReportResponse.generateBrokerReportResponse?.taskId!;
    // console.log('taskId: ' + taskId);
    // cf4365dc-bb24-42f0-b07a-e49af23d7be9

    const getBrokerReportRequest: GetBrokerReportRequest = {
        //taskId: taskId, page: 0
        taskId: 'cf4365dc-bb24-42f0-b07a-e49af23d7be9', page: 0
    };

    const brokerReportResponse2: BrokerReportResponse = await api.operations.getBrokerReport({getBrokerReportRequest});
    console.log(JSON.stringify(brokerReportResponse2))
}


// generate_and_save_broker_report();

//console.log(moment('01.01.2022', "DD/MM/YYYY").toDate())


const create_dividends_report = async (sheet: typeof DIVIDENDS_SHEET) => {
    const gs = new GoogleSpreadsheet(sheet);
    await gs.clear("A3:I500")

    const getDivForeignIssuerReport: GetDividendsForeignIssuerReportRequest = {
        taskId: '8aee58d1-4ed8-4270-8467-eb00393583d0', page: 0
    };

    const divs: any[] = [];

    const brokerReportResponse2: GetDividendsForeignIssuerResponse = await api.operations.getDividendsForeignIssuer({getDivForeignIssuerReport: getDivForeignIssuerReport});
    brokerReportResponse2.divForeignIssuerReport?.dividendsForeignIssuerReport.forEach(
        async (dividendsForeignIssuerReport: DividendsForeignIssuerReport) => {
            divs.push(
                [
                    dividendsForeignIssuerReport.paymentDate,
                    dividendsForeignIssuerReport.securityName,
                    (await instrumentsService.get_share_by_isin(dividendsForeignIssuerReport.isin)).ticker,
                    dividendsForeignIssuerReport.quantity,
                    toNum(dividendsForeignIssuerReport.dividendAmount),
                    toNum(dividendsForeignIssuerReport.tax),
                    toNum(dividendsForeignIssuerReport.dividend),
                    toNum(dividendsForeignIssuerReport.dividendGross),
                    dividendsForeignIssuerReport.currency
                ]
            )
        }
    )

    await delay(2500);

    await gs.appendAll('A:I', divs)
}

create_dividends_report(DIVIDENDS_SHEET.BROKERAGE_B2);

const generate_and_save_broker_divident_report = async () => {
    // const generateDividendsForeignIssuerReportRequest: GenerateDividendsForeignIssuerReportRequest = {
    //     accountId: ACCOUNT.IIS,
    //     from: moment('01.01.2022', "DD/MM/YYYY").add(3, 'hour').toDate(),
    //     to: moment('01.03.2022', "DD/MM/YYYY").toDate()
    // };

    // const brokerReportResponse: GetDividendsForeignIssuerResponse
    //      = await api.operations.getDividendsForeignIssuer({generateDivForeignIssuerReport: generateDividendsForeignIssuerReportRequest});

    // const taskId = brokerReportResponse.generateDivForeignIssuerReportResponse?.taskId!;
    // console.log('taskId: ' + taskId);
    // cf4365dc-bb24-42f0-b07a-e49af23d7be9

    const getDivForeignIssuerReport: GetDividendsForeignIssuerReportRequest = {
        taskId: '8aee58d1-4ed8-4270-8467-eb00393583d0', page: 0
    };

    const divs: any[] = [];

    const brokerReportResponse2: GetDividendsForeignIssuerResponse = await api.operations.getDividendsForeignIssuer({getDivForeignIssuerReport: getDivForeignIssuerReport});
    brokerReportResponse2.divForeignIssuerReport?.dividendsForeignIssuerReport.forEach(
        async (dividendsForeignIssuerReport: DividendsForeignIssuerReport) => {
            divs.push(
                [
                    dividendsForeignIssuerReport.paymentDate,
                    dividendsForeignIssuerReport.securityName,
                    (await instrumentsService.get_share_by_isin(dividendsForeignIssuerReport.isin)).ticker,
                    dividendsForeignIssuerReport.quantity,
                    toNum(dividendsForeignIssuerReport.dividendAmount),
                    toNum(dividendsForeignIssuerReport.tax),
                    toNum(dividendsForeignIssuerReport.dividend),
                    toNum(dividendsForeignIssuerReport.dividendGross),
                    dividendsForeignIssuerReport.currency
                ]
            )
        }
    )
    //console.log(JSON.stringify(brokerReportResponse2))

    
}


//generate_and_save_broker_divident_report();