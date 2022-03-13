
chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if((msg.from === 'background') && (msg.subject === 'open_popup')){
        showPopup();
    }
});

function showPopup(){
    if(!popup){
        function updateStyles(styles, elem){
            // let [elem] = elem;
            for(let sty in styles) {
                elem.style[sty] = styles[sty]
            }
        }
        popup = document.createElement('regeggs-card');
    
        popup.className = 'chrome-regeggs-popup';
        popup.id = 'chrepo-id'; //ch(chrome)re(regeggs)po(popup)-id
    
        updateStyles({
            visibility: 'visible',          // this should be visible
            top:`${20 + window.scrollY}px`, 
            left: `${20 + window.scrollX}px`
        }, popup);
    
        let pContent = document.createElement('regeggs-div');
        pContent.className = 'pContent';
        pContent.id = 'chrepo-pCont-id';
    
        let controllWrapper = document.createElement('regeggs-div');
        controllWrapper.className = 'controllWrapper';
        controllWrapper.id = 'chrepo-conWrapper-id';
    
        let inputAdder = document.createElement('regeggs-div');
        inputAdder.className = 'controllButton';
        inputAdder.id = 'chrepo-inputAdder-id';
        
        inputAdder.innerHTML = '+';
        
        let exitBtn = document.createElement('regeggs-div');
        exitBtn.className = 'controllButton';
        exitBtn.id = 'chrepo-exitBtn-id';
        
        exitBtn.innerHTML = 'X';
        
        exitBtn = controllWrapper.appendChild(exitBtn);
        inputAdder = controllWrapper.appendChild(inputAdder);
    
        controllWrapper = pContent.appendChild(controllWrapper);
        
        let formWrapper = document.createElement('regeggs-div');
        formWrapper.className = 'formWrapper';
        formWrapper.id = 'chrepo-formWrapper-id';
    
        formWrapper = pContent.appendChild(formWrapper);
    
        popup.appendChild(pContent);
        popup = document.body.insertBefore(popup, document.body.firstChild);
        let inputParent = createInput();
    
        popupDragger = new Draggable(popup, {noDragElems: [inputParent, inputAdder, exitBtn]});
        popupDragger.drag();
    
    
        inputAdder.addEventListener('mouseover', () => {
            updateStyles({
                cursor: 'pointer' 
            }, inputAdder);
        });
        inputAdder.addEventListener('click', () => popupDragger.addNoDragElems(createInput()));
    
        exitBtn.addEventListener('mouseover', () => {
            updateStyles({
                cursor: 'pointer' 
            }, exitBtn);
        });
        exitBtn.addEventListener('mouseup', () => {
            showPopup();
        });
    }else{
        popup.remove();
        popup = null;
        clearHighlight(ELEM_KEYS);
    }
}
