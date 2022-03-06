import {altmanZscorePool} from './pools/ratings.pool';
import {ROApool} from './pools/efficiency.pool';

//const ROApool = require('./pools/efficiency/ROA').ROApool;


const fn = async () => {
	console.log(ROApool.getWeightedBuffetIndicator());
	//console.log(ROApool.getROAweight(999.99));
	console.log(altmanZscorePool.getWeightedBuffetIndicator());
};

fn();