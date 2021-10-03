



let elem = document.createElement('regeggs-card');
let elemShine = new Shine(elem, {resizeable: false, shadows: ['-2 -3 5px rgba(0,0,0,.5)']});
elemShine.updateStyles({
    backgroundColor: 'teal', 
    width: '400px', 
    height: '150px', 
    position: 'absolute', 
    top:`${20 + window.scrollY}px`, 
    left: `${200 + window.scrollX}px`, 
    borderRadius: '10px', 
    display: 'flex', 
    flexDirection: 'column', 
    padding: '100px'
});

let btn = document.createElement('button');
btn.innerHTML = '+';
btn = elem.appendChild(btn);

elem = document.body.insertBefore(elem, document.body.firstChild);

let popupDragger = new Draggable(elem, { noDragElems: [btn], Shine: elemShine});

btn.addEventListener('click', createNewChild.bind(popupDragger));

function createNewChild(e){
    let div = document.querySelector('regeggs-card');
    let input = document.createElement('input');
    input.className = 'myInput';
    input.type = 'text';
    input.placeholder = 'regular expression';
    input = div.appendChild(input);
    this.addNoDragElems(input);

}