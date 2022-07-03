var TIME_INTERVAL = 5; // in seconds
var  AUTOMATE = false;
var current_interval = 0;
var HIGHLIGHT_COLOR = "rgba(171, 245, 190, 0.5)"
let colors = {};
let shapes = {
    "#diamond":1,
    "#oval":2,
    "#squiggle":3
};
let masks = {
    "solid": 1,
    "striped": 2,
    "transparent": 3
};



function loadCards() {
    var res = [];
    const main_div = $("div.MuiPaper-root.MuiPaper-elevation1.MuiPaper-rounded")[1]
    var child_divs = main_div.children
    Array.from(child_divs).forEach((element) => {
        // console.log(element.tagName)
        if (element.tagName=="DIV"){
            res.push(element)
        }
    });
    // return a list of all of the card element divs
    return res;
}

function findActiveState(elems){
    // returns the index of the card div elements that are actively in play
    let res = [];
    elems.forEach((element, index) => {
        if (element.style.opacity==1){
            res.push(index)
        }
    });
    return res;
}

function findSet(active_state){
    /*
        Input: {Card list: index in card elements}
        e.g.
        1,#008002,#diamond,solid: 45 
        1,#800080,#oval,solid: 9
        1,#ff0101,#diamond,striped: 78
        2,#008002,#diamond,solid: 46
        2,#800080,#oval,solid: 10
        2,#800080,#oval,transparent: 13
        3,#008002,#diamond,solid: 47
        3,#008002,#oval,striped: 44
        3,#008002,#squiggle,striped: 35
        3,#800080,#squiggle,solid: 2
        3,#ff0101,#oval,solid: 65
        3,#ff0101,#oval,transparent: 68
    */

   for (let card1 of Object.keys(active_state)){
    for (let card2 of Object.keys(active_state)){
        
        if(card1!=card2){

            // number of items
            let num_of_items = 0;
            if (card1[0]==card2[0]){
                num_of_items = parseInt(card1[0]);
            } else{
                num_of_items = 6-parseInt(card1[0])-parseInt(card2[0]);
            }
            
            // color
            let color = 0;
            if (card1[2]==card2[2]){
                color = parseInt(card1[2]);
            } else{
                color = 6-parseInt(card1[2])-parseInt(card2[2]);
            }

            // shape
            let shape = 0;
            if (card1[4]==card2[4]){
                shape = parseInt(card1[4]);
            } else{
                shape = 6-parseInt(card1[4])-parseInt(card2[4]);
            }

            // mask
            let mask = 0;
            if (card1[6]==card2[6]){
                mask = parseInt(card1[6]);
            } else{
                mask = 6-parseInt(card1[6])-parseInt(card2[6]);
            }

            // if there is a set, this list should this list in the set
            let res = [num_of_items, color, shape, mask]
            // console.log(res)

            if (res in active_state){
                return [active_state[card1], active_state[card2], active_state[res]]
            }
        }
    }

   }
    // console.log(active_state)
    return [];
}

function makeCard(elem){
    let svgs = elem.children[0].children
    number = svgs.length
    let use1 = svgs[0].children[0];
    let use2 = svgs[0].children[1];
    let shape = use1.getAttribute('href')
    let color = use2.getAttribute('stroke')
    let mask = "";
    if (use1.getAttribute('mask')=="url(#mask-stripe)"){
        mask = "striped"
    } else if (use1.getAttribute('fill')=="transparent"){
        mask = "transparent"
    } else{
        mask = "solid"
    }
    if (!(color in colors)){ 
        colors[color] = Object.keys(colors).length + 1
    }
  
    return [number, colors[color], shapes[shape], masks[mask]];
}

function main() {

    var card_div_elements = loadCards();
    var cards = card_div_elements.map(elem => makeCard(elem));
    // console.log(cards)
    clearInterval(current_interval)
    current_interval = setInterval(function() {
        let active_state_index = findActiveState(card_div_elements);
        // console.log(active_state_index)
        let active_state = {}

        for(let index of active_state_index){
            active_state[cards[index]] = index
        }
        // console.log(active_state)
        let set = findSet(active_state);
        // console.log(set);
        if (AUTOMATE){
            set.forEach((element)=>{
                card_div_elements[element].children[0].click();
            });
        } else{
            set.forEach((element)=>{
                card_div_elements[element].children[0].style.borderRadius="25px"
                card_div_elements[element].children[0].style.background=HIGHLIGHT_COLOR
            });


        }
        // console.log(AUTOMATE, TIME_INTERVAL, current_interval)
        
      }, TIME_INTERVAL*1000);
}

// wait for webpage to load
document.addEventListener('DOMContentLoaded', function (){
    console.log("loaded")
    main()
})


// message listeners
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request) {
        if (request.msg == "automate") {
            AUTOMATE = !AUTOMATE
            main()
            sendResponse({ sender: "bot.js", data: AUTOMATE }); // This response is sent to the message's sender 
        }
        
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request) {
        if (request.msg == "speed") {
            TIME_INTERVAL = request.data;
            main()
            sendResponse({ sender: "bot.js", data: AUTOMATE }); // This response is sent to the message's sender 
        }

    }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request) {
        if (request.msg == "initial") {
            sendResponse({ sender: "bot.js", data: {auto:AUTOMATE, time:TIME_INTERVAL} }); // This response is sent to the message's sender 
        }
    }
});

