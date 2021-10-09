

function isDescendant(tags, node){
    if(node !== document.body && tags.indexOf(node.parentNode.tagName.toLowerCase()) === -1){
        return isDescendant(tags, node.parentNode);
    }
    return node !== document.body;
}

console.log(isDescendant(['regeggs-card'], document.querySelector('p').childNodes[0]));