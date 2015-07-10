var app = angular.module("BlocItOff", ["firebase", "ui.router"]);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  //$locationProvider.html5mode(true);

  $urlRouterProvider.otherwise('/');

  $stateProvider.state('home', {
    url: '/',
    controller: 'TaskCtrl.controller',
    templateUrl: '/templates/home.html'
  });
}]);

app.factory("taskList", ["$firebaseArray",
  function($firebaseArray){
    var taskID = Math.round(Math.random() * 100000000);
    var ref = new Firebase("https://scorching-torch-4465.firebaseio.com/" + taskID);
    return $firebaseArray(ref);
  }
]);

app.controller("TaskCtrl.controller", ["$scope", "taskList",
  function($scope, taskList){
    var counter = 0;
    $scope.user = "Task " + counter++;
    $scope.messages = taskList;
    $scope.addMessage = function() {
      $scope.messages.$add({
        content: $scope.message
      });
      $scope.message = "";
    };

    /*$scope.messages.$loaded(function() {
        if ($scope.messages.length === 0) {
          $scope.messages.$add({
            content: "First task!"
          });
        }
      });*/
  }]);
