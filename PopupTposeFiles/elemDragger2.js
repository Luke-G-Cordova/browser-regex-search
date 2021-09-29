
function dragPopup(elem, options) {
    var ogo = {
        noDragElems: []
    };
    for(let op in options){
        ogo[op] = options[op];
    }
    var startX, startY, endX, endY;
    var wHalf = window.innerWidth/2;
    var hHalf = window.innerHeight/2;
    var draggable = 1;
    var noDragElems = [].slice.call(ogo.noDragElems);

    var border = window.getComputedStyle(elem, null).getPropertyValue('border-radius'); 
    border = Number(border.substr(0, border.length - 2));
    
    if(noDragElems.length !== 0){
        noDragElems.forEach((ndElem) =>{
            ndElem.onmouseover = (e) => {
                draggable--;
            }
            ndElem.onmouseout = (e) => {
                draggable++;
            }
        });
    }
    elem.onmousedown = (e) => {
        if(draggable){
            wHalf = window.innerWidth/2;
            hHalf = window.innerWidth/2;
            startX = e.clientX;
            startY = e.clientY;
            
        }
    }
}