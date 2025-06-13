import { CdkDragDrop, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { AlertMessages, CbpSharedService, DgTypes } from 'cbp-shared';
import { Actions, AuditTypes, TableProperties } from '../../../models';
import { AuditService } from '../../../services/audit.service';
import { BuilderService } from '../../../services/builder.service';
import { CbpService } from '../../../services/cbp.service';
import { ControlService } from '../../../services/control.service';
import { TableService } from '../../../shared/services/table.service';
import { BuilderUtil } from '../../../util/builder-util';

@Component({
  selector: 'app-tableproperties',
  templateUrl: './tableproperties.component.html',
  styleUrls: ['./tableproperties.component.css']
})
export class TablepropertiesComponent implements OnInit, OnDestroy {
  element: any;
  DgTypes: typeof DgTypes = DgTypes;
  tableProperty = new TableProperties();
  tableUpdatePosition: any;
  tableSession: any;
  currentTabel: any;
  selectedFieldTitle: any;
  isSizeChange!: any;
  isValueEditTile = false;
  isEditFieldname = false;
  isSizeEdit = false;
  isEditDgTye = false;
  referenceSelectedElement: any;
  ChangeTableProperty = false;
  changeTablePropertyValue = false;
  changeTableValue = false;
  // dragging = false;
  dataEntries = ['TextDataEntry', 'TextAreaDataEntry', 'NumericDataEntry', 'DateDataEntry', 'CheckboxDataEntry', 'DropDataEntry',
    'BooleanDataEntry', 'Para', 'LabelDataEntry'];
  colSize: any;
  //table
  isHeader: any;
  //Audit and Undo changes
  tablePropertySnapchat!: TableProperties;
  tableSnapChat: any;
  toggleCheck = false;
  colorhead = '#ccc';
  tableTempObj: any;
  minimum!: string;
  maximum!: string;
  footerList = [{ type: 'Reset' }, { type: 'Ok' }, { type: 'Cancel' }]
  footerList2 = [{ type: 'Yes' }, { type: 'No' }];
  stepTitle = '';
  constructor(public cbpService: CbpService, private buildUtil: BuilderUtil, public notifier: NotifierService, public auditService: AuditService,
    public tableService: TableService, public builderService: BuilderService, private cdref: ChangeDetectorRef, private controlService: ControlService,
    public sharedService: CbpSharedService) { }

  ngOnInit() {
    if (this.cbpService.isBackGroundDocument) {
      this.dataEntries = ['Para', 'LabelDataEntry'];
    }
    this.tableSession = { obj: JSON.parse(JSON.stringify(this.cbpService.selectedElement.calstable[0].table.tgroup.thead)) } as const;
    this.cbpService.selectedElement?.calstable[0]?.table?.tgroup?.thead.forEach((item: any, index: any) => {
      item.position = index + 1;
      if (this.cbpService.selectedElement?.coverPageTable && !item.title) {
        item.title = 'Column' + item.position;
      }
    })
    this.currentTabel = JSON.parse(JSON.stringify(this.cbpService.selectedElement.calstable[0].table));
    this.sharedService.openModalPopup('tablePropertie');
    this.element = this.buildUtil.getElementByNumber(this.cbpService.selectedElement.parentID, this.cbpService.cbpJson.section);
    this.columnPropertyData(this.cbpService.selectedElement);
    this.tableSnapChat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
    this.tableService.isSizeChange = false;
    this.referenceSelectedElement = JSON.parse(JSON.stringify(this.tableProperty));
    if (this.element?.dgType === DgTypes.StepInfo) {
      this.cbpService.selectedElement.referenceOnly = true;
    }
    this.tableTempObj = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
    //console.log("good",this.cbpService.selectedElement.withoutHeaders)
    this.isHeader = this.cbpService.selectedElement.withoutHeaders;
    this.stepTitle = this.element?.text ? this.element?.text : 'Header Footer';
    // console.log("tabledata",this.cbpService.selectedElement?.calstable[0]?.table?.tgroup?.thead)
  }
  columnPropertyData(selectedElement: any) {
    selectedElement.columnProperties = [];
    const heads = this.cbpService.selectedElement.calstable[0].table.tgroup.thead;
    if (this.tableService.tableColumnProperty === true) {
      this.setTableProperty(heads[heads.length - 1]);
    } else {
      if (this.tableService.selectedRow.length > 0) {
        this.setTableProperty(heads[this.tableService.selectedRow[0].col]);
      } else { this.setTableProperty(heads[0]); }
    }
  }
  setTableProperty(item: any) {
    this.tableProperty = item;
    this.tableUpdatePosition = item.position;
  }
  updateTheColumnInfo(obj: any) {
    try {
      let allRows = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row;
      for (let i = 0; i < allRows.length; i++) { // rows count
        const entryObj = allRows[i].entry;  // single row
        const childernLength = entryObj[this.tableUpdatePosition - 1].children.length
        if (childernLength > 1) {
        } else {
          // cover page attribute enable code 
          const attributesList: any = entryObj[this.tableUpdatePosition - 1].children.filter((child: any) => child?.property);
          if (this.tableService.isAttributeDisable.length > 0 && attributesList?.length > 0) {
            attributesList.forEach((child: any) => {
              const property = child.property;
              if (this.tableService.isAttributeDisable.includes(property)) {
                const index = this.tableService.isAttributeDisable.indexOf(property);
                if (index !== -1) {
                  this.tableService.isAttributeDisable.splice(index, 1);
                }
              }
            });
          }
          this.setTableItem(obj, entryObj, i, 0);
        }
      }
    } catch (error) { console.error(error); }
  }

  saveColumnInfo() {
    const heads = this.cbpService.selectedElement.calstable[0].table.tgroup.thead;
    heads.forEach((item: any, i: any) => {
      this.setTableProperty(item);
      let obj = undefined;
      if (this.tableService.isSizeChange && item.dgTypeObj !== undefined) {
        obj = item.dgTypeObj !== undefined ? item.dgTypeObj : this.buildUtil.createElement(item.dgType);
        obj['isTableDataEntry'] = true;
        obj = this.cbpService.setParentStepInfo(obj, this.cbpService.selectedElement);
        this.updateTheColumnInfo(obj);
      }
      else if (item.dgType !== undefined && !this.tableService.isSizeChange) {
        obj = item.dgTypeObj !== undefined ? item.dgTypeObj : this.buildUtil.createElement(item.dgType);
        obj['isTableDataEntry'] = true;
        obj = this.cbpService.setParentStepInfo(obj, this.cbpService.selectedElement);
        this.updateTheColumnInfo(obj);
      }
    });
  }

  setTableItem(obj: any, entryObj: any, i: any, pos: any) {
    if (obj !== undefined) {
      obj['dgUniqueID'] = this.buildUtil.getUniqueIdIndex();
      obj = this.cbpService.setBgDgUniqueID(obj);
      // this.buildUtil.uniqueIdIndex = obj['dgUniqueID'];
      obj = this.tableService.setDataEntryFieldName(obj, { 'row': i + 1, 'col': this.tableUpdatePosition, 'fieldName': this.tableProperty.fieldName });
      obj = JSON.parse(JSON.stringify(obj));
      if (entryObj[this.tableUpdatePosition - 1].children.length > 0) {
        if ((entryObj[this.tableUpdatePosition - 1].children[pos].dgType === DgTypes.LabelDataEntry &&
          entryObj[this.tableUpdatePosition - 1].children[pos].prompt === '') ||
          (entryObj[this.tableUpdatePosition - 1].children[pos].dgType === DgTypes.Para &&
            entryObj[this.tableUpdatePosition - 1].children[pos].text === '')) {
          let item = JSON.parse(JSON.stringify(obj));
          item['dgUniqueID'] = this.buildUtil.getUniqueIdIndex();
          item = this.cbpService.setBgDgUniqueID(item);
          item = this.setItemValue(entryObj, item, pos);
          entryObj[this.tableUpdatePosition - 1].children[pos] = item;
        } else {
          let item = JSON.parse(JSON.stringify(obj));
          item['dgUniqueID'] = this.buildUtil.getUniqueIdIndex();
          item = this.cbpService.setBgDgUniqueID(item);
          item = this.setItemValue(entryObj, item, pos);
          entryObj[this.tableUpdatePosition - 1].children[pos] = item;
        }
      } else {
        let item = JSON.parse(JSON.stringify(obj));
        item['dgUniqueID'] = this.buildUtil.getUniqueIdIndex();
        item = this.cbpService.setBgDgUniqueID(item);
        item = this.setItemValue(entryObj, item, pos);
        entryObj[this.tableUpdatePosition - 1].children[0] = item;
      }
    } else {
      entryObj[this.tableUpdatePosition - 1].children[pos] = {};
      this.tableService.isSizeChange = false;
    }
    if (this.cbpService.documentSelected && this.cbpService.coverPage) {
      entryObj[this.tableUpdatePosition - 1].children[pos]['coverType'] = true;
    }
    return entryObj;
  }
  setItemValue(entryObj: any, item: any, pos: any) {
    if (entryObj[this.tableUpdatePosition - 1].children[pos]?.text) {
      item['text'] = entryObj[this.tableUpdatePosition - 1].children[pos]?.text;
    }
    if (entryObj[this.tableUpdatePosition - 1].children[pos]?.prompt) {
      item['prompt'] = entryObj[this.tableUpdatePosition - 1].children[pos]?.prompt;
    }
    return item;
  }
  setDgType(event: any) {
    this.changeTableValue = true;
    this.tableProperty.dgType = event;
    let isDrop = false;
    if (event === DgTypes.DropDataEntry) { isDrop = true; event = DgTypes.TextDataEntry; }
    this.tableProperty['dgTypeObj'] = this.buildUtil.createElement(event);
    if (isDrop) { this.tableProperty['dgTypeObj'].dataType = 'Dropdown'; }
    this.cbpService.selectedElement = this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
    this.isEditDgTye = true
  }
  setProperties(values: any) {
    this.tableProperty['dgTypeObj'].choice = values;
  }
  setTableName() {
    return this.cbpService.selectedElement.tableName ? this.cbpService.selectedElement.tableName : 'defaultTable';
  }
  StoreColumnSize(size: any) {
    this.colSize = '';
    this.colSize = size;
    this.isSizeEdit = true;
  }
  setMinMaxValues(value: any) {
    if (this.tableProperty.columnSize > 100 || this.tableProperty.columnSize < 1) {
      this.notifier.notify('error', 'Column length should not between 1 and 100');
    }
  }

  updateColumnSize() {
    let colCounts = 0;
    let colCount = 0;
    var columnAllSize = 0;
    this.cbpService.selectedElement.calstable[0].table.tgroup.thead.forEach((item: any) => {
      if (this.tableProperty.position != item.position) {
        columnAllSize += item.columnSize;
      }
    });

    // const length = this.tableProperty.columnSize + columnAllSize;
    //  if(length > 100){

    //   this.notifier.notify('error', 'Entered value exceeding column size 100% Please enter lesser value');
    //  }
    //   colCounts = preCol;
    //   this.tableProperty.columnSize = preCol2;


    // colCount = length < 100 ? 100 - length :  length - 100;
    // let value =  this.cbpService.selectedElement.calstable[0].table.tgroup.thead.length;
    // const thaed = this.tableProperty.position === value ? 1 : this.tableProperty.position + 1;
    // const preCol = this.cbpService.selectedElement.calstable[0].table.tgroup.thead[thaed-1].columnSize;
    // const preCol2 = this.cbpService.selectedElement.calstable[0].table.tgroup.thead[thaed].columnSize;
    // colCounts = length < 100 ? preCol + colCount : preCol - colCount;
    // if(colCounts <= 0 || this.tableProperty.columnSize > 100 || this.tableProperty.columnSize < 0){
    //   this.notifier.notify('error', 'Entered value exceeding column size 100% Please enter lesser value');
    //   colCounts = preCol;
    //   this.tableProperty.columnSize = preCol2;
    // }
    //   this.cbpService.selectedElement.calstable[0].table.tgroup.thead[thaed-1].columnSize = colCounts;
    this.cbpService.isViewUpdated = true;
    this.isSizeEdit = true;
    return true;
  }
  updateEvents(type: any) {
    type === 'table' ? this.setValues(true, false) : this.setValues(false, true);
  }
  setValues(table: any, column: any) {
    this.tableService.tableNameProperty = table;
    this.tableService.tableColumnProperty = column;
  }
  tableInfo() {
    this.notifier.hideAll();
    this.notifier.notify('success', 'Table Change updated ');
    this.hide();
  }

  storeTitle(name: any) {
    this.selectedFieldTitle = name;
    this.isValueEditTile = true;
  }
  storeFieldName(name: any) {
    this.tableService.selectedFieldName = name;
    this.isEditFieldname = true;
  }
  columnNameExistOrNot(name: any) {
    if (name !== '') {
      const duplicate = this.cbpService.selectedElement.calstable[0].table.tgroup.thead.filter((item: any) => item.title === name);
      if (duplicate.length > 1) {
        this.notifier.hideAll();
        this.notifier.notify('error', 'Title Name already exist');
        this.tableProperty.title = this.selectedFieldTitle;
      }
    }
  }

  columnnSizePopUp() {
    let colCounts = 0;
    let colCount = 0;
    var columnAllSize = 0;
    this.cbpService.selectedElement.calstable[0].table.tgroup.thead.forEach((item: any) => {
      if (this.tableProperty.position != item.position) {
        columnAllSize += parseInt(item.columnSize);
      }
      if (!item['dgUniqueID']) {
        item['dgUniqueID'] = this.buildUtil.getUniqueIdIndex();
        item = this.cbpService.setBgDgUniqueID(item);
      }
    });
    const length = this.tableProperty.columnSize + columnAllSize;
    if (length > 100) {

      this.notifier.notify('error', 'Entered value exceeding column size 100% Please enter lesser value');
    }
    else {
      this.tableInfoChanges();
    }
  }

  tableProChanges() {
    let count = 0;
    try {
      let allRows = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row;
      for (let i = 0; i < allRows.length; i++) { // rows count
        const entryObj = allRows[i].entry;  // single row
        const childernLength = entryObj[this.tableUpdatePosition - 1].children.length
        if (childernLength > 0) {
          count++;
        }
      }
    } catch (error) { console.error(error); }
    if (count > 0) {
      this.ChangeTableProperty = true;
    } else {
      this.columnnSizePopUp();
    }
    this.showlableDisable();
    this.cdref.detectChanges();
  }

  showlableDisable() {
    // if (this.cbpService.tableDataEntrySelected?.showLabel) {
    //   this.cbpService.tableDataEntrySelected.showLabel = false
    // }
  }


  tableInfoChanges() {
    const inputBox = document.getElementById('inputBox') as HTMLInputElement;
    if (inputBox) {
      this.referenceSelectedElement.columnSize = inputBox.value;
      this.tableProperty.columnSize = this.referenceSelectedElement.columnSize;
    }
    const tableJson = this.cbpService.selectedElement.calstable[0].table.tgroup.thead;
    let itemObj = {
      colorhead: this.cbpService.selectedElement.colorhead,
      referenceOnly: this.cbpService.selectedElement.referenceOnly,
      withoutHeaders: this.cbpService.selectedElement.withoutHeaders,
      withoutLines: this.cbpService.selectedElement.withoutLines,
    }

    const similerObjects = this.tableService.objectsSameEqual(tableJson, this.tableSession.obj);
    if (!similerObjects || this.isTableInfoUpdated()) {
      this.saveColumnInfo();
      this.checkProperties();
      this.tableInfo();
      // this.controlService.setTableUpdate({ table: this.cbpService.selectedElement, updateObj:itemObj});
    } else { this.hide(); }
    this.buildUtil.setDgUniqueIdsForTable(this.cbpService.selectedElement);
    this.cbpService.isViewUpdated = true;
    this.cbpService.detectWholePage = true;
    this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }

  subtabledeleteDataEelementCoverPage(item: any, element: any) {
    if (element.calstable) {
      this.deleteCoverpageSubTable(element.calstable[0], item);
    }
    else {
      this.deleteCoverpageSubTable(element, item);
    }
  }
  subtabledeleteDataEelement(item: any, element: { children: string | any[]; }) {
    if (element) {
      for (let j = 0; j < element.children.length; j++) {
        let childata = element.children[j];
        this.deleteSubTable(childata, item);
      }
    }
  }
  deleteSubTable(childata: any, item: any) {
    let entryObj, object
    if (childata.calstable) {
      let rowdata = childata.calstable[0].table.tgroup.tbody[0].row;
      for (let l = 0; l < rowdata.length; l++) {
        entryObj = rowdata[l].entry;
        for (let m = 0; m < entryObj.length; m++) {
          if (entryObj[m]) {
            object = childata.calstable[0].table.tgroup.tbody[0].row[l].entry[m];
            object.children = object.children.filter((i: { dgUniqueID: any; }) => i.dgUniqueID != item.dgUniqueID);
            for (let k = 0; k < object.children.length; k++) {
              if (object.children[k].dgType === DgTypes.Table) {
                this.deleteSubTable(object.children[k], item);
              }
            }
          }
        }
      }
      return object;
    }
  }
  deleteCoverpageSubTable(childata: any, item: any) {
    let entryObj, object
    if (childata) {
      let rowdata = childata.table.tgroup.tbody[0].row;
      for (let l = 0; l < rowdata.length; l++) {
        entryObj = rowdata[l].entry;
        for (let m = 0; m < entryObj.length; m++) {
          if (entryObj[m]) {
            object = childata.table.tgroup.tbody[0].row[l].entry[m];
            object.children = object.children.filter((i: { dgUniqueID: any; }) => i.dgUniqueID != item.dgUniqueID);
            for (let k = 0; k < object.children.length; k++) {
              if (object.children[k].dgType === DgTypes.Table) {
                this.deleteCoverpageSubTable(object.children[k], item);
              }
            }
          }
        }
      }
      return object;
    }
  }

  async cancelAddedTable() {
    if (!this.tableService.toolBarTableProperties) {
      if (this.tableService.isAddColumn == true) {
        const { value: userConfirms, dismiss } = await this.cbpService.showMoreButtonsSwal('Do you want to Discard the table Changes ?', 'warning', 'Yes', 'No', 'Cancel');
        if (!dismiss && userConfirms) {
          if (this.tableService.columnPosition === 'right') {
            this.tableService.deleteSelectedColumnItem(this.tableProperty.position);
          }
          else if (this.tableService.columnPosition === 'left') {
            this.tableService.deleteSelectedColumnItem(1);
          }
          this.tableInfoChanges();
        } else if (dismiss === 'cancel') { } else {
          this.cbpService.selectedElement.calstable[0].table = this.currentTabel; this.hide();
          this.cbpService.isViewUpdated = true;
        }
        return false;
      }
      const { value: userConfirms, dismiss } = await this.cbpService.showSwal(AlertMessages.cancelTable, 'warning', 'Yes');

      if (userConfirms) {
        if (this.tableService.selectedTable['header']) {
          let element = JSON.parse(JSON.stringify(this.tableService.selectedTable))
          this.auditService.createEntry({}, element, Actions.Delete, AuditTypes.TABLE_DELETE_HEADER);
          this.auditService.elementsRestoreHeader.push(element);
          this.cbpService.cbpJson.documentInfo[0].header.children = [];
          this.cbpService.selectedHeaderElement = this.cbpService.cbpJson.documentInfo[0].header;
          this.cbpService.selectedElement = this.cbpService.cbpJson.documentInfo[0].header;
        } else if (this.tableService.selectedTable['footer']) {
          let element = JSON.parse(JSON.stringify(this.tableService.selectedTable))
          this.auditService.createEntry({}, element, Actions.Delete, AuditTypes.TABLE_DELETE_FOOTER);
          this.auditService.elementsRestoreHeader.push(element);
          this.cbpService.cbpJson.documentInfo[0].footer.children = [];
          this.cbpService.selectedHeaderElement = this.cbpService.cbpJson.documentInfo[0].footer;
          this.cbpService.selectedElement = this.cbpService.cbpJson.documentInfo[0].footer;
        } else {
          if (this.cbpService.selectedElement['subTabe']) {
            if (this.cbpService.selectedElement.dualStep) {
              let selectTable = JSON.parse(JSON.stringify(this.tableService.selectedTable));
              let dualstep = JSON.parse(JSON.stringify(this.buildUtil.getElementByDgUniqueID(this.tableService.selectedTable.parentDgUniqId, this.cbpService.cbpJson.section)));
              //this.subtabledeleteDualStep(this.cbpService.selectedElement, dualstep);
              this.auditService.createEntry({}, selectTable, Actions.Delete, AuditTypes.TABLE_DELETE_SUB_DUAL);
              this.auditService.elementsRestoreSnapChats.push(selectTable);
              this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
              this.controlService.hideTrackUi({ 'trackUiChange': true });
            }
            else {
              let selectTable = JSON.parse(JSON.stringify(this.tableService.selectedTable))

              if (this.cbpService.editCoverPage) {
                let parentId = !(this.tableService.selectedTable.parentDgUniqID) ? "0" : this.tableService.selectedTable.parentDgUniqID
                const element = this.buildUtil.getElementByDgUniqueID(parentId, this.cbpService.cbpJson.documentInfo[0]);
                this.subtabledeleteDataEelementCoverPage(this.cbpService.selectedElement, element);
                let table = this.buildUtil.getElementByDgUniqueID(this.tableService.selectedTable.parentDgUniqId, this.cbpService.cbpJson.documentInfo[0]);
                this.controlService.setSelectItem(table);
              }
              else {
                const element = this.buildUtil.getElementByNumber(this.tableService.selectedTable.parentID, this.cbpService.cbpJson.section);
                this.subtabledeleteDataEelement(this.cbpService.selectedElement, element);
                let table = this.buildUtil.getElementByDgUniqueID(this.tableService.selectedTable.parentDgUniqId, this.cbpService.cbpJson.section);
                this.controlService.setSelectItem(table);
              }
              this.auditService.createEntry({}, selectTable, Actions.Delete, AuditTypes.TABLE_DELETE_SUB_WINDOW);
              this.auditService.elementsRestoreSnapChats.push(selectTable);
              this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
              this.controlService.hideTrackUi({ 'trackUiChange': true });
            }
          }
          else {
            let element = JSON.parse(JSON.stringify(this.tableService.selectedTable));
            if (element.dualStep) {
              if (await this.cbpService.deleteElement(this.cbpService.selectedElement, '', '')) {
                this.auditService.createEntry({}, element, Actions.Delete, AuditTypes.TABLE_DELETE_DUAL);
                this.auditService.elementsRestoreSnapChats.push(element);
                this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
                this.controlService.hideTrackUi({ 'trackUiChange': true });
              }
            }
            else {
              let parent;
              if (element.parentID) {
                parent = JSON.parse(JSON.stringify(this.buildUtil.getElementByNumber(element.parentID, this.cbpService.cbpJson.section)))
              } else {
                // console.error('parent ID'+ element.parentID);
                parent = JSON.parse(JSON.stringify(this.cbpService.cbpJson.section));
              }
              if (await this.cbpService.deleteElement(this.cbpService.selectedElement, '', '')) {
                this.auditService.createEntry({}, element, Actions.Delete, AuditTypes.TABLE_DELETE_WINDOW);
                this.auditService.elementsRestoreSnapChats.push(element);
                this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
                this.controlService.hideTrackUi({ 'trackUiChange': true });
              }
            }
          }
        }
        this.cbpService.isViewUpdated = true;
        this.cbpService.detectWholePage = true;
        this.hide();
      }
    } else {
      const { value: userConfirms, dismiss } =
        await this.cbpService.showSwal(AlertMessages.cancelTableChange, 'warning', 'Yes');
      if (userConfirms) {
        this.tableService.toolBarTableProperties = false;
        this.cbpService.isViewUpdated = true;
        this.cbpService.detectWholePage = true;
        this.hide();
      }
    }
  }

  async checkSaveInfo() {
    if (this.tableService.isAddColumn) {
      if (this.tableService.columnPosition === 'right') {
        if (this.tableService.selectedRow.length === 1) {
          this.tableService.deleteSelectedColumnItem(this.tableService.SelectedRowIndex + 1);
        }
        else {
          this.tableService.deleteSelectedColumnItem(this.tableProperty.position);
        }
      }
      else if (this.tableService.columnPosition === 'left') {
        if (this.tableService.selectedRow.length === 1) {
          this.tableService.deleteSelectedColumnItem(this.tableService.SelectedRowIndex);
        }
        else {
          this.tableService.deleteSelectedColumnItem(1);
        }
      }
      this.select();
    }
    this.tableService.isAddColumn = false;
    const tableJson = this.cbpService.selectedElement.calstable[0].table.tgroup.thead;
    const similerObjects = this.tableService.objectsSameEqual(tableJson, this.tableSession.obj);
    if (!similerObjects || this.isTableInfoUpdated()) {
      const { value: userConfirms, dismiss } = await this.cbpService.showMoreButtonsSwal('Do you want to Discard the table Changes ?', 'warning', 'Yes', 'No', 'Cancel');
      if (!dismiss && userConfirms) {
        this.tableInfoChanges();
        //  this.reset("Yes/No")
        // this.hide()
        // this.controlService.setTableUpdate(this.cbpService.selectedElement);
      } else if (dismiss === 'cancel') { } else {
        this.cbpService.selectedElement.calstable[0].table = this.currentTabel; this.hide();
        this.cbpService.isViewUpdated = true;
      }
    } else {
      this.hide();
      this.cbpService.isViewUpdated = true;
    }
  }
  checkProperties() {
    const tableObj = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row;
    for (let k = 0; k < tableObj.length; k++) {
      if (tableObj[k]) {
        const entryObj = tableObj[k].entry;
        if (entryObj) {
          for (let l = 0; l < entryObj.length; l++) {
            const object = entryObj[l].children;
            for (let m = 0; m < object.length; m++) {
              let childObj = this.cbpService.selectedElement.calstable[0].table.tgroup?.tbody[0]?.row[k]?.entry[l]?.children[m]
              if (childObj && typeof childObj == 'object' && Object.keys(childObj).length != 0 && childObj?.hasOwnProperty('dgType')) {
                this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[k].entry[l].children[m].showLabel =
                  object[m].showLabel;
                this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[k].entry[l].children[m].dataEntrySize =
                  object[m].dataEntrySize;
                this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[k].entry[l].children[m].required =
                  object[m].required;
              }
            }
          }
        }
      }
    }
  }
  isTableInfoUpdated() {
    if (this.cbpService.selectedElement.colorhead !== this.tableTempObj.colorhead ||
      this.cbpService.selectedElement.withoutLines !== this.tableTempObj.withoutLines ||
      this.cbpService.selectedElement.withoutHeaders !== this.tableTempObj.withoutHeaders ||
      this.cbpService.selectedElement.referenceOnly !== this.tableTempObj.referenceOnly
    ) {
      this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
      this.controlService.hideTrackUi({ 'trackUiChange': true });
      return true;
    } else {
      return false;
    }
  }
  selectFirstCol(i: any) {
    this.setTableProperty(this.cbpService.selectedElement.calstable[0].table.tgroup.thead[i]);
  }
  onDrop(event: CdkDragDrop<TableProperties[]>) {
    moveItemInArray(this.cbpService.selectedElement.calstable[0].table.tgroup.thead, event.previousIndex, event.currentIndex);
    this.tableService.setTheadPosition();
    this.selectFirstCol(event.currentIndex);
    this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }
  public onDragStart(event: CdkDragStart<TableProperties[]>) {
    // this.dragging = true;
    // console.log(event);
  }
  checkField() {
    return this.cbpService.selectedElement.tableName === '' ? true : false
  }
  ngOnDestroy(): void {
    this.hide();
  }
  hide() {
    this.tableService.isTableProperties = false;
    this.tableService.tableNameProperty = true;
    this.tableService.tableColumnProperty = false;
    this.cbpService.tableDataEntrySelected = undefined;
    this.sharedService.closeModalPopup('tablePropertie');
  }
  reset(e: any) {
    this.cbpService.selectedElement.tableName = this.tableSnapChat.tableName;
    if (this.isValueEditTile) {
      this.tableProperty.title = this.selectedFieldTitle;
      this.isValueEditTile = false;
    }
    if (this.isEditFieldname) {
      this.tableProperty.fieldName = this.tableService.selectedFieldName;
    }
    if (this.isSizeEdit) {
      this.tableProperty.columnSize = 50;
      this.updateColumnSize();
    }
    if (this.isEditDgTye) {
      this.tableProperty.dgType = null;
    }
    if (this.tableProperty.dgType === DgTypes.TextDataEntry) {
      this.tableProperty['align'] = 'left';
      this.tableProperty.dgTypeObj.Maxsize = '';
      this.tableProperty.dgTypeObj.required = false;
    }
    if (this.tableProperty.dgType === DgTypes.NumericDataEntry) {
      this.tableProperty['align'] = 'left';
      this.tableProperty.dgTypeObj.decimal = '';
      this.tableProperty.dgTypeObj.unitsRequired = false;
      this.tableProperty.dgTypeObj.required = false;
      this.tableProperty.dgTypeObj.units = '';
      this.tableProperty.dgTypeObj.defaultValue = '';
      this.tableProperty.dgTypeObj.minimum = '';
      this.tableProperty.dgTypeObj.maximum = '';
    }
    if (this.tableProperty.dgType === DgTypes.BooleanDataEntry) {
      this.tableProperty.dgTypeObj.TrueValue = 'Yes';
      this.tableProperty.dgTypeObj.FalseValue = 'No';
      this.tableProperty.dgTypeObj.required = true;
    }
    if (this.tableProperty.dgType === DgTypes.DateDataEntry) {
      this.tableProperty.dgTypeObj.isDateDisplayOpen = true;
      this.tableProperty.dgTypeObj.isTimeDisplayOpen = false;
    }
    else {
      this.cbpService.selectedElement.captionText = '';
      this.cbpService.selectedElement.captionPosition = 'top';
      this.cbpService.selectedElement.referenceOnly = false;
      this.cbpService.selectedElement.withoutHeaders = this.isHeader;
      this.cbpService.selectedElement.withoutLines = false;
      this.cbpService.selectedElement.colorhead = '#ccc';
    }
  }

  setCaptionValue(type: any) {
    this.cbpService.selectedElement.captionPosition = type;
  }
  checkWithoutHeaders(event: any) {
    this.cbpService.selectedElement.withoutHeaders = event.target.checked;
    //this.cbpService.selectedElement.withoutLines =  event.target.checked;
  }

  addReferencetoTable(event: any) {
    if (this.tableService.referenceProperty) {
      const value = event.target.checked ? this.addLabelToTable(true) : this.addLabelToTable(false);
    } else {
      let isFalse: boolean = false;
      for (let i = 0; i < this.cbpService.selectedElement.rowSize; i++) {
        for (let j = 0; j < this.cbpService.selectedElement.columnSize; j++) {
          const dataEntries = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[i].entry[j].children.filter((item: any) => this.tableService.checkTableDataEntries(item));
          if (dataEntries.length > 0) {
            isFalse = true;
            break;
          }
        }
      }
      if (isFalse) {
        this.cbpService.selectedElement.referenceOnly = false;
        event.target.checked = false;
        this.cbpService.showSwalDeactive(AlertMessages.ReferenceDataEntryTable, 'warning', 'OK');
      }
    }
  }

  addLabelToTable(isReference: boolean) {
    for (let i = 0; i < this.cbpService.selectedElement.rowSize; i++) {
      for (let j = 0; j < this.cbpService.selectedElement.columnSize; j++) {
        if (isReference) {
          const obj = this.retrieveObj(j, i);
          this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[i].entry[j].children.push(JSON.parse(JSON.stringify(obj)));
        } else {
          this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[i].entry[j].children = [];
        }
      }
    }
  }

  retrieveObj(i: any, j: any) {
    let obj = this.buildUtil.createElement(DgTypes.LabelDataEntry);
    obj['isTableDataEntry'] = true;
    obj['dgFieldName'] = '';
    obj['dgUniqueID'] = this.buildUtil.getUniqueIdIndex();
    obj = this.cbpService.setBgDgUniqueID(obj);
    // this.buildUtil.uniqueIdIndex = obj['dgUniqueID'];
    obj['parentID'] = this.cbpService.selectedElement.parentID;
    obj['parentDgUniqID'] = this.cbpService.selectedElement.dgUniqueID;
    obj['column'] = i;
    obj['row'] = j;
    return obj;
  }
  select() {
    let length = this.cbpService.selectedElement?.calstable[0]?.table?.tgroup?.thead.length;
    this.tableProperty = this.cbpService.selectedElement?.calstable[0]?.table?.tgroup?.thead[length - 1];
  }
  selectMinimumDate(event: any) {
    const selectedMinimum = event.target.value;
    if (selectedMinimum > this.tableProperty.dgTypeObj.maximum) {
      this.tableProperty.dgTypeObj.minimum = selectedMinimum;
    }
  }

  selectMaximumDate(event: any) {
    const selectedMaximum = event.target.value;
    if (selectedMaximum < this.tableProperty.dgTypeObj.minimum) {
      this.tableProperty.dgTypeObj.maximum = selectedMaximum;
    }
  }
  checkMaxValue(val: any) {
    if (val.maximum != null && val.minimum == null) {
      this.showErrorMsg(DgTypes.ErrorMsg, 'Please Enter Minimum value');

    }
    if (val.maximum != null && val.minimum != null) {
      if (val.maximum == 0 && val.minimum == 1) {
        this.showErrorMsg(DgTypes.ErrorMsg, 'Max value should be greater than Min');
        this.tableProperty.dgTypeObj.maximum = null;
        this.tableProperty.dgTypeObj.minimum = null;
      }
      else if ((val.maximum) < (val.minimum)) {
        this.showErrorMsg(DgTypes.ErrorMsg, 'Max value should be greater than Min');
        this.tableProperty.dgTypeObj.maximum = null;
        this.tableProperty.dgTypeObj.minimum = null;

      }
    }
    if (val.minimum && val.defaultValue) {
      if (val.defaultValue >= val.minimum) {
      } else {
        this.showErrorMsg(DgTypes.ErrorMsg, 'Defalut Value should be greater than or equal to minimum');
        this.tableProperty.dgTypeObj.defaultValue = null;
      }
    }
    if (val.maximum && val.defaultValue) {
      if (val.defaultValue <= val.maximum) {
      } else {
        this.showErrorMsg(DgTypes.ErrorMsg, 'Defalut Value should be less than or equal to maximum');
        this.tableProperty.dgTypeObj.defaultValue = null;
      }
    }
  }
  showErrorMsg(dgType: any, dgTypeMsg: any) {
    this.setErrorMesg(dgTypeMsg, dgType, true)
  }

  setErrorMesg(mesg: string, type: any, popup: boolean) {
    this.cbpService.displayMsg = mesg;
    this.cbpService.errorDgType = type;
    this.cbpService.showErrorPopup = popup;
  }

}



