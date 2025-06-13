import { Injectable } from '@angular/core';
import { Components, DgTypes } from 'cbp-shared';
import { Initial } from '../../models';
import { CbpExeService } from '../../services/cbpexe.service';
import { DataJsonService } from '../../services/datajson.service';
import { SharedviewService } from '../../services/sharedview.service';
import { AntlrService } from './antlr.service';

@Injectable()
export class TableService {
  selectedRow: any[] = [];
  pasteItems: any = [];
  pastedSucess = false;
  pasteCheck = false;
  enableDeleteRow = true;
  // protectStoreData:any[] = [];
  fontNames = ['Arial', 'Calibri', 'Montserrat', 'Poppins', 'TimeNewRoman', 'Courier New'];
  fontSizes = ['1', '2', '3', '4', '5', '6', '7'];
  colors = ['#000000', '#00FF00', '#ff0000', '#0000ff'];
  storeColors: any[] = [];
  reExecuterRules = true;
  selectedCol: any;
  selectedRowNum: any;
  delay = (millis: number) => new Promise<void>((resolve, reject) => {
    setTimeout(_ => resolve(), millis)
  });

  constructor(public cbpService: CbpExeService, public sharedviewService: SharedviewService,
    public dataJsonService: DataJsonService, public antlrService: AntlrService) { }


  setDefaultTableChanges(obj: any, typeInfo: any, row: any = null) {
    try {
      if (obj) {
        const tableObj = obj?.calstable[0].table.tgroup.tbody[0].row;
        for (let k = 0; k < tableObj.length; k++) {
          if (tableObj[k]) {
            const entryObj = tableObj[k].entry;
            if (entryObj) {
              for (let l = 0; l < entryObj.length; l++) {
                if (entryObj[l]) {
                  if (typeInfo.type === 'removeImage') {
                    entryObj[l].children = entryObj[l].children.filter((item: any) => !item?.tableFigures);
                  }
                  const object = entryObj[l]?.children?.filter((item: any) => item?.dgType);
                  if (object) {
                    for (let m = 0; m < object.length; m++) {
                      if (typeInfo.type === 'dataJson') {
                        if (this.cbpService.maxDgUniqueId < Number(object.dgUniqueID)) {
                          this.cbpService.maxDgUniqueId = Number(object?.dgUniqueID);
                        }
                        const valueObj: any = typeInfo?.dataObject?.dataObjects.filter((x: any) => x.dgUniqueID == object[m].dgUniqueID);
                        let itemObject = valueObj?.length > 0 ? valueObj[valueObj.length - 1] : {};
                        const defaultValue = this.checkBoolean(object[m]) ? false : '';
                        if (this.checkTableDataEntries(object[m])) {
                          object[m]['styleSet'] = this.sharedviewService.setStyleValue(valueObj, {});
                          if (object[m].dgType === DgTypes.TextAreaDataEntry) {
                            if (valueObj[valueObj.length - 1]?.height) {
                              object[m]['height'] = valueObj[valueObj.length - 1]?.height;
                            }
                          }
                          if (itemObject?.protect && object[m]['storeValue'] !== '') {
                            object[m]['protect'] = itemObject?.protect;
                            if (itemObject?.protect) {
                              object[m]['comments'] = itemObject?.comments;
                              object[m]['approveList'] = itemObject?.approveList;
                              object[m]['commentsEnabled'] = object[m]['comments'] === '' ? false : true;
                              object[m]['isCommentUpdated'] = object[m]['commentsEnabled'];
                              object[m]['protectColor'] = itemObject?.protectColor;
                              if (object[m]['protect']) {
                                this.sharedviewService.showComments = true;
                              }
                            }
                          }
                          if (itemObject?.protect && object[m]['storeValue'] == '') {
                            object[m]['protect'] = false;
                          }
                          if (object[m]['storeValue'] && this.cbpService.isHTMLText(object[m]['storeValue'])) {
                            object[m]['innerHtmlView'] = true;
                          }
                        }
                        if (object[m].dgType === DgTypes.SignatureDataEntry) {
                          object[m]['signatureValue'] =
                            valueObj.length > 0 ? valueObj[valueObj.length - 1].signatureValue : defaultValue;
                          if (itemObject?.protect && object[m]['signatureValue'] !== '') {
                            object[m]['protect'] = itemObject?.protect;
                          }
                        }
                        if (object[m].dgType === DgTypes.InitialDataEntry) {
                          object[m]['initialStore'] =
                            valueObj.length > 0 ? valueObj[valueObj.length - 1]?.initialStore : defaultValue;
                          if (itemObject?.protect && object[m]['initialStore'] !== '') {
                            object[m]['protect'] = itemObject?.protect;
                          }
                        }
                        if (object[m].dgType === DgTypes.CheckboxDataEntry && typeInfo?.dataObject?.dataObjects?.length === 0) {
                          object[m]['storeValue'] = object[m]['selected'] ? true : '';
                        }
                        if (object[m].dgType === DgTypes.Figures) {
                          this.cbpService.mediaBuilderObjects = [...this.cbpService.mediaBuilderObjects, ...object[m].images];
                        }
                      }
                      if (typeInfo.type === 'dynamic') {
                        let procedureSnippetIndex = '';
                        let dgUniqueIdString = object[m]['dgUniqueID'].toString()?.split(Components.SPECIAL_SPLIT_CHAR)[0];
                        if (dgUniqueIdString.includes('p_')) {
                          let indexArr = dgUniqueIdString.substring(dgUniqueIdString.indexOf('p')).split('_');
                          //const index =  indexArr[1].split('_')[0]
                          if (indexArr) {
                            indexArr.pop();
                            procedureSnippetIndex = indexArr.join('_') + '_';
                          }
                        }
                        if (object[m]['rowUpdated']) {
                          if (typeof object[m]['dgUniqueID'] === 'string' && object[m]['dgUniqueID']?.includes('_')) {
                            const splitChar = object[m]['dgUniqueID'].toString().includes('p_') ? '_' : Components.SPECIAL_SPLIT_CHAR;
                            let split = object[m]['dgUniqueID'].split(splitChar);
                            object[m]['dgUniqueID'] = split[split.length - 1];
                          }
                        }
                        if (row) {
                          if (row?.dgUniqueID.toString().includes('_')) {
                            if (typeof object[m]['dgUniqueID'] === 'string' && object[m]['dgUniqueID']?.includes('_')) {
                              const splitChar = object[m]['dgUniqueID'].toString().includes('p_') ? '_' : Components.SPECIAL_SPLIT_CHAR;
                              let split = object[m]['dgUniqueID'].split(splitChar);
                              object[m]['dgUniqueID'] = (row?.dgUniqueID ? row?.dgUniqueID : tableObj[k].dgUniqueID) + Components.SPECIAL_SPLIT_CHAR + procedureSnippetIndex + split[split.length - 1];
                            } else {
                              object[m]['dgUniqueID'] = (row?.dgUniqueID ? row?.dgUniqueID : tableObj[k].dgUniqueID) + Components.SPECIAL_SPLIT_CHAR + procedureSnippetIndex + object[m]['dgUniqueID'];
                            }
                          } else {
                            object[m]['dgUniqueID'] = (row?.dgUniqueID ? row?.dgUniqueID : 'd_' + typeInfo.count) + Components.SPECIAL_SPLIT_CHAR + procedureSnippetIndex + object[m]['dgUniqueID'];
                          }
                        }
                      }
                      if (typeInfo.type === 'dynamicDynamic') {
                        let procedureSnippetIndex = '';
                        let dgUniqueIdString = object[m]['dgUniqueID'].toString()?.split(Components.SPECIAL_SPLIT_CHAR)[0];
                        if (dgUniqueIdString.includes('p_')) {
                          let indexArr = dgUniqueIdString.substring(dgUniqueIdString.indexOf('p')).split('_');
                          //const index =  indexArr[1].split('_')[0]
                          if (indexArr) {
                            indexArr.pop();
                            procedureSnippetIndex = indexArr.join('_') + '_';
                          }
                        }
                        if (typeof object[m]['dgUniqueID'] === 'string' && object[m]['dgUniqueID']?.includes('_')) {
                          const splitChar = object[m]['dgUniqueID'].toString().includes('p_') ? '_' : Components.SPECIAL_SPLIT_CHAR;
                          let split = object[m]['dgUniqueID'].split(splitChar);
                          object[m]['dgUniqueID'] = (row?.dgUniqueID ? row?.dgUniqueID : tableObj[k].dgUniqueID) + Components.SPECIAL_SPLIT_CHAR + procedureSnippetIndex + split[split.length - 1];
                        } else {
                          object[m]['dgUniqueID'] = (row?.dgUniqueID ? row?.dgUniqueID : tableObj[k].dgUniqueID) + Components.SPECIAL_SPLIT_CHAR + procedureSnippetIndex + object[m]['dgUniqueID'];
                        }
                      }
                      if (typeInfo.type === 'rowUpdated' && object[m]['rowUpdated']) {
                        let procedureSnippetIndex = '';
                        let dgUniqueIdString = object[m]['dgUniqueID'].toString()?.split(Components.SPECIAL_SPLIT_CHAR)[0];
                        if (dgUniqueIdString.includes('p_')) {
                          let indexArr = dgUniqueIdString.substring(dgUniqueIdString.indexOf('p')).split('_');
                          //const index =  indexArr[1].split('_')[0]
                          if (indexArr) {
                            indexArr.pop();
                            procedureSnippetIndex = indexArr.join('_') + '_';
                          }
                        }
                        if (object[m]['dgUniqueID'].toString().includes('_')) {

                          const splitChar = object[m]['dgUniqueID'].toString().includes('p_') ? '_' : Components.SPECIAL_SPLIT_CHAR;
                          let split = object[m]['dgUniqueID'].split('splitChar');
                          // object[m]['dgUniqueID'] = split[1];
                          object[m]['dgUniqueID'] = (row?.dgUniqueID ? row?.dgUniqueID : tableObj[k].dgUniqueID) + Components.SPECIAL_SPLIT_CHAR + procedureSnippetIndex + split[split.length - 1];

                        } else {
                          object[m]['dgUniqueID'] = (row?.dgUniqueID ? row?.dgUniqueID : tableObj[k].dgUniqueID) + Components.SPECIAL_SPLIT_CHAR + procedureSnippetIndex + object[m]['dgUniqueID'];
                        }
                      }
                      if (typeInfo.type === 'checkRoles') {
                        const hasRolQual = this.sharedviewService.checkRoles(object[m], false, typeInfo.roleObject);
                        let value = !hasRolQual && this.sharedviewService.hasSecurity(object[m]);
                        object[m] = this.sharedviewService.setRoleQuals(object[m], value, value);
                        object[m]['disableField'] = value;
                      }
                      if (typeInfo.type === 'clear') {
                        if (this.checkTableDataEntries(object[m])) {
                          if (typeInfo?.actualType !== 'undo' || !typeInfo?.actualType) {
                            object[m]['styleSet'] = { fontfamily: 'Poppins', fontsize: 2, fontcolor: '#000000' };
                            object[m]['color'] = '#000000';
                            object[m]['defaultFontSize'] = 2;
                            object[m]['defaultFontName'] = 'Poppins';
                            object[m]['storeValue'] = '';
                          }
                          object[m]['disableField'] = false;
                          if (object[m]['protect']) {
                            object[m]['protect'] = false;
                            object[m]['commentsEnabled'] = false;
                            object[m]['isCommentUpdated'] = false;
                            object[m]['approveList'] = [];
                            object[m]['comments'] = '';
                          }
                          if (object[m].dgType === DgTypes.InitialDataEntry && (typeInfo?.actualType !== 'undo' || !typeInfo.actualType)) {
                            const obj = new Initial('', '', '', '', object[m].dgUniqueID);
                            object[m].dgUniqueID = obj.dgUniqueID;
                            object[m].initial = '';
                            object[m].initialStore = '';
                            object[m].initialName = '';
                            this.clearSignObjects(object[m]);
                          } else if (object[m].dgType === DgTypes.SignatureDataEntry && (typeInfo?.actualType !== 'undo' || !typeInfo.actualType)) {
                            object[m].signatureValue = '';
                            object[m].signatureName = '';
                            object[m].initial = '';
                            this.clearSignObjects(object[m]);
                          }
                          object[m].protect = false;
                          object[m]['disableField'] = false;
                          if (typeInfo?.storeType === 'save' && typeInfo?.actualType !== 'undo')
                            this.storeItems(object[m], '');
                        }
                      }
                      if (typeInfo.type === 'removeUnUsedFields') {
                        if (object[m]['protect']) {
                          object[m]['protect'] = false;
                          object[m]['storeValue'] = '';
                          if (object[m]['commentsEnabled'])
                            delete object[m]['commentsEnabled'];
                          if (object[m]['isCommentUpdated'])
                            delete object[m]['isCommentUpdated'];
                          if (object[m]['approveList'])
                            delete object[m]['approveList'];
                          if (object[m]['comments'])
                            delete object[m]['comments'];
                        }
                      }
                      if (object[m].dgType == DgTypes.Form) {
                        if (object[m]?.isApprovalTable && typeInfo.type != 'checkRoles' && typeInfo.type === 'clear') {
                          object[m].calstable[0].table.tgroup.tbody[0].row = [{ 'entry': [] }]
                        } else {
                          this.setDefaultTableChanges(object[m], typeInfo);
                          if (typeInfo.type === 'tableRowAdded') {
                            if (typeInfo.dataObject?.dataObjects?.length > 0) {
                              try {
                                object[m] = this.loadRowsToTable(object[m], typeInfo.dataObject);
                              } catch (err) {
                                console.error('table' + object[m]);
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
          }
        }
      }
      return obj;
    } catch (err) { console.error('table' + err); }
  }

  clearSignObjects(object: any) {
    this.cbpService.clearSignObject.push({ dgType: object.dgType, dgUniqueID: object.dgUniqueID });
  }
  insertArrayIndex(arr: any, index: number, newItem: any) {
    return [...arr.slice(0, index), newItem, ...arr.slice(index)];
  }

  checkTableDataEntries(object: { dgType: DgTypes; }) {
    if (object.dgType === DgTypes.TextDataEntry || object.dgType === DgTypes.DateDataEntry || object.dgType === DgTypes.DropDataEntry ||
      object.dgType === DgTypes.TextAreaDataEntry || object.dgType === DgTypes.NumericDataEntry || object.dgType == DgTypes.SignatureDataEntry ||
      this.checkBoolean(object) || object.dgType === DgTypes.InitialDataEntry) {
      return true;
    }
    return false;
  }
  checkTextTextAra(object: any) {
    if (object.dgType === DgTypes.TextDataEntry ||
      object.dgType === DgTypes.TextAreaDataEntry || object.dgType === DgTypes.NumericDataEntry) {
      return true;
    }
    return false;
  }
  checkBoolean(object: { dgType: DgTypes; }) {
    return object.dgType === DgTypes.BooleanDataEntry || object.dgType === DgTypes.CheckboxDataEntry ? true : false;
  }
  getSelection() {
    if (window.getSelection) {  // all browsers, except IE before version 9
      let selectionRange: any = window.getSelection();
      return selectionRange?.toString();
    }
  }

  pasteCurrentElement(selectedItem: any, mediaBlobs: any) {
    if (localStorage.getItem('tableRow') !== null) {
      this.pasteItems = [];
      let tableNew: any = localStorage.getItem('tableRow');
      let tableObj = JSON.parse(tableNew);
      let currenRow = this.getSortRows(tableObj.row);
      let success = true;
      tableObj.row = currenRow;
      let event = JSON.parse(JSON.stringify(tableObj));
      let rowsValues = currenRow.map((item: any) => item.row);
      let uniqueRows = [...new Set(rowsValues)];
      let custom: any[] = [];
      let colValues = currenRow.map((item: any) => item.col);
      let uniqueColRows = [...new Set(colValues)];
      let colcustom: any[] = [];

      uniqueColRows.forEach((r, i) => {
        if (!this.selectedRow[0]) {
          this.selectedRow[0] = { row: 0, col: 1 }
        }
        colcustom.push({ 'current': this.selectedRow[0]?.col + i, 'actual': r });
      })
      uniqueRows.forEach((r, i) => {
        if (!this.selectedRow[0]) {
          this.selectedRow[0] = { row: 0, col: 0 }
        }
        custom.push({ 'current': this.selectedRow[0].row + i, 'actual': r });
      })
      for (let i = 0; i < currenRow.length; i++) {
        let rowValue = custom.findIndex(j => j.actual === currenRow[i].row);
        let colValue = colcustom.findIndex(j => j.actual === currenRow[i].col);
        currenRow[i].row = custom[rowValue].current;
        currenRow[i].col = colcustom[colValue].current;
      }
      try {
        for (let i = 0; i < event.row.length; i++) {
          let currentTable = this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[currenRow[i].row].entry[currenRow[i].col].children;
          let copiedTable = event.table.calstable[0].table.tgroup.tbody[0].row[event.row[i].row].entry[event.row[i].col].children;
          copiedTable = copiedTable.filter((value: any) => Object.keys(value).length !== 0 && value?.dgType);
          this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[currenRow[i].row].entry[currenRow[i].col].children =
            currentTable.filter((value: any) => Object.keys(value).length !== 0 && value?.dgType);
          event.table.calstable[0].table.tgroup.tbody[0].row[event.row[i].row].entry[event.row[i].col].children =
            currentTable.filter((value: any) => Object.keys(value).length !== 0 && value?.dgType);
          const currentTableNew = this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[currenRow[i].row].entry[currenRow[i].col].children;
          const copiedTableNew = event.table.calstable[0].table.tgroup.tbody[0].row[event.row[i].row].entry[event.row[i].col].children;
          if (currenRow.length > 1) {
            if (currentTableNew.length === copiedTableNew.length) {
              currentTableNew.forEach((item: any, i: any) => {
                item = this.setCopyItem(item, copiedTable[i]);
              });
            }
          } else {
            if (currenRow.length === 1) {
              let children = this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[currenRow[0].row].entry[currenRow[0].col].children;
              if (selectedItem && this.selectedRow?.length === 1) {
                let index = children.findIndex((v: any) => v.dgUniqueID === selectedItem.dgUniqueID);
                const checkstore = this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[currenRow[0].row].entry[currenRow[0].col].children[index];
                if (checkstore?.dataType == "Number") {
                  if (!isNaN(this.cbpService.copySelectedDataEntry?.storeValue)) {
                    this.pasteCheck = false;
                    this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[currenRow[0].row].entry[currenRow[0].col].children[index].storeValue = this.cbpService.copySelectedDataEntry?.storeValue;
                    this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[currenRow[0].row].entry[currenRow[0].col].children[index]['styleSet'] = this.cbpService.copySelectedDataEntry['styleSet'] ? this.cbpService.copySelectedDataEntry['styleSet'] : {};
                    // add styles to the current element
                    this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[currenRow[0].row].entry[currenRow[0].col].children[index] =
                      this.setStyleForCopyPaste(this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[currenRow[0].row].entry[currenRow[0].col].children[index], this.cbpService.copySelectedDataEntry);
                    const itemObj = this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[currenRow[0].row].entry[currenRow[0].col].children[index];
                    if (itemObj.storeValue.indexOf('<') > -1 && itemObj.storeValue.indexOf('>', itemObj.storeValue.indexOf('<')) > -1) {
                      itemObj['innerHtmlView'] = true;
                    }
                    this.storeItems(itemObj, itemObj.storeValue);
                  }
                  else {
                    this.pasteCheck = true
                  }
                }
                else {
                  this.pasteCheck = false;
                  let StoredDataTable = this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[currenRow[0].row].entry[currenRow[0].col].children;
                  if (StoredDataTable.length > 0) {
                    this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[currenRow[0].row].entry[currenRow[0].col].children[index].storeValue = this.cbpService.copySelectedDataEntry?.storeValue;
                    this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[currenRow[0].row].entry[currenRow[0].col].children[index]['styleSet'] = this.cbpService.copySelectedDataEntry['styleSet'] ? this.cbpService.copySelectedDataEntry['styleSet'] : {};
                    // add styles to the current element
                    this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[currenRow[0].row].entry[currenRow[0].col].children[index] =
                      this.setStyleForCopyPaste(this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[currenRow[0].row].entry[currenRow[0].col].children[index], this.cbpService.copySelectedDataEntry);
                    const itemObj = this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[currenRow[0].row].entry[currenRow[0].col].children[index];
                    if (itemObj.storeValue.indexOf('<') > -1 && itemObj.storeValue.indexOf('>', itemObj.storeValue.indexOf('<')) > -1) {
                      itemObj['innerHtmlView'] = true;
                    }
                    this.storeItems(itemObj, itemObj.storeValue);
                  }
                  else {
                    selectedItem.storeValue = this.cbpService.copySelectedDataEntry?.storeValue;
                    selectedItem['styleSet'] = this.cbpService.copySelectedDataEntry['styleSet'] ? this.cbpService.copySelectedDataEntry['styleSet'] : {};
                    // add styles to the current element
                    selectedItem = this.setStyleForCopyPaste(selectedItem, this.cbpService.copySelectedDataEntry)
                    const itemObj = selectedItem
                    if (itemObj.storeValue.indexOf('<') > -1 && itemObj.storeValue.indexOf('>', itemObj.storeValue.indexOf('<')) > -1) {
                      itemObj['innerHtmlView'] = true;
                    }
                    this.storeItems(itemObj, itemObj.storeValue);
                  }
                }
              } else {
                if (children.length > 1) {
                  if (currentTableNew.length === copiedTableNew.length) {
                    currentTableNew.forEach((item: any, i: any) => {
                      item = this.setCopyItem(item, copiedTable[i]);
                    });
                  }
                } else {
                  const item = this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[currenRow[0].row].entry[currenRow[0].col].children[0];
                  if (item !== undefined) {
                    let storeObj = this.cbpService.copySelectedDataEntry ? this.cbpService.copySelectedDataEntry.storeValue : currenRow[0]?.cellInfo[0]?.storeValue;
                    this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[currenRow[0].row].entry[currenRow[0].col].children[0].storeValue = storeObj;
                    // add styles to the current element
                    this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[currenRow[0].row].entry[currenRow[0].col].children[0] =
                      this.setStyleForCopyPaste(this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[currenRow[0].row].entry[currenRow[0].col].children[0], storeObj);
                    if (item.storeValue.indexOf('<') > -1 && item.storeValue.indexOf('>', item.storeValue.indexOf('<')) > -1) {
                      item['innerHtmlView'] = true;
                    }
                    this.storeItems(item, item.storeValue);
                  }
                }
              }
            }
          }
          const currentTableNewFigures = this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[currenRow[i].row];
          const copiedTableNewFigures = event.table.calstable[0].table.tgroup.tbody[0].row[event.row[i].row];
          let rowIndex = currenRow[i].row;
          if (currenRow?.length > 1) {
            copiedTableNewFigures.entry.forEach((element: any, i: any) => {
              element.children.forEach((item: any, j: any) => {
                if (item.dgType === DgTypes.Figures) {
                  item = this.getItemInfo(item, rowIndex, i, currentTableNewFigures.entry[i].children?.length);
                  let findItem = currentTableNewFigures.entry[i].children.filter((ij: any) => ij.dgUniqueID === item.dgUniqueID)
                  if (findItem?.length === 0) {
                    item.dgUniqueID = Number(item.dgUniqueID);
                    item.dgUniqueID = ++item.dgUniqueID;
                    let mediaObj = mediaBlobs.filter((med: any) => med.name === item.images[0].fileName);
                    if (mediaObj?.length === 0) {
                      mediaObj = this.getMediaBlobs(mediaObj);
                    }
                    if (mediaObj?.length > 0) {
                      this.splitTitle(item, mediaObj);
                      currentTableNewFigures.entry[i].children.push(JSON.parse(JSON.stringify(item)));
                    }
                  }
                }
              });
            });
          } else {
            if (currenRow?.length === 1) {
              const tableRowObj = this.cbpService.selectedTable.calstable[0].table.tgroup.tbody[0].row[currenRow[0].row].entry[currenRow[0].col];
              let dataEntries = currenRow[0]?.cellInfo;
              dataEntries.forEach((item: any) => {
                if (item?.dgType === DgTypes.Figures) {
                  item = this.getItemInfo(item, this.selectedRow[0].row, this.selectedRow[0].col, tableRowObj?.children?.length);
                  let findItem = tableRowObj?.children.filter((ij: any) => ij.dgUniqueID === item.dgUniqueID)
                  if (findItem?.length === 0) {
                    item.dgUniqueID = Number(item.dgUniqueID);
                    item.dgUniqueID = ++item.dgUniqueID;
                    let mediaObj = mediaBlobs.filter((med: any) => med.name === item.images[0].fileName);
                    if (mediaObj?.length === 0 && localStorage.getItem("mediaFiles") !== null) {
                      mediaObj = this.getMediaBlobs(mediaObj);
                    }
                    if (mediaObj?.length > 0) {
                      this.splitTitle(item, mediaObj);
                      tableRowObj?.children.push(item);
                    }
                  }
                }
              });
            }
          }
        }
      } catch (err) {
        success = false;
        this.pastedSucess = false;
        console.error(err);
        this.cbpService.notiferMessage('error', 'Unable to paste the table data');
        this.selectedRow = [];
      }
      if (localStorage.getItem("tableRow") !== null && success && !this.pasteCheck) {
        this.pastedSucess = true;
        this.cbpService.notiferMessage('success', 'Table data has pasted successfully')
        this.selectedRow = [];
        if (localStorage.removeItem("mediaFiles") !== null) {
          localStorage.removeItem("mediaFiles");
        }
      }
      else if (this.pasteCheck) {
        success = false;
        this.pastedSucess = false;
        this.cbpService.notiferMessage('error', 'Only numbers are allowed')
        this.selectedRow = [];
      }
    }
  }

  setCopyItem(item: any, copiedTable: any) {
    if (item?.dgType === copiedTable?.dgType) {
      if (this.notValidForCopy(copiedTable)) {
        item.storeValue = copiedTable.storeValue;
        item = this.setStyleForCopyPaste(item, copiedTable);
        this.storeItems(item, item.storeValue);
        if (item.storeValue?.indexOf('<') > -1 && item.storeValue?.indexOf('>', item.storeValue?.indexOf('<')) > -1) {
          item['innerHtmlView'] = true;
        }
      }
    }
    return item;
  }
  setStyleForCopyPaste(item: any, copiedTable: any) {
    item = this.setMaintainStyle(item, copiedTable);
    item = this.setStyleForElement(item, { type: 'fontsize', size: item['styleSet']['fontsize'] });
    item = this.setStyleForElement(item, { type: 'fontfamily', font: item['styleSet']['fontfamily'] });
    item = this.setStyleForElement(item, { type: 'fontcolor', color: item['styleSet']['fontcolor'] });
    return item;
  }

  setMaintainStyle(item: any, copiedTable: any) {
    if (Object.keys(item['styleSet']).length == 0) {
      item['styleSet'] = copiedTable['styleSet'] ? copiedTable['styleSet'] : {};
    } else {
      if (item['styleSet']['fontsize']) {
        item['styleSet']['fontsize'] = this.setFontSizeStyle(item['styleSet']['fontsize'], copiedTable['styleSet']['fontsize'])
      }
      if (item['styleSet']['fontfamily']) {
        item['styleSet']['fontfamily'] = this.setFontFamilyStyle(item['styleSet']['fontfamily'], copiedTable['styleSet']['fontfamily'])
      }
      if (item['styleSet']['fontcolor']) {
        item['styleSet']['fontcolor'] = this.setFontColorStyle(item['styleSet']['fontcolor'], copiedTable['styleSet']['fontcolor'])
      }
    }
    return item;
  }

  setFontColorStyle(font1: any, font2: any) {
    if (font2) return font2;
    return font1;
  }
  setFontFamilyStyle(font: any, font1: any) {
    if (font1) return font1;
    return font;
  }
  setFontSizeStyle(font: any, font1: any) {
    if (font1) return font1;
    return font;
  }
  getMediaBlobs(mediaObj: any) {
    if (localStorage.getItem("mediaFiles") !== null) {
      let strinObjects: any = localStorage.getItem("mediaFiles");
      let arrayFiles = JSON.parse(strinObjects);
      arrayFiles = this.sharedviewService.removeDuplicates(arrayFiles, 'fileName');
      arrayFiles.forEach((element: any) => {
        let blobFile = this.sharedviewService.dataURItoBlob(element.fileObj);
        const blob = new File([blobFile], element.fileName);
        mediaObj.push(blob);
      });
    }
    return mediaObj
  }
  splitTitle(item: any, mediaObj: any) {
    let mediaObjFile = mediaObj.find((ite: any) => ite.name === item.images[0].fileName)
    let split = item.images[0].fileName.split('.');
    let fileName = split[0] + new Date().getTime() + '.' + split[1];
    item.images[0].fileName = fileName;
    item.images[0].name = fileName;
    this.cbpService.dataJson.dataObjects.push(item);
    const blob = new File([mediaObjFile], fileName);
    this.cbpService.media.push(blob);
    this.dataJsonService.setMediaItem(this.cbpService.media);
  }
  getItemInfo(item: any, length: any, rowIndex: any, i: any) {
    item['TxnId'] = new Date().getTime();
    item['row'] = rowIndex;
    item['col'] = i;
    item['index'] = length;
    return item;
  }
  notValidForCopy(copiedTable: any) {
    return (copiedTable.dgType !== DgTypes.SignatureDataEntry &&
      copiedTable.dgType !== DgTypes.InitialDataEntry &&
      copiedTable.dgType !== DgTypes.Figures) ? true : false;
  }
  storeDataJson(tableObj: any) {
    if (this.cbpService.dataJson.dataObjects === undefined) {
      this.cbpService.dataJson.dataObjects = [];
    }
    this.cbpService.dataJson.dataObjects.push(tableObj);
  }
  getSortRows(array: any) {
    let rowsValues = array.map((item: any) => item.row);
    let uniqueRows = [...new Set(rowsValues)].sort();
    let colValues = array.map((item: any) => item.col);
    let uniqueCols = [...new Set(colValues)].sort();
    let newArray: any[] = [];
    for (let i = 0; i < uniqueRows.length; i++) {
      for (let j = 0; j < uniqueCols.length; j++) {
        let cellInfo = array.filter((cell: any) => cell.row === uniqueRows[i] && cell.col === uniqueCols[j]);
        newArray.push({ 'row': uniqueRows[i], 'col': uniqueCols[j], 'cellInfo': cellInfo[0].cellInfo });
      }
    }
    return newArray;
  }

  storeItems(item: any, value: any) {
    this.storeItemOfEnter(item, value);
    this.pasteItems.push(item);
  }
  loadRowsToTable(table: any, dataJson: any) {
    if (table) {
      const valueObj = dataJson.dataObjects.filter((x: any) => x.dgUniqueID == table?.dgUniqueID);
      if (valueObj?.length > 0) {
        valueObj.forEach((element: any) => {
          if (element?.tableInfo) {
            let objTable = table.calstable[0].table.tgroup.tbody[0].row[element?.tableInfo?.index];
            if (objTable == undefined) {
              objTable = table.calstable[0].table.tgroup.tbody[0].row[element?.tableInfo?.index - 1];
            }
            if (objTable) {
              let newObject = JSON.parse(JSON.stringify(objTable));
              let obj = this.reupdateEntryValues(newObject, 'empty');
              let available = table.calstable[0].table.tgroup.tbody[0].row.filter((item: any) => item.entry === obj.entry);
              if (available?.length === 0) {
                let index = element.tableInfo.type === 'bottom' ? element.tableInfo.index + 1 : element?.tableInfo?.index;
                if (element.tableInfo.type === 'delete') {
                  table.calstable[0].table.tgroup.tbody[0].row.splice(element?.tableInfo?.index, 1);
                } else {
                  table.calstable[0].table.tgroup.tbody[0].row =
                    this.insertArrayIndex(table.calstable[0].table.tgroup.tbody[0].row, index, JSON.parse(JSON.stringify(obj)));
                }
              }
            }
          }
        });
      }
      return table;
    }
  }
  loadRowsWithDgUniqueIdToTable(table: any, dataJson: any) {
    try {
      if (table) {
        const valueObj = dataJson.dataObjects.filter((x: any) => x.dgUniqueID == table?.dgUniqueID);
        if (valueObj?.length > 0) {
          valueObj.forEach((element: any) => {
            if (element?.tableInfo) {
              let objTable;
              if (element?.tableInfo?.refDgUniqueID) {
                const rIndex = table.calstable[0].table.tgroup.tbody[0].row.findIndex((i: any) => i.dgUniqueID == element?.tableInfo?.rowDgUniqueID)
                if (rIndex > -1) {
                  return table;
                }
                objTable = table.calstable[0].table.tgroup.tbody[0].row.find((i: any) => i.dgUniqueID == element?.tableInfo?.refDgUniqueID);
                if (objTable) {
                  objTable = JSON.parse(JSON.stringify(objTable));
                }
                if (objTable) {
                  objTable.dgUniqueID = element?.tableInfo?.rowDgUniqueID;
                  objTable.refDgUniqueID = element?.tableInfo?.refDgUniqueID;
                }
              } else {
                objTable = table.calstable[0].table.tgroup.tbody[0].row[element?.tableInfo?.index];
                if (objTable == undefined) {
                  objTable = table.calstable[0].table.tgroup.tbody[0].row[element?.tableInfo?.index - 1];
                }
              }
              if (objTable) {
                let newObject = JSON.parse(JSON.stringify(objTable));
                let originalIndex = table.calstable[0].table.tgroup.tbody[0].row.findIndex((i: any) => i.dgUniqueID == element?.tableInfo?.refDgUniqueID);
                let index = element.tableInfo.type === 'bottom' ? originalIndex + 1 : originalIndex;
                if (element.tableInfo.type === 'delete') {
                  table.calstable[0].table.tgroup.tbody[0].row.splice(originalIndex, 1);
                } else {
                  let obj = this.updateDgUniqueIdForRowsDataOnly(newObject);
                  if (obj) {
                    table.calstable[0].table.tgroup.tbody[0].row = this.insertArrayIndex(table.calstable[0].table.tgroup.tbody[0].row, index, JSON.parse(JSON.stringify(obj)));
                  }
                }
                // let obj =  this.reupdateEntryValues(newObject, 'empty');
                // let available = table.calstable[0].table.tgroup.tbody[0].row.filter((item:any)=>item.entry === obj.entry);
                // if(available?.length === 0){
                //   let index = element.tableInfo.type === 'bottom' ? element.tableInfo.index + 1 : element?.tableInfo?.index;
                //   if(element.tableInfo.type === 'delete'){
                //     table.calstable[0].table.tgroup.tbody[0].row.splice(element?.tableInfo?.index, 1);
                //   } else{
                //     table.calstable[0].table.tgroup.tbody[0].row =
                //     this.insertArrayIndex( table.calstable[0].table.tgroup.tbody[0].row, index, JSON.parse(JSON.stringify(obj)));
                //   }
                // }
              }
            }
          });
        }
        // console.log(table)
        return table;
      }
    }
    catch {
      console.log(table)
    }
  }
  updateDgUniqueIdForRowsDataOnly(row: any) {
    let procedureSnippetIndex = '';
    let dgUniqueIdString = row.dgUniqueID.toString()?.split(Components.SPECIAL_SPLIT_CHAR)[0];
    if (dgUniqueIdString.includes('p_')) {
      let indexArr = dgUniqueIdString.substring(dgUniqueIdString.indexOf('p')).split('_');
      //const index =  indexArr[1].split('_')[0]
      if (indexArr) {
        indexArr.pop();
        procedureSnippetIndex = indexArr.join('_') + '_';
      }
    }
    row.entry?.forEach((entry: any) => {
      entry['previousColumnDgUniqueID'] = entry['dgUniqueID'];
      entry['dgUniqueID'] = 'e_' + ++this.cbpService.uniqueIdIndex;
      if (entry.children && entry.children.length > 0) {
        entry.children.forEach((child: any) => {
          if (child.dgType === DgTypes.Form) {
            this.setDgUniqueIdsForTable(child);
          } else if (this.checkTableDataEntries(child) || child?.dgType == DgTypes.LabelDataEntry || child?.dgType == DgTypes.Para
          ) {
            child['previousEntryDgUniqueID'] = child['dgUniqueID'];
            if (typeof child['dgUniqueID'] === 'string' && child['dgUniqueID']?.includes('_')) {
              const splitChar = child['dgUniqueID']?.includes('p') ? '_' : Components.SPECIAL_SPLIT_CHAR;
              let split = child['dgUniqueID'].split(splitChar);
              child['dgUniqueID'] = row.dgUniqueID + Components.SPECIAL_SPLIT_CHAR + procedureSnippetIndex + split[split.length - 1];
            } else {
              child['dgUniqueID'] = row.dgUniqueID + Components.SPECIAL_SPLIT_CHAR + procedureSnippetIndex + child['previousEntryDgUniqueID'];
            }
            child['storeValue'] = '';

          }
        });
      }
    });
    return row;
  }
  updateDgUniqueIdForRowsAndColumnsOnly(row: any) {
    row['previousRowDgUniqueID'] = row.dgUniqueID;
    row.dgUniqueID = ++this.cbpService.uniqueIdIndex;
    row.entry?.forEach((entry: any) => {
      entry['previousColumnDgUniqueID'] = entry['dgUniqueID'];
      entry['dgUniqueID'] = ++this.cbpService.uniqueIdIndex;
      if (entry.children && entry.children.length > 0) {
        entry.children.forEach((child: any) => {
          if (child.dgType === DgTypes.Form) {
            this.setDgUniqueIdsForTable(child);
          } else if (this.checkTableDataEntries(child) || child?.dgType == DgTypes.LabelDataEntry || child?.dgType == DgTypes.Para
          ) {
            child['previousEntryDgUniqueID'] = child['dgUniqueID'];
            child['dgUniqueID'] = row.dgUniqueID + Components.SPECIAL_SPLIT_CHAR + child['previousEntryDgUniqueID'];
          }
          child['storeValue'] = '';
        });
      }
    });
    return row;
  }

  setDgUniqueIdsForTable(data: any) {
    try {
      data?.calstable[0]?.table?.tgroup?.thead?.forEach((th: any) => {
        if (!th['dgUniqueID']) {
          th['dgUniqueID'] = ++this.cbpService.uniqueIdIndex;
        }
      });
      data?.calstable[0]?.table?.tgroup?.tbody[0]?.row?.forEach((tr: any, i: number) => {
        if (!tr['dgUniqueID']) {
          tr['previousRowDgUniqueID'] = i > 0 ? data?.calstable[0]?.table?.tgroup?.tbody[0]?.row[i - 1]?.['dgUniqueID'] : undefined;
          tr['dgUniqueID'] = ++this.cbpService.uniqueIdIndex;
          tr.entry?.forEach((entry: any) => {
            if (!entry['dgUniqueID']) {
              entry['dgUniqueID'] = ++this.cbpService.uniqueIdIndex;

            }
            if (entry.children && entry.children.length > 0) {
              entry.children.forEach((child: any) => {
                if (child.dgType === DgTypes.Form) {
                  this.setDgUniqueIdsForTable(child);
                } else if (this.checkTableDataEntries(child)) {
                  child['previousEntryDgUniqueID'] = child['dgUniqueID'];
                  child['dgUniqueID'] = tr['dgUniqueID'] + Components.SPECIAL_SPLIT_CHAR + child['previousEntryDgUniqueID'];
                }
              });
            }
          });
        }
      });
    } catch (error) {
      console.log(error)
    }

  }
  setDgUniqueIdsForDynamicSectionTable(data: any) {
    try {
      data?.calstable[0]?.table?.tgroup?.thead?.forEach((th: any, i: number) => {
        th['dgUniqueID'] = data['dgUniqueID'] + '_h_' + (th['dgUniqueID'] ? th['dgUniqueID'] : i);
      });
      data?.calstable[0]?.table?.tgroup?.tbody[0]?.row?.forEach((tr: any, i: number) => {

        tr['previousRowDgUniqueID'] = i > 0 ? data?.calstable[0]?.table?.tgroup?.tbody[0]?.row[i - 1]?.['dgUniqueID'] : undefined;
        tr['dgUniqueID'] = data['dgUniqueID'] + Components.SPECIAL_SPLIT_CHAR + 'r_' + (tr['dgUniqueID'] ? tr['dgUniqueID'] : i);
        tr.entry?.forEach((entry: any, c: number) => {
          entry['dgUniqueID'] = tr['dgUniqueID'] + Components.SPECIAL_SPLIT_CHAR + entry['dgUniqueID'];
          if (entry.children && entry.children.length > 0) {
            entry.children.forEach((child: any) => {
              if (child.dgType === DgTypes.Form) {
                this.setDgUniqueIdsForDynamicSectionTable(child);
              }
              if (this.checkTableDataEntries(child)) {
                child['dgUniqueID'] = tr['dgUniqueID'] + Components.SPECIAL_SPLIT_CHAR + child['dgUniqueID'];
              }
            });
          }
        });

      });
    } catch (error) {
      console.log(error)
    }

  }

  reupdateEntryValues(tableObj: any, type: string) {
    const entryObj = tableObj.entry;
    for (let l = 0; l < entryObj.length; l++) {
      if (entryObj[l]) {
        entryObj[l].children = entryObj[l].children.filter((item: any) => !item?.tableFigures);
        for (let m = 0; m < entryObj[l].children.length; m++) {
          if (entryObj[l].children[m]?.dgType == DgTypes.LabelDataEntry || entryObj[l].children[m]?.dgType == DgTypes.Para) {
            if (entryObj[l].children[m]?.prompt?.includes('#step')) {
              entryObj[l].children[m].prompt = this.removeStepElementsKeepText(entryObj[l].children[m]?.prompt);
            }
            if (entryObj[l].children[m]?.text?.includes('#step')) {
              entryObj[l].children[m].text = this.removeStepElementsKeepText(entryObj[l].children[m]?.text);
            }
          } else {
            if (entryObj[l].children[m]?.showLabelPrompt?.includes('#step')) {
              entryObj[l].children[m].showLabelPrompt = this.removeStepElementsKeepText(entryObj[l].children[m]?.showLabelPrompt);
            }
          }
          if (this.checkTableDataEntries(entryObj[l].children[m])) {
            if (type === 'empty') {
              entryObj[l].children[m]['protect'] = false;
              entryObj[l].children[m]['disableField'] = false;
              entryObj[l].children[m]['rowUpdated'] = true;
              entryObj[l].children[m]['previousDgUniqueID'] = entryObj[l].children[m]['dgUniqueID'];
              if (entryObj[l].children[m].dgType === DgTypes.SignatureDataEntry) {
                entryObj[l].children[m]['signatureValue'] = '';
                entryObj[l].children[m]['signatureNotes'] = '';
              }
              if (entryObj[l].children[m].dgType === DgTypes.InitialDataEntry) {
                entryObj[l].children[m]['initialStore'] = '';
                entryObj[l].children[m]['initialNotes'] = '';
              } else {
                entryObj[l].children[m]['storeValue'] = entryObj[l].children[m].dgType === DgTypes.CheckboxDataEntry ? false : '';
              }
            }
          }
          if (entryObj[l].children[m].dgType == DgTypes.Form) {
            entryObj[l].children[m] = this.setChildTableDataEntries(entryObj[l].children[m], type);
          }
        }
      }
    }
    return tableObj;
  }
  setChildTableDataEntries(obj: any, type: string) {
    try {
      const tableObj = obj.calstable[0].table.tgroup.tbody[0].row;
      for (let k = 0; k < tableObj.length; k++) {
        this.reupdateEntryValues(tableObj[k], type)
      }
      return obj;
    } catch (err) { console.error('table' + err); }
  }

  setTableObjects(tableObj: any, type: string) {
    if (tableObj) {
      const entryObj = tableObj.entry;
      for (let l = 0; l < entryObj.length; l++) {
        if (entryObj[l]) {
          for (let m = 0; m < entryObj[l].children.length; m++) {
            const object = entryObj[l].children[m];
            if (this.checkTableDataEntries(object)) {
              let isCurrent = type === 'current';
              if (object.dgType === DgTypes.SignatureDataEntry) {
                if (isCurrent) { object['signatureValue'] = ''; }
              } else if (object.dgType === DgTypes.InitialDataEntry) {
                if (isCurrent) { object['initialStore'] = ''; }
              } else {
                if (isCurrent) {
                  object['storeValue'] = object.dgType === DgTypes.CheckboxDataEntry ? false : '';
                }
              }
            }
          }
        }
      }
    }
    return tableObj;
  }
  storeItemOfEnter(stepObject: any, value: any, txId: any = null) {
    let dataInfoObj = this.sharedviewService.storeDataObj(stepObject, value);
    if (txId) {
      dataInfoObj['TxnId'] = txId;
      const existingTxnIds = this.cbpService.dataJson.dataObjects.map((obj: any) => obj.TxnId);
      txId = this.getUniqueTimestamp(existingTxnIds);
      if (txId > dataInfoObj['TxnId']) { dataInfoObj['TxnId'] = txId; }
    }
    this.cbpService.dataJsonStoreChange(dataInfoObj);
  }
  getUniqueTimestamp(existingTimestamps: number[]): number {
    let now = Date.now();
    while (existingTimestamps.includes(now)) {
      now += 1; // increment until it's unique
    }
    return now;
  }
  setAlignForElement(element: any, typeInfo: any) {
    element['styleSet'] = { ...(element['styleSet'] ?? {}), ...this.getStyleObject(typeInfo) };
    element['innerHtmlView'] = true;
    if (typeInfo.type === 'center' || typeInfo.type === 'left' || typeInfo.type === 'right') {
      element = this.setAlignStoreValue(element, typeInfo);
    }
    return element;
  }

  setstylesForTableEntries(obj: any, typeInfo: any) {
    for (let m = 0; m < this.selectedRow.length; m++) {
      const tableObj = obj.calstable[0].table.tgroup.tbody[0].row[this.selectedRow[m].row].entry[this.selectedRow[m].col].children;
      tableObj.forEach((element: any) => {
        element = this.setAlignForElement(element, typeInfo);
        // this.saveDatJson(element);
      });
    }
    return obj;
  }
  setstylesFontFamilyTableEntries(obj: any, typeInfo: any) {
    for (let m = 0; m < this.selectedRow.length; m++) {
      const tableObj = obj.calstable[0].table.tgroup.tbody[0].row[this.selectedRow[m].row].entry[this.selectedRow[m].col].children;
      tableObj.forEach((element: any) => {
        element = this.setStyleForElement(element, typeInfo);
        // this.saveDatJson(element);
      });
    }
    return obj;
  }

  setStyleForElement(element: any, typeInfo: any) {
    element['styleSet'] = { ...(element['styleSet'] ?? {}), ...this.getStyleObject(typeInfo) };
    element['innerHtmlView'] = true;
    if (typeInfo.type === 'fontcolor') {
      element['color'] = typeInfo?.color;
      element = this.setStoreValue(element, 'color', typeInfo?.color);
    }
    if (typeInfo.type === 'fontsize') {
      element['defaultFontSize'] = element['styleSet']['fontsize'];
      element = this.setStoreValue(element, 'size', typeInfo?.size);
    }
    if (typeInfo.type === 'fontfamily') {
      element['defaultFontName'] = element['styleSet']['fontfamily'];
      element = this.setStoreValue(element, 'face', typeInfo?.font);
    }
    return element;
  }

  setAlignStoreValue(element: any, typeInfo: any) {
    if (element?.storeValue) {
      element.storeValue = this.replaceAlignStyle(element.storeValue, typeInfo);
    }
    return element;
  }
  getStylesForElement(storeValue: string) {
    let item = { color: '', size: '', family: '' };
    item = this.sharedviewService.getStyles(storeValue, item);
    item.family = this.sharedviewService.getFontFamily(item.family, this.fontNames);
    return item;
  }

  replaceAlignStyle(storeValue: any, typeInfo: any) {
    let item = this.getStylesForElement(storeValue);
    storeValue = this.cbpService.removeHTMLTags(storeValue);
    return this.setStylesForElement(item, typeInfo.type, storeValue);
  }
  setStylesForElement(item: any, type: any, storeValue: any) {
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
    return `<p style="text-align:${type}">${colorhtml}${familyhtml}${sizehtml}${storeValue}${closeSize}${closeFamily}${closeColor}</p>`;
  }

  clearTextAlignFontStyles(text: string, remove: string) {
    let styles = this.stringToStyleArray(text, true);
    for (let i = 0; i < styles.length; i++) {
      let style = styles[i].trim();
      if (style !== '' && style.includes(remove)) { text = text.replace(style, ''); }
    }
    return text;
  }

  setStoreValue(element: any, type1: any, value: any) {
    if (element?.storeValue && element.dgType !== DgTypes.SignatureDataEntry &&
      element.dgType !== DgTypes.InitialDataEntry
    ) {
      element.storeValue = this.replaceRemoveStyle(element.storeValue, type1, value, element?.styleSet?.fontfamily, element);
    }
    if (element.dgType == DgTypes.SignatureDataEntry || element.dgType == DgTypes.InitialDataEntry) {
      element[this.cbpService.signatureFieldItem] = this.replaceRemoveStyle(element[this.cbpService.signatureFieldItem], type1, value);
      element = this.setSignStyles(element, { type1: value });
    }
    return element;
  }
  setSignStyles(element: any, typeInfo: any) {
    if (this.cbpService.signatureFieldItem == 'signatureNotes') {
      element['notesHtmlView'] = true;
      element['notesStyleSet'] = { ...(element['notesStyleSet'] ?? {}), ...this.getStyleObject(typeInfo) };
    }
    if (this.cbpService.signatureFieldItem === 'signatureUserId') {
      element['userIdHtmlView'] = true;
      element['userIdStyleSet'] = { ...(element['userIdStyleSet'] ?? {}), ...this.getStyleObject(typeInfo) };
    }
    if (this.cbpService.signatureFieldItem === 'signatureName') {
      element['innerHtmlView'] = true;
      element['nameStyleSet'] = { ...(element['nameStyleSet'] ?? {}), ...this.getStyleObject(typeInfo) };
    }
    if (this.cbpService.signatureFieldItem == 'initialName') {
      element['innerHtmlView'] = true;
      element['styleSet'] = { ...(element['styleSet'] ?? {}), ...this.getStyleObject(typeInfo) };
    }
    return element;
  }
  checkFontIsthere(size: string, face: string, value: string) {
    return value?.includes('<font ' + face) || value?.includes('<font ' + size);
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

  replaceRemoveStyle(text: any, type: string, selectedValue: string, defaultFontFamily?: string, obj: any = null) {
    let item = { color: '', size: '', family: '', align: 'left' };
    item = this.sharedviewService.getStyles(text, item);
    if (defaultFontFamily == '' || defaultFontFamily == undefined) {
      item.family = this.sharedviewService.getFontFamily(item.family, this.fontNames);
    } else {
      item.family = defaultFontFamily;
    }
    if (obj != null && obj?.dgType == DgTypes.DateDataEntry && item.size == '') {
      item.size = obj?.styleSet?.fontsize ? (obj?.styleSet?.fontsize?.toString()?.includes('px') ? this.sharedviewService.getSizeStyles(obj?.styleSet?.fontsize?.toString()) : obj?.styleSet?.fontsize?.toString()) : obj?.defaultFontSize;
    }
    text = this.clearFontStyles(text, type)
    this.storeColors = [];
    if (type === 'face') item.family = selectedValue;
    if (type === 'size') item.size = selectedValue;
    if (type === 'color') item.color = selectedValue;
    let colorhtml = ''; let closeColor = '';
    let familyhtml = ''; let closeFamily = '';
    let sizehtml = ''; let closeSize = '';
    if (!item.color) item.color = '#000000';
    if (!item.family) item.family = 'Poppins';
    if (!item.size) item.size = '2';
    colorhtml = `<font color="${item.color}">`; closeColor = '</font>';
    familyhtml = `<font face="${item.family}">`; closeFamily = '</font>';
    sizehtml = `<font size="${item.size}">`; closeSize = '</font>';
    text = this.removeHTMLTags(text);
    return `<span style="textalign:${item.align}">${colorhtml}${familyhtml}${sizehtml}${text}${closeSize}${closeFamily}${closeColor}</span>`;
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

  checkStyles(text: string) {
    return text.includes(`color`) || text.includes(`size}"`) || text.includes(`family`)
  }
  clearFontStyles(text: string, removeStyle: string) {
    let colors: string[] = [...this.colors, ...this.storeColors]
    for (let i = 0; i < this.fontNames.length; i++) {
      text = text.replace(`face="${this.fontNames[i]}"`, '');
    }
    for (let j = 0; j < this.fontSizes.length; j++) {
      text = text.replace(`size="${this.fontSizes[j]}"`, '');
    }
    for (let k = 0; k < colors.length; k++) {
      text = text.replace(`color="${colors[k]}"`, '');
    }
    if (text.includes('style='))
      text = this.finalReplaceString(text, removeStyle);
    return text;
  }

  finalReplaceString(text: string, remove: string) {
    let styles = this.stringToStyleArray(text, true);
    for (let i = 0; i < styles.length; i++) {
      let style = styles[i].trim();
      if (style !== '' && style.includes(remove)) {
        text = text.replace(style, '');
      }
    }
    return text;
  }

  stringToStyleArray(string: string, split = true) {
    let styles: string[] = [];
    let dom = (new DOMParser()).parseFromString(string, "text/html");
    dom.querySelectorAll('[style]').forEach((el) => {
      let elm: any = el.getAttribute("style");
      if (split && elm) {
        let elm: any = el.getAttribute("style");
        styles = [...styles, ...elm.split(';')];
      } else {
        styles.push(elm);
      }
    });
    return styles;
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

  selectTableOption(obj: any, type: string, isFormat: boolean, selectedRow: any, selectCol: any) {
    if (type === 'table') {
      const tablerow = obj.calstable[0].table.tgroup.tbody[0].row;
      for (let j = 0; j < tablerow.length; j++) {
        for (let k = 0; k < tablerow[j].entry.length; k++) {
          this.storeSelect(j, k, tablerow[j].entry[k].children, isFormat, type);
        }
      }
      this.enableDeleteRow = false
    }
    if (type === 'row') {
      const entries = obj.calstable[0].table.tgroup.tbody[0].row[selectedRow];
      for (let m = 0; m < entries.entry.length; m++) {
        this.storeSelect(selectedRow, m, entries.entry[m].children, isFormat, type);
      }
      this.enableDeleteRow = true
    }
    if (type === 'column') {
      const tablerows = obj.calstable[0].table.tgroup.tbody[0].row;
      for (let j = 0; j < tablerows.length; j++) {
        for (let k = 0; k < tablerows[j].entry.length; k++) {
          this.storeSelect(j, selectCol, tablerows[j].entry[k].children, isFormat, type);
        }
      }
      this.enableDeleteRow = false
    }
  }

  storeSelect(j: number, k: number, dataentries: any, isFormat: boolean, type: string) {
    const object = this.selectedRow.find((item: any) => item.row === j && item.col === k);
    if (!object) {
      this.selectedRow.push({ 'row': j, 'col': k, type: type });
      this.cbpService.copiedElement.push({ cellInfo: dataentries, row: j, col: k });
      if (isFormat) {
        dataentries.forEach((element: any) => {
          element = this.sharedviewService.setFormatStyle(element);
        });
      }
    }
  }
  setFieldValues(text: any, stepObject: any) {
    let ruleSplit = text.split('THEN');
    let splitf = ruleSplit[0].split('&');
    for (let i = 0; i < splitf.length; i++) {
      if (splitf[i].startsWith('Column')) {
        let splitnew = splitf[i].split(' ');
        let colField: any = this.getColFieldValue(splitnew[0]);
        let col: any = colField[0] - 1;
        let fi: any = colField[1] - 1;
        const object = stepObject.calstable[0].table.tgroup.tbody[0].row[this.selectedRow[0].row].entry[col].children[fi];
        let fieldName = `Column${col + 1}.Attr${fi + 1}`;
        let itemValue = '';
        if (object.dgType === DgTypes.InitialDataEntry) {
          itemValue = object.initialStore;
        } else if (object.dgType === DgTypes.SignatureDataEntry) {
          itemValue = object.signatureValue;
        } else {
          itemValue = object.storeValue;
        }
        let storeValue = this.removeHTMLTags(itemValue);
        let value = storeValue == "" ? '<<DG_EMPTY>>' : storeValue?.toString().trim();
        if (this.antlrService.callBackObject?.arr?.length > 0) {
          let keys = Object.keys(this.antlrService.callBackObject?.arr);
          let find = keys.find(item => item == fieldName);
          if (find) {
            delete this.antlrService.callBackObject?.arr[fieldName];
          }
        }
        this.antlrService.callBackObject.initExecution(fieldName, value);
      }
    }
  }
  getColFieldValue(text: string) {
    let regex = /\[([^\][]*)]/g;
    let results = [], m;
    while ((m = regex.exec(text))) {
      results.push(m[1]);
    }
    return results;
  }
  getColFieldListValidate(text: string, col: number, fieldIndex: number) {
    let splitf = text.split('&');
    let collist = []; let isValid = false;
    for (let i = 0; i < splitf.length; i++) {
      if (splitf[i].startsWith('Column')) {
        let splitnew = splitf[i].split('==');
        let colField: any = this.getColFieldValue(splitnew[0]);
        collist.push({ col: colField[0] - 1, field: colField[1] - 1 });
      }
    }
    for (let j = 0; j < collist.length; j++) {
      if (collist[j].col === col && collist[j].field === fieldIndex) isValid = true;
    }
    return isValid;
  }
  getDisableEnableCol(text: string, type: string) {
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
  removeBracket(item: string) {
    return item.replace(/[\[\]']+/g, '')
  }
  getPosition(str: string, m: string, i: number) { return str.split(m, i).join(m).length; }
  removeStepElementsKeepText(input: string): string {
    return input.replace(/<([a-z]+)\b[^>]\sid=["']#step[^"']["'][^>]>(.?)<\/\1>/gi, '$2');
  }
}
