

// This file contains functions for: 
//     - selecting new current matches, 
//     - styling new current matches, 
//     - styling old current matches, 
//     - scrolling to new current matches on the y axis
//     - scrolling to new current matches on the x axis

/**
 * 
 * @param {Array} elements an array of selected elements
 * @param {Number} cIndex a number indicating the current index
 * @param {Object} options an optional object that allows for options
 * @param {options} direction either 1 or -1 to indicate direction. Default: 1
 * @param {options} newStyles styles to add to the new current selection. Default: {}
 * @param {options} oldStyles styles to add to the old current selection. Default: {}
 * @param {options} scrollBehavior values are 'smooth', 'auto' to indicate scrolling behavior. Default: 'smooth'
 * @returns the index of the new current selection within the array
 */
function nextMatch(elements, cIndex, options){

    const regCurrent = /(^|\s)current(\s|$)/;
    const current = ' current';

    var ogo = {
        direction: 1,
        newStyles: {},
        oldStyles:{},
        scrollBehavior: '',
        scrollable: true
    };
    if(options){Object.assign(ogo, options);}

    //loop through the old current selection of elements and apply the old styles
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

    //edge detection, wrap if we hit an edge
    if(!elements[cIndex + ogo.direction]){
        if(ogo.direction > 0){
            cIndex = 0;
        } else {
            cIndex = elements.length - 1;
        }
    } else{
        cIndex += ogo.direction;
    }
    // loop through the new current selection of elements and apply the new styles
    for(let i in elements[cIndex]){
        if(!regCurrent.test(elements[cIndex][i].className)){
            elements[cIndex][i].className += current;
            if(!!ogo.newStyles){
                for(let sty in ogo.newStyles){
                    elements[cIndex][i].style[sty] = ogo.newStyles[sty];
                }
            }
            // scroll to the new current selection so that it is in view
            if(ogo.scrollable) goto(elements[cIndex][i], {scrollBehavior: ogo.scrollBehavior});
        }
    }
    return cIndex;
}

/**
 * 
 * @param {dom element} elem a dom element that should be scrolled to view
 * @param {Object} options an optional options object
 * @param {options} scrollBehavior the scroll behavior. Default: 'smooth'
 */
function goto(elem, options){
    var ogo = {
        scrollBehavior: 'smooth'
    }
    if(options){
        let scbs = ['smooth', 'auto'];
        if(scbs.indexOf(options.scrollBehavior) === -1)options.scrollBehavior = 'smooth'
        Object.assign(ogo, options);
    }

    // scObj is either null or an Object that looks like
    // {
    //      element: dom element - the closest ancestor of elem that can scroll in some direction , 
    //      bScroll: boolean - true if there is only one word for the overflow css style of 
    //                  element and it is not 'hidden', 'visible', or '', 
    //      xScroll: boolean - true if the overflow-x css style of element is not 
    //                  'hidden', 'visible', or '',
    //      yScroll: boolean - true if the overflow-y css style of element is not
    //                  'hidden', 'visible', or ''
    // }
    var scObj = scrollable(elem);

    var bodyCoords = document.body.getBoundingClientRect();
    var elemCoords = !!scObj ? scObj.element.getBoundingClientRect() : elem.getBoundingClientRect();

    // scElem is for if scObj is not null and stores scObj.element
    var scElem;

    // scCoords = elem.getBoundingClientRect() if elemCoords isnt already
    var scCoords;

    // scElemH = height of scElem
    var scElemH;
    // scElemW = width of scElem
    var scElemW;

    // if there is an ancestor to elem that is scrollable 
    // and is not the body, then set relevant variables
    if(!!scObj){
        scElem = scObj.element;
        scCoords = elem.getBoundingClientRect();

        scElemH = window.getComputedStyle(scElem, null).getPropertyValue('height');
        scElemH = scElemH === '' ? scElemH : Number(scElemH.substr(0, scElemH.length-2));

        scElemW = window.getComputedStyle(scElem, null).getPropertyValue('width');
        scElemW = scElemW === '' ? scElemW : Number(scElemW.substr(0, scElemW.length-2));
    }

    // if the element that should be in view  
    // is out of view, scroll to the element
    // --- TODO --- this statement does not account for if 
    // --- TODO ---     the body can scroll on the x axis yet
    if(elemCoords.top < 0|| elemCoords.bottom > window.innerHeight){
        window.scroll({
            top:  (elemCoords.top - bodyCoords.top) - (window.innerHeight/2.5),
            behavior: ogo.scrollBehavior
        });
    }

    // if the element is not in view of its scrollable parent element 
    // scroll the parent element so that it is in view.
    // Keep in mind this statement checks if both axises are scrollable
    // according to the scObj.bScroll first and if they are not it then
    // scrolls individually.
    if(
        !!scObj && !!scObj.bScroll && (
            (scCoords.top < 0 || scCoords.bottom > scElemH + elemCoords.top)||
            (scCoords.left < 0 || scCoords.right > scElemW + elemCoords.left)
        )
    ){
        scElem.scroll({
            top:  (scCoords.top - elemCoords.top + scElem.scrollTop) - (scElemH/2),
            left: (scCoords.left - elemCoords.left + scElem.scrollLeft) - (scElemW/2),
            behavior: ogo.scrollBehavior
        });
    }else{
        if(!!scObj && !!scObj.yScroll && (scCoords.top < 0 || scCoords.bottom > scElemH + elemCoords.top)){
            scElem.scroll({
                top:  (scCoords.top - elemCoords.top + scElem.scrollTop) - (scElemH/2),
                behavior: ogo.scrollBehavior
            });
        }
        if(!!scObj && !!scObj.xScroll && (scCoords.left < 0 || scCoords.right > scElemW + elemCoords.left)){
            scElem.scroll({
                left: (scCoords.left - elemCoords.left + scElem.scrollLeft) - (scElemW/2),
                behavior: ogo.scrollBehavior
            });
        }
    } 
}

/**
 * 
 * @param {dom element} elem a dom element that could be the child of a scrollable element
 * @returns {Object} {
 *       element: dom element - the closest ancestor of elem that can scroll in some direction , 
 *       bScroll: boolean - true if there is only one word for the overflow css style of 
 *                   element and it is not 'hidden', 'visible', or '', 
 *       xScroll: boolean - true if the overflow-x css style of element is not 
 *                   'hidden', 'visible', or '',
 *       yScroll: boolean - true if the overflow-y css style of element is not
 *                   'hidden', 'visible', or ''
 *   }
 */
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
