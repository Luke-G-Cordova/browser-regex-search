

function dragPopup(elem, options) {
    var ogo = {
        noDragElems: [],
        Shine: null
    };
    for(let op in options){
        ogo[op] = options[op];
    }
    var startX, startY, endX, endY;
    var wHalf = window.innerWidth/2;
    var hHalf = window.innerHeight/2;
    var prevWinY = window.scrollY;
    var prevWinX = window.scrollX;
    var draggable = 1;
    var noDragElems = [].slice.call(ogo.noDragElems);
    var border = window.getComputedStyle(elem, null).getPropertyValue('border-left-width'); 
    border = Number(border.substr(0, border.length - 2)) + 20;
    
    
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
        if(draggable!==0){
            wHalf = window.innerWidth/2;
            hHalf = window.innerWidth/2;
            startX = e.clientX;
            startY = e.clientY;
            document.onmouseup = (ev) => {
                ev.preventDefault();
                document.onmouseup = null;
                document.onmousemove = null;
            };
            document.onmousemove = (ev) => {
                endX = ev.clientX;
                endY = ev.clientY;
                elem.style.left = elem.offsetLeft + (endX - startX) + 'px';
                elem.style.top = elem.offsetTop + (endY - startY) + 'px';

                shadowRelativeToVisible();

                if(elem.offsetLeft + elem.clientWidth + border > window.innerWidth + window.scrollX){
                    elem.style.left = window.innerWidth - elem.clientWidth - border + 'px';
                }else if(elem.offsetLeft < 0){
                    elem.style.left = 0 + 'px';
                }else{
                    startX = ev.clientX;
                }

                if(elem.offsetTop + elem.clientHeight + border > window.innerHeight + window.scrollY){
                    elem.style.top = window.innerHeight + window.scrollY - elem.clientHeight - border + 'px';
                }else if(elem.offsetTop < 0 + window.scrollY){
                    elem.style.top = 0 + window.scrollY + 'px';
                }else{ 
                    startY = ev.clientY;
                }
            };
        }
    }
    
    document.onscroll = (e) => {
        // console.log(window.scrollY);
        // console.log(elem.offsetTop);
        elem.style.top = elem.offsetTop + window.scrollY - prevWinY + 'px';
        elem.style.left = elem.offsetLeft + window.scrollX - prevWinX + 'px';
        // elem.style.top = elem.offsetTop + window.scrollY - ogWindow + 'px';
        prevWinY = window.scrollY;
        prevWinX = window.scrollX;
    }
    function shadowRelativeToVisible(){
        var bShadowValueX, bShadowValueY;
        
            bShadowValueX = elem.offsetLeft + (elem.clientWidth/2) - wHalf;
            bShadowValueX = scale(bShadowValueX, -wHalf, wHalf, -5, 5);
            bShadowValueY = elem.offsetTop - window.scrollY + (elem.clientHeight/2) - hHalf;
            bShadowValueY = scale(bShadowValueY, -hHalf, hHalf, -5, 5);
        if(ogo.Shine){
            ogo.Shine.addNewBoxShadow(
                og => `${bShadowValueX}px ${bShadowValueY}px 5px rgba(0,0,0, .5), ${og}`
            );
        }else{

        }
        function scale(num, inMin, inMax, outMin, outMax){
            return (num - inMin)*(outMax-outMin)/(inMax-inMin)+outMin;
        }
    }
}