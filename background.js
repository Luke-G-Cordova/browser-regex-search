

// listen for a connection from the popup script
chrome.runtime.onConnect.addListener((port) => {
    if(port.name === 'popup'){
        // when the popup script is out of focus, 
        // send a message to the domManip to clear 
        // any left over highlight
        port.onDisconnect.addListener(() => {
            let sendObj = {
                from: 'background',
                subject: 'popupClosed',
                data: ''
            };
            sendData(sendObj);
            console.log('popup closed');
        });
    }
});

// send data based on a sendObj object
function sendData(sendObj){
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, tabs => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            sendObj
        );
    });
}