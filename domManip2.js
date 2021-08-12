// http://blog.alexanderdickson.com/javascript-replacing-text

var matchText = function(node, regex, callback, excludeElements) { 

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
            
            // changing the function(all) to a => function 
            // changes the scope of arguments to the parent 
            // functions parameters
            child.data.replace(regex, function(match) {

                var tag;
                // copy the replace() parameters to an array
                var args = [].slice.call(arguments);
                // store the index of where the match was found
                // in the string tested against
                // .replace(match, p1, p2, ..., offset, string)
                var offset = args[args.length - 2];
                // split the node into 2 text nodes right before the
                // start of the matched string
// replace with new tag starts here ------------------------------------------------------
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
                // set child to newTextNode
                child = newTextNode;
            });
            regex.lastIndex = 0;
            break;
        }

        child = child.nextSibling;
    }

    return node;
};

console.log(matchText(document.body, new RegExp("the", "ig"), function(node, match, offset) {
    var span = document.createElement("span");
    span.className = "highlight-me";
    span.textContent = match;
    return span;
}));

