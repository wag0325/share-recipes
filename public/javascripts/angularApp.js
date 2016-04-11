var app = angular.module('shareRecipes', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
		    postPromise: ['posts', function(posts){
		      return posts.getAll();
		    }]
	  	}
    })
    .state('postsCreate', {
    	url: '/create',
    	templateUrl: '/post-create.html',
    	controller: 'CreatePostsCtrl',

    })
    .state('posts', {
	  url: '/posts/{id}',
	  templateUrl: '/posts.html',
	  controller: 'PostsCtrl',
	  resolve: {
	    post: ['$stateParams', 'posts', function($stateParams, posts) {
	      return posts.get($stateParams.id);
	    }]
	  }
	})
  .state('categories', {
	  url: '/createcategory',
	  templateUrl: '/category-create.html',
	  controller: 'CreateCategoriesCtrl',
	  resolve: {
	    categoryPromise: ['categories', function(categories){
	      return categories.getAll();
	    }]
  	}
	})
  .state('login', {
	  url: '/login',
	  templateUrl: '/login.html',
	  controller: 'AuthCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	    if(auth.isLoggedIn()){
	      $state.go('home');
	    }
	  }]
	})
	.state('register', {
	  url: '/register',
	  templateUrl: '/register.html',
	  controller: 'AuthCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	    if(auth.isLoggedIn()){
	      $state.go('home');
	    }
	  }]
	});
  $urlRouterProvider.otherwise('home');
}]);


app.controller('MainCtrl', [
'$scope', 'posts', 'auth', 
function($scope, posts, auth){
	$scope.isLoggedIn = auth.isLoggedIn;

 //  $scope.posts = [
 //  {title: 'post 1', upvotes: 5},
 //  {title: 'post 2', upvotes: 2},
 //  {title: 'post 3', upvotes: 15},
 //  {title: 'post 4', upvotes: 9},
 //  {title: 'post 5', upvotes: 4}
	// ];

	$scope.posts = posts.posts;

	$scope.addPost = function(){

		// var postNumber = $scope.posts.length;
		// console.log(postNumber);
		if(!$scope.title || $scope.title === '') { return; }
		//added author to posts.create
		posts.create({
	    title: $scope.title,
	    link: $scope.link
	  });

	  // posts.addComment(posts._id, {
	  //   body: $scope.body,
	  //   author: 'user'
	  // }).success(function(comment){
	  // 	$scope.post.comments.push(comment);
	  // });
		$scope.title = '';
		$scope.link = '';
	};

	$scope.incrementUpvotes = function(post) {
	  posts.upvote(post);
	};
}]);

app.controller('CreatePostsCtrl', [
'$scope',
'posts',
'auth',
'$state',
function($scope, posts, auth, $state){
	$scope.isLoggedIn = auth.isLoggedIn;
	console.log("CreatePostsCtrl");
	// $scope.addPost = function(){
	$scope.addPost = function(){
		// var postNumber = $scope.posts.length;
		// console.log(postNumber);
		if(!$scope.title || $scope.title === '') { return; }
		//added author to posts.create
		posts.create({
	    title: $scope.title,
	    link: $scope.link,
	    img_url: $scope.img_url,
	    body: $scope.body,
	    category: $scope.category
	  }).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
	  // posts.addComment(posts._id, {
	  //   body: $scope.body,
	  //   author: 'user'
	  // }).success(function(comment){
	  // 	$scope.post.comments.push(comment);
	  // });
		$scope.title = '';
		$scope.link = '';
	};
}]);

app.controller('PostsCtrl', [
'$scope',
'posts',
'post',
'auth',
function($scope, posts, post, auth){
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.post = post;

	$scope.addComment = function(){
	  if($scope.body === '') { return; }
	  posts.addComment(post._id, {
	    body: $scope.body,
	    author: 'user'
	  }).success(function(comment){
	  	$scope.post.comments.push(comment);
	  });
	  $scope.body = '';
	};

	$scope.incrementUpvotes = function(comment) {
	  posts.upvoteComment(post, comment);
	};
}]);

app.controller('AuthCtrl', [
'$scope', 
'$state', 
'auth', 
function($scope, $state, auth){
 $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}]);

app.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);

app.controller('CreateCategoriesCtrl', [
'$scope',
'auth',
'categories',
function($scope, auth, categories) {
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.categories = categories.categories;

	$scope.addCategory = function(){
		// var postNumber = $scope.posts.length;
		// console.log(postNumber);
		if(!$scope.title || $scope.title === '') { return; }
		//added author to posts.create
		categories.create({
	    title: $scope.title,
	  })
	  // posts.addComment(posts._id, {
	  //   body: $scope.body,
	  //   author: 'user'
	  // }).success(function(comment){
	  // 	$scope.post.comments.push(comment);
	  // });
		$scope.title = '';
	};
}]);

app.factory('posts', [
'$http', 
'auth',
function($http, auth){
  var o = {
    posts: []
  };
  o.getAll = function() {
    return $http.get('/posts').success(function(data){
      angular.copy(data, o.posts);
    });
  };
  o.get = function(id) {
	  return $http.get('/posts/' + id).then(function(res){
	    return res.data;
	  });
	};
  o.create = function(post) {
	  return $http.post('/posts', post, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
  	}).success(function(data){
	    o.posts.push(data);
	  });
	};
	o.upvote = function(post) {
	  return $http.put('/posts/' + post._id + '/upvote', null, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	    post.upvotes += 1;
	  });
	};
	o.addComment = function(id, comment) {
	  return $http.post('/posts/' + id + '/comments', comment, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  });
	};
	o.upvoteComment = function(post, comment) {
	  return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote', null, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	    comment.upvotes += 1;
	  });
	};
  return o;
}]);

app.factory('categories', [
'$http', 
'auth',
function($http, auth){
	var cat = {
		categories: []
	};
	cat.getAll = function() {
    return $http.get('/categories').success(function(data){
      angular.copy(data, cat.categories);
    });
  };
	cat.create = function(category){
		return $http.post('/categories', category, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
  	});
	};
	return cat;
}]);

app.factory('auth', ['$http', '$window', function($http, $window){
	var auth = {};

	auth.saveToken = function (token){
	  $window.localStorage['share-recipes-token'] = token;
	};

	auth.getToken = function (){
	  return $window.localStorage['share-recipes-token'];
	}

	// returns a boolean if the user if logged in 
	auth.isLoggedIn = function(){
	  var token = auth.getToken();

	  // check token expiration date
	  if(token){
	    var payload = JSON.parse($window.atob(token.split('.')[1]));

	    return payload.exp > Date.now() / 1000;
	  } else {
	    return false;
	  }
	};

	//returns the username
	auth.currentUser = function(){
	 	if(auth.isLoggedIn()){
	    var token = auth.getToken();
	    var payload = JSON.parse($window.atob(token.split('.')[1]));

	    return payload.username;
	  }
	};

	// Register
	auth.register = function(user){
	  return $http.post('/register', user).success(function(data){
	    auth.saveToken(data.token);
	  });
	};

	// Login
	auth.logIn = function(user){
	  return $http.post('/login', user).success(function(data){
	    auth.saveToken(data.token);
	  });
	};

	// Logout - removes token from the local storage
	auth.logOut = function(){
	  $window.localStorage.removeItem('share-recipes-token');
	};

	return auth;
}]);