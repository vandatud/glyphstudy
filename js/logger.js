var dependencies = []; // list of JS file/Module names to be loaded 1st

define(dependencies, function() {
  // Publish a `log()` utility function
  var logger = {
    log: function(message) {
      console.log(message);
    },
    debug: function(message) {
      console.debug(message);
    }
  };

  return logger;
});
