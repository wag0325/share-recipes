var app = angular.module('shareRecipes', [
	'ui.router',
	'infinite-scroll',
	'ngTagsInput',
	'textAngular',
	'HomeCtrl',
	'PostsCtrl',
	'CreatePostsCtrl',
	'UpdatePostsCtrl',
	'CategoriesCtrl',
	'CreateCategoriesCtrl',
	'QuestionsIndexCtrl',
	'QuestionsCreateCtrl',
	'QuestionsShowCtrl',
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
	.state('questionsIndex', {
		url:'/forum',
		templateUrl: 'public/views/questionsIndex.html',
		controller: 'QuestionsIndexCtrl'
	})
	.state('questionsCreate', {
		url:'/forum/ask',
		templateUrl: 'public/views/questionsCreate.html',
		controller: 'QuestionsCreateCtrl'
	})
	.state('questionsShow', {
		url:'/forum/topic/:id/:slug',
		templateUrl: 'public/views/questionsShow.html',
		controller: 'QuestionsShowCtrl',
		resolve: {
		    question: ['$stateParams', 'questions', function($stateParams, questions) {
		      return questions.get($stateParams.id, $stateParams.slug);
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
	})
	.state('forgot', {
	  url: '/forgot',
	  templateUrl: 'public/views/forgot.html',
	  controller: 'AuthCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	    if(auth.isLoggedIn()){
	      $state.go('home');
	    }
	  }]
	})
	.state('reset', {
	  url: '/reset/:token',
	  templateUrl: 'public/views/reset.html',
	  controller: 'AuthCtrl',
	 //  resolve: {
	 //    token: ['$stateParams', function($stateParams) {
	 //      return posts.get($stateParams.id);
	 //    }]
		// },
	  onEnter: ['$state', 'auth', function($state, auth){
	    if(auth.isLoggedIn()){
	      $state.go('home');
	    }
	  }]
	});
  $urlRouterProvider.otherwise('home');
}]);
