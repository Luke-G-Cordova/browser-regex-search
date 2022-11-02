namespace Components {
  export const bsrInput = document.createElement('div');
  bsrInput.className = 'BSRInputWrapper shadowWrapper';
  bsrInput.innerHTML = /*html*/ `
<div class="BSRInputTopHalf">
  <input class="BSRMainInputField" type="text" placeholder="regular expression" name="some-key"/>
  <span class="BSRModifierWrapper">
    <div class="BSRButton BSRModifierCoverButton">V</div>
    <div class="BSRModifierDropdown">
      <div class="BSRScrollBar">
        <div class="BSRButton BSRModifierButton">
          <input class="BSRModifierInput" id="bsr-exact-match" type="checkbox" checked />
          <label for="bsr-exact-match">Exact match</label>
        </div>
        <div class="BSRButton BSRModifierButton">
          <input class="BSRModifierInput" id="bsr-is-regex" type="checkbox" />
          <label for="bsr-is-regex">Regular expression</label>
        </div>
        <div class="BSRButton BSRModifierButton">
          <input class="BSRModifierInput" id="bsr-levenshtein" type="checkbox" />
          <label for="bsr-levenshtein">Loose search</label>
        </div>
        <div class="BSRButton BSRModifierButton">
          <input class="BSRModifierInput" id="bsr-case-sensitive" type="checkbox" />
          <label for="bsr-case-sensitive">Case sensitive</label>
        </div>
        <div class="BSRButton BSRModifierButton">
          <input class="BSRModifierInput" id="bsr-should-scroll" type="checkbox" />
          <label for="bsr-should-scroll">Stop auto scroll</label>
        </div>
        <div class="BSRButton BSRModifierButton BSRMaxMatchLimitWrapper">
          <input class="BSRModifierInput BSRMaxMatchLimit" id="bsr-max-matches" type="number" value="100"/>
          <div>Maximum matches</div>
        </div>
        <div class="BSRButton BSRModifierButton BSRColorPickerWrapper">
          <input class="BSRModifierInput BSRColorPicker" id="bsr-color-input" type="color" value="#FBFF00"/>
            <div>Selection color <span class="BSRButton BSRColorFacts"><span>#FBFF00</span> <span class="BSRCopyButton BSRColorCopyButton">⛶<div class="BSRToolTip BSRColorCopyToolTip">Copied</div></span></div>
        </div>
      </div>
    </div>
  </span>
</div>
<div class="BSRInputBottomHalf">
  <span class="BSRButton BSRActionButton BSRPrevButton">⇐</span>
  <span class="BSRButton BSRActionButton BSRNextButton">⇒</span>
  <span class="BSRButton BSRActionButton BSRDeleteButton">-</span>
  <span class="BSRButton BSRActionButton BSRCopyButton">⛶</span>
  <span style="flex-grow:1;"></span>
  <span class="BSRFoundMatches BSRActionButton">
    <span class="BSRMatchNumerator">0</span>
    /
    <span class="BSRMatchDenominator">0</span>
  </span>
</div>
`;
}
