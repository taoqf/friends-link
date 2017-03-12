import * as http from 'http';
import * as querystring from 'querystring';

export default function (url: string, data: any) {
	return new Promise<string>((resolve, reject) => {
		const query = querystring.stringify(data);
		http.get(`${url}?${query}`, (res) => {
			const statusCode = res.statusCode;
			const contentType = res.headers['content-type'];

			if (statusCode !== 200) {
				const msg = `Request Failed.\n` +
					`Status Code: ${statusCode}`;
				console.log(msg);
				// consume response data to free up memory
				res.resume();
				reject(msg);
				return;
			}

			res.setEncoding('utf8');
			let rawData = '';
			res.on('data', (chunk) => rawData += chunk);
			res.on('end', () => {
				resolve(rawData);
			});
		}).on('error', (e) => {
			const msg = `Got error: ${e.message}`;
			console.log(msg);
			reject(msg);
		});
	});
}