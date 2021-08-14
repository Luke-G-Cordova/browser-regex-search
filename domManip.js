

var index = 0;
var elemKeys = [];
chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if((msg.from === 'popup') && (msg.subject === 'newDomInfo')){
        if(elemKeys.indexOf(msg.key) === -1) elemKeys.push(msg.key);
        
        clearHighlight(msg.key);

        if(msg.data !== ''){
            highlight(document.body, new RegExp(msg.data, 'ig'), function(match){
                index++;
                var span = document.createElement("span");
                span.className = `chrome-regeggz-span highlight-me ${msg.key}`;
                span.style.backgroundColor = `rgb(${msg.color})`;
                span.style.color = `black`;
                span.id = `${index}|${msg.color}`;
                span.textContent = match;
                return span;
            });
        }
    }
    if((msg.from === 'background' && (msg.subject === 'popupClosed'))) {
        clearHighlight(elemKeys);
    }
    response('we got the message');
});

// http://blog.alexanderdickson.com/javascript-replacing-text
function clearHighlight(keys){
    var elems;
    var node;
    var elements;
    var keysCopy = [].concat(keys);
    for(j = 0;j<keysCopy.length;j++){
        elems = document.querySelectorAll(`span.chrome-regeggz-span.highlight-me.${keysCopy[j]}`);
        elements = [].slice.call(elems);
        for(i = 0;i<elements.length;i++){
            node = elements[i].childNodes[0];
            elements[i].parentNode.replaceChild(elements[i].childNodes[0], elements[i]);
            node.parentNode.normalize();
        }
    }
    index = 0;
}
// highlight(document.body, new RegExp('the the', 'ig'), function(match){
//     var span = document.createElement("span");
//     span.className = `chrome-regeggz-span highlight-me`;
//     span.style.backgroundColor = `yellow`;
//     span.style.color = `black`;
//     span.textContent = match;
//     return span;
// });

function highlight(root, regex, callback, excludes){
    excludes || (excludes = ['script', 'style', 'iframe', 'canvas']);
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var currentNode = tw.currentNode;

    function showFutureNode(){
        var node = tw.nextNode();
        if(!node) return node;
        var prevNode;
        while(excludes.indexOf(node.parentNode.tagName.toLowerCase()) > -1){
            node = tw.nextNode();
        }
        tw.previousNode();
        while(excludes.indexOf(tw.currentNode.parentNode.tagName.toLowerCase()) > -1){
            tw.previousNode();
        }
        return node;
    }
    function changeTWNextNode(){
        tw.nextNode();
        while(excludes.indexOf(tw.currentNode.parentNode.tagName.toLowerCase()) > -1){
            tw.nextNode();
        }
    }
    function trimBadHtmlNodes(node){
        if(node.data.indexOf('\n') !== -1){
            var block = node.nextSibling;
            if(block && block !== root){
                if(block.nodeType === Node.ELEMENT_NODE && window.getComputedStyle(block, null).display !== 'block'){
                    var before = after = '';
                    after = (node.data[node.data.length - 1] === ' ' || node.data[node.data.length - 1] === '\n') ? ' ' : '';
                    before = (node.data[0] === ' ' || node.data[0] === '\n') ? ' ' : '';
                    node.data = before + node.data.trim() + after;
                }else if(block.nodeType === Node.ELEMENT_NODE && window.getComputedStyle(block, null).display === 'block'){
                    node.data = ' ' + node.data.trimStart();
                }
            }
        }
    }
    var nextNode;
    var str = '';
    var test;
    var tag;
    while(
        (currentNode = tw.nextNode())
    ){
        while(
            currentNode &&
            (excludes.indexOf(currentNode.parentNode.tagName.toLowerCase()) > -1 || 
            currentNode.data.trim() === '')
        ){
            currentNode = tw.nextNode();
        }
        if(currentNode){

            trimBadHtmlNodes(currentNode);

            // this statement takes care of all
            // the matches that happen accross
            // single nodes 
            if(test = regex.exec(currentNode.data)){
                var newNode = currentNode.splitText(test.index);
                newNode.data = newNode.data.substr(test[0].length);
                tag = callback(test[0]);
                newNode.parentNode.insertBefore(tag, newNode);
                changeTWNextNode();
                currentNode = tw.currentNode;
            }
            
            regex.lastIndex = 0;
            
            // this statement takes care of all 
            // the matches that happen accross
            // multiple nodes
            // ----------------------------------------- TODO -------------------------------------
            // right now it works across only 
            // 2 individual nodes, I need to make 
            // it work accross any amount of individual
            // SIBLING nodes.
            if(nextNode = showFutureNode()){

                trimBadHtmlNodes(nextNode);

                var firstHalf = currentNode.data;
                var lastIndex = 0;
                while(test = regex.exec(firstHalf)){
                    lastIndex = regex.lastIndex;
                }
                regex.lastIndex = lastIndex;
                
                var secondHalf = nextNode.data;
                
                str = firstHalf + secondHalf;
                test = regex.exec(str);
                if(test && test.index < firstHalf.length){
                    var newNode = currentNode.splitText(test.index);
                    var ogNewNodeData = newNode.data;
                    newNode.data = '';
                    tag = callback(ogNewNodeData);
                    newNode.parentNode.insertBefore(tag, newNode);
                    currentNode = tw.nextNode();

                    var of = test[0].length - ogNewNodeData.length;
                    var newNextNode = nextNode.splitText(of);
                    changeTWNextNode();
                    currentNode = tw.nextNode();
                    var ogData = currentNode.data;
                    currentNode.data = '';
                    tag = callback(ogData);
                    newNextNode.parentNode.insertBefore(tag, newNextNode);
                    changeTWNextNode();
                    currentNode = tw.currentNode;
                }
            }
            regex.lastIndex = 0;
            str = '';
        }
    }
    return root;
}