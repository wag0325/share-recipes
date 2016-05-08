var app = angular.module('services', []);

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
  o.get = function(id, slug) {
	  return $http.get('/posts/' + id + '/' + slug).then(function(res){
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
		return $http.put('/posts/' + id + '/' + slug, post);
	};
	o.delete = function(id){
		return $http.delete('/posts/' + id + '/' + slug);
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
	cat.getBySlug = function(slug) {
	  	return $http.get('/categories/' + slug).then(function(res){
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
	cat.getPostsBySlug = function(slug) {
		return $http.get('/categories/' + slug + '/posts').then(function(res){
		    return res.data;
		});
	}
	cat.delete = function(id) {
		return $http.delete('/categories/' + id);
	}
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