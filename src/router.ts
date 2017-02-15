import * as express from 'express';
import config from './config';
import wx from './wx-check-signature';
import sn from './signature';

const router = express.Router();

// router.use(compression());
// 1.(根据配置)设置跨域访问
(function (router: express.Router) {
	config.ACAO && router.use(function (req, res, next) {
		res.header("Access-Control-Allow-Origin", config.ACAO);
		res.header("Access-Control-Allow-Headers", "content-type, x-requested-with");
		res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
		res.header("Access-Control-Allow-Credentials", "true");
		// res.header("X-Powered-By", ' 3.2.1')
		// res.header("Content-Type", "application/json;charset=utf-8");
		//res.setHeader("P3P", "CP=CAO PSA OUR");
		//res.setHeader("P3P", "CP=CURa ADMa DEVa PSAo PSDo OUR BUS UNI PUR INT DEM STA div COM NAV OTC NOI DSP COR");
		return next();
	});
})(router);

router.get('/check', wx);

router.get('/sn', sn);

export default router;
