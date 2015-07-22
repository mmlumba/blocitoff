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

},{}],2:[function(require,module,exports){
var app = require('./app.js');

app.factory("taskListService", ["$firebaseArray",
  function($firebaseArray){

    var taskList = [];

    var getTasks = function(){
      var ref = new Firebase("https://scorching-torch-4465.firebaseio.com/messages");
      taskList = $firebaseArray(ref);
      return taskList;
    }

    var add = function(taskName){

      var now = +(new Date);
      var item = {
        content: taskName,
        taskAddTime: now,
        isSelected: false 
      };

      taskList.$add(item).then(function(addedTask){
        if(addedTask){
          console.log("Added Task ", addedTask.key())
        }
      }, function(err){
        console.log(err);
      });
    };

    var update = function(task){
       taskList.$save(task)
        .then(function(updatedTask){
          console.log("Updated Task:", updatedTask.key());
        }, function(err){
          console.log("The hell", err);
        });
    };

    return {
      getTasks : getTasks,
      add : add,
      updateTask : update
    }
  }
]);
},{"./app.js":1}]},{},[1,2]);