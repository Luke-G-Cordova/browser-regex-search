/// <reference path="../stylers/Styler.ts" />
/// <reference path="./Globals.ts" />
/// <reference path="../highlight/Highlighter.ts" />

namespace DomPopup {
  export const togglePopup = () => {
    if (!Globals.popup) {
      openPopup();
    } else {
      closePopup();
    }
  };

  export const openPopup = () => {
    let alreadyLinkedFont = document.querySelector('#bsr-alamari-font-link');
    let newFontLink = document.createElement('link');
    newFontLink.rel = 'stylesheet';
    newFontLink.href = 'https://fonts.googleapis.com/css?family=Almarai';
    newFontLink.id = 'bsr-alamari-font-link';
    if (alreadyLinkedFont) {
      alreadyLinkedFont.remove();
    }
    document.head.appendChild(newFontLink);

    Globals.popup = document.createElement('bsr-popup-card');
    Object.assign(Globals.popup.style, {
      top: `${20 + window.scrollY}px`,
      left: `${20 + window.scrollX}px`,
    });
    Globals.popup = document.body.insertBefore(
      Globals.popup,
      document.body.firstChild
    );

    const formWrapper = Components.queryShadowSelector(
      Globals.popup,
      '#bsr-form-wrapper'
    );
    const exitBtn = Components.queryShadowSelector(
      Globals.popup,
      '#bsr-exit-button'
    );
    const inputBtn = Components.queryShadowSelector(
      Globals.popup,
      '#bsr-input-button'
    );

    if (
      formWrapper instanceof HTMLElement &&
      inputBtn instanceof HTMLElement &&
      exitBtn instanceof HTMLElement
    ) {
      // create draggable
      Globals.popupDragger = new Styler.Draggable(Globals.popup, [
        formWrapper,
        inputBtn,
        exitBtn,
      ]);
      Globals.popupDragger.drag();

      // add original input
      formWrapper.appendChild(document.createElement('bsr-input'));

      // add input if clicked
      inputBtn.addEventListener('click', () => {
        if (formWrapper != null && Globals.INPUT_AMT < 6) {
          formWrapper.appendChild(document.createElement('bsr-input'));
        }
      });

      // exit popup if clicked
      exitBtn.addEventListener('mouseup', () => {
        closePopup();
      });
    } else {
      throw 'could not find element';
    }
  };
  export const closePopup = () => {
    if (Globals.popup != null) {
      Globals.popup.remove();
      Globals.popup = null;
      Highlighter.clearHighlight(Globals.ELEM_KEYS);
    }
  };
}
