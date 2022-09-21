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
namespace BSRElements {
  export class BSRMainInput {
    public preserveCase = 'i';
    public preserveRegex = false;
    public maxLimit = 100;
    public preserveLevenshtein = false;
    public nextOrPrev: HTMLElement | null = null;
    public key: string = '';
    public inputWrapper: HTMLElement;
    public input: HTMLInputElement;
    public colorInput: HTMLInputElement;
    public maxMatchLimit: HTMLInputElement;
    public colorFacts: HTMLElement;
    public next: HTMLElement;
    public prev: HTMLElement;
    public countNum: HTMLElement;
    public countDen: HTMLElement;
    public caseSensitive: HTMLElement;
    public isRegex: HTMLElement;
    public shouldScroll: HTMLElement;
    public preserveScroll = true;
    public levenshtein: HTMLElement;
    public minus: HTMLElement;
    public copy: HTMLElement;
    constructor(public formWrapper: HTMLElement) {
      this.key = `regex-key-${Math.random().toString(36).substring(2, 5)}`;
      // create and append the element to the form
      this.inputWrapper = formWrapper.appendChild(
        Components.NewInput(this.key)
      ) as HTMLElement;

      // define element not to be dragged
      Globals.popupDragger.addNoDragElems(this.inputWrapper);

      // get the main input elem
      this.input = this.inputWrapper.querySelector(
        'input.mainInputField'
      ) as HTMLInputElement;

      // get the color input elem
      this.colorInput = this.inputWrapper.querySelector(
        'input[type="color"]'
      ) as HTMLInputElement;

      this.colorFacts = this.inputWrapper.querySelector(
        '#color-facts'
      ) as HTMLElement;

      // get the next button
      this.next = this.inputWrapper.querySelector(
        'bsr-button.next'
      ) as HTMLElement;

      // get the previous button
      this.prev = this.inputWrapper.querySelector(
        'bsr-button.prev'
      ) as HTMLElement;

      // get the count numerator
      this.countNum = this.inputWrapper.querySelector(
        'bsr-span#count-numerator'
      ) as HTMLElement;

      // get the count denominator
      this.countDen = this.inputWrapper.querySelector(
        'bsr-span#count-denominator'
      ) as HTMLElement;

      this.caseSensitive = this.inputWrapper.querySelector(
        'bsr-button.caseSensitive'
      ) as HTMLElement;

      this.isRegex = this.inputWrapper.querySelector(
        'bsr-button.isRegex'
      ) as HTMLElement;

      this.shouldScroll = this.inputWrapper.querySelector(
        'bsr-button.shouldScroll'
      ) as HTMLElement;

      this.levenshtein = this.inputWrapper.querySelector(
        'bsr-button.levenshtein'
      ) as HTMLElement;

      this.maxMatchLimit = this.inputWrapper.querySelector(
        'input.maxMatchLimit'
      ) as HTMLInputElement;

      this.minus = this.inputWrapper.querySelector(
        'bsr-button.minus'
      ) as HTMLElement;

      this.copy = this.inputWrapper.querySelector(
        'bsr-button.copySelection'
      ) as HTMLElement;

      // listen for the input event
      this.input.addEventListener('input', () => {
        this.handleHighlighting();
        this.input.focus();
      });

      this.input.addEventListener('focus', () => {
        document.onkeydown = (e) => {
          if (e.key.toLocaleLowerCase() === 'enter') {
            e.preventDefault();
            if (this.nextOrPrev == null) {
              this.nextOrPrev = this.next;
            }
            this.nextOrPrev.click();
          }
        };
      });

      this.input.addEventListener('blur', () => (document.onkeydown = null));

      this.colorInput.addEventListener('input', () => {
        this.changeColor(this.key, this.colorInput.value);
        this.colorFacts.innerHTML = this.colorInput.value;
      });
      this.caseSensitive.addEventListener('click', (e) => {
        e.preventDefault();
        this.preserveCase = this.preserveCase === 'i' ? '' : 'i';
        if (this.preserveCase === 'i') {
          this.caseSensitive.style.backgroundColor = 'gold';
        } else {
          this.caseSensitive.style.backgroundColor = 'red';
        }
        this.handleHighlighting();
      });
      this.isRegex.addEventListener('click', (e) => {
        e.preventDefault();
        this.preserveRegex = !this.preserveRegex;
        if (!this.preserveRegex) {
          this.isRegex.style.backgroundColor = 'gold';
        } else {
          this.isRegex.style.backgroundColor = 'red';
        }
        this.handleHighlighting();
      });
      this.shouldScroll.addEventListener('click', (e) => {
        e.preventDefault();
        this.preserveScroll = !this.preserveScroll;
        if (this.preserveScroll) {
          this.shouldScroll.style.backgroundColor = 'gold';
        } else {
          this.shouldScroll.style.backgroundColor = 'red';
        }
      });
      this.levenshtein.addEventListener('click', (e) => {
        e.preventDefault();
        this.preserveLevenshtein = !this.preserveLevenshtein;
        if (!this.preserveLevenshtein) {
          this.levenshtein.style.backgroundColor = 'gold';
        } else {
          this.levenshtein.style.backgroundColor = 'red';
        }
        this.handleHighlighting();
      });
      this.maxMatchLimit.addEventListener('input', (e) => {
        e.preventDefault();
        this.maxLimit = Number(this.maxMatchLimit.value);
        this.handleHighlighting();
      });
      this.next.addEventListener('click', (e: any) => {
        e.preventDefault();
        this.nextOrPrev = this.next;
        let GI = Globals.getGI(this.key);
        if (!!Globals.MY_HIGHLIGHTS[GI]) {
          Globals.CURRENT_INDEXES[GI] = this.nextMatch(
            Globals.MY_HIGHLIGHTS[GI].elements,
            Globals.CURRENT_INDEXES[GI],
            {
              direction: 1,
              newStyles: {
                backgroundColor: 'orange',
              },
              oldStyles: {
                backgroundColor: this.colorInput.value,
              },
              scrollBehavior: 'smooth',
              scrollable: this.preserveScroll,
            }
          );
          this.countNum.innerHTML = `${Globals.CURRENT_INDEXES[GI] + 1}`;
          this.countDen.innerHTML = Globals.MY_HIGHLIGHTS[GI].elements.length;
        }
      });
      this.prev.addEventListener('click', (e: any) => {
        e.preventDefault();
        this.nextOrPrev = this.prev;
        let GI = Globals.getGI(this.key);
        if (!!Globals.MY_HIGHLIGHTS[GI]) {
          Globals.CURRENT_INDEXES[GI] = this.nextMatch(
            Globals.MY_HIGHLIGHTS[GI].elements,
            Globals.CURRENT_INDEXES[GI],
            {
              direction: -1,
              newStyles: {
                backgroundColor: 'orange',
              },
              oldStyles: {
                backgroundColor: this.colorInput.value,
              },
              scrollBehavior: 'smooth',
              scrollable: this.preserveScroll,
            }
          );
          this.countNum.innerHTML = `${Globals.CURRENT_INDEXES[GI] + 1}`;
          this.countDen.innerHTML = Globals.MY_HIGHLIGHTS[GI].elements.length;
        }
      });
      this.minus.addEventListener('click', (e) => {
        e.preventDefault();
        Highlighter.clearHighlight(this.key);
        Globals.popupDragger.deleteNoDragElems(this.inputWrapper);
        if (formWrapper == null) return;
        formWrapper.removeChild(this.inputWrapper);
      });
      this.copy.addEventListener('click', (e) => {
        e.preventDefault();
        let GI = Globals.getGI(this.key);
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
    }
    handleHighlighting() {
      if (
        this.highlightMe({
          match: this.input.value,
          color: this.colorInput.value,
          mods: this.preserveCase,
          litReg: this.preserveRegex,
          limit: this.maxLimit,
          loose: this.preserveLevenshtein,
        })
      ) {
        this.next.click();
        this.prev.click();
        this.nextOrPrev = this.next;
      } else {
        this.countNum.innerHTML = '0';
        this.countDen.innerHTML = '0';
      }
    }
    highlightMe(
      options: highlightMeOptions = {
        match: '',
        color: '#FFFF00',
        mods: '',
        litReg: false,
        limit: 1000,
        loose: false,
      }
    ) {
      if (options) {
        options.match = options.litReg
          ? options.match
          : options.loose
          ? options.match
          : this.escapeRegExp(options.match);
      }
      let GI = Globals.getGI(this.key);
      Globals.CUR_INDEX = 0;
      if (GI === -1) {
        Globals.ELEM_KEYS.push(this.key);
        GI = Globals.getGI(this.key);
        Globals.CURRENT_INDEXES.push(Globals.CUR_INDEX);
      } else {
        Globals.CURRENT_INDEXES[GI] = Globals.CUR_INDEX;
      }

      Highlighter.clearHighlight(this.key);
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
          (match, sameMatchID) => {
            multiNodeMatchId = sameMatchID;
            var highlightMeElem = document.createElement('highlight-me');

            highlightMeElem.className = `chrome-bsr-highlight-me ${this.key}`;
            if (Globals.CUR_INDEX === 0) {
              highlightMeElem.className += ' current';
            }
            highlightMeElem.style.backgroundColor = `${options.color}`;
            highlightMeElem.style.color = this.invertColor(options.color);

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
    }
    changeColor(key: string, color: string) {
      let matches = document.querySelectorAll(`highlight-me.${key}`);
      matches.forEach((elem: any) => {
        elem.style.backgroundColor = color;
        elem.style.color = this.invertColor(color);
      });
    }
    escapeRegExp(text: string) {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }

    invertColor(hex: string) {
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
      return '#' + this.padZero(r) + this.padZero(g) + this.padZero(b);
    }
    padZero(str: string, len?: number) {
      len = len || 2;
      var zeros = new Array(len).join('0');
      return (zeros + str).slice(-len);
    }

    nextMatch(
      elements: [HTMLElement[]],
      cIndex: number,
      options: nextMatchOptions = {
        direction: 1,
        newStyles: {},
        oldStyles: {},
        scrollBehavior: 'smooth',
        scrollable: true,
      }
    ) {
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
          if (options.scrollable && options.scrollBehavior != null) {
            this.goto(elements[cIndex][i], options.scrollBehavior);
          }
        }
      }
      return cIndex;
    }
    goto(elem: HTMLElement, scrollBehavior: 'smooth' | 'auto') {
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
      var scObj = this.getScrollable(elem);

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

        scElemH = window
          .getComputedStyle(scElem, null)
          .getPropertyValue('height');
        scElemH =
          scElemH === ''
            ? scElemH
            : Number(scElemH.substring(0, scElemH.length - 2));

        scElemW = window
          .getComputedStyle(scElem, null)
          .getPropertyValue('width');
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
          left:
            scCoords.left - elemCoords.left + scElem.scrollLeft - scElemW / 2,
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
            left:
              scCoords.left - elemCoords.left + scElem.scrollLeft - scElemW / 2,
            behavior: scrollBehavior,
          });
        }
      }
    }
    getScrollable(elem: HTMLElement) {
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
    }
  }
}
