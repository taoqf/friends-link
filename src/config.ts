import { join } from 'path';
import { IConfig } from './interfaces';

const config = require(join(process.cwd(), './config.json')) as IConfig;

export default config;
