import * as mongoose from 'mongoose';

(mongoose as any).Promise = Promise;
mongoose.connect('mongodb://127.0.0.1/fl')
	.then(() => {
		console.log('connected');
		const s = new mongoose.Schema({
			name: String
		});

		const P = mongoose.model('Person', s, 'person');
		P.create({ name: 'y', test: 3 }).then((p) => {
			console.log('saved');
		}, (err) => {
			console.error(err);
		});

		// const p = new P({ name: 'yy', test: 2 });
		// p.save().then((p) => {
		// 	console.log('saved');
		// }, (err) => {
		// 	console.error(err);
		// });
	}, (e) => {
		console.error(e);
	});
