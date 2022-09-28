class BSRInput extends HTMLElement {
  constructor(...args) {
    super(...args);

    const shadowRoot = this.attachShadow({ mode: 'open' });

    let inputElement = document.createElement('input');
    inputElement.setAttribute('type', this.getAttribute('type'));
    inputElement.setAttribute('placeholder', this.getAttribute('placeholder'));
    let style = document.createElement('style');
    style.textContent = `
    input[type="text"]{
      background-color: #111113;
      color: #e8eaed;
      border: 1px solid #6b7074;
      height: 25px;
      width: 200px;
      margin: 0;
      padding-left: 5px;
      box-sizing: border-box;
    }
    input.BSRMainInputField[type="text"]::placeholder {
      color: #55595d;
    }
    `;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(inputElement);
  }
}
class BSRLabel extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });

    let labelElement = document.createElement('label');
    labelElement.setAttribute('for', this.getAttribute('for'));

    shadowRoot.appendChild(labelElement);
  }
}

customElements.define('bsr-input', BSRInput);
customElements.define('bsr-label', BSRLabel);
