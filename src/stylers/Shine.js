window.addEventListener('load', () => {
    // let link1 = document.createElement('link');
    // link1.rel = 'preconnect';
    // link1.href = 'https://fonts.googleapis.com';

    // let link2 = document.createElement('link');
    // link2.rel = 'preconnect';
    // link2.href = 'https://fonts.gstatic.com';
    // link2.crossOrigin = true;

    // let link3 = document.createElement('link');
    // link3.rel = 'stylesheet';
    // link3.href = 'https://fonts.googleapis.com/css2?family=Chango&display=swap';
    // document.head.appendChild(link1);
    // document.head.appendChild(link2);
    // document.head.appendChild(link3);
    
});


class Shine {
    constructor(elem, options){
        let ogo = {
            bubble: true, 
            tiny: false,
            overrideArgs: null
        }
        Object.assign(ogo, options);
        this.bShadow = '';
        this.args = [elem, ogo];
        let resizeMe = new ResizeObserver((e) => {
            this.reHighlight();
        });
        resizeMe.observe(elem);
    }
    reHighlight(){
        let [elem, ogo] = this.args;
        let elemBackgroundColor = window.getComputedStyle(elem, null).getPropertyValue('background-color');
        
        let minBubHeight = window.getComputedStyle(elem, null).getPropertyValue('border-radius');
        
        minBubHeight = Number(minBubHeight.substr(0, minBubHeight.length - 2)) * 3;
        
        let [highlightSize, minHeight, bSizeW, bSizeH] = (ogo.overrideArgs) || (ogo.tiny?[2, 20, 1, 4]:[4, 50, 5, 8]);

        let hOffset = elem.clientHeight - elem.clientWidth + minHeight;
        hOffset = hOffset < minBubHeight ? minBubHeight : hOffset;
        
        // elem.style.minHeight || (elem.style.minHeight = minBubHeight+10+'px');
        
        let bub = ogo.bubble?
            `,inset ${bSizeW}px ${bSizeH}px 0 ${elemBackgroundColor}`+
            `,inset -${bSizeW}px ${bSizeH}px 0 ${elemBackgroundColor}`+
            `,inset -${bSizeW}px -${elem.clientHeight - hOffset}px 0 ${elemBackgroundColor}`+
            `,inset ${bSizeW}px -${elem.clientHeight - hOffset}px 0 ${elemBackgroundColor}`+
            `,inset 10px 10px 0 ${elem.clientHeight / 2}px rgba(255,255,255,.4)`
            :
            ''
        ;
        elem.style.boxShadow = 
            `inset 0 ${highlightSize}px 0 rgba(255,255,255,.5),inset 0 -${highlightSize}px 0 rgba(0,0,0,.3)${bub}`;
        this.bShadow = elem.style.boxShadow;
        return elem;
    }
    updateStyles(styles){
        let [elem] = this.args;
        for(let sty in styles) {
            elem.style[sty] = styles[sty]
        }
    }
    static updateStyles(elem, styles){
        for(let sty in styles) {
            elem.style[sty] = styles[sty]
        }
    }
    addNewBoxShadow(callback){
        let [elem] = this.args;
        if(typeof arguments[0] !== 'undefined'){
            elem.style.boxShadow = callback(this.bShadow);
        }
        return elem.style.boxShadow;
    }
}