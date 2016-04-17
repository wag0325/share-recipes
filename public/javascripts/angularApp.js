var app = angular.module('shareRecipes', [
	'ui.router',
	'HomeCtrl',
	'PostsCtrl',
	'CreatePostsCtrl',
	'UpdatePostsCtrl',
	'CategoriesCtrl',
	'CreateCategoriesCtrl',
	'AuthCtrl',
	'NavCtrl'
	]);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'HomeCtrl',
      resolve: {
		    postPromise: ['posts', function(posts){
		      return posts.getAll();
		    }],
		    categoryPromise: ['categories', function(categories){
		      return categories.getAll();
		    }]
	  	}
    })
    .state('postsCreate', {
    	url: '/create',
    	templateUrl: '/post.create.html',
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
	  templateUrl: '/post.create.html',
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
	  templateUrl: '/category.create.html',
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

app.filter('filterByTags', function() {
  return function(posts, tags) {
    return posts.filter(function(post) {
      for (var i in post.tags) {
        if (tags.indexOf(post.tags[i]) != -1) {
          return true;
        }
    	}
    	return false;
		});
  };
});