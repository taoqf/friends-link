import * as h from 'http';
import * as hs from 'https';
import * as querystring from 'querystring';

export function http(url: string, data?: any) {
	return new Promise<string>((resolve, reject) => {
		if (data) {
			const query = querystring.stringify(data);
			url += "?" + query;
		}
		h.get(url, (res) => {
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

export function https(url: string, data?: any) {
	return new Promise<string>((resolve, reject) => {
		if (data) {
			const query = querystring.stringify(data);
			url += "?" + query;
		}
		h.get(url, (res) => {
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