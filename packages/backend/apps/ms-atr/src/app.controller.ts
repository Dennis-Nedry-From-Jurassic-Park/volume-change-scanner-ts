import {Controller, Get, Header} from '@nestjs/common';

import {get_candles_historical, get_candles_historical_as_json2} from './app.service';

@Controller()
export class AppController {
  // http://localhost:3000/shares/sector-tickers
  @Get('/get-candles.tsv')
  //@Header('content-type', 'text/tab-separated-values')
  //@Header('content-type', 'text/tab-separated-values')
  async get_candles() {
    return await get_candles_historical('AMZN');
  }
  // http://localhost:3000/shares/get_candles_json
  @Get('/get_candles_json')
  //@Header('content-type', 'application/json')
  @Header('content-type', 'text/plain')
  async get_candles_json() {
    return await get_candles_historical_as_json2('SNAP');
  }
}






// http://localhost:3002/shares/get-candles