
// this file needs some maintnance
window.addEventListener('load', () => {
    let link1 = document.createElement('link');
    link1.rel = 'preconnect';
    link1.href = 'https://fonts.googleapis.com';

    let link2 = document.createElement('link');
    link2.rel = 'preconnect';
    link2.href = 'https://fonts.gstatic.com';
    link2.crossOrigin = true;

    let link3 = document.createElement('link');
    link3.rel = 'stylesheet';
    link3.href = 'https://fonts.googleapis.com/css2?family=Chango&display=swap';
    document.head.appendChild(link1);
    document.head.appendChild(link2);
    document.head.appendChild(link3);
//     <link rel="preconnect" href="https://fonts.googleapis.com">
// <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
// <link href="https://fonts.googleapis.com/css2?family=Chango&display=swap" rel="stylesheet"></link>
});
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
            reHighlight();
        });
        resizeMe.observe(elem);
    }
    return elem;
}
function addNewBoxShadow(elem, callback){
    if(typeof arguments[1] !== 'undefined'){
        elem.style.boxShadow = callback(bShadow);
    }
}

function updateStyles(elem, styles){
    for(sty in styles) {
        elem.style[sty] = styles[sty]
    }
}
// addHighlights(document.querySelector('regeggs-card'), {resizeable: true});




