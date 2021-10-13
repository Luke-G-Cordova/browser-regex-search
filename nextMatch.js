

function nextMatch(elements, cIndex, direction, styles){
    direction || (direction = 1);
    const regCurrent = /(^|\s)current(\s|$)/;
    const current = ' current';
    for(let i in elements[cIndex]){
        if(regCurrent.test(elements[cIndex][i].className)){
            elements[cIndex][i].className = elements[cIndex][i].className.replace(regCurrent, '');
            if(!!styles.os){
                for(let sty in styles.os){
                    elements[cIndex][i].style[sty] = styles.os[sty];
                }
            }
        }
    }
    if(!elements[cIndex + direction]){
        if(direction > 0){
            cIndex = 0;
        } else {
            cIndex = elements.length - 1;
        }
    } else{
        cIndex += direction;
    }
    for(let i in elements[cIndex]){
        if(!regCurrent.test(elements[cIndex][i].className)){
            elements[cIndex][i].className += current;
            if(!!styles.ns){
                for(let sty in styles.ns){
                    elements[cIndex][i].style[sty] = styles.ns[sty];
                }
            }
        }
    }
    
    return cIndex;
}
