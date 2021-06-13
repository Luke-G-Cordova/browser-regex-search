


// getData();
// function getData(){
//     chrome.runtime.sendMessage('get-popup-info', (response) => {
//         console.log('received popup info: ', response);
//     });
// }



const word = 'the';
const root = document.querySelector('body');

recursive(root, word);

function recursive(node, searchText){
    
    // if the node is not a text node, move on to the next child node or sibling node
    if(node.hasChildNodes()||node.nodeType != Node.TEXT_NODE){
        // if the current Node has children
        if(node.hasChildNodes()){
            var children = node.childNodes;
            var chOgLength = children.length;
            // iterate through children of the current node
            for(var i = 0;i<chOgLength;i++){
                recursive(children[i], searchText);
            }
        }
        // if the node is a text node then manipulate the text
    }else {
        // has to be textContent and not innerText because we havent gotten the parent Node yet
        var stg = node.textContent + '';
        var reg = new RegExp(searchText, 'i');//DO NOT CHANGE TO GLOBAL!!!
        if(reg.test(stg)){

            // declare the text Nodes parent
            var parent = node.parentNode;
            
            // place holder for the parent node
            var pHoldParent = document.createElement(parent.tagName);
            var pChildren = pHoldParent.childNodes;
            pHoldParent.innerHTML = parent.innerHTML;
            var newHtml;
            if(pChildren&&pChildren.length>1){
                for(child in pChildren){
                    if(pChildren[child].nodeType === Node.TEXT_NODE){
                        pHoldParent.replaceChild(document.createTextNode(createNewInnerText(pChildren[child].data, reg)), pChildren[child]);
                    }
                }
            }else {
                // replace the holder innerText with the newly constructed string
                pHoldParent.innerText = createNewInnerText(pHoldParent.innerText, reg);
            }
            newHtml = pHoldParent.innerHTML;
            // replace all of my tags that are converted to strings back to tags
            var left = /&lt;font class="highlight-me"&gt;/g;
            var right = /&lt;[/]font&gt;/g;
            newHtml = newHtml.replace(left, `<font class="highlight-me">`); newHtml = newHtml.replace(right, '</font>');
            
            // replace the parent html with newly styled html string
            parent.innerHTML = newHtml;
        }
    }
    return null;
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

