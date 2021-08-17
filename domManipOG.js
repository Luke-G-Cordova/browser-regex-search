



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


// logic for replacing dom with hilighted version


const root = document.querySelector('body');

// function addHighlight(reg){
//     var nodes = treeWalker(reg);
//     var reg = new RegExp(reg, 'i');
//     var left = /&lt;font class="highlight-me"&gt;/g;var right = /&lt;[/]font&gt;/g;
//     var newNode;
//     for(var i = 0;i<nodes.length;i++){
//         newNode = document.createTextNode(createNewInnerText(nodes[i].data, reg));
//         nodes[i].parentNode.replaceChild(newNode, nodes[i]);
//     }
//     var newHtml = root.innerHTML;
//     newHtml = newHtml.replace(left, `<font class="highlight-me">`); 
//     newHtml = newHtml.replace(right, '</font>');
//     root.innerHTML = newHtml;
// }

console.log(document.body.innerHTML);
console.log(document.body.innerText);
// addHighlight('the');
function addHighlight(reg){
    var nodes = treeWalker(reg);

    console.log(nodes);
    // var tag;
    // var args = [].slice.call(arguments);
    // console.log(args);
    // var offset = args[args.length - 2];
    // var newTextNode = child.splitText(offset+bk);
    // bk -= child.data.length + match.length;

    // newTextNode.data = newTextNode.data.substr(match.length);
    // tag = callback.apply(window, [child].concat(args));

    // child.parentNode.insertBefore(tag, newTextNode);
    // child.parentNode.normalize();
    // child = newTextNode;
}


function clearHighlight(){
    var left = /<font class="highlight-me">/g;var right = /<[/]font>/g;
    var newHtml = root.innerHTML;
    newHtml = newHtml.replace(left, ''); 
    newHtml = newHtml.replace(right, '');
    root.innerHTML = newHtml;
}
function treeWalker(searchText){
    var myTW = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var currentNode = myTW.currentNode;
    var nodes = [];
    var reg = new RegExp(searchText, 'ig');
    var nodeData;
    var parent;
    while (currentNode){
        nodeData = currentNode.data + '';
        parent = currentNode.parentElement;
        if(parent.tagName != 'SCRIPT' && 
            parent.tagName != 'NOSCRIPT' && 
            parent.tagName != 'STYLE' && 
            nodeData.trim() != '' 
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