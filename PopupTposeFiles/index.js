



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
// ${window.innerHeight - (window.innerHeight - 20) + window.scrollY}
// ${window.innerWidth - 420 + window.scrollX}
let input = document.createElement('input');
input = elem.appendChild(input);
let p = document.createElement('p');
p.innerHTML = 'hello';
p = elem.appendChild(p);

elem = document.body.insertBefore(elem, document.body.firstChild);

dragPopup(document.querySelector('regeggs-card'), {noDragElems: [input, p]});