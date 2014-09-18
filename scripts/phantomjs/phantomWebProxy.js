var system = require('system');
var page = require('webpage').create();

page.settings.loadImages = false;
page.settings.userName = 'clositt';
page.settings.password = 'rocksthehouse';

var url = system.args[1];

page.open(url, function(status) {
    if ('success' !== status) {
        console.log("Error");
    } else {
        console.log(page.content);
        phantom.exit();
    }
});

