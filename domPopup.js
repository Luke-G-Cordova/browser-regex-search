
// var ogWindow = window.scrollY;
var CUR_INDEX = 0;
var ELEM_KEYS = [];
var CURRENT_INDEXES = [];
var MY_HIGHLIGHTS = [];
var DEF_REJECTS = ['\\', ''];
var popup;
var popupShine;
var popupDragger;

window.addEventListener('load', () => {
    
    popup = document.createElement('regeggs-card');
    
    popup.className = 'chrome-regeggs-popup';
    popupShine = new Shine(popup);
    popupShine.updateStyles({
        backgroundColor: '#6f03fc',
        display: 'block',
        visibility: 'hidden',      // make this hidden
        position: 'absolute', 
        top:`${20 + window.scrollY}px`, 
        left: `${20 + window.scrollX}px`, 
        zIndex: '1000', 
        borderRadius: '10px', 
        padding: '15px', 
        minWidth: '400px', 
        maxHeight: '430px',
        justifyContent: 'center'
    });

    let pContent = document.createElement('div');
    pContent.className = 'pContent';
    let pContentShine = new Shine(pContent, {bubble: false});
    pContentShine.updateStyles({
        width: '100%', 
        height: '100%', 
        maxHeight: 'inherit',
        backgroundColor: '#ababab',
        borderRadius: '7px',
        display: 'flex', 
        flexDirection: 'column',
        paddingBottom: '25px'
    });

    let inputAdder = document.createElement('button');
    let inputAdderShine = new Shine(inputAdder, {overrideArgs: [2, 22, 3, 4]});
    inputAdder.innerHTML = '+';
    inputAdderShine.updateStyles({
        float: 'left',
        backgroundColor: '#0a9c00',
        borderRadius: '5px', 
        width: '32px',
        height: '32px',
        border: '1px solid black',
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textShadow: '2px 2px 0px black',
        fontWeight: '900',
        fontSize: '20px',
        fontFamily: '"Chango", cursive', 
        margin: '10px',
        userSelect: 'none'
    });
    

    let exitBtn = document.createElement('div');
    let exitBtnShine = new Shine(exitBtn, {overrideArgs: [2, 22, 3, 4]});
    exitBtn.innerHTML = 'X';
    exitBtnShine.updateStyles({
        float: 'right',
        backgroundColor:'red',
        borderRadius: '5px', 
        width: '30px',
        height: '30px',
        border: '1px solid black',
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textShadow: '2px 2px 0px black',
        fontWeight: '900',
        fontFamily: '"Chango", cursive', 
        margin: '10px',
        fontSize: 'initial',
        userSelect: 'none'
    });
    let exitBtnWrapper = document.createElement('div');
    exitBtnWrapper.className = 'controllWrapper';
    Shine.updateStyles(exitBtnWrapper, {
        display: 'inline-block',
        width: '100%'
    });
    exitBtn = exitBtnWrapper.appendChild(exitBtn);
    inputAdder = exitBtnWrapper.appendChild(inputAdder);

    exitBtnWrapper = pContent.appendChild(exitBtnWrapper);
    
    let formWrapper = document.createElement('div');
    formWrapper.className = 'formWrapper';

    let form = document.createElement('form');
    Shine.updateStyles(form, {
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        flexDirection: 'column'
    });
    form.onsubmit = () => false;
    form.className = 'mainForm';
    form = formWrapper.appendChild(form);
    formWrapper = pContent.appendChild(formWrapper);

    popup.appendChild(pContent);
    popup = document.body.insertBefore(popup, document.body.firstChild);
    let inputParent = createInput();

    popupDragger = new Draggable(popup, {noDragElems: [inputParent, inputAdder, exitBtn], Shine: popupShine});
    popupDragger.drag();


    inputAdder.addEventListener('mouseover', () => {
        Shine.updateStyles(inputAdder, {
            cursor: 'pointer' 
        });
    });
    inputAdder.addEventListener('mousedown', () => {
        inputAdderShine.addNewBoxShadow(
            og => `inset 0px 0px 3px rgba(0,0,0,0.5), ${og}`
        );
        window.addEventListener('mouseup', () => inputAdderShine.addNewBoxShadow(og => `${og}`));
    });
    inputAdder.addEventListener('click', () => popupDragger.addNoDragElems(createInput()));

    exitBtn.addEventListener('mouseover', () => {
        Shine.updateStyles(exitBtn, {
            cursor: 'pointer' 
        });
    });
    exitBtn.addEventListener('mousedown', () => {
        exitBtnShine.addNewBoxShadow(
            og => `inset 0px 0px 3px rgba(0,0,0,0.5), ${og}`
        );
        window.addEventListener('mouseup', () => exitBtnShine.addNewBoxShadow(og => `${og}`));
    });
    exitBtn.addEventListener('mouseup', () => {
        showPopup();
    });
});

chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if((msg.from === 'background') && (msg.subject === 'open_popup')){
        showPopup();
    }
});


function changeCurrent(e){
    e.preventDefault();
}

function changeColor(key, color){
    let matches = document.querySelectorAll(`highlight-me.${key}`);
    matches.forEach((elem) => {
        elem.style.backgroundColor = color;
        elem.style.color = invertColor(color);
    });
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
            var highlightMeElem = document.createElement("highlight-me");

            highlightMeElem.className = `chrome-regeggz-highlight-me ${key}`;
            if(CUR_INDEX === 0){
                highlightMeElem.className += ' current';
            }
            highlightMeElem.style.backgroundColor = `${color}`;
            highlightMeElem.style.color = invertColor(color);

            // highlightMeElem.id = `${CUR_INDEX}|${key}|${multiNodeMatchId}`;

            CUR_INDEX = multiNodeMatchId > -1 ? CUR_INDEX : CUR_INDEX + 1;

            highlightMeElem.textContent = match;
            return highlightMeElem;
        }, 'regeggs-card');

    }
}

function showPopup(){
    if(popup.style.visibility === 'hidden'){
        popup.style.visibility = 'visible';
        ogWindow = window.scrollY;
    }else{
        popup.style.visibility = 'hidden';
    }
}
