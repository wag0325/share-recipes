var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
	title: String,
	desc: String
});

mongoose.model('Category', CategorySchema);
