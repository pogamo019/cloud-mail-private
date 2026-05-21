import { SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';

describe('cloud mail worker', () => {
	it('serves the frontend shell', async () => {
		const response = await SELF.fetch('http://example.com');
		const text = await response.text();

		expect(response.status).toBe(200);
		expect(text).toContain('<div id="app"></div>');
	});

	it('rejects password login', async () => {
		const response = await SELF.fetch('http://example.com/api/login', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'accept-language': 'en',
			},
			body: JSON.stringify({ email: 'admin@example.com', password: 'password' }),
		});
		const data = await response.json();

		expect(data.code).toBe(403);
		expect(data.message).toBe('Password login is disabled');
	});

	it('keeps registration protected from public requests', async () => {
		const response = await SELF.fetch('http://example.com/api/register', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'accept-language': 'en',
			},
			body: JSON.stringify({}),
		});
		const data = await response.json();

		expect(data.code).toBe(401);
	});
});
