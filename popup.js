
chrome.runtime.connect({ name: 'popup' });



window.addEventListener('DOMContentLoaded', () => {
    getInputs();
    if(document.querySelectorAll('input.myInput').length === 0){
        toBackground(createInput());
    }

    document
        .querySelector('#create-input')
        .addEventListener('click', () => {
            toBackground(createInput());
        })
    ;
});

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
    
    input.addEventListener('input', sendData);

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
    var data = e.target.className;
    var [color, key] = e.target.name.split('|');
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, tabs => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                from: 'popup',
                subject: 'changeCurrent',
                data,
                key,
                color
            },
            (res) => {
                var show = document.querySelector('.matchCount')
                var [top, bottom] = show.innerHTML.split('/');
                show.innerHTML = `${res}/${bottom}`;

            }
        );
    });
    
}

function sendData(e){
    var data = e.target.value;
    var key = e.target.name;
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, tabs => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                from: 'popup',
                subject: 'newDomInfo',
                data,
                color: e.path[0].regeggsColor,
                key
            },
            (res) => {
                var [top, bottom] = e.target.nextElementSibling.innerHTML.split('/');
                e.target.nextElementSibling.innerHTML = `${top}/${res-1}`;
            }
        );
    });
}
function getInputs(){
    chrome.runtime.sendMessage({
        from: 'popup',
        subject: 'getInputs'
    }, res => console.log(res));
}
function toBackground(key, color){
    let form = document.querySelector('.mainForm');
    chrome.runtime.sendMessage({
        from: 'popup',
        subject: 'newInput',
        key,
        color
    }, res => {
        if(res.length > 0){
            for(let i = 0;i<res.length;i++){
                createInput(res.key, res.color);
            }
        }
    });
}