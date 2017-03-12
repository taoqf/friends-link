import config from './config';
import * as https from 'https';
let token: string;
function refresh() {
	console.log('refreshing token.');
	return new Promise<string>((resolve, reject) => {
		https.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.APPID}&secret=${config.APPSECRET}`, (res) => {
			console.log('refreshing token=>statusCode:', res.statusCode);
			let rawData = '';
			res.on('data', (chunk) => {
				rawData += chunk;
			});

			res.on('end', () => {
				try {
					const parsedData = JSON.parse(rawData) as {
						access_token: string;
						expires_in: number;
						errcode: number;
						errmsg: string;
					};
					console.log('token==============', parsedData);
					console.info(parsedData);
					if (parsedData.access_token) {
						token = parsedData.access_token;
						resolve(token);
						if (parsedData.expires_in > 0) {
							const timeout = parsedData.expires_in * 1000 - 10000;
							setTimeout(refresh, timeout);
						}
					} else {
						reject(parsedData);
					}
				} catch (e) {
					console.log(e.message);
					reject(e.message);
				}
			});
		}).on('error', (e) => {
			console.error(e);
			reject(e);
		});
	});
}

export function get_token() {
	if (token) {
		return Promise.resolve(token);
	} else {
		return refresh();
	}
}