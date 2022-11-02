namespace Components {
  export const bsrPopupCard = document.createElement('div');
  bsrPopupCard.className = 'BSRPopupWrapper shadowWrapper';
  bsrPopupCard.innerHTML = /*html*/ `
<div id="bsr-control-wrapper">
  <span id="bsr-input-button" class="BSRButton BSRControlButton">NEW</span>
  <span id="bsr-exit-button" class="BSRButton BSRControlButton">X</span>
</div>
<bsr-break></bsr-break>
<div id="bsr-form-wrapper"></div>
  `;
}
