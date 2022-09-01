import {roaPool} from '../pools/efficiency.pool';
import sizeof from 'object-sizeof';

const fn = async () => {
	const a = [1,2,3];

	console.log(roaPool.getROAWeight(999.99));
	console.log(sizeof(a));
};

fn();