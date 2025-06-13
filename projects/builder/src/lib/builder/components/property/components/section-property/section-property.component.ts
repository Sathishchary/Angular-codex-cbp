import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CbpService } from '../../../../services/cbp.service';
import { DgTypes, SequenceTypes } from 'cbp-shared';
import { BuilderUtil } from '../../../../util/builder-util';
import { AuditTypes } from '../../../../models';
@Component({
  selector: 'lib-section-property',
  templateUrl: './section-property.component.html',
  styleUrls: ['./section-property.component.css']
})
export class SectionPropertyComponent implements OnInit {
  dgType = DgTypes;
  SequenceTypes: typeof SequenceTypes = SequenceTypes;
  AuditTypes: typeof AuditTypes = AuditTypes;
  class = "card bg-light p-0 w-sticky";

  @Output() primaryCodeSubTypeEvent: EventEmitter<any> = new EventEmitter();
  @Output() onFocusEventEvent: EventEmitter<any> = new EventEmitter();
  @Output() checkAndChangesNumberedStepsEvent: EventEmitter<any> = new EventEmitter();
  @Output() checkBoxAuditEvent: EventEmitter<any> = new EventEmitter();
  @Output() setDynamicHideSectionEvent: EventEmitter<any> = new EventEmitter();
  @Output() setDynamicSectionEvent: EventEmitter<any> = new EventEmitter();

  constructor(public cbpService: CbpService, private _buildUtil: BuilderUtil) { }

  getSequenceType(): SequenceTypes {
    return this._buildUtil.getSequenceType(this.cbpService.selectedElement);
  }
  changeSubType(type: any) {
    this.primaryCodeSubTypeEvent.emit(type);
  }
  onFocusEvent() {
    this.onFocusEventEvent.emit();
  }
  checkAndChangesNumberedSteps(event: any) {
    this.checkAndChangesNumberedStepsEvent.emit(event);
  }
  checkBoxAudit(event: any, auditType: AuditTypes, optionalParams: any = {}) {
    this.checkBoxAuditEvent.emit({ event: event, auditType: auditType, optionalParams: optionalParams });
  }
  setDynamicHideSection(event: any, value: any) {
    this.setDynamicHideSectionEvent.emit({ event: event, e: value });
  }
  setDynamicSection(event: any, value: number) {
    this.setDynamicSectionEvent.emit({ event: event, e: value });
  }

  ngOnInit(): void {
  }

}
