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
    	resolve: {
		    categoryPromise: ['categories', function(categories){
		      return categories.getAll();
		    }]
	  	}
    })
    .state('posts', {
	  url: '/posts/{id}',
	  templateUrl: '/posts.html',
	  controller: 'PostsCtrl',
	  resolve: {
	    post: ['$stateParams', 'posts', function($stateParams, posts) {
	    	console.log($stateParams.id);
	      return posts.get($stateParams.id);
	    }]
	  }
		})
    .state('postsedit', {
	  url: '/posts/{id}/edit',
	  templateUrl: '/post-create.html',
	  controller: 'UpdatePostsCtrl',
	  resolve: {
	    post: ['$stateParams', 'posts', function($stateParams, posts) {
	    	console.log($stateParams.id);
	      return posts.get($stateParams.id);
	    }],
	    categoryPromise: ['categories', function(categories){
		      return categories.getAll();
		  }]
	  }
	})
  .state('categoriesCreate', {
	  url: '/createcategory',
	  templateUrl: '/category-create.html',
	  controller: 'CreateCategoriesCtrl',
	  resolve: {
	    categoryPromise: ['categories', function(categories){
	      return categories.getAll();
	    }]
  	}
	})
	.state('categories', {
		url: '/categories/{id}',
		templateUrl: '/categories.html',
		controller: 'CategoriesCtrl',
		resolve: {
			category: ['$stateParams', 'categories', function($stateParams, categories){
				// return categories.getAll();
				return categories.get($stateParams.id);
				// return "category";
			}],
			postsByCat: ['$stateParams', 'categories', function($stateParams, categories){
				// return categories.getAll();
				return categories.getPosts($stateParams.id);
				// return "category";
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
'$scope', 'posts', 'auth', '$state',
function($scope, posts, auth, $state){
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.posts = posts.posts;
	$scope.allTags = [];
	$scope.selectedTags = [];
	$scope.orderOptions = [
		{name: 'Most Liked', value: 'upvotes'},
		{name: 'Newest', value: 'created_at'},
		{name: 'Most Reviewed', value: 'comments.length'}];
	// List tags from posts
	for (var i = 0; i < $scope.posts.length; i++) {
		for (var j = 0; j < $scope.posts[i].tags.length; j++){
			if ($scope.allTags.indexOf($scope.posts[i].tags[j]) == -1) {
    		$scope.allTags.push($scope.posts[i].tags[j]);
			}
		}
	}
	console.log($scope.allTags);
	// Selected Tags
	$scope.addTag = function(tag) {
		if ($scope.selectedTags.indexOf(tag) == -1) {
			$scope.selectedTags.push(tag);
		}
		console.log($scope.selectedTags);
	}

	// noDuplicatesArr($scope.SelectedctedTags);
	// $scope.editPost = function(id) {
	// 	console.log("editPost", id);
	// 	$state.go('postsedit', {id: id});
	// };

	$scope.deletePost = function(id) {
		console.log("deletePost", id);
		posts.delete(id).error(function(error){
      $scope.error = error;
    }).then(function(){
      posts.getAll();
    });
	}
	$scope.incrementUpvotes = function(post) {
	  posts.upvote(post);
	};
}]);

app.controller('CreatePostsCtrl', [
'$scope',
'posts',
'auth',
'$state',
'categories',
function($scope, posts, auth, $state, categories){
	$scope.isLoggedIn = auth.isLoggedIn;
	console.log("CreatePostsCtrl");
	$scope.categories = categories.categories;
	var postDefault = {};
	$scope.pgh = "Create Post";
	$scope.submit = "Post";

	$scope.addPost = function(){
		// var postNumber = $scope.posts.length;
		// console.log("add");
		if(!$scope.post.title || $scope.post.title === '') { return; }
		//added author to posts.create
		posts.create({
	    title: $scope.post.title,
	    link: $scope.post.link,
	    img_url: $scope.post.img_url,
	    body: $scope.post.body,
	    category: $scope.post.category,
	    tags: $scope.post.tags
	  }).error(function(error){
      $scope.error = error;
    }).then(function(){
    	// should goto the post
    	$state.go('home');
    });
    // Remove posts 
    // Update existing posts
    // Find a list of a posts
		$scope.title = '';
		$scope.link = '';
	};
	$scope.reset = function() {
		$scope.post = postDefault;
	};
	$scope.back = function() {
		$state.go('home');
	}
}]);


// To combine create and update posts ctrl, 
//I need to call post.get() inside the controller
app.controller('UpdatePostsCtrl', [
'$scope',
'posts',
'post',
'auth',
'$state',
'categories',
function($scope, posts, post, auth, $state, categories){
	$scope.currentUser = auth.currentUser;
	if (post.author == $scope.currentUser) {
		$scope.isLoggedIn = auth.isLoggedIn;
	}
	$scope.categories = categories.categories;
	var postDefault = {};
	$scope.pgh = "Create Post";
	$scope.submit = "Post";
	$scope.post = postDefault;

	if (post) {
		$scope.pgh = "Update Post";
		$scope.submit = "Update";
		$scope.update = true; 
		$scope.post = post;
	} else {
		$scope.post = postDefault;
	}

	$scope.addPost = function() {
		console.log("update");
		console.log($scope.post._id);
		console.log(post._id);
		posts.update($scope.post._id, {
			_id: $scope.post._id,
	    title: $scope.post.title,
	    link: $scope.post.link,
	    img_url: $scope.post.img_url,
	    body: $scope.post.body,
	    category: $scope.post.category,
	    tags: $scope.post.tags
	  }).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('posts', {id: $scope.post._id});
    });
	};
	$scope.reset = function() {
		$scope.post = postDefault;
	};
	$scope.back = function() {
		$state.go('home');
	}
}]);

app.controller('PostsCtrl', [
'$scope',
'posts',
'post',
'auth',
'$state',
function($scope, posts, post, auth, $state){
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
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
	$scope.editPost = function(id) {
		console.log("editPost", id);
		$state.go('postsedit', {id: id});
	};
	$scope.deletePost = function(id) {
		console.log("deletePost", id);
		posts.delete(id).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('login');
    });
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
	    desc: $scope.desc
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

app.controller('CategoriesCtrl', [
'$scope',
'categories',
'category',
'postsByCat',
'auth',
function($scope, categories, category, postsByCat, auth){
	// console.log(posts);
	// $scope.posts = posts;
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.category = category;
	// console.log("category", $scope.category);
	$scope.posts = postsByCat;
	console.log($scope.posts);
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
	o.update = function(id, post){
		return $http.put('/posts/' + id, post);
	};
	o.delete = function(id){
		return $http.delete('/posts/' + id);
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
  cat.get = function(id) {
	  return $http.get('/categories/' + id).then(function(res){
	    return res.data;
	  });
	};
	cat.create = function(category){
		return $http.post('/categories', category, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
  	});
	};
	cat.getPosts = function(id) {
		return $http.get('/categories/' + id + '/posts').then(function(res){
	    return res.data;
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

app.filter('noDuplicatesArr', function(){
	return function(arr) {
		var array = [], freq = [], prev; 

		arr.sort();
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] !== prev){
				array.push(arr[i]);
				freq.push(1);
			}	else {
				b[b.length-1]++;
			}

			prev = arr[i];
		}
		// returns array w/ no duplicates and the frequencies 
		return [array, freq];
	}
});