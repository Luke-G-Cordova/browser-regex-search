/// <reference path="../stylers/Styler.ts" />
/// <reference path="./Globals.ts" />
/// <reference path="../highlight/Highlighter.ts" />
/// <reference path="./BSRElements.ts" />

namespace DomPopup {
  export const showPopup = () => {
    if (!Globals.popup) {
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

        // change pointer on mouseover
        inputBtn.addEventListener('mouseover', () => {
          Object.assign(inputBtn, { cursor: 'pointer' });
        });

        // add input if clicked
        inputBtn.addEventListener('click', () => {
          if (formWrapper != null) {
            formWrapper.appendChild(document.createElement('bsr-input'));
          }
        });

        // change pointer on mouseover
        exitBtn.addEventListener('mouseover', () => {
          Object.assign(exitBtn, { cursor: 'pointer' });
        });

        // exit popup if clicked
        exitBtn.addEventListener('mouseup', () => {
          showPopup();
        });
      } else {
        throw 'could not find element';
      }
    } else {
      Globals.popup.remove();
      Globals.popup = null;
      Highlighter.clearHighlight(Globals.ELEM_KEYS);
    }
  };
}
