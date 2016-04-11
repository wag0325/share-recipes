var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  category: String,
  link: String,
  img_url: String,
  body: String,
  author: String,
  upvotes: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: { createdAt: 'created_at' } });

PostSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

mongoose.model('Post', PostSchema);
