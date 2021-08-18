
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

function createInput(){
    let form = document.querySelector('.mainForm');

    let div = document.createElement('div');
    div.className = 'inputWrapper';

    let input = document.createElement('input');
    input.className = 'myInput';
    input.type = 'text';
    input.placeholder = 'regular expression';
    input.name = `regeggs-key-${Math.random().toString(36).substr(2, 5)}`;
    input.regeggsColor = '0, 171, 37';
    div.appendChild(input);

    let count = document.createElement('span');
    count.innerHTML = '0/0';
    count.className = 'matchCount';
    div.appendChild(count);
    
    let nextPrev = document.createElement('span');
    let next = document.createElement('button');
    let prev = document.createElement('button');
    next.innerHTML = '&#8619;';
    prev.innerHTML = '&#8620;';
    nextPrev.className = 'buttonWrapper';
    nextPrev.style.display = 'inline';
    nextPrev.appendChild(next);
    nextPrev.appendChild(prev);
    div.appendChild(nextPrev);

    div = form.appendChild(div);
    div.name = 'regeggs-key-' + Math.random().toString(36).substr(2, 5);
    div.addEventListener('input', sendData);

}