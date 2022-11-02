namespace Components {
  export class BSRDifference extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });

      const style = document.createElement('style');
      style.textContent = styles;
      shadowRoot.appendChild(style);
      shadowRoot.appendChild(bsrDiff);
    }
  }
}
