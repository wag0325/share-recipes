var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var Category = mongoose.model('Category');
var User = mongoose.model('User');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.route('/posts')
  .get(function(req, res, next) {
    Post.find(function(err, posts){
      if(err){ return next(err); }

      res.json(posts);
    });
  })
  .post(auth, function(req, res, next) {
    req.body.tags = req.body.tags.replace(/\s/g, '').split(",");
    var post = new Post(req.body);
    // post.tags = post.tags.replace(/\s/''/g).split(",");
    // post.category = req.category;
    post.author = req.payload.username;

    post.save(function(err, post){
      if(err){ return next(err); }

      res.json(post);
    });
  });

// GET post list by filters

// Load :post faster
router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
});

router.route('/posts/:post')
  .get(function(req, res, next) {
    req.post.populate('comments', function(err, post) {
      if (err) { return next(err); }
      res.json(req.post);
    });
  })
  .put(function(req, res, next) {
    req.post.update(req.post, function(err, post){
      if (err) { return next(err); }
      return res.send("Successfully updated the post!");
    });
  })
  .delete(function(req, res, next){
    req.post.remove(function(err, post){
      if (err) { return next(err); }
      return res.send("Successfully removed the post!");
    });
  });
  
// PUT individual post
// DELETE individual post
// PUT upvote individual post
router.put('/posts/:post/upvote', auth, function(req, res, next) {
  // Call the upvote method defined in post schema
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

// POST individual comment
router.post('/posts/:post/comments', auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.author = req.payload.username;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

// Load :post faster
router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment;
    return next();
  });
});
// DELETE individual comment
// PUT upvote individual comment
router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
  // Call the upvote method defined in post schema
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});

// GET categories
router.get('/categories', function(req, res, next) {
  Category.find(function(err, categories){
    if(err){ return next(err); }

    res.json(categories);
  });
});

// POST categories
router.post('/categories', auth, function(req, res, next){
  var category = new Category(req.body);
  category.author = req.payload.username;

  category.save(function(err, category){
    if(err){ return next(err); }

    res.json(category);
  });
});

// Load :post faster
router.param('category', function(req, res, next, id) {
  var query = Category.findById(id);
  query.exec(function (err, category){
    if (err) { return next(err); }
    if (!category) { return next(new Error('can\'t find category')); }

    req.category = category;
    return next();
  });
});

// GET individual category
router.get('/categories/:category', function(req, res, next) {
  res.json(req.category);
});
// GET posts under category
router.get('/categories/:category/posts', function(req, res, next) {
  Post.find({category: req.category}, function(err, posts){
    if(err){ return next(err); }
    console.log(posts);
    res.json(posts);
  });
});
// POST register
router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});

// POST login
router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;
