
chrome.runtime.connect({ name: 'popup' });



var inputs;
window.addEventListener('DOMContentLoaded', () => {
    // inputs = document.querySelectorAll('input');
    // inputs.forEach(elem => {
    //     elem.name = 'regeggs-key-' + Math.random().toString(36).substr(2, 5);
    //     elem.addEventListener('input', sendData);
    // });
    createInput();
    document
        .querySelector('#create-input')
        .addEventListener('click', createInput)
    ;
});

function createInput(){
    let form = document.querySelector('.mainForm');
    let key = `regeggs-key-${Math.random().toString(36).substr(2, 5)}`;
    let color = '0, 171, 37';

    let div = document.createElement('div');
    div.className = 'inputWrapper';

    let input = document.createElement('input');
    input.className = 'myInput';
    input.type = 'text';
    input.placeholder = 'regular expression';
    input.name = key;
    input.regeggsColor = color;
    div.appendChild(input);

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
    prev.addEventListener('click', changeCurrent);
    next.addEventListener('click', changeCurrent);



    div = form.appendChild(div);
    div.name = 'regeggs-key-' + Math.random().toString(36).substr(2, 5);
    div.addEventListener('input', sendData);

}
function changeCurrent(e){
    e.preventDefault();
    var data = e.target.className;
    var [color, key] = e.target.name.split('|');
    console.log(color);
    console.log(key);
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
                e.target.nextElementSibling.innerHTML = ` 0/${res}`;
            }
        );
    });
}
