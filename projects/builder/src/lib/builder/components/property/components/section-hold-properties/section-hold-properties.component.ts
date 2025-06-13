import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuditTypes } from '../../../../models';
import { AuditService } from '../../../../services/audit.service';
import { CbpService } from '../../../../services/cbp.service';
import { ControlService } from '../../../../services/control.service';
@Component({
  selector: 'lib-section-hold-properties',
  templateUrl: './section-hold-properties.component.html',
  styleUrls: ['./section-hold-properties.component.css']
})
export class SectionHoldPropertiesComponent implements OnInit {
  AuditTypes: typeof AuditTypes = AuditTypes;
  @Output() checkBoxAuditEvent: EventEmitter<any> = new EventEmitter();
  @Output() onFocusEventEvent: EventEmitter<any> = new EventEmitter();

  constructor(public cbpService: CbpService,public auditService: AuditService) { }

  onFocusEvent() {
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
    this.onFocusEventEvent.emit();
  }
  checkBoxAudit(event: any, auditType: AuditTypes, optionalParams: any = {}) {
    this.checkBoxAuditEvent.emit({ event: event, auditType: auditType, optionalParams: optionalParams });
  }
  ngOnInit(): void {
  }

}
