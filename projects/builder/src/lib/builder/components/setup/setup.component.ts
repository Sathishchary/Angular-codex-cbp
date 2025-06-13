import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CbpSharedService, DgTypes } from 'cbp-shared';
import { FieldOptions } from '../../models';
import { CbpService } from '../../services/cbp.service';
import { ControlService } from '../../services/control.service';
import { AntlrService } from '../../shared/services/antlr.service';
import { BuilderUtil } from '../../util/builder-util';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css', '../../util/modal.css']
})
export class SetupComponent implements OnInit, OnDestroy, AfterViewInit {
  isTree = false;
  selectedAlaram: any;
  indexValue!: number;
  @Input() currentSelectedDataEntry: any;
  @Input() currentNodeSelected: any;
  formula = '';
  setfields: FieldOptions[] = [];
  fieldsdata: FieldOptions[] = [];
  dataFields: FieldOptions[] = [];
  setfieldsdata: FieldOptions[] = [];
  @Output()
  closeEvent: EventEmitter<any> = new EventEmitter();
  parentData: any;
  tempMapUniqueID = new Map();
  fieldSelectedname: any;
  componentInfo = 'derived';
  dgType = DgTypes;
  valueType = 'Derived';
  fieldSelectedType: any;
  footerList = [{ type: 'Save' }, { type: 'Cancel' }]
  constructor(public cbpService: CbpService, private antlrService: AntlrService,
    private buildUtil: BuilderUtil, private cdref: ChangeDetectorRef,
    public sharedService: CbpSharedService, public controlService: ControlService) { }

  ngOnInit() {
    this.sharedService.openModalPopup('Setup-modal');
    this.updateSetup();
    this.intializeDataKeys(this.cbpService.selectedElement.parentID);
    this.isTree = true;
    this.selectedAlaram = 'Setup Derived Value';
  }
  ngAfterViewInit() {
    const element = this.buildUtil.getElementByNumber(this.cbpService.selectedElement.parentID, this.cbpService.cbpJson.section);
    if (element !== undefined) {
      this.currentNodeSelected = element.dgUniqueID;
    }
    this.cdref.detectChanges();
  }
  selectStepNode(event: any) {
    this.formula = '';
    if (this.cbpService.currentStep !== event.original.dgUniqueID) {
      this.cbpService.currentStep = event.original.dgUniqueID;
    }
    const activestepnumber = event.original.number;
    if (!this.currentSelectedDataEntry) {
      this.intializeDataKeys(activestepnumber);
    }
    this.selectedAlaram = event.original.text.replace('<i class="fa fa-exclamation iscritical"></i>', '');
    this.selectedAlaram = 'Setup Derived Value -' + this.selectedAlaram;
    // this.updateSetup();
  }
  currentSelectedDataFalse() {
    this.currentSelectedDataEntry = false;
  }
  intializeDataKeys(selectedElement: any) {
    this.dataFields = [];
    this.fieldsdata = [];
    this.setfields = [];
    this.setfieldsdata = [];
    const secObj = this.cbpService.cbpJson.section;
    for (let i = 0; i < secObj.length; i++) {
      this.parentData = this.cbpService.cbpJson.section[i].children;
      this.nestedChild(this.parentData, selectedElement);
    }
  }
  nestedChild(childrenData: any, selectedElement: any) {
    childrenData.forEach((data: any) => {
      if (selectedElement === data.number) {
        this.selectedAlaram = data.text;
        this.selectedAlaram = 'Setup Derived Value -' + this.selectedAlaram;
      }
      if (data.dgType !== DgTypes.StepAction) {
        if (selectedElement === data.parentID) {
          if (data.dataType === "Text" || data.dataType === "Number") {
            if (data.valueType === "Derived") {
              this.setfields.push({ fieldName: data.fieldName, DgType: data.dgType, object: data });
              this.setfieldsdata = this.setfields.filter(v => v.fieldName !== '' && v.fieldName !== undefined);
              if (this.setfieldsdata.length > 0) {
                if (!this.currentSelectedDataEntry) {
                  this.fieldSelectedname = this.setfieldsdata[0].fieldName;
                  this.fieldSelectedType = this.setfieldsdata[0].DgType;
                  this.cbpService.selectedElement = this.setfieldsdata[0].object;
                  this.updateSetup();
                } else {
                  this.fieldSelectedname = this.cbpService.selectedElement.fieldName;
                  this.fieldSelectedType = this.cbpService.selectedElement.dgType;
                }
              }
            }
          }
        }
        if (selectedElement >= data.parentID && (data.dataType === "Text" || data.dataType === "Number")) {
          this.dataFields.push({ fieldName: data.fieldName, DgType: data.dgType, object: data });
          this.tempMapUniqueID.set(data.fieldName, data.dgUniqueID);
          this.numericDataOnly();
        }
        this.fieldsdata = this.dataFields.filter(v => v.fieldName !== '' && v.fieldName !== undefined);
        this.indexValue = this.fieldsdata.findIndex(i => i.fieldName === this.fieldSelectedname);
      }
      if (data.children) {
        this.nestedChild(data.children, selectedElement);
      }
    });
  }
  updateSetup() {
    this.formula = this.cbpService.selectedElement.DisplayValue;
  }
  ngOnDestroy(): void {
    this.hide();
  }
  hide() {
    this.cbpService.isSetup = false;
    this.sharedService.closeModalPopup('Setup-modal');
    this.closeEvent.emit(false);
  }
  derivedFieldData(data: any) {
    this.cbpService.selectedElement = data.object;
    this.fieldSelectedname = data.fieldName;
    this.fieldSelectedType = data.DgType;
    this.numericDataOnly();
    this.indexValue = this.fieldsdata.findIndex(i => i.fieldName === this.fieldSelectedname);
    this.updateSetup();
  }
  numericDataOnly() {
    if (this.fieldSelectedType === DgTypes.NumericDataEntry) {
      this.fieldsdata = this.dataFields.filter(v => v.fieldName !== '' && v.fieldName !== undefined && v.DgType === DgTypes.NumericDataEntry);
    } else {
      this.fieldsdata = this.dataFields.filter(v => v.fieldName !== '' && v.fieldName !== undefined);
    }
  }
  dataFieldFormula(data: any) {
    this.formula = this.formula + '&' + data.fieldName;
    this.formula = this.formula?.includes('undefined') ? this.formula?.replace('undefined', '') : this.formula;
    this.antlrService.callBackObject.init(data.fieldName, this.tempMapUniqueID.get(data.fieldName));
  }
  operatorData(operator: any) {
    this.formula = this.formula + operator;
  }
  functionData(fun: any) {
    this.formula = this.formula + fun;
  }
  saveSetUp() {
    this.fieldsdata.forEach(item => {
      this.antlrService.callBackObject.init(item.fieldName, this.tempMapUniqueID.get(item.fieldName));
    });
    if (this.cbpService.selectedElement.dgType == DgTypes.Table) {
      this.cbpService.tableDataEntrySelected.DisplayValue = this.formula;
      this.cbpService.tableDataEntrySelected.ParsedValue = this.antlrService.createExpression(this.formula, '', '');
    } else {
      this.cbpService.selectedElement.DisplayValue = this.formula;
      this.cbpService.selectedElement.ParsedValue = this.antlrService.createExpression(this.formula, this.fieldSelectedname, this.tempMapUniqueID.get(this.fieldSelectedname));
    }
    this.cbpService.selectedElement = this.viewUpdateTrack(this.cbpService.selectedElement);
    this.hide();
  }
  viewUpdateTrack(selectedElement: any) {
    selectedElement = this.cbpService.setUserUpdateInfo(selectedElement);
    this.controlService.hideTrackUi({ 'trackUiChange': true });
    return selectedElement;
  }
  ResetFormula() {
    this.formula = '';
    this.cbpService.selectedElement.DisplayValue = '';
    this.cbpService.selectedElement.ParsedValue = '';
  }
}
