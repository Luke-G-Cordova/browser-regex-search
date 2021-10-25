function createInput(key){
    let form = document.querySelector('regeggs-card.chrome-regeggs-popup regeggs-div.formWrapper');
    
    key || (key = `regeggs-key-${Math.random().toString(36).substr(2, 5)}`);

    let inputWrapper = document.createElement('regeggs-div');
    inputWrapper.className = 'inputWrapper';

    let iWrapper = document.createElement('regeggs-div');
    iWrapper.className = 'iWrapper';

    let bWrapper = document.createElement('regeggs-div');
    bWrapper.className = 'bWrapper';

    // iWrapper children
    let input = document.createElement('input');
    input.type = 'text';
    input = iWrapper.appendChild(input);

    let caseSensitive = document.createElement('regeggs-button');
    new Shine(caseSensitive, {bubble: false, overrideArgs:[2, 0, 0, 0]});
    caseSensitive.innerHTML = '/i';
    caseSensitive = iWrapper.appendChild(caseSensitive);
    caseSensitive.style.width = '25px';

    let isRegex = document.createElement('regeggs-button');
    new Shine(isRegex, {bubble: false, overrideArgs:[2, 0, 0, 0]});
    isRegex.innerHTML = '/r';
    isRegex = iWrapper.appendChild(isRegex);

    let scrollable = document.createElement('regeggs-button');
    new Shine(scrollable, {bubble: false, overrideArgs:[2, 0, 0, 0]});
    scrollable.innerHTML = '/s';
    scrollable = iWrapper.appendChild(scrollable);

    let count = document.createElement('regeggs-span');
    count.className = 'count';
    let countNum = document.createElement('regeggs-span');
    countNum.innerHTML = '0';
    let countSep = document.createElement('regeggs-span');
    countSep.innerHTML = '/';
    let countDen = document.createElement('regeggs-span');
    countDen.innerHTML = '0';

    countNum = count.appendChild(countNum);
    countSep = count.appendChild(countSep);
    countDen = count.appendChild(countDen);
    count = iWrapper.appendChild(count);

    // bWrapper children
    let next = document.createElement('regeggs-button');
    new Shine(next, {bubble: false, overrideArgs:[2, 0, 0, 0]});
    
    let prev = document.createElement('regeggs-button');
    new Shine(prev, {bubble: false, overrideArgs:[2, 0, 0, 0]});

    let minus = document.createElement('regeggs-button');
    new Shine(minus, {bubble: false, overrideArgs:[2, 0, 0, 0]});

    let copy = document.createElement('regeggs-button');
    new Shine(copy, {bubble: false, overrideArgs:[2, 0, 0, 0]});
    

    let colorInput = document.createElement('input');
    new Shine(colorInput, {bubble: false, overrideArgs:[2, 0, 0, 0]});
    let colorFacts = document.createElement('regeggs-div');
    colorFacts.style.margin = '0 5px';
    
    colorInput.type = 'color';
    colorInput.value = '#FFFF00';
    colorInput.className = 'colorInput';
    colorFacts.innerHTML = colorInput.value;
    let color = '';
    
    minus.innerHTML = '-';
    minus.className = 'minus';

    next.innerHTML = '&#8658;';
    next.className = 'next';
    
    prev.innerHTML = '&#8656;';
    prev.className = 'prev';

    copy.innerHTML = '&#9974;';
    copy.title = 'Copy This Selection';
    copy.className = 'copySelection';

    prev = bWrapper.appendChild(prev);
    next = bWrapper.appendChild(next);
    minus = bWrapper.appendChild(minus);
    copy = bWrapper.appendChild(copy);

    colorFacts = bWrapper.appendChild(colorFacts);
    colorInput = bWrapper.appendChild(colorInput);
    
    

    inputWrapper.append(iWrapper, bWrapper);
    inputWrapper = form.appendChild(inputWrapper);
    return inputWrapper;
}
function changeColor(key, color){
    let matches = document.querySelectorAll(`highlight-me.${key}`);
    matches.forEach((elem) => {
        elem.style.backgroundColor = color;
        elem.style.color = invertColor(color);
    });
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
    let finalRegex;
    try{finalRegex = new RegExp(ogo.match, `${ogo.mods}g`);}catch(e) {finalRegex = null;}
    if(ogo.match !== '' && DEF_REJECTS.indexOf(ogo.match) === -1 && !!finalRegex){
        let multiNodeMatchId;
        MY_HIGHLIGHTS[GI] = highlight(document.body, finalRegex, function(match, sameMatchID){

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