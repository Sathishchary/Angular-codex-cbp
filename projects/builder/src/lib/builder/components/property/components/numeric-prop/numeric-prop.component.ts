import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { Actions, AuditTypes } from '../../../../models';
import { AuditService } from '../../../../services/audit.service';
import { BuilderService } from '../../../../services/builder.service';
import { CbpService } from '../../../../services/cbp.service';
import { ControlService } from '../../../../services/control.service';
import { BuilderUtil } from '../../../../util/builder-util';

@Component({
  selector: 'lib-numeric-prop',
  templateUrl: './numeric-prop.component.html',
  styleUrls: ['./numeric-prop.component.css']
})
export class NumericPropComponent implements OnInit, OnChanges {
  dgType = DgTypes;
  AuditTypes: typeof AuditTypes = AuditTypes;
  @Input() selectedElement: any;

  constructor(private _buildUtil: BuilderUtil, private controlService: ControlService,
    public auditService: AuditService, public cbpService: CbpService,
    public builderService: BuilderService, public cdref: ChangeDetectorRef) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedElement && this.selectedElement)
      this.selectedElement = changes.selectedElement.currentValue;
  }
  decimalValid(value: any) {
    if (!value.decimal && value.decimal !== 0) {
      value.defaultValue = Math.floor(value.defaultValue);
    }
  }
  changeDerivedType() {
    if (this.cbpService.selectedElement.valueType === 'Derived') {
      this.cbpService.selectedElement.unitsRequired = false;
      this.cbpService.selectedElement.required = false;
    }
    if (this.selectedElement.valueType !== 'Derived' && this.selectedElement?.DisplayValue != '') {
      this.selectedElement.DisplayValue = '';
      this.selectedElement.ParsedValue = '';
    }
    this.viewUpdateTrack();
    this.cbpService.isViewUpdated = true;
    this.cbpService.detectWholePage = true;
    this.cdref.detectChanges();
  }
  onFocusEvent() {
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }
  keyPressEvent(event: any) {
    if (Number(event?.target?.value) < 0) {
      event.target.value = 0;
    }
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
  createAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
    if (this.selectedElement.maximum != null || this.selectedElement.minimum != null || this.selectedElement.defaultValue != null) {
      if (this.selectedElement.maximum == "-") {
        this.showErrorMsg(DgTypes.ErrorMsg, 'Number should be mandatory');
        this.selectedElement.maximum = null;
      }
      if (this.selectedElement.minimum == "-") {
        this.showErrorMsg(DgTypes.ErrorMsg, 'Number should be mandatory');
        this.selectedElement.minimum = null;
      }
      if (this.selectedElement.defaultValue == "-") {
        this.showErrorMsg(DgTypes.ErrorMsg, 'Number should be mandatory');
        this.selectedElement.defaultValue = null;
      }
    }
  }
  checkBoxAudit(event: any, auditType: AuditTypes, optionalParams: any = {}) {
    this.cbpService.selectedElement[optionalParams.propName] = event.target.checked;
    this.viewUpdateTrack();
    this.createAuditEntry(auditType, optionalParams)
  }
  unitValue(val: any) {
    if (val.unitsRequired === true && !val.units) {
      this.updateLink();
      this.showErrorMsg(DgTypes.ErrorMsg, 'Please Enter Unit value');
      this.selectUnitValue(true);
      return false;
    }
    else {
      this.selectUnitValue(false);
    }
  }
  selectUnitValue(event: boolean) {
    if (event) {
      this.cbpService.numericUnit.push(this.selectedElement.dgUniqueID);
      if (this.cbpService.numericUnit.length > 0) {
        this.viewUpdateTrack();
        this.cbpService.numericUnit = this.removeDuplicates(this.cbpService.numericUnit);
      }
    }
    else {
      let id = this.cbpService.numericUnit.findIndex(l => l === this.selectedElement.dgUniqueID)
      if (id != -1)
        this.cbpService.numericUnit.splice(id, 1);
    }
  }
  removeDuplicates(arr: any) {
    return arr.filter((item: any, index: number) => arr.indexOf(item) === index);
  }
  checkUnit(v: string) {
    if (v != '') {
      this.selectUnitValue(false);
    } else {
      this.selectUnitValue(true);
    }
  }

  checkMaxValue(val: any) {
    if (val.maximum != null && val.minimum != null) {
      const max = parseInt(val.maximum);
      const min = parseInt(val.minimum);
      const defaultValue = parseInt(val.defaultValue);
      if (max < min) {
        this.showErrorMsg(DgTypes.ErrorMsg, 'Max value should be greater than Min');
        this.selectedElement.maximum = null;
        this.selectedElement.minimum = null;
      }
      if (defaultValue != null) {
        if (defaultValue < min) {
          this.showErrorMsg(DgTypes.ErrorMsg, 'Default Value should be greater than or equal to minimum');
          this.selectedElement.defaultValue = null;
        }
        if (defaultValue > max) {
          this.showErrorMsg(DgTypes.ErrorMsg, 'Default Value should be less than or equal to maximum');
          this.selectedElement.defaultValue = null;
        }
      }
    }
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
  ngOnInit(): void {
  }

}
