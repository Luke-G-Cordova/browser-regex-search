

chrome.commands.onCommand.addListener((command) => {
    if(command === 'open_popup'){
        let sendObj = {
            from: 'background',
            subject: command
        };
        sendData(sendObj);
    }
});
chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if(msg.from === 'highlight'){
        if(msg.subject === 'newTabIframe'){
            chrome.tabs.create({url:msg.url});
        }
    }
});
chrome.action.onClicked.addListener((tab) => {
    let sendObj = {
        from: 'background', 
        subject: 'open_popup'
    }
    sendData(sendObj);
    
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
