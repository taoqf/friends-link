import * as express from 'express';
import config from './config';
import wx from './wx-check-signature';
import sn from './signature';

const router = express.Router();

router.get('/check', wx);

router.get('/signature', sn);

export default router;
