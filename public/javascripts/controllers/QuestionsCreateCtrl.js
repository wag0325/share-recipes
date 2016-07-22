var app = angular.module('QuestionsCreateCtrl', []);

app.controller('QuestionsCreateCtrl', [
'$scope',
'$state',
'questions',
'auth',
function($scope, $state, questions, auth){
	$scope.isLoggedIn = auth.isLoggedIn();
	$scope.currentUser = auth.currentUser();

	var questionDefault = {};
	$scope.submit = function(){
		// var postNumber = $scope.posts.length;
		// console.log("add");
		if(!$scope.question.title || $scope.question.title === '') { return; }
		//added author to posts.create
		questions.create({
	    title: $scope.question.title,
	    content: $scope.question.content,
	    tags: $scope.question.tags
	  }).error(function(error){
      $scope.error = error;
    }).then(function(){
    	// should goto the post
    	$state.go('questionsIndex');
    });
    // Remove posts 
    // Update existing posts
    // Find a list of a posts
		$scope.title = '';
	};
	$scope.reset = function() {
		$scope.question = questionDefault;
	};
	$scope.back = function() {
		$state.go('home');
	}
}]);
