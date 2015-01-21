chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(tab.id, {file: "jquery.2.1.3.min.js"});
    chrome.tabs.executeScript(tab.id, {file: "bookmarklet.js"});
});