
var ogWindow = window.scrollY;

var popup = createPopup();
dragPopup(document.querySelector('div.chrome-regex-popup:not(div.chrome-regex-popup *)'));

chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if((msg.from === 'background') && (msg.subject === 'open_popup')){
        showPopup();
    }
});

function createPopup() {
    let div = document.createElement('div');
    div.className = 'chrome-regex-popup';
    div.style.display = 'none';

    let exitBtn = document.createElement('button');
    exitBtn.innerHTML = '&#9760;';
    exitBtn.style.float = 'right';
    exitBtn = div.appendChild(exitBtn);

    let form = document.createElement('form');
    form.style.display = 'flex';
    form.style.justifyContent = 'center';
    form.style.alignItems = 'center';
    form.style.flexDirection = 'column';
    form.className = 'mainForm';

    
    let btn = document.createElement('button');
    btn.id = 'create-input';
    btn.appendChild(document.createTextNode('+'));
    
    btn = div.appendChild(btn);
    div.appendChild(form);
    div = document.body.appendChild(div);
    createInput();
    exitBtn.addEventListener('click', () => {
        showPopup();
    });
    btn.addEventListener('click', () => createInput());
    return div;
}

function createInput(key){
    let form = document.querySelector('.mainForm');
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

    let count = document.createElement('span');
    count.innerHTML = '0/0';
    count.className = 'matchCount';
    div.appendChild(count);
    
    let nextPrev = document.createElement('span');

    let next = document.createElement('button');
    let prev = document.createElement('button');
    let colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = '#FFFF00';
    let color = '';


    next.innerHTML = '&#8620';
    next.className = 'next';
    next.name = color + '|' + key;

    prev.innerHTML = '&#8619;';
    prev.className = 'prev';
    prev.name = color + '|' + key;

    nextPrev.className = 'buttonWrapper';
    nextPrev.style.display = 'inline';

    prev = nextPrev.appendChild(prev);
    next = nextPrev.appendChild(next);
    colorInput = nextPrev.appendChild(colorInput);

    div.appendChild(nextPrev);


    div = form.appendChild(div);
    
    input.addEventListener('input', (e) => {
        highlightMe(key, input.value, colorInput.value);
        input.focus();
    });

    colorInput.addEventListener('input', (e) => highlightMe(key, input.value, colorInput.value));

    document
        .querySelector(`button.next[name="${next.name}"]`)
        .addEventListener('click', changeCurrent);
    document
        .querySelector(`button.prev[name="${prev.name}"]`)
        .addEventListener('click', changeCurrent)
    ;
    return div;
}
function changeCurrent(e){
    e.preventDefault();
}

// I should find a more eye pleasing soloution than this
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

function highlightMe(key, data, color){
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
    if(data !== '' && DEF_REJECTS.indexOf(data) === -1){
        let multiNodeMatchId;
        MY_HIGHLIGHTS[GI] = highlight(document.body, new RegExp(data, 'ig'), function(match, sameMatchID){

            multiNodeMatchId = sameMatchID;
            var highlightMe = document.createElement("highlight-me");

            highlightMe.className = `chrome-regeggz-highlight-me ${key}`;
            if(CUR_INDEX === 0){
                highlightMe.className += ' current';
            }
            highlightMe.style.backgroundColor = `${color}`;
            highlightMe.style.color = invertColor(color);

            highlightMe.id = `${CUR_INDEX}|${key}|${multiNodeMatchId}`;

            CUR_INDEX = multiNodeMatchId > -1 ? CUR_INDEX : CUR_INDEX + 1;

            highlightMe.textContent = match;
            return highlightMe;
        });

    }
}

function showPopup(){
    if(popup.style.display === 'none'){
        popup.style.display = 'block';
        popup.style.top = popup.offsetTop + window.scrollY - ogWindow + 'px';
        ogWindow = window.scrollY;
    }else{
        popup.style.display = 'none';
    }
}
function scale(num, inMin, inMax, outMin, outMax){
    return (num - inMin)*(outMax-outMin)/(inMax-inMin)+outMin;
}
function dragPopup(elem){
    var startX, startY, endX, endY;
    var wHalf = window.innerWidth/2;
    var bShadowValueX, bShadowValueX;
    var border = 10;
    
    elem.onmousedown = (e) => {
        if(!document.querySelector('div.chrome-regex-popup input:not([type=color]):hover')){
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
                elem.style.left = elem.offsetLeft + (endX - startX) + 'px';
                elem.style.top = elem.offsetTop + (endY - startY) + 'px';

                bShadowValueX = elem.offsetLeft + (elem.clientWidth*2) - wHalf;
                bShadowValueX = scale(bShadowValueX, 0, window.innerWidth, -25, 25);
                bShadowValueY = elem.offsetTop + (elem.clientHeight*2) - wHalf;
                bShadowValueY = scale(bShadowValueY, 0, window.innerHeight, -25, 25);
                elem.style.boxShadow = `${bShadowValueX}px ${bShadowValueY}px 10px rgba(0,0,0, 1)`;
                // box-shadow: 5px 5px 10px rgba(0,0,0, .3);

                // right/left edge of the popup
                if(elem.offsetLeft + elem.clientWidth + border > window.innerWidth){
                    elem.style.left = window.innerWidth - elem.clientWidth - border + 'px';
                }else if(elem.offsetLeft < 0){
                    elem.style.left = 0 + 'px';
                }else{
                    startX = ev.clientX;
                }

                // top/bottom edge of the popup
                if(elem.offsetTop + elem.clientHeight + border > window.innerHeight + window.scrollY){
                    elem.style.top = window.innerHeight + window.scrollY - elem.clientHeight - border + 'px';
                }else if(elem.offsetTop < 0 + window.scrollY){
                    elem.style.top = 0 + window.scrollY + 'px';
                }else{ 
                    startY = ev.clientY;
                }
            };
        }
        document.onscroll = (e) => {
            if(elem.style.display === 'block'){
                elem.style.top = elem.offsetTop + window.scrollY - ogWindow + 'px';
                ogWindow = window.scrollY;
            }
        }
    }
}
