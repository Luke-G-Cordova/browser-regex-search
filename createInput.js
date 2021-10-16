function createInput(key){
    let form = document.querySelector('regeggs-card.chrome-regeggs-popup div form.mainForm');
    
    key || (key = `regeggs-key-${Math.random().toString(36).substr(2, 5)}`);

    let div = document.createElement('div');
    div.name = key;
    div.className = 'inputWrapper';
    
    let icWrapper = document.createElement('div');
    icWrapper.style.width = '100%';
    icWrapper.className = 'icWrapper';
    let input = document.createElement('input');
    input.className = 'myInput';
    input.type = 'text';
    input.placeholder = 'regular expression';
    input.name = key;

    let count = document.createElement('span');
    count.innerHTML = '0/0';
    count.className = 'matchCount';
    count.style.float = 'right';
    input = icWrapper.appendChild(input);
    count = icWrapper.appendChild(count);
    icWrapper = div.appendChild(icWrapper);

    let buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'buttonWrapper';

    let npWrapper = document.createElement('div');
    npWrapper.style.float = 'left';
    npWrapper.style.display = 'flex';
    npWrapper.style.alignItems = 'center';
    npWrapper.className = 'npWrapper';

    let cWrapper = document.createElement('div');
    cWrapper.className = 'cWrapper';
    let next = document.createElement('button');
    new Shine(next, {bubble: false, overrideArgs:[2, 0, 0, 0]});
    
    let prev = document.createElement('button');
    new Shine(prev, {bubble: false, overrideArgs:[2, 0, 0, 0]});

    let minus = document.createElement('button');
    new Shine(minus, {bubble: false, overrideArgs:[2, 0, 0, 0]});

    let copy = document.createElement('button');
    new Shine(copy, {bubble: false, overrideArgs:[2, 0, 0, 0]});
    

    let colorInput = document.createElement('input');
    new Shine(colorInput, {bubble: false, overrideArgs:[2, 0, 0, 0]});
    let colorFacts = document.createElement('p');
    colorFacts.style.padding = '0';
    colorFacts.style.margin = '0 5px';

    
    
    colorInput.type = 'color';
    colorInput.value = '#FFFF00';
    colorInput.className = 'colorInput';
    colorFacts.innerHTML = colorInput.value;
    let color = '';
    
    minus.innerHTML = '-';
    minus.className = 'minus';
    minus.type = 'button';

    next.innerHTML = '&#8658;';
    next.className = 'next';
    next.type = 'button';
    next.name = color + '|' + key;
    
    prev.innerHTML = '&#8656;';
    prev.className = 'prev';
    prev.type = 'button';
    prev.name = color + '|' + key;

    copy.innerHTML = '&#9974;';
    copy.title = 'Copy This Selection';
    copy.className = 'copySelection';

    prev = npWrapper.appendChild(prev);
    next = npWrapper.appendChild(next);
    minus = npWrapper.appendChild(minus);
    copy = npWrapper.appendChild(copy);
    npWrapper = buttonWrapper.appendChild(npWrapper);

    colorFacts = cWrapper.appendChild(colorFacts);
    colorInput = cWrapper.appendChild(colorInput);
    cWrapper = buttonWrapper.appendChild(cWrapper);


    buttonWrapper = div.appendChild(buttonWrapper);

    div = form.appendChild(div);
    
    
    
    input.addEventListener('input', (e) => {
        highlightMe(key, input.value, colorInput.value);
        input.focus();
    });
    colorInput.addEventListener('input', (e) => {
        changeColor(key, colorInput.value);
        colorFacts.innerHTML = colorInput.value;
    });
    
    copy.addEventListener('click', (e) =>{
        e.preventDefault();
        let GI = ELEM_KEYS.indexOf(key);
        let selection = '';
        MY_HIGHLIGHTS[GI].elements.forEach(elem => {
            for(let i = 0;i<elem.length;i++){
                selection += elem[i].innerText;
            }
            selection += '\n';
        });
        navigator.clipboard.writeText(selection);
    });

    next.addEventListener('click', (e) => {
        e.preventDefault();
        let GI = ELEM_KEYS.indexOf(key);
        CURRENT_INDEXES[GI] = nextMatch(MY_HIGHLIGHTS[GI].elements, CURRENT_INDEXES[GI], {
            direction: 1, 
            newStyles: {
                backgroundColor: 'orange'
            }, 
            oldStyles: {
                backgroundColor: colorInput.value
            }
        });
    });
    prev.addEventListener('click', (e) => {
        e.preventDefault();
        let GI = ELEM_KEYS.indexOf(key);
        CURRENT_INDEXES[GI] = nextMatch(MY_HIGHLIGHTS[GI].elements, CURRENT_INDEXES[GI], {
            direction: -1, 
            newStyles: {
                backgroundColor: 'orange'
            }, 
            oldStyles: {
                backgroundColor: colorInput.value
            }
        });
    });
    minus.addEventListener('click', (e) => {
        e.preventDefault();
        clearHighlight(key);
        popupDragger.deleteNoDragElems(div);
        form.removeChild(div);
    });
    return div;
}