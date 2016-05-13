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
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl',
      resolve: {
		    // postPromise: ['posts', function(posts){
		    //   return posts.getAll();
		    // }],
		    categoryPromise: ['categories', function(categories){
		      return categories.getAll();
		    }]
	  	}
    })
    .state('postsCreate', {
    	url: '/create',
    	templateUrl: 'views/post.create.html',
    	controller: 'CreatePostsCtrl',
    	resolve: {
		    categoryPromise: ['categories', function(categories){
		      return categories.getAll();
		    }]
	  	}
    })
    .state('posts', {
	  url: '/posts/:id/:slug',
	  templateUrl: 'views/post.html',
	  controller: 'PostsCtrl',
	  resolve: {
	    post: ['$stateParams', 'posts', function($stateParams, posts) {
	      return posts.get($stateParams.id, $stateParams.slug);
	    }]
	  }
		})
    .state('postsedit', {
	  url: '/posts/:id/:slug/edit',
	  templateUrl: 'views/post.create.html',
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
	  templateUrl: 'views/category.create.html',
	  controller: 'CreateCategoriesCtrl',
	  resolve: {
	    categoryPromise: ['categories', function(categories){
	      return categories.getAll();
	    }]
  	}
	})
	.state('categories', {
		url: '/categories/{id}',
		templateUrl: 'views/categories.html',
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
		templateUrl: 'views/categories.html',
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
  .state('login', {
	  url: '/login',
	  templateUrl: 'views/login.html',
	  controller: 'AuthCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	    if(auth.isLoggedIn()){
	      $state.go('home');
	    }
	  }]
	})
	.state('register', {
	  url: '/register',
	  templateUrl: 'views/register.html',
	  controller: 'AuthCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	    if(auth.isLoggedIn()){
	      $state.go('home');
	    }
	  }]
	});
  $urlRouterProvider.otherwise('home');
}]);
