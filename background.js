
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
