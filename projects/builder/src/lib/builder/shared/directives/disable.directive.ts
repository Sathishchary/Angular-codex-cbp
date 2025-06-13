import { Directive, ElementRef, Input, OnInit, SimpleChanges, OnChanges } from "@angular/core";
/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */

@Directive({
  selector: "[disable]"
})
export class DisableDirective implements OnInit, OnChanges{
  @Input() isDisable = true;
  domElement: any;
  @Input() hideColor = false;
  @Input() color: any = '#e9ecef';
  constructor(private elementRef: ElementRef) { }
  ngOnInit(){
   this.disableField();
  }
  disableField(){
    this.domElement = this.elementRef.nativeElement;
    let newStyles = this.isDisable ? { 'pointer-events': 'none', 'cursor': 'default' } : { };
    if(this.isDisable && this.color && !this.hideColor){ newStyles['background']= this.color; }
    if(this.isDisable){
      Object.keys(newStyles).forEach(element => {
        this.domElement.style.setProperty(`${element}`,newStyles[element]);
      });
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    this.isDisable = changes['isDisable'] ? changes.isDisable.currentValue : true;
    this.hideColor = changes['hideColor'] ? changes.hideColor.currentValue : false;
    this.color = changes['color'] ? changes.color.currentValue : '#e9ecef';
    this.disableField();
  }
}


// How to Use Above directive
/**
 * If you want to disable the html elements,  you can simply add this selector
 * basic example:
 * <input type="number" disable>
 *
 * example without predefind color:
 * <input type="number" disable [hideColor]="true">
 *
 * example with dynamic background color just pass the color with color input field:
 * <input type="number" disable [color]="'#e3fccc'">
 *
 * example: dynamically disable the fields: add conditon to isDisable field.
 *  <input type="number" disable  [isDisable]="condition">
 */
