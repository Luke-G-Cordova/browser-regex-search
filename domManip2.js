


let nodes = getAllNodes();

// window.getComputedStyle(parent, null).display === 'block' &&
const root = document.querySelector('body');
const left = /&lt;font class="highlight-me"&gt;/g;
const right = /&lt;[/]font&gt;/g;


let searchText = new RegExp('the in', 'i');
for(node in nodes){
    
    if(window.getComputedStyle(nodes[node], null).display === 'block'){
        console.log(nodes[node].innerHTML);

        var newNode = document.createTextNode(createNewInnerText(nodes[node].innerText, searchText));
        nodes[node].parentNode.replaceChild(newNode, nodes[node]);
        console.log(newNode);

        var newHtml = root.innerHTML;
        newHtml = newHtml.replace(left, `<font class="highlight-me">`); 
        newHtml = newHtml.replace(right, '</font>');
        root.innerHTML = newHtml;
    }else if(window.getComputedStyle(nodes[node], null).display === 'inline'){
        console.log('inline');
    }
    
}


function createNewInnerText(myInnerText, reg){
    var regG = new RegExp(reg, 'ig');
    var matches = indexesOf(regG, myInnerText);
    var newInnerText = '';
    for(var i = 0;i<matches.length;i++){
        var addString = `<font class="highlight-me">${matches[i][0]}</font>`;
        newInnerText += 
            myInnerText.substring(
                matches[i-1]?matches[i-1][0].length + matches[i-1][1]: 0, 
                matches[i][1]
            )
        ;
        newInnerText += addString;
        newInnerText += matches[i+1] ? '' : 
            myInnerText.substring(
                matches[i][1] + matches[i][0].length, 
                myInnerText.length
            )
        ;
    }
    return newInnerText;
}
function indexesOf(regExpression, stg){
    var arr = [];
    var regExp = new RegExp(regExpression, 'i');
    var myStg = stg;
    var match;
    while(regExp.test(myStg)){
        match = regExp.exec(myStg);
        arr.push([match[0], match.index]);
        var repl = '';
        for(var i = 0;i<match[0].length;i++){
            repl += ' ';
        }
        myStg = myStg.replace(regExp, repl);
    }
    return arr;
}

function getAllNodes(){
    var myTW = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var currentNode;
    var currentNode = myTW.currentNode;
    var nodes = [];
    var nodeData;
    var parent;
    while (currentNode = myTW.nextNode()){
        nodeData = currentNode.data + '';
        parent = currentNode.parentElement;
        if(
            parent.tagName != 'SCRIPT' && 
            parent.tagName != 'NOSCRIPT' && 
            parent.tagName != 'STYLE' && 
            nodeData.trim() != ''
        ){
            let same = nodes.find(elem => elem.parentElement === parent);
            if(!same) {
                nodes.push(parent);
            }
        }
    }
    return nodes;
}

















/*
// listen for messages from the popup and the background
chrome.runtime.onMessage.addListener((msg, sender, response) => {
    // this is the main highlight statement.
    // need to do some adjustment for different colors
    if((msg.from === 'popup') && (msg.subject === 'newDomInfo')){
        clearHighlight();
        addHighlight(msg.data);
    }
    // this is to handle the popup going out of focus
    if((msg.from === 'background' && (msg.subject === 'popupClosed'))) {
        clearHighlight();
    }
    // respond with a message. could change this in the future. 
    response('we got the message');
});



// select the body for dom manipulation
const root = document.querySelector('body');
const left = /&lt;font class="highlight-me"&gt;/g;
const right = /&lt;[/]font&gt;/g;

// function to add highlight to the whole page
function addHighlight(reg){
    
    var nodes = treeWalker(reg);
    var reg = new RegExp(reg, 'i');
    var newNode;
    for(var i = 0;i<nodes.length;i++){
        newNode = document.createTextNode(createNewInnerText(nodes[i].data, reg));
        nodes[i].parentNode.replaceChild(newNode, nodes[i]);
    }
    var newHtml = root.innerHTML;
    newHtml = newHtml.replace(left, `<font class="highlight-me">`); 
    newHtml = newHtml.replace(right, '</font>');
    root.innerHTML = newHtml;
}



function clearHighlight(){
    var left = /<font class="highlight-me">/g;var right = /<[/]font>/g;
    var newHtml = root.innerHTML;
    newHtml = newHtml.replace(left, ''); 
    newHtml = newHtml.replace(right, '');
    root.innerHTML = newHtml;
}

// get all instances of a string searchText within a document
function treeWalker(searchText){
    var myTW = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var currentNode = myTW.currentNode;
    var nodes = [];
    var reg = new RegExp(searchText, 'i');
    var nodeData;
    var parent;
    while (currentNode){
        nodeData = currentNode.data + '';
        parent = currentNode.parentElement;
        if(parent.tagName != 'SCRIPT' && 
            parent.tagName != 'NOSCRIPT' && 
            parent.tagName != 'STYLE' && 
            // parent.style.display == 'block'&&
            nodeData.trim() != '' &&
            reg.test(nodeData)
        ){
            nodes.push(currentNode);
        }
        currentNode = myTW.nextNode();
    }
    return nodes;
}
function createNewInnerText(myInnerText, reg){
    var regG = new RegExp(reg, 'ig');
    var matches = indexesOf(regG, myInnerText);
    var newInnerText = '';
    for(var i = 0;i<matches.length;i++){
        var addString = `<font class="highlight-me">${matches[i][0]}</font>`;
        newInnerText += 
            myInnerText.substring(
                matches[i-1]?matches[i-1][0].length + matches[i-1][1]: 0, 
                matches[i][1]
            )
        ;
        newInnerText += addString;
        newInnerText += matches[i+1] ? '' : 
            myInnerText.substring(
                matches[i][1] + matches[i][0].length, 
                myInnerText.length
            )
        ;
    }
    return newInnerText;
}
function indexesOf(regExpression, stg){
    var arr = [];
    var regExp = new RegExp(regExpression, 'i');
    var myStg = stg;
    var match;
    while(regExp.test(myStg)){
        match = regExp.exec(myStg);
        arr.push([match[0], match.index]);
        var repl = '';
        for(var i = 0;i<match[0].length;i++){
            repl += ' ';
        }
        myStg = myStg.replace(regExp, repl);
    }
    return arr;
}
*/