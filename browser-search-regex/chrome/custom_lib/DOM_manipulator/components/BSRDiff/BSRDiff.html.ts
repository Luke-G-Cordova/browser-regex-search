namespace Components {
  export const bsrDiff = document.createElement('div');
  bsrDiff.className = 'BSRDiffWrapper shadowWrapper';
  bsrDiff.innerHTML = /*html*/ `
<div class="BSRDWrapper">
  <div class="BSRDTop">
    <div class="BSRDLeft BSRDHalf">
      <div class="BSRDSearchTerm BSRDComparison">hello I am Luke</div>
    </div>
    <div class="BSRDRight BSRDHalf">
      <div class="BSRDCurrentMatch BSRDComparison">
        H<span class="similar">ello </span>i<span class="similar"> am </span
        >Jack
      </div>
    </div>
  </div>
  <div class="BSRDBottom">hHello Ii am LukeJack</div>
</div>
<div></div>
`;
}
