var app = angular.module("BlocItOff", ["firebase", "ui.router", "angularMoment"]);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('home', {
    url: '/',
    controller: 'TaskCtrl.controller',
    templateUrl: '/templates/home.html'
  });
  $stateProvider.state('pastTasks', {
    url: '/pastTasks',
    controller: 'TaskCtrl.controller',
    templateUrl: '/templates/pastTasks.html'
  });

  moment.locale('en', {
    relativeTime : {
        future: "in %s",
        past:   "%s ago",
        s:  "%d seconds",
        m:  "a minute",
        mm: "%d minutes",
        h:  "an hour",
        hh: "%d hours",
        d:  "a day",
        dd: "%d days",
        M:  "a month",
        MM: "%d months",
        y:  "a year",
        yy: "%d years"
    }
  });
}]);

app.factory("taskList", ["$firebaseArray",
  function($firebaseArray){
    var ref = new Firebase("https://scorching-torch-4465.firebaseio.com/messages");
    return $firebaseArray(ref);
  }
]);

app.controller("TaskCtrl.controller", ["$scope", "taskList", "$interval",
  function($scope, taskList, $interval){
    $scope.tasks = taskList;

    $interval(function(){
      $scope.timeStamp = +(new Date);
    }, 100);

    $scope.addNewTask = function() {

      var now = +(new Date);
      var item = {
        content: $scope.task,
        taskAddTime: now,
        taskSelect: -1
      };

      $scope.tasks.$add(item);
      $scope.tasks.$save(item);
      console.log(item.taskSelect);
      $scope.task = "";
    };

    $scope.hideTask = function(task) {

      if (($scope.timeStamp - task.taskAddTime) >= 420000) {
        return true;
        task.taskSelect = 0;
      }
      else if (task.isSelected){
        return true;
        task.taskSelect = 0;
      }
      else {
        return false;
      }
    }

    $scope.checkMe = function(task){
      task.isSelected = true;
      task.taskSelect = 0;
      console.log(task.taskSelect);
    }

  }]);
