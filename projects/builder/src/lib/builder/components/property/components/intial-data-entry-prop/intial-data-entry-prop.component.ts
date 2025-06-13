import { Component, OnInit } from '@angular/core';
import { Actions, AuditTypes } from '../../../../models';
import { AuditService } from '../../../../services/audit.service';
import { CbpService } from '../../../../services/cbp.service';
import { ControlService } from '../../../../services/control.service';

@Component({
  selector: 'lib-intial-data-entry-prop',
  templateUrl: './intial-data-entry-prop.component.html',
  styleUrls: ['./intial-data-entry-prop.component.css']
})
export class IntialDataEntryPropComponent implements OnInit {
  AuditTypes: typeof AuditTypes = AuditTypes;
  constructor(private controlService: ControlService, public cbpService: CbpService, public auditService: AuditService) { }

  ngOnInit(): void {
  }
  onFocusEvent() {
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }
  checkBoxAudit(event: any, auditType: AuditTypes, optionalParams: any = {}) {
    this.cbpService.selectedElement[optionalParams.propName] = event.target.checked;
    this.createAuditEntry(auditType, optionalParams)
  }

  createAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    this.viewUpdateTrack();
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }

  viewUpdateTrack() {
    this.cbpService.setViewUpdateTrack();
    // this.cbpService.selectedElement = this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }
  updateLink() {
    this.cbpService.isViewUpdated = true;
  }
}
