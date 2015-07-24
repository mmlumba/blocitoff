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

app.controller("TaskCtrl.controller", ["$scope", "taskListService", "$interval",
  function($scope, taskListService, $interval){
    var ellapsedMilliseconds = 604800000; //TODO: could be converted to a constant

    var status = ["completed", "expired", "active"];

    $scope.priority = "medium";

    $scope.tasks = taskListService.getTasks();

    $interval(function(){
      $scope.timeStamp = +(new Date);
    }, 100);

    //Note: could change the name

    $scope.taskFilter = function(task){
      //console.log(task);
      return (task.status == "completed" || task.status == "expired");
    }

    $scope.addNewTask = function() {
      taskListService.add($scope.task, $scope.priority);
      $scope.task = "";
    };

    $scope.hideTask = function(task) {

      if($scope.taskFilter(task))
        return true; //If task has already been marked completed just return true

      //TODO: possible refactor here...
      if (($scope.timeStamp - task.taskAddTime) >= ellapsedMilliseconds) { //If time has ellapsed by x milliseconds do this
        task.status = "expired";
      //  task.taskCompleted = true;
        taskListService.updateTask(task); //update the task completed flag
        return true;
      }
      else {
        return false;
      }
    }

    $scope.checkMe = function(task){
      task.status = "completed";
    //  task.isSelected = !task.isSelected;  //inverts the boolean, by default all new task will be marked false
      taskListService.updateTask(task);
    }

  }]);
module.exports =app;
