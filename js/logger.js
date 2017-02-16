var dependencies = []; // list of JS file/Module names to be loaded 1st

define(dependencies, function() {
  var eventColumns = [
    "Id",
    "Participant",
    "Block",
    "Condition",
    "Task",
    "Time",
    "Accuracy",
    "Target",
    "SelectedItem"
  ];
  var eventLog = [];
  var eventId = 1;
  // Publish a `log()` utility function
  var logger = {
    log: function(message) {
      console.log(message);
    },
    debug: function(message) {
      console.debug(message);
    },
    event: function(participant, block, condition, task, time, accuracy, target, selectedItem) {
      // write csv header
      if (eventId == 1) {
        var header = eventColumns.join(";");
        eventLog.push(header);
      }
      var message = eventId +
        ";" +
        participant +
        ";" +
        block +
        ";" +
        condition +
        ";" +
        task +
        ";" +
        time +
        ";" +
        accuracy +
        ";" +
        target +
        ";" +
        selectedItem;
      eventLog.push(message);
      console.debug(message);
      eventId++;
    },
    getEventLog: function() {
      return eventLog;
    }
  };

  return logger;
});
