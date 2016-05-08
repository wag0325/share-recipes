var app = angular.module('CreateCategoriesCtrl', []);

app.controller('CreateCategoriesCtrl', [
'$scope',
'auth',
'categories',
function($scope, auth, categories) {
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.categories = categories.categories;

	$scope.addCategory = function(){
		// var postNumber = $scope.posts.length;
		// console.log(postNumber);
		if(!$scope.title || $scope.title === '') { return; }
		//added author to posts.create
		categories.create({
	    title: $scope.title,
	    slug: $scope.slug,
	    desc: $scope.desc
	  })
	  // posts.addComment(posts._id, {
	  //   body: $scope.body,
	  //   author: 'user'
	  // }).success(function(comment){
	  // 	$scope.post.comments.push(comment);
	  // });
		$scope.title = '';
	};
}]);