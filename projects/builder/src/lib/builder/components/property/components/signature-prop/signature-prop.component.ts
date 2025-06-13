import { Component, OnInit } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { Actions, AuditTypes } from '../../../../models';
import { AuditService } from '../../../../services/audit.service';
import { BuilderService } from '../../../../services/builder.service';
import { CbpService } from '../../../../services/cbp.service';
import { ControlService } from '../../../../services/control.service';
import { BuilderUtil } from '../../../../util/builder-util';

@Component({
  selector: 'lib-signature-prop',
  templateUrl: './signature-prop.component.html',
  styleUrls: ['./signature-prop.component.css']
})
export class SignaturePropComponent implements OnInit {

  dgType = DgTypes;
  AuditTypes: typeof AuditTypes = AuditTypes;
  constructor(private _buildUtil: BuilderUtil, private controlService: ControlService, public auditService: AuditService, public cbpService: CbpService, public builderService: BuilderService) { }

  ngOnInit(): void {
  }
  onFocusEvent() {
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }

  createAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, auditType, optionalParams);
    this.viewUpdateTrack();
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }
  checkBoxAudit(event: any, auditType: AuditTypes, optionalParams: any = {}) {
    this.cbpService.selectedElement[optionalParams.propName] = event.target.checked;
    this.createAuditEntry(auditType, optionalParams)
  }
  updateLink() {
    this.cbpService.isViewUpdated = true;
  }
  viewUpdateTrack() {
    this.cbpService.setViewUpdateTrack();
    // this.cbpService.selectedElement = this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }
  showErrorMsg(dgType: any, dgTypeMsg: any) {
    this.setErrorMesg(dgTypeMsg, dgType, true)
  }

  setErrorMesg(mesg: string, type: any, popup: boolean) {
    this.cbpService.displayMsg = mesg;
    this.cbpService.errorDgType = type;
    this.cbpService.showErrorPopup = popup;
  }
  checkNameExistOrnot() {
    let isExist = false;
    let stepNumber;
    const res = this.cbpService.fieldsMaps.get(this.cbpService.selectedElement.dgUniqueID);
    if (this.cbpService.selectedElement.fieldName === res) {
    } else {
      for (const [key, value] of this.cbpService.fieldsMaps) {
        if (value === this.cbpService.selectedElement.fieldName) {
          stepNumber = this._buildUtil.getElementByDgUniqueID(key, this.cbpService.cbpJson.section);
          isExist = true;
        }
      }
      if (isExist && this.cbpService.selectedElement.fieldName) {
        this.showErrorMsg(DgTypes.ErrorMsg, 'Data Field already exist at Step' + stepNumber.parentID);
        return;
      } else {
        this.cbpService.selectedElement.fieldNameUpdated = true;
        this.cbpService.fieldsMaps.set(this.cbpService.selectedElement.dgUniqueID, this.cbpService.selectedElement.fieldName);
        this.createAuditEntry(AuditTypes.PROPERTY_TEXT, { propName: 'fieldName' })
      }
    }
  }
  validateFields(type: string, event: any, bol: boolean) {
    let isValid = this.cbpService.selectedElement.promptDisplay && this.cbpService.selectedElement.namePromptDisplay &&
      !this.cbpService.selectedElement.datePromptDispaly && !this.cbpService.selectedElement.timePromptDispaly &&
      this.cbpService.selectedElement.initialPromptDispaly && this.cbpService.selectedElement.userIdPromptDisplay
      && this.cbpService.selectedElement.notesPromptDispaly;
    if (isValid) {
      this.cbpService.selectedElement[type] = bol;
      event.target.checked = bol;
      this.cbpService.isViewUpdated = true;
      this.cbpService.setNotifier('warning', 'Signature dataentry must have atleast one element')
    }
  }
}
