var app = angular.module('AuthCtrl', []);

app.controller('AuthCtrl', [
'$scope', 
'$state', 
'auth', 
'$stateParams',
function($scope, $state, auth, $stateParams){
 $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.forgot = function() {
    auth.forgot($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(msg){
      $scope.msg = msg.data;
    });
  };

  $scope.reset = function() {
    var token = $stateParams.token;
    console.log("token", token);
    auth.reset(token, $scope.user).error(function(error){
      $scope.error = error;
    }).then(function(msg){
      $scope.msg = msg.data;
      $state.go('home');
    });
  };
}]);