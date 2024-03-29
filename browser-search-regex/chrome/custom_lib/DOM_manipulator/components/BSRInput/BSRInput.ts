namespace Components {
  export class BSRInput extends HTMLElement {
    public preserveCase = 'i';

    public searchType: 'lev' | 'exact' | 'regexp' = 'exact';

    public preserveScroll = true;

    /**
     * preserves the last pressed button between next and previous
     */
    private nextOrPrev: HTMLElement | null = null;

    /**
     * unique key for this input
     */
    public key: string;

    /**
     * the main input that gets the search string
     */
    public searchInput: HTMLInputElement;

    /**
     * input that determines the color of selections
     */
    public colorInput: HTMLInputElement;

    /**
     * the hex code of the current color for the selection
     */
    public colorFacts: HTMLElement;

    /**
     * maximum amount of selections at a time
     */
    public maxLimit = 100;

    /**
     * the input that determines maxLimit
     */
    public maxMatchLimit: HTMLInputElement;

    /**
     * the button to go to the next match in the selection
     */
    public next: HTMLElement;

    /**
     * the button to go to the previous match in the selection
     */
    public prev: HTMLElement;

    /**
     * the element that represents the numerator to show which match
     * is currently focused
     */
    public countNum: HTMLElement;

    /**
     * the element that represents the denominator to show which match
     * is currently focused
     */
    public countDen: HTMLElement;

    /**
     * the element that determines preserveCase
     */
    public caseSensitive: HTMLInputElement;

    /**
     * the element that determines preserveRegex
     */
    public isRegex: HTMLInputElement;

    /**
     * the element that determines preserveLevenshtein
     */
    public levenshtein: HTMLInputElement;

    public exactMatch: HTMLInputElement;

    /**
     * the element that determines preserveScroll
     */
    public shouldScroll: HTMLInputElement;

    /**
     * the element that deletes this
     */
    public minus: HTMLElement;

    public inputWrapper: HTMLElement;

    public colorCopyButton: HTMLElement;

    public colorCopyTooltip: HTMLElement;

    /**
     * the element that copies the current selection to the clipboard
     */
    public copy: HTMLElement;
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });

      const style = document.createElement('style');
      style.textContent = styles;
      shadowRoot.appendChild(style);
      shadowRoot.appendChild(bsrInput);
      Globals.INPUT_AMT++;

      // create the key to identify this element
      this.key = `regex-key-${Math.random().toString(36).substring(2, 5)}`;

      this.inputWrapper = bsrInput;

      this.searchInput = bsrInput.querySelector(
        'input.BSRMainInputField'
      ) as HTMLInputElement;

      this.caseSensitive = bsrInput.querySelector(
        '#bsr-case-sensitive'
      ) as HTMLInputElement;

      this.exactMatch = bsrInput.querySelector(
        '#bsr-exact-match'
      ) as HTMLInputElement;

      this.isRegex = bsrInput.querySelector(
        '#bsr-is-regex'
      ) as HTMLInputElement;

      this.levenshtein = bsrInput.querySelector(
        '#bsr-levenshtein'
      ) as HTMLInputElement;

      this.shouldScroll = bsrInput.querySelector(
        '#bsr-should-scroll'
      ) as HTMLInputElement;

      this.maxMatchLimit = bsrInput.querySelector(
        '#bsr-max-matches'
      ) as HTMLInputElement;

      this.colorInput = bsrInput.querySelector(
        '#bsr-color-input'
      ) as HTMLInputElement;

      this.colorFacts = bsrInput.querySelector('.BSRColorFacts') as HTMLElement;

      this.next = bsrInput.querySelector('.BSRNextButton') as HTMLElement;

      this.prev = bsrInput.querySelector('.BSRPrevButton') as HTMLElement;

      this.countNum = bsrInput.querySelector(
        '.BSRMatchNumerator'
      ) as HTMLElement;

      this.countDen = bsrInput.querySelector(
        '.BSRMatchDenominator'
      ) as HTMLElement;

      this.minus = bsrInput.querySelector('.BSRDeleteButton') as HTMLElement;

      this.copy = bsrInput.querySelector('.BSRCopyButton') as HTMLElement;

      this.colorCopyButton = bsrInput.querySelector(
        '.BSRColorCopyButton'
      ) as HTMLElement;

      this.colorCopyTooltip = bsrInput.querySelector(
        '.BSRColorCopyToolTip'
      ) as HTMLElement;

      // auto focus the input
      setTimeout(() => this.searchInput.focus(), 1);
      // event listeners

      // listen for the input event
      this.searchInput.addEventListener('input', () => {
        this.handleHighlighting();
        this.searchInput.focus();
      });

      this.searchInput.addEventListener('focus', () => {
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

      this.searchInput.addEventListener(
        'blur',
        () => (document.onkeydown = null)
      );

      this.colorInput.addEventListener('input', () => {
        this.changeColor(this.key, this.colorInput.value);
        let hexCode = this.colorFacts.querySelector('span');
        if (hexCode != null) {
          hexCode.innerHTML = this.colorInput.value;
        }
      });

      this.colorFacts.addEventListener('click', () => {
        let hexCode = this.colorFacts.querySelector('span');
        if (hexCode != null) {
          navigator.clipboard.writeText(this.colorInput.value);
          // this.colorCopyTooltip.style.display = 'block';
          this.colorCopyTooltip.style.opacity = '1';
        }
        setTimeout(() => {
          this.colorCopyTooltip.style.opacity = '0';
          // this.colorCopyTooltip.style.display = 'none';
        }, 1000);
      });

      this.caseSensitive.addEventListener('change', (e) => {
        e.preventDefault();
        if (this.caseSensitive.checked) {
          this.preserveCase = '';
        } else {
          this.preserveCase = 'i';
        }
        this.handleHighlighting();
        this.searchInput.focus();
      });

      this.shouldScroll.addEventListener('change', (e) => {
        e.preventDefault();
        if (this.shouldScroll.checked) {
          this.preserveScroll = false;
        } else {
          this.preserveScroll = true;
        }
        this.searchInput.focus();
      });

      this.maxMatchLimit.addEventListener('input', (e) => {
        e.preventDefault();
        this.maxLimit = Number(this.maxMatchLimit.value);
        this.handleHighlighting();
      });

      this.exactMatch.addEventListener('change', (e) => {
        e.preventDefault();
        if (this.exactMatch.checked) {
          this.searchType = 'exact';
          this.isRegex.checked = false;
          this.levenshtein.checked = false;
        }
        this.handleHighlighting();
        this.searchInput.focus();
      });

      this.isRegex.addEventListener('change', (e) => {
        e.preventDefault();
        if (this.isRegex.checked) {
          this.searchType = 'regexp';
          this.exactMatch.checked = false;
          this.levenshtein.checked = false;
        }
        this.handleHighlighting();
        this.searchInput.focus();
      });

      this.levenshtein.addEventListener('change', (e) => {
        e.preventDefault();
        if (this.levenshtein.checked) {
          this.searchType = 'lev';
          this.isRegex.checked = false;
          this.exactMatch.checked = false;
        }
        this.handleHighlighting();
        this.searchInput.focus();
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
        this.searchInput.focus();
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
        this.searchInput.focus();
      });

      this.minus.addEventListener('click', (e) => {
        e.preventDefault();
        Highlighter.clearHighlight(this.key);
        Globals.popupDragger.deleteNoDragElems(this.inputWrapper);
        if (this.parentElement == null) return;
        if (this.parentElement.childNodes.length === 1) {
          this.parentElement.appendChild(document.createElement('bsr-input'));
        }
        this.parentElement.removeChild(this);
        Globals.INPUT_AMT--;
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
        this.searchInput.focus();
      });
    }
    // end of constructor

    /**
     * handles all highlighting
     */
    handleHighlighting() {
      if (
        this.highlightMe(this.searchInput.value, this.searchType, {
          color: this.colorInput.value,
          mods: this.preserveCase,
          limit: this.maxLimit,
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

    /**
     *
     * @param searchTerm term to search for
     * @param searchType the type of search
     * @param options
     * @returns boolean indicating if the highlight was carried out successfully
     */
    highlightMe(
      searchTerm = '',
      searchType: 'exact' | 'regexp' | 'lev',
      options: highlightMeOptions = {
        color: '#FFFF00',
        mods: '',
        limit: 1000,
      }
    ) {
      Highlighter.clearHighlight(this.key);
      if (searchTerm !== '' && Globals.DEF_REJECTS.indexOf(searchTerm) === -1) {
        options = Object.assign(
          {
            color: '#FFFF00',
            mods: '',
            limit: 1000,
          },
          options
        );
        // if GI is not -1 the key exists already
        let GI = Globals.getGI(this.key);
        Globals.CUR_INDEX = 0;
        if (GI === -1) {
          Globals.ELEM_KEYS.push(this.key);
          GI = Globals.getGI(this.key);
          Globals.CURRENT_INDEXES.push(Globals.CUR_INDEX);
        } else {
          Globals.CURRENT_INDEXES[GI] = Globals.CUR_INDEX;
        }

        if (searchType === 'exact') {
          Globals.MY_HIGHLIGHTS[GI] = Highlighter.highlightExactMatch(
            searchTerm,
            (match, sameMatchID) =>
              this.createTag(match, sameMatchID, options.color),
            {
              excludes: ['bsr-popup-card'],
              limit: options.limit,
              root: document.body,
              mods: this.preserveCase,
            }
          );
        } else if (searchType === 'regexp') {
          let regExp;
          try {
            regExp = new RegExp(searchTerm, `${this.preserveCase}g`);
          } catch (e) {
            regExp = null;
          }
          if (regExp != null) {
            Globals.MY_HIGHLIGHTS[GI] = Highlighter.highlightRegExp(
              regExp,
              (match, sameMatchID) => {
                return this.createTag(match, sameMatchID, options.color);
              },
              {
                excludes: ['bsr-popup-card'],
                limit: options.limit,
                root: document.body,
              }
            );
          }
        } else if (searchType === 'lev') {
          Globals.MY_HIGHLIGHTS[GI] = Highlighter.highlightLevenshtein(
            searchTerm,
            (match, sameMatchID) =>
              this.createTag(match, sameMatchID, options.color),
            {
              excludes: ['bsr-popup-card'],
              limit: options.limit,
              root: document.body,
              percentMatch: 0.75,
            }
          );
        }
        return true;
      }
      return false;
    }

    /**
     * creates a tag to simulate the highlighting
     * @param match the text to store inside the tag
     * @param sameMatchID the id of the current node within the match
     * @param color a color to highlight with
     * @returns an element to insert into the dom
     */
    createTag(match: string, sameMatchID: number, color: string) {
      var highlightMeElem = document.createElement('highlight-me');
      highlightMeElem.className = `chrome-bsr-highlight-me ${this.key}`;
      if (Globals.CUR_INDEX === 0) {
        highlightMeElem.className += ' current';
      }
      highlightMeElem.style.backgroundColor = color;
      highlightMeElem.style.color = this.invertColor(color);
      // highlightMeElem.id = `${CUR_INDEX}|${key}|${multiNodeMatchId}`;
      Globals.CUR_INDEX =
        sameMatchID > -1 ? Globals.CUR_INDEX : Globals.CUR_INDEX + 1;
      highlightMeElem.textContent = match;
      return highlightMeElem;
    }

    /**
     * changes the color of every match given a key
     * @param key the key of matches to change color
     * @param color color to change to
     */
    changeColor(key: string, color: string) {
      let matches = document.querySelectorAll(`highlight-me.${key}`);
      matches.forEach((elem: any) => {
        elem.style.backgroundColor = color;
        elem.style.color = this.invertColor(color);
      });
    }

    /**
     * inverts a color to get a decently contrasting color
     * @param hex a hex value
     * @returns a hex value
     */
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

    /**
     * pads zeros for proper hex format
     * @param str
     * @param len
     * @returns
     */
    padZero(str: string, len?: number) {
      len = len || 2;
      var zeros = new Array(len).join('0');
      return (zeros + str).slice(-len);
    }

    /**
     * rotates to the next match
     * @param elements the array of elements to rotate through
     * @param cIndex the index of the current element in the array
     * @param options
     * @returns the new index of the current element in the array
     */
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
    /**
     * scrolls to the desired element
     * @param elem a dom element that should be scrolled to view
     * @param scrollBehavior an optional options object
     */
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
      var scCoords = elem.getBoundingClientRect();

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
        return;
      }

      // if the element is not in view of its scrollable parent element
      // scroll the parent element so that it is in view.
      // Keep in mind this statement checks if both axises are scrollable
      // according to the scObj.bScroll first and if they are not it then
      // scrolls individually.
      if (scElemH != null && scElemW != null && scElem != null) {
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
              top:
                scCoords.top - elemCoords.top + scElem.scrollTop - scElemH / 2,
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
                scCoords.left -
                elemCoords.left +
                scElem.scrollLeft -
                scElemW / 2,
              behavior: scrollBehavior,
            });
          }
        }
      }
    }

    /**
     * @param elem a dom element that could be the child of a scrollable element
     * @returns
     *
     *       elem: HTMLElement - the closest ancestor of elem that can scroll
     *                   in some direction
     *
     *       bScroll: boolean - true if there is only one word for the overflow css style of
     *                   element and it is not 'hidden', 'visible', or '',
     *
     *       xScroll: boolean - true if the overflow-x css style of element is not
     *                   'hidden', 'visible', or '',
     *
     *       yScroll: boolean - true if the overflow-y css style of element is not
     *                   'hidden', 'visible', or ''
     */
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
