/// <reference path="./custom_lib/DOM_manipulator/DomPopup.ts" />

chrome.runtime.onMessage.addListener((msg: communicationInfo) => {
  if (msg.from === 'background' && msg.subject === 'open_popup') {
    DomPopup.showPopup();
  }
});
