import { EventEmitter, Injectable, Output } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { Subject } from 'rxjs';
import { Actions, AuditTypes, TableProperties } from '../../models';
import { DataEntryPosition } from '../../models/dataentryposition';
import { AuditService } from '../../services/audit.service';
import { CbpService } from '../../services/cbp.service';
import { BuilderUtil } from '../../util/builder-util';

@Injectable()
export class TableService {
  selectedTable: any;
  selectedMainTable: any;
  isTableAdded = false;
  isTableProperties = false;
  toolBarTableProperties = false;
  numberofColumns = 1;
  numberofRows = 1;
  tableNameProperty = true;
  tableColumnProperty = false;
  columnProperty = false;
  cellProperty = false;
  columntableProperty: any;
  tableRowPosition: any;
  tableColumnPosition: any;
  columntitlePosition = 0;
  columnfieldNamePosition = 0;
  objectsEqual: any;
  isTableDropDown = false;
  isTableColumDropDown = false;
  totalTables: any[] = [];
  totalColumns: any[] = [];
  selectedFieldName: any;
  columeNameInc = 0;
  //Undo Audit braodcast
  undoAudit = new Subject<any>();
  undoAudit_reso = this.undoAudit.asObservable();
  selectedRow: any[] = [];
  selectTableCol: any[] = [];
  showRowTab = false;
  splitCell = false;
  tableRowProperty!: boolean;
  cellObj: any;
  splitcellMerge = false;
  selectedCellDatentry: any[] = [];
  referenceProperty = false;
  isSizeChange = false;
  isBorderRemove: boolean = false;
  isPropertyDisable: boolean = false;
  tableTitle: any;
  attributesList: any[] = [];
  newDragElements: any = [];
  showNew: boolean = false;
  showOld: boolean = true;
  viewMode: boolean = false;
  oldProperty: boolean = false;
  isSelectProperty: boolean = false;
  loadOldCoverPage: boolean = false;
  isAttributeEnable: boolean = true;
  changed: boolean = true;
  isAttributeDisable: any[] = [];
  isTableAddDefault: boolean = true;
  isTitleAttribute: boolean = false;
  isNumberAttribute: boolean = false;
  isTypeAttribute: boolean = false
  isSubTypeAttribute: boolean = false;
  isRevisionAttribute: boolean = false;
  isDescriptionAttribute: boolean = false;
  isObjectiveAttribute: boolean = false;
  isUsageAttribute: boolean = false;
  isUnitAttribute: boolean = false;
  isAuthorAttribute: boolean = false;
  isReviewerAttribute: boolean = false;
  isApproverAttribute: boolean = false;
  storeColors: any[] = [];
  fontNames = ['Arial', 'Calibri', 'Montserrat', 'Poppins', 'TimeNewRoman', 'Courier New'];
  colors = ['#000000', '#00FF00', '#ff0000', '#0000ff'];
  fontSizes = ['1', '2', '3', '4', '5', '6', '7'];
  isAddColumn = false;
  columnPosition = '';
  SelectedRowIndex = -1;
  isTableSelectedElement = false;
  selectedRowNum: any;
  splitClicked = false;
  @Output() selectedDataEntry: EventEmitter<any> = new EventEmitter<any>();

  constructor(public cbpService: CbpService, private _buildUtil: BuilderUtil, public auditService: AuditService) { }

  setDataEntry(obj: any) {
    this.selectedDataEntry.emit(obj);
  }
  getAllTables(data: any) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].dgType === DgTypes.Table) {
        this.totalTables.push(data[i]);
      } else if (data[i].children && data[i].children.length && typeof data[i].children === "object") {
        this.getAllTables(data[i].children);
      }
    }
  }
  getTheColumns(data: any) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].calstable[0].table.tgroup.thead) {
        this.totalColumns = [...this.totalColumns, ...data[i].calstable[0].table.tgroup.thead];
      }
    }
  }
  getTheColumnInfo(data: any) {
    this.totalColumns = [];
    this.getTheColumns(data);
    return this.totalColumns;
  }
  totalTablesInfo() {
    this.totalTables = [];
    this.getAllTables(this.cbpService.cbpJson.section);
    return this.totalTables;
  }
  checkTableAccept(dgType: any) {
    if (dgType === DgTypes.StepAction || dgType === DgTypes.Section || dgType === DgTypes.Repeat || dgType === DgTypes.Timed) {
      return true;
    }
    return false;
  }
  addColumn(type: any) {
    const stepObj = this._buildUtil.getElementByNumber(this.cbpService.selectedElement.parentID, this.cbpService.cbpJson.section);
    if (this.cbpService.selectedElement.calstable) {
      let source = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
      const columnNum = this.cbpService.selectedElement.calstable[0].table.tgroup.thead.length;
      this.numberofColumns = columnNum + 1;
      let previousStyleHead = this.cbpService.selectedElement.calstable[0].table.tgroup.thead[columnNum - 1];
      this.addColumnLocation(type, stepObj, columnNum);
      this.updateColumnHeaderStyles(previousStyleHead);
      const coln = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row;

      // if(this.selectedRow.length === 1){
      //   if(this.selectedRow[0].row !== 0 &&  this.selectedRow[0].row !== this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row.length){
      //     coln = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[this.selectedRow[0].row].entry.length;
      //   }
      // }


      for (let i = 0; i < coln.length; i++) {
        let labelObj: any = {};
        if (stepObj && this.cbpService.selectedElement.referenceOnly) {
          labelObj = this._buildUtil.createElement(DgTypes.LabelDataEntry);
          labelObj['dgUniqueID'] = ++this._buildUtil.uniqueIdIndex;
          labelObj['row'] = i + 1;
          labelObj['column'] = this.numberofColumns;
          labelObj['fieldName'] = 'label' + i + labelObj['dgUniqueID'];
          labelObj['isTableDataEntry'] = true;
          labelObj = this.setDataEntryFieldName(labelObj, { 'row': i + 1, 'col': this.numberofColumns, 'fieldName': 'Column' + this.numberofColumns });
          labelObj = JSON.parse(JSON.stringify(labelObj));
        }
        if (this.selectedRow.length === 1) {
          if (this.selectedRow[0].col === 0) {
            if (type === 'left') {
              coln[i].entry.unshift({ children: labelObj && labelObj?.dgType ? [labelObj] : [] });
            } else {
              coln[i].entry.splice(1, 0, { children: labelObj && labelObj?.dgType ? [labelObj] : [] });
            }
          } else if (this.selectedRow[0].col === columnNum) {
            if (type === 'left') {
              coln[i].entry.splice(this.selectedRow[0].col - 1, 0, { children: labelObj && labelObj?.dgType ? [labelObj] : [] });
            } else {
              coln[i].entry.push({ children: labelObj && labelObj?.dgType ? [labelObj] : [] });
            }
          } else {
            if (type === 'left') {
              coln[i].entry.splice(this.selectedRow[0].col, 0, { children: labelObj && labelObj?.dgType ? [labelObj] : [] });
            } else {
              coln[i].entry.splice(this.selectedRow[0].col + 1, 0, { children: labelObj && labelObj?.dgType ? [labelObj] : [] });
            }
          }
        }
        else if (type === 'left') {
          coln[i].entry.unshift({ children: [] });
        } else {
          coln[i].entry.push({ children: [] });
        }
        this.SelectedRowIndex = this.selectedRow[0]?.col + 1;
      }
      this.isTableProperties = true;
      this.isAddColumn = true;
      this.tableNameProperty = false;
      this.tableRowProperty = false;
      this.tableColumnProperty = true;
      this.applyTableSizes('add');
      this.cbpService.isViewUpdated = true;
      this.cbpService.selectedElement?.calstable[0]?.table?.tgroup?.tbody[0]?.row?.forEach((tr: any, i: number) => {
        tr.entry?.forEach((entry: any) => {
          if (!entry['dgUniqueID']) {
            entry['dgUniqueID'] = this._buildUtil.getUniqueIdIndex();
            // this._buildUtil.uniqueIdIndex = ++this._buildUtil.uniqueIdIndex;
          }
        });
      });
      //this.undoAuditAdded({source: JSON.parse(JSON.stringify(this.cbpService.selectedElement)), auditType : AuditTypes.TABLE_COLUMN_ADD, index : columnNum }  )
      return { source: source, auditType: AuditTypes.TABLE_COLUMN_ADD, index: columnNum };
    }
    return false;
  }

  private addColumnLocation(type: any, stepObj: any, columnNum: any) {
    if (this.selectedRow.length === 1) {
      if (this.selectedRow[0].col === 0) {
        if (type === 'left') {
          this.cbpService.selectedElement.calstable[0].table.tgroup.thead.unshift(this.setNewObjCol(stepObj));
        } else {
          this.cbpService.selectedElement.calstable[0].table.tgroup.thead.splice(1, 0, this.setNewObjCol(stepObj));
        }
      } else if (this.selectedRow[0].col === columnNum) {
        if (type === 'left') {
          this.cbpService.selectedElement.calstable[0].table.tgroup.thead.splice(this.selectedRow[0].col - 1, 0, this.setNewObjCol(stepObj));
        } else {
          this.cbpService.selectedElement.calstable[0].table.tgroup.thead.push(this.setNewObjCol(stepObj));
        }
      } else {
        if (type === 'left') {
          this.cbpService.selectedElement.calstable[0].table.tgroup.thead.splice(this.selectedRow[0].col, 0, this.setNewObjCol(stepObj));
        } else {
          this.cbpService.selectedElement.calstable[0].table.tgroup.thead.splice(this.selectedRow[0].col + 1, 0, this.setNewObjCol(stepObj));
        }
      }
    } else if (type === 'left') {
      this.cbpService.selectedElement.calstable[0].table.tgroup.thead.unshift(this.setNewObjCol(stepObj));
    } else {
      this.cbpService.selectedElement.calstable[0].table.tgroup.thead.push(this.setNewObjCol(stepObj));
    }
    this.cbpService.isViewUpdated = true;
  }

  setDataEntryFieldName(obj: any, info: any) {
    obj['dgFieldName'] = this.setTableName() + '(' + info.row + ',' + info.col + ').' + info.fieldName;
    obj['fieldName'] = info.fieldName;
    return obj;
  }
  setTableName() {
    let tableName = this.cbpService.selectedElement.tableName ? this.cbpService.selectedElement.tableName : 'defaultTable';
    return tableName;
  }
  getStyleObject(typeInfo: any) {
    if (typeInfo.type === 'center' || typeInfo.type === 'left' || typeInfo.type === 'right') {
      return { 'textalign': typeInfo.type };
    }
    if (typeInfo.type === 'fontsize') {
      return { 'fontsize': typeInfo?.size };
    }
    if (typeInfo.type === 'fontfamily') {
      return { 'fontfamily': typeInfo?.font };
    }
    if (typeInfo.type === 'fontcolor') {
      return { 'fontcolor': typeInfo?.color };
    }
  }
  getStyles(text: string, item: any) {
    if (text?.includes('color=')) {
      let colorText = text.split('color=');
      for (let i = 0; i < colorText.length; i++) {
        if (colorText[i] !== '') {
          let colorString = colorText[i].replace(/['"]+/g, '');
          let color = colorString.substring(0, 7);
          item.color = color.includes('#') ? color : '';
          if (item.color !== '')
            this.storeColors.push(item.color);
        }
      }
    }
    if (text?.includes('size=')) {
      let colorText = text.split('size=');
      for (let i = 0; i < colorText.length; i++) {
        if (colorText[i] !== '') {
          let colorString = colorText[i].replace(/['"]+/g, '');
          item.size = colorString.substring(0, 1);
        }
      }
    }
    if (text?.includes('face=')) {
      let colorText = text.split('face=');
      for (let i = 0; i < colorText.length; i++) {
        if (colorText[i] !== '') {
          let colorString = colorText[i].replace(/['"]+/g, '');
          item.family = colorString.substring(0, 4);
        }
      }
    }
    if (text?.includes('text-align:')) {
      let colorText = text.split('text-align:');
      for (let i = 0; i < colorText.length; i++) {
        if (colorText[i] !== '') {
          let colorString = colorText[i].replace(/['"]+/g, '');
          let value = colorString.substring(0, 4);
          if ('center'.includes(value)) { item.align = 'center'; }
          if ('left'.includes(value)) { item.align = 'left'; }
          if ('right'.includes(value)) { item.align = 'right'; }
        }
      }
    }
    return item;
  }


  //coverpage 
  setRightAttributes(item: any, value: any) {
    this.cbpService.listProperties.forEach((itemValue, i) => {
      let dataArr = this.cbpService.cbpJson.documentInfo[0].coverPageData['listAttributeProperty']
      //setting the value directly to document 
      if (item != "") {
        this.cbpService.cbpJson.documentInfo[0][item['property']] = value
      }
      if (dataArr) {
        if (item != "") {
          if (itemValue.attributeName == item.attributeName) {
            const index = dataArr.findIndex((itemV: any) => itemV.property == item.property)
            if (item.dataType != 4000) {
              index == -1 ? dataArr.push({ property: item["property"], propertyValue: item[item["property"]] }) :
                dataArr[index] = { property: item["property"], propertyValue: item[item["property"]] };
              item[item['property']] = value
            } else {
              index == -1 ? dataArr.push({ property: item["property"], propertyValue: item[item["property"]] }) :
                dataArr[index] = { property: item["property"], propertyValue: value };
              item[item['property']] = value
            }

          }
        }
        else {
          dataArr.forEach((item: any) => {
            if (itemValue.property == item.property) {
              itemValue[itemValue['property']] = ''
            }

          })
        }

      }
      else {
        if (item != "") {
          let arr = [];
          arr.push({ property: item["property"], propertyValue: item[item["property"]] })
          this.cbpService.cbpJson.documentInfo[0].coverPageData['listAttributeProperty'] = arr;
          //   console.log("every Value ::",this.cbpService.cbpJson.documentInfo[0].coverPageData['listAttributeProperty'])
          item[item['property']] = value
        }
      }
    })
  }

  setNewObjCol(stepObj: any) {
    const objcol = new TableProperties();
    objcol.title = objcol.title + (++this.cbpService.selectedElement.maxTableColumn);
    // objcol.title = objcol.title+(++this.cbpService.selectedElement.maxTableColumn);

    objcol.fieldName = objcol.title;
    if (this.splitCell) {
      objcol.title = objcol.title + (++this.cbpService.selectedElement.subTabCount);

      //  objcol.title = objcol.title+ this.cbpService.selectedElement.dgUniqueID;
      objcol.fieldName = objcol.fieldName + this.cbpService.selectedElement.dgUniqueID;
    }
    objcol.position = this.numberofColumns;
    if (stepObj && this.cbpService.selectedElement.referenceOnly) { objcol.dgType = DgTypes.LabelDataEntry; }
    return objcol;
  }
  applyTableSizes(type: any) {
    let heads = this.cbpService.selectedElement.calstable[0].table.tgroup.thead;
    const sizes = heads.filter((item: any) => item.columnSize === heads[0].columnSize);
    if ((type === 'add' || (sizes.length) === heads.length - 1) || type === "delete") {
      heads.forEach((item: any) => item.columnSize = Number((100 / heads.length).toFixed(2)));
    } else {
      heads[heads.length - 1].columnSize = Number((heads[heads.length - 2].columnSize / 2).toFixed(2));
      heads[heads.length - 2].columnSize = heads[heads.length - 1].columnSize;
    }
    this.cbpService.isViewUpdated = true;
  }
  addRow(type: any) {
    const entry = [];
    let source = null;
    if (this.cbpService.selectedElement.calstable) {
      source = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
      const heads = this.cbpService.selectedElement.calstable[0].table.tgroup.thead
      let col = heads.length;

      // if(this.selectedRow.length === 1){
      //   if(this.selectedRow[0].row+1 !== 0 &&  this.selectedRow[0].row+1 !== this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row.length){
      //    let colobj = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row[this.selectedRow[0].row+1].entry.filter((e:any)=>!e.deleted);
      //    col = colobj.length;
      //   }
      // }
      // console.log(col);
      for (let i = 0; i < col; i++) {
        let obj = undefined;
        if (this.cbpService.selectedElement.referenceOnly) {
          obj = this._buildUtil.createElement(DgTypes.LabelDataEntry);
          obj['dgUniqueID'] = ++this._buildUtil.uniqueIdIndex;
          obj['isTableDataEntry'] = true;
          obj['column'] = i + 1;
          obj['row'] = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row.length + 1;
          obj = JSON.parse(JSON.stringify(obj));
        }
        let objvalue = obj !== undefined ? { children: [obj] } : { children: [] };
        entry.push(JSON.parse(JSON.stringify(objvalue)));
      }

      if (this.selectedRow.length === 1) {
        if (this.selectedRow[0].row === 0) {
          if (type === 'top') {
            this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row.unshift({ entry: entry });
          } else {
            this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row.splice(1, 0, { entry: entry });
          }
        }
        else if (this.selectedRow[0].row === this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row.length) {
          if (type === 'top') {
            this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row.splice(this.selectedRow[0].row - 1, 0, { entry: entry });
          } else {
            this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row.push({ entry: entry });
          }
        } else {
          if (type === 'top') {
            this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row.splice(this.selectedRow[0].row, 0, { entry: entry });
          } else {
            this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row.splice(this.selectedRow[0].row + 1, 0, { entry: entry });
          }
        }
      } else if (type === 'bottom') {
        this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row.push({ entry: entry });
      } else {
        this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row.unshift({ entry: entry });
      }
      this.numberofRows = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row.length;
      this.cbpService.isViewUpdated = true;
      //this.undoAuditAdded({source: JSON.parse(JSON.stringify(this.cbpService.selectedElement)), auditType : AuditTypes.TABLE_ROW_ADD, index : this.numberofRows-1 }  )
      return { source: source, auditType: AuditTypes.TABLE_ROW_ADD, index: this.numberofRows - 1 };
    }
    return false;
  }
  deleteSelectedColumnItem(position: any) {
    if (position == -1 || position === undefined || isNaN(position)) {
      position = this.cbpService.selectedElement.calstable[0].table.tgroup.thead.length - 1
    } else {
      position = typeof position === 'number' ? position - 1 : Number(position) - 1;
    }
    //this.undoAuditAdded({source: JSON.parse(JSON.stringify(this.cbpService.selectedElement)), auditType : AuditTypes.TABLE_COLUMN_DELETE, index : position }  )
    let source = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
    this.cbpService.selectedElement.calstable[0].table.tgroup.thead.splice(position, 1); // column count
    let allRows = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row;
    for (let i = 0; i < allRows.length; i++) { // rows count
      allRows[i].entry.splice(position, 1);
    }
    this.setTheadPosition();
    this.applyTableSizes('delete');
    this.cbpService.isViewUpdated = true;
    return { source: source, auditType: AuditTypes.TABLE_COLUMN_DELETE, index: position };
  }
  deleteSelectedRow(position: any) {
    if (position == -1 || position == undefined || isNaN(position) || position == null || position == '') {
      position = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row.length - 1;
      // console.log(position);
    } else {
      position = typeof position === 'number' ? position - 1 : Number(position) - 1;
    }
    // console.log(position)
    //this.undoAuditAdded({source: JSON.parse(JSON.stringify(this.cbpService.selectedElement)), auditType : AuditTypes.TABLE_ROW_DELETE, index : position }  )
    let source = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
    const rows = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row;
    rows.splice(position, 1);
    this.cbpService.isViewUpdated = true;
    return { source: source, auditType: AuditTypes.TABLE_ROW_DELETE, index: position }
  }
  setDefaultTableChanges(obj: any, dataObject: any) {
    try {
      for (let i = 0; i < obj.calstable.length; i++) {
        if (obj.calstable[i]) {
          const colsObj = obj.calstable[i].table.tgroup.tbody;
          for (let j = 0; j < colsObj.length; j++) {
            if (colsObj[j]) {
              const tableObj = colsObj[j].row;

              for (let k = 0; k < tableObj.length; k++) {
                if (tableObj[k]) {
                  const entryObj = tableObj[k].entry;
                  for (let l = 0; l < entryObj.length; l++) {
                    if (entryObj[l]) {
                      const object = obj.calstable[i].table.tgroup.tbody[j].row[k].entry[l].children;
                      for (let m = 0; m < object.length; m++) {
                        const valueObj = dataObject.filter((x: any) => x.dgUniqueID == object[m].dgUniqueID);
                        const defaultValue = this.checkBoolean(object[m]) ? false : '';
                        if (this.checkTableDataEntries(object[m])) {
                          obj.calstable[i].table.tgroup.tbody[j].row[k].entry[l].children[m]['storeValue'] =
                            valueObj.length > 0 ? valueObj[valueObj.length - 1].value : defaultValue;
                        }

                        if (object[m].dgType === DgTypes.CheckboxDataEntry && dataObject.length === 0) {
                          obj.calstable[i].table.tgroup.tbody[j].row[k].entry[l].children[m]['storeValue'] =
                            obj.calstable[i].table.tgroup.tbody[j].row[k].entry[l].children[m]['selected'] ? true : defaultValue;
                        }
                      }
                    }
                  }
                }
              }


            }
          }
        }
      }
      return obj;
    } catch (err) { console.error('table' + err); }
  }
  checkTableDataEntries(object: any) {
    if (object.dgType === DgTypes.TextDataEntry || object.dgType === DgTypes.DateDataEntry || object.dgType === DgTypes.DropDataEntry ||
      object.dgType === DgTypes.TextAreaDataEntry || object.dgType === DgTypes.NumericDataEntry || object.dgType == DgTypes.SignatureDataEntry ||
      this.checkBoolean(object) || object.dgType === DgTypes.InitialDataEntry) {
      return true;
    }
    return false;
  }
  checkBoolean(object: any) {
    if (object.dgType === DgTypes.BooleanDataEntry || object.dgType === DgTypes.CheckboxDataEntry) {
      return true;
    }
    return false;
  }
  checkTableNameExistOrnot() {
    let isExist = false;
    let stepNumber;
    const res = this.cbpService.fieldsMaps.get(this.cbpService.selectedElement.dgUniqueID);
    if (this.cbpService.selectedElement.tableName === res) {
    } else {
      for (const [key, value] of this.cbpService.fieldsMaps) {
        if (value === this.cbpService.selectedElement.tableName) {
          stepNumber = this._buildUtil.getElementByDgUniqueID(key, this.cbpService.cbpJson.section);
          isExist = true;
        }
      }
      if (isExist && this.cbpService.selectedElement.tableName) {
        this.cbpService.showSwalDeactive('Table Name already exist at Step ' + stepNumber.parentID, 'warning', 'OK');
        this.cbpService.selectedElement.tableName = res;
        return isExist;
      } else {
        this.cbpService.selectedElement.fieldNameUpdated = true;
        this.cbpService.fieldsMaps.set(this.cbpService.selectedElement.dgUniqueID, this.cbpService.selectedElement.tableName);
        //Do audit
      }
    }
    return isExist;
  }

  upArrow(index: any) {
    let table = this.cbpService.selectedElement.calstable[0].table.tgroup;
    this.cbpService.selectedElement.calstable[0].table.tgroup = this.upArrowChanges(table, index);
    this.setTheadPosition();
    this.cbpService.isViewUpdated = true;
  }
  downArrow(index: any) {
    let table = this.cbpService.selectedElement.calstable[0].table.tgroup;
    this.cbpService.selectedElement.calstable[0].table.tgroup = this.downArrowChanges(table, index);
    this.setTheadPosition();
    this.cbpService.isViewUpdated = true;
  }

  upArrowChanges(table: any, index: any) {
    const i = index - 1; // 2
    let temp = table.thead[i]; table.thead[i] = table.thead[i - 1]; table.thead[i - 1] = temp;
    let allRows = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row;
    for (let j = 0; j < allRows.length; j++) { // rows count
      let temp = table.tbody[0].row[j].entry[i];
      table.tbody[0].row[j].entry[i] = table.tbody[0].row[j].entry[i - 1];
      table.tbody[0].row[j].entry[i - 1] = temp;
    }
    return table;
  }

  downArrowChanges(table: any, index: any) {
    const i = index;
    let temp = table.thead[i - 1]; table.thead[i - 1] = table.thead[i]; table.thead[i] = temp;
    let allRows = this.cbpService.selectedElement.calstable[0].table.tgroup.tbody[0].row;
    for (let j = 0; j < allRows.length; j++) { // rows count
      let temp = table.tbody[0].row[j].entry[i - 1];
      table.tbody[0].row[j].entry[i - 1] = table.tbody[0].row[j].entry[i];
      table.tbody[0].row[j].entry[i] = temp;
    }
    return table;
  }

  setTheadPosition() {
    this.cbpService.selectedElement.calstable[0].table.tgroup.thead.forEach((item: any, i: any) => item.position = i + 1);
    this.cbpService.isViewUpdated = true;
  }

  objectsSameEqual(objArr: any, objArr2: any) {
    let objSame = false
    if (objArr.length === objArr2.length) {
      for (let i = 0; i < objArr.length; i++) {
        if (objArr[i].length == objArr2[i].length) {
          if (this.objectsColumnSame(objArr[i], objArr2[i])) {
            objSame = true;
          } else { objSame = false; break; }
        }
        else { objSame = false; break; }
      }
    }
    return objSame;
  }

  objectsAreSame(x: any, y: any) {
    var objectsAreSame = true;
    for (var propertyName in x) {
      if (x[propertyName] !== y[propertyName]) {
        objectsAreSame = false;
        break;
      }
    }
    return objectsAreSame;
  }
  objectsColumnSame(x: any, y: any) {
    let objectsAreSame = true;
    for (var propertyName in x) {
      if (x.title !== y.title || x.position !== y.position || x.columnSize !== y.columnSize ||
        x.dgType != y.dgType || x.fieldName !== y.fieldName ||
        (x['dgTypeObj'] && y['dgTypeObj'] && JSON.stringify(x.dgTypeObj) !== JSON.stringify(y.dgTypeObj))) {
        objectsAreSame = false;
        break;
      }
    }
    return objectsAreSame;
  }
  fieldNameExistOrNot(name: any) {
    const objcol = new TableProperties();
    const duplicate = this.cbpService.selectedElement.calstable[0].table.tgroup.thead.filter((item: any) => item.fieldName === name);
    if (duplicate.length > 1) {
      this.cbpService.showSwalDeactive('Field Name already exist', 'warning', 'OK');
      objcol.fieldName = this.selectedFieldName;
      this.columntableProperty.fieldName = this.selectedFieldName;
      return true;
    }
    return false;
  }

  //
  undoAuditAdded(audit: any) {
    this.undoAudit.next(audit);
  }

  mergeCells(field: any) {
    let source = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
    let table = field.calstable[0].table.tgroup.tbody[0].row;
    const rows = [...new Set(this.selectedRow.map(item => item.row).sort())];
    const columns = [...new Set(this.selectedRow.map(item => item.col).sort())];
    if (rows.length === 1) {
      //let cols = table[rows[0]].entry[columns[0]]['colspan'];
      // extra code
      let cols: any = 0;
      for (let i = 0; i < columns.length; i++) {
        cols = cols + (table[rows[0]].entry[columns[i]]['colspan'] ? table[rows[0]].entry[columns[i]]['colspan'] : 1);
      }
      // extra code
      //let value = cols ? columns.length-1 + cols : columns.length;
      let value = cols ? cols : columns.length;
      table[rows[0]].entry[columns[0]]['colspan'] = value;
      for (let i = 0; i < columns.length; i++) {
        if (columns[i] !== columns[0])
          table[rows[0]].entry[columns[i]]['deleted'] = true;
      }
      table[rows[0]].entry = table[rows[0]].entry.filter((item: any) => !item['deleted']);
    }
    else if (columns.length === 1) {
      let ros = table[rows[0]].entry[columns[0]]['rowspan'];
      let value = ros ? rows.length - 1 + ros : rows.length;
      table[rows[0]].entry[columns[0]]['rowspan'] = value;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i] !== rows[0]) {
          table[rows[i]].entry[columns[0]]['deleted'] = true;
        }
      }
      table[rows[0]].entry = table[rows[0]].entry.filter((item: any) => !item['deleted']);
      // for(let i=0; i< rows.length; i++){
      //   table[i].entry = table[i].entry.filter(item=>!item['deleted']);
      // }
    }
    else if (columns.length > 1) {
      let cols = table[rows[0]].entry[columns[0]]['colspan'];
      let value = cols ? columns.length - 1 + cols : columns.length;
      table[rows[0]].entry[columns[0]]['colspan'] = value;
      let ros = table[rows[0]].entry[columns[0]]['rowspan'];
      let rs = ros ? rows.length - 1 + ros : rows.length;
      table[rows[0]].entry[columns[0]]['rowspan'] = rs;
      for (let i = 0; i < this.selectedRow.length; i++) {
        if (i !== 0)
          table[this.selectedRow[i].row].entry[this.selectedRow[i].col]['deleted'] = true;
      }
    }
    if (!this.splitcellMerge) { this.selectedRow = []; }
    field.calstable[0].table.tgroup.tbody[0].row = JSON.parse(JSON.stringify(table));
    this.cbpService.isViewUpdated = true;
    return { source: source, auditType: AuditTypes.TABLE_CELL_MERGE, index: table };
  }

  deleteSelectedCells(field: any) {
    let source = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
    let table = field.calstable[0].table.tgroup.tbody[0].row;
    for (let i = 0; i < this.selectedRow.length; i++) {
      table[this.selectedRow[i].row].entry[this.selectedRow[i].col]['deleted'] = true;
    }
    field.calstable[0].table.tgroup.tbody[0].row = JSON.parse(JSON.stringify(table));
    this.cbpService.isViewUpdated = true;
    return { source: source, auditType: AuditTypes.TABLE_CELL_DELETE, index: field };
  }
  defaultTableAddInfo(obj: any, table: any, isObjTable: boolean) {
    obj['columnSize'] = this.numberofColumns;
    obj['rowSize'] = this.numberofRows;
    obj['dgUniqueID'] = ++this._buildUtil.uniqueIdIndex;
    if (this.selectedRow.length > 0) {
      obj['row'] = this.selectedRow[0].row + 1;
      obj['column'] = this.selectedRow[0].col + 1;
    }
    obj['parentDgUniqID'] = this.cbpService.selectedElement.dgUniqueID;
    this.cbpService.selectedUniqueId = obj['dgUniqueID'];
    obj['parentID'] = table.dgSequenceNumber;
    obj['parentTableDgUniqueID'] = this.cbpService.selectedElement.dgUniqueID;
    obj['level'] = table['level'] + 1;
    obj['state'] = { hidden: true };
    if (isObjTable) { table = obj; }
    this.auditService.createEntry({}, JSON.parse(JSON.stringify(table)), Actions.Insert, AuditTypes.TABLE)
    if (isObjTable) {
      obj = this.addColumnPopup(obj);
      obj = this.addRowPopup(obj);
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
      for (let i = 1; i <= this.numberofColumns; i++) {
        const objcol = this.setTableHead({}, obj, i);
        table.calstable[0].table.tgroup.thead.push(objcol);
        obj = this.setTableObj(obj, table, i);
        let objvalue = obj === '' ? { children: [] } : { children: [obj] };
        table.calstable[0].table.tgroup.tbody[0].row[rowno].entry.push(JSON.parse(JSON.stringify(objvalue)));
      }
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
      for (let j = 1; j < this.numberofRows; j++) {
        const entryObj = this.returnEntry(JSON.parse(JSON.stringify(entry)), j);
        table.calstable[0].table.tgroup.tbody[0].row.push({ entry: entryObj });
      }
    }
    return table;
  }
  setTableObj(obj: any, table: any, i: any) {
    if (obj != '') {
      obj['dgFieldName'] = '';
      obj['dgUniqueID'] = ++this._buildUtil.uniqueIdIndex;
      obj['parentID'] = table.dgUniqueID;
      obj['parentDgUniqID'] = table.dgUniqueID;
      obj['column'] = i;
      obj['row'] = 1;
      obj['fieldName'] = obj.dgType;
      obj = this.setDataEntryFieldName(obj, { 'row': 1, 'col': i, 'fieldName': obj['fieldName'] });
      obj = JSON.parse(JSON.stringify(obj));
    }
    return obj;
  }
  returnEntry(entry: any, j: any) {
    entry.forEach((item: any) => {
      item.children.forEach((element: any) => {
        element.dgUniqueID = ++this._buildUtil.uniqueIdIndex;
        element['row'] = j + 1;
      });
      item = JSON.parse(JSON.stringify(item));
    })
    return entry;
  }
  setTableHead(objcol: any, obj: any, i: number) {
    objcol = new TableProperties();
    objcol.title += ++this.columntitlePosition;
    objcol.position = i;
    objcol.fieldName += ++this.columnfieldNamePosition;
    const size = ((100 / (this.numberofColumns)).toFixed(2)).toString().substring(0, 5);
    objcol.columnSize = Number(size);
    if (this.cbpService.selectedElement.referenceOnly) {
      objcol.dgType = obj.dgType;
      objcol.dgTypeObj = this._buildUtil.createElement(obj.dgType);
    }
    return objcol;
  }
  setCoverItem(isShow: boolean) {
    this.showNew = isShow;
    this.showOld = !isShow;
  }
  attributesDisable(obj: any, list: any) {
    try {
      const colsObj = obj?.calstable[0]?.table?.tgroup?.tbody[0]?.row;
      if (colsObj) {
        for (let k = 0; k < colsObj.length; k++) {
          if (colsObj[k]) {
            const entryObj = colsObj[k].entry;
            for (let l = 0; l < entryObj.length; l++) {
              if (entryObj[l]) {
                const object = obj.calstable[0].table.tgroup.tbody[0].row[k].entry[l].children;
                for (let m = 0; m < object.length; m++) {
                  if (object[m].property) {
                    // let find = list.find((item:any) => item.property === object[m].property);
                    // if (find) {
                    this.cbpService.coverPageDataAfterSave = true;
                    this.isAttributeDisable.push(object[m].property);
                    // }
                  }
                  if (object[m].dgType === DgTypes.Form) {
                    this.attributesDisable(object[m], list);
                  }
                }
              }
            }
          }
        }
      }
    } catch (err) { console.error('table' + err); }
  }
  setstylesForTableEntries(obj: any, typeInfo: any) {
    for (let m = 0; m < this.selectedRow.length; m++) {
      const tableObj = obj.calstable[0].table.tgroup.tbody[0].row[this.selectedRow[m].row].entry[this.selectedRow[m].col].children;
      tableObj.forEach((element: any) => {
        element = this.setAlignForElement(element, typeInfo);
      });
    }
    return obj;
  }
  setAlignForElement(element: any, typeInfo: any) {
    element['styleSet'] = { ...(element['styleSet'] ?? {}), ...this.getStyleObject(typeInfo) };
    element['isHtmlText'] = true;
    element['editorOpened'] = false;
    if (typeInfo.type === 'center' || typeInfo.type === 'left' || typeInfo.type === 'right') {
      typeInfo['align'] = typeInfo.type;
      element = this.setAlignStoreValue(element, typeInfo);
    }
    return element;
  }

  setAlignStoreValue(element: any, typeInfo: any) {
    if (element?.prompt) {
      element.prompt = this.replaceAlignStyle(element.prompt, typeInfo);
    }
    return element;
  }

  replaceAlignStyle(storeValue: any, typeInfo: any) {
    let item = { color: '', size: '', family: '', align: '' };
    item = this.getStyles(storeValue, item);
    item.family = this.getFontFamily(item.family, this.fontNames);
    if (typeInfo.type == 'fontsize') {
      item.size = typeInfo.size;
    }
    if (typeInfo.type == 'fontcolor') {
      item.color = typeInfo.color;
    }
    if (typeInfo.type == 'fontfamily') {
      item.family = typeInfo.font;
    }
    if (typeInfo.align || typeInfo.type == 'textalign') {
      item.align = typeInfo.align;
    }
    if (item.align == '') item.align = 'left';
    storeValue = this.removeHTMLTags(storeValue)
    let colorhtml = ''; let closeColor = '';
    let familyhtml = ''; let closeFamily = '';
    let sizehtml = ''; let closeSize = '';
    if (item.color !== '') {
      colorhtml = `<font color="${item.color}">`; closeColor = '</font>';
    }
    if (item.family !== '') {
      familyhtml = `<font face="${item.family}">`; closeFamily = '</font>';
    }
    if (item.size !== '') {
      sizehtml = `<font size="${item.size}">`; closeSize = '</font>';
    }
    return `<p style="text-align:${item.align}">${colorhtml}${familyhtml}${sizehtml}${storeValue}${closeSize}${closeFamily}${closeColor}</p>`;
  }


  replaceStyle(text: any, type: string) {
    let find = text.split('<font ' + type + '=');
    for (let i = 0; i < find.length; i++) {
      if (find[i] !== '') {
        let colorString = find[i].replace(/['"]+/g, '');
        let value = colorString.substring(0, colorString.indexOf(">"));
        text = text.replace(`${type}="${value}"`, '');
      }
    }
    return text;
  }
  getFontFamily(type: string, list: any) {
    let family = '';
    for (let i = 0; i < list.length; i++) {
      if (list[i].includes(type)) { family = list[i]; break; }
    }
    return family;
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
  updateColumnHeaderStyles(previousStyleHead: any) {
    let totalColumns: any = this.cbpService.selectedElement?.calstable[0]?.table?.tgroup?.thead?.length;
    if (totalColumns > 0 && totalColumns) {
      for (let i = 0; i < totalColumns; i++) {
        let columnHead = this.cbpService.selectedElement.calstable[0].table.tgroup.thead[i];
        columnHead.styleSet = previousStyleHead?.styleSet
      }
    }
  }



}