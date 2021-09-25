
// this file needs some maintnance
let bShadow = '';

function scale(num, inMin, inMax, outMin, outMax){
    return (num - inMin)*(outMax-outMin)/(inMax-inMin)+outMin;
}
function addHighlights(elem, options){
    var ogo = {
        resizeable: true, 
        bubble: true, 
        tiny: false,
        // overrideArgs is an integer array of length 4
        // first value is the size of the top and bottom highlight
        // second value is the min height of the bubble
        // third value is the left and right padding of the bubble
        // forth value is the top padding of the bubble
        overrideArgs: null
    }
    for(op in options){
        ogo[op] = options[op];
    }
    let args = ogo.overrideArgs;
    console.log(args);
    function reHighlight(){
        let elemBackgroundColor = window.getComputedStyle(elem, null).getPropertyValue('background-color');
        
        let minBubHeight = window.getComputedStyle(elem, null).getPropertyValue('border-radius');
        minBubHeight = Number(minBubHeight.substr(0, minBubHeight.length - 2)) * 3;

        let [highlightSize, minHeight, bSizeW, bSizeH] = (args) || (ogo.tiny?[2, 20, 1, 4]:[4, 50, 5, 8]);

        let hOffset = elem.clientHeight - elem.clientWidth + minHeight;
        hOffset = hOffset < minBubHeight ? minBubHeight : hOffset;
        
        elem.style.minHeight || (elem.style.minHeight = minBubHeight+10+'px');

        let bub = ogo.bubble?
            `,inset ${bSizeW}px ${bSizeH}px 0 ${elemBackgroundColor},inset -${bSizeW}px ${bSizeH}px 0 ${elemBackgroundColor},inset -${bSizeW}px -${elem.clientHeight - hOffset}px 0 ${elemBackgroundColor},inset ${bSizeW}px -${elem.clientHeight - hOffset}px 0 ${elemBackgroundColor},inset 10px 10px 0 ${elem.clientHeight / 2}px rgba(255,255,255,.4)`
            :
            ''
        ;
        elem.style.boxShadow = 
            `inset 0 ${highlightSize}px 0 rgba(255,255,255,.5),inset 0 -${highlightSize}px 0 rgba(0,0,0,.3)${bub}`;
        bShadow = elem.style.boxShadow;
    }
    reHighlight();
    
    if(ogo.resizeable){
        let resizeMe = new ResizeObserver((e) => {
            reHighlight(e[0].target);
        });
        resizeMe.observe(elem);
    }
    return elem;
}
function addNewBoxShadow(elem, shadow){
    elem.style.boxShadow = bShadow + ', ' + shadow;
}

function updateStyles(elem, styles){
    for(sty in styles) {
        elem.style[sty] = styles[sty]
    }
}
// addHighlights(document.querySelector('regeggs-card'), {resizeable: true});




