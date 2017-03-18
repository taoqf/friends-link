import config from '../config';
import { https } from '../get';
let token: string;
function refresh() {
	console.log('refreshing token.');
	return https(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.APPID}&secret=${config.APPSECRET}`).then((data) => {
		try {
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
				return Promise.reject(parsedData);
			}
		} catch (e) {
			console.log(e.message);
			return Promise.reject(e.message);
		}
	});
}

export function get_token() {
	if (token) {
		return Promise.resolve(token);
	} else {
		return refresh();
	}
}