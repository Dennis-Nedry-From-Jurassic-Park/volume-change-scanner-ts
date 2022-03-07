import secrets from './env';

test('secrets env key=val', () => {
	expect(secrets.scopes).toBe('https://www.googleapis.com/auth/spreadsheets');
	expect(secrets.sheet).toBe('B2-IIS');
});