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


function highlight1(root, options, callback){
    let ogo = {
        regex: new RegExp(),
        excludes: [],
        limit: 1000,
        loose: false
    }
    if(options){
        Object.assign(ogo, options);
    }
    ogo.excludes = ['script', 'style', 'iframe', 'canvas', 'noscript'].concat(ogo.excludes);
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, function(node) {
        if(
            node.data.trim() === '' || 
            isDescendant(ogo.excludes, node)||
            // excludes.indexOf(node.parentNode.tagName.toLowerCase()) > -1 ||
            !node.parentElement.offsetParent
        ){
            return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
    });
    
    function isDescendant(tags, node){
        if(node !== document.body && tags.indexOf(node.parentNode.tagName.toLowerCase()) === -1){
            return isDescendant(tags, node.parentNode);
        }
        return node !== document.body;
    }

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
    var masterStr = '';
    var test;
    var test2;
    var tag;
    var newNode;
    var count = 0;
    var nodeList = [];
    

    var groupedNodesLength = groupedNodes.length;
    for(i = 0;i<groupedNodesLength && nodeList.length < ogo.limit;i++){

        masterStr = groupedNodes[i].map(elem => elem.data).join('');

        while((test = ogo.regex.exec(masterStr)) && test[0] !== '' && nodeList.length < ogo.limit){
            var lastRegIndex = ogo.regex.lastIndex;
            
            count++;

            var j = 0;
            var nodeParts = '' + groupedNodes[i][j].data;

            var testIndex = test.index;
            while(testIndex > nodeParts.length - 1){
                j++;
                nodeParts = nodeParts + groupedNodes[i][j].data;
            }

            ogo.regex.lastIndex = 0;

            test2 = ogo.regex.exec(groupedNodes[i][j].data);
            
            var inThisNode = nodeParts.substr(testIndex);

            test2 || (
                test2 = [], 
                test2[0] = inThisNode, 
                test2['index'] = groupedNodes[i][j].data.length - inThisNode.length, 
                test2['input'] = groupedNodes[i][j].data,
                test2['groups'] = undefined
            );
            
            var helpArr = [];

            helpArr.push(test2[0]);

            var sameMatchID = 0;
            nodeList.push([]);
            for(let k = 0 ; helpArr.join('').length < test[0].length ; k++){

                newNode = groupedNodes[i][j].splitText(groupedNodes[i][j].length - helpArr[k].length);
                tag = callback(helpArr[k], sameMatchID);
                newNode.data = '';
                insertedNode = newNode.parentNode.insertBefore(tag, newNode);
                nodeList[nodeList.length - 1].push(insertedNode);
                if(groupedNodes[i][j].data.length === 0){
                    groupedNodes[i][j] = insertedNode.firstChild;
                }else{
                    groupedNodes[i].splice(j + 1, 0, insertedNode.firstChild);
                    j++;
                }
                j++;
                sameMatchID++;
                helpArr.push(groupedNodes[i][j].data);
            }
            var lastNode = helpArr.pop();
            if(helpArr[0]){

                newNode = groupedNodes[i][j].splitText(0);
                tag = callback(lastNode.substr(0, test[0].length - helpArr.join('').length), -1);
                newNode.data = newNode.data.substr(test[0].length - helpArr.join('').length);
                insertedNode = newNode.parentNode.insertBefore(tag, newNode);
                nodeList[nodeList.length - 1].push(insertedNode);
                
                groupedNodes[i][j] = insertedNode.firstChild;
                if(newNode.data.length > 0){
                    groupedNodes[i].splice(j + 1, 0, newNode);
                }
                sameMatchID++;
            }else{
                newNode = groupedNodes[i][j].splitText(test2.index);
                
                tag = callback(test2[0], -1);
                newNode.data = newNode.data.substr(test2[0].length);
                insertedNode = newNode.parentNode.insertBefore(tag, newNode);

                nodeList[nodeList.length - 1].push(insertedNode);

                if(groupedNodes[i][j].data === ''){
                    if(newNode.data === ''){
                        groupedNodes[i].splice(j, 1, insertedNode.firstChild);
                    }else{
                        groupedNodes[i].splice(j, 1, insertedNode.firstChild, newNode);
                    }
                }else{
                    if(newNode.data === ''){
                        groupedNodes[i].splice(j + 1, 0, insertedNode.firstChild);
                    }else{
                        groupedNodes[i].splice(j + 1, 0, insertedNode.firstChild, newNode);
                    }
                }
            }
            nodeParts = '';
            ogo.regex.lastIndex = lastRegIndex;
        }
        ogo.regex.lastIndex = 0;
    }
    return {
        count,
        elements: nodeList
    };
}
function highlight(root, options, callback){
    let ogo = {
        regex: new RegExp(),
        excludes: [],
        limit: 1000,
        loose: false
    }
    if(options){
        Object.assign(ogo, options);
    }
    ogo.excludes = ['script', 'style', 'iframe', 'canvas', 'noscript'].concat(ogo.excludes);
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, function(node) {
        if(
            node.data.trim() === '' || 
            isDescendant(ogo.excludes, node)||
            // excludes.indexOf(node.parentNode.tagName.toLowerCase()) > -1 ||
            !node.parentElement.offsetParent
        ){
            return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
    });
    
    function isDescendant(tags, node){
        if(node !== document.body && tags.indexOf(node.parentNode.tagName.toLowerCase()) === -1){
            return isDescendant(tags, node.parentNode);
        }
        return node !== document.body;
    }

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
    var masterStr = '';
    var test;
    var test2;
    var tag;
    var newNode;
    var count = 0;
    var nodeList = [];
    var groupedData = groupedNodes.map(group => group.map(indiv => indiv.data));

    var groupedNodesLength = groupedNodes.length;
    for(i = 0;i<groupedNodesLength && nodeList.length < ogo.limit;i++){

        masterStr = groupedNodes[i].map(elem => elem.data).join('');

        while((test = ogo.regex.exec(masterStr)) && test[0] !== '' && nodeList.length < ogo.limit){
            var lastRegIndex = ogo.regex.lastIndex;
            
            count++;

            var j = 0;
            var nodeParts = '' + groupedData[i][j];

            var testIndex = test.index;
            while(testIndex > nodeParts.length - 1){
                j++;
                nodeParts = nodeParts + groupedData[i][j];
            }

            ogo.regex.lastIndex = 0;

            test2 = ogo.regex.exec(groupedData[i][j]);
            
            var inThisNode = nodeParts.substr(testIndex);

            test2 || (
                test2 = [], 
                test2[0] = inThisNode, 
                test2['index'] = groupedData[i][j].length - inThisNode.length, 
                test2['input'] = groupedData[i][j],
                test2['groups'] = undefined
            );
            
            var helpArr = [];

            helpArr.push(test2[0]);

            var sameMatchID = 0;
            nodeList.push([]);
            for(let k = 0 ; helpArr.join('').length < test[0].length ; k++){

                newNode = groupedNodes[i][j].splitText(groupedNodes[i][j].length - helpArr[k].length);

                tag = callback(helpArr[k], sameMatchID);
                newNode.data = '';
                insertedNode = newNode.parentNode.insertBefore(tag, newNode);
                nodeList[nodeList.length - 1].push(insertedNode);
                if(groupedNodes[i][j].data.length === 0){
                    groupedNodes[i][j] = insertedNode.firstChild;
                }else{
                    groupedNodes[i].splice(j + 1, 0, insertedNode.firstChild);
                    j++;
                }
                groupedData[i] = groupedNodes[i].map(indiv => indiv.data); // maybe
                j++;
                sameMatchID++;
                helpArr.push(groupedNodes[i][j].data);
            }
            var lastNode = helpArr.pop();
            if(helpArr[0]){

                newNode = groupedNodes[i][j].splitText(0);
                tag = callback(lastNode.substr(0, test[0].length - helpArr.join('').length), -1);
                newNode.data = newNode.data.substr(test[0].length - helpArr.join('').length);
                insertedNode = newNode.parentNode.insertBefore(tag, newNode);
                nodeList[nodeList.length - 1].push(insertedNode);
                
                groupedNodes[i][j] = insertedNode.firstChild;
                if(newNode.data.length > 0){
                    groupedNodes[i].splice(j + 1, 0, newNode);
                }
                groupedData[i] = groupedNodes[i].map(indiv => indiv.data); // maybe
                sameMatchID++;
            }else{
                newNode = groupedNodes[i][j].splitText(test2.index);
                
                tag = callback(test2[0], -1);
                newNode.data = newNode.data.substr(test2[0].length);
                insertedNode = newNode.parentNode.insertBefore(tag, newNode);

                nodeList[nodeList.length - 1].push(insertedNode);

                if(groupedNodes[i][j].data === ''){
                    if(newNode.data === ''){
                        groupedNodes[i].splice(j, 1, insertedNode.firstChild);
                    }else{
                        groupedNodes[i].splice(j, 1, insertedNode.firstChild, newNode);
                    }
                }else{
                    if(newNode.data === ''){
                        groupedNodes[i].splice(j + 1, 0, insertedNode.firstChild);
                    }else{
                        groupedNodes[i].splice(j + 1, 0, insertedNode.firstChild, newNode);
                    }
                }
                groupedData[i] = groupedNodes[i].map(indiv => indiv.data); // maybe
            }
            nodeParts = '';
            ogo.regex.lastIndex = lastRegIndex;
        }
        ogo.regex.lastIndex = 0;
    }
    return {
        count,
        elements: nodeList
    };
}

