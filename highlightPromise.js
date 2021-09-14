

// http://blog.alexanderdickson.com/javascript-replacing-text
function clearHighlight(keys){
    var elems;
    var nodes;
    var elements;
    var keysCopy = [].concat(keys);
    
    for(let j = 0;j<keysCopy.length;j++){
        elems = document.querySelectorAll(`highlight-me.chrome-regeggz-highlight-me.${keysCopy[j]}`);
        elements = [].slice.call(elems);
        for(let i = 0;i<elements.length;i++){
            nodes = [].slice.call(elements[i].childNodes);
            var nodesFragment = document.createDocumentFragment();
            for(let node in nodes){
                nodesFragment.appendChild(nodes[node]);
            }
            elements[i].parentNode.replaceChild(nodesFragment, elements[i]);
            elements[i] = nodes[0];
            nodes[0].parentNode.normalize();
        }
    }
}

function highlight(root, regex, callback, excludes){
    excludes || (excludes = ['script', 'style', 'iframe', 'canvas', 'noscript']);
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, function(node) {
        if(
            node.data.trim() === '' || 
            excludes.indexOf(node.parentNode.tagName.toLowerCase()) > -1 ||
            !node.parentElement.offsetParent
        ){
            return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
    });

    function trimBadHtmlNodes(node){
        if(node.data.indexOf('\n') !== -1){
            var before = after = '';
            after = (node.data[node.data.length - 1] === ' ' || node.data[node.data.length - 1] === '\n') ? ' ' : '';
            before = (node.data[0] === ' ' || node.data[0] === '\n') ? ' ' : '';
            node.data = before + node.data.trim() + after;
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
    var gNSplit = [];
    gNSplit.push([]);
    var gNSplitNodeAmt = 0;
    var count = 0;
    var nodeList = [];
    // loopThrough(groupedNodes).then(res => nodeList = res);
    for(let i = 0, j = 0, k = 0;i<groupedNodes.length;i++){
        k = groupedNodes[i].map(elem => elem.data).join('').length;
        if(gNSplitNodeAmt + k >= 1000){
            j++;
            gNSplit.push([]);
            gNSplitNodeAmt = 0;
        }
        gNSplitNodeAmt += k;
        gNSplit[j].push(groupedNodes[i]);
    }
    console.log(gNSplit);
    console.log(groupedNodes);
    var myPromises = [];
    gNSplit.forEach((elem) => {
        loopThrough(elem).then((res) => nodeList.push(res));
    });

    // console.log(Promise.all(myPromises));

    
    async function loopThrough(myGroupedNodes){
        var masterStr = '';
        var test;
        var test2;
        var tag;
        var newNode;
        var nodeList = [];
        var count = 0;
        for(let i = 0;i<myGroupedNodes.length;i++){

            masterStr = await myGroupedNodes[i].map(elem => elem.data).join('');
    
            while(test = regex.exec(masterStr)){
                
                var lastRegIndex = regex.lastIndex;
                
                count++;
    
                var j = 0;
                
                var nodeParts = '' + await myGroupedNodes[i][j].data;
    
                var testIndex = test.index;
                while(testIndex > nodeParts.length - 1){
                    j++;
                    nodeParts = nodeParts + await myGroupedNodes[i][j].data;
                }
    
                regex.lastIndex = 0;
    
                test2 = regex.exec(await myGroupedNodes[i][j].data);
                
                var inThisNode = nodeParts.substr(testIndex);
    
                test2 || (
                    test2 = [], 
                    test2[0] = inThisNode, 
                    test2['index'] = await myGroupedNodes[i][j].data.length - inThisNode.length, 
                    test2['input'] = await myGroupedNodes[i][j].data,
                    test2['groups'] = undefined
                );
                
                var helpArr = [];
    
                helpArr.push(test2[0]);
    
                var sameMatchID = 0;
                nodeList.push([]);
                for(k = 0 ; helpArr.join('').length < test[0].length ; k++){
    
                    newNode = await myGroupedNodes[i][j].splitText(myGroupedNodes[i][j].length - helpArr[k].length);
                    tag = callback(helpArr[k], sameMatchID);
                    newNode.data = '';
                    insertedNode = newNode.parentNode.insertBefore(tag, newNode);
                    nodeList[nodeList.length - 1].push(insertedNode);
                    if(await myGroupedNodes[i][j].data.length === 0){
                        myGroupedNodes[i][j] = insertedNode.firstChild;
                    }else{
                        await myGroupedNodes[i].splice(j + 1, 0, insertedNode.firstChild);
                        j++;
                    }
                    j++;
                    sameMatchID++;
                    await helpArr.push(myGroupedNodes[i][j].data);
                }
                var lastNode = helpArr.pop();
                if(helpArr[0]){
    
                    newNode = await myGroupedNodes[i][j].splitText(0);
                    tag = await callback(lastNode.substr(0, test[0].length - helpArr.join('').length), -1);
                    newNode.data = await newNode.data.substr(test[0].length - helpArr.join('').length);
                    insertedNode = await newNode.parentNode.insertBefore(tag, newNode);
                    nodeList[nodeList.length - 1].push(insertedNode);
                    
                    myGroupedNodes[i][j] = await insertedNode.firstChild;
                    if(newNode.data.length > 0){
                        await myGroupedNodes[i].splice(j + 1, 0, newNode);
                    }
                    sameMatchID++;
                }else{
                    newNode = await myGroupedNodes[i][j].splitText(test2.index);
                    
                    tag = await callback(test2[0], -1);
                    newNode.data = await newNode.data.substr(test2[0].length);
                    insertedNode = await newNode.parentNode.insertBefore(tag, newNode);
    
                    nodeList[nodeList.length - 1].push(insertedNode);
    
                    if(myGroupedNodes[i][j].data === ''){
                        if(newNode.data === ''){
                            await myGroupedNodes[i].splice(j, 1, insertedNode.firstChild);
                        }else{
                            await myGroupedNodes[i].splice(j, 1, insertedNode.firstChild, newNode);
                        }
                    }else{
                        if(newNode.data === ''){
                            await myGroupedNodes[i].splice(j + 1, 0, insertedNode.firstChild);
                        }else{
                            await myGroupedNodes[i].splice(j + 1, 0, insertedNode.firstChild, newNode);
                        }
                    }
                }
                nodeParts = '';
                regex.lastIndex = await lastRegIndex;
            }
            regex.lastIndex = 0;
        }
        return nodeList;
    }
    
    return {
        count,
        elements: nodeList
    };
}