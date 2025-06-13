import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input, OnInit,
  Output
} from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DgTypes } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { CbpExeService } from '../../services/cbpexe.service';
import { DatashareService } from '../../services/datashare.service';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';
import { AntlrService } from '../../shared/services/antlr.service';
import { TableService } from '../../shared/services/table.service';
import { ShowRulesComponent } from '../show-rules/show-rules.component';
declare var swal: any;
/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent implements OnInit {
  @Input() stepObject: any;
  @Input() obj: any;
  @Input() parentRow: any = 0;
  @Input() parentCol: any = 0;
  @Input() isCoverPage = false;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  @Output() signatureEvent: EventEmitter<any> = new EventEmitter();
  @Output() setEntryDataJson: EventEmitter<any> = new EventEmitter();
  @Output() isHeaderFooterTable: EventEmitter<any> = new EventEmitter();
  @Output() dynamicFormRefEvent: EventEmitter<any> = new EventEmitter();
  @Output() protectAllFields: EventEmitter<any> = new EventEmitter();
  enableComments!: Subscription;
  subScription!: Subscription;
  dgType = DgTypes;
  storeMessages: any[] = [];
  modalOptions!: NgbModalOptions;
  styleObject: any;

  constructor(public cbpService: CbpExeService, public sharedviewService: SharedviewService,
    public tableService: TableService, public executionService: ExecutionService,
    private cdr: ChangeDetectorRef, public datashareService: DatashareService,
    public antlrService: AntlrService, private modalService: NgbModal) {

  }
  ngOnInit() {
    if (this.stepObject['subTabe']) {
      this.stepObject['rowParent'] = this.parentRow;
      this.stepObject['colParent'] = this.parentCol;
    }
    if (this.cbpService.coverPageSelected) {
      if (!this.stepObject['subTabe']) {
        this.stepObject['withoutLines'] = true;
      }
    }
    this.enableComments = this.executionService.colorUpdateView.subscribe((res: any) => {
      if (res?.enableCommentsProtect) {
        this.sharedviewService.showComments = res?.bol;
      }
      this.cdr.detectChanges();
    });
    this.subScription = this.executionService.styleModelobjValue.subscribe((res: any) => {
      if (res && res !== undefined && !this.executionService.isEmpty(res)) {
        this.styleObject = JSON.parse(JSON.stringify(res['levelNormal']));
      }
    });
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.keyCode == 67 && this.tableService.selectedRow.length > 0) {
      this.copyElement();
    }
    if ((event.ctrlKey || event.metaKey) && event.keyCode == 86 && !this.sharedviewService.midPaste) {
      this.sharedviewService.midPaste = true;
      event.preventDefault();
      this.updatePasteDebounceTime();
    }
  }

  @HostListener('document:keyup', ['$event']) onKeyUpHandler(e: KeyboardEvent) {
    if (e.keyCode == 80 && this.sharedviewService.midPaste) {
      this.sharedviewService.midPaste = false;
    }
  }
  public updatePasteDebounceTime = this.debounceTime(() => {
    this.executionService.setRowField({
      type: 'tablePaste',
      rowCol: this.tableService.selectedRow,
      row: this.cbpService.copiedElement,
      table: this.stepObject
    });
    this.cdr.detectChanges();
  }, 100)

  debounceTime(cb: any, delay = 1000) {
    let timeout: any;
    return () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => { cb(); }, delay)
    }
  }
  trackByName(index: any, instructor: any) { return instructor.dgUniqueID; }

  checkValidation(eventObj: any, mainObj: any, valueObj: any, rowIndex: number, colIndex: number, fieldIndex: number) {
    this.storeTableCell(rowIndex, colIndex);
    if (this.stepObject['tableRules']?.length > 0 && this.tableService.selectedRow?.length === 1) {
      if (this.stepObject['rowsCount'] > 0) {
        if ((rowIndex + 1) > this.stepObject['rowsCount']) {
          this.tableRuleConstruction(mainObj, valueObj, rowIndex, colIndex, fieldIndex);
        }
      } else {
        this.tableRuleConstruction(mainObj, valueObj, rowIndex, colIndex, fieldIndex);
      }
    }
    if (this.stepObject?.tableRules?.length) {
      this.tableService.reExecuterRules = false;
    }
    this.closeEvent.emit({ event: eventObj, stepObj: mainObj, value: valueObj });
    this.cdr.detectChanges();
  }
  storeTableCell(rowIndex: any, colIndex: any) {
    if (this.tableService.selectedRow.length == 1 || this.tableService.selectedRow.length == 0) {
      this.tableService.selectedRow = [];
      this.tableService.selectedRow.push({ row: rowIndex, col: colIndex });
    }
  }
  tableRuleConstruction(mainObj: any, valueObj: any, rowIndex: any, colIndex: any, fieldIndex: any) {
    let fieldName = `Column${colIndex + 1}.Attr${fieldIndex + 1}`;
    if (mainObj.dgType == DgTypes.SignatureDataEntry || mainObj.dgType == DgTypes.InitialDataEntry) {
      this.antlrService.callBackObject.initExecution(fieldName, valueObj);
    } else {
      valueObj = valueObj.toString().replace(/\s\s+/g, ' ');
      if (valueObj === ' ' || valueObj === '') {
        this.antlrService.callBackObject.initExecution(fieldName, '<<DG_EMPTY>>');
      } else {
        this.antlrService.callBackObject.initExecution(fieldName, this.removeHTMLTags(valueObj));
      }
    }
    this.tableRuleFunction(mainObj, rowIndex, colIndex, fieldIndex, fieldName, this.removeHTMLTags(valueObj));

  }
  tableRuleFunction(mainObj: any, rowIndex: any, colIndex: any, fieldIndex: any, fieldName: string, value: any) {
    this.storeMessages = [];
    for (let i = 0; i < this.stepObject['tableRules'].length; i++) {
      const element = this.stepObject['tableRules'][i];
      if (element?.parsedValue?.includes('UserQual')) {
        this.antlrService.callBackObject.qualificationRoles = this.sharedviewService.userCbpInfo?.qualification.map((t: any) => t?.display);
      }
      if (element?.messageInfo === 'DisableNextSteps' || element?.messageInfo === 'Message') {
        if (this.tableService.getColFieldListValidate(element.DisplayValue, colIndex, fieldIndex)) {
          this.tableService.setFieldValues(element.DisplayValue, this.stepObject);
          value = this.checkBoolean(mainObj, value);
          value = value == "" ? '<<DG_EMPTY>>' : value;
          this.antlrService.callBackObject.initExecution(fieldName, value);
          this.ruleValidation(element, mainObj, rowIndex);
        }
      }
      if (element?.messageInfo === 'Disable' || element?.messageInfo === 'Enable') {
        this.tableService.setFieldValues(element.DisplayValue, this.stepObject);
        value = this.checkBoolean(mainObj, value);
        value = value == "" ? '<<DG_EMPTY>>' : value;
        this.antlrService.callBackObject.initExecution(fieldName, value);
        this.ruleValidation(element, mainObj, rowIndex);
      }
    }
    if (this.storeMessages?.length > 0) { this.callMessages(this.storeMessages); }
  }

  checkBoolean(mainObj: any, value: string) {
    if (mainObj.dgType === DgTypes.CheckboxDataEntry || mainObj.dgType === DgTypes.BooleanDataEntry) {
      value = value.toLowerCase();
    }
    return value;
  }
  ruleValidation(element: any, mainObj: any, rowIndex: any) {
    let rule = element.parsedValue.trim().split(/[\s,\t,\n]+/).join(' ');
    const valueValid = this.antlrService.executeExpression(rule);
    this.ruleExecution(element, mainObj, valueValid == "true", rowIndex);
  }

  removeBracket(item: string) {
    return item.replace(/[\[\]']+/g, '')
  }
  ruleExecution(element: any, mainObj: any, bol: boolean, row: any) {
    if (element.messageInfo === 'DisableNextSteps') {
      let colObj = this.tableService.getDisableEnableCol(element.DisplayValue, element.messageInfo);
      let attr = Number(colObj.fi);
      let obj = { row: row, col: Number(colObj.col) - 1, attr: attr - 1 };
      this.storeDataJsonRule(mainObj, bol, 'updateRows', obj);
      this.updateRows(bol, row, obj.col);
    }
    if (element.messageInfo === 'Message' && bol) {
      let message = { message: element['showMessage'] };
      this.storeDataJsonRule(mainObj, bol, element.messageInfo, message);
      this.storeMessages.push(element['showMessage']);
    }
    if (element.messageInfo === 'Disable') {
      let colObj = this.tableService.getDisableEnableCol(element.DisplayValue, element.messageInfo);
      let attr = colObj.fi ? Number(colObj.fi) : undefined;
      let obj = { row: row, col: Number(colObj.col) - 1, attr: attr ? attr - 1 : undefined };
      this.storeDataJsonRule(mainObj, bol, element.messageInfo, obj);
      this.updateCurrentColumn(row, obj.col, obj?.attr, bol);
    }
    if (element.messageInfo === 'Enable') {
      let colObj = this.tableService.getDisableEnableCol(element.DisplayValue, element.messageInfo);
      let attr = colObj.fi ? Number(colObj.fi) : undefined;
      let obj = { row: row, col: Number(colObj.col) - 1, attr: attr ? attr - 1 : undefined };
      this.storeDataJsonRule(mainObj, !bol, element.messageInfo, obj);
      this.updateCurrentColumn(row, obj.col, obj.attr, !bol);
    }
  }

  storeDataJsonRule(mainObj: any, ruleValid: boolean, dgType: string, newObj: any) {
    let obj: any = this.sharedviewService.setUserInfoObj(6000);
    obj['row'] = this.tableService.selectedRow[0].row;
    obj['tableRuleExecution'] = true;
    obj['dgType'] = dgType;
    obj['ruleValid'] = ruleValid;
    obj['storeValue'] = mainObj.storeValue;
    obj['tableDgUniqueID'] = this.stepObject.dgUniqueID
    obj['dgUniqueID'] = new Date().getTime();
    obj['fieldDgUniqueID'] = mainObj.dgUniqueID;
    if (dgType === 'updateRows') {
      obj['col'] = newObj.col;
    } else {
      obj = { ...obj, ...newObj };
    }
    this.cbpService.dataJson.dataObjects = this.cbpService.dataJson.dataObjects.filter((item: any) => item?.fieldDgUniqueID !== mainObj.dgUniqueID);
    this.cbpService.dataJson.dataObjects.push(obj)
  }

  callMessages(messages: any) {
    const messageQue: any = [];
    messages.forEach((item: any, i: any) => {
      messageQue.push({
        title: messages[i], customClass: 'swal-wide swal-height',
        showCancelButton: false, confirmButtonText: 'OK'
      });
    });
    swal.queue(messageQue);
    this.storeMessages = [];
  }
  updateCurrentColumn(rowNo: number, col: number, attr: any, bol: boolean) {
    const object = this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[rowNo].entry[col];
    if (object) {
      if (typeof attr == 'number') {
        object.children[attr]['protect'] = bol;
        object.children[attr]['disableField'] = bol;
      } else {
        for (let k = 0; k < object?.children?.length; k++) {
          object.children[k]['protect'] = bol;
          object.children[k]['disableField'] = bol;
        }
      }
    }

  }
  updateRows(isEnableBelowRows: boolean, rowNo: number, col: number) {
    let rowdata = this.stepObject.calstable[0].table.tgroup.tbody[0].row;
    for (let l = 0; l < rowdata.length; l++) {
      let entryObj = rowdata[l].entry;
      if (rowNo < l) {
        this.setProtectOrUnProtect(entryObj, isEnableBelowRows, l, col);
      }
    }
  }
  setProtectOrUnProtect(entryObj: any, bol: boolean, l: number, col: number) {
    for (let m = 0; m < entryObj?.length; m++) {
      if (entryObj[m]) {
        const object = this.stepObject.calstable[0].table.tgroup.tbody[0].row[l].entry[col];
        if (object && object?.children)
          for (let k = 0; k < object.children.length; k++) {
            object.children[k]['protect'] = bol;
            object.children[k]['disableField'] = bol;
          }
      }
    }
  }
  copyElement() {
    if (this.cbpService.copiedElement.length > 0) {
      if (this.executionService.selectedNewEntry)
        this.cbpService.copySelectedDataEntry = JSON.parse(JSON.stringify(this.executionService.selectedNewEntry));
      this.executionService.setRowField({ type: 'tableCopy', rowCol: this.tableService.selectedRow, row: this.cbpService.copiedElement, table: this.stepObject });
    }
  }
  removeHTMLTags(str: any) {
    if ((str === null) || (str === undefined) || (str === ''))
      return '';
    else
      str = str.toString();
    let finalString = str.replace(/(<([^>]+)>)/ig, '');
    finalString = finalString.replace(/&nbsp;/g, ' ');
    return finalString;
  }
  setTable() {
    this.cbpService.selectedTable = this.stepObject;
  }
  cellProperty(cell: any, row: any, column: any, event: any, cellRowLength: any, rowObj: any) {
    this.cbpService.selectedTable = this.stepObject;
    this.storeRowInfo(row, column, event, rowObj);
    this.setHeaderFooterTable();
  }
  setHeaderFooterTable() {
    this.isHeaderFooterTable.emit();
  }
  storeRow(rows: any, i: number) {
    this.executionService.setRowField({ type: 'slectedRow', row: rows, table: this.stepObject, index: i });
  }
  isRowOrColSelected(obj: any, i: any, j: any) {
    let value = this.tableService.selectedRow.find(item => item.row === i && item.col === j) ? true : false;
    return value;
  }
  storeRowInfo(i: any, j: any, event: any, rowObjChidren: any) {
    if (event && (!this.cbpService.selectCellEnabled)) { // event.shiftKey
      this.tableService.selectedRow = []; this.cbpService.copiedElement = [];
    }
    const object = this.tableService.selectedRow.find(item => item.row === i && item.col === j);
    if (!object) {
      if (!this.stepObject.coverPageTable) {
        this.tableService.selectedRowNum = i;
        this.tableService.selectedCol = j;
        this.tableService.selectedRow.push({ 'row': i, 'col': j });
        this.cbpService.copiedElement.push({ cellInfo: rowObjChidren, row: i, col: j });
      }
    } else {
      if (this.tableService.selectedRow.length > 1) {
        let index = this.tableService.selectedRow.findIndex(item => item.row == i && item.col == j);
        this.tableService.selectedRow.splice(index, 1);
      }
    }
    this.cdr.detectChanges();
  }

  saveDataJsonItem(item: any) {
    this.setEntryDataJson.emit(item);
  }
  openReferenceInLinkTab(event: any) {
    this.dynamicFormRefEvent.emit(event);
  }



  async pasteData(cell: any, row: any, column: any, event: any, cellRowLength: any, stepObject: any) {
    this.cbpService.selectedTable = this.stepObject;
    const rows = this.stepObject.calstable[0].table.tgroup.tbody[0].row;
    for (let i = 0; i < this.executionService.wordData.length; i++) {
      const r = this.executionService.wordData[i];
      for (let k = 0; k < r.length; k++) {
        const col = r[k].toString().trim();
        let element = rows[row + i]?.entry[column + k];
        if (element) {
          if (element?.children.length > 0) {
            let child = element.children.find((p: any) => p.dgType == DgTypes.TextDataEntry || p.dgType == DgTypes.TextAreaDataEntry
              || p.dgType == DgTypes.NumericDataEntry);
            if (child) {
              const childSnapshot = JSON.parse(JSON.stringify(child));
              if (child.dgType == DgTypes.TextDataEntry || child.dgType == DgTypes.TextAreaDataEntry) {
                child.storeValue = col;
              } else if (child.dgType == DgTypes.NumericDataEntry) {
                if (Number(col)) { child.storeValue = col; }
              }
              let fieldIndex = element.children.findIndex((item: any) => item.dgUniqueID === child.dgUniqueID);
              let text = this.removeHTMLTags(child.storeValue);
              if (this.stepObject['tableRules'] && this.stepObject['tableRules']?.length > 0) {
                let fieldName = `Column${row + i}.Attr${fieldIndex + 1}`;
                this.tableRuleFunction(child, row + i, column + k, fieldIndex, fieldName, text);
              }
              text = text.replace(/\s\s+/g, '');
              if (text !== '') {
                child = this.executionService.setFormatStyle(child);
                child = this.executionService.setStyleOfStep(child);
                child['innerHtmlView'] = true;
                let dataInfoObj = this.sharedviewService.storeDataObj(childSnapshot, child.storeValue);
                this.tableService.storeDataJson(dataInfoObj);
              }
              await this.tableService.delay(10);
            }
          }
        }
        this.datashareService.changeCount++;
      }
    }
    this.executionService.wordData = [];
    this.executionService.wordHtml = '';
    this.saveDataJsonItem({});
    this.cdr.detectChanges();
  }

  showRulesPopup() {
    this.modalOptions = { backdrop: 'static', backdropClass: 'customBackdrop', size: 'lg', centered: true }
    const modalRef = this.modalService.open(ShowRulesComponent, this.modalOptions);
    modalRef.componentInstance.rules = this.stepObject?.tableRules;
    modalRef.componentInstance.closeEvent.subscribe((result: any) => {
      modalRef.close();
    });
  }
  focusDataEntry(event: any, i: number, k: number, l: number, rowObj: any) {
    const object = this.tableService.selectedRow.find(item => item.row === i && item.col === k);
    if (!object)
      this.storeRowInfo(i, k, event, rowObj);
  }

  protectDataFields() {
    this.protectAllFields.emit();
  }

  ngOnDestroy(): void {
    this.enableComments?.unsubscribe();
    this.subScription?.unsubscribe();
  }
}
