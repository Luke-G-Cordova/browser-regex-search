
var word;
const root = document.querySelector('body');


chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if((msg.from === 'popup') && (msg.subject === 'newDomInfo')){
        clearHighlight();
        addHighlight(msg.data);
        
    }
    response('we got the message');
});


function clearHighlight(){
    var left = /<font class="highlight-me">/g;var right = /<[/]font>/g;
    var newHtml = root.innerHTML;
    newHtml = newHtml.replace(left, ''); 
    newHtml = newHtml.replace(right, '');
    root.innerHTML = newHtml;
}
function addHighlight(reg){
    var nodes = treeWalker(reg);
    var reg = new RegExp(reg, 'i');
    var left = /&lt;font class="highlight-me"&gt;/g;var right = /&lt;[/]font&gt;/g;
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