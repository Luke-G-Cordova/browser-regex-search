namespace Components {
  export const styles = /*css*/ `
    *{
      font-family: 'Almarai';
    }
    /* no select */
    div {
      user-select: none;
    }
    span {
      user-select: none;
    }

    /* custom break */
    bsr-break {
      display: block;
      height: 0.5px;
      margin: 0 5% 2% 5%;
      background-color: #3c3f41;
    }

    /* scroll bars */
    .BSRScrollBar {
      max-height: inherit;
      overflow-y: scroll;
    }
    .BSRScrollBar::-webkit-scrollbar {
      width: 4px;
    }
    .BSRScrollBar::-webkit-scrollbar-track {
      background-color: #3c3f41;
    }
    .BSRScrollBar::-webkit-scrollbar-thumb {
      background-color: #111113;
      border-radius: 4px;
    }

    /* control wrapper */
    #bsr-control-wrapper {
      display: inline-block;
      width: 100%;
    }
    #bsr-input-button {
      float: left;
    }
    #bsr-exit-button {
      float: right;
    }
    .BSRControlButton {
      padding: 5px;
      margin: 3px;
      display: inline-block;
    }

    /* buttons */
    .BSRButton {
      color: #6b7074;
      transition: color 500ms ease-out;
    }
    .BSRButton:hover {
      color: #acaeb1;
      cursor: pointer;
    }

    /* form wrapper, inputs are children of this wrapper */
    #bsr-form-wrapper {
      padding: 5%;
    }

    /* top half of an input */
    .BSRInputTopHalf {
      display: flex;
    }
    .BSRInputTopHalf > :first-child {
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
    }
    .BSRInputTopHalf > :nth-child(2) {
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
    }

    /* main input, this is where a search term is entered */
    input.BSRMainInputField {
      background-color: #111113;
      color: #e8eaed;
      border: 1px solid #6b7074;
      height: 25px;
      width: 200px;
      margin: 0;
      padding-left: 5px;
      box-sizing: border-box;
    }
    input.BSRMainInputField::placeholder {
      color: #55595d;
    }

    /* search modifiers */
    .BSRModifierWrapper {
      border-top: 1px solid #6b7074;
      border-right: 1px solid #6b7074;
      border-bottom: 1px solid #6b7074;
      height: 25px;
      min-width: 25px;
      box-sizing: border-box;
      position: relative;
    }

    /* the element that when hovered shows the modifier dropdown */
    .BSRModifierCoverButton {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 25px;
      height: 25px;
    }
    .BSRModifierWrapper:hover .BSRModifierDropdown {
      visibility: visible;
      max-height: 200px;
    }

    /* modifier dropdown */
    .BSRModifierDropdown {
      visibility: hidden;
      position: absolute;
      max-height: 0px;
      width: 160px;
      overflow: hidden;
      left: -45px;
      top: 23px;
      border: 1px solid #6b7074;
      border-radius: 10px;
      overflow-x: hidden;
      z-index: 1;
      transition: max-height 1s, visibility 1s;
    }

    /* modifier buttons and inputs */
    .BSRModifierButton {
      background-color: #202124;
      padding: 5px;
      position: relative;
    }
    .BSRModifierButton label:before {
      position: absolute;
      content: '';
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
    }
    .BSRModifierButton label:hover {
      cursor: pointer;
    }
    .BSRModifierInput {
      float: right;
    }
    .BSRModifierButton:hover {
      background-color: #111113;
      padding: 5px;
    }
    .BSRMaxMatchLimitWrapper:hover {
      cursor: default;
    }
    .BSRMaxMatchLimit {
      width: 50px;
      height: 25px;
      background-color: #202124;
      color: #acaeb1;
      border: 1px solid #6b7074;
      border-radius: 3px;
      box-sizing: border-box;
    }
    .BSRColorPicker::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    .BSRColorPicker::-webkit-color-swatch {
      border: none;
    }
    .BSRColorPicker {
      -webkit-appearance: none;
      border: none;
    }
    .BSRColorPickerWrapper:hover {
      cursor: default;
    }
    .BSRColorPicker:hover {
      cursor: pointer;
    }

    /* bottom half of an input */
    .BSRInputBottomHalf {
      display: flex;
      padding-top: 5px;
    }
    .BSRActionButton {
      width: 25px;
      height: 25px;
      display: flex;
      border-radius: 7px;
      justify-content: center;
      align-items: center;
    }

    .BSRToolTip {
      background-color: #acaeb1;
      color: #202124 !important;
      position: absolute;
      top: -25px;
      left: -20px;
      padding: 2px;
      border-radius: 3px;
      opacity: 0;
      transition: opacity .2s;
    }
    .BSRCopyButton {
      position: relative;
    }
`;
}
