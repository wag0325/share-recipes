var app = angular.module('shareRecipes', [
	'ui.router',
	'infinite-scroll',
	'HomeCtrl',
	'PostsCtrl',
	'CreatePostsCtrl',
	'UpdatePostsCtrl',
	'CategoriesCtrl',
	'CreateCategoriesCtrl',
	'AuthCtrl',
	'NavCtrl',
	'services',
	'filters'
	]);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'public/views/home.html',
      controller: 'HomeCtrl',
      resolve: {
		    // postPromise: ['posts', function(posts){
		    //   return posts.getAll();
		    // }],
		    categoryPromise: ['categories', function(categories){
		      return categories.getAll();
		    }],
		    query: function(){return null;}
	  	}
    })
    .state('postsCreate', {
    	url: '/create',
    	templateUrl: 'public/views/post.create.html',
    	controller: 'CreatePostsCtrl',
    	resolve: {
		    categoryPromise: ['categories', function(categories){
		      return categories.getAll();
		    }]
	  	}
    })
    .state('posts', {
	  url: '/posts/:id/:slug',
	  templateUrl: 'public/views/post.html',
	  controller: 'PostsCtrl',
	  resolve: {
	    post: ['$stateParams', 'posts', function($stateParams, posts) {
	      return posts.get($stateParams.id, $stateParams.slug);
	    }]
	  }
		})
    .state('postsedit', {
	  url: '/posts/:id/:slug/edit',
	  templateUrl: 'public/views/post.create.html',
	  controller: 'UpdatePostsCtrl',
	  resolve: {
	    post: ['$stateParams', 'posts', function($stateParams, posts) {
	    	console.log($stateParams.id, $stateParams.slug);
	      return posts.get($stateParams.id);
	    }],
	    categoryPromise: ['categories', function(categories){
		      return categories.getAll();
		  }]
	  }
	})
  .state('categoriesCreate', {
	  url: '/createcategory',
	  templateUrl: 'public/views/category.create.html',
	  controller: 'CreateCategoriesCtrl',
	  resolve: {
	    categoryPromise: ['categories', function(categories){
	      return categories.getAll();
	    }]
  	}
	})
	.state('categories', {
		url: '/categories/{id}',
		templateUrl: 'public/views/categories.html',
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
	.state('categoriesBySlug', {
		url: '/categories/:slug',
		templateUrl: 'public/views/categories.html',
		controller: 'CategoriesCtrl',
		resolve: {
			category: ['$stateParams', 'categories', function($stateParams, categories){
				// return categories.getAll();
				return categories.getBySlug($stateParams.slug);
				// return "category";
			}],
			postsByCat: ['$stateParams', 'categories', function($stateParams, categories){
				// return categories.getAll();
				return categories.getPostsBySlug($stateParams.slug);
				// return "category";
			}]
		}
	})
	.state('starred', {
		url:'/users/:username/starred',
		templateUrl: 'public/views/home.html',
		controller: 'HomeCtrl',
		resolve: {
			query: function($stateParams) {
				return {stars: $stateParams.username}
			}
		}
	})
  	.state('login', {
	  url: '/login',
	  templateUrl: 'public/views/login.html',
	  controller: 'AuthCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	    if(auth.isLoggedIn()){
	      $state.go('home');
	    }
	  }]
	})
	.state('register', {
	  url: '/register',
	  templateUrl: 'public/views/register.html',
	  controller: 'AuthCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	    if(auth.isLoggedIn()){
	      $state.go('home');
	    }
	  }]
	});
  $urlRouterProvider.otherwise('home');
}]);
