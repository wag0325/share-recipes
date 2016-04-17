var app = angular.module('shareRecipes', [
	'ui.router',
	'HomeCtrl',
	'PostsCtrl',
	'CreatePostsCtrl',
	'UpdatePostsCtrl',
	'CategoriesCtrl',
	'CreateCategoriesCtrl',
	'AuthCtrl',
	'NavCtrl',
	'services'
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