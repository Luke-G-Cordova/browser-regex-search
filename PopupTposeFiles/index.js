



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
});
let input = document.createElement('input');
input = elem.appendChild(input);
let div = document.createElement('div');
div.style.padding = '5px';
div.style.backgroundColor = 'black';
let p = document.createElement('p');
p.innerHTML = 'hello';
p.style.color = 'white';
p = div.appendChild(p);
div = elem.appendChild(div);

elem = document.body.insertBefore(elem, document.body.firstChild);

dragPopup(document.querySelector('regeggs-card'), {noDragElems: [input, div, p], Shine: elemShine});