import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { Actions, AuditTypes } from '../../../../models';
import { AuditService } from '../../../../services/audit.service';
import { BuilderService } from '../../../../services/builder.service';
import { CbpService } from '../../../../services/cbp.service';
import { ControlService } from '../../../../services/control.service';
import { BuilderUtil } from '../../../../util/builder-util';

@Component({
  selector: 'lib-check-prop',
  templateUrl: './check-prop.component.html',
  styleUrls: ['./check-prop.component.css']
})
export class CheckPropComponent implements OnInit, OnChanges {
  AuditTypes: typeof AuditTypes = AuditTypes;
  dgType = DgTypes;
  @Input() isTableDataEntry: any;
  @Input() selectedElement: any;
  @Output() selectedElementChange: EventEmitter<any> = new EventEmitter<any>()

  constructor(private _buildUtil: BuilderUtil, private controlService: ControlService,
    public auditService: AuditService, public cbpService: CbpService, public builderService: BuilderService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedElement && this.selectedElement)
      this.selectedElement = changes.selectedElement.currentValue;
  }

  ngOnInit(): void {
  }
  checkNameExistOrnot() {
    let isExist = false;
    let stepNumber;
    const res = this.cbpService.fieldsMaps.get(this.selectedElement.dgUniqueID);
    if (this.selectedElement.fieldName === res) {
    } else {
      for (const [key, value] of this.cbpService.fieldsMaps) {
        if (value === this.selectedElement.fieldName) {
          stepNumber = this._buildUtil.getElementByDgUniqueID(key, this.cbpService.cbpJson.section);
          isExist = true;
        }
      }
      if (isExist && this.selectedElement.fieldName) {
        this.showErrorMsg(DgTypes.ErrorMsg, 'Data Field already exist at Step' + stepNumber.parentID);
        return;
      } else {
        this.selectedElement.fieldNameUpdated = true;
        this.cbpService.fieldsMaps.set(this.selectedElement.dgUniqueID, this.selectedElement.fieldName);
        this.createAuditEntry(AuditTypes.PROPERTY_TEXT, { propName: 'fieldName' })
      }
    }
  }

  updateLink() {
    this.cbpService.isViewUpdated = true;
    this.selectedElementChange.emit(this.selectedElement);
  }
  updateCheckBox(type: any, isTable: any) {
    if (isTable) {
      this.cbpService.tableDataEntrySelected.selected = (type == 'Selected') ? true : false;
      this.tablePropertyCreateAuditEntry(AuditTypes.PROPERTY_TABLE_CHECK_VALUE, { propName: 'valueType' });
    } else {
      this.selectedElement.selected = (type == 'Selected') ? true : false;
      this.createAuditEntry(AuditTypes.PROPERTY_CHECK_VALUE, { propName: 'valueType' });
    }
    this.updateLink();
  }

  tablePropertyCreateAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    this.updateLink();
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.tableDataEntrySelected, Actions.Update, auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.tableDataEntrySelected));
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
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.selectedElement));
  }

  createAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {  
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.selectedElement, Actions.Update, auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.selectedElement));
  }
  checkBoxAudit(event: any, auditType: AuditTypes, optionalParams: any = {}) {
    this.selectedElement[optionalParams.propName] = event.target.checked;
    this.cbpService.selectedElement[optionalParams.propName] = event.target.checked;
    this.createAuditEntry(auditType, optionalParams)
  }
  viewUpdateTrack() {
    this.cbpService.setViewUpdateTrack();
    // this.selectedElement = this.cbpService.setUserUpdateInfo(this.selectedElement);
    this.controlService.hideTrackUi({ 'trackUiChange': true });
    this.updateLink();
  }

}
