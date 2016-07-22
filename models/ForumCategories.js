// var mongoose = require('mongoose');

// var ForumCategorySchema = new mongoose.Schema({
// 	title: String,
// 	slug: { 
// 		type: String,
// 		default: '',
// 		trim: true,
// 		unique: true,
// 		required: 'Slug cannot be blank' },
// 	description: String,
// 	parent_slug: {
// 		type: String,
// 		ref: 'ForumCategory'
// 	},
// 	ancestors_slug: [{
// 		type: String,
// 		ref: 'ForumCategory'
// 	}],
// 	topic_counts: {type: Number, default: 0},
// 	reply_counts: {type: Number, default: 0}
// });

// mongoose.model('ForumCategory', CategorySchema);
