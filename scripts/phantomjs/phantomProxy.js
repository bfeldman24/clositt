var system = require('system');
var page = require('webpage').create();

page.settings.resourceTimeout = 3600000; // 1 hours
page.settings.loadImages = false;
page.settings.userName = 'clositt';
page.settings.password = 'rocksthehouse';

console.log("Starting PhantomProxy at " + new Date().toString());

page.onConsoleMessage = function(msg) {
  console.log(msg);
};

page.onError = function(msg, trace) {

  var msgStack = ['ERROR: ' + msg];

  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
    });
  }

  console.error(msgStack.join('\n'));
};

page.onResourceTimeout = function(e) {
  console.log("RESOURCE TIMED OUT:");
  console.log(e.errorCode);   // it'll probably be 408 
  console.log(e.errorString); // it'll probably be 'Network timeout on resource'
  console.log(e.url);         // the url whose request timed out

  console.log("PhantomProxy ended because of resource timeout at " + new Date().toString());
  phantom.exit(1);
};

page.onResourceError = function(resourceError) {
  console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
  console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);


};

var dev = "http://dev.closetta.com/design/";
var uat = "http://closetta.com/";
var url = system.args[1];

page.open(dev + url, function(status) {

    if(status !== 'success'){
        console.log("Failed to load page");
    }

 console.log("PhantomProxy Finished at " + new Date().toString());
 phantom.exit();
});
