import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { AuditTypes } from '../../../../models';
import { BuilderService } from '../../../../services/builder.service';
import { CbpService } from '../../../../services/cbp.service';
import { ControlService } from '../../../../services/control.service';
@Component({
  selector: 'lib-step-info-property',
  templateUrl: './step-info-property.component.html',
  styleUrls: ['./step-info-property.component.css']
})
export class StepInfoPropertyComponent implements OnInit {
  dgType = DgTypes;
  AuditTypes = AuditTypes;

  @Output() onFocusEventEvent: EventEmitter<any> = new EventEmitter();
  @Output() changeSubTypeEvent: EventEmitter<any> = new EventEmitter();
  @Output() onChangeEvent: EventEmitter<any> = new EventEmitter();
  @Output() checkBoxAuditEvent: EventEmitter<any> = new EventEmitter();

  onFocusEvent() {
    this.onFocusEventEvent.emit();
  }
  changeSubType(type: any) {
    this.changeSubTypeEvent.emit(type);
  }
  onChange(type: any) {
    this.onChangeEvent.emit(type);
  }
  checkBoxAudit(event: any, auditType: AuditTypes, optionalParams: any = {}) {
    this.checkBoxAuditEvent.emit({ event: event, auditType: auditType, optionalParams: optionalParams });
  }

  constructor(public cbpService: CbpService, public builderService: BuilderService,
    public controlService: ControlService
  ) { }

  ngOnInit(): void {
  }

  createAuditEntry(e: any, a: any) {
    this.cbpService.selectedElement = this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }
}
