
var inputs = [];
chrome.runtime.onConnect.addListener((port) => {
    if(port.name === 'popup'){
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
chrome.commands.onCommand.addListener((command) => {
    console.log(`Command "${command}" triggered`);
});
chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if(msg.from === 'popup' && msg.subject === 'getInputs'){
        response(inputs);
    }
});

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
