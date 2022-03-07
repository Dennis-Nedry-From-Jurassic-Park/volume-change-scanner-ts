import {altmanZscorePool} from './pools/ratings.pool';
import {ROApool} from './pools/efficiency.pool';
import clickhouse from './clickhouse/clickhouse';
import performSql from './clickhouse/perform-sql';
//import {memorySizeOf} from './debug/memorySizeOfObject';
import sizeof from 'object-sizeof';
//const ROApool = require('./pools/efficiency/ROA').ROApool;


const fn = async () => {
	const a = [1,2,3];

	console.log(ROApool.getWeightedBuffetIndicator());
	//console.log(ROApool.getROAweight(999.99));
	console.log(altmanZscorePool.getWeightedBuffetIndicator());
	console.log(sizeof(a));
};

fn();