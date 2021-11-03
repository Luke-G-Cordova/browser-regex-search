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

let dist = levenshteinDist('Token sad', 'ajaToken sadfe', true);
console.log(dist);


function levenshteinDist(search, test, ratio_calc = false){
    let rows = search.length + 1;
    let cols = test.length + 1;
    let distance = new Array(rows);
    
    // setup initial matrix
    for(let i = 0;i<rows;i++){
        distance[i] = new Array(cols).fill(0, 0, cols);
    }
    for(let i = 0;i<distance.length;i++){
        distance[i][0] = i;
        for(let k = 0;k<distance[i].length;k++){
            distance[0][k] = k;
        }
    }
    
    // preform levenshtein algorithm on matrix
    let cost;
    for(let i = 1;i<rows;i++){
        for(let k = 1;k<cols;k++){
            if(search[i-1] === test[k-1]){
                cost = 0;
            }else if(ratio_calc){
                cost = 2;
            }else{
                cost = 1;
            }
            distance[i][k] = Math.min(
                distance[i-1][k] + 1, 
                distance[i][k-1] + 1,
                distance[i-1][k-1] + cost
            );
        }
    }


    let indexes = [];
    for(let i = 1;i<distance[rows-1].length-1;i++){
        if((indexes.length%2===0 && distance[rows-1][i]<distance[rows-1][i-1])){
            indexes.push(distance[rows-1][i]);
        }else if((indexes.length%2!==0 && distance[rows-1][i]>distance[rows-1][i-1])){
            indexes.push(distance[rows-1][i-1]);
        }
        console.log(distance[rows-1][i]);
    }
    console.log(indexes);
    console.log(test.substring(Math.min(...indexes)-1, Math.max(...indexes)+2));
    if(ratio_calc){
        return ((search.length + test.length) - distance[rows-1][cols-1]) / (search.length + test.length)
    }else{
        return distance[rows-1][cols-1];
    }
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

    var groupedNodesLength = groupedNodes.length;
    for(i = 0;i<groupedNodesLength && nodeList.length < ogo.limit;i++){

        masterStr = groupedNodes[i].map(elem => elem.data).join('');
        let mReg = ogo.regex.toString();
        mReg = mReg.substring(mReg.indexOf('/') + 1, mReg.lastIndexOf('/'));
        let close = levenshteinDist(mReg, masterStr, true);
        console.log(close);


        while(
            (
                (test = ogo.regex.exec(masterStr)) && 
                test[0] !== ''
            ) && 
            nodeList.length < ogo.limit
        ){
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
