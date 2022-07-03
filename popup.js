

var  AUTOMATE = null;

// send message to content script
// Depending on who the recipient is, it does this using one of two ways. 
// If the recipient is a content script, chrome.tabs.sendMessage() is used. 
// Otherwise, it’s chrome.runtime.sendMessage().
//T he intended recipient of this message is a content script. 
// However, any background script listening for onMessage events will receive the message.
// This is another reason why it’s useful to have a property such as msg in the passed object. 
// It acts as an identifier so that recipients can determine whether a message is intended for them.

/*
SLIDER
*/

document.addEventListener('DOMContentLoaded', function (){
 
  // speed slider info
  var slider = document.getElementById("speedSlider");
  var sliderText = document.getElementById("sliderText");
  
  // automate button info
  var button = document.getElementById("automateButton");
  // var automateText = document.getElementById("automateText");

   // display initial info
   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // send the inverse automate
    chrome.tabs.sendMessage(tabs[0].id, {msg: "initial", data:null}, (response) => {
        if (response) {
            // set the new automate value
            AUTOMATE = response.data.auto;
            button.value = AUTOMATE ? "YES" : "NO"
            slider.value = response.data.time;
            sliderText.innerHTML = slider.value;
        }
    });
  
  });

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function() {
    updateSpeedState(this);
  }

  button.onclick = function(){
    updateAutomateState();
    button.value = AUTOMATE ? "YES" : "NO"
  }

})


function updateSpeedState(element){
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // send the inverse automate
    chrome.tabs.sendMessage(tabs[0].id, { msg: "speed", data: parseInt(element.value) }, (response) => {
        if (response) {
            // set the new automate value
            sliderText.innerHTML = element.value;
        }
    });
  
  });
}

function updateAutomateState() {
  /*
  Invert the automate state
  */

  // Send a message to the content script to invert its automate state
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // send the inverse automate
    chrome.tabs.sendMessage(tabs[0].id, { msg: "automate", data: !AUTOMATE }, (response) => {
        if (response) {
            // set the new automate value
            AUTOMATE = response.data;
        }
    });
  
  });
}

function getInitialValues(){

}

getInitialValues();
