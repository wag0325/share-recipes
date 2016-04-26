var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  slug: { type:String, maxlength:40 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  link: String,
  img_url: String,
  body: String,
  author: String,
  tags: [String],
  upvotes: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: { createdAt: 'created_at' } });

PostSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

// Slugify post title 
function slugify(text) {

  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

PostSchema.pre('save', function(next){
  this.slug = slugify(this.title);
  next();
});

mongoose.model('Post', PostSchema);
