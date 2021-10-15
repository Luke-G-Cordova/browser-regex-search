



function nextMatch(elements, cIndex, options){
    var ogo = {
        direction: 1,
        newStyles: {},
        oldStyles:{},
        scrollBehavior: ''
    }
    if(options){
        Object.assign(ogo, options);
    }
    const regCurrent = /(^|\s)current(\s|$)/;
    const current = ' current';
    for(let i in elements[cIndex]){
        if(regCurrent.test(elements[cIndex][i].className)){
            elements[cIndex][i].className = elements[cIndex][i].className.replace(regCurrent, '');
            if(!!ogo.oldStyles){
                for(let sty in ogo.oldStyles){
                    elements[cIndex][i].style[sty] = ogo.oldStyles[sty];
                }
            }
        }
    }
    if(!elements[cIndex + ogo.direction]){
        if(ogo.direction > 0){
            cIndex = 0;
        } else {
            cIndex = elements.length - 1;
        }
    } else{
        cIndex += ogo.direction;
    }
    for(let i in elements[cIndex]){
        if(!regCurrent.test(elements[cIndex][i].className)){
            elements[cIndex][i].className += current;
            if(!!ogo.newStyles){
                for(let sty in ogo.newStyles){
                    elements[cIndex][i].style[sty] = ogo.newStyles[sty];
                }
            }
            goto(elements[cIndex][i], {scrollBehavior: ogo.scrollBehavior});
        }
    }
    return cIndex;
}
function goto(elem, options){
    var ogo = {
        scrollBehavior: 'smooth'
    }
    if(options){
        let scbs = ['smooth', 'auto'];
        if(scbs.indexOf(options.scrollBehavior) === -1)options.scrollBehavior = 'smooth'
        Object.assign(ogo, options);
    }
    var eos = elem.getBoundingClientRect(),
        dos = document.body.getBoundingClientRect(),
        wh = window.innerHeight,
        buffer = 20
    ;
    if(eos.top < 0 + buffer || eos.top > wh - buffer){
        window.scroll({
            top:  (eos.top - dos.top) - (wh/2.5),
            behavior: ogo.scrollBehavior
        });
    }
}