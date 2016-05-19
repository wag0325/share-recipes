var app = angular.module('PostsCtrl', []);

app.controller('PostsCtrl', [
'$scope',
'posts',
'post',
'auth',
'$state',
function($scope, posts, post, auth, $state){
	$scope.isLoggedIn = auth.isLoggedIn();
	$scope.currentUser = auth.currentUser();
	$scope.post = post;
	console.log($scope.post);
	console.log($scope.post.author);
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
	$scope.editPost = function(post) {
		$state.go('postsedit', {id: post._id});
	};
	$scope.deletePost = function(post) {
		posts.delete(post._id, post.slug).error(function(error){
	      $scope.error = error;
	    }).then(function(){
	      $state.go('home');
	    });
	}
	$scope.incrementUpvotes = function(comment) {
	  posts.upvoteComment(post, comment);
	};
}]);
