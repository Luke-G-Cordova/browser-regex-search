// http://blog.alexanderdickson.com/javascript-replacing-text


// matchText(document.body, new RegExp("the", "ig"), function(node, match, offset) {
//     var span = document.createElement("span");
//     span.className = "highlight-me";
//     span.textContent = match;
//     return span;
// });
function matchText(node, regex, callback, excludeElements) { 
    excludeElements || (excludeElements = ['script', 'style', 'iframe', 'canvas']);
    var child = node.firstChild;
    while (child) {
        
        switch (child.nodeType) {
        case 1:
            if (excludeElements.indexOf(child.tagName.toLowerCase()) > -1)
                break;
            matchText(child, regex, callback, excludeElements);
            break;
        case 3:
            var bk = 0;
            if(child.data.trim() !== ''){
                // changing the function(all) to a => function 
                // changes the scope of arguments to the parent 
                // functions parameters
                console.log(child);
                console.log(child.data);
                child.data.replace(regex, function(match) {
                    
                    var tag;

                    // copy the replace() parameters to an array
                    var args = [].slice.call(arguments);

                    // store the index of where the match was found
                    // in the string tested against
                    // .replace(match, p1, p2, ..., offset, string)
                    var offset = args[args.length - 2];

    // replace with new tag starts here ------------------------------------------------------
                    // split the node into 2 text nodes right before the
                    // start of the matched string
                    var newTextNode = child.splitText(offset+bk);
                    
                    // subtract the length of the original node text 
                    bk -= child.data.length + match.length;

                    // take out the matched text from the new text node;
                    newTextNode.data = newTextNode.data.substr(match.length);

                    // call the callback function to get the tag and store it
                    // in tag. .apply() calls the function, replaces its this
                    // variable with window, and passes the [child].concat(args)
                    // array as paramaters
                    tag = callback.apply(window, [child].concat(args));

                    // insert tag right before the newTextNode, which is 
                    // a child node of parentNode
                    child.parentNode.insertBefore(tag, newTextNode);
    // replace with new tag ends here -------------------------------------------------------
                    child.parentNode.normalize();
                    // set child to newTextNode
                    child = newTextNode;
                });
                console.log(child.data);
                regex.lastIndex = 0;

                // nextSib = child.previousSibling;
                // regex.lastIndex = 0;
            }

            break;
        }
        child = child.nextSibling;
    }
    return node;
};

highlight(document.body, new RegExp('the', 'ig'), function(match){
    var span = document.createElement("span");
    span.className = "highlight-me";
    span.textContent = match;
    return span;
});



function highlight(root, regex, callback, excludes){
    excludes || (excludes = ['script', 'style', 'iframe', 'canvas']);

    
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var currentNode = tw.currentNode;
    function myNextNode(){
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

    var futureNode;
    var str = '';
    var test;
    var tag;
    while(
        (currentNode = tw.nextNode()) && 
        (currentNode = excludes.indexOf(currentNode.parentNode.tagName.toLowerCase()) > -1 ? tw.nextNode() : currentNode)
    ){
        
        if(test = regex.exec(currentNode.data)){
            var newNode = currentNode.splitText(test.index);
            newNode.data = newNode.data.substr(test[0].length);
            tag = callback(test[0]);
            currentNode.parentNode.insertBefore(tag, newNode);
        }
        if(futureNode = myNextNode()){
            str = currentNode.data + futureNode.data;
            // console.log(regex.exec(str));
            console.log(str);
        }

        str = currentNode.data;
    }
}





function edges1(child, regex, callback){
    let tw = document.createTreeWalker(child, NodeFilter.SHOW_TEXT);
    let currentNode = tw.currentNode;
    currentNode = tw.nextNode();
    let previousNode = currentNode;
    let str = currentNode.data.trim();
    let nodeIndexes = [];
    let lastIndex = 0;
    let test;
    while(currentNode){

        regex.lastIndex = 0;
        nodeIndexes.push([currentNode, str.length]);

        
        while(test = regex.exec(str)){
            var newNode = previousNode.splitText(test.index);
            newNode.data = newNode.data.substr(test[0].length);
            str = newNode.data;
            var args = [newNode, test[0], 0];
            var tag = callback.apply(window, args);
            previousNode.parentNode.insertBefore(tag, newNode);
            previousNode = newNode;
        }
        
        regex.lastIndex = 0;
        
        if(currentNode.data.indexOf('\n') !== -1){
            currentNode.data = currentNode.data.trim();
        }
        str += currentNode.data;

        if(test = regex.exec(str)){
            var ogPrevData = '';
            if(previousNode.data.trim() !== ''){
                var newPrevNode = previousNode.splitText(test.index);
                ogPrevData = newPrevNode.data
                var prevArgs = [previousNode, ogPrevData, 0];
                newPrevNode.data = '';
                var prevTag = callback.apply(window, prevArgs);
                previousNode.parentNode.insertBefore(prevTag, newPrevNode);
            }
            var of = test[0].length - ogPrevData.length;
            of = of < 0 ? of * -1 : of ;
            previousNode = currentNode.splitText(of);
            var newCurNode = currentNode;
            var ogCurData = newCurNode.data;
            var curArgs = [newCurNode, ogCurData, 0];
            newCurNode.data = '';
            var curTag = callback.apply(window, curArgs);
            currentNode.parentNode.insertBefore(curTag, newCurNode);

            currentNode = tw.nextNode();
        }else{
            previousNode = currentNode;
        }
        str = currentNode.data;
        currentNode = tw.nextNode();
    }

    // console.log(window.getComputedStyle(child, '').display);
    // console.log(child);
    // console.log(child.childNodes);
}

