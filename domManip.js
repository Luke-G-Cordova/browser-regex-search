
const word = /\d+[.] (\w+ \w+|\w+-\w+|\w+)/;
const root = document.querySelector('body');
const killRecursion = false;
recursive(root, word);

function recursive(node, searchText){
    if(!killRecursion){
        if(node.nodeType === Node.TEXT_NODE){
            var stg = node.textContent + '';
            var reg = new RegExp(searchText, 'i');//DO NOT CHANGE TO GLOBAL!!!
            var parent = node.parentNode;
            if(reg.test(stg)){
                parent.replaceChild(document.createTextNode(createNewInnerText(node.data, reg)), node);
                var newHtml = parent.innerHTML;
                var left = /&lt;font class="highlight-me"&gt;/g;
                var right = /&lt;[/]font&gt;/g;
                newHtml = newHtml.replace(left, `<font class="highlight-me">`); 
                newHtml = newHtml.replace(right, '</font>');
                parent.innerHTML = newHtml;
                console.log(parent.innerHTML);
            }
        } else if(node.hasChildNodes()){
            var children = node.childNodes;
            var chOgLength = children.length;
            for(var i = 0;i<chOgLength;i++){
                recursive(children[i], searchText);
                if(chOgLength<children.length){
                    i += children.length - chOgLength;
                    chOgLength = children.length;
                }
            }
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

