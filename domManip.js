



const word = 'the';
const root = document.querySelector('body');

recursive(root, word);

function recursive(node, searchText){
    // if the node is not a text node, move on to the next child node or sibling node
    if(node.nodeType != Node.TEXT_NODE){
        // if the current Node has children
        if(node.hasChildNodes()){
            var children = node.childNodes;
            // iterate through children of the current node
            for(var i = 0;i<children.length;i++){
                recursive(children[i], searchText);
            }
        }
        // if the node is a text node then manipulate the text
    }else {
        // has to be textContent and not innerText because we havent gotten the parent Node yet
        var stg = node.textContent + '';
        // if the text has the search term 
        if(stg.indexOf(searchText) !== -1){

            // declare the text Nodes parent
            var parent = node.parentNode;

            // create a place holder element
            var docElem = document.createElement(parent.tagName);

            // assign the parents html to the place holder
            docElem.innerHTML = parent.innerHTML;

            // change the innerText of the place holder text to a highlight of the search text
            docElem.innerText = docElem.innerText.replace(searchText, `<span style="background-color: yellow">${searchText}</span>`);

            // convert the place holder innerHTML into a string
            var newHtml = docElem.innerHTML + '';

            // change all &lt; and &gt; with in the string to < and > because innerText auto changes them
            newHtml = newHtml.replace(/&lt;/g, '<');newHtml = newHtml.replace(/&gt;/g, '>');

            // give parent innerHTML the new string
            parent.innerHTML = newHtml;
            
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