namespace Globals {
  export let CUR_INDEX = 0;
  export let ELEM_KEYS: string[] = [];
  export let CURRENT_INDEXES: number[] = [];
  export let MY_HIGHLIGHTS: any = [];
  export let DEF_REJECTS = ['\\', ''];
  export let INPUT_AMT: number = 0;
  export let popup: HTMLElement | null;
  export let popupDragger: any;

  /**
   * gets the index of key in Globals.ELEM_KEYS
   * @param key the key signifying which index to return
   * @returns the index of the key in ELEM_KEYS. -1 if not found.
   */
  export const getGI = (key: string) => ELEM_KEYS.indexOf(key);
  export let formWrapper: HTMLElement | null;
}

customElements.define('bsr-popup-card', Components.BSRPopupCard);
customElements.define('bsr-input', Components.BSRInput);
