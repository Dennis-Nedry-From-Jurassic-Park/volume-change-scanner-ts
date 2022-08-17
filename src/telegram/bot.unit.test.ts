import { expect, test } from '@jest/globals';

import bot from './bot';

test('telegram bot created', () => {
	expect(bot).not.toBeNull();
});