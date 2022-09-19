/// <reference path="../stylers/Styler.ts" />
/// <reference path="./Globals.ts" />
/// <reference path="../highlight/Highlighter.ts" />
/// <reference path="./components.ts" />

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
        `visibility: 'visible', top: ${20 + window.scrollY}px, left: ${
          20 + window.scrollX
        }px, position: absolute`
      );
      Globals.popup = document.body.insertBefore(
        Globals.popup,
        document.body.firstChild
      );
      // Globals.popup = document.createElement('bsr-popup-card');
      // Globals.popup.id = 'bsr-popup-card-id';
      // Object.assign(Globals.popup.style, {
      //   visibility: 'visible', // this should be visible
      //   top: `${20 + window.scrollY}px`,
      //   left: `${20 + window.scrollX}px`,
      // });
      // let pContent = document.createElement('regex-div');
      // pContent.id = 'regex-p-content-id';
      // let controlWrapper = document.createElement('regex-div');
      // controlWrapper.id = 'regex-control-wrapper-id';
      // let inputAdder = document.createElement('regex-div');
      // inputAdder.className = 'controlButton';
      // inputAdder.id = 'regex-input-adder-id';
      // inputAdder.innerHTML = '+';
      // let exitBtn = document.createElement('regex-div');
      // exitBtn.className = 'controlButton';
      // exitBtn.id = 'regex-exit-button-id';
      // exitBtn.innerHTML = 'X';
      // exitBtn = controlWrapper.appendChild(exitBtn);
      // inputAdder = controlWrapper.appendChild(inputAdder);
      // controlWrapper = pContent.appendChild(controlWrapper);
      // let formWrapper = document.createElement('regex-div');
      // formWrapper.className = 'formWrapper';
      // formWrapper.id = 'regex-form-wrapper-id';
      // formWrapper = pContent.appendChild(formWrapper);
      // Globals.popup.appendChild(pContent);
      // Globals.popup = document.body.insertBefore(
      //   Globals.popup,
      //   document.body.firstChild
      // );
      // let inputParent = createInput();
      // Globals.popupDragger = new Styler.Draggable(Globals.popup, [
      //   inputParent,
      //   inputAdder,
      //   exitBtn,
      // ]);
      // Globals.popupDragger.drag();
      // inputAdder.addEventListener('mouseover', () => {
      //   Object.assign(inputAdder, { cursor: 'pointer' });
      // });
      // inputAdder.addEventListener('click', () =>
      //   Globals.popupDragger.addNoDragElems(createInput())
      // );
      // exitBtn.addEventListener('mouseover', () => {
      //   Object.assign(exitBtn, { cursor: 'pointer' });
      // });
      // exitBtn.addEventListener('mouseup', () => {
      //   showPopup();
      // });
    } else {
      Globals.popup.remove();
      Globals.popup = null;
      Highlighter.clearHighlight(Globals.ELEM_KEYS);
    }
  };

  export const createInput = (
    key: string = `regex-key-${Math.random().toString(36).substring(2, 5)}`
  ) => {
    let form = document.querySelector('regex-div#regex-form-wrapper-id');
    if (form == null) {
      console.error('form is null');
      return null;
    }

    let div: any = document.createElement('regex-div');
    div.name = key;
    div.className = 'inputWrapper';
    div.id = 'regex-input-wrapper-id';

    let icWrapper = document.createElement('regex-div');
    icWrapper.style.width = '100%';
    icWrapper.className = 'icWrapper';
    icWrapper.id = 'regex-ic-wrapper-id';

    let modifiers = document.createElement('regex-span');
    modifiers.className = 'modifiersWrapper';
    modifiers.id = 'regex-modifiers-wrapper-id';

    let input = document.createElement('input');

    input.className = 'myInput';
    input.id = 'regex-myInput-id';
    input.type = 'text';
    input.placeholder = 'regular expression';
    input.name = key;

    let count = document.createElement('regex-span');
    count.className = 'matchCount';
    count.style.float = 'right';

    let countNum = document.createElement('regex-span');
    countNum.innerHTML = '0';
    let countSep = document.createElement('regex-span');
    countSep.innerHTML = '/';
    let countDen = document.createElement('regex-span');
    countDen.innerHTML = '0';

    countNum = count.appendChild(countNum);
    countSep = count.appendChild(countSep);
    countDen = count.appendChild(countDen);

    let caseSensitive = document.createElement('regex-button');
    // new Shine(caseSensitive, { bubble: false, overrideArgs: [2, 0, 0, 0] });
    caseSensitive.innerHTML = '/i';

    let isRegex = document.createElement('regex-button');
    // new Shine(isRegex, { bubble: false, overrideArgs: [2, 0, 0, 0] });
    isRegex.innerHTML = '/r';

    let scrollable = document.createElement('regex-button');
    // new Shine(scrollable, { bubble: false, overrideArgs: [2, 0, 0, 0] });
    scrollable.innerHTML = '/s';

    let levenshtein = document.createElement('regex-button');
    // new Shine(levenshtein, { bubble: false, overrideArgs: [2, 0, 0, 0] });
    levenshtein.innerHTML = '/l';

    let maxMatchLimit = document.createElement('input');
    maxMatchLimit.type = 'number';
    var maxLimit = 10;
    maxMatchLimit.value = `${maxLimit}`;
    maxMatchLimit.style.width = '50px';

    caseSensitive = modifiers.appendChild(caseSensitive);
    isRegex = modifiers.appendChild(isRegex);
    scrollable = modifiers.appendChild(scrollable);
    levenshtein = modifiers.appendChild(levenshtein);
    maxMatchLimit = modifiers.appendChild(maxMatchLimit);

    input = icWrapper.appendChild(input);
    modifiers = icWrapper.appendChild(modifiers);
    count = icWrapper.appendChild(count);
    icWrapper = div.appendChild(icWrapper);

    let buttonWrapper = document.createElement('regex-div');
    buttonWrapper.className = 'buttonWrapper';
    buttonWrapper.id = 'regex-buttonWrapper-id';

    let npWrapper = document.createElement('regex-div');
    npWrapper.style.float = 'left';
    npWrapper.style.display = 'flex';
    npWrapper.style.alignItems = 'center';
    npWrapper.className = 'npWrapper';

    let cWrapper = document.createElement('regex-div');
    cWrapper.className = 'cWrapper';
    cWrapper.id = 'regex-cWrapper-id';

    let next: any = document.createElement('regex-button');
    let prev: any = document.createElement('regex-button');
    let minus = document.createElement('regex-button');
    let copy = document.createElement('regex-button');
    let colorInput = document.createElement('input');
    let colorFacts = document.createElement('regex-p');

    colorFacts.style.margin = '0 5px';

    colorInput.type = 'color';
    colorInput.value = '#FFFF00';
    colorInput.className = 'colorInput';
    colorFacts.innerHTML = colorInput.value;
    let color = '';

    minus.innerHTML = '-';
    minus.className = 'minus';
    // minus.type = 'button';

    next.innerHTML = '&#8658;';
    next.className = 'next';
    // next.type = 'button';
    next.name = color + '|' + key;

    prev.innerHTML = '&#8656;';
    prev.className = 'prev';
    // prev.type = 'button';
    prev.name = color + '|' + key;

    copy.innerHTML = '&#9974;';
    copy.title = 'Copy This Selection';
    copy.className = 'copySelection';

    prev = npWrapper.appendChild(prev);
    next = npWrapper.appendChild(next);
    minus = npWrapper.appendChild(minus);
    copy = npWrapper.appendChild(copy);
    npWrapper = buttonWrapper.appendChild(npWrapper);

    colorFacts = cWrapper.appendChild(colorFacts);
    colorInput = cWrapper.appendChild(colorInput);
    cWrapper = buttonWrapper.appendChild(cWrapper);
    buttonWrapper = div.appendChild(buttonWrapper);

    div = form.appendChild(div);

    // --- custom event listeners ---

    var preserveCase = 'i';
    var preserveScroll = true;
    var preserveLevenshtein = false;
    var preserveRegex = false;
    var nextOrPrev = next;

    function handleHighlighting() {
      if (
        highlightMe(key, {
          match: input.value,
          color: colorInput.value,
          mods: preserveCase,
          litReg: preserveRegex,
          limit: maxLimit,
          loose: preserveLevenshtein,
        })
      ) {
        next.click();
        prev.click();
        nextOrPrev = next;
      } else {
        countNum.innerHTML = '0';
        countDen.innerHTML = '0';
      }
    }

    input.addEventListener('input', () => {
      handleHighlighting();
      input.focus();
    });
    input.addEventListener('focus', () => {
      document.onkeydown = (e) => {
        if (e.key.toLocaleLowerCase() === 'enter') {
          e.preventDefault();
          nextOrPrev.click();
        }
      };
    });
    input.addEventListener('blur', () => (document.onkeydown = null));

    colorInput.addEventListener('input', () => {
      changeColor(key, colorInput.value);
      colorFacts.innerHTML = colorInput.value;
    });
    caseSensitive.addEventListener('click', (e) => {
      e.preventDefault();
      preserveCase = preserveCase === 'i' ? '' : 'i';
      if (preserveCase === 'i') {
        caseSensitive.style.backgroundColor = 'gold';
      } else {
        caseSensitive.style.backgroundColor = 'red';
      }
      handleHighlighting();
    });
    isRegex.addEventListener('click', (e) => {
      e.preventDefault();
      preserveRegex = !preserveRegex;
      if (!preserveRegex) {
        isRegex.style.backgroundColor = 'gold';
      } else {
        isRegex.style.backgroundColor = 'red';
      }
      handleHighlighting();
    });
    scrollable.addEventListener('click', (e) => {
      e.preventDefault();
      preserveScroll = !preserveScroll;
      if (preserveScroll) {
        scrollable.style.backgroundColor = 'gold';
      } else {
        scrollable.style.backgroundColor = 'red';
      }
    });
    levenshtein.addEventListener('click', (e) => {
      e.preventDefault();
      preserveLevenshtein = !preserveLevenshtein;
      if (!preserveLevenshtein) {
        levenshtein.style.backgroundColor = 'gold';
      } else {
        levenshtein.style.backgroundColor = 'red';
      }
      handleHighlighting();
    });
    maxMatchLimit.addEventListener('input', (e) => {
      e.preventDefault();
      maxLimit = Number(maxMatchLimit.value);
      handleHighlighting();
    });
    next.addEventListener('click', (e: any) => {
      e.preventDefault();
      nextOrPrev = next;
      let GI = Globals.getGI(key);
      if (!!Globals.MY_HIGHLIGHTS[GI]) {
        Globals.CURRENT_INDEXES[GI] = nextMatch(
          Globals.MY_HIGHLIGHTS[GI].elements,
          Globals.CURRENT_INDEXES[GI],
          {
            direction: 1,
            newStyles: {
              backgroundColor: 'orange',
            },
            oldStyles: {
              backgroundColor: colorInput.value,
            },
            scrollBehavior: 'smooth',
            scrollable: preserveScroll,
          }
        );
        countNum.innerHTML = `${Globals.CURRENT_INDEXES[GI] + 1}`;
        countDen.innerHTML = Globals.MY_HIGHLIGHTS[GI].elements.length;
      }
    });
    prev.addEventListener('click', (e: any) => {
      e.preventDefault();
      nextOrPrev = prev;
      let GI = Globals.getGI(key);
      if (!!Globals.MY_HIGHLIGHTS[GI]) {
        Globals.CURRENT_INDEXES[GI] = nextMatch(
          Globals.MY_HIGHLIGHTS[GI].elements,
          Globals.CURRENT_INDEXES[GI],
          {
            direction: -1,
            newStyles: {
              backgroundColor: 'orange',
            },
            oldStyles: {
              backgroundColor: colorInput.value,
            },
            scrollBehavior: 'smooth',
            scrollable: preserveScroll,
          }
        );
        countNum.innerHTML = `${Globals.CURRENT_INDEXES[GI] + 1}`;
        countDen.innerHTML = Globals.MY_HIGHLIGHTS[GI].elements.length;
      }
    });
    minus.addEventListener('click', (e) => {
      e.preventDefault();
      Highlighter.clearHighlight(key);
      Globals.popupDragger.deleteNoDragElems(div);
      if (form == null) return;
      form.removeChild(div);
    });
    copy.addEventListener('click', (e) => {
      e.preventDefault();
      let GI = Globals.getGI(key);
      if (!!Globals.MY_HIGHLIGHTS[GI]) {
        let selection = '';
        Globals.MY_HIGHLIGHTS[GI].elements.forEach((elem: any) => {
          for (let i = 0; i < elem.length; i++) {
            selection += elem[i].innerText;
          }
          selection += '\n';
        });
        navigator.clipboard.writeText(selection);
      }
    });

    return div;
  };
}

const changeColor = (key: string, color: string) => {
  let matches = document.querySelectorAll(`highlight-me.${key}`);
  matches.forEach((elem: any) => {
    elem.style.backgroundColor = color;
    elem.style.color = invertColor(color);
  });
};

const highlightMe = (
  key: string,
  options: highlightMeOptions = {
    match: '',
    color: '#FFFF00',
    mods: '',
    litReg: false,
    limit: 1000,
    loose: false,
  }
) => {
  if (options) {
    options.match = options.litReg
      ? options.match
      : options.loose
      ? options.match
      : escapeRegExp(options.match);
  }
  let GI = Globals.getGI(key);
  Globals.CUR_INDEX = 0;
  if (GI === -1) {
    Globals.ELEM_KEYS.push(key);
    GI = Globals.getGI(key);
    Globals.CURRENT_INDEXES.push(Globals.CUR_INDEX);
  } else {
    Globals.CURRENT_INDEXES[GI] = Globals.CUR_INDEX;
  }

  Highlighter.clearHighlight(key);
  let finalRegex;
  if (!options.loose) {
    try {
      finalRegex = new RegExp(options.match, `${options.mods}g`);
    } catch (e) {
      finalRegex = null;
    }
  } else {
    finalRegex = options.match;
  }
  if (
    options.match !== '' &&
    Globals.DEF_REJECTS.indexOf(options.match) === -1 &&
    !!finalRegex
  ) {
    let multiNodeMatchId;
    Globals.MY_HIGHLIGHTS[GI] = Highlighter.highlight(
      document.body,
      {
        regex: finalRegex,
        excludes: ['bsr-popup-card'],
        limit: options.limit,
      },
      function (match, sameMatchID) {
        multiNodeMatchId = sameMatchID;
        var highlightMeElem = document.createElement('highlight-me');

        highlightMeElem.className = `chrome-regeggz-highlight-me ${key}`;
        if (Globals.CUR_INDEX === 0) {
          highlightMeElem.className += ' current';
        }
        highlightMeElem.style.backgroundColor = `${options.color}`;
        highlightMeElem.style.color = invertColor(options.color);

        // highlightMeElem.id = `${CUR_INDEX}|${key}|${multiNodeMatchId}`;

        Globals.CUR_INDEX =
          multiNodeMatchId > -1 ? Globals.CUR_INDEX : Globals.CUR_INDEX + 1;
        highlightMeElem.textContent = match;
        return highlightMeElem;
      }
    );
    return true;
  }
  return false;
};

const escapeRegExp = (text: string) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};
const invertColor = (hex: string) => {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
  return '#' + padZero(r) + padZero(g) + padZero(b);
};

const padZero = (str: string, len?: number) => {
  len = len || 2;
  var zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
};

const nextMatch = (
  elements: [HTMLElement[]],
  cIndex: number,
  options: nextMatchOptions = {
    direction: 1,
    newStyles: {},
    oldStyles: {},
    scrollBehavior: 'smooth',
    scrollable: true,
  }
) => {
  const regCurrent = /(^|\s)current(\s|$)/;
  const current = ' current';

  //loop through the old current selection of elements and apply the old styles
  for (let i in elements[cIndex]) {
    if (regCurrent.test(elements[cIndex][i].className)) {
      elements[cIndex][i].className = elements[cIndex][i].className.replace(
        regCurrent,
        ''
      );
      if (!!options.oldStyles) {
        Object.assign(elements[cIndex][i].style, options.oldStyles);
      }
    }
  }

  //edge detection, wrap if we hit an edge
  if (!elements[cIndex + options.direction]) {
    if (options.direction > 0) {
      cIndex = 0;
    } else {
      cIndex = elements.length - 1;
    }
  } else {
    cIndex += options.direction;
  }
  // loop through the new current selection of elements and apply the new styles
  for (let i in elements[cIndex]) {
    if (!regCurrent.test(elements[cIndex][i].className)) {
      elements[cIndex][i].className += current;
      if (!!options.newStyles) {
        Object.assign(elements[cIndex][i].style, options.newStyles);
      }
      // scroll to the new current selection so that it is in view
      if (options.scrollable && options.scrollBehavior != null)
        goto(elements[cIndex][i], options.scrollBehavior);
    }
  }
  return cIndex;
};

const goto = (elem: HTMLElement, scrollBehavior: 'smooth' | 'auto') => {
  // scObj is either null or an Object that looks like
  // {
  //      element: dom element - the closest ancestor of elem that can scroll in some direction ,
  //      bScroll: boolean - true if there is only one word for the overflow css style of
  //                  element and it is not 'hidden', 'visible', or '',
  //      xScroll: boolean - true if the overflow-x css style of element is not
  //                  'hidden', 'visible', or '',
  //      yScroll: boolean - true if the overflow-y css style of element is not
  //                  'hidden', 'visible', or ''
  // }
  var scObj = scrollable(elem);

  var bodyCoords = document.body.getBoundingClientRect();
  var elemCoords = !!scObj
    ? scObj.element.getBoundingClientRect()
    : elem.getBoundingClientRect();

  // scElem is for if scObj is not null and stores scObj.element
  var scElem;

  // scCoords = elem.getBoundingClientRect() if elemCoords isn't already
  var scCoords;

  // scElemH = height of scElem
  var scElemH;
  // scElemW = width of scElem
  var scElemW;

  // if there is an ancestor to elem that is scrollable
  // and is not the body, then set relevant variables
  if (!!scObj) {
    scElem = scObj.element;
    scCoords = elem.getBoundingClientRect();

    scElemH = window.getComputedStyle(scElem, null).getPropertyValue('height');
    scElemH =
      scElemH === ''
        ? scElemH
        : Number(scElemH.substring(0, scElemH.length - 2));

    scElemW = window.getComputedStyle(scElem, null).getPropertyValue('width');
    scElemW =
      scElemW === ''
        ? scElemW
        : Number(scElemW.substring(0, scElemW.length - 2));
  } else {
    return null;
  }

  // if the element that should be in view
  // is out of view, scroll to the element
  // --- TODO --- this statement does not account for if
  // --- TODO ---     the body can scroll on the x axis yet
  if (elemCoords.top < 0 || elemCoords.bottom > window.innerHeight) {
    window.scroll({
      top: elemCoords.top - bodyCoords.top - window.innerHeight / 2.5,
      behavior: scrollBehavior,
    });
  }

  if (typeof scElemH === 'string' || typeof scElemW === 'string') {
    return null;
  }
  // if the element is not in view of its scrollable parent element
  // scroll the parent element so that it is in view.
  // Keep in mind this statement checks if both axises are scrollable
  // according to the scObj.bScroll first and if they are not it then
  // scrolls individually.
  if (
    !!scObj &&
    !!scObj.bScroll &&
    (scCoords.top < 0 ||
      scCoords.bottom > scElemH + elemCoords.top ||
      scCoords.left < 0 ||
      scCoords.right > scElemW + elemCoords.left)
  ) {
    scElem.scroll({
      top: scCoords.top - elemCoords.top + scElem.scrollTop - scElemH / 2,
      left: scCoords.left - elemCoords.left + scElem.scrollLeft - scElemW / 2,
      behavior: scrollBehavior,
    });
  } else {
    if (
      !!scObj &&
      !!scObj.yBool &&
      (scCoords.top < 0 || scCoords.bottom > scElemH + elemCoords.top)
    ) {
      scElem.scroll({
        top: scCoords.top - elemCoords.top + scElem.scrollTop - scElemH / 2,
        behavior: scrollBehavior,
      });
    }
    if (
      !!scObj &&
      !!scObj.xBool &&
      (scCoords.left < 0 || scCoords.right > scElemW + elemCoords.left)
    ) {
      scElem.scroll({
        left: scCoords.left - elemCoords.left + scElem.scrollLeft - scElemW / 2,
        behavior: scrollBehavior,
      });
    }
  }
};

const scrollable = (elem: HTMLElement) => {
  const noScroll = ['hidden', 'visible', ''];
  while (elem !== document.body) {
    let [xScroll, yScroll] = window
      .getComputedStyle(elem, null)
      .getPropertyValue('overflow')
      .split(' ');
    let bScroll = !!xScroll && noScroll.indexOf(xScroll) === -1 && !yScroll;
    let xBool = !!xScroll && noScroll.indexOf(xScroll) === -1;
    let yBool = !!yScroll && noScroll.indexOf(yScroll) === -1;
    if (xBool || yBool) {
      return {
        element: elem,
        bScroll,
        xBool,
        yBool,
      };
    }
    if (elem.parentElement == null) {
      return null;
    }
    elem = elem.parentElement;
  }
  return null;
};
