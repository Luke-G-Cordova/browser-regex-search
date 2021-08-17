

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
    var nodes;
    var elements;
    var keysCopy = [].concat(keys);
    for(j = 0;j<keysCopy.length;j++){
        elems = document.querySelectorAll(`span.chrome-regeggz-span.highlight-me.${keysCopy[j]}`);
        elements = [].slice.call(elems);
        for(i = 0;i<elements.length;i++){
            nodes = [].slice.call(elements[i].childNodes);
            var nodesFragment = document.createDocumentFragment();
            for(node in nodes){
                nodesFragment.appendChild(nodes[node]);
            }
            elements[i].parentNode.replaceChild(nodesFragment, elements[i]);
            elements[i] = nodes[0];
            nodes[0].parentNode.normalize();
        }
    }
    index = 0;
}

// highlight(document.body, new RegExp('the', 'ig'), function(match) {
//     var span = document.createElement("span");
//     span.style.backgroundColor = `yellow`;
//     span.style.color = `black`;
//     span.textContent = match;
//     return span;
// });

function highlight(root, regex, callback, excludes){
    excludes || (excludes = ['script', 'style', 'iframe', 'canvas']);
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, function(node) {
        if(
            node.data.trim() === '' || 
            excludes.indexOf(node.parentNode.tagName.toLowerCase()) > -1
        ){
            return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
    });
    function trimBadHtmlNodes(node){
        if(node.data.indexOf('\n') !== -1){
            var block = node.nextSibling;
            var before = after = '';
            if(!block || block.nodeType === Node.ELEMENT_NODE && window.getComputedStyle(block, null).display !== 'block'){
                after = (node.data[node.data.length - 1] === ' ' || node.data[node.data.length - 1] === '\n') ? ' ' : '';
                before = (node.data[0] === ' ' || node.data[0] === '\n') ? ' ' : '';
                node.data = before + node.data.trim() + after;
            }else if(block && block.nodeType === Node.ELEMENT_NODE && window.getComputedStyle(block, null).display === 'block'){
                before = (node.data[0] === ' ' || node.data[0] === '\n') ? ' ' : '';
                node.data = before + node.data.trimStart();
            }
        }
    }
    function relativeNodes(node1, node2){
        var parNode1 = node1, parNode2 = node2;
        var atRoot = false;
        while(true){
            atRoot = parNode1 === root && parNode2 === root;
            if(atRoot) return null;
            if(parNode1.parentNode === node2.parentNode) return node2.parentNode;
            if(parNode2.parentNode === node1.parentNode) return node1.parentNode;
            if(parNode1 !== root){
                parNode1 = parNode1.parentNode;
                if(window.getComputedStyle(parNode1, '').display === 'block'){
                    parNode1 = root;
                }
            }
            if(parNode2 !== root){
                parNode2 = parNode2.parentNode;
                if(window.getComputedStyle(parNode2, '').display === 'block'){
                    parNode2 = root;
                }
            }
        }
    }

    // group the nodes by common parent in an array
    var nodes = [];
    var groupedNodes = [];
    var lastElem;
    while(tw.nextNode()){
        trimBadHtmlNodes(tw.currentNode);
        if(groupedNodes.length === 0){
            groupedNodes.push([]);
            groupedNodes[groupedNodes.length - 1].push(tw.currentNode);
        }else{
            lastElem = nodes[nodes.length -1];
            if(relativeNodes(tw.currentNode, lastElem)){
                groupedNodes[groupedNodes.length - 1].push(tw.currentNode);
            }else{
                groupedNodes[groupedNodes.length] = [];
                groupedNodes[groupedNodes.length - 1].push(tw.currentNode);
            }
        }
        nodes.push(tw.currentNode);
    }

    // console.log(groupedNodes);

    var masterStr = '';
    var test;
    var test2;
    var tag;
    var newNode;
    for(i = 0;i<groupedNodes.length;i++){

        masterStr = groupedNodes[i].map(elem => elem.data).join('');

        // for all node groups that contain at least one match
        while(test = regex.exec(masterStr)){
            var lastRegIndex = regex.lastIndex;

            // find nodes with an occurence of the match
            var j = 0;
            var nodeParts = '' + groupedNodes[i][j].data;

            while(test.index > nodeParts.length - 1){
                j++;
                nodeParts += groupedNodes[i][j].data;
            }
            // find the match with in the node
            regex.lastIndex = 0;
            test2 = regex.exec(groupedNodes[i][j].data);
            // find if this node only contains part of the match
            var inThisNode = nodeParts.substr(test.index);


            // if the current node only contains part of the match,
            // test2 will not be able to detect, so this is the construction
            // of test2 to account for that case. 
            test2 || (
                test2 = [], 
                test2[0] = inThisNode, 
                test2['index'] = groupedNodes[i][j].data.length - inThisNode.length, 
                test2['input'] = groupedNodes[i][j].data,
                test2['groups'] = undefined
            );

            var helpArr = [];
            helpArr.push(test2[0]);

            for(k = 0 ; helpArr.join('').length < test[0].length ; k++){
                
                newNode = groupedNodes[i][j].splitText(groupedNodes[i][j].length - helpArr[k].length);
                tag = callback(helpArr[k]);
                newNode.data = '';
                insertedNode = newNode.parentNode.insertBefore(tag, newNode);
                if(groupedNodes[i][j].data.length === 0){
                    groupedNodes[i][j] = insertedNode.firstChild;
                }else{
                    groupedNodes[i].splice(j + 1, 0, insertedNode.firstChild);
                    j++;
                }
                j++;
                helpArr.push(groupedNodes[i][j].data);
            }
            var lastNode = helpArr.pop();
            if(helpArr[0]){

                newNode = groupedNodes[i][j].splitText(0);
                tag = callback(lastNode.substr(0, test[0].length - helpArr.join('').length));
                newNode.data = newNode.data.substr(test[0].length - helpArr.join('').length);
                insertedNode = newNode.parentNode.insertBefore(tag, newNode);

                groupedNodes[i][j] = insertedNode.firstChild;
                if(newNode.data.length > 0){
                    groupedNodes[i].splice(j + 1, 0, newNode);
                }
            }else{
                newNode = groupedNodes[i][j].splitText(test2.index);
                tag = callback(test2[0]);
                newNode.data = newNode.data.substr(test2[0].length);
                insertedNode = newNode.parentNode.insertBefore(tag, newNode);

                groupedNodes[i].splice(j + 1, 0, insertedNode.firstChild, newNode);
            }

            nodeParts = '';
            regex.lastIndex = lastRegIndex;

        }
        regex.lastIndex = 0;
        
    }
}
// highlight(document.body, new RegExp('the', 'ig'), function(match){
    //     var span = document.createElement("span");
    //     span.className = `chrome-regeggz-span highlight-me`;
    //     span.style.backgroundColor = `yellow`;
    //     span.style.color = `black`;
    //     span.textContent = match;
    //     return span;
    // });
    
    
    // function highlight(root, regex, callback, excludes){
    //     excludes || (excludes = ['script', 'style', 'iframe', 'canvas']);
    //     // TODO: make a filter for the treewalker to filter 
    //     // out blank text nodes and take out the current filter
    //     // system in the main loop of this function
    //     var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    
    //     var currentNode = tw.currentNode;
    
    //     function showFutureNode(){
    //         var node = tw.nextNode();
    //         if(!node) return node;
    //         var prevNode;
    //         while(excludes.indexOf(node.parentNode.tagName.toLowerCase()) > -1){
    //             node = tw.nextNode();
    //         }
    //         tw.previousNode();
    //         while(excludes.indexOf(tw.currentNode.parentNode.tagName.toLowerCase()) > -1){
    //             tw.previousNode();
    //         }
    //         return node;
    //     }
    //     function changeTWNextNode(){
    //         tw.nextNode();
    //         while(excludes.indexOf(tw.currentNode.parentNode.tagName.toLowerCase()) > -1){
    //             tw.nextNode();
    //         }
    //     }
    //     function trimBadHtmlNodes(node){
    //         if(node.data.indexOf('\n') !== -1){
    //             var block = node.nextSibling;
    //             if(block && block !== root){
    //                 if(block.nodeType === Node.ELEMENT_NODE && window.getComputedStyle(block, null).display !== 'block'){
    //                     var before = after = '';
    //                     after = (node.data[node.data.length - 1] === ' ' || node.data[node.data.length - 1] === '\n') ? ' ' : '';
    //                     before = (node.data[0] === ' ' || node.data[0] === '\n') ? ' ' : '';
    //                     node.data = before + node.data.trim() + after;
    //                 }else if(block.nodeType === Node.ELEMENT_NODE && window.getComputedStyle(block, null).display === 'block'){
    //                     node.data = ' ' + node.data.trimStart();
    //                 }
    //             }
    //         }
    //     }
        
    //     var nextNode;
    //     var str = '';
    //     var test;
    //     var tag;
    //     while(
    //         (currentNode = tw.nextNode())
    //     ){
    //         while(
    //             currentNode &&
    //             (excludes.indexOf(currentNode.parentNode.tagName.toLowerCase()) > -1 || 
    //             currentNode.data.trim() === '')
    //         ){
    //             currentNode = tw.nextNode();
    //         }
    //         if(currentNode){
    
    //             trimBadHtmlNodes(currentNode);
    
    //             // this statement takes care of all
    //             // the matches that happen accross
    //             // single nodes 
    //             if(test = regex.exec(currentNode.data)){
    //                 var newNode = currentNode.splitText(test.index);
    //                 newNode.data = newNode.data.substr(test[0].length);
    //                 tag = callback(test[0]);
    //                 newNode.parentNode.insertBefore(tag, newNode);
    //                 changeTWNextNode();
    //                 currentNode = tw.currentNode;
    //             }
                
    //             regex.lastIndex = 0;
                
    //             // this statement takes care of all 
    //             // the matches that happen accross
    //             // multiple nodes
    //             // ----------------------------------------- TODO -------------------------------------
    //             // right now it works across only 
    //             // 2 individual nodes, I need to make 
    //             // it work accross any amount of individual
    //             // SIBLING nodes.
    //             if(nextNode = showFutureNode()){
    
    
    
    
    //                 trimBadHtmlNodes(nextNode);
    
    
    //                 var firstHalf = currentNode.data;
    //                 var lastIndex = 0;
    //                 while(test = regex.exec(firstHalf)){
    //                     lastIndex = regex.lastIndex;
    //                 }
    //                 regex.lastIndex = lastIndex;
                    
    //                 var secondHalf = nextNode.data;
                    
    //                 str = firstHalf + secondHalf;
    //                 test = regex.exec(str);
    //                 if(test && test.index < firstHalf.length){
    
    
    
    //                     var newNode = currentNode.splitText(test.index);
    //                     var ogNewNodeData = newNode.data;
    //                     newNode.data = '';
    //                     tag = callback(ogNewNodeData);
    //                     newNode.parentNode.insertBefore(tag, newNode);
    //                     currentNode = tw.nextNode();
    
    //                     var of = test[0].length - ogNewNodeData.length;
    //                     var newNextNode = nextNode.splitText(of);
    //                     changeTWNextNode();
    //                     currentNode = tw.nextNode();
    //                     var ogData = currentNode.data;
    //                     currentNode.data = '';
    //                     tag = callback(ogData);
    //                     newNextNode.parentNode.insertBefore(tag, newNextNode);
    //                     changeTWNextNode();
    //                     currentNode = tw.currentNode;
    //                 }
    //             }
    //             regex.lastIndex = 0;
    //             str = '';
    //         }
    //     }
    //     return root;
    // }