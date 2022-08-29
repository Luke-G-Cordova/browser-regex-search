chrome.runtime.onMessage.addListener((msg) => {
  if (msg.from === 'background' && msg.subject === 'open_popup') {
    showPopup();
  }
});

const showPopup = () => {
  let popup = document.createElement('bsr-popup-card');
  popup.id = 'bsr-popup-card-id';
  popup.style.top = `${20 + window.scrollY}px`;
  popup.style.left = `${20 + window.scrollX}px`;
  popup = document.body.insertBefore(popup, document.body.firstChild);

  // let popupDragger = new Draggable(popup);
  // popupDragger.drag();
};
