function createInput(key){
    let form = document.querySelector('regeggs-card.chrome-regeggs-popup div form.mainForm');
    
    key || (key = `regeggs-key-${Math.random().toString(36).substr(2, 5)}`);

    let div = document.createElement('div');
    div.name = key;
    div.className = 'inputWrapper';
    
    let input = document.createElement('input');

    input.className = 'myInput';
    input.type = 'text';
    input.placeholder = 'regular expression';
    input.name = key;
    input = div.appendChild(input);

    let nextPrev = document.createElement('span');
    nextPrev.className = 'buttonWrapper';

    let count = document.createElement('span');

    let next = document.createElement('button');
    new Shine(next, {bubble: false, overrideArgs:[2, 0, 0, 0]});
    
    let prev = document.createElement('button');
    new Shine(prev, {bubble: false, overrideArgs:[2, 0, 0, 0]});
    
    let colorInput = document.createElement('input');
    new Shine(colorInput, {bubble: false, overrideArgs:[2, 0, 0, 0]});
    
    let minus = document.createElement('button');
    new Shine(minus, {bubble: false, overrideArgs:[2, 0, 0, 0]});

    colorInput.type = 'color';
    colorInput.value = '#FFFF00';
    colorInput.className = 'colorInput';
    let color = '';

    count.innerHTML = '0/0';
    count.className = 'matchCount';

    minus.innerHTML = '-';
    minus.className = 'minus';

    next.innerHTML = '&#8658;';
    next.className = 'next';
    next.name = color + '|' + key;
    
    prev.innerHTML = '&#8656;';
    prev.className = 'prev';
    prev.name = color + '|' + key;

    count = nextPrev.appendChild(count);

    prev = nextPrev.appendChild(prev);
    next = nextPrev.appendChild(next);
    colorInput = nextPrev.appendChild(colorInput);
    minus = nextPrev.appendChild(minus);


    nextPrev = div.appendChild(nextPrev);


    div = form.appendChild(div);
    
    minus.addEventListener('click', (e) => {
        e.preventDefault();
        clearHighlight(key);
        popupDragger.deleteNoDragElems(div);
        form.removeChild(div);
    });
    input.addEventListener('input', (e) => {
        highlightMe(key, input.value, colorInput.value);
        input.focus();
    });

    colorInput.addEventListener('input', (e) => {
        changeColor(key, colorInput.value);
    });
    let GI = ELEM_KEYS.indexOf(key);
    document
        .querySelector(`button.next[name="${next.name}"]`)
        .addEventListener('click', changeCurrent);
        // CURRENT_INDEXES[GI] = nextMatch(MY_HIGHLIGHTS[GI].elements, CURRENT_INDEXES[GI], 1);
    document
        .querySelector(`button.prev[name="${prev.name}"]`)
        .addEventListener('click', changeCurrent)
    ;
    return div;
}