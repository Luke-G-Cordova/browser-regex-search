



function addHighlights(elem, prefix){
    // default
    prefix || (prefix = elem.tagName.toLowerCase());
    
    if(elem.style.display === '') elem.style.display = 'block';
    if(elem.style.position === '') elem.style.position = 'relative';
    if(elem.style.borderRadius === '') elem.style.borderRadius = '7px';


    let topH = document.createElement(`${prefix}-highlights`);
    topH.className = `${prefix}-highlights`;
    topH.style.display = 'flex';
    topH.style.justifyContent = 'center';
    topH.style.width = 'inherit';
    topH.style.height = 'inherit';
    topH.style.borderRadius = 'inherit';
    topH.style.boxSizing = 'border-box';
    topH.style.borderTop = '3px solid rgba(255, 255, 255, .6)';
    topH.style.borderBottom = '3px solid rgba(0, 0, 0, .3)';
    


    let bubble = document.createElement(`${prefix}-bubble`);
    bubble.className = `${prefix}-bubble`;
    bubble.style.display = 'block';
    bubble.style.borderRadius = 'inherit';
    bubble.style.width = elem.clientWidth - 4 + 'px';
    

    let hOffset = elem.clientHeight / elem.clientWidth;
    
    console.log(hOffset);
    bubble.style.height = (elem.clientHeight/(hOffset + 3)) * hOffset + 'px';
    bubble.style.marginTop = '2px';
    bubble.style.backgroundColor = 'rgba(255, 255, 255, .3)';
    bubble.style.boxShadow = 'inset 0 0 10px rgba(255, 255, 255, .4)';
    

    topH.appendChild(bubble);

    elem.appendChild(topH);

    return elem;
}


addHighlights(document.querySelector('regeggs-card'));
