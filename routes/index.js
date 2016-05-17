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
    var limit = 20;
    var filter = {};
    // var query = JSON.stringify(req.query);
    var query = req.query;
    console.log("query");
    console.log(query);
    console.log(typeof query);
    limit = parseInt(query['limit']);

    // if (query['queryId']) {
    //   var queryId = query['queryId'];
    //   console.log(query['queryId']);
    //   console.log(query['queryId']['_id']);
    // }

    // Limit data
    if (query["lastId"]) {
      filter["_id"] = {$lt: mongoose.Types.ObjectId(query["lastId"])};
    }
    // Add categories to filter 
    if (query["cat"]){
      var cat = query["cat"];
      if (typeof cat != "string") {
        for (i = 0; i < cat.length; i++){
          cat[i] = mongoose.Types.ObjectId(cat[i]);
        }
        filter["category"] = {$in: cat};
      } else {
        filter["category"] = mongoose.Types.ObjectId(cat);
      }
    }
    // Add tags to filter
    if (query["tags"]){
      var tags = query["tags"];
      if (typeof tags != "string") {
        filter["tags"] = {$in: tags};
      } else {
        filter["tags"] = tags;
      }
    }
    Post.find(filter, function(err, posts){
      if(err){ return next(err); }
      res.json(posts);
    }).sort({_id:-1}).limit(limit);
  })
  .post(auth, function(req, res, next) {
    if (req.body.tags) {
      req.body.tags = req.body.tags.replace(/\s/g, '').split(",");
    }
    var post = new Post(req.body);
    // post.tags = post.tags.replace(/\s/''/g).split(",");
    // post.category = req.category;
    post.author = req.payload.username;

    post.save(function(err, post){
      if(err){ return next(err); }

      res.json(post);
    });
  });

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

router.route('/posts/:post/:slug')
  .get(function(req, res, next) {
    req.post.populate('comments', function(err, post) {
      if (err) { return next(err); }
      res.json(req.post);
    });
  })
  .put(function(req, res, next) {
    // post.update({_id: req.post._id}, post, function(err, post){
    //   if (err) { return next(err); }
    //   console.log(post);
    //   res.json(post);
    // });
    req.post.remove(function(err, post){
      if (err) { return next(err); }
      return res.send("Successfully removed the post!");
    });
    if (req.body.tags) {
      req.body.tags = req.body.tags.replace(/\s/g, '').split(",");
    }
    req.post = new Post(req.body);
    console.log(req.post);
    req.post.save(function(err, post){
        if(err){ return next(err); }

        // res.json(post);
      });
  })
  .delete(function(req, res, next){
    req.post.remove(function(err, post){
      if (err) { return next(err); }
      return res.send("Successfully removed the post!");
    });
  });

// Star/unstar
router.put('/posts/:post/:slug/star', auth, function(req, res, next) {
  // Call the upvote method defined in post schema
  // return res.send(req.payload._id);
  // console.log(req.payload._id);
  // console.log(req.payload);
  // req.post = new Post(req.body);
  req.post.stars.push(req.payload.username);
  // req.post = new Post(req.body);
  // req.post.star.push(ObjectId("572f4d41217e2378459ba8c9"));
  req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(post);
    });
});
router.delete('/posts/:post/:slug/star', auth, function(req, res, next) {
  // Call the upvote method defined in post schema
  req.payload.username;
});
// PUT individual post
// DELETE individual post
// PUT upvote individual post
router.put('/posts/:post/:slug/upvote', auth, function(req, res, next) {
  // Call the upvote method defined in post schema
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

// POST individual comment
router.post('/posts/:post/:slug/comments', auth, function(req, res, next) {
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
router.put('/posts/:post/:slug/comments/:comment/upvote', auth, function(req, res, next) {
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
// GET category by slug 
router.get('/categories/:slug', function(req, res, next){
  console.log(req.params.slug);
  Category.findOne( {slug: req.params.slug}, function(err, category) {
    if(err){ return next(err);}
    res.json(category);
  });
})
// GET posts under category
router.get('/categories/:slug/posts', function(req, res, next) {
  
  Category.findOne( {slug: req.params.slug}, {_id:1}, function(err, cat) {
    if(err) {return next(err);}
    Post.find({category: cat}, function(err, posts){
      if(err){ return next(err); }
      console.log(posts);
      res.json(posts);
    });
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

router.delete('/categories/:category', function(req, res, next){
  req.category.remove(function(err, category){
    if (err) { return next(err); }
    return res.send("Successfully removed the category!");
  });
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
