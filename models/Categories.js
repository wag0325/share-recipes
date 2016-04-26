var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
	title: String,
	slug: { 
		type: String,
		default: '',
		trim: true,
		unique: true,
		required: 'Slug cannot be blank' },
	desc: String
});

mongoose.model('Category', CategorySchema);
