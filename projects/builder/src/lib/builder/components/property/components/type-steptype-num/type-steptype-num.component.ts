import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { AuditService } from '../../../../services/audit.service';
import { CbpService } from '../../../../services/cbp.service';

@Component({
  selector: 'lib-type-steptype-num',
  templateUrl: './type-steptype-num.component.html',
  styleUrls: ['./type-steptype-num.component.css']
})
export class TypeSteptypeNumComponent implements OnInit {
  dgType = DgTypes;
  @Output() primaryCodeSubTypeEvent: EventEmitter<any> = new EventEmitter();
  @Output() onFocusEventEvent: EventEmitter<any> = new EventEmitter();
  @Input() dgtypeInput: DgTypes | undefined;
  typearrayList = [{ type: DgTypes.Section, display: 'Section' }, { type: DgTypes.StepAction, display: 'Step' }]

  constructor(public cbpService: CbpService, public auditService: AuditService, public cdr:ChangeDetectorRef) { }
  ngOnChanges(changes:SimpleChanges){
    // if(changes.selectType && this.selectType){
    //   this.selectType = changes.selectType.currentValue;
    // }
  }
  ngOnInit(): void {
   
  }
  onFocusEvent() {
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
    // this.onFocusEventEvent.emit();
  }
  // onChange(type: any) {
  //   this.onChangeEvent.emit(type);
  // }
  changeSubType(type: any) {
    this.primaryCodeSubTypeEvent.emit(type);
  }

  ngAfterViewInit(){
    // if(!this.selectType){
    //   let selectedField:any =  this.actionstypes.filter((item:any)=>item.type === this.selectType);
    //   this.selectType = selectedField.type;
    //   if(!this.selectType)
    //   this.selectType = this.actionstypes[0].type;
    //   this.cdr.detectChanges();
    // }
  }
  
}
