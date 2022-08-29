/// <reference path="./custom_lib/stylers/Styler.ts" />
/// <reference path="./Globals.ts" />

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.from === 'background' && msg.subject === 'open_popup') {
    showPopup();
  }
});

const showPopup = () => {
  if (!Globals.popup) {
    Globals.popup = document.createElement('bsr-popup-card');
    Globals.popup.id = 'bsr-popup-card-id';

    Object.assign(Globals.popup.style, {
      visibility: 'visible', // this should be visible
      top: `${20 + window.scrollY}px`,
      left: `${20 + window.scrollX}px`,
    });

    let pContent = document.createElement('regex-div');
    pContent.id = 'regex-p-content-id';

    let controlWrapper = document.createElement('regex-div');
    controlWrapper.id = 'regex-control-wrapper-id';

    let inputAdder = document.createElement('regex-div');
    inputAdder.className = 'controlButton';
    inputAdder.id = 'regex-input-adder-id';

    inputAdder.innerHTML = '+';

    let exitBtn = document.createElement('regex-div');
    exitBtn.className = 'controlButton';
    exitBtn.id = 'regex-exit-button-id';

    exitBtn.innerHTML = 'X';

    exitBtn = controlWrapper.appendChild(exitBtn);
    inputAdder = controlWrapper.appendChild(inputAdder);

    controlWrapper = pContent.appendChild(controlWrapper);

    let formWrapper = document.createElement('regex-div');
    formWrapper.className = 'formWrapper';
    formWrapper.id = 'regex-form-wrapper-id';

    formWrapper = pContent.appendChild(formWrapper);

    Globals.popup.appendChild(pContent);
    Globals.popup = document.body.insertBefore(
      Globals.popup,
      document.body.firstChild
    );
    // let inputParent = createInput();

    const popupDragger = new Styler.Draggable(Globals.popup, [
      // inputParent,
      inputAdder,
      exitBtn,
    ]);
    popupDragger.drag();

    inputAdder.addEventListener('mouseover', () => {
      Object.assign(inputAdder, { cursor: 'pointer' });
    });
    // inputAdder.addEventListener('click', () =>
    //   popupDragger.addNoDragElems(createInput())
    // );

    exitBtn.addEventListener('mouseover', () => {
      Object.assign(exitBtn, { cursor: 'pointer' });
    });
    exitBtn.addEventListener('mouseup', () => {
      showPopup();
    });
  } else {
    Globals.popup.remove();
    Globals.popup = null;
    // clearHighlight(ELEM_KEYS);
  }
};
