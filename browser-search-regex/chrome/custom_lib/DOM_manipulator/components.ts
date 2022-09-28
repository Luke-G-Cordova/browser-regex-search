namespace Components {
  export class BSRPopupCard extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });

      const bsrPopupCard = document.createElement('div');
      bsrPopupCard.className = 'BSRPopupWrapper shadowWrapper';
      bsrPopupCard.innerHTML = `
        <div id="bsr-control-wrapper">
          <span id="bsr-input-button" class="BSRButton BSRControlButton">NEW</span>
          <span id="bsr-exit-button" class="BSRButton BSRControlButton">X</span>
        </div>
        <bsr-break></bsr-break>
        <div id="bsr-form-wrapper"></div>
      `;
      Globals.formWrapper = bsrPopupCard.querySelector('#bsr-form-wrapper');

      const style = document.createElement('style');
      style.textContent = styles;
      shadowRoot.appendChild(style);
      shadowRoot.appendChild(bsrPopupCard);
    }
  }
  export class BSRInput extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });

      const bsrInput = document.createElement('div');
      bsrInput.className = 'BSRInputWrapper shadowWrapper';
      bsrInput.innerHTML = `
        <div class="BSRInputTopHalf">
          <input class="BSRMainInputField" type="text" placeholder="regular expression" name="some-key"/>
          <span class="BSRModifierWrapper">
            <div class="BSRButton BSRModifierCoverButton">V</div>
            <div class="BSRModifierDropdown">
              <div class="BSRScrollBar">
                <div class="BSRButton BSRModifierButton">
                  <input class="BSRModifierInput" id="bsr-case-sensitive" type="checkbox" />
                  <label for="bsr-case-sensitive">Case insensitive</label>
                </div>
                <div class="BSRButton BSRModifierButton">
                  <input class="BSRModifierInput" id="bsr-is-regex" type="checkbox" />
                  <label for="bsr-is-regex">Regular expression</label>
                </div>
                <div class="BSRButton BSRModifierButton">
                  <input class="BSRModifierInput" id="bsr-should-scroll" type="checkbox" />
                  <label for="bsr-should-scroll">Stop auto scroll</label>
                </div>
                <div class="BSRButton BSRModifierButton">
                  <input class="BSRModifierInput" id="bsr-levenshtein" type="checkbox" />
                  <label for="bsr-levenshtein">Loose search</label>
                </div>
                <div class="BSRButton BSRModifierButton BSRMaxMatchLimitWrapper">
                  <input class="BSRModifierInput BSRMaxMatchLimit" id="bsr-max-matches" type="number" value="100"/>
                  <div>Maximum matches</div>
                </div>
                <div class="BSRButton BSRModifierButton BSRColorPickerWrapper">
                  <input class="BSRModifierInput BSRColorPicker" id="bsr-color-input" type="color" value="#FBFF00"/>
                  <div>Selection color <span class="BSRButton">#FBFF00 <span>⛶</span></div>
                </div>
              </div>
            </div>
          </span>
        </div>
        <div class="BSRInputBottomHalf">
          <span class="BSRButton BSRActionButton">⇐</span>
          <span class="BSRButton BSRActionButton">⇒</span>
          <span class="BSRButton BSRActionButton">-</span>
          <span class="BSRButton BSRActionButton">⛶</span>
          <span style="flex-grow:1;"></span>
          <span class="BSRFoundMatches BSRActionButton">
            <span class="BSRMatcNumerator">0</span>
            /
            <span class="BSRMatcNumerator">0</span>
          </span>
        </div>
      `;
      const style = document.createElement('style');
      style.textContent = styles;

      shadowRoot.appendChild(style);
      shadowRoot.appendChild(bsrInput);
    }
  }
  export const queryShadowSelector = (elem: HTMLElement, selector: string) => {
    const shadow = elem.shadowRoot;
    if (shadow != null) {
      const childNodes = Array.from(shadow.childNodes);
      let parent = childNodes.find((node) => {
        if (
          node instanceof HTMLElement &&
          node.className.includes('shadowWrapper')
        ) {
          return node;
        }
      });
      if (parent instanceof HTMLElement && parent != null) {
        return parent.querySelector(selector);
      }
    }
    return null;
  };
}
const styles = `
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
  display: block;
}

/* modifier dropdown */
.BSRModifierDropdown {
  display: none;
  position: absolute;
  max-height: 200px;
  width: 160px;
  overflow: hidden;
  left: -45px;
  top: 23px;
  border: 1px solid #6b7074;
  border-radius: 10px;
  overflow-x: hidden;
  z-index: 1;
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
`;
