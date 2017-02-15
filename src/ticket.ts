import { get_token } from './token';

import * as https from 'https';
let ticket: string;
function refresh() {
	console.log('refreshing ticket.');
	return get_token().then((token) => {
		return new Promise<string>((resolve, reject) => {
			https.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`, (res) => {
				console.log('refreshing ticket=>statusCode:', res.statusCode);
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
						if (parsedData.errcode === 0) {
							ticket = parsedData.ticket;
							resolve(ticket);
							const timeout = parsedData.expires_in > 0 ? parsedData.expires_in * 1000 - 10000 : 0;
							setTimeout(refresh, timeout);
							// } else {
							// 	setTimeout(refresh, 7200000);
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
	});
}

export function get_ticket() {
	if (ticket) {
		return Promise.resolve(ticket);
	} else {
		return refresh();
	}
}