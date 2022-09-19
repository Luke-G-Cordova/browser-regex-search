namespace Components {
  export const BsrPopup = (styles: ElementCSSInlineStyle) => {
    return `
    <!-- BSR POPUP START -->
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
    <!-- BSR POPUP END -->
    `;
  };

  export const NewInput = (
    key: string = `regex-key-${Math.random().toString(36).substring(2, 5)}`
  ) => {
    return `
      <!-- NEW INPUT START -->
      <bsr-div id="bsr-input-wrapper">
        <bsr-div class="icWrapper" id="bsr-ic-wrapper" style="width: 100%;">
          <input class="myInput" id="bsr-new-input" type="text" placeholder="regular expression" name="${key}" />
          <bsr-span class="modifiersWrapper" id="bsr-modifiers-wrapper">
            <bsr-button style="">/i</bsr-button>
            <bsr-button style="">/r</bsr-button>
            <bsr-button style="">/s</bsr-button>
            <bsr-button style="">/l</bsr-button>
            <input type="number" style="width:50px;" />
          </bsr-span>
          <bsr-span class="matchCount" style="float: right;">
            <bsr-span>0</bsr-span>
            <bsr-span>/</bsr-span>
            <bsr-span>0</bsr-span>
          </bsr-span>
        </bsr-div>
        <bsr-div class="buttonWrapper" id="bsr-button-wrapper">
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
          <bsr-div class="cWrapper" id="bsr-c-wrapper">
            <bsr-p style="margin: 0px 5px;">#ffff00</bsr-p>
            <input type="color" class="colorInput" style="box-shadow: rgba(255, 255, 255, 0.5) 0px 2px 0px inset, rgba(0, 0, 0, 0.3) 0px -2px 0px inset;">
          </bsr-div>
        </bsr-div>
      </bsr-div>
      <!-- NEW INPUT END -->
      `;
  };
}
