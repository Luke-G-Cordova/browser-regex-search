
var popup = createPopup();
dragPopup(document.querySelector('div.chrome-regex-popup:not(div.chrome-regex-popup *)'));

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
        if(div.style.display === 'none'){
            div.style.display = 'block';
        }else{
            div.style.display = 'none';
        }
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
    
    // input.addEventListener('input', sendData);

    colorInput.addEventListener('input', (e) => updateColor(colorInput.value, key));

    document
        .querySelector(`button.next[name="${next.name}"]`)
        .addEventListener('click', changeCurrent);
    document
        .querySelector(`button.prev[name="${prev.name}"]`)
        .addEventListener('click', changeCurrent)
    ;
    return div;
}

function updateColor(color, key){

}

function changeCurrent(e) {
    e.preventDefault();
}

function dragPopup(elem){
    var startX, startY, endX, endY;
    var ogWindow = window.scrollY;
    var border = 10;
    elem.onmousedown = (e) => {
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
        elem.style.top = elem.offsetTop + window.scrollY - ogWindow + 'px';
        ogWindow = window.scrollY;
    }
}