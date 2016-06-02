var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var nodemailer = require('nodemailer');
var cred = require('../cred.js');

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var Category = mongoose.model('Category');
var User = mongoose.model('User');
var auth = jwt({secret: cred.JWT_SECRET, userProperty: cred.JWT_USER});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.route('/posts')
  .get(function(req, res, next) {
    var limit = 20;
    var sort;
    var filters = {};
    // var query = JSON.stringify(req.query);
    var query = req.query;
    console.log("query");
    console.log(query);
    console.log(typeof query);
    // limit = parseInt(query['limit']);

    // if (query['queryId']) {
    //   var queryId = query['queryId'];
    //   console.log(query['queryId']);
    //   console.log(query['queryId']['_id']);
    // }
    for (var k in query) {
      if (query.hasOwnProperty(k)) {
        console.log(k + ">" +query[k]);
        if (k == "limit") {
          limit = parseInt(query['limit']);
        } else if (k == "sort"){
          sort = JSON.parse(query[k]);
          console.log("sort", sort);
        } else if (k == "lastValue") {
          var last = JSON.parse(query[k]);
          for (var k in last) {
            if (k == "_id") {
              filters[k] = {$lt: mongoose.Types.ObjectId(last[k])};
            } else {
              filters[k] = {$lt: last[k]};
            }
          }
          console.log("last", last);
        }else if (k == "lastId" && k !== "lastStarsCount" && k !== "lastUpvote") {
          filters["_id"] = {$lt: mongoose.Types.ObjectId(query[k])};
        } else if (k == "lastStarsCount") {
          filters["starsCount"] = {$lt: query[k]};
        }else if (k == "lastUpvote") {
          filters["upvotes"] = {$lt: query[k]}; 
        } else if (k == "cat") {
          var cat = query[k];
          if (typeof cat != "string") {
            for (i = 0; i < cat.length; i++){
              cat[i] = mongoose.Types.ObjectId(cat[i]);
            }
            filters["category"] = {$in: cat};
          } else {
            filters["category"] = mongoose.Types.ObjectId(cat);
          }
        } else if (k == "tags") {
          var tags = query[k];
          if (typeof tags != "string") {
            filters["tags"] = {$in: tags};
          } else {
            filters["tags"] = tags;
          }
        } else {
          filters[k] = query[k];
        }
      }
      // if (q["lastId"]) {
      //   filters["_id"] = {$lt: mongoose.Types.ObjectId(query["lastId"])};
      // } else if (q["cat"]){
      //   var cat = query["cat"];
      //   if (typeof cat != "string") {
      //     for (i = 0; i < cat.length; i++){
      //       cat[i] = mongoose.Types.ObjectId(cat[i]);
      //     }
      //     filters["category"] = {$in: cat};
      //   } else {
      //     filters["category"] = mongoose.Types.ObjectId(cat);
      //   }
      // } else if (query["tags"]){
      //   var tags = query["tags"];
      //   if (typeof tags != "string") {
      //     filters["tags"] = {$in: tags};
      //   } else {
      //     filters["tags"] = tags;
      //   }
      // } else {

      // }
    }
    console.log("filters", filters);
    console.log("sort", sort);
    Post.find(filters, function(err, posts){
      if(err){ return next(err); }
      res.json(posts);
    }).sort(sort).limit(limit);

    // Post.find(filters, function(err, posts){
    //   if(err){return next(err);}
    //   res.json(posts);
    // }).sort(sort).skip(pageSize*(page_num-1)).limit(pageSize);
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
    req.post.viewCount(function(err, post){
      if (err) { return next(err); }
    });
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
    // req.post.remove(function(err, post){
    //   if (err) { return next(err); }
    //   return res.send("Successfully removed the post!");
    // });
    // // if (req.body.tags) {
    // //   req.body.tags = req.body.tags.replace(/\s/g, '').split(",");
    // // }
    // req.post = new Post(req.body);
    // console.log(req.post);
    // req.post.save(function(err, post){
    //     if(err){ return next(err); }

    //     // res.json(post);
    //   });
    console.log('post', req.post);
    Post.update({_id: mongoose.Types.ObjectId(req.post._id)}, req.post, {upsert:true}, function(err, post){
        if(err){ return next(err); }
        res.json(post);
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
  req.post.stars.push(req.payload.username);
  req.post.upStarCount(function(err, post){
    if (err) { return next(err); }
  });
  req.post.save(function(err, post) {
      if(err){ return next(err); }
      res.json(post);
    });
});
router.delete('/posts/:post/:slug/star', auth, function(req, res, next) {
  // console.log("delete");
  req.post.stars.pull(req.payload.username);
  req.post.downStarCount(function(err, post){
    if (err) { return next(err); }
  });
  req.post.save(function(err, post) {
      if(err){ return next(err); }
      res.json(post);
    });
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
  user.email = req.body.email;
  user.setPassword(req.body.password);

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

router.get('/forgot', function(req, res, next){
  res.render('forgot', {
    user: req.user
  });
});

router.post('/forgot', function(req, res, next){
  // return res.send(req.body.email);
  User.findOne({email: req.body.email}, function(err, user){
    if (err) { return next(err); }
    // res.json(user);
    if(user) {
      // user.setPassword(newPasswordString, function(){
      //   user.save();
      //   return res.status(200).json({msg: 'password reset successful'});
      // });
      var token = user.setToken();
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000;
      // user.setPassword(req.body.password);


      var transporter = nodemailer.createTransport({
          service: cred.SERVICE_TYPE,
          auth: {
              user: cred.SERVICE_USER,
              pass: cred.SERVICE_PASS
          }
      });

      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/#/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        return res.json({message:'An e-mail has been sent to ' + user.email + ' with further instructions.'});
        // req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        // done(err, 'done');
      });
      // console.log('created');
      // transporter.sendMail({
      // from: 'wag0325@gmail.com',
      //   to: 'sahn889@gmail.com',
      //   subject: 'hello world!',
      //   text: 'hello world!'
      // });
      // var smtpTransport = nodemailer.createTransport('SMTP', {
      //   service: 'Gmail',
      //   auth: {
      //     user: 'wag0325@gmail.com',
      //     pass: 'lido2025gmail'
      //   }
      // });
      // var mailOptions = {
      //   to: user.email,
      //   from: 'passwordreset@demo.com',
      //   subject: 'Node.js Password Reset',
      //   text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
      //     'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
      //     'http://' + req.headers.host + '/reset/' + token + '\n\n' +
      //     'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      // };
      // smtpTransport.sendMail(mailOptions, function(err) {
      //   console.log('An e-mail has been sent to ' + user.email + ' with further instructions.');
      //   // req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
      //   // done(err, 'done');
      // });

      user.save(function (err){
        if(err){ return next(err); }

        // return res.json({token: user.generateJWT()})
      });
    } else {
      // return res.status(200).json({status:0, msg: 'This user does not exist'});
      return res.status(200).json({message: 'This user does not exist'});
    }
  });
});

router.get('/reset/:token', function(req, res, next){
  User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function(err, user){
    if (err) { return next(err); }
    if(!user) {
      return res.status(400).json({message: 'Password reset token is invalid or has expired.'});
      // req.flash('error', 'Password reset token is invalid or has expired.');
      // return res.redirect('/forgot');
    }
    res.render('reset', {
      user: req.user
    });
  });
});

router.post('/reset/:token', function(req, res, next){
  console.log(req.params.token);
  User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function(err, user){
    if (err) { return next(err); }
    if(!user) {
      return res.status(400).json({message: 'Password reset token is invalid or has expired.'});
      // req.flash('error', 'Password reset token is invalid or has expired.');
      // return res.redirect('/forgot');
    }
    
    user.setPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    user.save(function (err){
      if(err){ return next(err); }

      return res.json({token: user.generateJWT(), message: 'Successfuly reset your password!'})
    });

  });
});
module.exports = router;
