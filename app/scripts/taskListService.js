var app = require('./app.js');

app.factory("taskListService", ["$firebaseArray",
  function($firebaseArray){

    var taskList = [];

    var getTasks = function(){
      var ref = new Firebase("https://scorching-torch-4465.firebaseio.com/messages");
      taskList = $firebaseArray(ref);
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
