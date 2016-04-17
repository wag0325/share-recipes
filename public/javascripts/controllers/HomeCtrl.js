var app = angular.module('HomeCtrl', []);

app.controller('HomeCtrl', [
'$scope', 'posts', 'auth', '$state', 'categories',
function($scope, posts, auth, $state, categories){
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.posts = posts.posts;
	$scope.categories = categories.categories;
	$scope.catChecked = true;
	$scope.titleLimit = 15;
	$scope.allCats = [];
	$scope.allTags = [];
	$scope.selectedTags = [];
	$scope.orderOptions = [
		{name: 'Most Liked', value: '-upvotes'},
		{name: 'Newest', value: 'created_at'},
	];
	// Tags from posts
	for (var i = 0; i < $scope.posts.length; i++) {
		for (var j = 0; j < $scope.posts[i].tags.length; j++){
			if ($scope.allTags.indexOf($scope.posts[i].tags[j]) == -1) {
    		$scope.allTags.push($scope.posts[i].tags[j]);
			}
		}
	}
	// Categories in an array
	for (var i =0; i <$scope.categories.length; i++){
		if ($scope.allCats.indexOf($scope.categories[i].title == -1)) {
			$scope.allCats.push($scope.categories[i].title);
		}
	}
	console.log($scope.allCats);
	$scope.selectedCat = $scope.allCats;
	$scope.addRemoveCat = function(checked, cat){
		console.log(checked, cat);
		var catIndex = $scope.selectedCat.indexOf(cat);
		if (checked && catIndex != -1){
			$scope.selectedCat.splice(catIndex);
		} else {
			$scope.selectedCat.push(catIndex);
		}
		console.log($scope.selectedCat);
	}
	console.log($scope.allTags);
	// Initial - all selected tags
	// $scope.selectedTags = $scope.allTags;
	// $scope.selectedTags.push('default');
	// $scope.tagChecked = true;
	// Selected Tags
	$scope.addRemoveTag = function(checked, tag){
		console.log(checked, tag);
		// var defaultIndex = $scope.selectedTags.indexOf('default');
		var tagIndex = $scope.selectedTags.indexOf(tag);
		// if(defaultIndex != -1) {
		// 	$scope.selectedTags.splice(defaultIndex);
		// }
		if(checked && tagIndex == -1) {
			$scope.selectedTags.push(tag);
		}
		else {
			$scope.selectedTags.splice(tagIndex);
		}
		console.log($scope.selectedTags);
	}

	// noDuplicatesArr($scope.SelectedctedTags);
	// $scope.editPost = function(id) {
	// 	console.log("editPost", id);
	// 	$state.go('postsedit', {id: id});
	// };

	$scope.deletePost = function(id) {
		console.log("deletePost", id);
		posts.delete(id).error(function(error){
      $scope.error = error;
    }).then(function(){
      posts.getAll();
    });
	}
	$scope.incrementUpvotes = function(post) {
	  posts.upvote(post);
	};
}]);