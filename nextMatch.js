



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
        scPar = scrollable(elem);
    ;
    if(!!scPar){
        let eos2 = eos;
        eos = scPar.getBoundingClientRect();
        let wh2 = window.getComputedStyle(scPar, null).getPropertyValue('height');
        wh2 = Number(wh2.substr(0, wh2.length-2));
        
        if(eos2.top + scPar.scrollTop < 0 || eos2.bottom + scPar.scrollTop > wh2){
            scPar.scroll({
                top:  (eos2.top - eos.top + scPar.scrollTop) - (wh2/2),
                behavior: ogo.scrollBehavior
            });
        }
        
    }
    if(eos.top < 0|| eos.bottom > wh){
        window.scroll({
            top:  (eos.top - dos.top) - (wh/2.5),
            behavior: ogo.scrollBehavior
        });
    }
}

function scrollable(elem){
    const noScroll = ['hidden', 'visible', ''];
    while(elem!==document.body){
        console.log(elem);
        if(
            (
                noScroll.indexOf(window.getComputedStyle(elem, null).getPropertyValue('overflow')) === -1 ||
                noScroll.indexOf(window.getComputedStyle(elem, null).getPropertyValue('overflow-y')) === -1 /*|| 
                noScroll.indexOf(window.getComputedStyle(elem, null).getPropertyValue('overflow-x')) !== -1 */
            )/*&&(
                elem.scrollHeight > elem.clientHeight || 
                elem.scrollWidth > elem.clientWidth 
            )*/
        ){
            return elem;
        }
        elem = elem.parentElement;
    }
    return null;
}