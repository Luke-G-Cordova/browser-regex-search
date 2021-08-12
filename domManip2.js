// window.getComputedStyle(parent, null).display === 'block' &&
// const root = document.querySelector('body');
// const left = /&lt;font class="highlight-me"&gt;/g;
// const right = /&lt;[/]font&gt;/g;


// const parser = new DOMParser();



// let nodes = getAllNodes('the int');
// console.log(nodes);
// let myHTML = 'hello tHe <span>inthed 10 THE the intintiv</span>the<p>hello I am th<p class="myDeepP">e intthe person</p></p>';
// let doc = parser.parseFromString(myHTML, 'text/html');
// var search = new RegExp('the int', 'ig');

// let body = doc.querySelector('body');
// let fullSearch = indexesOf(search, body.innerText);
// let htmlSearch = indexesOf(search, body.innerHTML);
// let bodyTW = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ALL);
// let currentNode = bodyTW.currentNode;
// let nodes = [];
// while(currentNode = bodyTW.nextNode()){
//     if(currentNode.nodeType === Node.TEXT_NODE && nodes[nodes.length-1] && (nodes[nodes.length-1][0] === currentNode.parentElement)){
//     }else{
//         nodes.push([currentNode, 0]);
//     }
// }
// console.log(nodes);

// let stg = ''
// for(let i = 0;i<nodes.length;i++){
//     let text = nodes[i][0].data||nodes[i][0].innerHTML;
//     nodes[i][1] = stg.length;
//     stg += text;
// }

// let matches = indexesOf(search, stg);
// // console.log(matches);
// // console.log(stg);

// for(let i = 0;i<matches.length; i++){
//     let endNode = nodes.find((elem, j) => matches[i][1] < nodes[j][1]);
//     let startNode = nodes[nodes.indexOf(endNode) - 1];
//     let matchEnd = matches[i][1] + matches[i][0].length;
//     let startHTML;
//     let endHTML;
//     if (matchEnd > endNode[1]){
//         startHTML = startNode[0].innerHTML || startNode[0].parentElement.innerHTML;
//         endHTML = endNode[0].innerHTML || endNode[0].parentElement.innerHTML;

//         console.log(matches[i]);
//         console.log(startHTML.substring(matches[i][1], endNode[1]));
//         console.log(endHTML.substring(0, matchEnd - endNode[1]));
//         // console.log(endHTML);
//         // console.log(startNode[0].substring(matches[i][1], endNode[1]));
//     }
// }



var matchText = function(node, regex, callback, excludeElements) { 

    excludeElements || (excludeElements = ['script', 'style', 'iframe', 'canvas']);
    var child = node.firstChild;

    while (child) {
        switch (child.nodeType) {
        case 1:
            if (excludeElements.indexOf(child.tagName.toLowerCase()) > -1)
                break;
            matchText(child, regex, callback, excludeElements);
            break;
        case 3:
            var bk = 0;
            child.data.replace(regex, function(all) {
                var args = [].slice.call(arguments),
                    offset = args[args.length - 2],
                    newTextNode = child.splitText(offset+bk), tag;
                bk -= child.data.length + all.length;

                newTextNode.data = newTextNode.data.substr(all.length);
                tag = callback.apply(window, [child].concat(args));
                child.parentNode.insertBefore(tag, newTextNode);
                child = newTextNode;
            });
            regex.lastIndex = 0;
            break;
        }

        child = child.nextSibling;
    }

    return node;
};

console.log(matchText(document.body, new RegExp("the", "ig"), function(node, match, offset) {
    var span = document.createElement("span");
    span.className = "highlight-me";
    span.textContent = match;
    return span;
}));


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


// function getAllNodes(searchText){
//     var myTW = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
//     var currentNode;
//     var currentNode = myTW.currentNode;
//     var search = new RegExp(searchText, 'ig');
//     var nodes = [];
//     var nodeData;
//     var parent;
//     while (currentNode = myTW.nextNode()){
//         nodeData = currentNode.data + '';
//         parent = currentNode.parentElement;
//         if(
//             parent.tagName != 'SCRIPT' && 
//             parent.tagName != 'NOSCRIPT' && 
//             parent.tagName != 'STYLE' && 
//             nodeData.trim() != ''&&
//             window.getComputedStyle(parent, '').display == 'block'&&
//             search.test(parent.innerText)
//         ){

//             nodes.push(parent);
            
//         }else{
            
            
//         }
//     }
//     return nodes;
// }









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