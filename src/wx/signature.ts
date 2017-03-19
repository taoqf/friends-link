import { Request, Response, NextFunction } from 'express';
import { get_ticket } from './ticket';
import * as sha1 from 'sha1';
import * as https from 'https';
import * as uuid from 'uuid/v4';

export default (req: Request, res: Response, next: NextFunction) => {
	const noncestr = uuid();
	get_ticket().then((jsapi_ticket) => {
		const timestamp = parseInt((new Date()).getTime() / 1000 + '');
		const url = decodeURIComponent(req.body.url || req.query.url);
		if (!url) {
			res.status(500).end('param [URL] needed.');
			return;
		}
		/*
			签名算法
	签名生成规则如下：参与签名的字段包括noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）, url（当前网页的URL，不包含#及其后面部分） 。对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string1。这里需要注意的是所有参数名均为小写字符。对string1作sha1加密，字段名和字段值都采用原始值，不进行URL 转义。
		*/
		const str = `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
		console.info('signature', str);
		const signature = sha1(str)
		res.json({
			nonceStr: noncestr,
			timestamp: timestamp,
			signature: signature
		});
	}, (err) => {
		res.status(500).json(err);
	});
}
