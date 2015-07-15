var app = angular.module("BlocItOff", ["firebase", "ui.router", "angularMoment"]);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('home', {
    url: '/',
    controller: 'TaskCtrl.controller',
    templateUrl: '/templates/home.html'
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

app.controller("TaskCtrl.controller", ["$scope", "taskList",
  function($scope, taskList){
    $scope.tasks = taskList;
    //var now = +(new Date);
    var timeStamp = moment(new Date).add(moment.duration(7000));
    console.log(timeStamp.toDate());

    $scope.addNewTask = function() {

      var now = +(new Date);
      var item = {
        content: $scope.task,
        taskAddTime: now
      };

      $scope.tasks.$add(item);
      $scope.tasks.$save(item)
      $scope.task = "";
    };

    $scope.hideSomeTask = function(time) {
      if ((new Date() - time) >= 7000){
        return true;
      }
      else {
        return false;
      }
    }

  }]);
