import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { AuditTypes } from '../../../../models';

@Component({
  selector: 'lib-required',
  templateUrl: './required.component.html',
  styleUrls: ['./required.component.css']
})
export class RequiredComponent implements OnInit {
  @Input() selected:any;
  @Input() title:any;
  AuditTypes: typeof AuditTypes = AuditTypes;
  @Output() focusEvent:EventEmitter<any> = new EventEmitter<any>();
  @Output() checkBoxEvent:EventEmitter<any> = new EventEmitter<any>();
  @Output() modalChangeEvent:EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onFocusEventTable(){
    this.focusEvent.emit();
  }
  checkBoxTableAudit(event:any, audittype:AuditTypes, prop:any){
    this.checkBoxEvent.emit({event:event, audittype:audittype, prop:prop});
  }

  modalChange(){
    this.modalChangeEvent.emit(this.selected);
  }
}
