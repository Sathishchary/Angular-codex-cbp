import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { Actions, AuditTypes } from '../../../../models';
import { AuditService } from '../../../../services/audit.service';
import { BuilderService } from '../../../../services/builder.service';
import { CbpService } from '../../../../services/cbp.service';
import { ControlService } from '../../../../services/control.service';
import { TableService } from '../../../../shared/services/table.service';
import { BuilderUtil } from '../../../../util/builder-util';

@Component({
  selector: 'lib-data-entry-prop',
  templateUrl: './data-entry-prop.component.html',
  styleUrls: ['./data-entry-prop.component.css']
})
export class DataEntryPropComponent implements OnInit, OnChanges {
  dgType = DgTypes;
  AuditTypes: typeof AuditTypes = AuditTypes;
  @Input() selectedElement: any;
  typetextarraList = [{ type: DgTypes.TextDataEntry, display: 'Text' }, { type: DgTypes.TextAreaDataEntry, display: 'TextArea' }, { type: DgTypes.NumericDataEntry, display: 'Numeric' }]

  constructor(public tableService: TableService, private _buildUtil: BuilderUtil,
    private controlService: ControlService, public auditService: AuditService,
    public cbpService: CbpService, public builderService: BuilderService, public cdref: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedElement && this.selectedElement)
      this.selectedElement = changes.selectedElement.currentValue;
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
        this.viewUpdateTrack();
        this.cbpService.fieldsMaps.set(this.cbpService.selectedElement.dgUniqueID, this.cbpService.selectedElement.fieldName);
        this.createAuditEntry(AuditTypes.PROPERTY_TEXT, { propName: 'fieldName' })
      }
    }
  }

  valueTypeRequired(value: any) {
    if (value === 'Derived') {
      if (this.cbpService.tableDataEntrySelected) {
        this.cbpService.tableDataEntrySelected.required = false;
      } else {
        this.cbpService.selectedElement.required = false;
      }
    }
    if (value !== 'Derived' && this.selectedElement?.DisplayValue != '') {
      this.selectedElement.DisplayValue = '';
      this.selectedElement.ParsedValue = '';
    }
    this.cbpService.isViewUpdated = true;
    this.cbpService.detectWholePage = true;
    this.cdref.detectChanges();
  }
  ngOnInit(): void {
  }
  onFocusEvent() {
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }
  checkBoxAudit(event: any, auditType: AuditTypes, optionalParams: any = {}) {
    this.cbpService.selectedElement[optionalParams.propName] = event.target.checked;
    this.createAuditEntry(auditType, optionalParams)
  }

  changeEntryType(type: string | undefined) {
    this.cbpService.selectedElement.dgType = type;
    if (this.cbpService.selectedElement !== undefined) {
      if (this.cbpService.selectedElement.parentID || this.cbpService.selectedElement.dgType === DgTypes.TextDataEntry || this.cbpService.selectedElement.dgType === DgTypes.TextAreaDataEntry || this.cbpService.selectedElement.dgType === DgTypes.NumericDataEntry) {
        const element = this._buildUtil.getElementByNumber(this.cbpService.selectedElement.parentID, this.cbpService.cbpJson.section);
        if (element.dgType === DgTypes.StepAction) {
          this.dataEntrySturcture();
          this.viewUpdateTrack();
        }
      }
    }
  }

  dataEntrySturcture() {
    this.entryReuseCode();
    if (this.cbpService.selectedElement.dgType === DgTypes.NumericDataEntry) {
      this.cbpService.selectedElement.dgType = DgTypes.NumericDataEntry;
      this.cbpService.selectedElement.fieldName = DgTypes.NumericDataEntry + (++this.cbpService.dataFieldNumber);
    }
    else if (this.cbpService.selectedElement.dgType === DgTypes.TextAreaDataEntry) {
      this.cbpService.selectedElement.dgType = DgTypes.TextAreaDataEntry;
      this.cbpService.selectedElement.fieldName = DgTypes.TextAreaDataEntry + (++this.cbpService.dataFieldNumber);
    }
    else if (this.cbpService.selectedElement.dgType === DgTypes.TextDataEntry) {
      this.cbpService.selectedElement.dgType = DgTypes.TextDataEntry;
      this.cbpService.selectedElement.fieldName = DgTypes.TextDataEntry + (++this.cbpService.dataFieldNumber);
      this.cbpService.selectedElement.valueType = 'Entered';
    }
  }

  entryReuseCode() {
    if (this.cbpService.selectedElement.dgType === DgTypes.TextAreaDataEntry) {
      delete this.cbpService.selectedElement.valueType;
      delete this.cbpService.selectedElement.fieldName;
    }
    else if (this.cbpService.selectedElement.dgType === DgTypes.NumericDataEntry) {
      delete this.cbpService.selectedElement.fieldName;
    }
  }

  createAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }
  viewUpdateTrack() {
    this.cbpService.setViewUpdateTrack();
    // this.cbpService.selectedElement = this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }
  keyPressEvent(event: any) {
    if (Number(event?.target?.value) < 0) {
      event.target.value = 0;
    }
  }
}
