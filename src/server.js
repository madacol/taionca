import sirv from 'sirv';
import polka from 'polka';
import * as sapper from '@sapper/server';
import sessions from './middlewares/sessions';
import morgan from 'morgan';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

export default polka() // You can also use Express
	.use(
		morgan(dev ? 'dev' : 'combined'),
		sirv('static', { dev }),
		sessions(dev),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
