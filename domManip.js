


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
        var reg = new RegExp(searchText, 'i');
        if(reg.test(stg)){

            // declare the text Nodes parent
            var parent = node.parentNode;
            var pHoldParent = document.createElement(parent.tagName);
            if(parent.hasChildNodes()&&parent.childNodes.length>1){
                pHoldParent.innerHTML = parent.innerHTML;
                console.log(pHoldParent.innerHTML);

            }else {
                
                pHoldParent.innerHTML = parent.innerHTML;
    
                pHoldParent.innerText = pHoldParent.innerText.replace(reg, `<font class="highlight-me">${reg.exec(parent.innerText)[0]}</font>`);
                var newHtml = pHoldParent.innerHTML;
                var left = /&lt;font class="highlight-me"&gt;/g;
                var right = /&lt;[/]font&gt;/g;
                newHtml = newHtml.replace(left, `<font class="highlight-me">`); newHtml = newHtml.replace(right, '</font>');
                
                parent.innerHTML = newHtml;
            }
            
            

            // create a place holder element
            // var docElem = document.createElement(parent.tagName);
            // assign the parents html to the place holder
            // docElem.innerHTML = parent.innerHTML;

            // var manipText = docElem.innerText;
            // var destroyText = docElem.innerText;
            
            
            // while(reg.test(destroyText)){
            //     if(replace = reg.exec(destroyText)){
            //         destroyText = destroyText.replace(reg, '');
            //         manipText = manipText.replace(reg, `<font style="background-color: yellow">${replace[0]}</font>`);
            //         console.log(replace[0]);
            //     }
            // }
            
            // docElem.innerText = manipText;

            // change the innerText of the place holder text to a highlight of the search text
            // docElem.innerText = docElem.innerText.replace(reg, `<span style="background-color: yellow">${searchText}</span>`);
            

            // convert the place holder innerHTML into a string
            // var newHtml = docElem.innerHTML + '';

            // change all &lt; and &gt; with in the string to < and > because innerText auto changes them
            // newHtml = newHtml.replace(/&lt;/g, '<');newHtml = newHtml.replace(/&gt;/g, '>');

            // give parent innerHTML the new string
            // parent.innerHTML = newHtml;

        }
        
    }
    return null;
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

