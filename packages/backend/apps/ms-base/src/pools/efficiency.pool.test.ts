import {roaPool} from './efficiency.pool';

import { expect, test } from '@jest/globals';

test('roaPool parameters', () => {
	expect(roaPool.getMetricName()).toBe('ROA');
	expect(roaPool.getROAWeight(999.999)).toBe(0.9988465974625378);
	expect(roaPool.getROAWeight(0.025)).toBe(0.0011534025374855825);
});