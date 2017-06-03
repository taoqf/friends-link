import { https } from '../get';
import * as querystring from 'querystring';
import config from '../config';

const retry_delay = 20 * 1000;
let token: string;

async function refresh() {
	console.log('refreshing token.');
	try {
		const query = querystring.stringify({
			grant_type: 'client_credential',
			appid: config.APPID,
			secret: config.APPSECRET
		});
		const data = await https(`https://api.weixin.qq.com/cgi-bin/token?${query}`);
		const parsedData = JSON.parse(data) as {
			access_token: string;
			expires_in: number;
			errcode: number;
			errmsg: string;
		};
		console.log('token==============', parsedData);
		console.info(parsedData);
		if (parsedData.access_token) {
			token = parsedData.access_token;
			if (parsedData.expires_in > 0) {
				const timeout = parsedData.expires_in * 1000 - 10000;
				setTimeout(refresh, timeout);
			}
			return token;
		} else {
			setTimeout(refresh, retry_delay);
			throw parsedData;
		}
	} catch (e) {
		console.log(e.message);
		setTimeout(refresh, retry_delay);
		throw e;
	}
}

export async function get_token() {
	if (token) {
		return token;
	} else {
		return await refresh();
	}
}
