import config from './config';
import * as https from 'https';
let token: string;
(function refresh() {
	https.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.APPID}&secret=${config.APPSECRET}`, (res) => {
		console.log('statusCode:', res.statusCode);
		console.log('headers:', res.headers);
		let rawData = '';
		res.on('data', (chunk) => {
			rawData += chunk;
		});

		res.on('end', () => {
			try {
				const parsedData = JSON.parse(rawData) as {
					access_token: string;
					expires_in: number;
				};
				console.log(parsedData);
				token = parsedData.access_token;
				const timeout = parsedData.expires_in > 0 ? parsedData.expires_in * 1000 - 10 : 0;
				setTimeout(refresh, timeout);
			} catch (e) {
				console.log(e.message);
			}
		});
	}).on('error', (e) => {
		console.error(e);
	});
})();

export function get_token() {
	return token;
}