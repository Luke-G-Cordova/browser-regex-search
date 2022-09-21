/// <reference path="../stylers/Styler.ts" />
/// <reference path="./Globals.ts" />
/// <reference path="../highlight/Highlighter.ts" />
/// <reference path="./components.ts" />
/// <reference path="./BSRElements.ts" />

namespace DomPopup {
  export const showPopup = () => {
    if (!Globals.popup) {
      Globals.popup = Components.BsrPopup(
        `top: ${20 + window.scrollY}px; left: ${20 + window.scrollX}px;`
      );
      Globals.popup = document.body.insertBefore(
        Globals.popup,
        document.body.firstChild
      );
      const formWrapper = document.querySelector('#bsr-form-wrapper');
      const exitBtn = document.querySelector('#bsr-exit-button');
      const inputBtn = document.querySelector('#bsr-input-button');

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
        new BSRElements.BSRMainInput(formWrapper);

        // change pointer on mouseover
        inputBtn.addEventListener('mouseover', () => {
          Object.assign(inputBtn, { cursor: 'pointer' });
        });

        // add input if clicked
        inputBtn.addEventListener('click', () => {
          new BSRElements.BSRMainInput(formWrapper);
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
