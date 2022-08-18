chrome.commands.onCommand.addListener((command) => {
  if (command === "open_popup") {
    let sendObj: communicationInfo = {
      from: "background",
      subject: command,
    };
    sendData(sendObj);
  }
});

chrome.action.onClicked.addListener(() => {
  let sendObj: communicationInfo = {
    from: "background",
    subject: "open_popup",
  };
  sendData(sendObj);
});

const sendData = (sendObj: communicationInfo) => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      if (tabs[0].id != null) {
        chrome.tabs.sendMessage(tabs[0].id, sendObj);
      } else {
        console.error("tabId is undefined");
      }
    }
  );
};
