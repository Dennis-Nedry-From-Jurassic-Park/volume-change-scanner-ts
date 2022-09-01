import {gcd, gcd_rec, gcd_full, gcd_r, gcd_1, gcd_2, gcd_3, gcd_4} from './pool';

import { expect, test } from '@jest/globals';

test('roaPool parameters', () => {
	expect(gcd( 48, 18 )).toBe(6);
	expect(gcd_rec( 48, 18 )).toBe(6);
	expect(gcd_r( 48, 18 )).toBe(6);
	expect(gcd_full( 48, 18 )).toBe(6);
	expect(gcd_1( 48, 18 )).toBe(6);
	expect(gcd_2( 48, 18 )).toBe(6);
	expect(gcd_3( 48, 18 )).toBe(6);
	expect(gcd_4( 48, 18 )).toBe(6);
});