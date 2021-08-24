
let index = 0;
let elemKeys = [];
let currentIndexes = [];
let matchCounts = [];
let myHighlights = [];
let defRejects = ['\\'];

chrome.runtime.onMessage.addListener((msg, sender, response) => {
    let GI = elemKeys.indexOf(msg.key);
    if(
        (msg.from === 'popup') && 
        (msg.subject === 'newDomInfo')
    ){

        // if the msg.key is a new one, in the case of creating
        // a new input in the popup, add the key to the elemKeys
        // array and the current index
        index = 0;
        if(GI === -1) {
            elemKeys.push(msg.key);
            GI = elemKeys.indexOf(msg.key);

            currentIndexes.push(index);
        }else{
            currentIndexes[GI] = index;
        }

        // make sure to clear all previous matches from this key
        clearHighlight(msg.key);

        // this if statement checks if the msg.data variable, or the variable that
        // will be passed as the regular expression to be searched, is valid or not
        if(msg.data !== '' && defRejects.indexOf(msg.data) === -1){
            
            // this variable just scopes the sameMatchID variable outside
            // of the callback to highlight()
            let multiNodeMatchId;

            // count stores the amount of matches in the page.
            // we are searching through the body node of the document 
            // the msg.data variable is instantiated as a RegExp object
            //      and is made both case insensitive ('i') and searched
            //      globally ('g') through a tested string. The g modifier
            //      is the more important of the two and should always be
            //      included.
            // the callback function returns the desired element to replace
            //      the matched text found in the page
            myHighlights[GI] = highlight(document.body, new RegExp(msg.data, 'ig'), function(match, sameMatchID){
                // store the sameMatchID outside of the scope of this function for later use
                multiNodeMatchId = sameMatchID;

                // create an inline element
                var highlightMe = document.createElement("highlight-me");

                // give it a unique class to be referenced with css or js later
                highlightMe.className = `chrome-regeggz-highlightMe highlight-me ${msg.key}`;
                if(index === 0){
                    highlightMe.className += ' current';
                }
                // style the element, in the future consider doing rounded borders
                // for multi node borders may have to use border-top-left-radius
                // or something similar
                highlightMe.style.backgroundColor = `rgb(${msg.color})`;
                highlightMe.style.color = `black`;

                // create a unique id for the element
                highlightMe.id = `${index}|${msg.color}|${msg.key}|${multiNodeMatchId}`;

                // if this is not the last node in the match, do not 
                // increase the index of the match
                index = multiNodeMatchId > -1 ? index : index + 1;

                // give the element text and return it
                highlightMe.textContent = match;
                return highlightMe;
            });

            window.location.assign(window.location.origin + window.location.pathname + `#0|${msg.color}|${msg.key}|-1`);

            // respond to the popup with the amount of matches
            response(myHighlights[GI].count);
        }else{
            response(0);
        }
    }

    if(
        (msg.from === 'popup') && 
        (msg.subject === 'changeCurrent') && 
        (GI !== -1)
    ){
        if(msg.data.indexOf('next') !== -1){

            currentIndexes[GI] = nextMatch(myHighlights[GI].elements, currentIndexes[GI], 1);
            window.location.assign(window.location.origin + window.location.pathname + `#${currentIndexes[GI]}|${msg.color}|${msg.key}|-1`);
            response(currentIndexes[GI]);

        }else if(msg.data.indexOf('prev') !== -1){

            currentIndexes[GI] = nextMatch(myHighlights[GI].elements, currentIndexes[GI], -1);
            window.location.assign(window.location.origin + window.location.pathname + `#${currentIndexes[GI]}|${msg.color}|${msg.key}|-1`);
            response(currentIndexes[GI]);
        }
    }
    if((msg.from === 'background') && (msg.subject === 'popupClosed')) {
        // clearHighlight(elemKeys);
    }
    
});

function nextMatch(elements, cIndex, direction){
    direction || (direction = 1);
    const regCurrent = /(^|\s)current(\s|$)/;
    const current = ' current';
    for(let i in elements[cIndex]){
        if(regCurrent.test(elements[cIndex][i].className)){
            elements[cIndex][i].className = elements[cIndex][i].className.replace(regCurrent, '');
        }
    }
    if(!elements[cIndex + direction]){
        if(direction > 0){
            cIndex = 0;
        } else {
            cIndex = elements.length - 1;
        }
    } else{
        cIndex += direction;
    }
    for(let i in elements[cIndex]){
        if(!regCurrent.test(elements[cIndex][i].className)){
            elements[cIndex][i].className += current;
        }
    }
    
    return cIndex;
}
