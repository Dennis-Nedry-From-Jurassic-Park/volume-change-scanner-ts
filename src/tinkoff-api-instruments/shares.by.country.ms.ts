import {
    Share
} from '../../protos_ts/instruments';
import { asyncWriteFile } from '../utility-methods/file';
import { _stringify } from '../utils/json';


const getSharesByCountry = async (country: string) => {
    const shares: Share[] = require('../../shares copy.json');
    const response = shares.filter((share:Share) => { return share.countryOfRisk === country});

    asyncWriteFile(`../../${country}_shares.json`, await _stringify(response));

}

const getSharesByNotIncCountry = async (country: string) => {
    const shares: Share[] = require('../../shares copy.json');
    const response = shares.filter((share:Share) => { 
        return share.countryOfRisk != 'US' && share.countryOfRisk != 'CN' && share.countryOfRisk != 'RU'
    });

    asyncWriteFile(`../../${country}_shares.json`, await _stringify(response));

}

// getSharesByCountry('RUS');
getSharesByNotIncCountry('EU');