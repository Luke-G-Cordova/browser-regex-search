



let elem = document.createElement('regeggs-card');
let elemShine = new Shine(elem);
elemShine.updateStyles({
    backgroundColor: 'teal', 
    width: '400px', 
    height: '150px', 
    position: 'absolute', 
    top:`${20 + window.scrollY}px`, 
    left: `${20 + window.scrollX}px`, 
    borderRadius: '10px', 
    display: 'flex', 
    flexDirection: 'column', 
    padding: '25px'
});

let addBtn = document.createElement('button');
addBtn.innerHTML = '+';
addBtn = elem.appendChild(addBtn);
elem = document.body.insertBefore(elem, document.body.firstChild);

let popupDragger = new Draggable(elem, {noDragElems: [addBtn], Shine: elemShine});
popupDragger.drag();


addBtn.addEventListener('click', () => {
    let elem = document.querySelector('regeggs-card');
    let input = document.createElement('input');
    input.type = 'text';
    elem = elem.appendChild(input);
    popupDragger.addNoDragElems([input]);
});

// dragPopup(document.querySelector('regeggs-card'), {noDragElems: [input, div, p], Shine: elemShine});