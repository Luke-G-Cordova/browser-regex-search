namespace Components {
  export const BsrPopup = (styles?: string): HTMLElement => {
    let div = document.createElement('div');
    div.innerHTML = `
      <bsr-popup-card style="${styles}">
        <bsr-div id="bsr-p-content">
          <bsr-div id="bsr-control-wrapper">
            <bsr-div id="bsr-input-button" class="controlButton">+</bsr-div>
            <bsr-div id="bsr-exit-button" class="controlButton">X</bsr-div>
          </bsr-div>
          <bsr-div id="bsr-form-wrapper">
          </bsr-div>
        </bsr-div>
      </bsr-popup-card>
    `;
    if (div.firstElementChild instanceof HTMLElement) {
      return div.firstElementChild;
    } else {
      throw 'creation of bsr-popup-card failed';
    }
  };

  export const NewInput = (key: string) => {
    let div = document.createElement('div');
    div.innerHTML = `
      <bsr-div>
        <bsr-div class="icWrapper" style="width: 100%;">
          <input class="mainInputField" type="text" placeholder="regular expression" name="${key}" />
          <bsr-span class="modifiersWrapper">
            <bsr-button style="">/i</bsr-button>
            <bsr-button style="">/r</bsr-button>
            <bsr-button style="">/s</bsr-button>
            <bsr-button style="">/l</bsr-button>
            <input type="number" style="width:50px;" />
          </bsr-span>
          <bsr-span class="matchCount" style="float: right;">
            <bsr-span id="count-numerator">0</bsr-span>
            <bsr-span>/</bsr-span>
            <bsr-span id="count-denominator">0</bsr-span>
          </bsr-span>
        </bsr-div>
        <bsr-div class="buttonWrapper">
          <bsr-div class="npWrapper" style="float: left; display: flex; align-items: center;">
            <bsr-button class="prev" style="box-shadow: rgba(255, 255, 255, 0.5) 0px 2px 0px inset, rgba(0, 0, 0, 0.3) 0px -2px 0px inset;">
              ⇐
            </bsr-button>
            <bsr-button class="next" style="box-shadow: rgba(255, 255, 255, 0.5) 0px 2px 0px inset, rgba(0, 0, 0, 0.3) 0px -2px 0px inset;">
              ⇒
            </bsr-button>
            <bsr-button class="minus" style="box-shadow: rgba(255, 255, 255, 0.5) 0px 2px 0px inset, rgba(0, 0, 0, 0.3) 0px -2px 0px inset;">
              -
            </bsr-button>
            <bsr-button title="Copy This Selection" class="copySelection" style="box-shadow: rgba(255, 255, 255, 0.5) 0px 2px 0px inset, rgba(0, 0, 0, 0.3) 0px -2px 0px inset;">
              ⛶
            </bsr-button>
          </bsr-div>
          <bsr-div class="cWrapper">
            <bsr-p style="margin: 0px 5px;">#ffff00</bsr-p>
            <input type="color" class="colorInput" value="#FBFF00" style="box-shadow: rgba(255, 255, 255, 0.5) 0px 2px 0px inset, rgba(0, 0, 0, 0.3) 0px -2px 0px inset;">
          </bsr-div>
        </bsr-div>
      </bsr-div>
      `;
    if (div.firstElementChild instanceof Node) {
      return div.firstElementChild as HTMLElement;
    } else {
      throw 'creation of input failed';
    }
  };
}
