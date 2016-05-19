// To combine create and update posts ctrl, 
//I need to call post.get() inside the controller
var app = angular.module('UpdatePostsCtrl', []);

app.controller('UpdatePostsCtrl', [
'$scope',
'posts',
'post',
'auth',
'$state',
'categories',
function($scope, posts, post, auth, $state, categories){
	$scope.currentUser = auth.currentUser();
	if (post.author == $scope.currentUser) {
		$scope.isLoggedIn = auth.isLoggedIn();
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
		posts.update($scope.post._id, $scope.post.slug, {
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
      $state.go('posts', {id: $scope.post._id, slug: $scope.post.slug});
    });
	};
	$scope.reset = function() {
		$scope.post = postDefault;
	};
	$scope.back = function() {
		$state.go('home');
	}
}]);