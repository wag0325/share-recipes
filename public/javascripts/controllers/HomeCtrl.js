var app = angular.module('HomeCtrl', []);

app.controller('HomeCtrl', [
'$scope', 'posts', 'auth', '$state', 'categories',
function($scope, posts, auth, $state, categories){
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;

	// $scope.posts = posts.posts;
	$scope.categories = categories.categories;
	$scope.limit = 20;
	$scope.filters = {};

	$scope.busy = true;
	$scope.noMoreData = false;

	$scope.catChecked = true;
	$scope.titleLimit = 15;
	$scope.allCats = [];
	$scope.allTags = [];
	$scope.selectedTags = [];
	$scope.orderOptions = [
		{name: 'Most Liked', value: '-upvotes'},
		{name: 'Newest', value: 'created_at'},
	];

	var query = {
		"limit": $scope.limit
	};
	// Retreive posts
	var getPosts = function(){
		console.log("GetPosts");
		posts.getAll(
		// {"limit": $scope.limit}
		query
		).then(function(data){
			console.log(data);
			$scope.posts = data.data;

			if ($scope.posts.length < 2) {
				$scope.noMoreData = true;
			}
			$scope.busy = false;
			// Tags from posts
			for (var i = 0; i < $scope.posts.length; i++) {
				for (var j = 0; j < $scope.posts[i].tags.length; j++){
					if ($scope.allTags.indexOf($scope.posts[i].tags[j]) == -1) {
		    		$scope.allTags.push($scope.posts[i].tags[j]);
					}
				}
			}
		});
	};
	getPosts();
	$scope.nextPage = function() {
		if($scope.busy){
			return;
		}
		$scope.busy = true;
		var lastId = $scope.posts[$scope.posts.length-1]._id;

		// var pageQuery = angular.merge(query, {_id: {$lt: lastId}});
		// var pageQuery = {"_id": {$lt: lastId}};

		// add new properties to $scope.query
		query["lastId"] = lastId;
		console.log("query", query);
		posts.getAll(
		// {"lastId": pageQuery}
			query
		).then(function(data){
			console.log(data);
			console.log("concat");
			$scope.posts = $scope.posts.concat(data.data);
			console.log("posts", $scope.posts);
			$scope.busy = false;
			if(data.data.length === 0){
				$scope.noMoreData = true;
			}
		});
	};
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

	// Execute functions when scope is loaded.
	getPosts();
}]);