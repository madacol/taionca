import sirv from 'sirv';
import express from 'express';
import * as sapper from '@sapper/server';
import jsonHelper from './middlewares/jsonHelper';
import sessions from './middlewares/sessions';
import morgan from 'morgan';
import { json } from 'body-parser';
import requireLogin from './middlewares/requireLogin';


const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

// @ts-ignore
export default express() // You can also use Express
	.set('trust proxy', 1)
	.use(
		morgan(dev ? 'dev' : 'combined'),
		sirv('static', { dev }),
		sessions(dev),
	)
	.use('/api',
		jsonHelper,
		requireLogin,
		json(),
	)
	.use(
		sapper.middleware({
			session: (req) => ({user: req.session.user})
		})
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
