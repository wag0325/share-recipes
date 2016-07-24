var app = angular.module('QuestionsShowCtrl', []);

app.controller('QuestionsShowCtrl', [
'$scope',
'$state',
'questions',
'question',
'auth',
function($scope, $state, questions, question, auth){
	$scope.isLoggedIn = auth.isLoggedIn();
	$scope.currentUser = auth.currentUser();

	$scope.question = question;
	$scope.submitAnswer = function(){
	  // if($scope.content === '') { return; }
	  questions.addAnswer(question._id, {
	    content: $scope.newAnswer.content,
	    // author: 'user'
	  }).success(function(answer){
	  	$scope.question.answers.push(answer);
	  });
	  // $scope.body = '';
	};
	
	$scope.submitReply = function(answer){
	  // if($scope.content === '') { return; }
	  console.log("newReply", answer.reply);
	  questions.addReply(question._id, answer._id, {
	    content: answer.reply,
	    // author: 'user'
	  }).success(function(reply){
	  	// $scope.question.answers.push(answer);
	  	console.log("reply", reply);
	  });
	  // $scope.body = '';
	};

	// $scope.addComment = function(){
	//   if($scope.body === '') { return; }
	//   posts.addComment(post._id, {
	//     body: $scope.body,
	//     author: 'user'
	//   }).success(function(comment){
	//   	$scope.post.comments.push(comment);
	//   });
	//   $scope.body = '';
	// };
	// $scope.editPost = function(post) {
	// 	$state.go('postsedit', {id: post._id});
	// };
	// $scope.deletePost = function(post) {
	// 	posts.delete(post._id, post.slug).error(function(error){
	//       $scope.error = error;
	//     }).then(function(){
	//       $state.go('home');
	//     });
	// }
	// $scope.incrementUpvotes = function(comment) {
	//   posts.upvoteComment(post, comment);
	// };
}]);
