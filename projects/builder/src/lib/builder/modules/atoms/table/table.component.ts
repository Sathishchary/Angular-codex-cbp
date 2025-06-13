import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnInit,
  Output
} from '@angular/core';
import { AlertMessages, CbpSharedService, DgTypes } from 'cbp-shared';
import { Observable, of, Subscription } from 'rxjs';
import { Actions, AuditTypes, TableProperties } from '../../../models';
import { AuditService } from '../../../services/audit.service';
import { BuilderService } from '../../../services/builder.service';
import { CbpService } from '../../../services/cbp.service';
import { ControlService } from '../../../services/control.service';
import { TableService } from '../../../shared/services/table.service';
import { BuilderUtil } from '../../../util/builder-util';
// @author: sathish Kotha , contact: sathishcharykotha@gmail.com
declare const $: any;
@Component({
  selector: 'app-editor-table',
  templateUrl: './table.component.html',
  styleUrls: ['../../../util/atoms.css', './table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit {
  @Input() field: any = {};
  @Input() media: any = {};
  dgTypes = DgTypes;
  @Input() stepObject: any;
  @Input() isCoverPage = false;
  tableProperty = new TableProperties();
  setItemSubscription!: Subscription;
  subScription!: Subscription;
  @Output() getNotifyParent: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectField: EventEmitter<any> = new EventEmitter<any>();
  currentField: any;
  styleObject: any;
  tableHeads!: Observable<any>;
  constructor(public cbpService: CbpService, public builderService: BuilderService, public auditService: AuditService,
    private _buildUtil: BuilderUtil, public tableService: TableService, public cbpSharedService: CbpSharedService,
    public controlService: ControlService, public cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.currentField = JSON.parse(JSON.stringify(this.field))
    this.tableService.selectedTable = this.field;
    this.tableService.columnProperty = false;
    this.tableService.cellProperty = false;
    this.tableService.selectedRow = [];
    if (!this.cbpService.selectedReset) {
      if (!this.field?.tableNameUpdated) {
        this.cbpService.selectedElement.tableName = this.cbpService.selectedElement.tableName + (++this.cbpService.dataFieldNumber);
      }
      this.field.tableNameUpdated = true;
      if (this.cbpService.selectedElement) {
        let result = [...this.cbpService.fieldsMaps.values()].includes(this.cbpService.selectedElement?.tableName);
        if (!this.cbpService.isDuplicateValues.includes(this.cbpService.selectedElement?.tableName)) {
          if (result && this.cbpService.selectedElement.tableName && !this.field.tableNameUpdated) {
            this.cbpService.selectedElement.tableName = this.cbpService.selectedElement?.tableName + "-A";
            this.cbpService.fieldsMaps.set(this.cbpService.selectedElement.dgUniqueID, this.cbpService.selectedElement?.tableName);
          }
        } else {
          this.cbpService.isDuplicateValues =
            this.cbpService.isDuplicateValues.filter(res => res !== this.cbpService.selectedElement.tableName);
        }
        if (this.field.isDataEntry) {
          this.cbpService.fieldsMaps.set(this.field.dgUniqueID, this.field.tableName);
        }
      }
    }
    this.setItemSubscription = this.controlService.selectedObjValue.subscribe((result: any) => {
      if (result && result !== undefined && result?.dgType !== undefined) {
        this.cbpService.selectedUniqueId = result.dgUniqueID;
        this.cbpService.selectedElement = result;
        this.cbpService.setCover();
        this.cdr.detectChanges();
      }
    });
    this.subScription = this.controlService.styleModelobjValue.subscribe((res: any) => {
      if (res && res !== undefined && !this.controlService.isEmpty(res)) {
        this.styleObject = JSON.parse(JSON.stringify(res['levelNormal']));
        this.updateTableColumnHeadsStyles();
        this.cbpService.isViewUpdated = true;
        this.cbpService.detectWholePage = true;
        this.cdr.detectChanges();
      }
    });
    if (this.isCoverPage) {
      this.builderService.dragElements = [...this.builderService.dragElements, ...this.tableService.newDragElements];
    }
    if (this.field?.calstable[0]?.table?.tgroup)
      this.tableHeads = of(this.field.calstable[0]?.table?.tgroup?.thead);
  }
  updateTableColumnHeadsStyles() {
    if (this.field?.calstable) {
      let totalColumns: any = this.field?.calstable[0]?.table?.tgroup?.thead?.length;
      if (totalColumns > 0 && totalColumns) {
        for (let i = 0; i < totalColumns; i++) {
          const columnHead = this.field.calstable[0].table.tgroup.thead[i];
          if (!columnHead?.styleSet) { columnHead['styleSet'] = {}; }
          columnHead.styleSet.fontSize = this.styleObject.fontSize;
          columnHead.styleSet.fontName = this.styleObject.fontName;
          columnHead.styleSet.color = this.styleObject.color;
          columnHead.styleSet.textalign = this.styleObject.textalign;
        }
        this.tableHeads = of(this.field.calstable[0].table.tgroup.thead);
        this.cdr.detectChanges();
      }
    }
  }
  ngDoCheck(): void {
    if (this.cbpService.isViewUpdated || this.cbpService.detectWholePage || this.cbpService.tableDetectChange) {
      if (this.cbpService.selectedElement?.dgUniqueID == this.field?.dgUniqueID) {
        if(!this.cbpService?.coverPageViewEnable){
          this.field = this.cbpService.selectedElement;
        }
        this.tableHeads = of(this.field?.calstable[0]?.table?.tgroup?.thead);
      }
      this.cdr.detectChanges();
      setTimeout(() => {
        this.cbpService.isViewUpdated = false;
        this.cbpService.detectWholePage = false;
        this.cbpService.tableDetectChange = false;
      }, 10);
    }
  }
  selectedElement() {
    if (this.cbpService.sectionHover) {
      this.auditService.settingStepOptionButns(this.field);
    }
    this.updateTableColumnHeadsStyles();
    this.tableService.selectedTable = this.field;
    this.controlService.setSelectItem(this.tableService.selectedTable);
    let coverpageRowLength = this.cbpService.editCoverPage && this.cbpService.cbpJson.documentInfo[0]?.coverPageData?.calstable[0].table.tgroup.tbody[0].row.length;
    if (coverpageRowLength == 1) {
      this.cbpService.coverPageSinglerow = true;
    }
    if (this.tableService.selectedRow.length === 1) {
      this.tableService.isTableSelectedElement = false;
    }
  }
  openMediaPopup() {
    if (this.cbpService.isBackGroundDocument) {
      $('#fileUploadMediaBg').trigger('click');
    } else {
      $('#fileUploadMedia').trigger('click');
    }
  }
  tableDrop(tableData: any, e: any, row: any, col: any, selectedTable: any) {
    if (e.dragData === DgTypes.SingleFigure) {
      if (this.tableService.selectedRow.length === 1) {
        this.openMediaPopup();
      } else {
        this.showErrorMsg(DgTypes.Warning, 'Please select a cell before add item');
      }
      return;
    }
    if (this.cbpService.selectedElement.dgType !== DgTypes.Table) {
      if (this.field.dgType == e.dragData && this.field.dataType == "table") {
        this.cbpService.selectedElement = selectedTable;
        this.tableService.selectedRow = [];
        this.tableService.selectedRow.push({ 'row': row, 'col': col });
        this.tableService.splitCell = true;
        this.controlService.setSelectItem(this.cbpService.selectedElement)
      }
      else {
        this.cbpService.selectedElement = JSON.parse(JSON.stringify(this.field));
      }
    } else {
      if (e.dragData === DgTypes.Table) {
        this.cbpService.selectedElement = selectedTable;
        this.tableService.selectedRow = [];
        this.tableService.selectedRow.push({ 'row': row, 'col': col });
        this.tableService.splitCell = true;
      }
    }
    if (this.tableService.splitCell !== true) {
      if (!(this.cbpService.embeddedType && this.cbpService.selectedElement.isEmbededObject)) {
        if (this.cbpService.selectedElement.referenceOnly) {
          if (this.checkReferenceEntries(e.dragData)) {
            let obj: any;
            obj = this.dataEntryObject(obj, row, col, e);
            obj = this.cbpService.setParentStepInfo(obj, selectedTable);
            tableData.children.push(obj);
            this.storeObjectAudit(obj);
            this.field.calstable[0].table.tgroup.tbody[0].row[row] = this.cbpService.setNewUserInfo(this.field.calstable[0].table.tgroup.tbody[0].row[row])
            this.cbpService.selectedElement = this.cbpService.setNewUserInfo(this.cbpService.selectedElement)

          } else {
            this.showErrorMsg(DgTypes.Warning, 'Reference only Table cannot accept' + e.dragData + ' field.');
          }
        } else {
          if (this.tableService.checkTableDataEntries({ dgType: e.dragData }) || this.checkReferenceEntries(e.dragData)) {
            let obj: any;
            obj = this.dataEntryObject(obj, row, col, e);
            obj = this.cbpService.setParentStepInfo(obj, selectedTable);
            tableData.children.push(obj);
            this.cbpService.selectedElement = this.cbpService.setNewUserInfo(this.cbpService.selectedElement)
            this.storeObjectAudit(obj);
          }
          else if (this.tableService.newDragElements.includes(e.dragData)) {
            let obj: any;
            obj = this.coverPageEntryObject(obj, row, col, e);
            obj['attributeType'] = obj.displayType;
            delete obj.displayType;
            tableData.children.push(obj);
            this.storeObjectAudit(obj);
          }
          else {
            this.showErrorMsg(DgTypes.Warning, AlertMessages.cannotAcceptTable + e.dragData);
          }
          this.field.calstable[0].table.tgroup.tbody[0].row[row] = this.cbpService.setNewUserInfo(this.field.calstable[0].table.tgroup.tbody[0].row[row])
        }
        this.cbpService.selectedElement = this.cbpService.setNewUserInfo(this.cbpService.selectedElement)
        this.field.calstable[0].table.tgroup.tbody[0].row[row] = this.cbpService.setCbpUserInfo(this.field.calstable[0].table.tgroup.tbody[0].row[row]);
        this.getNotifyParent.emit(this.field);
      } else {
        this.showErrorMsg(DgTypes.Warning, AlertMessages.cannotFiledsAcceptTable);
      }
    }
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }

  dataEntryObject(obj: any, row: any, col: any, e: any) {
    obj = this._buildUtil.createElement(e.dragData);
    obj['isDataEntry'] = false;
    obj['isTableDataEntry'] = true;
    if (this.isCoverPage || (this.cbpService.documentSelected)) {
      obj['isCover'] = true;
      obj['coverType'] = true;
    }
    if (this.field.calstable[0].table.tgroup.thead[col]) {
      obj['fieldName'] = this.field.calstable[0].table.tgroup.thead[col].fieldName + (this._buildUtil.getUniqueIdIndex());
      obj['fieldNameUpdated'] = true;
    } else {
      obj['fieldNameUpdated'] = false;
    }
    obj['dgUniqueID'] = this._buildUtil.getUniqueIdIndex();
    obj['dgUniqueID'] = obj['dgUniqueID']?.toString();
    obj = this.cbpService.setBgDgUniqueID(obj);
    this.cbpService.cbpJson.documentInfo[0]['dgUniqueID'] = obj['dgUniqueID'] + 1;
    obj['row'] = row + 1;
    obj['column'] = col + 1;
    if(obj['coverType']){
      obj['parentDgUniqueID'] = this.field.dgUniqueID;
      obj['parentID'] = this.field.parentID;
    }
    else{
    obj['parentDgUniqueID'] = this.field.dgUniqueID;
    obj['parentDgUniqueID'] = obj['parentDgUniqueID']?.toString();
    obj['parentID'] = this.field.parentID;
    obj['parentID'] = obj['parentID']?.toString();
    }
    this.cbpService.selectedUniqueId = this.field['dgUniqueID'];
    this.cbpService.tableDataEntrySelected = obj;
    if (this.field['footer']) {
      obj['footerTableItem'] = true;
      obj['headerTable'] = true;
    }
    if (this.field['header']) {
      obj['headerTableItem'] = true;
      obj['headerTable'] = true;
    }
    if (this.cbpService.selectedElement['subTabe']) {
      obj['subTable'] = true;
    }
    this.viewUpdate();
    return obj;
  }
  coverPageEntryObject(obj: any, row: any, col: any, e: any) {
    obj = {};
    let attribute = this.cbpService.listAttributes.find((item: any) => item.property === e.dragData);
    obj = { ...attribute, ...obj };
    delete obj.options
    delete obj.attributeName
    obj['isTableDataEntry'] = true;
    obj['attributeType'] = obj.displayType;
    if (this.field.calstable[0].table.tgroup.thead[col]) {
      if (this.cbpService.documentSelected) {
        obj['fieldName'] = e.dragData;
        obj['fieldNameUpdated'] = true;
        obj['isDefaultTableAdd'] = true;
        obj['isPropertyAdd'] = true;
        obj['editorOpened'] = false;
        obj['isHtmlText'] = false;
        obj['dgUniqueID'] = this._buildUtil.getUniqueIdIndex();
        obj['parentDgUniqueID'] = this.field.dgUniqueID;
        obj['parentDgUniqueID'] = obj['parentDgUniqueID']?.toString();
        obj['parentID'] = this.field.parentID;
        obj['parentID'] = obj['parentID']?.toString()
        obj['coverType'] = true;
        obj = this.cbpService.setBgDgUniqueID(obj);
        this.cbpService.selectedUniqueId = this.field['dgUniqueID'];
        this.tableService.isTableAddDefault = false;
        this.tableService.isAttributeDisable.push(e.dragData);
      }
      else {
        obj['fieldName'] = this.field.calstable[0].table.tgroup.thead[col].fieldName + (this._buildUtil.getUniqueIdIndex());
        obj['fieldNameUpdated'] = true;
      }
    }
    obj['dgUniqueID'] = this._buildUtil.getUniqueIdIndex();
    obj['dgUniqueID'] = obj['dgUniqueID']?.toString()
    obj = this.cbpService.setBgDgUniqueID(obj);
    this.cbpService.cbpJson.documentInfo[0]['dgUniqueID'] = obj['dgUniqueID'] + 1;
    obj['row'] = row + 1;
    obj['column'] = col + 1;
    obj['parentDgUniqueID'] = this.field.dgUniqueID?.toString();
    obj['parentID'] = this.field.parentID;
    this.cbpService.selectedUniqueId = this.field['dgUniqueID'];
    this.cbpService.tableDataEntrySelected = obj;
    if (this.field['footer']) {
      obj['footerTableItem'] = true;
    }
    if (this.field['header']) {
      obj['headerTableItem'] = true;
    }
    if (this.cbpService.selectedElement['subTabe']) {
      obj['subTable'] = true;
    }
    delete obj.fieldName
    delete obj.dataType
    delete obj.display
    if (obj.pakgAttr) {
      delete obj.pakgAttr
    }
    return obj;
  }
  storeObjectAudit(obj: any) {
    if (this.cbpService.selectedElement['subTabe'] === true && !obj.header && !obj.footer) {
      this.auditService.createEntry({}, JSON.parse(JSON.stringify(obj)), Actions.Insert, AuditTypes.TABLE_SUB_ENTRY_ADD);
    }
    else if ((this.cbpService.selectedElement['subTabe'] === true) && obj.header || obj.footer) {
      this.auditService.createEntry({}, JSON.parse(JSON.stringify(obj)), Actions.Insert, AuditTypes.TABLE_ENTRY_HEADER_ADD);
    }
    else if ((this.cbpService.selectedElement['subTabe'] === true) && obj.footer || obj.header) {
      this.auditService.createEntry({}, JSON.parse(JSON.stringify(obj)), Actions.Insert, AuditTypes.TABLE_ENTRY_FOOTER_ADD);
    }
    else if (obj.headerTableItem) {
      this.auditService.createEntry({}, JSON.parse(JSON.stringify(obj)), Actions.Insert, AuditTypes.TABLE_ENTRY_HEADER_ADD);
    }
    else if (obj.footerTableItem) {
      this.auditService.createEntry({}, JSON.parse(JSON.stringify(obj)), Actions.Insert, AuditTypes.TABLE_ENTRY_FOOTER_ADD);
    }
    else {
      this.auditService.createEntry({}, JSON.parse(JSON.stringify(obj)), Actions.Insert, AuditTypes.TABLE_ENTRY_ADD);
    }
    this.viewUpdate();
  }
  checkReferenceEntries(dgTypes: any) {
    return dgTypes === this.dgTypes.Table || dgTypes === this.dgTypes.Para ||
      dgTypes === this.dgTypes.LabelDataEntry || dgTypes === this.dgTypes.SingleFigure || dgTypes === this.dgTypes.Link ? true : false;
  }
  cellProperty(cell: any, row: any, column: any, event: any, cellRowLength: any) {
    this.setRowColumnInfo(row + 1, column + 1);
    this.setColumnInfo(true, true, this.field.calstable[0].table.tgroup.thead[column]);
    this.storeRowInfo(cell, row, column, event, cellRowLength);
    if (cell.children.length === 0) {
      this.cbpService.tableDataEntrySelected = undefined;
      this.tableService.setDataEntry({});
    } else {
      if (this.cbpService.editCoverPage && typeof cell.children[0] === 'object' && cell.children[0] !== null) {
        const isEmpty = Object.keys(cell.children[0]).length === 0;
        if (isEmpty || !cell.children[0].coverType && !(cell.children[0].dataType == "table")) {
          cell.children.splice(0, 1);
        }
      }
      // this.cbpService.tableDataEntrySelected = cell.children[0];
      this.tableService.setDataEntry(this.cbpService.tableDataEntrySelected);
    }
  }
  eventfromField(event: any, entry: any, row: any, column: any, cellRowLength: any) {
    this.cbpService.selectedTableCol = false;
    this.cbpService.tableDataEntrySelected = entry;
    this.cbpService.columnRuleEnabled = false;
    this.cbpService.selectedTableCol = false;
    this.setRowColumnInfo(event.row, event.col);
    this.cbpService.selectedElement = this.field;
    this.controlService.setSelectItem(this.field);
    this.storeRowInfo(entry, row, column, event, cellRowLength);
    this.setuserInfo(this.field);
    if (!this.currentField?.internalRevision) {
      // if(this.cbpService.tableDataEntrySelected.dgType== DgTypes.Para ){
      this.cbpService.tableDataEntrySnapChat = JSON.parse(JSON.stringify(this.cbpService.tableDataEntrySelected));
      // }
    }

    this.tableService.setDataEntry(this.cbpService.tableDataEntrySelected);
  }
  setuserInfo(field: any) {
    if (field?.subTable) {
      this.getNotifyParent.emit(this.field);
    } else {
      if (JSON.stringify(this.field) !== JSON.stringify(this.currentField)) // && this.cbpService.tableDataEntrySelected?.editorOpened  == false && this.cbpService.tableDataEntrySelected?.isHtmlText == false
        this.field = this.cbpService.setNewUserInfo(this.field);
    }
  }
  unableToDrop(event: any) {
    this.showErrorMsg(DgTypes.Warning, 'Please select a cell before add item');
  }

  setRowColumnInfo(row: any, col: any) {
    if (this.tableService.selectedRow?.length == 0) {
      this.cbpService.selectedTableCol = false;
    }
    this.tableService.tableRowPosition = row;
    this.tableService.tableColumnPosition = col;
  }

  setColumnInfo(column: any, cell: any, table: any) {
    this.tableService.columnProperty = column;
    this.tableService.cellProperty = cell;
  }

  isRowOrColSelected(obj: any, i: any, j: any) {
    return this.tableService.selectedRow.find((item: { row: any; col: any; }) => item.row === i && item.col === j) ? true : false;
  }
  selectCol(item: any) {
    this.tableService.selectTableCol = [item];
    this.tableService.selectedRow = [];
    this.cbpService.tableDataEntrySelected = '';
    this.cbpService.selectedElement = this.field;
  }

  storeRowInfo(cell: any, i: any, j: any, event: any, lengthOfCell: any) {
    if (!this.cbpService.documentSelected) {
      this.cbpService.selectedElement['selectTable'] = false;
    } else {
      this.cbpService.selectedElement = this.field;
      this.cbpService.selectedUniqueId = 0;
    }
    this.tableService.selectTableCol = [];
    if (event && (!event.shiftKey)) {
      this.tableService.selectedRow = [];
    }
    const object = this.tableService.selectedRow.find((item: { row: any; col: any; }) => item.row === i && item.col === j);
    if (!object) {
      this.tableService.selectedRowNum = i;
      this.tableService.selectedRow.push({ 'row': i, 'col': j });
      this.cbpService.isViewUpdated = true;
      if (this.tableService.isBorderRemove && this.isCoverPage) {
        this.tableService.selectedRow.length = 0;
        this.cbpService.isViewUpdated = true;
      }
    }
    if (event.shiftKey) {
      document?.getSelection()?.removeAllRanges();
    }
  }

  showErrorMsg(dgType: any, dgTypeMsg: any) {
    this.setErrorMesg(dgTypeMsg, dgType, true);
  }
  closeModal() {
    this.setErrorMesg('', '', false);
    this.cbpSharedService.closeModalPopup('error-modal');
  }
  setErrorMesg(mesg: string, type: any, popup: boolean) {
    this.cbpService.displayMsg = mesg;
    this.cbpService.errorDgType = type;
    this.cbpService.showErrorPopup = popup;
  }
  setField(event: any) {

  }
  fieldSelect(event: any) {
    this.selectField.emit(event);
  }
  setValue(event: any) {
    this.field.prompt = event.target.value;
  }
  ngOnDestroy(): void {
    this.field.calstable[0].table.tgroup.thead = [];
    this.tableHeads.subscribe(value => {
      this.field.calstable[0].table.tgroup.thead = value;
    });
    this.setItemSubscription?.unsubscribe();
    this.tableService.selectedRow = [];
    this.subScription?.unsubscribe();
  }
  viewUpdate() {
    if (JSON.stringify(this.field) !== JSON.stringify(this.currentField)) {
      this.cbpService.setUserUpdateInfo(this.field);
      this.controlService.hideTrackUi({ 'trackUiChange': true });
    }
  }
}
