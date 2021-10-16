



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
    var scParAll = scrollable(elem);
    var dos = document.body.getBoundingClientRect();
    var eos = elem.getBoundingClientRect();
    var scParElem;
    var eos2;
    var sHeight;
    var sWidth;
    if(!!scParAll){
        scParElem = scParAll.element;
        eos = scParElem.getBoundingClientRect()
        eos2 = elem.getBoundingClientRect();

        sHeight = window.getComputedStyle(scParElem, null).getPropertyValue('height');
        sHeight = sHeight === '' ? sHeight : Number(sHeight.substr(0, sHeight.length-2));

        sWidth = window.getComputedStyle(scParElem, null).getPropertyValue('width');
        sWidth = sWidth === '' ? sWidth : Number(sWidth.substr(0, sWidth.length-2));
    }
    if(eos.top < 0|| eos.bottom > window.innerHeight){
        window.scroll({
            top:  (eos.top - dos.top) - (window.innerHeight/2.5),
            behavior: ogo.scrollBehavior
        });
    }
    if(
        !!scParAll && !!scParAll.bScroll && (
            (eos2.top < 0 || eos2.bottom > sHeight + eos.top)||
            (eos2.left < 0 || eos2.right > sWidth + eos.left)
        )
    ){
        scParElem.scroll({
            top:  (eos2.top - eos.top + scParElem.scrollTop) - (sHeight/2),
            left: (eos2.left - eos.left + scParElem.scrollLeft) - (sWidth/2),
            behavior: ogo.scrollBehavior
        });
    }else{
        if(!!scParAll && !!scParAll.yScroll && (eos2.top < 0 || eos2.bottom > sHeight + eos.top)){
            scParElem.scroll({
                top:  (eos2.top - eos.top + scParElem.scrollTop) - (sHeight/2),
                behavior: ogo.scrollBehavior
            });
        }
        if(!!scParAll && !!scParAll.xScroll && (eos2.left < 0 || eos2.right > sWidth + eos.left)){
            scParElem.scroll({
                left: (eos2.left - eos.left + scParElem.scrollLeft) - (sWidth/2),
                behavior: ogo.scrollBehavior
            });
        }
    } 
}

function scrollable(elem){
    const noScroll = ['hidden', 'visible', ''];
    while(elem!==document.body){
        let [xScroll, yScroll] = window.getComputedStyle(elem, null).getPropertyValue('overflow').split(' ');
        let bScroll = (!!xScroll && noScroll.indexOf(xScroll) === -1) && !yScroll;
        if(
            (xScroll = (!!xScroll && noScroll.indexOf(xScroll) === -1))||
            (yScroll = (!!yScroll && noScroll.indexOf(yScroll) === -1))
        ){
            return {
                element: elem, 
                bScroll, 
                xScroll, 
                yScroll
            };
        }
        elem = elem.parentElement;
    }
    return null;
}


function scrollablexxx(elem){
    const noScroll = ['hidden', 'visible', ''];
    while(elem!==document.body){
        if(
            (
                noScroll.indexOf(window.getComputedStyle(elem, null).getPropertyValue('overflow')) === -1 ||
                noScroll.indexOf(window.getComputedStyle(elem, null).getPropertyValue('overflow-y')) === -1 /*|| 
                noScroll.indexOf(window.getComputedStyle(elem, null).getPropertyValue('overflow-x')) !== -1*/ 
            )/*&&(
                elem.scrollHeight > elem.clientHeight || 
                elem.scrollWidth > elem.clientWidth 
            )*/
        ){
            console.log(window.getComputedStyle(elem, null).getPropertyValue('overflow').split(' '));
            console.log(window.getComputedStyle(elem, null).getPropertyValue('overflow-y'));
            return elem;
        }
        elem = elem.parentElement;
    }
    return null;
}