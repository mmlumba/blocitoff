var app = require('./app.js');

app.directive("taskComplete", ['taskListService', function(taskListService){
  return {
    templateUrl: '/templates/checkBox.html',
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
