import { Component, OnInit } from '@angular/core';
import { VerificationType } from 'cbp-shared';
import { Actions, AuditTypes } from '../../../../models';
import { AuditService } from '../../../../services/audit.service';
import { CbpService } from '../../../../services/cbp.service';
import { ControlService } from '../../../../services/control.service';

@Component({
  selector: 'lib-verification-component',
  templateUrl: './verification-component.component.html',
  styleUrls: ['./verification-component.component.css']
})
export class VerificationComponentComponent implements OnInit {

  AuditTypes: typeof AuditTypes = AuditTypes;
  typeList = [VerificationType.QA, VerificationType.Independent, VerificationType.Concurrent, VerificationType.Peer];

  constructor(public cbpService: CbpService, public auditService: AuditService,
    public controlService: ControlService) { }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  checkBoxAudit(event: any, auditType: AuditTypes, optionalParams: any = {}) {
    this.cbpService.selectedElement[optionalParams.propName] = event.target.checked;
    this.createAuditEntry(auditType, optionalParams);
    this.cbpService.isViewUpdated = true;
  }

  onFocusEvent() {
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }

  changeVerificationUi(VerificationTypes: String) {
    this.cbpService.selectedElement.prompt = 'Requires ' + VerificationTypes + ' Verification';
    this.cbpService.selectedElement.prompt = 'Requires ' + VerificationTypes + ' Verification';
    this.viewUpdateTrack();
  }
  viewUpdateTrack() {
    this.cbpService.setViewUpdateTrack();
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }
  createAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
    this.cbpService.isViewUpdated = true;
  }
}
