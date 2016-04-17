var app = angular.module('CategoriesCtrl', []);
app.controller('CategoriesCtrl', [
'$scope',
'categories',
'category',
'postsByCat',
'auth',
function($scope, categories, category, postsByCat, auth){
	// console.log(posts);
	// $scope.posts = posts;
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.category = category;
	// console.log("category", $scope.category);
	$scope.posts = postsByCat;
	console.log($scope.posts);
}]);