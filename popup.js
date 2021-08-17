
chrome.runtime.connect({ name: 'popup' });

var inputs;
window.addEventListener('DOMContentLoaded', () => {
    inputs = document.querySelectorAll('input');
    inputs.forEach(elem => {
        elem.name = 'regeggs-key-' + Math.random().toString(36).substr(2, 5);
        elem.addEventListener('input', sendData);
    })
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
                color: e.path[0].id,
                key
            }
        );
    });
}