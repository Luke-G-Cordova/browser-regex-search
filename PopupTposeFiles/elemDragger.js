function scale(num, inMin, inMax, outMin, outMax){
    return (num - inMin)*(outMax-outMin)/(inMax-inMin)+outMin;
}
function dragPopup(elem){
    var startX, startY, endX, endY;
    var wHalf = window.innerWidth/2;
    var hHalf = window.innerHeight/2;
    var bShadowValueX, bShadowValueY;
    var border = 10;
    
    elem.onmousedown = (e) => {
        if(!document.querySelector(`${elem.tagName} input:hover`)){
            wHalf = window.innerWidth/2;
            hHalf = window.innerHeight/2;
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

                // bShadowValueX = elem.offsetLeft + (elem.clientWidth/2) - wHalf;
                // bShadowValueX = scale(bShadowValueX, -wHalf, wHalf, -5, 5);
                // bShadowValueY = elem.offsetTop - window.scrollY + (elem.clientHeight/2) - hHalf;
                // bShadowValueY = scale(bShadowValueY, -hHalf, hHalf, -5, 5);
                
                // popupShine.addNewBoxShadow(
                //     og => `${bShadowValueX}px ${bShadowValueY}px 5px rgba(0,0,0, .5), ${og}`
                // );

                // right/left edge of the popup
                if(elem.offsetLeft + elem.clientWidth + border > window.innerWidth){
                    elem.style.left = window.innerWidth - elem.clientWidth - border + 'px';
                }else if(elem.offsetLeft < 0){
                    elem.style.left = 0 + 'px';
                }else{
                    startX = ev.clientX;
                }

                // top/bottom edge of the popup
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
        if(elem.style.display === 'block'){
            elem.style.top = elem.offsetTop + window.scrollY - ogWindow + 'px';
            ogWindow = window.scrollY;
        }
    }
}