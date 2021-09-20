


function addHighlights(elem, prefix){
    // default
    prefix || (prefix = elem.tagName.toLowerCase());
    
    if(elem.style.display === '') elem.style.display = 'flex';
    if(elem.style.position === '') elem.style.position = 'relative';
    if(elem.style.borderRadius === '') elem.style.borderRadius = '7px';
    let elemBackgroundColor = window.getComputedStyle(elem, null).getPropertyValue('background-color');


    




    elem.style.boxShadow = 
        `inset 0 4px 0 rgba(255,255,255,.5), 
        inset 0 -4px 0 rgba(0,0,0,.3),
        inset 5px 8px 0 ${elemBackgroundColor}, 
        inset -5px 8px 0 ${elemBackgroundColor}, 
        inset -5px -${elem.clientHeight - (elem.clientHeight * elem.clientHeight/elem.clientWidth)}px 0 ${elemBackgroundColor}, 
        inset 5px -${elem.clientHeight - (elem.clientHeight * elem.clientHeight/elem.clientWidth)}px 0 ${elemBackgroundColor}, 
        inset 10px 10px 0 ${elem.clientHeight / 2}px rgba(255,255,255,.5)`;
    elem.style.justifyContent = 'center';

    // let bubble = document.createElement(`${prefix}-bubble`);
    // bubble.className = `${prefix}-bubble`;
    // bubble.style.display = 'block';
    // bubble.style.borderRadius = 'inherit';
    // bubble.style.width = elem.clientWidth - 8 + 'px';

    
    // bubble.style.height = (elem.clientHeight/(hOffset + 3)) * hOffset + 'px';
    // bubble.style.marginTop = '7px';
    // bubble.style.backgroundColor = 'rgba(255, 255, 255, .3)';
    // bubble.style.boxShadow = `inset 0 0 10px rgba(255, 255, 255, .5)`;

    // elem.appendChild(bubble);

    // elem.appendChild(topH);

    return elem;
}


addHighlights(document.querySelector('regeggs-card'));
