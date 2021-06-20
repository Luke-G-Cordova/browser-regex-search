
var word;
const root = document.querySelector('body');

var args = [];

chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if((msg.from === 'popup') && (msg.subject === 'newDomInfo')){
        // undoRecursion(args);
        // word = new RegExp(msg.data);
        // args = recursive(root, word);
    }
    response('we got the message');
});

var nodesToChange = treeWalker('the');
console.log(nodesToChange);
var nodesChanged = [];
// // console.log(nodesToChange);

var newNode;
var parent;
var nodeData;
var reg = new RegExp('the', 'i');
var left = /&lt;font class="highlight-me"&gt;/g;var right = /&lt;[/]font&gt;/g;
for(var i = 0;i<nodesToChange.length;i++){
    parent = nodesToChange[i][1];
    nodeData = nodesToChange[i][0].data;
    
    newNode = document.createTextNode(createNewInnerText(nodeData, reg));
    try{
        parent.replaceChild(newNode, nodesToChange[i][0]);
        var newHtml = parent.innerHTML;
        newHtml = newHtml.replace(left, `<font class="highlight-me">`); 
        newHtml = newHtml.replace(right, '</font>');
        parent.innerHTML = newHtml;
    }catch(err){
        // console.log('hello');
    }
    

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
            // if(parent.childNodes.length === 1){
            //     nodes.push([currentNode, parent]);
            // } else {
            //     var newTW = document.createTreeWalker(parent);
            //     var newCurrent = newTW.currentNode;
            //     var args = [];
            //     while(newCurrent){
            //         args.push(newCurrent);
            //         newCurrent = newTW.nextNode();
            //         currentNode = myTW.nextNode();
            //     }
            //     nodes.push([args, parent]);
            // }
            nodes.push([currentNode, parent]);
            
        }
        currentNode = myTW.nextNode();
    }
    return nodes;
}



function createNewInnerText(myInnerText, reg){
    var regG = new RegExp(reg, 'ig');
    // get the matched strings and their indexes inside the parent string
    var matches = indexesOf(regG, myInnerText);
    // a constructor variable for the innerText
    var newInnerText = '';
    for(var i = 0;i<matches.length;i++){
        var addString = `<font class="highlight-me">${matches[i][0]}</font>`;
        // get the string before the match and add it to the constructor
        newInnerText += 
            myInnerText.substring(
                matches[i-1]?matches[i-1][0].length + matches[i-1][1]: 0, 
                matches[i][1]
            )
        ;
        // add the matched string with styles to the constructor
        newInnerText += addString;
        // add the string after the match to the constructor
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




// function recursive(node, searchText, args){
//     if(node.nodeType === Node.TEXT_NODE){
//         var stg = node.textContent + '';
//         var reg = new RegExp(searchText, 'i');//DO NOT CHANGE TO GLOBAL!!!
//         var parent = node.parentNode;
//         var newNode;
//         if(reg.test(stg)){
//             newNode = document.createTextNode(createNewInnerText(node.data, reg));
//             parent.replaceChild(newNode, node);
//             var newHtml = parent.innerHTML;
//             var left = /&lt;font class="highlight-me"&gt;/g;
//             var right = /&lt;[/]font&gt;/g;
//             newHtml = newHtml.replace(left, `<font class="highlight-me">`); 
//             newHtml = newHtml.replace(right, '</font>');
//             parent.innerHTML = newHtml;
//         }
//         args.push([node, newNode, parent]);
//         return 0;
//     } else if(node.hasChildNodes()){
//         var children = node.childNodes;
//         var chOgLength = children.length;
//         for(var i = 0;i<chOgLength;i++){
//             recursive(children[i], searchText, args);
//             if(chOgLength<children.length){
//                 i += children.length - chOgLength;
//                 chOgLength = children.length;
//             }
//         }
//     }
//     return args;
// }
// function undoRecursion(args){
//     for(var i = 0;i<args.length;i++){
//         if(args[i][1]){
//             args[i][2].replaceChild(args[i][1], args[i][0]);
//         }
//     }
// }