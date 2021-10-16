
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
    popup.id = 'chrepo-id'; //ch(chrome)re(regeggs)po(popup)-id

    popupShine = new Shine(popup);
    popupShine.updateStyles({
        visibility: 'hidden',
        top:`${20 + window.scrollY}px`, 
        left: `${20 + window.scrollX}px`
    });

    let pContent = document.createElement('div');
    pContent.className = 'pContent';
    pContent.id = 'chrepo-pCont-id';
    let pContentShine = new Shine(pContent, {bubble: false});

    let controllWrapper = document.createElement('div');
    controllWrapper.className = 'controllWrapper';
    controllWrapper.id = 'chrepo-conWrapper-id';

    let inputAdder = document.createElement('div');
    inputAdder.className = 'controllButton';
    inputAdder.id = 'chrepo-inputAdder-id';
    
    let inputAdderShine = new Shine(inputAdder, {overrideArgs: [2, 22, 3, 4]});
    inputAdder.innerHTML = '+';
    
    let exitBtn = document.createElement('div');
    exitBtn.className = 'controllButton';
    exitBtn.id = 'chrepo-exitBtn-id';
    
    let exitBtnShine = new Shine(exitBtn, {overrideArgs: [2, 22, 3, 4]});
    exitBtn.innerHTML = 'X';
    
    exitBtn = controllWrapper.appendChild(exitBtn);
    inputAdder = controllWrapper.appendChild(inputAdder);

    controllWrapper = pContent.appendChild(controllWrapper);
    
    let formWrapper = document.createElement('div');
    formWrapper.className = 'formWrapper';
    formWrapper.id = 'chrepo-formWrapper-id';

    let form = document.createElement('form');
    form.onsubmit = () => false;
    form.className = 'mainForm';
    form.id = 'chrepo-form-id';
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


function showPopup(){
    if(popup.style.visibility === 'hidden'){
        popup.style.visibility = 'visible';
        ogWindow = window.scrollY;
    }else{
        popup.style.visibility = 'hidden';
    }
}
