// http://blog.alexanderdickson.com/javascript-replacing-text

var matchText = function(node, regex, callback, excludeElements) {
    excludeElements || (excludeElements = ['script', 'style', 'iframe', 'canvas']);
    var child = node.firstChild;
    do {
        switch (child.nodeType) {
        case 1:
            if (excludeElements.indexOf(child.tagName.toLowerCase()) > -1) {
                continue;
            }
            matchText(child, regex, callback, excludeElements);
            break;
        case 3:
           child.data.replace(regex, function(all) {
                var args = [].slice.call(arguments),
                    offset = args[args.length - 2],
                    newTextNode = child.splitText(offset);
                newTextNode.data = newTextNode.data.substr(all.length);
                callback.apply(window, [child].concat(args));
                child = newTextNode;
            });
            break;
        }
    } while (child = child.nextSibling);
    return node;
}
console.log(matchText(document.body, new RegExp("the", "ig"), function(node, match, offset) {
    var span = document.createElement("span");
    span.className = "highlight-me";
    span.textContent = match;
    node.parentNode.insertBefore(span, node.nextSibling); 
}));