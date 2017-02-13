import { get_token } from './token';

import * as https from 'https';
let ticket: string;
(function refresh() {
	https.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${get_token()}&type=jsapi`, (res) => {
		console.log('statusCode:', res.statusCode);
		console.log('headers:', res.headers);
		let rawData = '';
		res.on('data', (chunk) => {
			rawData += chunk;
		});

		res.on('end', () => {
			try {
				const parsedData = JSON.parse(rawData) as {
					errcode: number;
					errmsg: string;
					ticket: string;
					expires_in: number;
				};
				console.log(parsedData);
				ticket = parsedData.ticket;
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

export function get_ticket() {
	return ticket;
}