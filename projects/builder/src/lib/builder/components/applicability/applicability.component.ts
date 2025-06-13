import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { AlertMessages, CbpSharedService, DgTypes, rulesConstants } from 'cbp-shared';
import { Actions, Applicability, AuditTypes, FieldOptions, OperatorOptions } from '../../models';
import { AuditService } from '../../services/audit.service';
import { BuilderService } from '../../services/builder.service';
import { CbpService } from '../../services/cbp.service';
import { AntlrService } from '../../shared/services/antlr.service';
import { BuilderUtil } from '../../util/builder-util';
import { Utills } from '../../util/utillMethods';
import { ControlService } from './../../services/control.service';

@Component({
  selector: 'app-applicability',
  templateUrl: './applicability.component.html',
  styleUrls: ['./applicability.component.css', '../../util/modal.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicabilityComponent implements OnInit, OnDestroy, AfterViewInit {
  element: any;
  @Input() selectedElement: any
  @Output() updateApplicablity: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeEvent: EventEmitter<any> = new EventEmitter<any>();
  control = false;
  headerItem: any;
  renameNode: any;
  createNode: any;
  isTree = true;
  quickAccess = false;
  currentNodeSelected: any;
  tempsectionnumbers = [];
  nodes = [];
  stepActionObjects: any;
  appnum = '';
  jsonFiledData = [];
  dataFields: FieldOptions[] = [];
  fieldsdata: FieldOptions[] = [];
  elseval = '';
  tempMapUniqueID = new Map();
  tempMapNumberAndUniqueid = new Map();
  functionNames = [];
  componentInfo = 'applicability';
  parentData: any;
  operatorOptions: OperatorOptions[] = [];
  datField: any;
  dgType = DgTypes;
  isDateTime: any;
  footerList = [{ type: 'Reset' }, { type: 'Undo' }, { type: 'Close' }, { type: 'Save' }]
  selectAppObj: any;
  selectedIndex: any;
  isEdit: boolean = false;
  comparisonOperators: any = [];
  //AUDIT & UNDO
  applicabilityRestoreSnapchat: any;
  applicabilityAuditJSON: Array<any> = [];
  tableTempObj: any;
  isReached: boolean = false;

  constructor(private builderutills: BuilderUtil, public cbpService: CbpService,
    public notifier: NotifierService, private builderService: BuilderService,
    private antlrService: AntlrService, public auditService: AuditService,
    public sharedService: CbpSharedService, private cdref: ChangeDetectorRef,
    public controlService: ControlService) {

  }

  ngOnInit() {
    this.operatorOptions.push(
      { name: '==', value: '==' }, { name: '>=', value: '>=' }, { name: '<=', value: '<=' },
      { name: '>', value: '>' }, { name: '<', value: '<' }, { name: '!=', value: '!=' });
    this.comparisonOperators.push("==", ">=", "<=", "<", ">");
    this.applicabilityRestoreSnapchat = JSON.parse(JSON.stringify(this.selectedElement.applicabilityRule));
    this.changeControl(true);
    this.element = new Applicability();
    this.currentNodeSelected = this.selectedElement.dgUniqueID;
    this.appnum = this.selectedElement.text;
    this.updateApp();
    this.intializeDataKeys(this.selectedElement.dgUniqueID);
    if (this.fieldsdata.length > 0) {
      this.sharedService.openModalPopup('component-applicability');
      this.element.dgUniqueID = this.selectedElement.dgUniqueID;
    } else {
      this.cbpService.isApplicabiltyOpen = false;
      this.cbpService.setCutCopyMethodType('error', 'Unable to open Rule popup due to No data entries on previous steps', true);
    }
    this.setCallBackDgIds();
  }

  changeControl(type: string | boolean) {
    this.control = this.quickAccess = type === 'control' ? true : false;
  }
  selectStepNode(event: any) {
    this.currentNodeSelected = event.original.dgUniqueID;
    this.selectedElement = this.builderutills.getElementByDgUniqueID(this.currentNodeSelected, this.cbpService.cbpJson.section);
    if (this.cbpService.currentStep !== event.original.dgUniqueID) {
      this.cbpService.currentStep = event.original.dgUniqueID;
    }
    // const activestepnumber = event.original.dgUniqueID;
    this.intializeDataKeys(event.original.dgUniqueID);
    const value = event.original.text.replace('<i class="fa fa-exclamation iscritical"></i>', '');
    this.appnum = value;
    this.appnum = 'Applicability Rule -' + this.appnum.replace('rule-css', '');
    this.updateApp();
    this.cdref.detectChanges()
  }
  intializeDataKeys(selectedElement: any) {
    this.dataFields = [];
    this.fieldsdata = [];
    const secObj = this.cbpService.cbpJson.section;
    for (let i = 0; i < secObj.length; i++) {
      this.parentData = this.cbpService.cbpJson.section[i].children;
      if (!this.isReached && this.cbpService.cbpJson.section[i]?.dgUniqueID !== selectedElement) {
        this.nestedChild(this.parentData, selectedElement);
      } else {
        this.isReached = false;
        break;
      }
    }
  }

  checkBooleandataentry() {
    if (this.element.ParsedValue !== undefined) {
      if (this.element.ParsedValue.DgType === DgTypes.BooleanDataEntry || this.element.ParsedValue.DgType === DgTypes.CheckboxDataEntry) {
        return true;
      } else {
        return false;
      }
    }
  }
  fieldExpresion(name: FieldOptions) {
    this.isDateTime = name.object;
    this.datField = name.fieldName;
    this.operatorOptions = [];
    if (this.element?.ParsedValue?.DgType === DgTypes.CheckboxDataEntry) {
      this.element.DisplayValue = false;
    } else {
      this.element.DisplayValue = '';
    }
    this.element.ComparisonOperator = '';
    this.comparisonOperators = [];
    // this.operatorOptions.push({ name: 'Select Operator', value: 'Select Operator' });
    if (name.DgType === DgTypes.BooleanDataEntry || name.DgType === DgTypes.CheckboxDataEntry) {
      this.operatorOptions.push({ name: '==', value: '==' });
      this.comparisonOperators.push("==");
    } else {
      this.operatorOptions.push({ name: '==', value: '==' },
        { name: '>=', value: '>=' }, { name: '<=', value: '<=' },
        { name: '>', value: '>' }, { name: '<', value: '<' });
      this.comparisonOperators.push("==", ">=", "<=", "<", ">");
    }
    this.antlrService.callBackObject.init(name.fieldName, this.tempMapUniqueID.get(name.fieldName));
  }


  nestedChild(childrenData: any, selectedElement: number) {
    if (this.isReached)
      return;
    for (let i = 0; i < childrenData?.length; i++) {
      let data: any = childrenData[i];
      if (selectedElement == data.dgUniqueID || selectedElement == data.parentDgUniqueID) {
        this.isReached = true;
      } else {
        if (!this.controlService.isDataEntryAccept(data)) {
          if (selectedElement !== data.dgUniqueID) {
            this.dataFields.push({ fieldName: data.fieldName, DgType: data.dgType, object: data });
            this.tempMapUniqueID.set(data.fieldName, data.dgUniqueID);
            this.fieldsdata = this.dataFields.filter(function (v) { return v.fieldName !== '' && v.fieldName !== undefined; });
            if (this.fieldsdata.length > 0) {
              this.datField = this.fieldsdata[0].fieldName;
              this.element.ParsedValue = this.fieldsdata[0];
              this.isDateTime = this.fieldsdata[0].object;
              this.antlrService.callBackObject.init(this.fieldsdata[0].fieldName, this.tempMapUniqueID.get(this.fieldsdata[0].fieldName));
            }
          }
        }
        if (data.children) {
          this.nestedChild(data.children, selectedElement);
        }
        if (data.dgType === DgTypes.DualAction) {
          this.nestedChild(data?.rightDualChildren, selectedElement);
        }
      }
    }
  }

  hide() {
    this.cbpService.isApplicabiltyOpen = false;
    this.sharedService.closeModalPopup('component-applicability');
    this.closeEvent.emit(false);
  }

  fieldDataDelete(index: string | number) {
    this.auditService.createEntry({}, this.element.applicabulityaddInfo[index], Actions.Delete, AuditTypes.APPLICABILITY_RULE);
    this.applicabilityAuditJSON.push(JSON.parse(JSON.stringify(this.element.applicabulityaddInfo)))
    this.element.applicabulityaddInfo = this.element.applicabulityaddInfo.filter((e: any, i: string | number) => index !== i);
    this.selectedElement.applicabilityRule.splice(index, 1);
    this.selectedElement['text'] = this.selectedElement.number;
    if (!this.element.applicabulityaddInfo.length) {
      this.renameNode = JSON.parse(JSON.stringify(this.selectedElement))
      this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
    }
  }
  refreshApplicabulityInfo() {
    if (this.isEdit) {
      let elseAction = this.element.applicabulityInfo.substring(this.element.applicabulityInfo.indexOf('ELSE') + 'ELSE'.length, this.element.applicabulityInfo.length).trim();
      let thenAction = this.element.applicabulityInfo.substring(this.element.applicabulityInfo.indexOf('THEN') + 'THEN'.length, this.element.applicabulityInfo.indexOf('ELSE')).trim();
      if (this.element.fieldName !== thenAction) {
        this.element.applicabulityInfo = this.element.applicabulityInfo.substring(0, this.element.applicabulityInfo.indexOf('THEN')) + ' THEN ' + this.element.fieldName + ' ELSE ' + thenAction;
      }
    } else {
      if (this.element.ParsedValue.fieldName === '' || this.element.ParsedValue.fieldName === undefined) { this.cbpService.showSwalDeactive(AlertMessages.selectField, 'warning', 'OK'); return false; } else if (this.element.ComparisonOperator === '' || this.element.ComparisonOperator === 'Select Operator') { this.cbpService.showSwalDeactive(AlertMessages.selectOperator, 'warning', 'OK'); return false; } else if (this.element.DisplayValue === '') { this.cbpService.showSwalDeactive(AlertMessages.selectValue, 'warning', 'OK'); return false; }
      this.element.applicabulityInfo = this.element.applicabilityTemp + this.element.ParsedValue.fieldName + ' ' + this.element.ComparisonOperator + ' ' + this.getDisplayValue(this.element.DisplayValue);
    }
  }

  changeRule() {
    this.element.applicabilityTemp = this.element.applicabulityInfo;
  }

  add() {
    if (this.element.applicabulityInfo.charAt(this.element.applicabulityInfo.length - 1) === "&") {
      this.cbpService.showSwalDeactive(AlertMessages.alarmAlert, 'warning', 'OK');
      return false;
    }
    else if (this.element.ParsedValue.fieldName === '') {
      this.cbpService.showSwalDeactive(AlertMessages.selectField, 'warning', 'OK');
      return false;
    }
    else if (this.element.ComparisonOperator === '') {
      this.cbpService.showSwalDeactive(AlertMessages.selectOperator, 'warning', 'OK');
      return false;
    }
    else if (this.element.DisplayValue === '') {
      this.cbpService.showSwalDeactive(AlertMessages.selectValue, 'warning', 'OK');
      return false;
    }
    if (this.element.fieldName === undefined || this.element.fieldName === '') {
      this.cbpService.showSwalDeactive(AlertMessages.selectAction, 'warning', 'OK');
    }
    else {
      if (this.element.fieldName === 'Continue()') {
        this.elseval = 'Skip()';
      } else {
        this.elseval = 'Continue()';
      }
      const data = {
        DisplayValue: rulesConstants.IF + ' (&' + this.element.applicabulityInfo + ')' + ' ' + rulesConstants.THEN + ' ' + this.element.fieldName + ' ' + rulesConstants.ELSE + ' ' + this.elseval,
        ParsedValue: `if &${this.element.applicabulityInfo.trim()} { ${this.element.fieldName.toLowerCase()}; } else { ${this.elseval.toLowerCase()}; }`,
        fieldname: this.element.ParsedValue.fieldName,
        dgUniqueID: this.tempMapUniqueID.get(this.element.ParsedValue.fieldName)
      };
      let duplicateRule = this.element.applicabulityaddInfo.filter((item: any) =>
        item.DisplayValue === data.DisplayValue && item.fieldname === data.fieldname);
      if (duplicateRule.length === 0) {
        this.element.applicabulityaddInfo.push(data);
        return data;
      } else {
        this.cbpService.showSwalDeactive('Unable to add duplicate Rule', 'warning', 'OK');
      }
    }
  }
  and() {
    if (this.element.ParsedValue.fieldName === '' || this.element.ParsedValue.fieldName === undefined) { this.cbpService.showSwalDeactive(AlertMessages.selectField, 'warning', 'OK'); return false; } else if (this.element.ComparisonOperator === '') { this.cbpService.showSwalDeactive(AlertMessages.selectOperator, 'warning', 'OK'); return false; } else if (this.element.DisplayValue === '') { this.cbpService.showSwalDeactive(AlertMessages.selectValue, 'warning', 'OK'); return false; }
    this.element.applicabulityInfo = this.element.applicabilityTemp + this.element.ParsedValue.fieldName + ' ' + this.element.ComparisonOperator + ' ' + this.getDisplayValue(this.element.DisplayValue) + ' ' + rulesConstants.AND + ' &';
    this.element.applicabilityTemp = this.element.applicabilityTemp + this.element.ParsedValue.fieldName + ' ' + this.element.ComparisonOperator + ' ' + this.getDisplayValue(this.element.DisplayValue) + ' ' + rulesConstants.AND + ' &';
    this.element.DisplayValue = '';
    this.element.ComparisonOperator = '';
    this.element.ParsedValue = '';
  }
  or() {
    if (this.element.ParsedValue.fieldName === '' || this.element.ParsedValue.fieldName === undefined) { this.cbpService.showSwalDeactive(AlertMessages.selectField, 'warning', 'OK'); return false; } else if (this.element.ComparisonOperator === '') { this.cbpService.showSwalDeactive(AlertMessages.selectOperator, 'warning', 'OK'); return false; } else if (this.element.DisplayValue === '') { this.cbpService.showSwalDeactive(AlertMessages.selectValue, 'warning', 'OK'); return false; }
    this.element.applicabulityInfo = this.element.applicabilityTemp + this.element.ParsedValue.fieldName + ' ' + this.element.ComparisonOperator + ' ' + this.getDisplayValue(this.element.DisplayValue) + ' ' + rulesConstants.OR + ' &';
    this.element.applicabilityTemp = this.element.applicabilityTemp + this.element.ParsedValue.fieldName + ' ' + this.element.ComparisonOperator + ' ' + this.getDisplayValue(this.element.DisplayValue) + ' ' + rulesConstants.OR + ' &';
    this.element.DisplayValue = '';
    this.element.ComparisonOperator = '';
    this.element.ParsedValue = '';
  }
  getDisplayValue(value: any) {
    return Utills.isNumber(value) ? `${value}` : `"${value}"`;
  }
  convertToParse(item: any) {
    return item;
  }
  saveApplicabilty() {
    let duplicate = false;
    this.applicabilityAuditJSON.push(JSON.parse(JSON.stringify(this.element.applicabulityaddInfo)))
    let newObj: any = this.add();
    let jsonData: any;
    if (newObj?.fieldname) {
      jsonData = {
        DisplayValue: newObj.DisplayValue,
        ParsedValue: newObj.ParsedValue,
        dgUniqueID: this.builderutills.getUniqueIdIndex(),
        fieldname: newObj.fieldname
      };
      jsonData.ParsedValue = this.antlrService.createExpression(jsonData.ParsedValue, newObj.fieldname, newObj.dgUniqueID);
    } else if (!newObj?.fieldname) {
      jsonData = {
        DisplayValue: newObj.DisplayValue,
        ParsedValue: newObj.ParsedValue,
        dgUniqueID: this.builderutills.getUniqueIdIndex(),
        fieldname: newObj.fieldname
      };
    }
    if (jsonData?.DisplayValue && jsonData?.ParsedValue && jsonData?.fieldname) {
      let duplicateRule = this.selectedElement.applicabilityRule.filter((item: any) =>
        item.ParsedValue === jsonData.ParsedValue && item.fieldname === jsonData.fieldname);
      if (duplicateRule.length === 0) {
        this.selectedElement.applicabilityRule.push(jsonData);
        this.auditService.createEntry({}, jsonData, Actions.Insert, AuditTypes.APPLICABILITY_RULE);
        this.element.applicabulityInfo = '';
        this.element.applicabilityTemp = '';
        this.element.ParsedValue = '';
        this.element.ComparisonOperator = '';
        this.element.DisplayValue = '';
        this.element.fieldName = '';
        delete this.selectedElement.applicability;
      } else { duplicate = true; }

      if (!duplicate) {
        this.selectedElement = this.builderutills.setIconAndText(this.selectedElement);
        this.renameNode = this.selectedElement;
        this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
        //  this.updateApplicablity.emit(this.selectedElement);
      }
    }


  }
  checkDataEntry(dataEntry: any) {
    let returnedEntry: any;
    let splitted = dataEntry.substring(dataEntry.indexOf("&")).split("&");
    let setFieldsData: any = [];
    this.fieldsdata.forEach((item: any) => setFieldsData.push(item.fieldName));
    for (let i = 1; i < splitted.length; i++) {
      const newDataEntry = splitted[i].substring(0, splitted[i].indexOf(" "))
      if (newDataEntry === this.element.ParsedValue.fieldName || setFieldsData.includes(newDataEntry)) { returnedEntry = true; }
      else { returnedEntry = false; break; }
    }
    return returnedEntry ? (returnedEntry = this.checkComparisonOperators(dataEntry) ? this.checkAndOroperators(dataEntry) : false) : returnedEntry;
  }
  checkComparisonOperators(sentence: string) {
    const operators = sentence.match(/(?:===|!=|=>=|=<=|>>|<<|<=<|<=>|=>>|<==|>=>|==>|!=>|!>|!|!!|==|<=|>=|<|>)/g) || [];
    let isChecked = false;
    for (let i = 0; i < operators?.length; i++) {
      if (this.comparisonOperators.includes(operators[i])) {
        isChecked = true;
      } else {
        isChecked = false;
        break;
      }
    }
    return isChecked;
  }
  checkAndOroperators(exp: any) {
    const occurrences = (exp.match(/&/g) || []).length
    let isChecked = false;
    if (occurrences > 1) {
      for (let i = 1; i <= occurrences - 1; i++) {
        if (exp.includes("AND &") || exp.includes("OR &")) { isChecked = true; }
        else { isChecked = false; break; }
      }
      return isChecked;
    } else {
      return true;
    }

  }
  appEdit(editObj: any, index: any) {
    this.selectAppObj = editObj;
    this.selectedIndex = index;
    this.isEdit = true;
    this.element.dgUniqueID = editObj.dgUniqueID === undefined ? editObj.DgUniqueID : editObj.dgUniqueID;
    this.element.applicabulityInfo = editObj.DisplayValue
    this.element.fieldName = editObj.DisplayValue.substring(editObj.DisplayValue.indexOf('THEN') + 'THEN'.length, editObj.DisplayValue.indexOf('ELSE')).trim();
    this.fieldsdata.filter((result: any) => { if (result.fieldName === editObj.fieldname) { this.element.ParsedValue = result; } });
    const match = editObj.DisplayValue.match(/&([^)]+)/);
    let value = match[1];
    value = value.substring(value.indexOf(this.element.ParsedValue.fieldName)).match(/(?:==|=>|<=|<|>)\s*(.+)/);
    this.element.DisplayValue = value[1].trim();
    const operators = editObj.DisplayValue.match(/(?:==|<=|>=|<|>)/g) || [];
    operators.length > 0 ? this.element.ComparisonOperator = operators[0] : '';
    this.footerList = [{ type: 'Reset' }, { type: 'Undo' }, { type: 'Close' }, { type: 'Update' }]
  }
  checkActionChange() {
    let elseAction = this.element.applicabulityInfo.substring(this.element.applicabulityInfo.indexOf('ELSE') + 'ELSE'.length, this.element.applicabulityInfo.length).trim();
    let newAction = this.element.applicabulityInfo.substring(this.element.applicabulityInfo.indexOf('THEN') + 'THEN'.length, this.element.applicabulityInfo.indexOf('ELSE')).trim();
    let actions = ["Continue()", "Skip()"];
    if (newAction != null || newAction !== '') {
      return (actions.includes(newAction) && actions.includes(elseAction)) ? true : false;
    }
    else {
      return false;
    }
  }

  updateApplicabilityRule() {
    if (this.element.applicabulityInfo.includes("IF")) {
      if (this.checkActionChange() && this.checkDataEntry(this.element.applicabulityInfo)) {
        this.element.fieldName === 'Continue()' ? this.elseval = 'Skip()' : this.elseval = 'Continue()';
        const pattern = /&([^)]+)/;
        const match = this.element.applicabulityInfo.match(pattern);
        let value = match[1];
        const data = {
          DisplayValue: rulesConstants.IF + ' (&' + value + ')' + ' ' + rulesConstants.THEN + ' ' + this.element.fieldName + ' ' + rulesConstants.ELSE + ' ' + this.elseval,
          ParsedValue: `if &${value.trim()} { ${this.element.fieldName.toLowerCase()}; } else { ${this.elseval.toLowerCase()}; }`,
          fieldname: this.element.ParsedValue.fieldName,
          dgUniqueID: this.tempMapUniqueID.get(this.element.ParsedValue.fieldName)
        };
        let jsonData = {
          DisplayValue: data.DisplayValue,
          ParsedValue: data.ParsedValue,
          dgUniqueID: this.selectedElement.applicabilityRule[this.selectedIndex].dgUniqueID,
          fieldname: data.fieldname
        };
        this.storeFieldsinCallBack(jsonData?.DisplayValue);
        jsonData.ParsedValue = this.antlrService.createExpression(jsonData.ParsedValue, jsonData.fieldname, jsonData.dgUniqueID);
        let duplicateRule1 = this.selectedElement.applicabilityRule.filter((item: any) =>
          item.ParsedValue === jsonData.ParsedValue && item.fieldname === jsonData.fieldname);
        if (duplicateRule1.length === 0) {
          this.selectedElement.applicabilityRule[this.selectedIndex] = jsonData;
          this.element.applicabulityInfo = '';
          this.element.applicabilityTemp = '';
          this.element.ParsedValue = '';
          this.element.ComparisonOperator = '';
          this.element.DisplayValue = '';
          this.element.fieldName = '';
          delete this.selectedElement.applicability;
          this.selectedElement = this.builderutills.setIconAndText(this.selectedElement);
          this.renameNode = this.selectedElement;
          this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
          this.selectAppObj = undefined;
          this.selectedIndex = undefined;
          this.isEdit = false;
          this.updateApp();
          this.footerList = [{ type: 'Reset' }, { type: 'Undo' }, { type: 'Close' }, { type: 'Save' }];
        }

      } else {
        this.cbpService.showSwalDeactive(AlertMessages.alarmAlert, 'warning', 'OK');
        return false;
      }
    }
  }
  ngAfterViewInit() {
    this.currentNodeSelected = this.selectedElement.dgUniqueID;
  }
  getFunctionNames() {
    this.builderService.getFunctionGroupNames().subscribe((result: any) => {
      this.functionNames = result.data;
    },
      (error) => {
        console.log(error);
      });
  }

  fielddataUp(i: number) {
    this.applicabilityAuditJSON.push(JSON.parse(JSON.stringify(this.element.applicabulityaddInfo)))
    this.element.applicabulityaddInfo.forEach((e: any, n: number) => {
      if (n === i && i !== 0) {
        const temp = this.element.applicabulityaddInfo[i - 1];
        this.element.applicabulityaddInfo[i - 1] = this.element.applicabulityaddInfo[i];
        this.element.applicabulityaddInfo[i] = temp;
      }
    });
    this.reverseUpdateInApplicability();
  }
  fielddataDown(i: number) {
    this.applicabilityAuditJSON.push(JSON.parse(JSON.stringify(this.element.applicabulityaddInfo)))
    this.element.applicabulityaddInfo.forEach((e: any, n: number) => {
      if (n === i && this.element.applicabulityaddInfo.length - 1 !== i) {
        const temp = this.element.applicabulityaddInfo[i + 1];
        this.element.applicabulityaddInfo[i + 1] = this.element.applicabulityaddInfo[i];
        this.element.applicabulityaddInfo[i] = temp;
      }
    });
    this.reverseUpdateInApplicability();
  }
  reverseUpdateInApplicability() {
    // this.selectedElement.applicabilityRule = this.element.applicabulityaddInfo;
  }
  updateApp() {
    this.element.applicabulityaddInfo = [];
    if (this.selectedElement.applicabilityRule !== undefined) {
      this.selectedElement.applicabilityRule.forEach((result: any) => {
        this.element.applicabulityaddInfo.push(result);
      });
    }
  }

  resetApplicability() {
    this.element.ParsedValue = '';
    this.element.ComparisonOperator = '';
    this.element.DisplayValue = '';
    this.element.fieldName = '';
    this.element.applicabulityInfo = '';
    // this.element.ParsedValue =  JSON.parse(JSON.stringify( this.dataFields)).ParsedValue ;
    //  this.selectedElement.applicabilityRule =  JSON.parse(JSON.stringify( this.applicabilityRestoreSnapchat));
    //  this.updateApp();
    // this.tableTempObj = JSON.parse(JSON.stringify( this.dataFields));
  }
  undoApplicability() {
    if (this.applicabilityAuditJSON.length > 0) {
      this.selectedElement.applicabilityRule = JSON.parse(JSON.stringify(this.applicabilityAuditJSON.pop()));
      this.updateApp();
    }
  }
  appFieldData(data: any) {
    this.isEdit = false;
    this.fieldExpresion(data);
    this.element.ParsedValue = data;
    this.datField = data.fieldName;
    this.element.DisplayValue = '';
    this.element.conditionDataInfo = [];
    this.fieldExpresion(data);
  }
  storeFieldsinCallBack(rule: string) {
    let split = rule.split("&");
    for (let i = 0; i < split.length; i++) {
      if (split[i].includes('DataEntry')) {
        let pos = this.getPosition(split[i], ' ', 1)
        this.antlrService.callBackObject.init(split[i].slice(0, pos), this.tempMapUniqueID.get(split[i].slice(0, pos)));
      }
    };
  }
  getPosition(str: string, m: string, i: number) { return str.split(m, i).join(m).length; }
  setCallBackDgIds() {
    if (this.element.applicabulityaddInfo?.length > 0) {
      let rules: any = this.element.applicabulityaddInfo;
      for (let i = 0; i < rules?.length; i++) {
        let ruleSplit = rules[i].DisplayValue.split("THEN")
        this.storeFieldsinCallBack(ruleSplit[0]);
        if (rules[i].ParsedValue.includes("undefined")) {
          const regex = /IF \(&(.+)\) THEN/;
          const match = rules[i].DisplayValue.match(regex);
          const extractThen = rules[i].DisplayValue.match(/THEN (.*?) ELSE (.*)/);
          let updatedParsedValue: any;
          let extracted: any;
          if (match && match[1]) {
            extracted = match[1]
            if (extractThen && extractThen[1] && extractThen[2]) {
              const thenPart = extractThen[1].trim();
              const elsePart = extractThen[2].trim();
              updatedParsedValue = `if &${extracted.trim()} { ${thenPart.toLowerCase()}; } else { ${elsePart.toLowerCase()}; }`;
            }
            rules[i].ParsedValue = this.antlrService.createExpression(updatedParsedValue, rules[i].fieldname, rules[i].dgUniqueID);
          } else {
            console.log('No match found');
          }

        }
      }
    }
  }
  ngOnDestroy(): void {
    this.hide();
  }

}
