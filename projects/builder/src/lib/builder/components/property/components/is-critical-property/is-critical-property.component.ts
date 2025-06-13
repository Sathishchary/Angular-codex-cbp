import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { DgTypes, SequenceTypes } from "cbp-shared";
import { AuditService } from "../../../../services/audit.service";
import { CbpService } from "../../../../services/cbp.service";
import { BuilderUtil } from "../../../../util/builder-util";

@Component({
  selector: 'lib-is-critical-property',
  templateUrl: './is-critical-property.component.html',
  styleUrls: ['./is-critical-property.component.css',]
})
export class IsCriticalPropertyComponent implements OnInit {
  dgType = DgTypes;
  SequenceTypes: typeof SequenceTypes = SequenceTypes;

  @Output() setOrUnSetIconEvent: EventEmitter<any> = new EventEmitter();
  @Output() onFocusEventEvent: EventEmitter<any> = new EventEmitter();
  @Output() changesNumberedSteps: EventEmitter<any> = new EventEmitter();

  constructor(public cbpService: CbpService, private _buildUtil: BuilderUtil, public auditService: AuditService) { }

  getSequenceType(): SequenceTypes {
    return this._buildUtil.getSequenceType(this.cbpService.selectedElement);
  }
  setOrUnSetIcon() {
    this.setOrUnSetIconEvent.emit();
  }
  onFocusEvent() {
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
    this.onFocusEventEvent.emit();
  }
  
  ngOnInit(): void {

  }
  checkAndChangesNumberedSteps(event:any){
    this.changesNumberedSteps.emit(event);
  }
}
