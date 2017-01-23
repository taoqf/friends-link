import { Request, Response, NextFunction } from 'express';
import * as sha1 from 'sha1';
import config from './config';

export default (req: Request, res: Response, next: NextFunction) => {
	const q = req.query;
	const signature = q.signature;
	const timestamp = q.timestamp;
	const nonce = q.nonce;
	const echostr = q.echostr; //随机字符串

	const token = config.TOKEN;
	/*
		1）将token、timestamp、nonce三个参数进行字典序排序
		2）将三个参数字符串拼接成一个字符串进行sha1加密
		3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
	*/
	const str = [token, timestamp, nonce].sort().join('');
	const sha = sha1(str);
	if (req.method == 'GET') {
		if (sha == signature) {
			res.send(echostr + '')
		} else {
			res.send('err');
		}
	}
	else if (req.method == 'POST') {
		if (sha != signature) {
			return;
		}
		next();
	}
}