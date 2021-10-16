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

    let modifiers = document.createElement('span');
    modifiers.className = 'modifiersWrapper';

    let caseSensitive = document.createElement('button');
    caseSensitive.innerHTML = '/i';
    let isRegex = document.createElement('button');
    isRegex.innerHTML = '/r';

    caseSensitive = modifiers.appendChild(caseSensitive);
    isRegex = modifiers.appendChild(isRegex);

    input = icWrapper.appendChild(input);
    modifiers = icWrapper.appendChild(modifiers);
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
    
    
    




    var preserveCase = 'i';
    var preserveRegex = true;

    input.addEventListener('input', (e) => {
        if(
            highlightMe(key, {
                match: input.value,
                color: colorInput.value,
                mods: preserveCase, 
                litReg: preserveRegex
            })
        ){
            next.click();
            prev.click();
        }
        
        input.focus();
    });
    colorInput.addEventListener('input', (e) => {
        changeColor(key, colorInput.value);
        colorFacts.innerHTML = colorInput.value;
    });

    caseSensitive.addEventListener('click', (e) => {
        e.preventDefault();
        preserveCase = preserveCase === 'i' ? '' : 'i';
        if(
            highlightMe(key, {
                match: input.value,
                color: colorInput.value,
                mods: preserveCase, 
                litReg: preserveRegex
            })
        ){
            next.click();
            prev.click();
        }
    });
    isRegex.addEventListener('click', (e) => {
        e.preventDefault();
        preserveRegex = !preserveRegex;
        if(
            highlightMe(key, {
                match: input.value,
                color: colorInput.value,
                mods: preserveCase, 
                litReg: preserveRegex
            })
        ){
            next.click();
            prev.click();
        }
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


    return div;
}
function highlightMe(key, options){
    let ogo = {
        match: '',
        color: '#FFFF00',
        mods: '',
        litReg: false
    }
    if(options){
        Object.assign(ogo, options);
        ogo.match = ogo.litReg ? ogo.match : escapeRegExp(ogo.match);
    }
    let GI = ELEM_KEYS.indexOf(key);
    CUR_INDEX = 0;
    if(GI === -1) {
        ELEM_KEYS.push(key);
        GI = ELEM_KEYS.indexOf(key);

        CURRENT_INDEXES.push(CUR_INDEX);
    }else{
        CURRENT_INDEXES[GI] = CUR_INDEX;
    }
    clearHighlight(key);
    if(ogo.match !== '' && DEF_REJECTS.indexOf(ogo.match) === -1){
        let multiNodeMatchId;
        MY_HIGHLIGHTS[GI] = highlight(document.body, new RegExp(ogo.match, `${ogo.mods}g`), function(match, sameMatchID){

            multiNodeMatchId = sameMatchID;
            var highlightMeElem = document.createElement("highlight-me");

            highlightMeElem.className = `chrome-regeggz-highlight-me ${key}`;
            if(CUR_INDEX === 0){
                highlightMeElem.className += ' current';
            }
            highlightMeElem.style.backgroundColor = `${ogo.color}`;
            highlightMeElem.style.color = invertColor(ogo.color);

            // highlightMeElem.id = `${CUR_INDEX}|${key}|${multiNodeMatchId}`;

            CUR_INDEX = multiNodeMatchId > -1 ? CUR_INDEX : CUR_INDEX + 1;

            highlightMeElem.textContent = match;
            return highlightMeElem;
        }, 'regeggs-card');
        return true;
    }
    return false;
}
function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
function invertColor(hex) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    return '#' + padZero(r) + padZero(g) + padZero(b);
}
function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}