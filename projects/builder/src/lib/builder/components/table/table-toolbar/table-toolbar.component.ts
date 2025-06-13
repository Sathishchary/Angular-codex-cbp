import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { AlertMessages, DgTypes, ImagePath } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { Actions, AuditTypes } from '../../../models';
import { AuditService } from '../../../services/audit.service';
import { CbpService } from '../../../services/cbp.service';
import { ControlService } from '../../../services/control.service';
import { TableService } from '../../../shared/services/table.service';
import { BuilderUtil } from '../../../util/builder-util';
// @author: sathish Kotha , contact: sathishcharykotha@gmail.com

@Component({
  selector: 'app-table-toolbar',
  templateUrl: './table-toolbar.component.html',
  styleUrls: ['./table-toolbar.component.css', '../../../formbuild/formbuild.component.css']
})
export class TableToolbarComponent implements OnInit {

  DgTypes: typeof DgTypes = DgTypes;
  ImagePath: typeof ImagePath = ImagePath;
  isSearchTemplate = false;
  isSelectRow = false;
  isSelectColumn = false;
  default = 'btn btn-icon btn-outline-secondary btn-sm';
  btnClass = "btn btn-icon btn-outline-secondary btn-sm button-pad";
  tabletoolbar = '';
  btntable = '';
  public windowWidth: any;
  public windowHeight: any;
  setItemSubscription!: Subscription;
  diableTable = false;
  defaultTextAlign = 'left';
  fontNames = ['Arial', 'Calibri', 'Montserrat', 'Poppins', 'TimeNewRoman', 'Courier New'];
  setDataEntrySubscription!: Subscription;
  hideStyleIcons = false;
  constructor(public cbpService: CbpService, public tableService: TableService,
    public cdref: ChangeDetectorRef,
    public auditService: AuditService, public notifier: NotifierService,
    public _buildUtil: BuilderUtil, private controlService: ControlService) {
    this.tabletoolbar = this.default + 'tableaddcol dropdown-item pointer px-2 selectbtn';
    this.btntable = 'btn btn-icon btn-outline-secondary btn-sm buttns ToolbarBtn';
  }

  ngOnInit() {
    this.resizeWindow();
    if (this.cbpService.selectedElement?.calstable) {
      this.diableTable = this.cbpService.selectedElement?.calstable[0].table.tgroup.thead.length > 50 ? true : false;
    }

    this.tableService.undoAudit_reso.subscribe((element: any) => {
      switch (element.auditType) {
        case AuditTypes.TABLE_COLUMN_ADD:
          this.auditService.createEntry({}, element.source, Actions.Insert, AuditTypes.TABLE_COLUMN_ADD, { columnIndex: element.index })
          this.viewUpdate(element);
          break;
        case AuditTypes.TABLE_ROW_ADD:
          this.auditService.createEntry({}, element.source, Actions.Insert, AuditTypes.TABLE_ROW_ADD, { rowIndex: element.index })
          this.viewUpdate(element);
          break;
        case AuditTypes.TABLE_CELL_SPILIT:
          this.auditService.createEntry({}, element.source, Actions.Insert, AuditTypes.TABLE_CELL_SPILIT)
          this.viewUpdate(element);
          break;
        case AuditTypes.TABLE_COLUMN_DELETE:
          this.auditService.createEntry({}, element.source, Actions.Delete, AuditTypes.TABLE_COLUMN_DELETE, { columnIndex: element.index })
          this.viewUpdate(element);
          break;
        case AuditTypes.TABLE_CELL_DELETE:
          this.auditService.createEntry({}, element.source, Actions.Delete, AuditTypes.TABLE_CELL_DELETE, { columnIndex: element.index })
          break;
        case AuditTypes.TABLE_CELL_MERGE:
          this.auditService.createEntry({}, element.source, Actions.Insert, AuditTypes.TABLE_CELL_MERGE, { columnIndex: element.index })
          this.viewUpdate(element);
          break;
        case AuditTypes.TABLE_ENTRY_DELETE:
          this.auditService.createEntry({}, element.source, Actions.Delete, AuditTypes.TABLE_ENTRY_DELETE, { columnIndex: element.index })
          this.viewUpdate(element);
          break;
        case AuditTypes.TABLE_ROW_DELETE:
          this.auditService.createEntry({}, element.source, Actions.Delete, AuditTypes.TABLE_ROW_DELETE, { rowIndex: element.index })
          this.viewUpdate(element);
          break;
        case AuditTypes.TABLE_CELL_BORDER:
          this.auditService.createEntry({}, element.source, Actions.Delete, AuditTypes.TABLE_CELL_BORDER)
          this.viewUpdate(element);
          break;
        default:
          break;
      }
      this.auditService.elementsRestoreSnapChats.push(element.source);
    });
    this.setItemSubscription = this.controlService.selectedObjValue.subscribe((result: any) => {
      if (result && result !== undefined && !this.controlService.isEmpty(result)) {
        this.cbpService.selectedElement = result;
        this.tableService.selectedTable = result;
      }
    });
    this.setDataEntrySubscription = this.tableService.selectedDataEntry.subscribe((result: any) => {
      if (result && result !== undefined && !this.controlService.isEmpty(result)) {
        if (result?.styleSet?.textalign) {
          this.defaultTextAlign = result?.styleSet?.textalign;
        } else {
          this.defaultTextAlign = 'left';
        }
        this.hideStyleIcons = this.controlService.checkDataValidation(result);
        this.hideStyleIcons = this.tableService.viewMode ? true : this.hideStyleIcons;
      }
    });
  }
  @HostListener('window:resize', ['$event'])
  resizeWindow() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  toolbarProp() {
    this.tableService.toolBarTableProperties = true;
    this.tableService.isTableProperties = true;
    this.tableService.referenceProperty = false;
  }
  async mergeTable(position: any) {
    if (this.tableService.selectedRow.length < 2) {
      this.notifier.hideAll();
      this.notifier.notify('warning', 'Please select atleast two cells');
    } else {
      let isValidMerge = this.isMergeTable(this.tableService.selectedRow);
      if (isValidMerge) {
        const { value: userConfirms, dismiss } =
          await this.cbpService.showSwal(AlertMessages.mergeValidation, 'warning', 'Yes');
        if (userConfirms) {
          let element = this.tableService.mergeCells(position);
          if (element) {
            let table = this.cbpService.setTableTrackChange(this.cbpService.selectedElement);
            this.controlService.hideTrackUi({ 'trackUiChange': true });
            this.auditService.createEntry({}, element.source, Actions.Insert, AuditTypes.TABLE_CELL_MERGE, { columnIndex: element.index })
            this.auditService.elementsRestoreSnapChats.push(element.source);
            this.viewUpdate(element.source);
          }
          this.cbpService.isViewUpdated = true;
        }
      } else {
        this.notifier.hideAll();
        this.notifier.notify('warning', 'unable to merge the table');
      }
    }
  }

  isMergeTable(obj: any[]) {
    const rows: any = [...new Set(obj.map((item: { row: any; }) => item.row).sort())];
    const columns: any = [...new Set(obj.map((item: { col: any; }) => item.col).sort())];
    var missing = [];
    if (columns.length > 1 && rows.length > 1 && (!this.notFull(obj, rows))) {
      missing.push(0);
    }
    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < columns.length; j++) {
        let isObj = obj.filter((val: any) => val.row == rows[i] && val.col === columns[j]);
        if (isObj.length === 0) { missing.push(1); }
      }
    }
    return missing.length > 0 ? false : true;
  }
  notFull(obj: any, rows: any) {
    return obj.length % rows.length === 0 ? true : false;
  }
  async tabledeleteListAlert(item: any) {
    const { value: userConfirms, dismiss } = await this.cbpService.showSwal(AlertMessages.confirmDelete, 'warning', 'Yes');
    if (userConfirms) {
      let position = this.tableService.tableRowPosition;
      let colposition = this.tableService.tableColumnPosition;
      if (item.dgType === DgTypes.Figures) {
        this.auditService.createEntry({}, item, Actions.Delete, AuditTypes.TABLE_MEDIA_FILE, { rowPosition: position, colPosition: colposition });
        this.auditService.elementsRestoreSnapChats.push(item);
        this.viewUpdate(item);
      }
      else {
        this.auditService.createEntry({}, item, Actions.Delete, AuditTypes.TABLE_ENTRY_DELETE, { rowPosition: position, colPosition: colposition });
        this.auditService.elementsRestoreSnapChats.push(item);
        this.auditService.attributeNames.push(item.property);
        this.viewUpdate(item);
      }
      // remove attributes form an array to disable/enable attibutes
      let result = Object.values(this.auditService.attributeNames).includes(item.property);
      if (Object.values(this.auditService.attributeNames).includes(item.property)) {
        this.tableService.isSubTypeAttribute = false;
        let condition = (element: any) => !Object.values(this.auditService.attributeNames).includes(item.property);

        this.tableService.isAttributeDisable = this.tableService.isAttributeDisable.filter(element => element !== item.property);
        console.log(this.tableService.isAttributeDisable);
      }

      if (Object.values(this.auditService.attributeNames).includes('SubType')) {
        this.tableService.isTypeAttribute = false;
        let condition = (element: any) => !Object.values(this.auditService.selectedElementSnapchat).includes('SubType');


        this.tableService.isAttributeDisable = this.tableService.isAttributeDisable.filter(element => condition(element));


      }
      if (Object.values(this.auditService.selectedElementSnapchat).includes('Title')) {
        this.tableService.isTitleAttribute = false;
        let condition = (element: any) => !Object.values(this.auditService.selectedElementSnapchat).includes('Title');


        this.tableService.isAttributeDisable = this.tableService.isAttributeDisable.filter(element => condition(element));


      }
      if (Object.values(this.auditService.selectedElementSnapchat).includes('Number')) {
        this.tableService.isNumberAttribute = false;
        let condition = (element: any) => !Object.values(this.auditService.selectedElementSnapchat).includes('Number');


        this.tableService.isAttributeDisable = this.tableService.isAttributeDisable.filter(element => condition(element));


      }
      if (this.tableService.selectedCellDatentry.length > 0) {
        for (let i = 0; i < this.tableService.selectedRow.length; i++) {
          const entrychildrens = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[this.tableService.selectedRow[i].row].entry[this.tableService.selectedRow[i].col];
          entrychildrens.children = [];
          this.cbpService.tableDataEntrySelected = '';
        }
      } else {
        const entrychildrens = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[this.tableService.selectedRow[0].row].entry[this.tableService.selectedRow[0].col];
        entrychildrens.children = entrychildrens.children.filter((i: { dgUniqueID: any; }) => i.dgUniqueID != this.cbpService.tableDataEntrySelected.dgUniqueID);
        if (this.cbpService.tableDataEntrySelected.headerTableItem && !this.cbpService.tableDataEntrySelected.footer) {
          let table = this._buildUtil.getElementByDgUniqueID(this.cbpService.tableDataEntrySelected.parentDgUniqueID, this.cbpService.cbpJson.documentInfo[0].header.children);
          this.controlService.setSelectItem(table);
          this.cbpService.tableDataEntrySelected = '';
        }
        else if (this.cbpService.tableDataEntrySelected.footer) {
          let table = this._buildUtil.getElementByDgUniqueID(this.cbpService.tableDataEntrySelected.parentDgUniqueID, this.cbpService.cbpJson.documentInfo[0].footer.children);
          this.controlService.setSelectItem(table);
          this.cbpService.tableDataEntrySelected = '';
        }
        else {
          let table = this._buildUtil.getElementByDgUniqueID(this.cbpService.tableDataEntrySelected.parentDgUniqueID, this.cbpService.cbpJson.section);
          if (table?.length > 1) {
            table = table.filter((res: { dgType: DgTypes }) => (res.dgType === DgTypes.Table));
            table = table[0];
          }
          this.controlService.setSelectItem(table);
          this.cbpService.tableDataEntrySelected = '';
        }
      }
      this.cbpService.isViewUpdated = true;
    }
  }


  async deleteEntrybyRow(item: any) {
    let position = this.tableService.tableRowPosition;
    let colposition = this.tableService.tableColumnPosition;
    this.auditService.createEntry({}, item, Actions.Delete, AuditTypes.TABLE_ENTRY_DELETE, { rowPosition: position, colPosition: colposition });
    this.auditService.elementsRestoreSnapChats.push(item);
    this.auditService.attributeNames.push(item.property);
    this.viewUpdate(item);

    let result = Object.values(this.auditService.attributeNames).includes(item.property);
    if (Object.values(this.auditService.attributeNames).includes(item.property)) {
      this.tableService.isSubTypeAttribute = false;
      let condition = (element: any) => !Object.values(this.auditService.attributeNames).includes(item.property);

      this.tableService.isAttributeDisable = this.tableService.isAttributeDisable.filter(element => element !== item.property);
      console.log(this.tableService.isAttributeDisable);
    }

    if (Object.values(this.auditService.attributeNames).includes('SubType')) {
      this.tableService.isTypeAttribute = false;
      let condition = (element: any) => !Object.values(this.auditService.selectedElementSnapchat).includes('SubType');


      this.tableService.isAttributeDisable = this.tableService.isAttributeDisable.filter(element => condition(element));


    }
    if (Object.values(this.auditService.selectedElementSnapchat).includes('Title')) {
      this.tableService.isTitleAttribute = false;
      let condition = (element: any) => !Object.values(this.auditService.selectedElementSnapchat).includes('Title');


      this.tableService.isAttributeDisable = this.tableService.isAttributeDisable.filter(element => condition(element));


    }
    if (Object.values(this.auditService.selectedElementSnapchat).includes('Number')) {
      this.tableService.isNumberAttribute = false;
      let condition = (element: any) => !Object.values(this.auditService.selectedElementSnapchat).includes('Number');


      this.tableService.isAttributeDisable = this.tableService.isAttributeDisable.filter(element => condition(element));


    }
    if (this.tableService.selectedCellDatentry.length > 0) {
      for (let i = 0; i < this.tableService.selectedRow.length; i++) {
        const entrychildrens = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[this.tableService.selectedRow[i].row].entry[this.tableService.selectedRow[i].col];
        entrychildrens.children = [];
        this.cbpService.tableDataEntrySelected = '';
      }
    } else {
      const entrychildrens = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[this.tableService.selectedRow[0].row].entry[this.tableService.selectedRow[0].col];
      entrychildrens.children = entrychildrens.children.filter((i: { dgUniqueID: any; }) => i.dgUniqueID != this.cbpService.tableDataEntrySelected.dgUniqueID);
      if (this.cbpService.tableDataEntrySelected.headerTableItem && !this.cbpService.tableDataEntrySelected.footer) {
        let table = this._buildUtil.getElementByDgUniqueID(this.cbpService.tableDataEntrySelected.parentDgUniqueID, this.cbpService.cbpJson.documentInfo[0].header.children);
        this.controlService.setSelectItem(table);
        this.cbpService.tableDataEntrySelected = '';
      }
      else if (this.cbpService.tableDataEntrySelected.footer) {
        let table = this._buildUtil.getElementByDgUniqueID(this.cbpService.tableDataEntrySelected.parentDgUniqueID, this.cbpService.cbpJson.documentInfo[0].footer.children);
        this.controlService.setSelectItem(table);
        this.cbpService.tableDataEntrySelected = '';
      }
      else {
        let table = this._buildUtil.getElementByDgUniqueID(this.cbpService.tableDataEntrySelected.parentDgUniqueID, this.cbpService.cbpJson.section);
        if (table?.length > 1) {
          table = table.filter((res: { dgType: DgTypes }) => (res.dgType === DgTypes.Table));
          table = table[0];
        }
        this.controlService.setSelectItem(table);
        this.cbpService.tableDataEntrySelected = '';
      }
    }
    this.cbpService.isViewUpdated = true;

  }

  async deleteTable() {
    const { value: userConfirms, dismiss } =
      await this.cbpService.showSwal(AlertMessages.confirmDelete, 'warning', 'Yes');
    if (userConfirms) {
      if (this.tableService.selectedTable['header']) {
        let element = JSON.parse(JSON.stringify(this.tableService.selectedTable))
        this.auditService.createEntry({}, element, Actions.Delete, AuditTypes.TABLE_DELETE_HEADER);
        let auditValue = this.auditService.auditJson[this.auditService.auditJson.length - 1]
        if (await this.cbpService.deleteElement(this.cbpService.selectedElement, auditValue, '')) {
          // if (this.auditService.elementsRestoreHeader.length >= 5) {
          //   this.auditService.elementsRestoreHeader.shift();
          //   }
          this.auditService.elementsRestoreHeader.push(element);
          this.cbpService.selectedHeaderElement = this.cbpService.cbpJson.documentInfo[0].header;
          this.cbpService.selectedElement = this.cbpService.cbpJson.documentInfo[0].header;
          this.viewUpdate(element);
        }
      } else if (this.tableService.selectedTable['footer']) {
        let element = JSON.parse(JSON.stringify(this.tableService.selectedTable))
        this.auditService.createEntry({}, element, Actions.Delete, AuditTypes.TABLE_DELETE_FOOTER);
        let auditValue = this.auditService.auditJson[this.auditService.auditJson.length - 1]
        if (await this.cbpService.deleteElement(this.cbpService.selectedElement, auditValue, '')) {
          // if (this.auditService.elementsRestoreHeader.length >= 5) {
          //   this.auditService.elementsRestoreHeader.shift();
          //   }
          this.auditService.elementsRestoreHeader.push(element);
          this.cbpService.selectedHeaderElement = this.cbpService.cbpJson.documentInfo[0].header;
          this.cbpService.selectedElement = this.cbpService.cbpJson.documentInfo[0].header;
          this.viewUpdate(element);
        }
      } else {
        if (this.cbpService.selectedElement['subTabe']) {
          if (this.cbpService.selectedElement.dualStep) {
            let selectTable = JSON.parse(JSON.stringify(this.tableService.selectedTable));
            let dualstep = JSON.parse(JSON.stringify(this._buildUtil.getElementByDgUniqueID(this.tableService.selectedTable.parentDgUniqId, this.cbpService.cbpJson.section)));
            this.subtabledeleteDualStep(this.cbpService.selectedElement, dualstep);
            this.auditService.createEntry({}, selectTable, Actions.Delete, AuditTypes.TABLE_DELETE_SUB_DUAL);
            this.auditService.elementsRestoreSnapChats.push(selectTable);
            this.viewUpdate(selectTable);
          }
          else {
            let selectTable = JSON.parse(JSON.stringify(this.tableService.selectedTable))

            if (this.cbpService.editCoverPage) {
              let parentId = !(this.tableService.selectedTable.parentDgUniqueID) ? "0" : this.tableService.selectedTable.parentDgUniqueID
              const element = this._buildUtil.getElementByDgUniqueID(parentId, this.cbpService.cbpJson.documentInfo[0]);
              this.subtabledeleteDataEelementCoverPage(this.cbpService.selectedElement, element);
              let table = this._buildUtil.getElementByDgUniqueID(this.tableService.selectedTable.parentDgUniqueID, this.cbpService.cbpJson.documentInfo[0]);
              this.controlService.setSelectItem(table);
            }
            else {
              const element = this._buildUtil.getElementByNumber(this.tableService.selectedTable.parentID, this.cbpService.cbpJson.section);
              this.subtabledeleteDataEelement(this.cbpService.selectedElement, element);
              let table = this._buildUtil.getElementByDgUniqueID(this.tableService.selectedTable.parentDgUniqId, this.cbpService.cbpJson.section);
              this.controlService.setSelectItem(table);
            }
            this.auditService.createEntry({}, selectTable, Actions.Delete, AuditTypes.TABLE_DELETE_SUB_WINDOW);
            this.auditService.elementsRestoreSnapChats.push(selectTable);
            this.viewUpdate(selectTable);
          }
        }
        else {
          let element = JSON.parse(JSON.stringify(this.tableService.selectedTable));
          if (element.dualStep) {
            if (await this.cbpService.deleteElement(this.cbpService.selectedElement, '', '')) {
              this.auditService.createEntry({}, element, Actions.Delete, AuditTypes.TABLE_DELETE_DUAL);
              this.auditService.elementsRestoreSnapChats.push(element);
              this.viewUpdate(element);
            }
          }
          else {
            let parent;
            if (element.parentID) {
              parent = JSON.parse(JSON.stringify(this._buildUtil.getElementByNumber(element.parentID, this.cbpService.cbpJson.section)))
            } else {
              // console.error('parent ID'+ element.parentID);
              parent = JSON.parse(JSON.stringify(this.cbpService.cbpJson.section));
            }
            if (await this.cbpService.deleteElement(this.cbpService.selectedElement, '', '')) {
              this.auditService.createEntry({}, element, Actions.Delete, AuditTypes.TABLE_DELETE_WINDOW);
              this.auditService.elementsRestoreSnapChats.push(element);
              this.viewUpdate(element);
            }
          }
        }
      }
      this.cbpService.isViewUpdated = true;
      this.cbpService.detectWholePage = true;
    }
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

  deleteCoverpageSubTable(childata: any, item: any) {
    let entryObj, object
    if (childata) {
      let rowdata = childata?.table?.tgroup?.tbody[0]?.row;
      if (rowdata)
        for (let l = 0; l < rowdata.length; l++) {
          entryObj = rowdata[l].entry;
          for (let m = 0; m < entryObj.length; m++) {
            if (entryObj[m]) {
              object = childata.table.tgroup.tbody[0].row[l].entry[m];
              object.children = object.children.filter((i: { dgUniqueID: any; }) => i.dgUniqueID != item.dgUniqueID);
              for (let k = 0; k < object.children.length; k++) {
                if (object.children[k].dgType === DgTypes.Table) {
                  this.deleteCoverpageSubTable(object?.children[k], item);
                }
              }
            }
          }
        }
      return object;
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
  subtabledeleteDualStep(item: any, childata: any) {
    if (childata.calstable) {
      let rowdata = childata.calstable[0].table.tgroup.tbody[0].row;
      for (let l = 0; l < rowdata.length; l++) {
        let entryObj = rowdata[l].entry;
        for (let m = 0; m < entryObj.length; m++) {
          if (entryObj[m]) {
            const object = childata.calstable[0].table.tgroup.tbody[0].row[l].entry[m];
            object.children = object.children.filter((i: { dgUniqueID: any; }) => i.dgUniqueID != item.dgUniqueID);
            for (let k = 0; k < object.children.length; k++) {
              if (object.children[k].dgType === DgTypes.Table) {
                this.subtabledeleteDualStep(object.children[k], item);
              }
            }
          }
        }
      }
    }
  }
  addColumn(type: string) {
    if (this.cbpService.selectedElement.calstable[0].table.tgroup.thead.length >= 50) {
      this.notifier.notify('warning', 'unable to add columns greater than 50');
    }
    else {
      this.tableService.columnPosition = type;
      let element = this.tableService.addColumn(type);
      this.cbpService.isViewUpdated = true;
      this.controlService.setSelectItem(this.cbpService.selectedElement);
      if (element) {
        this.auditService.createEntry({}, element.source, Actions.Insert, AuditTypes.TABLE_COLUMN_ADD, { columnIndex: element.index })
        this.auditService.elementsRestoreSnapChats.push(element.source);
        this.viewUpdate(element.source);
      }
    }

  }
  addRow(type: string) {
    if (this.tableService.numberofRows >= 50) {
      this.notifier.notify('warning', 'unable to add rows greater than 50');
    }
    else {
      let element = this.tableService.addRow(type);
      this.cbpService.isViewUpdated = true;
      this.controlService.setSelectItem(this.cbpService.selectedElement);
      if (element) {
        this.auditService.createEntry({}, element.source, Actions.Insert, AuditTypes.TABLE_ROW_ADD, { rowIndex: element.index })
        this.auditService.elementsRestoreSnapChats.push(element.source);
        this.viewUpdate(element.source);
      }
    }

  }
  async deleteSelectedColumnItem() {
    const { value: userConfirms, dismiss } =
      await this.cbpService.showSwal(AlertMessages.confirmDelete, 'warning', 'Yes');
    if (userConfirms) {
      let position: any;
      if (this.tableService.selectedRow && this.tableService.selectedRow.length !== 0) {
        position = this.tableService.selectedRow[0].col + 1;
      } else if (this.tableService.selectTableCol) {
        position = this.tableService.selectTableCol[0]['position'];
      } else {
        position = undefined;
      }
      let element = this.tableService.deleteSelectedColumnItem(position);
      this.cbpService.isViewUpdated = true;
      if (element) {
        this.auditService.createEntry({}, element.source, Actions.Delete, AuditTypes.TABLE_COLUMN_DELETE, { columnIndex: element.index })
        this.auditService.elementsRestoreSnapChats.push(element.source);
        this.viewUpdate(element.source);
      }
      this.cbpService.detectWholePage = true;
    }
  }
  async deleteSelectedRow(position: any) {
    const { value: userConfirms, dismiss } =
      await this.cbpService.showSwal(AlertMessages.confirmDelete, 'warning', 'Yes');
    if (userConfirms) {
      this.deleteEntrybyRow(this.cbpService.tableDataEntrySelected)
      let element = this.tableService.deleteSelectedRow(position);
      this.cbpService.isViewUpdated = true;
      if (element) {
        this.auditService.createEntry({}, element.source, Actions.Delete, AuditTypes.TABLE_ROW_DELETE, { rowIndex: element.index })
        this.auditService.elementsRestoreSnapChats.push(element.source);
        this.viewUpdate(element.source);
      }
      // if no rows are there in the table
      if (this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row.length === 0) {
        this.cbpService.deleteListAlert(this.cbpService.selectedElement);
        this.cbpService.isViewUpdated = true;
      }
      if (this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row.length === 1) {
        this.cbpService.coverPageSinglerow = true
        this.cbpService.isViewUpdated = true;
      }
      this.cbpService.detectWholePage = true;
    }
  }

  async deleteSelectedCell(position: any) {
    const { value: userConfirms, dismiss } =
      await this.cbpService.showSwal(AlertMessages.confirmDelete, 'warning', 'Yes');
    if (userConfirms) {
      let element = this.tableService.deleteSelectedCells(position);
      this.cbpService.isViewUpdated = true;
      if (element) {
        this.auditService.createEntry({}, element.source, Actions.Delete, AuditTypes.TABLE_CELL_DELETE, { columnIndex: element.index })
        this.auditService.elementsRestoreSnapChats.push(element.source);
        this.viewUpdate(element.source);
      }
    }
  }

  async splitCell() {
    this.tableService.splitClicked = true;
    if (this.tableService.selectedRow?.length == 0) {
      this.notifier.hideAll();
      this.notifier.notify('warning', 'Please select atleast one cell');
    } else {
      let isSplit = this.isMergeTable(this.tableService.selectedRow);
      if (isSplit) {
        const { value: userConfirms, dismiss } =
          await this.cbpService.showSwal(AlertMessages.splitValidation, 'warning', 'Yes');
        if (userConfirms) {
          this.tableService.splitCell = true;
        }
      } else {
        this.notifier.hideAll();
        this.notifier.notify('warning', 'unable to split the cells');
      }
    }
  }
  setDirectionText(horizon: boolean, verticalTB: boolean, verticalBT: boolean,) {
    if (this.tableService.selectTableCol?.length > 0) {
      let cellHeader = this.cbpService.selectedElement.calstable[0].table.tgroup.thead;
      cellHeader[this.tableService.selectTableCol[0]['position'] - 1]['cellTextType'] = horizon ? 'horizontal' : (verticalTB ? 'verticalTB' : 'verticalBT');
    } else {
      this.cbpService.tableDataEntrySelected['horizontal'] = horizon;
      this.cbpService.tableDataEntrySelected['veriticalTB'] = verticalTB;
      this.cbpService.tableDataEntrySelected['veriticalBT'] = verticalBT;
      for (let i = 0; i < this.tableService.selectedRow.length; i++) {
        let cellproperty = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[this.tableService.selectedRow[i].row].entry[this.tableService.selectedRow[i].col];
        cellproperty['cellTextType'] = horizon ? 'horizontal' : (verticalTB ? 'verticalTB' : 'verticalBT');
      }
    }
    this.cbpService.isViewUpdated = true;
  }

  borderHide(type: string) {
    this.auditService.createEntry({}, JSON.parse(JSON.stringify(this.cbpService.selectedElement)), Actions.Delete, AuditTypes.TABLE_CELL_BORDER)
    this.auditService.elementsRestoreSnapChats.push(this.cbpService.selectedElement);
    this.viewUpdate(this.cbpService.selectedElement);
    let typeNew = JSON.parse(JSON.stringify(type));
    for (let i = 0; i < this.tableService.selectedRow.length; i++) {
      let rowcount = this.tableService.selectedRow[i].row;
      let colCount = this.tableService.selectedRow[i].col;
      const item = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[rowcount].entry[colCount];
      item['hide' + type + 'Border'] = item['hide' + type + 'Border'] === true ? false : true;
      if ((type === 'Top' || type === 'Left')) {
        if (colCount !== undefined && colCount !== -1 && type === 'Left' && this.tableService.selectedRow[i].col !== 0) {
          colCount = this.tableService.selectedRow[i].col - 1;
        }
        if (rowcount !== undefined && rowcount != -1 && type === 'Top') {
          rowcount = this.tableService.selectedRow[i].row - 1;
        }
        if (type === 'Top') { type = 'Bottom'; }
        if (type === 'Left') { type = 'Right'; }
        const item = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[rowcount].entry[colCount];
        item['hide' + type + 'Border'] = item['hide' + type + 'Border'] === true ? false : true;
      }

    }
    this.cbpService.isViewUpdated = true;
  }

  selectTableOption(type: string) {
    this.tableService.selectedCellDatentry = [];
    this.cbpService.selectedElement['selectTable'] = false;
    if (type === 'table') {
      this.cbpService.selectedTableCol = false;
      this.tableService.isTableSelectedElement = true;
      this.cbpService.selectedElement['selectTable'] = !this.cbpService.selectedElement['selectTable'];
      const tablerow = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row;
      for (let j = 0; j < tablerow.length; j++) {
        for (let k = 0; k < tablerow[j].entry.length; k++) {
          this.storeSelect(j, k, tablerow[j].entry[k].children, '');
        }
      }
    }
    if (type === 'row') {
      this.tableService.isTableSelectedElement = false;
      this.cbpService.selectedTableCol = false;
      this.isSelectColumn = true;
      this.isSelectRow = false
      const entries = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[this.tableService.selectedRowNum];
      this.cbpService.rowSelectedEntry = entries;
      for (let m = 0; m < entries.entry.length; m++) {
        this.storeSelect(this.tableService.selectedRowNum, m, entries.entry[m].children, '');
      }
    }
    if (type === 'column') {
      this.tableService.isTableSelectedElement = false;
      this.cbpService.selectedTableCol = true;
      this.isSelectColumn = false;
      this.isSelectRow = true;
      const tablerows = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row;
      const tableHead = this.cbpService.selectedElement.calstable[0].table.tgroup.thead[this.tableService.selectedRow[0].col];
      if (tableHead) {
        this.cbpService.selectedColTitle = tableHead?.fieldName;
      }
      this.cbpService.colSelectedEntry = tablerows;
      let enable = true;
      for (let j = 0; j < tablerows.length; j++) {
        this.storeSelect(j, this.tableService.selectedRow[0].col, tablerows[j].entry[this.tableService.selectedRow[0].col].children, 'column');
        if (tablerows[j].entry[this.tableService.selectedRow[0].col].children?.length === 1 && enable) {
          enable = true;
        } else { enable = false; }
      }
      this.cbpService.columnRuleEnabled = enable;
      this.cbpService.tableDetectChange = true;
      this.cbpService.detectWholePage = true;
    }
    if (type === 'cell') {
      this.cbpService.selectedTableCol = false;
      this.tableService.isTableSelectedElement = false;
      const item = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[this.tableService.selectedRow[0].row].entry[this.tableService.selectedRow[0].col];
      this.tableService.selectedCellDatentry = item.children;
    }
    this.cbpService.isViewUpdated = true;
    this.cbpService.detectWholePage = true;
    this.cbpService.tableDetectChange = true;
    this.cdref.detectChanges();
  }

  storeSelect(j: number, k: number, dataentries: any, type: string) {
    const object = this.tableService.selectedRow.find(item => item.row === j && item.col === k);
    if (!object) {
      this.tableService.selectedRow.push({ 'row': j, 'col': k });
      this.tableService.selectedCellDatentry = this.tableService.selectedCellDatentry.concat(dataentries);
    }
  }
  alignEvent(type: string) {
    console.log('table toolbar', this.cbpService.tableDataEntrySelected);
    let obj = { type: type, exeucterType: 'styleSheet' };
    if (type === 'center' || type === 'left' || type === 'right') {
      this.defaultTextAlign = type;
    }
    if (this.tableService.selectedRow?.length > 1) {
      this.tableService.setstylesForTableEntries(this.cbpService.selectedElement, { type: type });
    } else {
      if (this.cbpService.tableDataEntrySelected) {
        this.cbpService.tableDataEntrySelected['styleSet'] =
          { ...(this.cbpService.tableDataEntrySelected['styleSet'] ?? {}), ...this.tableService.getStyleObject({ type: type }) };
        this.cbpService.tableDataEntrySelected['editorOpened'] = true;
        this.cbpService.tableDataEntrySelected['isHtmlText'] = true;
        this.cbpService.tableDataEntrySelected.prompt = this.tableService.replaceAlignStyle(this.cbpService.tableDataEntrySelected.prompt, { type: 'textalign', align: type });
      }
    }
    this.viewUpdatepage();
  }
  viewUpdatepage() {
    this.cbpService.detectWholePage = true;
    this.cbpService.isViewUpdated = true;
    this.cdref.detectChanges();
  }
  ngOnDestroy() {
    this.tableService.selectedTable = undefined;
    this.setItemSubscription?.unsubscribe();
    this.setDataEntrySubscription?.unsubscribe();
  }
  viewUpdate(element: any) {
    if (element) {
      let table = this._buildUtil.getElementByDgUniqueID(element.dgUniqueID, this.cbpService.cbpJson);
      this.cbpService.setUserUpdateInfo(table);
      this.controlService.hideTrackUi({ 'trackUiChange': true });
    }
  }
}

