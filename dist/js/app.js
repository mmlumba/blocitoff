(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
var app = require('./app.js'); //not normal angular

app.filter('prioritySort', function(){
  function PriorityOrder(item){
    switch(item){
      case "high":
        return 1;
      case "medium":
        return 2;
      case "low":
        return 3;
    }
  }

  return function(items, field) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (PriorityOrder(a.priority) > PriorityOrder(b.priority) ? 1 : -1);
    });
    return filtered;
  };
})

},{"./app.js":1}],3:[function(require,module,exports){
var app = require('./app.js');

app.directive("taskComplete", ['taskListService', function(taskListService){
  return {
    link: function(scope, elem, attr){
      elem.on('click', function(){
        var task = scope.task;
        task.status = "completed";
        taskListService.updateTask(task);
        //scope.$apply();
      });
    }
  };
}]);

},{"./app.js":1}],4:[function(require,module,exports){
var app = require('./app.js');

app.factory("taskListService", ["$firebaseArray",
  function($firebaseArray){

    var taskList = [];
    var ref = new Firebase("https://scorching-torch-4465.firebaseio.com/messages");
    taskList = $firebaseArray(ref);

    var getTasks = function(){
      return taskList;
    }

    var add = function(taskName, taskPriority){

      var now = +(new Date);
      var item = {
        content: taskName,
        status: "active",
        taskAddTime: now,
        priority: taskPriority,
        isSelected: false
      };

      taskList.$add(item)
      /*.then(function(addedTask){
        if(addedTask){
          console.log("Added Task ", addedTask.key())
        }
      }, function(err){
        console.log(err);
      });*/
    };

    var update = function(task){
       taskList.$save(task)
        /*.then(function(updatedTask){
          console.log("Updated Task:", updatedTask.key());
        }, function(err){
          console.log("The hell", err);
        });*/
    };

    return {
      getTasks : getTasks,
      add : add,
      updateTask : update
    }
  }
]);

},{"./app.js":1}]},{},[1,2,3,4]);