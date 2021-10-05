class Draggable {
    constructor(elem, options) {
        this.ogo = {
            noDragElems: [],
            Shine: null
        }
        this.elem = elem;
        for(let op in options){
            this.ogo[op] = options[op];
        }
        this.noDragElems = this.ogo.noDragElems;
        this.wHalf = window.innerWidth/2;
        this.hHalf = window.innerHeight/2;
        this.notDraggable = 0;
    }
    drag(){
        var startX, startY, endX, endY;
        var prevWinY = window.scrollY;
        var prevWinX = window.scrollX;
        
        var noDragElems = [].slice.call(this.ogo.noDragElems);
        var border = window.getComputedStyle(this.elem, null).getPropertyValue('border-left-width'); 
        border = Number(border.substr(0, border.length - 2)) + 20;
        if(noDragElems.length !== 0){
            noDragElems.forEach((ndElem) =>{
                ndElem.onmouseover = (e) => {
                    this.notDraggable++;
                }
                ndElem.onmouseout = (e) => {
                    this.notDraggable--;
                }
            });
        }
        this.elem.onmousedown = (e) => {
            console.log(this.notDraggable);
            if(!this.notDraggable){
                this.wHalf = window.innerWidth/2;
                this.hHalf = window.innerWidth/2;
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
                    this.elem.style.left = this.elem.offsetLeft + (endX - startX) + 'px';
                    this.elem.style.top = this.elem.offsetTop + (endY - startY) + 'px';

                    this.shadowRelativeToVisible();

                    if(this.elem.offsetLeft + this.elem.clientWidth + border > window.innerWidth + window.scrollX){
                        this.elem.style.left = window.innerWidth - this.elem.clientWidth - border + 'px';
                    }else if(this.elem.offsetLeft < 0){
                        this.elem.style.left = 0 + 'px';
                    }else{
                        startX = ev.clientX;
                    }

                    if(this.elem.offsetTop + this.elem.clientHeight + border > window.innerHeight + window.scrollY){
                        this.elem.style.top = window.innerHeight + window.scrollY - this.elem.clientHeight - border + 'px';
                    }else if(this.elem.offsetTop < 0 + window.scrollY){
                        this.elem.style.top = 0 + window.scrollY + 'px';
                    }else{ 
                        startY = ev.clientY;
                    }
                };
            }
        }
        
        document.onscroll = (e) => {
            this.elem.style.top = this.elem.offsetTop + window.scrollY - prevWinY + 'px';
            this.elem.style.left = this.elem.offsetLeft + window.scrollX - prevWinX + 'px';
            prevWinY = window.scrollY;
            prevWinX = window.scrollX;
        }
    }
    shadowRelativeToVisible(){
        var bShadowValueX, bShadowValueY;
        
        bShadowValueX = this.elem.offsetLeft + (this.elem.clientWidth/2) - this.wHalf;
        bShadowValueX = scale(bShadowValueX, -this.wHalf, this.wHalf, -5, 5);
        bShadowValueY = this.elem.offsetTop - window.scrollY + (this.elem.clientHeight/2) - this.hHalf;
        bShadowValueY = scale(bShadowValueY, -this.hHalf, this.hHalf, -5, 5);
        if(this.ogo.Shine){
            this.ogo.Shine.addNewBoxShadow(
                og => `${bShadowValueX}px ${bShadowValueY}px 5px rgba(0,0,0, .5), ${og}`
            );
        }else{

        }
        function scale(num, inMin, inMax, outMin, outMax){
            return (num - inMin)*(outMax-outMin)/(inMax-inMin)+outMin;
        }
    }
    addNoDragElems(elems){
        this.noDragElems = this.noDragElems.concat(elems);
        this.noDragElems.forEach((ndElem) =>{
            ndElem.onmouseover = (e) => {
                this.notDraggable++;
            }
            ndElem.onmouseout = (e) => {
                this.notDraggable--;
            }
        });
    }
    deleteNoDragElems(elems){
        elems = [].concat(elems);
        elems.forEach(elem => {
            delete this.noDragElems[this.noDragElems.indexOf(elem)]
        });
        this.notDraggable--;
        this.noDragElems.forEach((ndElem) =>{
            ndElem.onmouseover = (e) => {
                this.notDraggable++;
            }
            ndElem.onmouseout = (e) => {
                this.notDraggable--;
            }
        });
    }
}