import * as express from 'express';
import config from './config';

const router = express.Router();

router.get('/test', (req, res, next) => {
	res.json({
		test: '欢迎来到友链'
	});
});

export default router;
