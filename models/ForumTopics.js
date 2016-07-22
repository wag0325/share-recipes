// var mongoose = require('mongoose');
// var ForumCategory = require('./ForumCategories.js');
// var User = require('./Users.js');
// var CategorySchema = mongoose.model('ForumCategory').schema;

// var ForumTopicSchema = new mongoose.Schema({
//   title: String,
//   slug: { type:String, maxlength:40 },
//   category: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumCategory' },
//   body: String,
//   author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   reply_counts: {type: Number, default: 0},
//   view_counts: {type: Number, default: 0},
//   last_reply_author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
// }, { timestamps: true });

// ForumTopicSchema.methods.viewed = function(cb) {
//   this.view_counts += 1;
//   this.save(cb);
// };

// mongoose.model('ForumTopic', ForumTopic);
