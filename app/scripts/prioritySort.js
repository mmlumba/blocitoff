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
