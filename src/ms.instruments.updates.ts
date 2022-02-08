import {grpcTransport} from "./auth/connection";
import {ExchangeInstruments} from "./instruments/instruments.client";
import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff';


export const checkUpdates = async () => {
  const exchangeInstruments = new ExchangeInstruments(grpcTransport);
  const response = await exchangeInstruments.getAvailableShares();
  //console.log(JSON.stringify(response.response, (_, v) => typeof v === 'bigint' ? v.toString() : v))
  //response.response.instruments

  let halfResponse = response;
  halfResponse.response.instruments.pop();
  halfResponse.response.instruments.pop();
  //console.log(JSON.stringify(halfResponse.response, (_, v) => typeof v === 'bigint' ? v.toString() : v))

  //console.log(detailedDiff(response.response.instruments, halfResponse.response.instruments));
  const diffpatcher = require('jsondiffpatch')
  const delta = diffpatcher.diff(response, halfResponse);
  console.log(delta)

}

const run = async () => {
    await checkUpdates();
}

run();
