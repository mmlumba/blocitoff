var app = require('./app.js');

app.directive("taskComplete", ['taskListService', function(taskListService){
  return {
    template: '<a class="check"><i class="fa fa-square fa-lg"></i></a>',
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
