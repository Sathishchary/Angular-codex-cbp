import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuditTypes } from '../../../../models';
import { CbpService } from '../../../../services/cbp.service';
@Component({
  selector: 'lib-embedded-property',
  templateUrl: './embedded-property.component.html',
  styleUrls: ['./embedded-property.component.css']
})
export class EmbeddedPropertyComponent implements OnInit {
  AuditTypes: typeof AuditTypes = AuditTypes;
  @Output() createAuditEntryEvent: EventEmitter<any> = new EventEmitter();
  @Output() removeStaticContentEvent: EventEmitter<any> = new EventEmitter();
  @Output() renderEmbededProcedureEvent: EventEmitter<any> = new EventEmitter();

  constructor(public cbpService: CbpService) { }

  ngOnInit(): void {
  }

  createAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    this.createAuditEntryEvent.emit();
  }
  removeStaticContent() {
    this.removeStaticContentEvent.emit();
  }
  renderEmbededProcedure() {
    this.renderEmbededProcedureEvent.emit();
  }

}
