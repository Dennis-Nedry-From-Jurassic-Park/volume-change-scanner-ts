import {altmanZscorePool} from './pools/ratings.pool';
import {ROApool} from './pools/efficiency.pool';
import clickhouse from './clickhouse/clickhouse';
import performSql from './clickhouse/perform-sql';

//const ROApool = require('./pools/efficiency/ROA').ROApool;


const fn = async () => {
	performSql('db', 't', []);
	console.log(ROApool.getWeightedBuffetIndicator());
	//console.log(ROApool.getROAweight(999.99));
	console.log(altmanZscorePool.getWeightedBuffetIndicator());
};

fn();