import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { AlertMessages, CbpSharedService, DgTypes, rulesConstants } from 'cbp-shared';
import { Actions, Alaram, AuditTypes, FieldOptions, OperatorOptions } from '../../models';
import { AuditService } from '../../services/audit.service';
import { BuilderService } from '../../services/builder.service';
import { CbpService } from '../../services/cbp.service';
import { ControlService } from '../../services/control.service';
import { AntlrService } from '../../shared/services/antlr.service';
import { BuilderUtil } from '../../util/builder-util';
import { Utills } from '../../util/utillMethods';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.css', '../../util/modal.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlarmComponent implements OnInit, OnDestroy, AfterViewInit {
  alaramData: any;
  selectedAlaram: any;
  nodes = [];
  @Input() currentSelectedDataEntry: any;
  @Input() currentNodeSelected: any;
  @Input() selectedElement: any;
  @Output() updateAlarmEmit: EventEmitter<any> = new EventEmitter();
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  isTree = false;
  stepActionObjects: any;
  dataFields: FieldOptions[] = [];
  setfields: FieldOptions[] = [];
  fieldsdata: FieldOptions[] = [];
  setfieldsdata: FieldOptions[] = [];
  tempsectionnumbers = [];
  functionNames = [];
  tempMapUniqueID = new Map();
  tempMapNumberAndUniqueid = new Map();
  componentInfo = 'alarm';
  parentData: any;
  dgType = DgTypes;
  operatorOptions: OperatorOptions[] = [];
  datField: any;
  indexValue: number | undefined;
  isDateTime: any;
  isAlaramEdit: boolean = false;
  comparisonOperators: any = [];
  //AUDIT & UNDO
  alarmRestoreSnapchat: any;
  alarmAuditJSON: Array<any> = [];
  footerList = [{ type: 'Reset' }, { type: 'Undo' }, { type: 'Close' }, { type: 'Save' }]
  alaramDataField: any;
  selectAlarmObj: any;
  selectedIndex: any;
  constructor(public cbpService: CbpService, private builderService: BuilderService,
    private buildUtil: BuilderUtil, private antlrService: AntlrService,
    private cdref: ChangeDetectorRef, public auditService: AuditService,
    public sharedService: CbpSharedService, public controlService: ControlService) {
  }

  ngOnInit() {
    this.comparisonOperators.push("==", ">=", "<=", "<", ">");
    this.sharedService.openModalPopup('Component-alaram');
    this.alaramData = new Alaram();
    this.cbpService.foundStatus = false;
    this.alaramData.alaramInfo = '';
    this.alaramData.alarmTemp = '';
    this.isTree = true;
    this.updateAlarm();
    this.intializeDataKeys(this.selectedElement.parentID);
    if (this.cbpService.selectedElement.dgType === DgTypes.Form) {
      this.selectedElement = this.cbpService.tableDataEntrySelected;
      let data = this.cbpService.tableDataEntrySelected;
      let currentObj = { fieldName: data.fieldName, DgType: data.dgType, object: data };
      this.dataFields.push(currentObj);
      this.alaramData.ParsedValue = currentObj;
      this.tempMapUniqueID.set(data.fieldName, data.dgUniqueID);
      this.fieldsdata = this.dataFields.filter(v => v.fieldName !== '' && v.fieldName !== undefined);
      this.datField = data.fieldName;
      this.indexValue = this.fieldsdata.findIndex(i => i.fieldName === this.datField);
    }
    this.alaramDataField = this.selectedElement.fieldName;
    this.fieldExpresion(this.alaramDataField);
    //Audit snapchat init
    this.alarmRestoreSnapchat = JSON.parse(JSON.stringify(this.selectedElement.alarm));
  }
  alaramFieldData(data: FieldOptions) {
    this.selectedElement = data.object;
    this.fieldExpresion(data);
    this.alaramData.ParsedValue = data;
    this.datField = data.fieldName;
    this.alaramData.alarmaddInfo = [];
    this.indexValue = this.fieldsdata.findIndex(i => i.fieldName === this.datField);
    this.alaramDataField = data.fieldName;
    this.fieldExpresion(data);
    this.updateAlarm();
  }
  checkMaxValue(val: any) {
    if (val.minimum && this.alaramData.DisplayValue) {
      if (this.alaramData.DisplayValue >= val.minimum) {
      } else {
        this.selectedElement['isError'] = true
        console.log(" Value should be greater than or equal to minimum")
        this.alaramData.DisplayValue = null;
        this.clearError()
      }
    }
    if (val.maximum && this.alaramData.DisplayValue) {
      if (this.alaramData.DisplayValue <= val.maximum) {
      } else {
        this.selectedElement['isError'] = true
        console.log(" Value should be less than or equal to maximum")
        this.alaramData.DisplayValue = null;
        this.clearError()
      }
    }
  }
  clearError() {
    setTimeout(() => {
      this.selectedElement.isError = false
    }, 1000);
    this.cdref.detectChanges();
  }

  getFunctionNames() {
    this.builderService.getFunctionGroupNames().subscribe((result: any) => {
      this.functionNames = result.data;
    },
      (error) => {
        console.log(error);
      });
  }
  refreshAlaramInfo() {
    if ((this.alaramData.ParsedValue === undefined || this.alaramData.ParsedValue.fieldName === 'Select Operator') || (this.alaramData.ComparisonOperator === undefined || this.alaramData.ComparisonOperator === '') || this.alaramData.DisplayValue === undefined || this.alaramData.DisplayValue === '') {
      this.cbpService.showSwalDeactive(AlertMessages.alarmAlert, 'warning', 'OK');
      return false;
    }
    this.alaramData.alaramInfo = this.alaramData.alarmTemp + this.alaramDataField + ' ' + this.alaramData.ComparisonOperator
      + ' ' + this.getDisplayValue(this.alaramData.DisplayValue);
  }

  getDisplayValue(value: any) {
    return Utills.isNumber(value) ? `${value}` : `"${value}"`;
  }
  and() {
    if (this.alaramData.ParsedValue.fieldName === '' || this.alaramData.ParsedValue.fieldName === undefined) { this.cbpService.showSwalDeactive(AlertMessages.selectField, 'warning', 'OK'); return false; } else if (this.alaramData.ComparisonOperator === '') { this.cbpService.showSwalDeactive(AlertMessages.selectOperator, 'warning', 'OK'); return false; } else if (this.alaramData.DisplayValue === '') { this.cbpService.showSwalDeactive(AlertMessages.selectValue, 'warning', 'OK'); return false; }

    this.alaramData.alaramInfo =
      this.alaramData.alarmTemp + this.alaramData.ParsedValue.fieldName + ' '
      + this.alaramData.ComparisonOperator + ' ' + this.getDisplayValue(this.alaramData.DisplayValue) + ' ' + rulesConstants.AND + ' &';
    this.alaramData.alarmTemp =
      this.alaramData.alarmTemp + this.alaramData.ParsedValue.fieldName + ' '
      + this.alaramData.ComparisonOperator + ' ' + this.getDisplayValue(this.alaramData.DisplayValue) + ' ' + rulesConstants.AND + ' &';
    this.alaramData.ComparisonOperator = '';
    this.alaramData.DisplayValue = '';
  }
  or() {
    if (this.alaramData.ParsedValue.fieldName === '' || this.alaramData.ParsedValue.fieldName === undefined) { this.cbpService.showSwalDeactive(AlertMessages.selectField, 'warning', 'OK'); return false; } else if (this.alaramData.ComparisonOperator === '') { this.cbpService.showSwalDeactive(AlertMessages.selectOperator, 'warning', 'OK'); return false; } else if (this.alaramData.DisplayValue === '') { this.cbpService.showSwalDeactive(AlertMessages.selectValue, 'warning', 'OK'); return false; }
    this.alaramData.alaramInfo =
      this.alaramData.alarmTemp + this.alaramData.ParsedValue.fieldName + ' '
      + this.alaramData.ComparisonOperator + ' ' + this.getDisplayValue(this.alaramData.DisplayValue) + ' ' + rulesConstants.OR + ' &';
    this.alaramData.alarmTemp =
      this.alaramData.alarmTemp + this.alaramData.ParsedValue.fieldName + ' '
      + this.alaramData.ComparisonOperator + ' ' + this.getDisplayValue(this.alaramData.DisplayValue) + ' ' + rulesConstants.OR + ' &';
    this.alaramData.ComparisonOperator = '';
    this.alaramData.DisplayValue = '';
  }

  fieldExpresion(name: any) {
    this.fieldsdata.filter((x) => {
      if (x.fieldName == name) { name = x; } else if (x.fieldName == name.fieldName) {
        name = x;
      }
    });
    this.isDateTime = name.object;
    if (this.alaramData?.ParsedValue?.DgType === DgTypes.CheckboxDataEntry) {
      this.alaramData.DisplayValue = false;
    } else {
      this.alaramData.DisplayValue = '';
    }
    this.operatorOptions = [];
    this.alaramData.ComparisonOperator = '';
    this.comparisonOperators = [];
    if (name.DgType === DgTypes.BooleanDataEntry || name.DgType === DgTypes.CheckboxDataEntry) {
      this.alaramData.ParsedValue.DgType = name.DgType;
      this.alaramData.ParsedValue.object = name.object;
      this.operatorOptions.push({ name: '==', value: '==' });
      this.comparisonOperators.push("==");
    } else {
      this.operatorOptions.push({ name: '==', value: '==' }, { name: '>=', value: '>=' },
        { name: '<=', value: '<=' }, { name: '>', value: '>' }, { name: '<', value: '<' });
      this.comparisonOperators.push("==", ">=", "<=", "<", ">");
      if (name.DgType === DgTypes.DateDataEntry) { this.alaramData.ParsedValue.DgType = DgTypes.DateDataEntry; }
      else if (name.DgType === DgTypes.NumericDataEntry) { this.alaramData.ParsedValue.DgType = DgTypes.NumericDataEntry; }
      else { this.alaramData.ParsedValue.DgType = name.DgType; }
    }
    this.antlrService.callBackObject.init(name.fieldName, this.tempMapUniqueID.get(name.fieldName));
    this.updateAlarm();
  }
  getMsgInfo() {
    let mesinfo: any;
    let info = this.alaramData.alaramInfo;
    if (info.charAt(info.length - 1) !== "&") {
      if (this.alaramData.AlarmMessage === '') {
        mesinfo = rulesConstants.IF + ' (&' + this.alaramData.alaramInfo.trim() + ')';
      } else {
        mesinfo = rulesConstants.IF + ' (&' + this.alaramData.alaramInfo.trim() + ')' + ' ' + rulesConstants.THEN + '  Message("' + this.alaramData.AlarmMessage + '")';
      }
      return mesinfo;
    } else {
      return false;
    }
  }
  saveAlaram() {
    this.alarmAuditJSON.push(JSON.parse(JSON.stringify(this.selectedElement.alarm)))
    if (this.alaramData.alaramInfo === '  ' || this.alaramData.UniqueID === '' || this.alaramData.AlarmMessage === '') {
      this.cbpService.showSwalDeactive(AlertMessages.alarmAlert, 'warning', 'OK');
      return false;
    }
    let value = this.getMsgInfo()
    if (value !== false) {
      const jsonData: any = {
        DisplayValue: value,
        dgUniqueID: this.buildUtil.getUniqueIdIndex(),
        ParsedValue: this.convertToParse(this.alaramData.alaramInfo),
        fieldName: this.alaramData.ParsedValue.fieldName,
        Setpoint: this.alaramData.Setpoint,
        ComparisonOperator: this.alaramData.ComparisonOperator,
        Equation: this.alaramData.alaramInfo,
        AlarmMessage: this.alaramData.AlarmMessage,
        InAlarm: this.alaramData.InAlarm,
        UniqueID: this.alaramData.UniqueID,
        value: this.alaramData.DisplayValue
      };
      jsonData.ParsedValue = this.antlrService.createExpression(jsonData.ParsedValue, this.alaramData.ParsedValue.fieldName,
        this.tempMapUniqueID.get(this.alaramData.ParsedValue.fieldName));

      let duplicateRule: any = this.selectedElement.alarm.filter((item: any) =>
        // item.DisplayValue === jsonData.DisplayValue && item.fname === jsonData.fname);
        item.ParsedValue === jsonData.ParsedValue && item.fieldName === jsonData.fieldName);
      if (duplicateRule.length === 0) {
        this.selectedElement.alarm.push(jsonData);
        this.updateAlarm();
        this.auditService.createEntry({}, jsonData, Actions.Insert, AuditTypes.ALARM);
        this.alaramData.alaramInfo = '';
        this.alaramData.alarmTemp = '';
        this.alaramData.ParsedValue = '';
        this.alaramData.ComparisonOperator = '';
        this.alaramData.DisplayValue = '';
        this.alaramData.AlarmMessage = '';
        this.alaramData.UniqueID = '';
        this.alaramData.InAlarm = '';
        this.updateAlarm();
        this.setFieldData();
        this.selectedElement = this.cbpService.setUserUpdateInfo(this.selectedElement);
        this.cbpService.setViewUpdateTrack();
        this.controlService.hideTrackUi({ 'trackUiChange': true });
        this.clearCurrentData();
        this.updateAlarmEmit.emit(this.selectedElement);
      }
      else {
        this.clearCurrentData();
        this.cbpService.showSwalDeactive('Unable to add duplicate Rule', 'warning', 'OK');
      }
    } else {
      this.cbpService.showSwalDeactive(AlertMessages.alarmAlert, 'warning', 'OK');
      return false;
    }
  }
  alarmEdit(item: any, i: number) {
    this.selectAlarmObj = item;
    this.selectedIndex = i;
    this.isAlaramEdit = true;
    this.alaramDataField = item.fieldName;
    this.fieldExpresion(item.fieldName);
    this.alaramData.ComparisonOperator = item.ComparisonOperator;
    this.alaramData.DisplayValue = item.value;
    this.alaramData.AlarmMessage = item.AlarmMessage;
    this.alaramData.UniqueID = item.UniqueID;
    this.alaramData.InAlarm = item.InAlarm;
    this.alaramData.alaramInfo = item.DisplayValue;

    this.footerList = [{ type: 'Reset' }, { type: 'Undo' }, { type: 'Close' }, { type: 'Update' }]
  }

  checkDataEntry(dataEntry: any) {
    let returnedEntry: any;
    let splitted = dataEntry.substring(dataEntry.indexOf("&")).split("&");
    let setFieldsData: any = [];
    this.fieldsdata.forEach((item: any) => setFieldsData.push(item.fieldName));
    for (let i = 1; i < splitted.length; i++) {
      const newDataEntry = splitted[i].substring(0, splitted[i].indexOf(" "))
      if (newDataEntry === this.alaramDataField || setFieldsData.includes(newDataEntry)) { returnedEntry = true; }
      else { returnedEntry = false; break; }
    }
    return returnedEntry ? (returnedEntry = this.checkComparisonOperators(dataEntry) ? this.checkAndOroperators(dataEntry) : false) : returnedEntry;
  }
  checkComparisonOperators(sentence: string) {
    const operators = sentence.match(/(?:===|!=|=>=|=<=|>>|<<|<=<|<=>|=>>|<==|>=>|==>|!=>|!>|!|!!|==|<=|>=|<|>)/g) || [];
    let isChecked = false;
    for (let i = 0; i < operators.length; i++) {
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
    const occurrences = (exp.match(/&/g) || []).length;
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
  checkMsgChanged(msg: any, rule: string) {
    const regex = /THEN\s+Message\("([^"]+)"\)/;
    const match = regex.exec(msg);
    if (match) {
      const thenMessage = match[0];
      const messageContent = match[1];
      this.alaramData.AlarmMessage = messageContent;
      return (match.length == 2 && thenMessage.includes("THEN  Message")) ? messageContent : false;
    } else {
      return false
    }

  }
  updateAlarmRule() {
    if (this.alaramData.alaramInfo.includes("IF")) {
      let info = this.alaramData.alaramInfo.split("THEN");
      const equation = info[0].substring(info[0].indexOf('&') + 1, info[0].lastIndexOf(')'));
      if (this.selectAlarmObj.DisplayValue == this.alaramData.alaramInfo &&
        this.alaramData.AlarmMessage != this.selectAlarmObj.AlarmMessage
      ) {
        this.alaramData.alaramInfo = this.updateRule(info[0], this.alaramData.AlarmMessage);
      }
      if (this.checkDataEntry(info[0]) && (this.checkMsgChanged(this.alaramData.alaramInfo, info) ||
        this.alaramData.AlarmMessage != this.selectAlarmObj.AlarmMessage)) {
        const jsonData: any = {
          DisplayValue: this.alaramData.alaramInfo,
          dgUniqueID: this.alaramData.alarmaddInfo[this.selectedIndex].dgUniqueID,
          ParsedValue: this.convertToParse(equation),
          fieldName: this.alaramDataField,
          Setpoint: this.alaramData.Setpoint,
          ComparisonOperator: this.alaramData.ComparisonOperator,
          Equation: this.alaramData.alaramInfo,
          AlarmMessage: this.alaramData.AlarmMessage,
          InAlarm: this.alaramData.InAlarm,
          UniqueID: this.alaramData.UniqueID,
          value: this.alaramData.DisplayValue
        };
        jsonData.ParsedValue = this.antlrService.createExpression(jsonData.ParsedValue, this.alaramData.ParsedValue.fieldName,
          this.tempMapUniqueID.get(this.alaramData.ParsedValue.fieldName));

        this.selectedElement.alarm[this.selectedIndex] = jsonData;
        this.alaramData.alarmaddInfo[this.selectedIndex] = JSON.parse(JSON.stringify(jsonData));
        this.isAlaramEdit = false;
        this.selectAlarmObj = undefined;
        this.selectedIndex = undefined;
        this.clearCurrentData();
        this.footerList = [{ type: 'Reset' }, { type: 'Undo' }, { type: 'Close' }, { type: 'Save' }]

      } else {
        this.cbpService.showSwalDeactive(AlertMessages.alarmAlert, 'warning', 'OK');
        return false;
      }

    }
    else {
      let value = this.getMsgInfo()
      if (value !== false) {
        const jsonData: any = {
          DisplayValue: value,
          dgUniqueID: this.buildUtil.getUniqueIdIndex(),
          ParsedValue: this.convertToParse(this.alaramData.alaramInfo),
          fieldName: this.alaramData.ParsedValue.fieldName,
          Setpoint: this.alaramData.Setpoint,
          ComparisonOperator: this.alaramData.ComparisonOperator,
          Equation: this.alaramData.alaramInfo,
          AlarmMessage: this.alaramData.AlarmMessage,
          InAlarm: this.alaramData.InAlarm,
          UniqueID: this.alaramData.UniqueID,
          value: this.alaramData.DisplayValue
        };
        jsonData.ParsedValue = this.antlrService.createExpression(jsonData.ParsedValue, this.alaramData.ParsedValue.fieldName,
          this.tempMapUniqueID.get(this.alaramData.ParsedValue.fieldName));
        this.selectedElement.alarm[this.selectedIndex] = jsonData;
        let updatedObject = JSON.parse(JSON.stringify(jsonData));
        this.alaramData.alarmaddInfo[this.selectedIndex] = updatedObject;
        this.isAlaramEdit = false;
        this.selectAlarmObj = undefined;
        this.selectedIndex = undefined;
        this.clearCurrentData();
        this.footerList = [{ type: 'Reset' }, { type: 'Undo' }, { type: 'Close' }, { type: 'Save' }]
      } else {
        this.cbpService.showSwalDeactive(AlertMessages.alarmAlert, 'warning', 'OK');
        return false;
      }
    }

  }

  updateRule(rule: string, message: string) {
    return `${rule} THEN Message("${message}")`;
  }

  fieldDataDelete(i: string | number) {
    this.auditService.createEntry({}, this.selectedElement.alarm[i], Actions.Delete, AuditTypes.ALARM);
    this.alarmAuditJSON.push(JSON.parse(JSON.stringify(this.selectedElement.alarm)))
    this.selectedElement.alarm.splice(i, 1);
    this.updateAlarm();
    this.alarmAuditJSON.push(JSON.parse(JSON.stringify(this.selectedElement.alarm)))
  }

  fielddataUp(i: number) {
    this.alarmAuditJSON.push(JSON.parse(JSON.stringify(this.selectedElement.alarm)))
    this.alaramData.alarmaddInfo.forEach((e: any, n: any) => {
      if (n === i && i !== 0) {
        const temp = this.alaramData.alarmaddInfo[i - 1];
        this.alaramData.alarmaddInfo[i - 1] = this.alaramData.alarmaddInfo[i];
        this.alaramData.alarmaddInfo[i] = temp;
      }
    });
    this.reverseUpdateInAlaram();
  }
  fielddataDown(i: number) {
    this.alarmAuditJSON.push(JSON.parse(JSON.stringify(this.selectedElement.alarm)))
    this.alaramData.alarmaddInfo.forEach((e: any, n: any) => {
      if (n === i && this.alaramData.alarmaddInfo.length - 1 !== i) {
        const temp = this.alaramData.alarmaddInfo[i + 1];
        this.alaramData.alarmaddInfo[i + 1] = this.alaramData.alarmaddInfo[i];
        this.alaramData.alarmaddInfo[i] = temp;
      }
    });
    this.reverseUpdateInAlaram();
  }

  reverseUpdateInAlaram() {
    this.selectedElement.alarm = this.alaramData.alarmaddInfo;
  }
  updateAlarm() {
    this.alaramData.alarmaddInfo = [];
    if (this.selectedElement.alarm !== undefined) {
      this.selectedElement.alarm.forEach((result: any) => {
        // if(this.datField === result.fieldName){
        this.alaramData.alarmaddInfo.push(result);
        // }
      });
    }
    // this.selectedElement = this.viewUpdateTrack(this.selectedElement);
  }
  convertToParse(item: string) {
    const obj = `if (&${item.trim()}) { return true; } else { return false; }`;
    return obj;
  }
  selectStepNode(event: any) {
    if (this.cbpService.currentStep !== event.original.dgUniqueID) {
      this.cbpService.currentStep = event.original.dgUniqueID;
    }
    const activestepnumber = event.original.number;
    if (!this.currentSelectedDataEntry) {
      this.intializeDataKeys(activestepnumber);
    }
    this.selectedAlaram = event.original.text.replace('<i class="fa fa-exclamation iscritical"></i>', '');
    this.selectedAlaram = 'Setup Alarm -' + this.selectedAlaram?.replace('rule-css', '');
    this.updateAlarm();
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
  nestedChild(childrenData: any, selectedElement: number) {
    childrenData.forEach((data: { number: number; text: any; dgType: DgTypes; parentID: number; fieldName: any; dgUniqueID: any; children: any; }) => {
      if (selectedElement === data.number) {
        this.selectedAlaram = data.text;
        this.selectedAlaram = 'Setup Alarm -' + this.selectedAlaram;
      }
      if (data.dgType !== DgTypes.StepAction) {
        if (selectedElement >= data.parentID) {
          this.dataFields.push({ fieldName: data.fieldName, DgType: data.dgType, object: data });
          this.tempMapUniqueID.set(data.fieldName, data.dgUniqueID);
          this.fieldsdata = this.dataFields.filter(v => v.fieldName !== '' && v.fieldName !== undefined);
        }
        if (selectedElement === data.parentID) {
          this.setfields.push({ fieldName: data.fieldName, DgType: data.dgType, object: data });
          this.setfieldsdata = this.setfields.filter(v => v.fieldName !== '' && v.fieldName !== undefined);
          if (this.setfieldsdata.length > 0) {
            if (!this.currentSelectedDataEntry) {
              this.datField = this.setfieldsdata[0].fieldName;
              this.alaramData.ParsedValue = this.setfieldsdata[0];
              // this.selectedElement = this.setfieldsdata[0].object;
              this.isDateTime = this.setfieldsdata[0].object;
            } else {
              const dataArray = [];
              this.datField = this.selectedElement.fieldName;
              dataArray.push({ fieldName: this.selectedElement.fieldName, DgType: this.selectedElement.dgType, object: this.selectedElement });
              this.alaramData.ParsedValue = dataArray[0];
              this.isDateTime = dataArray[0].object;
            }
          }
          this.indexValue = this.fieldsdata.findIndex(i => i.fieldName === this.datField);
        }
      }
      if (data.children) {
        this.nestedChild(data.children, selectedElement);
      }
    });
  }

  setFieldData() {
    this.datField = this.setfieldsdata[0].fieldName;
    this.alaramData.ParsedValue = this.setfieldsdata[0];
    // this.selectedElement = this.setfieldsdata[0].object;
    this.isDateTime = this.setfieldsdata[0].object;
  }
  ngAfterViewInit() {
    const element = this.buildUtil.getElementByNumber(this.selectedElement.parentID, this.cbpService.cbpJson.section);
    if (element !== undefined) {
      this.currentNodeSelected = element.dgUniqueID;
    }
    this.cdref.detectChanges();
  }

  hide() {
    this.cbpService.isAlaramOpen = false;
    this.sharedService.closeModalPopup('Component-alaram');
    this.closeEvent.emit(false)
  }
  resetAlaram() {
    this.selectedElement.alarm = JSON.parse(JSON.stringify(this.alarmRestoreSnapchat));
    this.updateAlarm();
    this.clearCurrentData();
  }
  clearCurrentData() {
    this.alaramData.ComparisonOperator = '';
    this.alaramData.DisplayValue = '';
    this.alaramData.alaramInfo = '';
    this.alaramData.UniqueID = '';
    this.alaramData.AlarmMessage = '';
    this.alaramData.InAlarm = false;
  }
  undoAlaram() {
    if (this.alarmAuditJSON.length > 0) {
      this.selectedElement.alarm = JSON.parse(JSON.stringify(this.alarmAuditJSON.pop()));
      this.updateAlarm();
    }
  }
  ngOnDestroy() {
    this.hide();
  }
}
