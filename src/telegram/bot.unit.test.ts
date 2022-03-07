import bot from './bot';
//const bot = require('./bot');

test('telegram bot created', () => {
	expect(bot).not.toBeNull();
});