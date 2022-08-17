import secrets from './env';

import { expect, test } from '@jest/globals';

test('secrets env key=val', () => {
	expect(secrets.scopes).toBe('https://www.googleapis.com/auth/spreadsheets');
	expect(secrets.sheet).toBe('B2-IIS');
});