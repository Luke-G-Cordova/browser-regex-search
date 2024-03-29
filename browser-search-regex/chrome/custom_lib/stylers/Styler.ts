namespace Styler {
  export class Draggable {
    /**
     * If equal to 0, will drag
     * Increases by for every nonDraggableChildElements
     */
    private notDraggable: number;

    /**
     * the top most parent element to be made draggable
     */
    private draggableElement: HTMLElement;

    /**
     * the child elements of draggableElement that should not be draggable
     */
    private nonDraggableChildElements: HTMLElement[];

    /**
     * sets the draggableElement and its nonDraggableChildElements
     * @param draggableElement the wrapper element that contains the HTML that should be draggable
     * @param nonDraggableChildElements any child elements of draggableElement that should not drag draggableElement when selected or moused on
     */
    constructor(
      draggableElement: HTMLElement,
      nonDraggableChildElements: HTMLElement[] = []
    ) {
      this.draggableElement = draggableElement;
      this.nonDraggableChildElements = nonDraggableChildElements;
      this.notDraggable = 0;
    }

    /**
     * call to allow the element to be draggable
     */
    drag() {
      let startX: number;
      let startY: number;
      let endX: number;
      let endY: number;
      let previousWindowY = window.scrollY;
      let previousWindowX = window.scrollX;

      // get border size
      let border = window
        .getComputedStyle(this.draggableElement, null)
        .getPropertyValue('border-left-width');
      let leftBorderSize = Number(border.substring(0, border.length - 2)) + 20;

      // logic for child elements that shouldn't drag when selected
      if (this.nonDraggableChildElements.length !== 0) {
        this.nonDraggableChildElements.forEach((ndElem) => {
          ndElem.onmouseover = () => {
            this.notDraggable++;
          };
          ndElem.onmouseout = () => {
            this.notDraggable--;
          };
        });
      }

      // event listeners
      this.draggableElement.onmousedown = (e) => {
        if (!this.notDraggable) {
          startX = e.clientX;
          startY = e.clientY;
          document.onmouseup = (ev) => {
            ev.preventDefault();
            document.onmouseup = null;
            document.onmousemove = null;
          };
          document.onmousemove = (ev) => {
            endX = ev.clientX;
            endY = ev.clientY;
            this.draggableElement.style.left =
              this.draggableElement.offsetLeft + (endX - startX) + 'px';
            this.draggableElement.style.top =
              this.draggableElement.offsetTop + (endY - startY) + 'px';

            if (
              this.draggableElement.offsetLeft +
                this.draggableElement.clientWidth +
                leftBorderSize >
              window.innerWidth + window.scrollX
            ) {
              this.draggableElement.style.left =
                window.innerWidth -
                this.draggableElement.clientWidth -
                leftBorderSize +
                'px';
            } else if (this.draggableElement.offsetLeft < 0) {
              this.draggableElement.style.left = 0 + 'px';
            } else {
              startX = ev.clientX;
            }

            if (
              this.draggableElement.offsetTop +
                this.draggableElement.clientHeight +
                leftBorderSize >
              window.innerHeight + window.scrollY
            ) {
              this.draggableElement.style.top =
                window.innerHeight +
                window.scrollY -
                this.draggableElement.clientHeight -
                leftBorderSize +
                'px';
            } else if (this.draggableElement.offsetTop < 0 + window.scrollY) {
              this.draggableElement.style.top = 0 + window.scrollY + 'px';
            } else {
              startY = ev.clientY;
            }
          };
        }
      };

      document.onscroll = () => {
        this.draggableElement.style.top =
          this.draggableElement.offsetTop +
          window.scrollY -
          previousWindowY +
          'px';
        this.draggableElement.style.left =
          this.draggableElement.offsetLeft +
          window.scrollX -
          previousWindowX +
          'px';
        previousWindowY = window.scrollY;
        previousWindowX = window.scrollX;
      };
    }

    /**
     * setter to add to the nonDraggableChildElements
     * @param elems elements that should not be able to be dragged
     */
    addNoDragElems(elems: HTMLElement[]) {
      this.nonDraggableChildElements =
        this.nonDraggableChildElements.concat(elems);
      this.nonDraggableChildElements.forEach((ndElem) => {
        ndElem.onmouseover = () => {
          this.notDraggable++;
        };
        ndElem.onmouseout = () => {
          this.notDraggable--;
        };
      });
    }
    deleteNoDragElems(elems: HTMLElement | HTMLElement[]) {
      if (elems instanceof HTMLElement) {
        elems = [elems];
      }
      elems.forEach((elem) => {
        delete this.nonDraggableChildElements[
          this.nonDraggableChildElements.indexOf(elem)
        ];
      });
      this.notDraggable--;
      this.nonDraggableChildElements.forEach((ndElem) => {
        ndElem.onmouseover = () => {
          this.notDraggable++;
        };
        ndElem.onmouseout = () => {
          this.notDraggable--;
        };
      });
    }
  }
}
