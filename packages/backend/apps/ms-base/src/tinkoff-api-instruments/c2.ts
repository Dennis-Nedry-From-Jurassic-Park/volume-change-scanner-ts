import moment from 'moment';
import { asyncWriteFile } from '../utility-methods/file';



const { investing } = require('investing-com-api');

async function main() {
  const finnhub = require('finnhub');

  const api_key = finnhub.ApiClient.instance.authentications['api_key'];
  api_key.apiKey = "c9tu1kiad3i9vd5ja31g"
  const finnhubClient = new finnhub.DefaultApi()
  
  finnhubClient.earningsCalendar({"from": "2022-06-24", "to": "2022-06-24"}, (error:any, data:any, response:any) => {
    console.log(data.earningsCalendar.filter((earn:any) => {return earn.symbol === 'CCL'}))
  });
}
async function main2() {
  try {
    const response1 = await investing('currencies/eur-usd');
    //let response2 = await investing('indices/mcx', 'P6M', 'P1D');

    /*
        period   Valid values: P1D, P1W, P1M, P3M, P6M, P1Y, P5Y, MAX.
        interval Valid values: PT1M, PT5M, PT15M, PT30M, PT1H, PT5H, P1D, P1W, P1M.
    */


    let response2 = await investing('indices/mcx', 'P1D', 'PT5M');
    response2.sort((a:any, b:any) => a.date - b.date)
    response2.forEach((element:any) => {
        element.date = moment(element.date).format('DD.MM.YYYY HH:mm')
            // moment.unix(element.date).format("MM/DD/YYYY")
    });
    console.log(JSON.stringify(response2, null, 4));
    //console.log(response2, {'maxArrayLength': null})
    //asyncWriteFile('../../temp_' + 'mcx' + '.json', await _stringify(response2))
  } catch (err) {
    console.error(err);
  }
}

main2();


