import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { AlertMessages, CbpSharedService, DgTypes } from 'cbp-shared';
import { Actions, AuditTypes, TableProperties } from '../../../models';
import { DataEntryPosition } from '../../../models/dataentryposition';
import { AuditService } from '../../../services/audit.service';
import { CbpService } from '../../../services/cbp.service';
import { ControlService } from '../../../services/control.service';
import { TableService } from '../../../shared/services/table.service';
import { BuilderUtil } from '../../../util/builder-util';

@Component({
  selector: 'app-tableadd',
  templateUrl: './tableadd.component.html',
  styleUrls: ['./tableadd.component.css']
})
export class TableaddComponent implements OnInit, OnDestroy {
  DgTypes: typeof DgTypes = DgTypes;
  selectedSection: any;
  splitcell = true;
  splitCount = 0;

  constructor(public cbpService: CbpService, public _buildUtil: BuilderUtil, public tableService: TableService,
    public notifier: NotifierService, public auditService: AuditService, public cbpSharedService: CbpSharedService,
    public controlService: ControlService, public sharedService: CbpSharedService) { }

  ngOnInit() {
    this.sharedService.openModalPopup('tableAdd');
    this.tableService.referenceProperty = true;
    this.tableService.numberofColumns = 2;
    this.tableService.numberofRows = 2;
    const tables = this.tableService.totalTablesInfo();
    if (tables.length > 0) {
      const lengthofcolumns = this.tableService.getTheColumnInfo(tables);
      this.tableService.columntitlePosition = lengthofcolumns.length + 1
    } else {
      this.tableService.columntitlePosition = 0;
    }
    if (this.tableService.selectedRow.length > 1) {
      this.tableService.splitcellMerge = true;
    }
    this.tableService.columntitlePosition = 0;
    this.cbpService.selectedReset = false;
  }
  tableElement() {
    this.selectedSection = this.cbpService.selectedElement;
    if (this.tableService.splitCell) {
      if (this.tableService.selectedRow.length > 1 && this.splitcell) {
        this.tableService.mergeCells(this.cbpService.selectedElement);
        const objarray = this.tableService.selectedRow[0];
        this.tableService.selectedRow = [];
        this.tableService.selectedRow.push(objarray);
      }
      let obj = this._buildUtil.createElement(DgTypes.Table);
      obj = this.cbpService.setParentStepInfo(obj, this.cbpService.selectedElement);
      this.cbpService.selectedElement.subTabCount = this.tableService.numberofColumns;
      // obj['maxTableColumn'] = this.tableService.columeNameInc ;
      obj['subTabCount'] = 0;
      obj['withoutHeaders'] = true;
      obj['subTabe'] = true;
      obj['parentID'] = this.cbpService.selectedElement.parentID;
      obj['sectionParentID'] = this.cbpService.selectedElement.parentID;
      obj['tableNo'] = ++obj['tableNo'];
      // this.controlService.setDualStep(this.cbpService.selectedElement, obj);
      if (!this.splitcell && this.tableService.selectedRow.length > 1) {
        this.tableService.columeNameInc = 0;
        const item = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row;
        item['maxTableColumn'] = 0;
        item['maxTableColumn'] = ++this.tableService.columeNameInc;
        for (let i = 0; i < this.tableService.selectedRow.length; i++) {
          let objTable: any = this._buildUtil.createElement(DgTypes.Table);
          objTable = this.cbpService.setParentStepInfo(objTable, this.cbpService.selectedElement);
          const table = item[this.tableService.selectedRow[i].row].entry[this.tableService.selectedRow[i].col];
          table.children = [];
          objTable = JSON.parse(JSON.stringify(this.defaultTableAddInfo(objTable, this.cbpService.selectedElement, false)));
          objTable['withoutHeaders'] = true;
          objTable['subTabe'] = true;
          objTable['tableNo'] = ++obj['tableNo'];
          objTable.calstable[0].table.tgroup.tbody[0].row = [];
          let rownobj = { children: [] };
          let rowEntryobj = []
          for (let k = 1; k <= this.tableService.numberofColumns; k++) {
            const objcol = this.setTableHead({}, obj, k);
            objTable.calstable[0].table.tgroup.thead.push(objcol);
            rowEntryobj.push(rownobj);
          }
          for (let m = 0; m < this.tableService.numberofRows; m++) {
            let rowObj = { entry: rowEntryobj };
            objTable.calstable[0].table.tgroup.tbody[0].row.push(rowObj);
          }
          if (objTable.calstable) {
            for (let j = 0; j < this.tableService.numberofRows; j++) {
              for (let i = 0; i < this.tableService.numberofColumns; i++) {
                if (objTable.calstable[0].table.tgroup.tbody[0].row[j].entry[i].children.length < 1) {
                  objTable.calstable[0].table.tgroup.tbody[0].row[j].entry[i].children = [];
                }
              }
            }
          }
          table.children.push(JSON.parse(JSON.stringify(objTable)));
          this.updateView(table);
        }
      } else {
        if (this.tableService.selectedRow.length == 0) {
          this.tableService.isTableAdded = false;
          this.showErrorMsg(DgTypes.Warning, 'Please Select Atleast One Cell');
        } else {
          let item = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[this.tableService.selectedRow[0].row].entry[this.tableService.selectedRow[0].col];
          item.children = item?.children?.length > 0 ? item.children : [];
          let obj = this._buildUtil.createElement(DgTypes.Table);
          obj = this.cbpService.setParentStepInfo(obj, this.cbpService.selectedElement);
          obj['withoutHeaders'] = true;
          obj = this.defaultTableAddInfo(obj, this.cbpService.selectedElement, true);
          this.spiltCheck(obj, item);
        }
      }
    } else {
      let obj = this._buildUtil.createElement(DgTypes.Table);
      obj = this.cbpService.setParentStepInfo(obj, this.cbpService.selectedElement);
      obj['maxTableColumn'] = 0;
      this.tableService.columeNameInc = obj['maxTableColumn'];
      obj = this.defaultTableAddInfo(obj, this.cbpService.selectedElement, true);
      obj['tableNo'] = ++this.cbpService.selectedElement.tableNo;
      this.controlService.setDualStep(this.cbpService.selectedElement, obj);
      if ((this.cbpService.selectedElement.dgType == "Header" && this.cbpService.headerSelected) || (this.cbpService.selectedElement.dgType == "Footer" && this.cbpService.footerSelected)) {
        obj['withoutHeaders'] = true;
        obj['headerTable'] = true;
        obj['header'] = this.cbpService.headerSelected;
        obj['footer'] = this.cbpService.footerSelected;
      }
      obj['parentID'] = this.cbpService.selectedElement.dgSequenceNumber;
      obj = this.cbpService.setUserUpdateInfo(obj);
      if (this.cbpService.selectedElement.dgType == DgTypes.Table) {
        obj['superParentTableID'] = obj['superParentTableID'] ? obj['superParentTableID'] : this.cbpService.selectedElement.dgUniqueID;
      }
      this.cbpService.selectedElement.children.push(obj);
      this.updateView(this.cbpService.selectedElement);
      //this.auditService.createEntry({}, JSON.parse(JSON.stringify(obj)), Actions.Insert, AuditTypes.TABLE)
      this.cbpService.selectedElement = obj ? obj : this.cbpService.selectedElement.children.slice(-1)[0];
      this.controlService.setSelectItem(this.cbpService.selectedElement);
    }
    this.tableService.isTableAdded = false;
    this.tableService.splitCell = false;
    if (this.tableService.selectedRow.length !== 0 || this.tableService.selectedRow.length == 0) {
      this.tableService.isTableProperties = true;
    }
    this.tableService.splitcellMerge = false;
    this.cbpService.headerSelected = false;
    this.cbpService.footerSelected = false;
    this._buildUtil.paginateIndex = 1;
    this._buildUtil.setPaginationIndex(this.cbpService.cbpJson.section);
    this.cbpService.isViewUpdated = true;
    this.cbpService.detectWholePage = true;
  }

  spiltCheck(obj: any, item: any) {
    if (this.cbpService.headerSelected || this.cbpService.footerSelected) {
      obj['withoutHeaders'] = true;
      obj['headerTable'] = true;
      obj['header'] = this.cbpService.headerSelected;
      obj['footer'] = this.cbpService.footerSelected;
    }
    obj['tableNo'] = ++this.cbpService.selectedElement.tableNo;
    obj['parentID'] = this.cbpService.selectedElement.parentID;
    obj['sectionParentID'] = this.cbpService.selectedElement.parentID;
    if (obj?.dgType == DgTypes.Form) {
      obj['subTabe'] = true;
    }
    item.children.push(obj);
    this.cbpService.selectedElement = obj;
    if (this.cbpService.coverPageViewEnable) {
      this.cbpService.selectedElement['coverPageTable'] = true;
    }
    this.updateView(this.cbpService.selectedElement);
    this.controlService.setSelectItem(this.cbpService.selectedElement);
  }

  updateView(element: any) {
    if (element) {
      let table = this._buildUtil.getElementByDgUniqueID(element?.parentTableDgUniqueID, this.cbpService.cbpJson);
      if (table) {
        this.cbpService.setUserUpdateInfo(table);
        this.controlService.hideTrackUi({ 'trackUiChange': true });
      }
    }
  }

  defaultTableAddInfo(obj: any, table: any, isObjTable: boolean) {
    obj['columnSize'] = this.tableService.numberofColumns;
    obj['rowSize'] = this.tableService.numberofRows;
    obj['dgUniqueID'] = this._buildUtil.getUniqueIdIndex();
    obj = this.cbpService.setBgDgUniqueID(obj);
    if (this.tableService.selectedRow.length > 0) {
      obj['row'] = this.tableService.selectedRow[0].row + 1;
      obj['column'] = this.tableService.selectedRow[0].col + 1;
    }
    obj['parentDgUniqueID'] = this.cbpService.selectedElement.dgUniqueID;
    obj['parentDgUniqueID'] = obj['parentDgUniqueID']?.toString();
    this.cbpService.selectedUniqueId = obj['dgUniqueID'];
    obj['parentID'] = table.dgSequenceNumber;
    obj['parentTableDgUniqueID'] = this.cbpService.selectedElement.dgUniqueID;
    obj['parentTableDgUniqueID'] = obj['parentTableDgUniqueID']?.toString();
    if (this.cbpService.selectedElement.leftdualchild || this.cbpService.selectedElement.rightdualchild) {
      this.controlService.setDualStep(this.cbpService.selectedElement, obj);
    }
    obj['level'] = table['level'] + 1;
    obj['state'] = { hidden: true };
    if (isObjTable) { table = obj; }
    //this.auditService.createEntry({}, JSON.parse(JSON.stringify(table)), Actions.Insert, AuditTypes.TABLE)
    if (isObjTable) {
      obj = this.addColumnPopup(obj);
      obj = this.addRowPopup(obj);
      if (this.splitcell) {
        if (this.cbpService.selectedElement.headerTable || this.cbpService.selectedElement.footer ||
          this.cbpService.selectedElement.dgType == "Header" || this.cbpService.selectedElement.dgType == "Footer"
        ) {
          obj['withoutHeaders'] = true;
          obj['headerTable'] = true;
          obj['header'] = this.cbpService.selectedElement.dgType == "Header" || this.cbpService.selectedElement.headerTable && true;
          obj['footer'] = this.cbpService.selectedElement.dgType == "Footer" || this.cbpService.selectedElement.footer && true
        }
        if (this.tableService.splitClicked) {
          this.auditService.createEntry({}, JSON.parse(JSON.stringify(obj)), Actions.Insert, AuditTypes.TABLE_CELL_SPILIT);
          this.tableService.splitClicked = false;
        } else {
          this.auditService.createEntry({}, JSON.parse(JSON.stringify(obj)), Actions.Insert, AuditTypes.TABLE)
        }

      }
      return obj;
    } else { return obj; }
  }
  addColumnPopup(table: any) {
    if (this.cbpService.selectedElement.referenceOnly) {
      let obj = this._buildUtil.createElement(DgTypes.LabelDataEntry);
      obj['isTableDataEntry'] = true;
      obj = { ...obj, ...new DataEntryPosition() };
      table = this.columnStep(obj, 0, table);
    } else {
      table = this.columnStep('', 0, table);
    }
    return table;
  }
  columnStep(obj: any, rowno: any, table: any) {
    if (table.calstable) {
      for (let i = 1; i <= this.tableService.numberofColumns; i++) {
        const objcol = this.setTableHead({}, obj, i);
        table.calstable[0].table.tgroup.thead.push(objcol);
        obj = this.setTableObj(obj, table, i);
        let objvalue = obj === '' ? { children: [] } : { children: [obj] };
        table.calstable[0].table.tgroup.tbody[0].row[rowno].entry.push(JSON.parse(JSON.stringify(objvalue)));
      }
      table.maxTableColumn = this.tableService.numberofColumns;
    }
    return table;
  }
  addRowPopup(table: any) {
    if (this.cbpService.selectedElement.referenceOnly) {
      let obj = this._buildUtil.createElement(DgTypes.LabelDataEntry);
      obj['isTableDataEntry'] = true;
      obj = { ...obj, ...new DataEntryPosition() };
      table = this.rowStep(obj, table);
    } else {
      table = this.rowStep('', table);
    }
    return table;
  }
  getTableDataEntryObj() {
    let obj = this._buildUtil.createElement(DgTypes.LabelDataEntry);
    obj['isTableDataEntry'] = true;
    obj = { ...obj, ...new DataEntryPosition() };
    return obj;
  }

  rowStep(obj: any, table: any) {
    const entry = [];
    if (table.calstable) {
      const col = table.calstable[0].table.tgroup.thead.length;
      for (let i = 0; i < col; i++) {
        obj = this.setTableObj(obj, table, i)
        let objvalue = obj === '' ? { children: [] } : { children: [obj] };
        entry.push(JSON.parse(JSON.stringify(objvalue)));
      }
      for (let j = 1; j < this.tableService.numberofRows; j++) {
        const entryObj = this.returnEntry(JSON.parse(JSON.stringify(entry)), j);
        table.calstable[0].table.tgroup.tbody[0].row.push({ entry: entryObj });
      }

    }
    return table;
  }
  returnEntry(entry: any, j: any) {
    entry.forEach((item: any) => {
      item.children.forEach((element: any) => {
        element.dgUniqueID = this._buildUtil.getUniqueIdIndex();
        element = this.cbpService.setBgDgUniqueID(element);
        element['row'] = j + 1;
      });
      item = JSON.parse(JSON.stringify(item));
    })
    return entry;
  }
  checkNumber(value: number) {
    if (value === 0) { this.notifier.notify('warning', AlertMessages.CheckNumber); }
  }

  setTableHead(objcol: any, obj: any, i: number) {
    objcol = new TableProperties();

    objcol.title += ++this.tableService.columeNameInc;

    objcol.position = i;
    objcol.fieldName += ++this.tableService.columnfieldNamePosition;
    if (this.tableService.splitCell) {
      objcol.title = objcol.title + (++this.tableService.columeNameInc);
      this.cbpService.selectedElement.maxTableColumn = this.tableService.columeNameInc;
      if (!this.cbpService.selectedElement.coverPageTable) {
        objcol.fieldName = objcol.fieldName + this.cbpService.selectedElement.dgUniqueID;
      }
    }
    const size = ((100 / (this.tableService.numberofColumns)).toFixed(2)).toString().substring(0, 5);
    objcol.columnSize = Number(size);
    if (this.cbpService.selectedElement.referenceOnly) {
      objcol.dgType = obj.dgType;
      objcol.dgTypeObj = this._buildUtil.createElement(obj.dgType);
    }
    return objcol;
  }

  setTableObj(obj: any, table: any, i: any) {
    if (obj != '') {
      obj['dgFieldName'] = '';
      obj['dgUniqueID'] = this._buildUtil.getUniqueIdIndex();
      obj = this.cbpService.setBgDgUniqueID(obj);
      obj['parentID'] = table.dgUniqueID;
      obj['parentDgUniqueID'] = table.dgUniqueID;
      obj['parentDgUniqueID'] = obj['parentDgUniqueID']?.toString();
      obj['column'] = i;
      obj['row'] = 1;
      obj['fieldName'] = obj.dgType;
      obj = this.tableService.setDataEntryFieldName(obj, { 'row': 1, 'col': i, 'fieldName': obj['fieldName'] });
      obj = JSON.parse(JSON.stringify(obj));
    }
    return obj;
  }
  ngOnDestroy(): void {
    this.hide();
  }
  hide() {
    this.tableService.isTableAdded = false;
    this.tableService.splitCell = false;
    this.tableService.splitcellMerge = false;
    this.sharedService.closeModalPopup('tableAdd');
  }
  showErrorMsg(dgType: any, dgTypeMsg: any) {
    this.setErrorMesg(dgTypeMsg, dgType, true)
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
}
