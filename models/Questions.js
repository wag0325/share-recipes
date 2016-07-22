var mongoose = require('mongoose');
var Category = require('./Answers.js');
var CategorySchema = mongoose.model('Answer').schema;

var QuestionSchema = new mongoose.Schema({
  title: String,
  slug: { type:String, maxlength:40 },
  author: String,
  content: String,
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
  tags: [{
    text: String
  }],
  // upvotes: {type: Number, default: 0},
  // stars: [{
  //   type: String,
  //   ref: 'User'
  // }],
  // starsCount: {type: Number, default: 0},
  // viewCounts: {type: Number, default: 0},
  // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

// PostSchema.methods.upvote = function(cb) {
//   this.upvotes += 1;
//   this.save(cb);
// };
// PostSchema.methods.viewCount = function(cb) {
//   this.viewCounts += 1;
//   this.save(cb);
// };
// PostSchema.methods.upStarCount = function(cb) {
//   this.starsCount += 1;
//   this.save(cb);
// }

// PostSchema.methods.downStarCount = function(cb) {
//   this.starsCount -= 1;
//   this.save(cb);
// }

// Slugify post title 
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

QuestionSchema.pre('save', function(next){
  this.slug = slugify(this.title);
  next();
});

mongoose.model('Question', QuestionSchema);
