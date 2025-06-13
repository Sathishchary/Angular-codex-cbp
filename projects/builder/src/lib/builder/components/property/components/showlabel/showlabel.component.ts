import { Component, Input, OnInit } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { Actions, AuditTypes } from '../../../../models';
import { AuditService } from '../../../../services/audit.service';
import { CbpService } from '../../../../services/cbp.service';
import { ControlService } from '../../../../services/control.service';

@Component({
  selector: 'app-showlabel',
  templateUrl: './showlabel.component.html',
  styleUrls: ['./showlabel.component.css']
})
export class ShowlabelComponent implements OnInit {
  AuditTypes: typeof AuditTypes = AuditTypes;
  dgType: typeof DgTypes = DgTypes;
  @Input() selectedElement: any;

  constructor(public cbpService: CbpService, public auditService: AuditService, public controlService: ControlService) { }

  ngOnInit(): void {
    // console.log( this.cbpService.tableDataEntrySelected);
  }

  setCheckBoxSide(type: any) {
    this.cbpService.tableDataEntrySelected['labelSide'] = type;
    this.updateLinkSubTable();
  }
  checkBoxTableAudit(event: any, auditType: AuditTypes, optionalParams: any = {}) {
    this.cbpService.tableDataEntrySelected[optionalParams.propName] = event.target.checked;
    this.updateLinkSubTable();
    this.controlService.setSelectItem(this.cbpService.selectedElement);
    this.tablePropertyCreateAuditEntry(auditType, optionalParams);
  }
  tablePropertyCreateAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.tableDataEntrySelected, Actions.Update, auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.tableDataEntrySelected));
  }
  onFocusEventTable() {
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.tableDataEntrySelected));
  }
  updateLinkSubTable() {
    this.cbpService.isViewUpdated = true;
    // this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
    this.cbpService.setViewUpdateTrack();
    this.controlService.hideTrackUi({ 'trackUiChange': true });
    // this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(this.cbpService.tableDataEntrySelected.parentDgUniqId, this.cbpService.cbpJson.section);
    // this.controlService.setSelectItem(this.cbpService.selectedElement);
  }

}
