var mongoose = require('mongoose');

var AnswerSchema = new mongoose.Schema({
  content: String,
  author: String,
  // upvotes: {type: Number, default: 0},
  questions: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }
});

// AnswerSchema.methods.upvote = function(cb) {
//   this.upvotes += 1;
//   this.save(cb);
// };

mongoose.model('Answer', AnswerSchema);