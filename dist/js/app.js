var app = angular.module("BlocItOff", ["firebase", "ui.router", "angularMoment"]);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('home', {
    url: '/',
    controller: 'TaskCtrl.controller',
    templateUrl: '/templates/home.html'
  });
}]);

app.factory("taskList", ["$firebaseArray",
  function($firebaseArray){
    var ref = new Firebase("https://scorching-torch-4465.firebaseio.com/messages");
    return $firebaseArray(ref);
  }
]);

app.controller("TaskCtrl.controller", ["$scope", "taskList",
  function($scope, taskList){
    $scope.tasks = taskList;
    var now = +(new Date);
    $scope.addNewTask = function() {
      var item = {
        content: $scope.task,
        taskAddTime: now
      };

      $scope.tasks.$add(item);
      $scope.tasks.$save(item)
      $scope.task = "";
    };

  }]);

/*app.directive('hideOldTask', function(){
  return {
    restrict: 'E'
  }
})*/
