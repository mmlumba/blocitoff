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
    var ellapsedMilliseconds = 7000; //TODO: could be converted to a constant

    $scope.tasks = taskListService.getTasks();

    $interval(function(){
      $scope.timeStamp = +(new Date);
    }, 100);

    $scope.taskFilter = function(task){
      return task.isSelected || task.taskCompleted;     
    }

    $scope.addNewTask = function() {
      taskListService.add($scope.task);
      $scope.task = "";
    };

    $scope.hideTask = function(task) {

      if(task.taskCompleted)
        return true; //If task has already been marked completed just return true

      //TODO: possible refactor here...
      if (($scope.timeStamp - task.taskAddTime) >= ellapsedMilliseconds) { //If time has ellapsed by x milliseconds do this
        task.taskCompleted = true;     
        taskListService.updateTask(task); //update the task completed flag       
        return task.taskCompleted;
      }
      else if (task.isSelected){
        return true;
      }
      else {
        return false;
      }
    }

    $scope.checkMe = function(task){
      task.isSelected = !task.isSelected;  //inverts the boolean, by default all new task will be marked false
      taskListService.updateTask(task);
    }

  }]);
module.exports =app;
