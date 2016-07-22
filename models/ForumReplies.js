// var mongoose = require('mongoose');
// var ForumCategory = require('./ForumCategories.js');
// var ForumTopic = require('./ForumTopics.js');
// var User = require('./Users.js');
// var CategorySchema = mongoose.model('ForumCategory').schema;

// var ForumReplySchema = new mongoose.Schema({
//   title: String,
//   slug: { type:String, maxlength:40 },
//   category: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumCategory' },
//   topic_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumTopic' },
//   body: String,
//   author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   upvotes: {type: Number, default: 0}
// }, { timestamps: true });

// ForumReply.methods.upvote = function(cb) {
//   this.upvotes += 1;
//   this.save(cb);
// };

// mongoose.model('ForumReply', ForumReply);
