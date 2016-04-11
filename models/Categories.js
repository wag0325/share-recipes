var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
	title: String,
	posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

mongoose.model('Category', CategorySchema);
