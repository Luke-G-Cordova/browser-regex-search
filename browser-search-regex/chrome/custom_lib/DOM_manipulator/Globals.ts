namespace Globals {
  export let CUR_INDEX = 0;
  export let ELEM_KEYS: string[] = [];
  export let CURRENT_INDEXES: number[] = [];
  export let MY_HIGHLIGHTS: any = [];
  export let DEF_REJECTS = ['\\', ''];
  export let popup: HTMLElement | null;
  export let popupDragger: any;
  export const getGI = (key: string) => ELEM_KEYS.indexOf(key);
}
