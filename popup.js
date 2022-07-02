
var auto = true;
function myFunction() {
    auto = !auto
    s()
  }
function s(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello", val:auto }, function(response) {
          console.log(response.farewell);
        });
      });
}
