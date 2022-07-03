var AUTOMATE = false;
var TOGGLE = false;
var MIN_MANUAL_VAL = 1.5;

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
  var automateText = document.getElementById("automateText");

  // toggle on off button info
  var togglebutton = document.getElementById("toggleButton");
  var toggleText = document.getElementById("toggleText");

   // display initial info
   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // send the inverse automate
    chrome.tabs.sendMessage(tabs[0].id, {msg: "initial", data:null}, (response) => {
        if (response) {
            // set the new automate value
            AUTOMATE = response.data.auto;
            automateText.innerHTML = AUTOMATE ? "Automatic" : "Manual"
            slider.value = response.data.time;
            sliderText.innerHTML = slider.value;
            TOGGLE = response.data.toggle;
            toggleText.innerHTML = TOGGLE ? "On" : "Off";
            if (!TOGGLE){
              slider.disabled = true;
              button.disabled = true;
            }
        }
    });
  
  });

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function() {
    updateSpeedState(this);
  }

  button.onclick = function(){
    updateAutomateState(slider);
  }

  togglebutton.onclick = function(){
    toggleBot(slider, button);
  }


})

function toggleBot(slider, button){
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // send the inverse automate
    chrome.tabs.sendMessage(tabs[0].id, { msg: "toggle", data: !TOGGLE }, (response) => {
        if (response) {
            // set the new automate value
            TOGGLE = response.data;
            toggleText.innerHTML = TOGGLE ? "On" : "Off";
            if (TOGGLE){
              slider.disabled = false;
              button.disabled = false;
            } else{
              slider.disabled = true;
              button.disabled = true;
            }
        }
    });
  
  });

}
function updateSpeedState(element){
  if(TOGGLE){
    if (!AUTOMATE){
      if (element.value<MIN_MANUAL_VAL){
        element.value=MIN_MANUAL_VAL
        sliderText.innerHTML=MIN_MANUAL_VAL
      }
    }
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // send the inverse automate
      chrome.tabs.sendMessage(tabs[0].id, { msg: "speed", data: Number(element.value) }, (response) => {
          if (response) {
              sliderText.innerHTML = element.value;
          }
      });
    
    });
  }

}

function updateAutomateState(slider) {
  /*
  Invert the automate state
  */
  if (TOGGLE){
  // Send a message to the content script to invert its automate state
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // send the inverse automate
    chrome.tabs.sendMessage(tabs[0].id, { msg: "automate", data: !AUTOMATE }, (response) => {
        if (response) {
            // set the new automate value
            AUTOMATE = response.data;
            automateText.innerHTML = AUTOMATE ? "Automatic" : "Manual"
            if (!AUTOMATE){
              if (slider.value<MIN_MANUAL_VAL){
                slider.value=MIN_MANUAL_VAL
                sliderText.innerHTML=MIN_MANUAL_VAL
              }
            }
        }
    });
  
  });
  }

}
