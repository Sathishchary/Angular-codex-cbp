
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
import { AlertMessages, CbpSharedService, DgTypes } from 'cbp-shared';
import { AuditTypes } from '../../models';
import { FieldOptions } from '../../models/_fieldOptions';
import { Actions } from '../../models/actions';
import { OperatorOptions } from '../../models/OperatorOptions';
import { Rules } from '../../models/rules.model';
import { AuditService } from '../../services/audit.service';
import { BuilderService } from '../../services/builder.service';
import { CbpService } from '../../services/cbp.service';
import { ControlService } from '../../services/control.service';
import { AntlrService } from '../../shared/services/antlr.service';
import { TableService } from '../../shared/services/table.service';
import { BuilderUtil } from '../../util/builder-util';
import { Utills } from '../../util/utillMethods';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css', '../../util/modal.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RulesComponent implements OnInit, OnDestroy, AfterViewInit {
  ruleData: any;
  @Input() selectedElement: any;
  rulesStepNo: any;
  control = false;
  headerItem: any;
  createNode: any;
  isTree = true;
  datField: any;
  tableTempObj: any;
  quickAccess = false;
  currentNodeSelected: any;
  nodes = [];
  dataFields: FieldOptions[] = [];
  fieldsdata: FieldOptions[] = [];
  functionNames = [];
  componentInfo = 'rule';
  parentData: any;
  dgType = DgTypes;
  isDateTime: any;
  @Output()
  closeEvent: EventEmitter<any> = new EventEmitter();
  @Output()
  updateConditional: EventEmitter<any> = new EventEmitter();
  //AUDIT & UNDO
  rulesRestoreSnapchat: any;
  rulesAuditJSON: Array<any> = [];
  footerList = [{ type: 'Reset' }, { type: 'Undo' }, { type: 'Close' }, { type: 'Save' }];
  columnList: any[] = [];
  attributeList: any[] = [];
  isValidRule = true;
  attributeDisableList: any[] = [];
  isRuleEdit: boolean = false;
  selectRuleObj: any;
  selectedIndex: any;
  atLeastOneColumn = false;
  comparisonOperators: any = [];
  isReached = false;
  tableRulesAuditJSON: Array<any> = [];
  constructor(private builderutills: BuilderUtil, public cbpService: CbpService,
    private builderService: BuilderService, public tableService: TableService,
    private antlrService: AntlrService, public auditService: AuditService,
    public sharedService: CbpSharedService, private cdr: ChangeDetectorRef,
    public controlService: ControlService) {

  }
  tempsectionnumbers: any[] = [];
  gotoSections: any[] = [];
  tempMapUniqueID = new Map();
  tempMapNumberAndUniqueid = new Map();
  operatorOptions: OperatorOptions[] = [];
  refresh = true;
  ngOnInit() {
    this.operatorOptions.push(
      { name: '==', value: '==' },
      { name: '>=', value: '>=' },
      { name: '<=', value: '<=' },
      { name: '>', value: '>' },
      { name: '<', value: '<' },
      { name: '!=', value: '!=' });
    this.comparisonOperators.push("==", ">=", "<=", "<", ">", "!=");
    this.changeControl(true);
    this.currentNodeSelected = this.selectedElement.dgUniqueID;
    this.cbpService.foundStatus = false;
    this.rulesStepNo = this.selectedElement.text;
    this.ruleData = new Rules();
    this.intializeDataKeys(this.selectedElement.dgUniqueID);
    this.updateRule();
    this.setCallBackDgIds();
    this.ruleData.ruleInfo = '';
    this.ruleData.ruleTemp = '';
    if (this.cbpService.selectedElement.dgType === 'Form') {
      if (this.checkTableRuleValidation() && this.isValidRule && this.atLeastOneColumn) {
        if (this.tableService.selectedRow?.length === 0) {
          this.tableService.selectedRow.push({ row: 0, col: 0 });
        }
        if (this.cbpService.selectedElement?.isFirstRow) {
          this.tableService.selectedRow = [];
          this.tableService.selectedRow.push({ row: 1, col: 0 })
        }
        this.columnList = this.cbpService.selectedElement.calstable[0].table.tgroup.thead;
        this.ruleData['columnValue'] = this.columnList[this.tableService.selectedRow[0].col].fieldName;
        this.ruleData.conditionType = 'IF THEN';
        let tablerows = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row;
        this.attributeList = tablerows[this.tableService.selectedRow[0].row].entry[this.tableService.selectedRow[0].col].children
        this.attributeList = this.attributeList.filter((item: any) => item.dgType);
        this.sharedService.openModalPopup('Component-rule');
      } else {
        this.isValidRule = true;
        if (!this.atLeastOneColumn) {
          this.cbpService.setCutCopyMethodType('error', 'Unable to open Table Rule popup due to no data entries', true);
        } else {
          this.cbpService.setCutCopyMethodType('error', 'Can\'t enable table Rule due to different data entries', true);
        }
      }
    } else {
      if (this.fieldsdata.length > 0) {
        this.sharedService.openModalPopup('Component-rule');
      } else {
        this.cbpService.isRulesOpen = false;
        this.cbpService.setCutCopyMethodType('error', 'Unable to open Rule popup due to No data entries on previous steps', true);
      }
    }
  }
  checkTableRuleValidation() {
    let success = false;
    let tablerow = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row;
    let newTableRow = JSON.parse(JSON.stringify(tablerow));
    if (this.cbpService.selectedElement?.rowsCount !== 0) {
      newTableRow = newTableRow.slice(this.cbpService.selectedElement?.rowsCount);
    }
    let firstRow = newTableRow[0];
    for (let j = 0; j < newTableRow.length; j++) {
      success = this.checkColumnField(newTableRow[j], firstRow);
      if (!success) this.isValidRule = false;
    }
    return success;
  }

  checkColumnField(row: any, rowData: any) {
    let success = false;
    for (let i = 0; i < row.entry.length; i++) {
      const firstRow = row.entry[i].children.filter((item: any) => item.dgType);
      const secondRow = rowData.entry[i].children.filter((item: any) => item.dgType);
      if (!this.atLeastOneColumn)
        this.atLeastOneColumn = firstRow.length > 0 && secondRow.length > 0 ? true : false;
      if (firstRow.length === secondRow.length && (firstRow.length > 0 && secondRow.length > 0)) {
        success = firstRow.every((item: any, index: any) => item.dgType === secondRow[index].dgType);
        if (!success) { this.isValidRule = success; break; }
      } else {
        this.isValidRule = success = false;
        break;
      }
    }
    return success;
  }

  ruleFieldData(data: any) {
    this.fieldExpresion(data);
    this.ruleData.ParsedValue = data;
    this.datField = data.fieldName;
    this.isDateTime = data.object;
    this.ruleData.DisplayValue = '';
    this.ruleData.conditionDataInfo = [];
  }

  changeControl(type: any) {
    this.control = this.quickAccess = type === 'control' ? true : false;
  }

  selectStepNode(event: any) {
    this.currentNodeSelected = event.original.dgUniqueID;
    this.selectedElement = this.builderutills.getElementByDgUniqueID(this.currentNodeSelected, this.cbpService.cbpJson.section);
    this.tempsectionnumbers = [];
    if (this.cbpService.currentStep !== event.original.dgUniqueID) {
      this.cbpService.currentStep = event.original.dgUniqueID;
    }
    const activestepnumber = event.original.number;
    this.intializeDataKeys(event.original.dgUniqueID);
    this.rulesStepNo = event.original.text.replace('<i class="fa fa-exclamation iscritical"></i>', '');
    this.rulesStepNo = this.rulesStepNo.replace('<i class="fa fa-cog rule-css"></i>', '');
    this.rulesStepNo = 'Rules -' + this.rulesStepNo;
    this.updateRule();
  }

  intializeDataKeys(selectedElement: any) {
    this.dataFields = [];
    this.fieldsdata = [];
    const secObj = this.cbpService.cbpJson.section;
    this.getStepSectionNumbers(secObj);
    // for (let i = 0; i < secObj.length; i++) {
    //   this.parentData = this.cbpService.cbpJson.section[i].children;
    //   this.nestedChild(this.parentData, selectedElement);
    // }
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
  getStepSectionNumbers(object: any) {
    for (let i = 0; i < object.length; i++) {
      if (object[i].dgType === DgTypes.StepAction || object[i].dgType === DgTypes.Section) {
        this.tempsectionnumbers.push(object[i].dgSequenceNumber);
        this.tempMapNumberAndUniqueid.set(object[i].dgSequenceNumber, object[i].dgUniqueID);
      }
      if (object[i].children) {
        this.getStepSectionNumbers(object[i].children);
      }
    }
  }

  nestedChild(childrenData: any, selectedElement: number) {
    if (this.isReached)
      return;
    for (let i = 0; i < childrenData?.length; i++) {
      let data: any = childrenData[i];
      if (selectedElement == data.dgUniqueID || selectedElement == data.parentDgUniqueID) {
        if (data?.children)
          data?.children?.forEach((element: any) => {
            this.storeDataEntries(element);
          });
        this.isReached = true;
      } else {
        if (!this.controlService.isDataEntryAccept(data)) {
          if (selectedElement !== data.dgUniqueID) {
            this.storeDataEntries(data);
          }
        }
        if (data?.children) {
          this.nestedChild(data.children, selectedElement);
        }
        if (data.dgType === DgTypes.DualAction) {
          this.nestedChild(data?.rightDualChildren, selectedElement);
        }
      }
    }
  }

  storeDataEntries(data: any) {
    if (this.controlService.isDataEntry(data)) {
      this.dataFields.push({ fieldName: data.fieldName, DgType: data.dgType, object: data });
      this.tempMapUniqueID.set(data.fieldName, data.dgUniqueID);
      this.fieldsdata = this.dataFields.filter(function (v) { return v.fieldName !== '' && v.fieldName !== undefined && !v.object.isTableDataEntry; });
      if (this.fieldsdata.length > 0) {
        this.datField = this.fieldsdata[0].fieldName;
        this.ruleData.ParsedValue = this.fieldsdata[0];
        this.isDateTime = this.fieldsdata[0].object;
        this.antlrService.callBackObject.init(this.fieldsdata[0].fieldName, this.tempMapUniqueID.get(this.fieldsdata[0].fieldName));
      }
    }
  }


  hide() {
    this.cbpService.isRulesOpen = false;
    this.sharedService.closeModalPopup('Component-rule');
    this.closeEvent.emit(false);
  }
  getFunctionNames() {
    this.builderService.getFunctionGroupNames().subscribe((result: any) => {
      this.functionNames = result.data;
    },
      (error) => {
        console.log(error);
      });
  }
  getDisplayValue(value: any) {
    if (typeof value === 'boolean') { return Utills.isNumber(value) ? `${value}` : `"${value}"`; }
    value = value.trim();
    value = value === ' ' || value === '' ? '<<DG_EMPTY>>' : value;
    value = Utills.isNumber(value) ? `${value}` : `"${value}"`;
    return value;
  }
  changeRule() {
    this.ruleData.ruleTemp = this.ruleData.ruleInfo;
  }
  validations() {
    if (this.ruleData.ParsedValue.fieldName === '' || this.ruleData.ParsedValue.fieldName === undefined) {
      this.cbpService.showSwalDeactive(AlertMessages.selectField, 'warning', 'OK'); return false;
    }
    else if (this.ruleData.ComparisonOperator === '') {
      this.cbpService.showSwalDeactive(AlertMessages.selectOperator, 'warning', 'OK'); return false;
    }
    else if (this.ruleData.DisplayValue === '') {
      this.cbpService.showSwalDeactive(AlertMessages.selectValue, 'warning', 'OK'); return false;
    }
    else {
      return true;
    }
  }
  refreshRuleInfo() {
    if (this.cbpService.selectedElement.dgType == 'Form') {
      this.ruleData.ParsedValue = {};
      if (this.ruleData['columnName'] == undefined) {
        this.ruleData['columnName'] = `Column[${this.tableService.selectedRow[0].col + 1}]`;
        this.ruleData['columnParsedName'] = `Column${this.tableService.selectedRow[0].col + 1}`;
      }
      this.ruleData.ParsedValue['fieldName'] = this.ruleData['columnName'];
    }
    if (!this.validations() && this.cbpService.selectedElement.dgType !== 'Form') {
      return;
    }
    if (this.cbpService.selectedElement.dgType == 'Form') {
      if (!this.ruleData['attributeName'] && this.attributeList?.length > 0) {
        this.getAttrValue(this.attributeList[0].fieldName);
      }
      let rule = this.ruleData['columnName'] + '.' + this.ruleData['attributeName'] + ' ' + this.ruleData.ComparisonOperator + ' ' + this.getDisplayValue(this.ruleData.DisplayValue);
      if (this.isRuleEdit) {
        let dataEqn = this.ruleData.ruleInfo.split(') THEN');
        this.ruleData.ruleInfo = dataEqn[0] + '&' + rule + ' ) THEN ' + dataEqn[1];
      } else {
        this.ruleData.ruleInfo = this.ruleData.ruleTemp + rule;
      }
    } else {
      this.ruleData.ruleInfo = this.ruleData.ruleTemp + this.ruleData.ParsedValue.fieldName + ' ' + this.ruleData.ComparisonOperator + ' ' + this.getDisplayValue(this.ruleData.DisplayValue);
    }
    if (this.ruleData.conditionType === 'WHILE') {
      this.ruleData.ruleInfo = this.ruleData.ruleInfo;
    }
  }

  and() {
    if (this.cbpService.selectedElement.dgType == 'Form') {
      this.ruleData.ParsedValue = {};
      if (this.ruleData['columnName'] == undefined) {
        this.ruleData['columnName'] = `Column[${this.tableService.selectedRow[0].col + 1}]`;
        this.ruleData['columnParsedName'] = `Column${this.tableService.selectedRow[0].col + 1}`;
      }
      this.ruleData.ParsedValue['fieldName'] = this.ruleData['columnName'];
    }
    if (this.cbpService.selectedElement.dgType == 'Form') {
      this.ruleData.ruleInfo = this.ruleData.ruleTemp + this.ruleData['columnName'] + '.' + this.ruleData['attributeName'] + ' ' + this.ruleData.ComparisonOperator + ' ' + this.getDisplayValue(this.ruleData.DisplayValue) + ' AND &';
      this.ruleData.ruleTemp = this.ruleData.ruleInfo;
      this.clearAndOrInfo();
    } else {
      if (this.ruleData.ParsedValue.fieldName === '' || this.ruleData.ParsedValue.fieldName === undefined) { this.cbpService.showSwalDeactive(AlertMessages.selectField, 'warning', 'OK'); return false; } else if (this.ruleData.ComparisonOperator === '' || this.ruleData.ComparisonOperator === undefined) { this.cbpService.showSwalDeactive(AlertMessages.selectOperator, 'warning', 'OK'); return false; } else if (this.ruleData.DisplayValue === '' || this.ruleData.DisplayValue === undefined) { this.cbpService.showSwalDeactive(AlertMessages.selectValue, 'warning', 'OK'); return false; }
      this.ruleData.ruleInfo = this.ruleData.ruleTemp + this.ruleData.ParsedValue.fieldName + ' ' + this.ruleData.ComparisonOperator + ' ' + this.getDisplayValue(this.ruleData.DisplayValue) + ' AND &';
      this.ruleData.ruleTemp = this.ruleData.ruleTemp + this.ruleData.ParsedValue.fieldName + ' ' + this.ruleData.ComparisonOperator + ' ' + this.getDisplayValue(this.ruleData.DisplayValue) + ' AND &';
      this.ruleData.ComparisonOperator = '';
      this.ruleData.DisplayValue = '';
    }
  }
  or() {
    if (this.cbpService.selectedElement.dgType == 'Form') {
      this.ruleData.ParsedValue = {};
      if (this.ruleData['columnName'] == undefined) {
        this.ruleData['columnName'] = `Column[${this.tableService.selectedRow[0].col + 1}]`;
      }
      this.ruleData.ParsedValue['fieldName'] = this.ruleData['columnName'];
    }
    if (this.cbpService.selectedElement.dgType == 'Form') {
      this.ruleData.ruleInfo = this.ruleData.ruleTemp + this.ruleData['columnName'] + '.' + this.ruleData['attributeName'] + ' ' + this.ruleData.ComparisonOperator + ' ' + this.getDisplayValue(this.ruleData.DisplayValue) + ' OR &';
      this.ruleData.ruleTemp = this.ruleData.ruleInfo;
      this.clearAndOrInfo();
    } else {
      if (this.ruleData.ParsedValue.fieldName === '' || this.ruleData.ParsedValue.fieldName === undefined) { this.cbpService.showSwalDeactive(AlertMessages.selectField, 'warning', 'OK'); return false; } else if (this.ruleData.ComparisonOperator === '' || this.ruleData.ComparisonOperator === undefined) { this.cbpService.showSwalDeactive(AlertMessages.selectOperator, 'warning', 'OK'); return false; } else if (this.ruleData.DisplayValue === '' || this.ruleData.DisplayValue === undefined) { this.cbpService.showSwalDeactive(AlertMessages.selectValue, 'warning', 'OK'); return false; }
      this.ruleData.ruleInfo = this.ruleData.ruleTemp + this.ruleData.ParsedValue.fieldName + ' ' + this.ruleData.ComparisonOperator + ' ' + this.getDisplayValue(this.ruleData.DisplayValue) + ' OR &';
      this.ruleData.ruleTemp = this.ruleData.ruleTemp + this.ruleData.ParsedValue.fieldName + ' ' + this.ruleData.ComparisonOperator + ' ' + this.getDisplayValue(this.ruleData.DisplayValue) + ' OR &';
      this.ruleData.ComparisonOperator = '';
      this.ruleData.DisplayValue = '';
    }
  }

  clearAndOrInfo() {
    this.ruleData['columnValue'] = '';
    this.ruleData['attributeValue'] = '';;
    this.ruleData.DisplayValue = '';
    this.ruleData.ComparisonOperator = '';
  }
  // IF Changes Here
  addThenelse() {
    if (!this.isRuleEdit) {
      if (this.ruleData.conditionType === 'IF THEN ELSE') {
        if (this.ruleData.thenstep === '') { this.cbpService.showSwalDeactive(AlertMessages.selectSectionStep, 'warning', 'OK'); return false; } else if (this.ruleData.elsestep === '') { this.cbpService.showSwalDeactive(AlertMessages.selectSectionStep, 'warning', 'OK'); return false; }
        this.ruleData.ruleInfo = 'IF ( &' + this.ruleData.ruleInfo.trim() + ' ) THEN ' + this.ruleData.thenaction + ' ' + this.ruleData.thenstep + '\n' +
          ' ELSE ' + this.ruleData.elseaction + ' ' + this.ruleData.elsestep;
      } else if (this.ruleData.conditionType === 'IF THEN') {
        if (this.ruleData.thenstep === '') { this.cbpService.showSwalDeactive(AlertMessages.selectSectionStep, 'warning', 'OK'); return false; }
        this.ruleData.ruleInfo = 'IF ( &' + this.ruleData.ruleInfo.trim() + ' ) THEN ' + this.ruleData.thenaction + ' ' + this.ruleData.thenstep;
      }
    }
    else {
      this.checkGoToValues(this.ruleData.ruleInfo);
    }
  }
  addTableRule() {
    if (this.ruleData.conditionType === 'IF THEN') {
      if (this.ruleData.messageInfo == '' || !this.ruleData.messageInfo) {
        this.cbpService.showSwalDeactive('Please select Action before add the rule', 'warning', 'OK'); return false;
      }
      if (this.ruleData.ruleInfo == '' || this.ruleData.ruleInfo == undefined) {
        this.cbpService.showSwalDeactive('Please Add The Columns Related Data ', 'warning', 'OK'); return false;
      }
      if (this.ruleData['disableColumn'] == undefined && this.ruleData.messageInfo === 'DisableNextSteps') {
        this.cbpService.showSwalDeactive('Please select the column', 'warning', 'OK'); return false;
      }
      if ((this.ruleData['showMessage'] === '' || this.ruleData['showMessage'] == undefined) && this.ruleData.messageInfo === 'Message') {
        this.cbpService.showSwalDeactive('Please add value', 'warning', 'OK'); return false;
      }
      if (this.ruleData.ruleInfo.trim().endsWith('&')) {
        this.cbpService.showSwalDeactive('Rule is not valid, please check', 'warning', 'OK'); return false;
      }
      this.ruleData.thenstep = this.ruleData.messageInfo == 'DisableNextSteps' ? '' :
        (this.ruleData.messageInfo == 'Message' ? `"${this.ruleData['showMessage']}"` :
          this.ruleData['colNumber']);
      if (this.ruleData.thenstep === undefined) { this.ruleData.thenstep = ''; }
      if (this.ruleData.messageInfo === 'Disable' || this.ruleData.messageInfo === 'Enable') {
        if (this.ruleData['disableAttrValue'] !== "") {
          this.ruleData.thenstep = `Column[${this.ruleData['disableColumn'] + 1}].Attr[${this.ruleData['disableAttrValue'] + 1}]`;
          if (this.ruleData.thenstep.includes('NaN')) {
            this.ruleData.thenstep = `Column[${this.ruleData['disableColumn'] + 1}]`;
          }
        } else {
          this.ruleData.thenstep = `Column[${this.ruleData['disableColumn'] + 1}]`;
        }
      }
      if (this.ruleData.messageInfo == 'DisableNextSteps') {
        this.ruleData.thenstep = `Column[${this.ruleData['disableColumn'] + 1}]`;
      }
      if (this.ruleData.ruleInfo.indexOf('IF') > -1) {
        const regex = /Column\[\d+\]\.Attr\[\d+\] (<=|>=|==|!=|<|>|[+\-*/]|\d+) \d+/;
        const match = this.ruleData.ruleInfo.match(regex);
        this.ruleData.ruleInfo = match ? match[0] : null;
      }
      this.ruleData.ruleInfo = 'IF (&' + this.ruleData.ruleInfo.trim() + ') THEN ' + '{ ' + this.ruleData['messageInfo'] + '(' + this.ruleData.thenstep + ') }'
      this.ruleData.ruleParsedInfo = `${this.ruleData.columnParsedName}.${this.ruleData.attributeParsedName}`;
      this.antlrService.callBackObject.init(this.ruleData.ruleParsedInfo, this.ruleData.ruleParsedInfo);
    }
  }
  addUpdateTableRule() {
    if (this.ruleData.conditionType === 'IF THEN') {
      if (this.ruleData.messageInfo == '') {
        this.cbpService.showSwalDeactive('Please select Action before add the rule', 'warning', 'OK'); return false;
      }
      if (this.ruleData['showMessage'] === '' && this.ruleData.messageInfo === 'Message') {
        this.cbpService.showSwalDeactive('Please add value', 'warning', 'OK'); return false;
      }
      this.ruleData.thenstep = this.ruleData.messageInfo == 'DisableNextSteps' ? '' :
        (this.ruleData.messageInfo == 'Message' ? `"${this.ruleData['showMessage']}"` :
          this.ruleData['colNumber']);
      if (this.ruleData.thenstep === undefined) { this.ruleData.thenstep = ''; }
      if (this.ruleData.messageInfo === 'Disable' || this.ruleData.messageInfo === 'Enable') {
        if (this.ruleData['disableAttrValue'] !== "") {
          this.ruleData.thenstep = `Column[${this.ruleData['disableColumn'] + 1}].Attr[${this.ruleData['disableAttrValue'] + 1}]`;
        } else {
          this.ruleData.thenstep = `Column[${this.ruleData['disableColumn'] + 1}]`;
        }
      }
      if (this.ruleData.messageInfo == 'DisableNextSteps') {
        this.ruleData.thenstep = `Column[${this.ruleData['disableColumn'] + 1}]`;
      }
      this.getRuleFromDisplay();
    }
  }
  fieldDataDelete(i: any) {
    if (this.cbpService.selectedElement.dgType === 'Form') {
      let rules = this.selectedElement['tableRules'];
      this.tableRulesAuditJSON.push(JSON.parse(JSON.stringify(rules)));
      this.auditService.createEntry({}, this.selectedElement['tableRules'][i], Actions.Delete, AuditTypes.TABLE_RULE);
      this.selectedElement['tableRules'].splice(i, 1);
    } else {
      let rules = this.selectedElement.rule;
      this.rulesAuditJSON.push(JSON.parse(JSON.stringify(rules)));
      this.auditService.createEntry({}, this.selectedElement.rule[i], Actions.Delete, AuditTypes.CONDITIONAL_RULE);
      this.selectedElement.rule.splice(i, 1);
      if (this.selectedElement?.rule?.length == 0) {
        this.selectedElement = this.builderutills.setIconAndText(this.selectedElement);
      }
    }
    this.updateRule();
  }
  ruleEdit(item: any, i: number) {
    this.isRuleEdit = true;
    this.selectRuleObj = item;
    this.selectedIndex = i;
    this.ruleData.DisplayValue = item.value;
    this.ruleData.ruleInfo = item.DisplayValue;
    if (this.cbpService.selectedElement.dgType !== DgTypes.Form) {
      if (item.DisplayValue.includes('THEN')) {
        this.ruleData.conditionType = 'IF THEN';
      }
      if (item.DisplayValue.includes('ELSE')) {
        this.ruleData.conditionType = 'IF THEN ELSE';
      }
      if (item.DisplayValue.includes('GOTO')) {
        this.ruleData.conditionType = 'GOTO';
        const match = item.DisplayValue.match(/\(([^)]+)\)/);
        this.ruleData.elsestep = match != null ? match[1] : '';
      }
      this.ruleData.elseaction = 'Go To';
      this.ruleData.thenaction = 'Go To';
      let ruleSplit = this.ruleData.ruleInfo.split("THEN")
      let split = ruleSplit[1]?.split("Go To ");
      for (let i = 0; i < split?.length; i++) {
        if (split[i]?.trim() != '') {
          if (split[i]?.includes('\n')) {
            split[i] = split[i]?.replace('\n', '');
            split[i] = split[i]?.replace('ELSE', '').trim();
            this.ruleData.thenstep = split[i];
            this.ruleData.thendguniqueid = this.tempMapNumberAndUniqueid.get(split[i]);
          }
          if (!split[i]?.includes('\n')) {
            split[i] = split[i]?.trim();
            this.ruleData.elsestep = split[i];
            this.ruleData.elsedguniqueid = this.tempMapNumberAndUniqueid.get(split[i]);
          }
        }
      }
    } else {
      this.ruleData.ruleTemp = this.ruleData.ruleInfo;
      this.ruleData.messageInfo = item.messageInfo;
      if (this.ruleData.messageInfo === 'Message') {
        this.ruleData['showMessage'] = item['showMessage']
      }
      this.ruleData['columnValue'] = item.columnValue;
      this.ruleData['attributeValue'] = item.attributeValue;
      this.ruleData.messageInfo = item.messageInfo;
      this.ruleData.ComparisonOperator = item.operator;
      if (this.ruleData.messageInfo === 'Message' || this.ruleData.messageInfo === 'DisableNextSteps') {
        this.ruleData['attrIndex'] = item['attrIndex'];
        this.ruleData['rowNo'] = item.rowNo;
        this.ruleData['colIndex'] = item['colIndex'];
        if (this.ruleData.messageInfo === 'DisableNextSteps') {
          // this.ruleData['disableColumn'] = item['disableColumn'];
          let splitText = this.ruleData.ruleInfo.split('THEN');
          let matches = splitText[1].match(/\[(.*?)\]/);
          this.ruleData['disableColumn'] = matches[1] ? Number(matches[1]) - 1 : 0;
        }
      }
      if (this.ruleData.messageInfo === 'Disable' || this.ruleData.messageInfo === 'Enable') {
        let splitText = this.ruleData.ruleInfo.split('THEN');
        let info = this.getColField(splitText[1], this.ruleData.messageInfo);
        this.ruleData['disableColumn'] = Number(info.col) - 1;;
        this.ruleData['disableAttrValue'] = info.fi ? Number(info.fi) - 1 : undefined;
      }
    }
    this.footerList = [{ type: 'Reset' }, { type: 'Undo' }, { type: 'Close' }, { type: 'Update' }]
  }
  fielddataUp(i: any) {
    this.saveRulesForUndo()
    this.ruleData.conditionDataInfo.forEach((e: any, n: any) => {
      if (n === i && i !== 0) {
        const temp = this.ruleData.conditionDataInfo[i - 1];
        this.ruleData.conditionDataInfo[i - 1] = this.ruleData.conditionDataInfo[i];
        this.ruleData.conditionDataInfo[i] = temp;
      }
    });
    this.reverseUpdateInRule();
  }

  fielddataDown(i: any) {
    this.saveRulesForUndo()
    this.ruleData.conditionDataInfo.forEach((e: any, n: any) => {
      if (n === i && this.ruleData.conditionDataInfo.length - 1 !== i) {
        const temp = this.ruleData.conditionDataInfo[i + 1];
        this.ruleData.conditionDataInfo[i + 1] = this.ruleData.conditionDataInfo[i];
        this.ruleData.conditionDataInfo[i] = temp;
      }
    });
    this.reverseUpdateInRule();
  }
  saveRulesForUndo() {
    let rules: any;
    if (this.cbpService.selectedElement.dgType === 'Form') {
      rules = this.selectedElement['tableRules'];
      this.tableRulesAuditJSON.push(JSON.parse(JSON.stringify(rules)))
    } else {
      rules = this.selectedElement.rule;
      this.rulesAuditJSON.push(JSON.parse(JSON.stringify(rules)))
    }
  }
  reverseUpdateInRule() {
    let type = this.cbpService.selectedElement.dgType === 'Form' ? 'tableRules' : 'rule';
    this.selectedElement[type] = this.ruleData.conditionDataInfo;
    this.selectedElement = this.viewUpdateTrack(this.selectedElement);
  }
  ngAfterViewInit() {
    this.currentNodeSelected = this.selectedElement.dgUniqueID;
  }
  convertToParse(item: any) {
    return this.ruleData.conditionType === 'IF THEN ELSE' || this.ruleData.conditionType === 'IF THEN' ? item.replace("IF", "if") : item;
  }

  convertParseRule(text: any) {
    text = this.removeBracket(text);
    if (text?.includes('THEN') && text?.includes('UserQual')) {
      text = text.slice(this.getPosition(text, '(', 1) + 2, this.getPosition(text, ') THEN', 1))
    }
    return `if ( &${text.trim()} ) { return true; } else { return false; }`;
  }
  removeBracket(item: string) {
    return item.replace(/[\[\]']+/g, '')
  }

  fieldExpresion(name: FieldOptions) {
    this.datField = name.fieldName;
    this.operatorOptions = [];
    this.isDateTime = name.object;
    if (this.ruleData?.ParsedValue?.DgType === DgTypes.CheckboxDataEntry) {
      this.ruleData.DisplayValue = false;
    } else {
      this.ruleData.DisplayValue = '';
    }
    this.ruleData.ComparisonOperator = '';
    this.comparisonOperators = [];
    // this.operatorOptions.push({name: 'Select Operator', value: 'Select Operator'});
    if (name.DgType === DgTypes.BooleanDataEntry) {
      this.operatorOptions.push({ name: '==', value: '==' });
      this.comparisonOperators.push("==",);
    } else if (name.DgType === DgTypes.TextDataEntry || name.DgType === DgTypes.TextAreaDataEntry ||
      name.DgType === DgTypes.CheckboxDataEntry || name.DgType === DgTypes.DropDataEntry) {
      this.operatorOptions.push({ name: '==', value: '==' });
      this.operatorOptions.push({ name: '!=', value: '!=' });
      this.comparisonOperators.push("==", "!=");
    } else if (name.DgType === DgTypes.DateDataEntry || name.DgType === DgTypes.NumericDataEntry) {
      this.setOperations();
    }
    this.antlrService.callBackObject.init(name.fieldName, this.tempMapUniqueID.get(name.fieldName));
  }
  setOperations() {
    this.operatorOptions.push({ name: '==', value: '==' });
    this.operatorOptions.push({ name: '!=', value: '!=' });
    this.operatorOptions.push({ name: '>=', value: '>=' });
    this.operatorOptions.push({ name: '<=', value: '<=' });
    this.operatorOptions.push({ name: '>', value: '>' });
    this.operatorOptions.push({ name: '<', value: '<' });
    this.comparisonOperators.push("==", ">=", "<=", "<", ">", "!=");
  }
  addRulesData() {
    let equation = this.getEquationRule();
    const json = {
      DisplayValue: this.ruleData.ruleInfo,
      FieldName: this.ruleData.ParsedValue.fieldName,
      dgUniqueID: this.tempMapUniqueID.get(this.ruleData.ParsedValue.fieldName),
      parser: this.ruleData.ParsedValue.fieldName,
      operator: this.ruleData.ComparisonOperator,
      value: this.ruleData.DisplayValue,
      elsestep: this.ruleData.elsestep,
      thenstep: this.ruleData.thenstep,
      elsedguniqueid: this.tempMapNumberAndUniqueid.get(this.ruleData.elsestep),
      thendguniqueid: this.tempMapNumberAndUniqueid.get(this.ruleData.thenstep),
      Equation: equation
    };
    let duplicateRule = this.ruleData.conditionDataInfo.filter((item: any) =>
      item.DisplayValue === json.DisplayValue && item.fname === json.FieldName);
    if (duplicateRule.length === 0) {
      this.ruleData.conditionDataInfo.push(json);
    } else {
      this.cbpService.showSwalDeactive('Unable to add duplicate Rule', 'warning', 'OK');
    }
  }
  getEquationRule() {
    let equation = '';
    if (this.ruleData.ruleInfo !== '') {
      if (this.ruleData.conditionType === 'IF THEN ELSE') {
        const dataEqn = this.ruleData.ruleInfo.split('THEN');
        equation = dataEqn[0] + '{ goto {' + this.ruleData.thenstep + '};}' + ' else { goto {' + this.ruleData.elsestep + '};}';
      } else if (this.ruleData.conditionType === 'IF THEN') {
        const dataEqn = this.ruleData.ruleInfo.split('THEN');
        equation = dataEqn[0] + `{ goto {` + this.ruleData.thenstep + `};}`;
      } else if (this.ruleData.conditionType === 'WHILE') {
        if (this.ruleData.action === 'Continue()') {
          this.ruleData.ruleInfo = 'while (&' + this.ruleData.ruleInfo + ') { ' + this.ruleData.action.toLowerCase() + ' }';
          equation = this.ruleData.ruleInfo;
        } else if (this.ruleData.action === 'ConfirmContinue()') {
          this.ruleData.ruleInfo = 'while (&' + this.ruleData.ruleInfo + ') { confirmcontinue (' + `"${this.ruleData.messageCode}"` + ',' + `"${this.ruleData.message}"` + ' ) }';
          equation = this.ruleData.ruleInfo;
        }
      }
    }
    if (this.ruleData.conditionType === 'REPEAT') {
      if (this.ruleData.DisplayValue === '') {
        this.cbpService.showSwalDeactive(AlertMessages.timeNotify, 'warning', 'OK'); return false;
      } else {
        this.ruleData.ruleInfo = 'REPEAT (' + this.getDisplayValue(this.ruleData.DisplayValue) + ')';
        equation = this.getDisplayValue(this.ruleData.DisplayValue);
      }
    } else if (this.ruleData.conditionType === 'TIMED') {
      if (this.ruleData.DisplayValue === '') {
        this.cbpService.showSwalDeactive(AlertMessages.minutesNotify, 'warning', 'OK'); return false;
      } else {
        this.ruleData.ruleInfo = 'TIMED (' + this.getDisplayValue(this.ruleData.DisplayValue) + ')';
        equation = this.getDisplayValue(this.ruleData.DisplayValue);
      }
    } else if (this.ruleData.conditionType === 'GOTO') {
      if (this.ruleData.elsestep === '') {
        this.cbpService.showSwalDeactive(AlertMessages.selectSectionStep, 'warning', 'OK'); return false;
      } else {
        this.ruleData.ruleInfo = 'GOTO (' + this.ruleData.elsestep + ')';
        equation = this.tempMapNumberAndUniqueid.get(this.ruleData.elsestep);
      }
    } else if (this.ruleData.conditionType === 'END') {
      this.ruleData.ruleInfo = 'END ()';
      equation = 'End';
    }
    equation = equation.toString();
    if (equation?.includes('IF')) equation = equation.replace('IF', 'if');
    return equation;
  }
  saveRules() {
    let duplicate = false;
    if (this.selectedElement.dgType == 'Form') {
      this.tableRulesAuditJSON.push(JSON.parse(JSON.stringify(this.selectedElement['tableRules'] ? this.selectedElement['tableRules'] : [])))
      if (this.ruleData.messageInfo !== '' && this.ruleData.messageInfo !== undefined && this.checkColumnPresent(this.ruleData.ruleInfo, this.columnList) && this.ruleData.ruleInfo.indexOf("IF") > -1) {
        this.setRuleUpdate();
      } else {
        if (this.ruleData.thenstep === '' && !this.isRuleCorrect(this.ruleData.ruleInfo)) {
          this.cbpService.showSwalDeactive('Rule is not valid, Please check before adding it', 'warning', 'OK');
          return false;
        } else {
          if (this.checkColumnPresent(this.ruleData.ruleInfo, this.columnList)) {
            this.ruleData.messageInfo = this.setMessageInfo(this.ruleData.ruleInfo);
            this.ruleData.parsedAntlrRule = this.getRuleFromDisplay();
          } else {
            this.cbpService.showSwalDeactive('Rule is not valid, Please check before adding it', 'warning', 'OK');
            return false;
          }
        }
      }
      const json: any = {
        DisplayValue: this.ruleData.ruleInfo,
        FieldName: this.ruleData.ruleParsedInfo,
        parsedValue: this.ruleData.parsedAntlrRule,
        operator: this.ruleData.ComparisonOperator,
        value: this.ruleData.DisplayValue,
        thenstep: this.ruleData.thenstep,
        messageInfo: this.ruleData.messageInfo,
        columnValue: this.ruleData['columnValue'],
        attributeValue: this.ruleData['attributeValue'],
        dgUniqueID: this.isRuleEdit ? this.ruleData.dgUniqueID : new Date().getTime()
      };
      if (this.ruleData.messageInfo === 'Message') {
        json['showMessage'] = this.ruleData['showMessage'];
      }
      json['attrIndex'] = this.ruleData['attrIndex'];
      json['rowNo'] = this.tableService.selectedRow[0].row;
      json['colIndex'] = this.ruleData['colIndex'];
      if (this.ruleData.messageInfo === 'Disable' || this.ruleData.messageInfo === 'Enable') {
        if (this.ruleData['disableAttrValue']) {
          json['disableAttrValue'] = this.ruleData['disableAttrValue'] ? this.ruleData['disableAttrValue'] : undefined;
        }
        json['disableColumn'] = this.ruleData['disableColumn'];
      }
      if (!json.DisplayValue.includes('THEN') || this.hasRepeats('THEN')) {
        this.cbpService.showSwalDeactive('Rule is not valid, Please check before add it', 'warning', 'OK');
        return false;
      }
      if (this.ruleData.ruleInfo !== '') {
        let duplicateRule = this.ruleData.conditionDataInfo.filter((item: any) =>
          item.DisplayValue === json.DisplayValue && item.fname === json.FieldName);
        if (duplicateRule.length === 0) {
          this.ruleData.conditionDataInfo.push(json);
          this.selectedElement['tableRules'] = this.ruleData.conditionDataInfo;
          this.clearRule();
        } else {
          this.cbpService.showSwalDeactive('Unable to add duplicate Rule', 'warning', 'OK');
        }
      } else {
        this.cbpService.showSwalDeactive('Unable to add Rule with empty values', 'warning', 'OK');
      }
    } else {
      this.rulesAuditJSON.push(JSON.parse(JSON.stringify(this.selectedElement.rule)))
      if (!(this.ruleData.conditionType === 'REPEAT' || this.ruleData.conditionType === 'TIMED' || this.ruleData.conditionType === 'GOTO' || this.ruleData.conditionType === 'END')) {
        if (this.ruleData.ParsedValue.fieldName === '' || this.ruleData.ParsedValue.fieldName === undefined) {
          this.cbpService.showSwalDeactive(AlertMessages.selectField, 'warning', 'OK'); return false;
        } else if (this.ruleData.ComparisonOperator === '' || this.ruleData.ComparisonOperator === 'Select Operator') {
          this.cbpService.showSwalDeactive(AlertMessages.selectOperator, 'warning', 'OK'); return false;
        } else if (this.ruleData.DisplayValue === '') { this.cbpService.showSwalDeactive(AlertMessages.selectValue, 'warning', 'OK'); return false; }
        // else if (this.ruleData.ruleInfo ===  "") {this.cbpService.showSwalDeactive('Please Write A valid Rule !', 'warning', 'OK'); return false; }
        if (this.ruleData.ParsedValue.fieldName !== '' && this.ruleData.ComparisonOperator !== '' && this.ruleData.DisplayValue !== '') {
          this.ruleData.ruleInfo = this.ruleData.ruleTemp + this.ruleData.ParsedValue.fieldName + ' ' + this.ruleData.ComparisonOperator + ' ' + this.getDisplayValue(this.ruleData.DisplayValue);
        }
      }
      if (this.ruleData.conditionType === 'IF THEN ELSE') {
        if (this.ruleData.thenstep === '') { this.cbpService.showSwalDeactive(AlertMessages.selectSectionStep, 'warning', 'OK'); return false; } else if (this.ruleData.elsestep === '') { this.cbpService.showSwalDeactive(AlertMessages.selectSectionStep, 'warning', 'OK'); return false; }
        if (this.ruleData.thenstep !== '' && this.ruleData.elsestep !== '') {
          this.ruleData.ruleInfo = 'IF (&' + this.ruleData.ruleInfo.trim() + ') THEN ' + this.ruleData.thenaction + ' ' + this.ruleData.thenstep + '\n' +
            ' ELSE ' + this.ruleData.elseaction + ' ' + this.ruleData.elsestep;
        }
      } else if (this.ruleData.conditionType === 'IF THEN') {
        if (this.ruleData.thenstep === '') { this.cbpService.showSwalDeactive(AlertMessages.selectSectionStep, 'warning', 'OK'); return false; }
        if (this.ruleData.thenstep !== '') {
          this.ruleData.ruleInfo = 'IF (&' + this.ruleData.ruleInfo.trim() + ') THEN ' + this.ruleData.thenaction + ' ' + this.ruleData.thenstep;
        }
      }
      this.addRulesData();
      this.selectedElement.rule = [];
      this.ruleData.conditionDataInfo.forEach((result: any) => {
        let jsonData: any;
        if (result.FieldName) {
          jsonData = {
            DisplayValue: result.DisplayValue,
            ParsedValue: this.convertToParse(result.Equation),
            DgUniqueID: this.builderutills.getUniqueIdIndex(),
            fname: result.FieldName
          };
          this.antlrService.callBackObject.initStepWithDgUniqueIdRule(result.elsestep, result.elsedguniqueid);
          this.antlrService.callBackObject.initStepWithDgUniqueIdRule(result.thenstep, result.thendguniqueid);
          jsonData.ParsedValue = this.antlrService.createExpression(jsonData.ParsedValue, result.FieldName, result.dgUniqueID);
        } else if (!result.FieldName && result.ParsedValue) {
          jsonData = {
            DisplayValue: result.DisplayValue,
            ParsedValue: result.ParsedValue,
            DgUniqueID: new Date().getTime(),
            fname: result.fname
          };
        } else if (!result.FieldName && !result.ParsedValue) {
          jsonData = {
            DisplayValue: result.DisplayValue,
            ParsedValue: result.Equation,
            DgUniqueID: new Date().getTime(),
            fname: result.fname
          };
        }
        let duplicateRule = this.selectedElement.rule.filter((item: any) =>
          item.DisplayValue === jsonData.DisplayValue && item.fname === jsonData.fname);
        if (duplicateRule.length === 0) {
          this.selectedElement.rule.push(jsonData);
          this.auditService.createEntry({}, jsonData, Actions.Insert, AuditTypes.CONDITIONAL_RULE);
          this.updateRule();
          this.clearRule();
        } else { duplicate = true; }
      });
      if (!duplicate) {
        this.selectedElement = this.builderutills.setIconAndText(this.selectedElement);
        this.updateConditional.emit(this.selectedElement);
      }
    }
    this.selectedElement = this.viewUpdateTrack(this.selectedElement);
  }
  viewUpdateTrack(selectedElement: any) {
    selectedElement = this.cbpService.setUserUpdateInfo(selectedElement);
    this.controlService.hideTrackUi({ 'trackUiChange': true });
    return selectedElement;
  }
  setMessageInfo(text: string) {
    if (text.includes('DisableNextSteps()') || text.includes('DisableNextSteps(')) return 'DisableNextSteps';
    if (text.includes('Disable')) return 'Disable';
    if (text.includes('Enable')) return 'Enable';
    if (text.includes('Message')) return 'Message';
  }
  setRuleUpdate() {
    let setRule = this.convertParseRule(this.ruleData.ruleTemp);
    if (setRule.includes('UserQual')) {
      if (setRule?.includes('(&(&')) { setRule = setRule.replace('(&(&', '(&') };
      this.antlrService.callBackObject.init('UserQual', 'UserQual');
    }
    this.ruleData.parsedAntlrRule = this.getRuleFromDisplay();
  }
  findDuplicates = (arr: any) => arr.filter((item: any) => item.includes('&Column'))
  getSelectedCols(text: string) {
    return this.findDuplicates(text.split(" "))?.length;
  }
  isRuleCorrect(text: string) {
    if (text.includes('DisableNextSteps()') || text.includes('Enable(')
      || text.includes('Disable(') || text.includes('Message(') || text.includes('DisableNextSteps(')) {
      return true;
    }
    return false;
  }
  clearRule() {
    this.ruleData.ruleInfo = '';
    this.ruleData.ruleTemp = '';
    this.ruleData.ComparisonOperator = '';
    this.ruleData.DisplayValue = '';
    this.ruleData.thenstep = '';
    this.ruleData.elsestep = '';
    this.ruleData.thenaction = '';
    this.ruleData.elseaction = '';
    this.ruleData.showMessage = ''
    this.ruleData['columnValue'] = '';
    this.ruleData['attributeValue'] = '';
    this.ruleData['showMessage'] = '';
    this.ruleData['disableAttrValue'] = undefined;
    this.ruleData['disableColumn'] = undefined;
    this.ruleData['messageInfo'] = '';
    this.isRuleEdit = false;
  }
  hasRepeats(str: string) {
    return /(.).*\1/.test(str);
  }
  updateRule() {
    this.ruleData.conditionDataInfo = [];
    if (this.selectedElement.rule !== undefined) {
      this.selectedElement.rule.forEach((element: any) => {
        this.fieldsdata.forEach((name: any) => {
          if (name.fieldName == element.fname) {
            this.ruleData.conditionDataInfo.push(element);
          }
        });
      });

      if (this.ruleData.conditionDataInfo.length !== this.selectedElement.rule.length) {
        this.selectedElement.rule.forEach((element: any) => {
          element = this.updatRuleWithFieldNameDgUniqueID(element);
          let ruleInfo = this.ruleData.conditionDataInfo.filter((i: any) => i.fname == element.fname);
          if (ruleInfo.length == 0)
            this.ruleData.conditionDataInfo.push(element);
        });
      }

    } else {
      let field = this.cbpService.selectedElement;
      this.ruleData.conditionDataInfo = field.dgType === 'Form' && field['tableRules']?.length > 0 ? this.selectedElement['tableRules'] : [];
    }
    // this.selectedElement = this.viewUpdateTrack(this.selectedElement);
  }
  updatRuleWithFieldNameDgUniqueID(object: any) {
    let dgUniqueID = this.getRuleDgUniqueIDList(object.ParsedValue);
    for (let i = 0; i < dgUniqueID?.length; i++) {
      let field: any = this.fieldsdata.filter((item: any) => item.object.dgUniqueID == dgUniqueID[i]);
      if (field) {
        if (object['fname'] !== field[field.length - 1]?.fieldName) {
          object.DisplayValue = object.DisplayValue.replace(object['fname'], field[field.length - 1]?.fieldName);
          object.fname = field[field.length - 1]?.fieldName;
        }
      }
    }
    return object;
  }

  getRuleDgUniqueIDList(text: any) {
    let dgUniqueID: any[] = [];
    let splitText = text.split('(');
    splitText = splitText.filter((item: any) => item.includes('&'));
    for (let i = 0; i < splitText.length; i++) {
      if (splitText[i].includes('&')) {
        let value = splitText[i].substring(this.getPosition(splitText[i], '&', 1) + 1, this.getPosition(splitText[i], ' ', 1), 1);
        if (/^\d+$/.test(value)) {
          dgUniqueID.push(Number(value.trim()));
        } else {
          dgUniqueID.push(value.trim());
        }
      }
    }
    return dgUniqueID;
  }

  resetRules() {
    if (this.ruleData.conditionType === 'IF THEN ELSE') {
      this.resetRuleInfo();
      this.ruleData.elseaction = '';
      this.ruleData.elsestep = '';
    }
    if (this.ruleData.conditionType === 'IF THEN') {
      this.resetRuleInfo();
    }
    if (this.ruleData.conditionType === 'GOTO') {
      this.ruleData.elsestep = '';
    }
    if (this.isRuleEdit) {
      this.isRuleEdit = false;
    }
    this.ruleData['showMessage'] = '';
  }
  resetRuleInfo() {
    this.ruleData.ParsedValue = '';
    this.ruleData.ComparisonOperator = '';
    this.ruleData.DisplayValue = '';
    this.ruleData.thenaction = '';
    this.ruleData.thenstep = '';
    this.ruleData.ruleInfo = '';
    this.ruleData.ruleTem = '';
    this.ruleData['columnValue'] = '';
    this.ruleData['attributeValue'] = '';
    this.ruleData['showMessage'] = '';
    this.ruleData['colIndex'] = [];
    this.ruleData['attrIndex'] = [];
    this.ruleData['messageInfo'] = '';
    this.ruleData['disableColumn'] = '';
  }
  undoRules() {
    if (this.cbpService.selectedElement.dgType === 'Form') {
      if (this.tableRulesAuditJSON.length > 0)
        this.selectedElement['tableRules'] = JSON.parse(JSON.stringify(this.tableRulesAuditJSON.pop()));
    } else {
      if (this.rulesAuditJSON.length > 0) {
        this.selectedElement.rule = JSON.parse(JSON.stringify(this.rulesAuditJSON.pop()));
      }
    }
    this.updateRule();
    if (this.isRuleEdit) {
      this.isRuleEdit = false;
      this.selectedIndex = undefined;
      this.clearRule();
    }
  }
  changeColumn(event: any) {
    if (this.ruleData['ruleInfo'] === '' || this.ruleData['ruleInfo'].endsWith('AND &') || this.ruleData['ruleInfo'].endsWith('OR &')) {
      let index = this.columnList.findIndex(item => item.fieldName === event);
      this.tableService.selectedRow[0].col = index;
      if (!this.ruleData['colIndex']) { this.ruleData['colIndex'] = []; }
      this.ruleData['attributeName'] = '';
      this.ruleData['attributeParsedName'] = '';
      this.ruleData['colIndex'].push(index);
      this.ruleData['colIndex'] = this.ruleData['colIndex'].filter((e: any, i: any, a: any) => a.indexOf(e) === i)
      this.ruleData['columnName'] = `Column[${this.tableService.selectedRow[0].col + 1}]`;
      this.ruleData['columnParsedName'] = `Column${this.tableService.selectedRow[0].col + 1}`;
      const tablerows = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row;
      let newTableRow = JSON.parse(JSON.stringify(tablerows));
      if (this.cbpService.selectedElement?.rowsCount !== 0) {
        newTableRow = newTableRow.slice(this.cbpService.selectedElement?.rowsCount);
      }
      this.cbpService.colSelectedEntry = tablerows;
      this.attributeList = newTableRow[this.tableService.selectedRow[0].row].entry[this.tableService.selectedRow[0].col].children
      this.ruleData['attributeValue'] = '';
      this.getAttrValue(this.attributeList[0].fieldName);
      this.ruleData.ComparisonOperator = '';
      this.ruleData.DisplayValue = '';
      this.cdr.detectChanges();
    } else {
      this.cbpService.showSwalDeactive('Add AND, OR condition before change the column', 'warning', 'OK');
    }
  }
  getAttrValue(event: any) {
    let ind = this.attributeList.findIndex(i => i.fieldName === event);
    if (!this.ruleData['attrIndex']) { this.ruleData['attrIndex'] = []; }
    this.ruleData['attrIndex'].push(ind);
    this.ruleData['attrIndex'] = this.ruleData['attrIndex'].filter((e: any, i: any, a: any) => a.indexOf(e) === i)
    this.ruleData['attributeName'] = `Attr[${ind + 1}]`;
    this.ruleData['attributeParsedName'] = `Attr${ind + 1}`;
  }
  getDisableAttrList() {
    let tablerows = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[this.tableService.selectedRow[0].row].entry[this.ruleData['disableColumn']];
    if (tablerows == undefined) {
      tablerows = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[this.tableService.selectedRow[0].row].entry[this.ruleData['disableColumn'] - 1];
    }
    tablerows.children = tablerows.children.filter((item: any) => item.dgType);
    this.attributeDisableList = tablerows.children;
    this.ruleData['disableAttrValue'] = '';
  }
  checkDataEntry(dataEntry: any) {
    let returnedEntry: any;
    let splitted = dataEntry.substring(dataEntry.indexOf("&")).split("&");
    let setFieldsData: any = [];
    this.fieldsdata.forEach((item: any) => setFieldsData.push(item.fieldName));
    for (let i = 1; i < splitted.length; i++) {
      const newDataEntry = splitted[i].substring(0, splitted[i].indexOf(" "))
      if (newDataEntry === this.ruleData.ParsedValue.fieldName || setFieldsData.includes(newDataEntry)) { returnedEntry = true; }
      else { returnedEntry = false; break; }
    }
    return returnedEntry ? (returnedEntry = this.checkComparisonOperators(dataEntry) ? this.checkAndOroperators(dataEntry) : false) : returnedEntry;
  }
  checkComparisonOperators(sentence: string) {
    const operators = sentence.match(/(?:===|!=|>>|<<|<=<|<=>|=>>|<==|>=>|==>|!=>|!>|!|!!|==|<=|>=|<|>)/g) || [];
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
  checkGoToValues(sentence: any) {
    const pattern = /THEN\s+Go\s+To\s+(.*?)\s+ELSE\s+Go\s+To\s+(.*)$/;
    let match: any = pattern.exec(sentence);
    let values: any = [];
    if (match == null) {
      const pattern = /THEN Go To ([\d\.]+)/;
      match = pattern.exec(sentence);
      values.push(match[1]);
      if (!values.includes(this.ruleData.thenstep)) {
        this.ruleData.ruleInfo = this.updateSectionStepValues(sentence, values[0], this.ruleData.thenstep)
      }
    } else {
      for (let i = 1; i < match.length; i++) {
        values.push(match[i]);
      }
      if (!values.includes(this.ruleData.elsestep)) { this.ruleData.ruleInfo = this.updateSectionStepValues(sentence, values[1], this.ruleData.elsestep); sentence = this.ruleData.ruleInfo; }
      if (!values.includes(this.ruleData.thenstep)) { this.ruleData.ruleInfo = this.updateSectionStepValues(sentence, values[0], this.ruleData.thenstep) }
    }
    return (values.every((element: any) => this.tempsectionnumbers.includes(element))) ? true : false;
  }
  updateSectionStepValues(sentence: any, oldValue: any, newValue: any) {
    const regex = new RegExp(`Go To ${oldValue}`);
    const updatedSentence = sentence.replace(regex, `Go To ${newValue}`);
    return updatedSentence;
  }
  updateRules() {
    if (this.cbpService.selectedElement.dgType !== DgTypes.Form) {
      if (this.ruleData.ruleInfo.indexOf("IF") > -1) {
        if (this.checkDataEntry(this.ruleData.ruleInfo) && this.checkGoToValues(this.ruleData.ruleInfo)) {
          this.ruleData.conditionDataInfo[this.selectedIndex].DisplayValue = this.ruleData.ruleInfo;
          let ruleSplit = this.ruleData.ruleInfo.split("THEN")
          let split = ruleSplit[1]?.split("Go To ");
          for (let i = 0; i < split?.length; i++) {
            if (split[i]?.trim() != '') {
              if (split[i]?.includes('\n')) {
                split[i] = split[i]?.replace('\n', '');
                split[i] = split[i]?.replace('ELSE', '')?.trim();
                this.ruleData.thenstep = split[i];
                this.ruleData.thendguniqueid = this.tempMapNumberAndUniqueid.get(split[i]);
              }
              if (!split[i]?.includes('\n')) {
                split[i] = split[i]?.trim();
                this.ruleData.elsestep = split[i];
                this.ruleData.elsedguniqueid = this.tempMapNumberAndUniqueid.get(split[i]);
              }
            }
          }
          this.storeFieldsinCallBack(ruleSplit[0]);
          let equation = this.getEquationRule();
          this.antlrService.callBackObject.initStepWithDgUniqueIdRule(this.ruleData.elsestep, this.ruleData.elsedguniqueid);
          this.antlrService.callBackObject.initStepWithDgUniqueIdRule(this.ruleData.thenstep, this.ruleData.thendguniqueid);
          this.ruleData.conditionDataInfo[this.selectedIndex]['ParsedValue'] =
            this.antlrService.createExpression(equation, null, null);
          console.log(this.ruleData.conditionDataInfo);
          this.ruleData = JSON.parse(JSON.stringify(this.ruleData));
          this.isRuleEdit = false;
          this.selectRuleObj = undefined;
          this.selectedIndex = undefined;
          this.footerList = [{ type: 'Reset' }, { type: 'Undo' }, { type: 'Close' }, { type: 'Save' }];
          this.clearRule();
        } else {
          this.cbpService.showSwalDeactive(AlertMessages.alarmAlert, 'warning', 'OK');
          return false;
        }
      } else {
        let result = JSON.parse(JSON.stringify(this.ruleData.conditionDataInfo[this.selectedIndex]));
        const match = result.DisplayValue.match(/\(([^)]+)\)/);
        if (match != null && match[1] !== this.ruleData.elsestep) {
          result.DisplayValue = result.DisplayValue.replace(/\(([^)]+)\)/, `(${this.ruleData.elsestep})`);
        } else {
          this.cbpService.showSwalDeactive('Without Changes Updated', 'warning', 'OK');
        }
        let duplicateRule = this.ruleData.conditionDataInfo.filter((item: any) =>
          item.DisplayValue === result.DisplayValue && item.fname === result.fname);
        if (duplicateRule.length === 0) {
          this.selectedElement.rule[this.selectedIndex] = JSON.parse(JSON.stringify(result));
          this.ruleData.conditionDataInfo[this.selectedIndex] = JSON.parse(JSON.stringify(result));
          this.ruleData = JSON.parse(JSON.stringify(this.ruleData));
          this.isRuleEdit = false;
          this.selectRuleObj = undefined;
          this.selectedIndex = undefined;
          this.footerList = [{ type: 'Reset' }, { type: 'Undo' }, { type: 'Close' }, { type: 'Save' }];
          this.clearRule();
        } else {
          this.cbpService.showSwalDeactive('Unable to add duplicate Rule', 'warning', 'OK');
        }

      }

    } else {
      this.ruleData.conditionDataInfo[this.selectedIndex]['DisplayValue'] = this.checkValidRule(this.ruleData.ruleInfo);
      this.ruleData.conditionDataInfo[this.selectedIndex]['messageInfo'] = this.ruleData.messageInfo;
      this.ruleData.conditionDataInfo[this.selectedIndex].parsedAntlrRule = this.getRuleFromDisplay();
      this.ruleData.conditionDataInfo[this.selectedIndex].parsedValue = this.getRuleFromDisplay();
      if (this.ruleData.messageInfo === 'Message') {
        this.ruleData.conditionDataInfo[this.selectedIndex]['showMessage'] = this.ruleData['showMessage'];
      }
      if (this.ruleData.messageInfo === 'Message' || this.ruleData.messageInfo === 'DisableNextSteps') {
        this.ruleData.conditionDataInfo[this.selectedIndex]['attrIndex'] = this.ruleData['attrIndex'];
        this.ruleData.conditionDataInfo[this.selectedIndex]['rowNo'] = this.tableService.selectedRow[0].row;
        this.ruleData.conditionDataInfo[this.selectedIndex]['colIndex'] = this.ruleData['colIndex'];
        if (this.ruleData.messageInfo === 'DisableNextSteps')
          this.ruleData.conditionDataInfo[this.selectedIndex]['disableColumn'] = this.ruleData['disableColumn'];
      }
      if (this.ruleData.messageInfo === 'Disable' || this.ruleData.messageInfo === 'Enable') {
        if (this.ruleData['disableAttrValue']) {
          this.ruleData.conditionDataInfo[this.selectedIndex]['disableAttrValue'] = this.ruleData['disableAttrValue'] ? this.ruleData['disableAttrValue'] : undefined;
        }
        this.ruleData.conditionDataInfo[this.selectedIndex]['disableColumn'] = this.ruleData['disableColumn'];
      }
      this.ruleData = JSON.parse(JSON.stringify(this.ruleData));
      this.isRuleEdit = false;
      this.selectRuleObj = undefined;
      this.selectedIndex = undefined;
      this.footerList = [{ type: 'Reset' }, { type: 'Undo' }, { type: 'Close' }, { type: 'Save' }];
      this.clearRule();
    }
  }

  storeFieldsinCallBack(rule: string) {
    let split = rule.split("&");
    for (let i = 0; i < split.length; i++) {
      if (split[i].includes('DataEntry')) {
        let pos = this.getPosition(split[i], ' ', 1)
        // console.log(split[i].slice(0, pos))
        this.antlrService.callBackObject.init(split[i].slice(0, pos), this.tempMapUniqueID.get(split[i].slice(0, pos)));
      }
    };
  }

  getPosition(str: string, m: string, i: number) { return str.split(m, i).join(m).length; }

  checkColumnPresent(ruleInfo: string, list: any) {
    let isValid = false;
    let cols = this.getColumns(ruleInfo);
    for (let i = 0; i < cols.length; i++) {
      isValid = list.filter((it: any) => it.position == cols[i]);
    }
    return isValid;
  }

  getRuleFromDisplay() {
    let dataEqn = this.ruleData.ruleInfo.split('THEN');
    this.ruleData.ruleInfo = dataEqn[0] + 'THEN ' + '{ ' + this.ruleData['messageInfo'] + '(' + this.ruleData.thenstep + ') }'
    let ruleValue = this.removeBracket(dataEqn[0]);
    ruleValue = ruleValue.replace(/[\(]/g, "( ");
    ruleValue = ruleValue.replace(/[\)]/g, " )");
    ruleValue = ruleValue.replace('IF', 'if');
    return ruleValue + `{ return true; } else { return false; }`;
  }
  checkValidRule(rule: string) {
    let col: any = this.getNewColumns(rule);
    for (let i = 0; i < col; i++) {
      if (!rule.includes('&Column')) {
        rule = rule.replace('Column', '&Column');
      }
    }
    return rule;
  }
  getNewColumns(text: string) {
    let splitf = text.split('Column');
    let col = [];
    for (let i = 0; i < splitf.length; i++) {
      if (splitf[i].includes('Attr')) {
        col.push(i)
      }
    }
    return col;
  }

  getColumns(text: string) {
    let splitf = text.split('&');
    let collist = [];
    for (let i = 0; i < splitf.length; i++) {
      if (splitf[i].startsWith('Column')) {
        let splitnew = splitf[i].split('==');
        let colField: any = this.getColFieldValue(splitnew[0]);
        collist.push({ col: colField[0] - 1, field: colField[1] - 1 })
      }
    }
    let colsitems = this.cbpService.removeDuplicates(collist, 'col');
    let col = colsitems.map((i: any) => i.col);
    return col;
  }
  getColFieldValue(text: string) {
    let regex = /\[([^\][]*)]/g;
    let results = [], m;
    while ((m = regex.exec(text))) {
      results.push(m[1]);
    }
    return results;
  }
  getColField(text: string, type: string) {
    let splitf = text.split(type + '('); // Enable(Column[9].Attr[1) } // Disable(Column[9].Attr[1) }
    let info: string = splitf[1].replace('}', ''); // Column[9].Attr[1)
    info = this.removeBracket(info); //Column9.Attr1)
    info = info.replace(')', '').trim(); // Column9.Attr1
    if (info.includes('.')) {
      let inde = info.indexOf('.');
      let col = info.substring(6, inde); // Attr
      let field = info.substring(12, info.length);
      return { col: col, fi: field };
    } else {
      info = info.replace('Column', '').trim();
      return { col: info, fi: undefined };
    }
  }
  setCallBackDgIds() {
    if (this.cbpService.selectedElement?.dgType != DgTypes.Form && this.ruleData.conditionDataInfo?.length > 0) {
      let rules: any = this.ruleData.conditionDataInfo;
      for (let i = 0; i < rules?.length; i++) {
        let ruleSplit = rules[i].DisplayValue.split("THEN")
        this.storeFieldsinCallBack(ruleSplit[0]);
        if (rules[i]?.ParsedValue?.includes("undefined")) {
          this.ruleEdit(rules[i], i);
          this.ruleData.DisplayValue = rules[i].DisplayValue;
          let equation = this.getEquationRule();
          this.isRuleEdit = false;
          this.selectRuleObj = undefined;
          this.selectedIndex = undefined;
          this.antlrService.callBackObject.initStepWithDgUniqueIdRule(this.ruleData.elsestep, this.ruleData.elsedguniqueid);
          this.antlrService.callBackObject.initStepWithDgUniqueIdRule(this.ruleData.thenstep, this.ruleData.thendguniqueid);
          rules[i].ParsedValue = this.antlrService.createExpression(equation, null, null);
          this.clearRule();
        }
      }
    }
  }
  ngOnDestroy(): void {
    this.hide();
  }
}
