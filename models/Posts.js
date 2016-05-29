var mongoose = require('mongoose');
var Category = require('./Categories.js');
var CategorySchema = mongoose.model('Category').schema;

var PostSchema = new mongoose.Schema({
  title: String,
  slug: { type:String, maxlength:40 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  // category: CategorySchema,
  link: String,
  img_url: String,
  // img_url: [{type: String, match: /^http:\/\//i}],
  body: String,
  author: String,
  price: {
    amount: {type: Number},
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP']
    }
  },
  tags: [String],
  upvotes: {type: Number, default: 0},
  stars: [{
    type: String,
    ref: 'User'
  }],
  starsCount: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: { createdAt: 'created_at' } });

PostSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

PostSchema.methods.upStarCount = function(cb) {
  this.starsCount += 1;
  this.save(cb);
}

PostSchema.methods.downStarCount = function(cb) {
  this.starsCount -= 1;
  this.save(cb);
}

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
