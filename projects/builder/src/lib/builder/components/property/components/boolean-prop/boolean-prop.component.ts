import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { Actions, AuditTypes } from '../../../../models';
import { AuditService } from '../../../../services/audit.service';
import { BuilderService } from '../../../../services/builder.service';
import { CbpService } from '../../../../services/cbp.service';
import { ControlService } from '../../../../services/control.service';
import { BuilderUtil } from '../../../../util/builder-util';

@Component({
  selector: 'lib-boolean-prop',
  templateUrl: './boolean-prop.component.html',
  styleUrls: ['./boolean-prop.component.css']
})
export class BooleanPropComponent implements OnInit, OnChanges {
  dgType = DgTypes;
  AuditTypes: typeof AuditTypes = AuditTypes;
  @Input() selectedElement: any;
  constructor(private _buildUtil: BuilderUtil, private controlService: ControlService, public auditService: AuditService, public cbpService: CbpService, public builderService: BuilderService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedElement && this.selectedElement)
      this.selectedElement = changes.selectedElement.currentValue;
  }

  ngOnInit(): void {
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

  updateLink() {
    this.cbpService.isViewUpdated = true;
  }
  validText(event: { keyCode: any; }) {
    var key = event.keyCode;
    return ((key >= 65 && key <= 90) || key == 8);
  }
  showErrorMsg(dgType: any, dgTypeMsg: any) {
    this.setErrorMesg(dgTypeMsg, dgType, true)
  }
  setErrorMesg(mesg: string, type: any, popup: boolean) {
    this.cbpService.displayMsg = mesg;
    this.cbpService.errorDgType = type;
    this.cbpService.showErrorPopup = popup;
  }
  onFocusEvent() {
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }


  createAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }
  checkBoxAudit(event: any, auditType: AuditTypes, optionalParams: any = {}) {
    this.cbpService.selectedElement[optionalParams.propName] = event.target.checked;
    this.createAuditEntry(auditType, optionalParams)
  }
  viewUpdateTrack() {
    this.cbpService.setViewUpdateTrack();
    // this.cbpService.selectedElement = this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }

}
