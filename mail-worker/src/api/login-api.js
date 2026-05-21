import app from '../hono/hono';
import loginService from '../service/login-service';
import result from '../model/result';
import userContext from '../security/user-context';
import BizError from '../error/biz-error';
import { t } from '../i18n/i18n';

app.post('/login', async (c) => {
	throw new BizError(t('passwordLoginDisabled'), 403);
});

app.post('/login/key', async (c) => {
	const token = await loginService.loginWithKey(c, await c.req.json());
	return c.json(result.ok({ token: token }));
});

app.post('/register', async (c) => {
	const jwt = await loginService.register(c, await c.req.json());
	return c.json(result.ok(jwt));
});

app.delete('/logout', async (c) => {
	await loginService.logout(c, userContext.getUserId(c));
	return c.json(result.ok());
});
