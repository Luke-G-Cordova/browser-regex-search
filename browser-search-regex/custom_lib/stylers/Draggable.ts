export default class Draggable {
  private notDraggable: number;
  constructor(
    private draggableElement: HTMLElement,
    private nonDraggableChildElements: HTMLElement[] = []
  ) {
    this.notDraggable = 0;
  }
  drag() {
    let startX: number;
    let startY: number;
    let endX: number;
    let endY: number;
    let previousWindowY = window.scrollY;
    let previousWindowX = window.scrollX;

    let border = window
      .getComputedStyle(this.draggableElement, null)
      .getPropertyValue('border-left-width');
    let leftBorderSize = Number(border.substring(0, border.length - 2)) + 20;
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
}
