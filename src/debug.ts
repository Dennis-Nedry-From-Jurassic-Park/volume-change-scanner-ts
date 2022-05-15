import {altmanZscorePool} from './pools/ratings.pool';
import {roaPool} from './pools/efficiency.pool';
import clickhouse from './clickhouse/clickhouse';
import performSql from './clickhouse/perform-sql';
import sizeof from 'object-sizeof';

const fn = async () => {
	const a = [1,2,3];

	console.log(roaPool.getWeightedBuffetIndicator());
	console.log(roaPool.getROAWeight(999.99));
	console.log(altmanZscorePool.getWeightedBuffetIndicator());
	console.log(sizeof(a));
};

fn();