
var word;
const root = document.querySelector('body');

var args = [];

chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if((msg.from === 'popup') && (msg.subject === 'newDomInfo')){

    }
    response('we got the message');
});

var nodesToChange = treeWalker('the');
console.log(nodesToChange);
var nodesChanged = [];
// console.log(nodesToChange);

var newNode;
var parent;
var nodeData;
var reg = new RegExp('the', 'i');
var left = /&lt;font class="highlight-me"&gt;/g;var right = /&lt;[/]font&gt;/g;
for(var i = 0;i<nodesToChange.length;i++){
    parent = nodesToChange[i][1];
    nodeData = nodesToChange[i][0].data;

    newNode = document.createTextNode(createNewInnerText(nodeData, reg));
    parent.replaceChild(newNode, nodesToChange[i][0]);

    var newHtml = parent.innerHTML;
    newHtml = newHtml.replace(left, `<font class="highlight-me">`); 
    newHtml = newHtml.replace(right, '</font>');
    parent.innerHTML = newHtml;

    var grandParent = parent.parentElement;
    // var counter = 0;
    // if(grandParent && grandParent.childNodes){
    //     for(var j = 0; j<grandParent.childNodes.length;j++){
    //         if(grandParent.childNodes[j] === parent){
    //             counter ++;
    //         }
    //     }
    // }
    console.log(nodesToChange[i][1]);
    // console.log(nodesToChange[i][0].parentElement.parentElement);
    
    

    nodesChanged.push(newNode);

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
            nodes.push([currentNode, parent]);
            
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