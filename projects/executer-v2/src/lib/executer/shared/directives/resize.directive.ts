import { Directive, EventEmitter, HostListener, Output, Renderer2 } from "@angular/core";

@Directive({
  selector: 'textarea[resize]'
})
export class ResizeDirective {
  @Output() resize = new EventEmitter();

  width!: number;
  height!: number;

  mouseMoveListener!: Function;

  @HostListener('mousedown', ['$event.target'])
  onMouseDown(el:any) {
    this.width = el.offsetWidth;
    this.height = el.offsetHeight;
    this.mouseMoveListener = this.renderer.listen('document', 'mousemove', () => {
      if (this.width !== el.offsetWidth || this.height !== el.offsetHeight) {
        this.resize.emit({ width: el.offsetWidth, height: el.offsetHeight });
      }
    });
  }

  @HostListener('document:mouseup',['$event.target'])
  onMouseUp(el:any) {
    this.ngOnDestroy();
  }

  constructor(private renderer: Renderer2) {}

  ngOnDestroy() {
    if (this.mouseMoveListener) {
      this.mouseMoveListener();
    }
  }
}
