import {Directive, ViewContainerRef, TemplateRef, AfterViewInit, EventEmitter, Input, Output, EmbeddedViewRef} from '@angular/core';

@Directive({selector: '[inViewStep]'})
export class InViewDirective implements AfterViewInit {
  alreadyRendered!: boolean; // cheking if visible already
  @Input('inViewStep') contextData: any; // Input data passed into the directive
  private viewRef!: EmbeddedViewRef<any>;
  private observer!: IntersectionObserver;
  constructor(
    private vcRef: ViewContainerRef,
    private tplRef: TemplateRef<any>
  ) {}

 ngAfterViewInit(): void {
    // Step 1: Render the embedded view first
    this.viewRef = this.vcRef.createEmbeddedView(this.tplRef, {
      $implicit: this.contextData
    });
    this.viewRef.detectChanges();

    // Step 2: Wait a tick for DOM to paint
    setTimeout(() => {
      const elToObserve = this.findFirstDomElement(this.viewRef);

      if (!elToObserve) {
        console.warn('[inViewStep] No valid element found to observe.');
        return;
      }

      this.setMinWidthHeight(elToObserve);

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.alreadyRendered) {
            this.alreadyRendered = true;
          }
        });
      }, {threshold: [0, .1, .9, 1]});

      this.observer.observe(elToObserve);
    }, 0);
  }

  renderContents(isInView:any) {
    if (isInView && !this.alreadyRendered) {
      this.vcRef.clear();
      this.vcRef.createEmbeddedView(this.tplRef);
      this.alreadyRendered = true;
    }
  }
  private findFirstDomElement(viewRef: EmbeddedViewRef<any>): HTMLElement | null {
    const rootNodes = viewRef.rootNodes;
    for (let node of rootNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        return node as HTMLElement;
      }
    }
    return null;
  }
  // renderContents(isInView:any) {
  //   if (isInView && !this.alreadyRendered) {
  //     this.vcRef.clear();
  //     this.vcRef.createEmbeddedView(this.tplRef);
  //     this.alreadyRendered = true;
  //   }
  //   if (!isInView && this.alreadyRendered) {
  //     this.vcRef.clear();
  //     this.alreadyRendered = false;
  //   }
  // }

  setMinWidthHeight(el:any) { // prevent issue being visible all together
    const style = window.getComputedStyle(el);
    const [width, height] = [parseInt(style.width), parseInt(style.height)];
    !width && (el.style.minWidth = '40px');
    !height && (el.style.minHeight = '40px');
  }
}