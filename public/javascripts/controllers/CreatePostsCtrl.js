var app = angular.module('CreatePostsCtrl', []);

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
