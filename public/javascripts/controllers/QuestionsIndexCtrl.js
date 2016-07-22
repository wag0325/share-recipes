var app = angular.module('QuestionsIndexCtrl', []);

app.controller('QuestionsIndexCtrl', [
'$scope',
'questions',
function($scope, questions){
	var filters = {};
	// Retreive posts
	var getQuestions = function(){
		$scope.questions = [];
		questions.getAll()
		.then(function(data){
			console.log(data);
			$scope.questions = data.data;

			if ($scope.questions.length < 2) {
				$scope.noMoreData = true;
			}
			$scope.busy = false;
			// retreiveTags($scope.questions); 
		});
		console.log("questions", $scope.questions);
	};
	getQuestions();
	$scope.nextPage = function() {
		console.log("nextPage");
		if($scope.busy){
			return;
		}
		$scope.busy = true;
		console.log("questions in nextpg", $scope.questions);
		var lastQuestion = $scope.questions[$scope.questions.length-1];
		var lastId = lastQuestion._id;
		console.log("lastqid", lastId);
		// add new properties to $scope.query
		filters["lastValue"] = {_id: lastId}; 
		// if ($scope.orderProp.value["_id"]) {
		// 	console.log("newest", $scope.orderProp.value["_id"]);
		// 	filters["lastValue"] = {_id: lastId}; 
		// }else if ($scope.orderProp.value["starsCount"]){
		// 	var lastStarsCount = lastPost.starsCount;
		// 	// filters["lastStarsCount"] = lastStarsCount;
		// 	filters["lastValue"] = {starsCount: lastStarsCount};
		// } else if ($scope.orderProp.value["upvotes"]){
		// 	var lastUpvote = lastPost.upvotes;
		// 	// filters["lastUpvote"] = lastUpvote;
		// 	filters["lastValue"] = {upvotes: lastUpvote};
		// } else if ($scope.orderProp.value["viewCounts"]) {
		// 	var lastViewCounts = lastPost.viewCounts;
		// 	filters["lastValue"] = {viewCounts: lastViewCounts};
		// }
		// var pageQuery = angular.merge(query, {_id: {$lt: lastId}});
		// var pageQuery = {"_id": {$lt: lastId}};

		
		
		questions.getAll(
			filters)
		.then(function(data){
			console.log(data);
			console.log("concat");
			$scope.questions = $scope.questions.concat(data.data);
			console.log("questions", $scope.questions);
			$scope.busy = false;
			if(data.data.length === 0){
				$scope.noMoreData = true;
			}
		});
	};
}]);
