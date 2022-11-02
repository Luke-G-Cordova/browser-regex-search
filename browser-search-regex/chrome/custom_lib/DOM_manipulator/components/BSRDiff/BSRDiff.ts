namespace Components {
  export class BSRDifference extends HTMLElement {
    public spacer: HTMLElement;
    public diffWrapper: HTMLElement;
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });

      const style = document.createElement('style');
      const diffStyle = document.createElement('style');
      style.textContent = styles;
      diffStyle.textContent = BSRDiffStyles;
      shadowRoot.appendChild(style);
      shadowRoot.appendChild(diffStyle);
      shadowRoot.appendChild(bsrDiff);

      this.diffWrapper = bsrDiff.querySelector('.BSRDWrapper') as HTMLElement;

      this.spacer = this.diffWrapper.nextElementSibling as HTMLElement;
      this.spacer.style.height = this.diffWrapper.style.height;
    }
  }
}
