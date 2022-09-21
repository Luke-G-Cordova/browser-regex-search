/// <reference path="../stylers/Styler.ts" />
/// <reference path="./Globals.ts" />
/// <reference path="../highlight/Highlighter.ts" />
/// <reference path="./components.ts" />
/// <reference path="./BSRElements.ts" />

interface highlightMeOptions {
  match: string;
  color: string;
  mods: string;
  litReg: boolean;
  limit: number;
  loose: boolean;
}
interface nextMatchOptions {
  direction: number;
  newStyles: any;
  oldStyles: any;
  scrollBehavior: 'smooth' | 'auto';
  scrollable: boolean;
}
namespace DomPopup {
  export const showPopup = () => {
    if (!Globals.popup) {
      Globals.popup = Components.BsrPopup(
        `top: ${20 + window.scrollY}px; left: ${20 + window.scrollX}px;`
      );
      Globals.popup = document.body.insertBefore(
        Globals.popup,
        document.body.firstChild
      );
      const formWrapper = document.querySelector('#bsr-form-wrapper');
      const exitBtn = document.querySelector('#bsr-exit-button');
      const inputBtn = document.querySelector('#bsr-input-button');

      if (
        formWrapper instanceof HTMLElement &&
        inputBtn instanceof HTMLElement &&
        exitBtn instanceof HTMLElement
      ) {
        // create draggable
        Globals.popupDragger = new Styler.Draggable(Globals.popup, [
          formWrapper,
          inputBtn,
          exitBtn,
        ]);
        Globals.popupDragger.drag();

        // add original input
        new BSRElements.BSRMainInput(formWrapper);

        // change pointer on mouseover
        inputBtn.addEventListener('mouseover', () => {
          Object.assign(inputBtn, { cursor: 'pointer' });
        });

        // add input if clicked
        inputBtn.addEventListener('click', () => {
          new BSRElements.BSRMainInput(formWrapper);
        });

        // change pointer on mouseover
        exitBtn.addEventListener('mouseover', () => {
          Object.assign(exitBtn, { cursor: 'pointer' });
        });

        // exit popup if clicked
        exitBtn.addEventListener('mouseup', () => {
          showPopup();
        });
      } else {
        throw 'could not find element';
      }
    } else {
      Globals.popup.remove();
      Globals.popup = null;
      Highlighter.clearHighlight(Globals.ELEM_KEYS);
    }
  };

  // export const createInput = (
  //   key: string = `regex-key-${Math.random().toString(36).substring(2, 5)}`
  // ) => {
  //   let form = document.querySelector('regex-div#regex-form-wrapper-id');
  //   if (form == null) {
  //     console.error('form is null');
  //     return null;
  //   }

  //   let div: any = document.createElement('regex-div');
  //   div.name = key;
  //   div.className = 'inputWrapper';
  //   div.id = 'regex-input-wrapper-id';

  //   let icWrapper = document.createElement('regex-div');
  //   icWrapper.style.width = '100%';
  //   icWrapper.className = 'icWrapper';
  //   icWrapper.id = 'regex-ic-wrapper-id';

  //   let modifiers = document.createElement('regex-span');
  //   modifiers.className = 'modifiersWrapper';
  //   modifiers.id = 'regex-modifiers-wrapper-id';

  //   let input = document.createElement('input');

  //   input.className = 'myInput';
  //   input.id = 'regex-myInput-id';
  //   input.type = 'text';
  //   input.placeholder = 'regular expression';
  //   input.name = key;

  //   let count = document.createElement('regex-span');
  //   count.className = 'matchCount';
  //   count.style.float = 'right';

  //   let countNum = document.createElement('regex-span');
  //   countNum.innerHTML = '0';
  //   let countSep = document.createElement('regex-span');
  //   countSep.innerHTML = '/';
  //   let countDen = document.createElement('regex-span');
  //   countDen.innerHTML = '0';

  //   countNum = count.appendChild(countNum);
  //   countSep = count.appendChild(countSep);
  //   countDen = count.appendChild(countDen);

  //   let caseSensitive = document.createElement('regex-button');
  //   // new Shine(caseSensitive, { bubble: false, overrideArgs: [2, 0, 0, 0] });
  //   caseSensitive.innerHTML = '/i';

  //   let isRegex = document.createElement('regex-button');
  //   // new Shine(isRegex, { bubble: false, overrideArgs: [2, 0, 0, 0] });
  //   isRegex.innerHTML = '/r';

  //   let scrollable = document.createElement('regex-button');
  //   // new Shine(scrollable, { bubble: false, overrideArgs: [2, 0, 0, 0] });
  //   scrollable.innerHTML = '/s';

  //   let levenshtein = document.createElement('regex-button');
  //   // new Shine(levenshtein, { bubble: false, overrideArgs: [2, 0, 0, 0] });
  //   levenshtein.innerHTML = '/l';

  //   let maxMatchLimit = document.createElement('input');
  //   maxMatchLimit.type = 'number';
  //   var maxLimit = 10;
  //   maxMatchLimit.value = `${maxLimit}`;
  //   maxMatchLimit.style.width = '50px';

  //   caseSensitive = modifiers.appendChild(caseSensitive);
  //   isRegex = modifiers.appendChild(isRegex);
  //   scrollable = modifiers.appendChild(scrollable);
  //   levenshtein = modifiers.appendChild(levenshtein);
  //   maxMatchLimit = modifiers.appendChild(maxMatchLimit);

  //   input = icWrapper.appendChild(input);
  //   modifiers = icWrapper.appendChild(modifiers);
  //   count = icWrapper.appendChild(count);
  //   icWrapper = div.appendChild(icWrapper);

  //   let buttonWrapper = document.createElement('regex-div');
  //   buttonWrapper.className = 'buttonWrapper';
  //   buttonWrapper.id = 'regex-buttonWrapper-id';

  //   let npWrapper = document.createElement('regex-div');
  //   npWrapper.style.float = 'left';
  //   npWrapper.style.display = 'flex';
  //   npWrapper.style.alignItems = 'center';
  //   npWrapper.className = 'npWrapper';

  //   let cWrapper = document.createElement('regex-div');
  //   cWrapper.className = 'cWrapper';
  //   cWrapper.id = 'regex-cWrapper-id';

  //   let next: any = document.createElement('regex-button');
  //   let prev: any = document.createElement('regex-button');
  //   let minus = document.createElement('regex-button');
  //   let copy = document.createElement('regex-button');
  //   let colorInput = document.createElement('input');
  //   let colorFacts = document.createElement('regex-p');

  //   colorFacts.style.margin = '0 5px';

  //   colorInput.type = 'color';
  //   colorInput.value = '#FFFF00';
  //   colorInput.className = 'colorInput';
  //   colorFacts.innerHTML = colorInput.value;
  //   let color = '';

  //   minus.innerHTML = '-';
  //   minus.className = 'minus';
  //   // minus.type = 'button';

  //   next.innerHTML = '&#8658;';
  //   next.className = 'next';
  //   // next.type = 'button';
  //   next.name = color + '|' + key;

  //   prev.innerHTML = '&#8656;';
  //   prev.className = 'prev';
  //   // prev.type = 'button';
  //   prev.name = color + '|' + key;

  //   copy.innerHTML = '&#9974;';
  //   copy.title = 'Copy This Selection';
  //   copy.className = 'copySelection';

  //   prev = npWrapper.appendChild(prev);
  //   next = npWrapper.appendChild(next);
  //   minus = npWrapper.appendChild(minus);
  //   copy = npWrapper.appendChild(copy);
  //   npWrapper = buttonWrapper.appendChild(npWrapper);

  //   colorFacts = cWrapper.appendChild(colorFacts);
  //   colorInput = cWrapper.appendChild(colorInput);
  //   cWrapper = buttonWrapper.appendChild(cWrapper);
  //   buttonWrapper = div.appendChild(buttonWrapper);

  //   div = form.appendChild(div);

  //   // --- custom event listeners ---

  //   var preserveCase = 'i';
  //   var preserveScroll = true;
  //   var preserveLevenshtein = false;
  //   var preserveRegex = false;
  //   var nextOrPrev = next;

  //   function handleHighlighting() {
  //     if (
  //       highlightMe(key, {
  //         match: input.value,
  //         color: colorInput.value,
  //         mods: preserveCase,
  //         litReg: preserveRegex,
  //         limit: maxLimit,
  //         loose: preserveLevenshtein,
  //       })
  //     ) {
  //       next.click();
  //       prev.click();
  //       nextOrPrev = next;
  //     } else {
  //       countNum.innerHTML = '0';
  //       countDen.innerHTML = '0';
  //     }
  //   }

  //   input.addEventListener('input', () => {
  //     handleHighlighting();
  //     input.focus();
  //   });
  //   input.addEventListener('focus', () => {
  //     document.onkeydown = (e) => {
  //       if (e.key.toLocaleLowerCase() === 'enter') {
  //         e.preventDefault();
  //         nextOrPrev.click();
  //       }
  //     };
  //   });
  //   input.addEventListener('blur', () => (document.onkeydown = null));

  //   colorInput.addEventListener('input', () => {
  //     changeColor(key, colorInput.value);
  //     colorFacts.innerHTML = colorInput.value;
  //   });
  //   caseSensitive.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     preserveCase = preserveCase === 'i' ? '' : 'i';
  //     if (preserveCase === 'i') {
  //       caseSensitive.style.backgroundColor = 'gold';
  //     } else {
  //       caseSensitive.style.backgroundColor = 'red';
  //     }
  //     handleHighlighting();
  //   });
  //   isRegex.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     preserveRegex = !preserveRegex;
  //     if (!preserveRegex) {
  //       isRegex.style.backgroundColor = 'gold';
  //     } else {
  //       isRegex.style.backgroundColor = 'red';
  //     }
  //     handleHighlighting();
  //   });
  //   scrollable.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     preserveScroll = !preserveScroll;
  //     if (preserveScroll) {
  //       scrollable.style.backgroundColor = 'gold';
  //     } else {
  //       scrollable.style.backgroundColor = 'red';
  //     }
  //   });
  //   levenshtein.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     preserveLevenshtein = !preserveLevenshtein;
  //     if (!preserveLevenshtein) {
  //       levenshtein.style.backgroundColor = 'gold';
  //     } else {
  //       levenshtein.style.backgroundColor = 'red';
  //     }
  //     handleHighlighting();
  //   });
  //   maxMatchLimit.addEventListener('input', (e) => {
  //     e.preventDefault();
  //     maxLimit = Number(maxMatchLimit.value);
  //     handleHighlighting();
  //   });
  //   next.addEventListener('click', (e: any) => {
  //     e.preventDefault();
  //     nextOrPrev = next;
  //     let GI = Globals.getGI(key);
  //     if (!!Globals.MY_HIGHLIGHTS[GI]) {
  //       Globals.CURRENT_INDEXES[GI] = nextMatch(
  //         Globals.MY_HIGHLIGHTS[GI].elements,
  //         Globals.CURRENT_INDEXES[GI],
  //         {
  //           direction: 1,
  //           newStyles: {
  //             backgroundColor: 'orange',
  //           },
  //           oldStyles: {
  //             backgroundColor: colorInput.value,
  //           },
  //           scrollBehavior: 'smooth',
  //           scrollable: preserveScroll,
  //         }
  //       );
  //       countNum.innerHTML = `${Globals.CURRENT_INDEXES[GI] + 1}`;
  //       countDen.innerHTML = Globals.MY_HIGHLIGHTS[GI].elements.length;
  //     }
  //   });
  //   prev.addEventListener('click', (e: any) => {
  //     e.preventDefault();
  //     nextOrPrev = prev;
  //     let GI = Globals.getGI(key);
  //     if (!!Globals.MY_HIGHLIGHTS[GI]) {
  //       Globals.CURRENT_INDEXES[GI] = nextMatch(
  //         Globals.MY_HIGHLIGHTS[GI].elements,
  //         Globals.CURRENT_INDEXES[GI],
  //         {
  //           direction: -1,
  //           newStyles: {
  //             backgroundColor: 'orange',
  //           },
  //           oldStyles: {
  //             backgroundColor: colorInput.value,
  //           },
  //           scrollBehavior: 'smooth',
  //           scrollable: preserveScroll,
  //         }
  //       );
  //       countNum.innerHTML = `${Globals.CURRENT_INDEXES[GI] + 1}`;
  //       countDen.innerHTML = Globals.MY_HIGHLIGHTS[GI].elements.length;
  //     }
  //   });
  //   minus.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     Highlighter.clearHighlight(key);
  //     Globals.popupDragger.deleteNoDragElems(div);
  //     if (form == null) return;
  //     form.removeChild(div);
  //   });
  //   copy.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     let GI = Globals.getGI(key);
  //     if (!!Globals.MY_HIGHLIGHTS[GI]) {
  //       let selection = '';
  //       Globals.MY_HIGHLIGHTS[GI].elements.forEach((elem: any) => {
  //         for (let i = 0; i < elem.length; i++) {
  //           selection += elem[i].innerText;
  //         }
  //         selection += '\n';
  //       });
  //       navigator.clipboard.writeText(selection);
  //     }
  //   });

  //   return div;
  // };
}
