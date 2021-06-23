
var inputs;
window.addEventListener('DOMContentLoaded', () => {
    inputs = document.querySelectorAll('input');
    inputs.forEach(elem => {
        elem.addEventListener('input', sendData);
    })
});


function sendData(e){
    var data = e.target.value;
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, tabs => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                from: 'popup',
                subject: 'newDomInfo',
                data
            },
            setDomInfo
        );
    });
}
function setDomInfo(info) {
    // console.log(info);
}

// const form = document.querySelector('form');

// form.addEventListener('formdata', (e) => {
//     chrome.runtime.sendMessage('send-popup-info', e, () => {
//         console.log('info sent');
//     });
// });

// function myUpdateFunc(e){
//     console.log('hello');
// }


// let listenForChange = new Promise( (res, rej) => {
//     while(true){

//     }
// });


// chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {

//     if (message === 'get-popup-info') {
//         inCurrentTab((tab) => {
//             chrome.action.getPopup({tabId: tab.id}, (res) => {
//                 sendResponse(res);
//             });
            
//         });
//     }
// });

// function inCurrentTab(callback){
//     chrome.tabs.query(
//         {currentWindow: true, active: true},
//         (tabArray) => {callback(tabArray[0]);}
//     );
// }