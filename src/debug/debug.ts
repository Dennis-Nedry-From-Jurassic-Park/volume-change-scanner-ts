import {altmanZscorePool} from '../pools/ratings.pool';
import {roaPool} from '../pools/efficiency.pool';
import clickhouse from '../db/clickhouse/clickhouse';
import performSql from '../db/clickhouse/perform-sql';
import sizeof from 'object-sizeof';

//const roaPool = require('./pools/efficiency/ROA').roaPool;



const fn = async () => {
	const a = [1,2,3];



	//console.log(roaPool.getROAweight(999.99));
	//console.log(altmanZscorePool.getWeightedBuffetIndicator());
	console.log(roaPool.getROAWeight(999.99));


	console.log(sizeof(a));
};

fn();