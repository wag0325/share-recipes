var app = angular.module('PostsCtrl', []);

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
