

function scale(num, inMin, inMax, outMin, outMax){
    return (num - inMin)*(outMax-outMin)/(inMax-inMin)+outMin;
}
function addHighlights(elem, options = {resizeable: true}){
    

    function reHighlight(){
        let elemBackgroundColor = window.getComputedStyle(elem, null).getPropertyValue('background-color');
        
        let minBubHeight = window.getComputedStyle(elem, null).getPropertyValue('border-radius');
        minBubHeight = Number(minBubHeight.substr(0, minBubHeight.length - 2)) * 3;

        let hOffset = elem.clientHeight - elem.clientWidth + 50;
        hOffset = hOffset<minBubHeight?minBubHeight:hOffset;
        
        elem.style.minHeight = minBubHeight+10+'px';
        elem.style.boxShadow = 
            `inset 0 4px 0 rgba(255,255,255,.5), 
            inset 0 -4px 0 rgba(0,0,0,.3),
            inset 5px 8px 0 ${elemBackgroundColor}, 
            inset -5px 8px 0 ${elemBackgroundColor}, 
            inset -5px -${elem.clientHeight - hOffset}px 0 ${elemBackgroundColor}, 
            inset 5px -${elem.clientHeight - hOffset}px 0 ${elemBackgroundColor}, 
            inset 10px 10px 0 ${elem.clientHeight / 2}px rgba(255,255,255,.4)`;
    }

    reHighlight();


    if(options.resizeable){
        let resizeMe = new ResizeObserver((e) => {
            reHighlight(e[0].target);
        });
        resizeMe.observe(elem);
    }
    return elem;
}

addHighlights(document.querySelector('regeggs-card'), {resizeable: true});




