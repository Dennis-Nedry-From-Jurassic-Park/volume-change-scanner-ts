import {altmanZscorePool} from './pools/ratings.pool';
import {roaPool} from './pools/efficiency.pool';
import clickhouse from './clickhouse/clickhouse';
import performSql from './clickhouse/perform-sql';
//import {memorySizeOf} from './debug/memorySizeOfObject';
import sizeof from 'object-sizeof';
//const roaPool = require('./pools/efficiency/ROA').roaPool;


const fn = async () => {
	const a = [1,2,3];


	//console.log(roaPool.getROAweight(999.99));
	//console.log(altmanZscorePool.getWeightedBuffetIndicator());
	console.log(roaPool.getROAWeight0(999.99));
	console.log(roaPool.getROAWeight(999.99));
	console.log(sizeof(a));
};

fn();