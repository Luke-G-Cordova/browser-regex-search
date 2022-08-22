/**
 * sends data to different parts of the extension
 * @param data object to be sent
 */
const sendData = (data: communicationInfo) => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      if (tabs[0].id != null) {
        chrome.tabs.sendMessage(tabs[0].id, data);
      } else {
        console.error('tabId is undefined');
      }
    }
  );
};

/**
 * these send the open_popup event to the content scripts
 */
chrome.commands.onCommand.addListener((command) => {
  if (command === 'open_popup') {
    let sendObj: communicationInfo = {
      from: 'background',
      subject: command,
    };
    sendData(sendObj);
  }
});

chrome.action.onClicked.addListener(() => {
  let sendObj: communicationInfo = {
    from: 'background',
    subject: 'open_popup',
  };
  sendData(sendObj);
});
