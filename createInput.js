function createInput(key){
    let form = document.querySelector('regeggs-card.chrome-regeggs-popup div form.mainForm');
    
    key || (key = `regeggs-key-${Math.random().toString(36).substr(2, 5)}`);

    let div = document.createElement('div');
    div.name = key;
    div.className = 'inputWrapper';
    
    let icWrapper = document.createElement('div');
    icWrapper.style.width = '100%';
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

    let cWrapper = document.createElement('div');
    cWrapper.className = 'cWrapper';
    let next = document.createElement('button');
    new Shine(next, {bubble: false, overrideArgs:[2, 0, 0, 0]});
    
    let prev = document.createElement('button');
    new Shine(prev, {bubble: false, overrideArgs:[2, 0, 0, 0]});

    let minus = document.createElement('button');
    new Shine(minus, {bubble: false, overrideArgs:[2, 0, 0, 0]});
    

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


    prev = npWrapper.appendChild(prev);
    next = npWrapper.appendChild(next);
    minus = npWrapper.appendChild(minus);
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
    let GI = ELEM_KEYS.indexOf(key);
    next.addEventListener('click', nextMatch);
    prev.addEventListener('click', nextMatch);
    minus.addEventListener('click', (e) => {
        e.preventDefault();
        clearHighlight(key);
        popupDragger.deleteNoDragElems(div);
        form.removeChild(div);
    });
    return div;
}