import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'lib-modal-popup',
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.css']
})
export class ModalPopupComponent implements OnInit {

  @Input() title!: string;
  @Input() hideClose = false;
  @Input() hideFooter = false;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  @Output() submitButtons: EventEmitter<any> = new EventEmitter();
  @Input() footerList:any[] = [];
  @Input() class:any = '';
  defaultClass = "btn btn-sm button-border borderenable";

  constructor(private cdref: ChangeDetectorRef) { }

  ngOnChanges(changes:SimpleChanges){
    if(this.title && changes.title){
      this.title = changes.title.currentValue;
    }
    if(this.footerList && changes.footerList){
      this.footerList = JSON.parse(JSON.stringify(changes.footerList.currentValue));
    }
    this.cdref.detectChanges();
  }

  ngOnInit() {
    this.defaultClass = this.defaultClass +' ' + this.class;
    // if(this.title == 'Signature Pad'){// }
  }
  closeModal(){
    this.closeEvent.emit();
  }
  submitclick(item:any){
    this.submitButtons.emit(item);
  }

}
