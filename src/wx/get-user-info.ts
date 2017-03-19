import { Request, Response, NextFunction } from 'express';
import { https } from '../get';
import config from '../config';
import { get_token } from './token';

export default (req: Request, res: Response, next: NextFunction) => {
	const code = req.body.code || req.query.code;
	if (!code) {
		res.status(500).end('param [code] needed.');
		return;
	}
	console.log('geting userinfo: code=', code);
	https(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.APPID}&secret=${config.APPSECRET}&code=${code}&grant_type=authorization_code`).then((data) => {
		console.log('openid:::', data);
		const d = JSON.parse(data);
		const info = d as {
			access_token: string;
			expires_in: number;
			refresh_token: string;
			openid: string;
			scope: string;
			unionid: string;
		};
		if (info.openid && info.access_token) {
			get_token().then((token) => {
				console.log('token getted:', token);
				https(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${token}&openid=${info.openid}&lang=zh_CN`).then((data) => {
					console.log('userinfo:::', data);
					const d = JSON.parse(data);
					const info = d as {
						subscribe: number;
						openid: string;
						nickname: string;
						sex: number;
						language: string;
						city: string;
						province: string;
						country: string;
						headimgurl: string;
						subscribe_time: number;
						unionid: string;
						remark: string;
						groupid: number;
					};
					if (info.subscribe) {
						res.json(info);
					} else {
						if (info.subscribe === 0) {
							res.status(500).end('此用户没有关注该公众号');
						} else {
							const e = d as {
								errcode: number;
								errmsg: string;
							};
							console.error('Exception when get userinfo, detail:', e.errmsg);
							res.status(500).end(e.errmsg);
						}
					}
				}, (err) => {
					res.status(500).end('Error: cannot get userinfo.');
				});

			}, (err) => {
				res.status(500).end('cannot get token');
			});
		} else {
			const e = d as {
				errcode: number;
				errmsg: string;
			};
			console.error('Exception when get access_token, detail:', e.errmsg);
			res.status(500).end(e.errmsg);
		}
	}, (err) => {
		res.status(500).end('Error: cannot get access_token and openid.');
	});
}