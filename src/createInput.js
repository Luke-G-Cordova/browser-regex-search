
var getGI = (key) => ELEM_KEYS.indexOf(key);
function createInput(key){
    let form = document.querySelector('regeggs-card.chrome-regeggs-popup regeggs-div.formWrapper');
    
    key || (key = `regeggs-key-${Math.random().toString(36).substr(2, 5)}`);

    let div = document.createElement('regeggs-div');
    div.name = key;
    div.className = 'inputWrapper';
    div.id = 'chrepo-inputWrapper-id';
    
    let icWrapper = document.createElement('regeggs-div');
    icWrapper.style.width = '100%';
    icWrapper.className = 'icWrapper';
    icWrapper.id = 'chrepo-icWrapper-id';

    let modifiers = document.createElement('regeggs-span');
    modifiers.className = 'modifiersWrapper';
    modifiers.id = 'chrepo-modifiersWrapper-id';

    let input = document.createElement('input');

    input.className = 'myInput';
    input.id = 'chrepo-myInput-id';
    input.type = 'text';
    input.placeholder = 'regular expression';
    input.name = key;

    let count = document.createElement('regeggs-span');
    count.className = 'matchCount';
    count.style.float = 'right';

    let countNum = document.createElement('regeggs-span');
    countNum.innerHTML = '0';
    let countSep = document.createElement('regeggs-span');
    countSep.innerHTML = '/';
    let countDen = document.createElement('regeggs-span');
    countDen.innerHTML = '0';
    
    countNum = count.appendChild(countNum);
    countSep = count.appendChild(countSep);
    countDen = count.appendChild(countDen);

    
    let caseSensitive = document.createElement('regeggs-button');
    new Shine(caseSensitive, {bubble: false, overrideArgs:[2, 0, 0, 0]});
    caseSensitive.innerHTML = '/i';

    let isRegex = document.createElement('regeggs-button');
    new Shine(isRegex, {bubble: false, overrideArgs:[2, 0, 0, 0]});
    isRegex.innerHTML = '/r';

    let scrollable = document.createElement('regeggs-button');
    new Shine(scrollable, {bubble: false, overrideArgs:[2, 0, 0, 0]});
    scrollable.innerHTML = '/s';

    let levenshtien = document.createElement('regeggs-button');
    new Shine(levenshtien, {bubble: false, overrideArgs:[2, 0, 0, 0]});
    levenshtien.innerHTML = '/l';

    let maxMatchLimit = document.createElement('input');
    maxMatchLimit.type = 'number'
    maxMatchLimit.value = 1000;
    maxMatchLimit.style.width = '50px';
    
    

    caseSensitive = modifiers.appendChild(caseSensitive);
    isRegex = modifiers.appendChild(isRegex);
    scrollable = modifiers.appendChild(scrollable);
    levenshtien = modifiers.appendChild(levenshtien);
    maxMatchLimit = modifiers.appendChild(maxMatchLimit);

    input = icWrapper.appendChild(input);
    modifiers = icWrapper.appendChild(modifiers);
    count = icWrapper.appendChild(count);
    icWrapper = div.appendChild(icWrapper);

    let buttonWrapper = document.createElement('regeggs-div');
    buttonWrapper.className = 'buttonWrapper';
    buttonWrapper.id = 'chrepo-buttonWrapper-id';

    let npWrapper = document.createElement('regeggs-div');
    npWrapper.style.float = 'left';
    npWrapper.style.display = 'flex';
    npWrapper.style.alignItems = 'center';
    npWrapper.className = 'npWrapper';

    let cWrapper = document.createElement('regeggs-div');
    cWrapper.className = 'cWrapper';
    cWrapper.id = 'chrepo-cWrapper-id';

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
    let colorFacts = document.createElement('regeggs-p');
    colorFacts.style.margin = '0 5px';

    
    
    colorInput.type = 'color';
    colorInput.value = '#FFFF00';
    colorInput.className = 'colorInput';
    colorFacts.innerHTML = colorInput.value;
    let color = '';
    
    minus.innerHTML = '-';
    minus.className = 'minus';
    // minus.type = 'button';

    next.innerHTML = '&#8658;';
    next.className = 'next';
    // next.type = 'button';
    next.name = color + '|' + key;
    
    prev.innerHTML = '&#8656;';
    prev.className = 'prev';
    // prev.type = 'button';
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
    
    
    // --- custom event listeners ---

    var preserveCase = 'i';
    var preserveScroll = true;
    var preserveLevenshtien = false;
    var preserveRegex = false;
    var nextOrPrev = next;
    var maxLimit = 1000;
    function handleHighlighting(){
        if(
            highlightMe(key, {
                match: input.value,
                color: colorInput.value,
                mods: preserveCase, 
                litReg: preserveRegex,
                limit: maxLimit,
                loose: preserveLevenshtien
            })
        ){
            next.click();
            prev.click();
            nextOrPrev = next;
        }else{
            countNum.innerHTML = '0';
            countDen.innerHTML = '0';
        }
    }
    
    input.addEventListener('input', (e) => {
        handleHighlighting();
        input.focus();
    });
    input.addEventListener('focus', (e) => {
        document.onkeydown = (e) => {
            if(e.key.toLocaleLowerCase() === 'enter'){
                e.preventDefault();
                nextOrPrev.click();
            }
        }
    });
    input.addEventListener('blur', (e) => document.onkeydown = null);

    colorInput.addEventListener('input', (e) => {
        changeColor(key, colorInput.value);
        colorFacts.innerHTML = colorInput.value;
    });
    caseSensitive.addEventListener('click', (e) => {
        e.preventDefault();
        preserveCase = preserveCase === 'i' ? '' : 'i';
        if(preserveCase === 'i'){
            caseSensitive.style.backgroundColor = 'gold'
        }else{
            caseSensitive.style.backgroundColor = 'red';
        }
        handleHighlighting();
    });
    isRegex.addEventListener('click', (e) => {
        e.preventDefault();
        preserveRegex = !preserveRegex;
        if(!preserveRegex){
            isRegex.style.backgroundColor = 'gold'
        }else{
            isRegex.style.backgroundColor = 'red';
        }
        handleHighlighting();
    });
    scrollable.addEventListener('click', (e) => {
        e.preventDefault();
        preserveScroll = !preserveScroll;
        if(preserveScroll){
            scrollable.style.backgroundColor = 'gold'
        }else{
            scrollable.style.backgroundColor = 'red';
        }
    });
    levenshtien.addEventListener('click', (e) => {
        e.preventDefault();
        preserveLevenshtien = !preserveLevenshtien;
        if(!preserveLevenshtien){
            levenshtien.style.backgroundColor = 'gold'
        }else{
            levenshtien.style.backgroundColor = 'red';
        }
        handleHighlighting();
    });
    maxMatchLimit.addEventListener('input', (e) => {
        e.preventDefault();
        maxLimit = maxMatchLimit.value;
        handleHighlighting();
    });
    next.addEventListener('click', (e) => {
        e.preventDefault();
        nextOrPrev = next;
        let GI = getGI(key);
        if(!!MY_HIGHLIGHTS[GI]){
            CURRENT_INDEXES[GI] = nextMatch(MY_HIGHLIGHTS[GI].elements, CURRENT_INDEXES[GI], {
                direction: 1, 
                newStyles: {
                    backgroundColor: 'orange'
                }, 
                oldStyles: {
                    backgroundColor: colorInput.value
                },
                scrollable: preserveScroll
            });
            countNum.innerHTML = CURRENT_INDEXES[GI] + 1;
            countDen.innerHTML = MY_HIGHLIGHTS[GI].elements.length;
        }
    });
    prev.addEventListener('click', (e) => {
        e.preventDefault();
        nextOrPrev = prev;
        let GI = getGI(key);
        if(!!MY_HIGHLIGHTS[GI]){
            CURRENT_INDEXES[GI] = nextMatch(MY_HIGHLIGHTS[GI].elements, CURRENT_INDEXES[GI], {
                direction: -1, 
                newStyles: {
                    backgroundColor: 'orange'
                }, 
                oldStyles: {
                    backgroundColor: colorInput.value
                },
                scrollable: preserveScroll
            });
            countNum.innerHTML = CURRENT_INDEXES[GI] + 1;
            countDen.innerHTML = MY_HIGHLIGHTS[GI].elements.length;
        }
    });
    minus.addEventListener('click', (e) => {
        e.preventDefault();
        clearHighlight(key);
        popupDragger.deleteNoDragElems(div);
        form.removeChild(div);
    });
    copy.addEventListener('click', (e) =>{
        e.preventDefault();
        let GI = getGI(key);
        if(!!MY_HIGHLIGHTS[GI]){
            let selection = '';
            MY_HIGHLIGHTS[GI].elements.forEach(elem => {
                for(let i = 0;i<elem.length;i++){
                    selection += elem[i].innerText;
                }
                selection += '\n';
            });
            navigator.clipboard.writeText(selection);
        }
    });

    return div;
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
        litReg: false,
        limit: 1000,
        loose: false
    }
    if(options){
        Object.assign(ogo, options);
        ogo.match = ogo.litReg ? ogo.match : escapeRegExp(ogo.match);
    }
    let GI = getGI(key);
    CUR_INDEX = 0;
    if(GI === -1) {
        ELEM_KEYS.push(key);
        GI = getGI(key);
        CURRENT_INDEXES.push(CUR_INDEX);
    }else{
        CURRENT_INDEXES[GI] = CUR_INDEX;
    }

    
    clearHighlight(key);
    let finalRegex;
    if(!ogo.loose){
        try{finalRegex = new RegExp(ogo.match, `${ogo.mods}g`);}catch(e) {finalRegex = null;}
    }else{
        finalRegex = ogo.match;
    }
    if(ogo.match !== '' && DEF_REJECTS.indexOf(ogo.match) === -1 && !!finalRegex){
        let multiNodeMatchId;
        MY_HIGHLIGHTS[GI] = highlight(document.body,
        {
            regex: finalRegex, 
            excludes: 'regeggs-card',
            limit: ogo.limit,
            loose: ogo.loose
        },
        function(match, sameMatchID){

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
        });
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
