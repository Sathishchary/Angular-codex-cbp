import { Directive, OnInit, OnDestroy, EventEmitter, Renderer2, ElementRef, Output } from '@angular/core';

@Directive({
  selector: '[appCtrlClick]'
})
export class CtrlClickDirective implements OnInit, OnDestroy {
  private unsubscribe: any;

  // tslint:disable-next-line:no-output-rename
  @Output() ctrlClickEvent = new EventEmitter();

  constructor(private readonly renderer: Renderer2, private readonly element: ElementRef) { }

  ngOnInit() {
    this.unsubscribe = this.renderer.listen(this.element.nativeElement, 'click', event => {
      if (event.ctrlKey) {
        event.preventDefault();
        event.stopPropagation();
        // unselect accidentally selected text (browser default behaviour)
        //  document.getSelection().removeAllRanges();
        var sel = window.getSelection ? window.getSelection() : document['selection'] ;
        if (sel) {
          if (sel.removeAllRanges) {
              sel.removeAllRanges();
          } else if (sel.empty) {
              sel.empty();
          }
        }
        this.ctrlClickEvent.emit(event);
      }
    });
  }

  ngOnDestroy() {
    if (!this.unsubscribe) {
      return;
    }
    this.unsubscribe();
  }
}
