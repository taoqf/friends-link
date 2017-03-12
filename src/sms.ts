import { Hash } from './interfaces';
import get from './get';

const APPKEY = 'acbbb8d2f18952bddaf2e235cc8e5b5c';

const REGISTID = '29546';
function regist(phone_no: string, name: string, code: string) {
	return send_msg(phone_no, REGISTID, {
		name: name,
		code: code
	});
}

function send_msg(phone_no: string, tpl_id: string, tpl_value: Hash<string>) {
	const tpl_values = [] as string[];
	for (const name in tpl_value) {
		const value = tpl_value[name];
		tpl_values.push(`#${name}#=${value}`);
	}
	const params = {
		"mobile": phone_no, // 接收短信的手机号码
		"tpl_id": REGISTID, // 短信模板ID，请参考个人中心短信模板设置
		"tpl_value": tpl_values.join('&'), // 变量名和变量值对。如果你的变量名或者变量值中带有#&amp;=中的任意一个特殊符号，请先分别进行urlencode编码后再传递，&lt;a href=&quot;http://www.juhe.cn/news/index/id/50&quot; target=&quot;_blank&quot;&gt;详细说明&gt;&lt;/a&gt;
		"key": APPKEY, // 应用APPKEY(应用详细页查询)
		"dtype": "json" // 返回数据的格式,xml或json，默认json
	}
	const url = 'http://v.juhe.cn/sms/send';
	return get(url, params).then((data) => {
		return JSON.parse(data) as {
			error_code: number;
			result: string;
			reason: string;
		};
	});
}

function is_black(word: string) {
	const params = {
		key: APPKEY,
		word: word
	};
	const url = 'http://v.juhe.cn/sms/black';
	return get(url, params).then((data) => {
		return JSON.parse(data) as {
			error_code: number;
			result: string;
			reason: string;
		};
	});
}
