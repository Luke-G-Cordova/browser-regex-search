/// <reference path="./custom_lib/DOM_manipulator/DomPopup.ts" />

chrome.runtime.onMessage.addListener((msg: communicationInfo) => {
  if (msg.from === 'background' && msg.subject === 'toggle_popup') {
    DomPopup.togglePopup();
  }
});
