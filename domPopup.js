
var popup = createPopup();

chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if((msg.from === 'background') && (msg.subject === 'open_popup')){
        if(popup.style.display === 'none'){
            popup.style.display = 'block';
        }else{
            popup.style.display = 'none';
        }
    }
});


function createPopup() {
    let div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.top = '100px';
    div.style.right = '100px';
    div.style.zIndex = '1000';
    div.style.backgroundColor = 'white';
    div.style.borderRadius = '10px';
    div.style.border = '2px solid black';
    div.style.display = 'none';
    div.style.padding = '25px';

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
    btn.addEventListener('click', () => createInput());
    return div;
}
function createInput(key, color){
    let form = document.querySelector('.mainForm');
    key || (key = `regeggs-key-${Math.random().toString(36).substr(2, 5)}`);
    color || (color = '0, 171, 37');

    let div = document.createElement('div');
    div.name = key;
    div.className = 'inputWrapper';

    let input = document.createElement('input');
    input.className = 'myInput';
    input.type = 'text';
    input.placeholder = 'regular expression';
    input.name = key;
    input.regeggsColor = color;
    input = div.appendChild(input);

    let count = document.createElement('span');
    count.innerHTML = '0/0';
    count.className = 'matchCount';
    div.appendChild(count);
    


    let nextPrev = document.createElement('span');

    let next = document.createElement('button');
    let prev = document.createElement('button');

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

    div.appendChild(nextPrev);


    div = form.appendChild(div);
    
    // input.addEventListener('input', sendData);

    document
        .querySelector(`button.next[name="${next.name}"]`)
        .addEventListener('click', changeCurrent);
    document
        .querySelector(`button.prev[name="${prev.name}"]`)
        .addEventListener('click', changeCurrent)
    ;
    return div;
}

function changeCurrent(e) {
    e.preventDefault();
}