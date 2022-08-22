chrome.runtime.onMessage.addListener((msg) => {
  if (msg.from === 'background' && msg.subject === 'open_popup') {
    showPopup();
  }
});

const showPopup = () => {
  console.log('hello world');
};
