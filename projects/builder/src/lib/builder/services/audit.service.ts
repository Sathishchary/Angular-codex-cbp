import { ChangeDetectorRef, EventEmitter, Injectable } from '@angular/core';
import { Dependency, DgTypes, SequenceTypes } from 'cbp-shared';
import { Subject } from 'rxjs';
import { Actions } from '../models/actions';
import { AuditModes, AuditPropertyMapper, AuditTypes } from '../models/audit-types';
import { Audit } from '../models/audit.model';
import { BuilderUtil } from '../util/builder-util';
import { CbpService } from './cbp.service';
import { ControlService } from './control.service';

@Injectable()
export class AuditService {

  //AUDIT DATA
  auditJson: Array<Audit> = [];
  undoJson: any[] = [];
  redoJson: Audit[] = [];
  attributeNames: any = [];
  selectedElementSnapchat: any;
  currentMode: AuditModes = AuditModes.AUDIT;

  //undo Broadcaster
  undoAudit = new Subject<Audit>();
  undoAudit_reso = this.undoAudit.asObservable();

  elementsRestoreSnapChats: Array<any> = [];
  elementsRestoreHeader: Array<any> = [];

  cutElementRestore: Array<any> = [];
  saveFile: any;

  //step Option
  isUpArrowVisible: any;
  isDownArrowVisible: any;


  cbpChange: EventEmitter<any> = new EventEmitter();

  constructor(private _buildUtil: BuilderUtil, private cbpService: CbpService, private cdref: ChangeDetectorRef, private controlService: ControlService) {
    this._buildUtil.idUpdateUndo_reso.subscribe((update:any)=>{
      this.updateUndoJson(update.targetID,update.newID);
    })
  }
  updateUndoJson(oldId:any,newId:any){
  if (!oldId || !newId) {
    console.warn("updateUndoJson: Invalid IDs", { oldId, newId });
    return;
  }
  if(this.undoJson?.length == 0){
    return;
  }
  this.undoJson.forEach((item: any) => {
    if (item?.DgUniqueID === oldId) {
      item.DgUniqueID = newId;
    }
  });
}
  copyAuditAdded(element: any) {
    switch (element.target.action) {
      case 'copy':
        this.createEntry(element.source.element, element.target.element, Actions.Update, AuditTypes.COPY)
        break;
      case 'cut':
        this.createEntry(element.source.element, element.target.element, Actions.Update, AuditTypes.CUT);
        break;
      case 'paste':
        this.createEntry(element.source.element, element.target.element, Actions.Update, AuditTypes.PASTE, { actionCause: element.target.actionCause });
        if (element.source.element.parentID) {
          this.elementsRestoreSnapChats.push(JSON.parse(JSON.stringify(this._buildUtil.getElementByNumber(element.source.element.parentID, this.cbpService.cbpJson.section))));
        } else {
          this.elementsRestoreSnapChats.push(JSON.parse(JSON.stringify(this.cbpService.cbpJson.section)));
        }
        break;
      default:
        break;
    }
  }




  createEntry(oldObject: any, newObject = null, action?: any, auditType?: any, optionalParams?: any): void {
    try {
      let audit = null;
      switch (action) {
        case Actions.Insert:
          audit = this.createAudit(oldObject,newObject, action, auditType, optionalParams);
          break;
        case Actions.Update:
          audit = this.updateAudit(oldObject, newObject, action, auditType, optionalParams)
          break;
        case Actions.Delete:
          audit = this.deleteAudit(newObject, action, auditType, optionalParams);
          break;
        default:
          break;
      }
      if (audit) {
        this.auditJson.push(audit);
        if (audit.AuditType != AuditTypes.APPLICABILITY_RULE
          && audit.AuditType != AuditTypes.ALARM
          && audit.AuditType != AuditTypes.CONDITIONAL_RULE
          && audit.AuditType != AuditTypes.SECTION_DEPENDENCY) {
          this.undoJson.push(audit);
        }
        this.selectedElementSnapchat = JSON.parse(JSON.stringify(newObject));
      }
    } catch (error) {
      console.error(error);
    }
    this.cbpChange.emit({});
    this.cbpService.popupDocumentSave = false;
    this.cbpService.isViewUpdated = true;
  }

  private createAudit(oldObject: any = null,newObject: any, action: Actions, auditType: AuditTypes, optionalParams: any = null): Audit {
    let audit = this.buildAudit(newObject, action, optionalParams);
    if (auditType) {
      audit.AuditType = auditType;
    }
    if (audit?.ActionCause == 'cut' && oldObject) {
      audit.ParentID = oldObject.parentID
      audit.number = oldObject.number
      audit.level = oldObject.level
      audit.stepParentDgUniqID = oldObject.stepParentDgUniqID
      if (oldObject?.isTableDataEntry) {
        audit.ColumnIndex = oldObject.ColumnIndex
        audit.RowIndex = oldObject.RowIndex
      }
    }
    if(oldObject?.originalSequenceType){
      audit.originalSequenceType = oldObject.originalSequenceType
    }
    if(oldObject?.childSequenceType){
      audit.childSequenceType = oldObject.childSequenceType
    }
    audit.CreatedBy = this.cbpService.loggedInUserName;
    audit.CreatedID = this.cbpService.loggedInUserId;
    audit.CreatedDate = new Date();
    this.cbpService.isViewUpdated = true;
    return audit;
  }

  private updateAudit(oldObject: any, newObject: any, action: Actions, auditType: AuditTypes, optionalParams: any = {}): any {
    let audit = this.buildAudit(newObject, action, optionalParams);
    audit.AuditType = auditType;
    if (audit.AuditType == AuditTypes.REPLACE) {
      audit.PropName = optionalParams.propName;
    }
    audit.UpdatedBy = this.cbpService.loggedInUserName;
    audit.UpdatedID = this.cbpService.loggedInUserId;
    audit.UpdatedDate = new Date();
    this.cbpService.isViewUpdated = true;
    if (audit.AuditType == AuditTypes.MOVE_DOWN || audit.AuditType == AuditTypes.MOVE_UP) {
      return audit;
    }
    // Old text and New Text as well as other property entries
    return this.parseAudit(audit, oldObject, newObject, auditType, optionalParams);
  }
  parseAudit(audit: Audit, oldObject: any, newObject: any, auditType: AuditTypes, optionalParams: any = {}): AuditTypes | any | null {
    switch (auditType) {
      case AuditTypes.CAUSE:
        return this.parseCause(audit, oldObject, newObject);
      case AuditTypes.EFFECT:
        return this.parseEffect(audit, oldObject, newObject);
      case AuditTypes.NOTE:
        return this.parseNote(audit, oldObject, newObject, optionalParams);
      case AuditTypes.ALARA:
        return this.parseAlara(audit, oldObject, newObject, optionalParams);
      case AuditTypes.TEXT:
        return this.parseText(audit, oldObject, newObject);
      case AuditTypes.PROMPT:
        return this.parsePrompt(audit, oldObject, newObject);
      case AuditTypes.FORMULA:
        return this.parseFormula(audit, oldObject, newObject, optionalParams);
      case AuditTypes.DROPDOWN:
        return this.parseDropDown(audit, oldObject, newObject, optionalParams);
      case AuditTypes.PROPERY_DROPDOWN_VALUE:
        return this.parseDropDownValue(audit, oldObject, newObject, optionalParams);
      case AuditTypes.PROPERY_TABLE_DROPDOWN_VALUE:
        return this.parseTableDropDownValue(audit, oldObject, newObject, optionalParams);
      case AuditTypes.SECTION_DEPENDENCY:
        return this.parseSectionDependency(audit, oldObject, newObject, optionalParams);
      case AuditTypes.PROPERTY_VERIFICATION:
        return this.parseVerification(audit, oldObject, newObject, optionalParams);
      case AuditTypes.COMPONENT_INFO:
        return this.parseComponentInfo(audit, oldObject, newObject, optionalParams);
      case AuditTypes.PROPERTY_MEDIA_SOURCE:
      case AuditTypes.PROPERTY_MEDIA_NAME:
      case AuditTypes.PROPERTY_MEDIA_CAPTION:
      case AuditTypes.PROPERTY_MEDIA_DESC:
      case AuditTypes.MEDIA_FILE:
        return this.parseMedia(audit, oldObject, newObject, optionalParams);
      case AuditTypes.CAPTION:
        return this.parseCaption(audit, oldObject, newObject, optionalParams);
      case AuditTypes.INDENT_RIGHT:
        return this.parseIndent(audit, oldObject, newObject, optionalParams);
      case AuditTypes.INDENT_LEFT:
        return this.parseIndent(audit, oldObject, newObject, optionalParams);;
      case AuditTypes.SEQUENCE:
        return this.parseSequence(audit, oldObject, newObject, optionalParams);
      case AuditTypes.PROPERTY_LENGTH:
        return this.parseMaxSize(audit, oldObject, newObject);
      case AuditTypes.PROPERTY_TABLE_LENGTH:
        return this.parseTableMaxSize(audit, oldObject, newObject);
      case AuditTypes.PROPERTY_CHECK_VALUE:
        return this.undoUpdateCheckBox(audit, oldObject, newObject);
      case AuditTypes.EMBEDED_TYPE:
        return this.parseEmbededType(audit, oldObject, newObject, optionalParams);
      case AuditTypes.EMBEDED_DOC_NUM:
        return this.parseEmbededDocNum(audit, oldObject, newObject, optionalParams);
      case AuditTypes.TABLE_FIELD_NAME:
        return this.parseTableFieldName(audit, oldObject, newObject, optionalParams);
      case AuditTypes.COPY:
      case AuditTypes.CUT:
      case AuditTypes.PASTE:
        return audit;
      default:
        return this.parseProperty(audit, oldObject, newObject, optionalParams);
    }
  }
  parseTableFieldName(audit: any, oldObject: any, newObject: any, optionalParams: any) {
    audit.OldText = optionalParams['OldText'];
    audit.NewText = optionalParams['NewText'];
    audit.ColumnIndex = optionalParams['column'];
    audit.RowIndex = optionalParams['row'];
    audit.PropName = optionalParams['propName'];
    return audit;
  }
  parseSectionDependency(audit: Audit, oldObject: any, newObject: any, optionalParams: any): Audit | any {
    if (JSON.parse(JSON.stringify(oldObject.configureDependency)) == JSON.parse(JSON.stringify(newObject.configureDependency))) {
      return null;
    } else {
      audit.OldText = JSON.parse(JSON.stringify(oldObject.configureDependency));
      audit.NewText = JSON.parse(JSON.stringify(newObject.configureDependency));
    }
    return audit;
  }
  parseVerification(audit: Audit, oldObject: any, newObject: any, optionalParams: any): Audit | null {
    if (oldObject[optionalParams.propName] == newObject[optionalParams.propName]) {
      return null;
    } else {
      audit.OldText = oldObject[optionalParams.propName];
      audit.NewText = newObject[optionalParams.propName];
    }
    return audit;
  }
  parseIndent(audit: Audit, oldObject: any, newObject: any, optionalParams: any): Audit {
    audit.ParentID = newObject.parentID ? newObject.parentID : null;
    return audit;
  }
  parseComponentInfo(audit: Audit, oldObject: any, newObject: any, optionalParams: any): Audit | null {
    if (!oldObject || !newObject || !optionalParams) {
      return null;
    }
    if (JSON.parse(JSON.stringify(oldObject['componentInformation'])) == JSON.parse(JSON.stringify(newObject['componentInformation']))) {
      return null;
    } else {
      audit.OldText = JSON.stringify(oldObject['componentInformation']);
      audit.NewText = JSON.stringify(newObject['componentInformation']);
    }
    return audit;
  }
  parseSequence(audit: Audit, oldObject: any, newObject: any, optionalParams: any): Audit | null {
    if (!oldObject || !newObject) {
      return null;
    }
    if (oldObject['childSequenceType'] == newObject['childSequenceType']) {
      return null;
    } else {
      audit.OldText = oldObject['childSequenceType'];
      audit.NewText = newObject['childSequenceType'];
    }
    return audit;
  }
  parseProperty(audit: Audit, oldObject: any, newObject: any, optionalParams: any): Audit | null {
    if (!oldObject || !newObject || !optionalParams) {
      return null;
    }
    if (oldObject[optionalParams.propName] == newObject[optionalParams.propName]) {
      return null;
    }
    else {
      audit.OldText = oldObject[optionalParams.propName];
      audit.NewText = newObject[optionalParams.propName];
    }
    return audit;
  }
  parseEmbededType(audit: Audit, oldObject: any, newObject: any, optionalParams: any): Audit | null {
    if (!oldObject || !newObject || !optionalParams) {
      return null;
    }
    if (oldObject['property'].type == newObject['property'].type) {
      return null;
    }
    else {
      audit.OldText = oldObject['property'].type;
      audit.NewText = newObject['property'].type;
    }
    return audit;
  }
  parseEmbededDocNum(audit: Audit, oldObject: any, newObject: any, optionalParams: any): Audit | null {
    if (!oldObject || !newObject || !optionalParams) {
      return null;
    }
    if (oldObject['property'].documentNumber == newObject['property'].documentNumber) {
      return null;
    }
    else {
      audit.OldText = oldObject['property'].documentNumber;
      audit.NewText = newObject['property'].documentNumber;
    }
    return audit;
  }
  parseCaption(audit: Audit, oldObject: any, newObject: any, optionalParams: any): Audit | null {
    if (oldObject.caption == newObject.caption) {
      return null;
    } else {
      audit.OldText = oldObject.caption;
      audit.NewText = newObject.caption;
    }
    return audit;
  }
  parseMedia(audit: Audit, oldObject: any, newObject: any, optionalParams: any): Audit | null {
    if ((oldObject['images'].length) < (optionalParams.index)) {
      return null;
    } else {
      audit.Index = optionalParams.index;
      audit.OldText = '';
      audit.NewText = newObject['images'][optionalParams.index][optionalParams.propName];
    }
    return audit;
  }
  parseDropDownValue(audit: Audit, oldObject: any, newObject: any, optionalParams: any): Audit | null {
    if (oldObject.choice[optionalParams.index] == newObject.choice[optionalParams.index]) {
      return null;
    } else {
      audit.OldText = '';
      audit.NewText = newObject.choice[optionalParams.index];
    }
    return audit;
  }
  parseTableDropDownValue(audit: Audit, oldObject: any, newObject: any, optionalParams: any): Audit | null {
    if (oldObject.choice[optionalParams.index] == newObject.choice[optionalParams.index]) {
      return null;
    } else {
      audit.OldText = '';
      audit.NewText = newObject.choice[optionalParams.index];
    }
    return audit;
  }
  parseDropDown(audit: Audit, oldObject: any, newObject: any, optionalParams: any): Audit | null {
    if (oldObject[optionalParams.propName] == newObject[optionalParams.propName]) {
      return null;
    } else {
      audit.OldText = oldObject[optionalParams.propName];
      audit.NewText = newObject[optionalParams.propName];
    }
    return audit;
  }
  parsePrompt(audit: Audit, oldObject: any, newObject: any): Audit | null {
    if (oldObject.prompt == newObject.prompt) {
      return null;
    } else {
      audit.OldText = '';
      audit.NewText = newObject.prompt;
    }
    return audit;
  }
  parseFormula(audit: Audit, oldObject: any, newObject: any, optionalParams: any): Audit | null {
    if (!oldObject || !newObject || !optionalParams) {
      return null;
    }
    if (oldObject['content'].equation == newObject['content'].equation) {
      return null;
    }
    else {
      audit.OldText = oldObject['content'].equation;
      audit.NewText = newObject['content'].equation;
    }
    return audit;
  }
  parseText(audit: Audit, oldObject: any, newObject: any): Audit | null {
    if (oldObject.text == newObject.text) {
      return null;
    } else {
      audit.OldText = oldObject.text;
      audit.NewText = newObject.text;
    }
    return audit;
  }
  parseNote(audit: Audit, oldObject: any, newObject: any, optionalParams: any): Audit | null {
    if (oldObject.notes[optionalParams.index] == newObject.notes[optionalParams.index]) {
      return null;
    } else {
      audit.OldText = oldObject.notes[optionalParams.index];
      audit.NewText = newObject.notes[optionalParams.index];
    }
    return audit;
  }
  parseAlara(audit: Audit, oldObject: any, newObject: any, optionalParams: any): Audit | null {
    if (oldObject.alaraNotes[optionalParams.index] == newObject.alaraNotes[optionalParams.index]) {
      return null;
    } else {
      audit.OldText = oldObject.alaraNotes[optionalParams.index];
      audit.NewText = newObject.alaraNotes[optionalParams.index];
    }
    return audit;
  }
  parseEffect(audit: Audit, oldObject: any, newObject: any): Audit | null {
    if (oldObject.effect == newObject.effect) {
      return null;
    } else {
      audit.OldText = oldObject.effect;
      audit.NewText = newObject.effect;
    }
    return audit;
  }
  parseCause(audit: Audit, oldObject: any, newObject: any): Audit | null {
    if (oldObject.cause == newObject.cause) {
      return null;
    } else {
      audit.OldText = oldObject.cause;
      audit.NewText = newObject.cause;
    }
    return audit;
  }
  parseMaxSize(audit: Audit, oldObject: any, newObject: any): Audit | null {
    if (oldObject.Maxsize == newObject.Maxsize) {
      return null;
    } else {
      audit.OldText = oldObject.Maxsize;
      audit.NewText = newObject.Maxsize;
    }
    return audit;
  }
  parseTableMaxSize(audit: Audit, oldObject: any, newObject: any): Audit | null {
    if (oldObject.Maxsize == newObject.MaxSize) {
      return null;
    } else {
      audit.OldText = oldObject.Maxsize;
      audit.NewText = newObject.MaxSize;
    }
    return audit;
  }
  undoUpdateCheckBox(audit: Audit, oldObject: any, newObject: any): Audit {
    if (audit.OldText == 'Normal') {
      this.cbpService.selectedElement.selected = false;
    }
    audit.OldText = oldObject.valueType;
    audit.NewText = newObject.valueType;

    return audit;
  }
  parseTitle(audit: Audit, oldObject: any, newObject: any): any {
    switch (newObject.dgType) {
      case DgTypes.Section || DgTypes.StepInfo || DgTypes.DelayStep:
        if (oldObject.title == newObject.title) {
          return null;
        } else {
          audit.OldText = oldObject.title;
          audit.NewText = newObject.title;
        }
        return audit;
      case DgTypes.StepAction || DgTypes.Timed || DgTypes.Repeat:
        if (oldObject.action == newObject.action) {
          return null;
        } else {
          audit.OldText = oldObject.action;
          audit.NewText = newObject.action;
        }
        return audit;
      default:
        break;
    }
  }
  private deleteAudit(newObject: any, action: Actions, auditType: AuditTypes, optionalParams: any = {}): Audit {
    let audit = this.buildAudit(newObject, action, optionalParams);
    if (newObject.parentID) {
      audit.ParentID = newObject.parentID;
    }
    if (newObject.dualStep) {
      audit.dualStep = newObject.dualStep;
      audit.stepParentDgUniqID = newObject.parentDgUniqueID;
    }
    if (auditType) {
      audit.AuditType = auditType;
    }
    audit.UpdatedBy = this.cbpService.loggedInUserName;
    audit.UpdatedID = this.cbpService.loggedInUserId;
    audit.UpdatedDate = new Date();
    this.cbpService.isViewUpdated = true;
    return audit;
  }

  private buildAudit(newObject: any, action: Actions, optionalParams: any = null): Audit {
    let audit = new Audit();
    audit.DgUniqueID = newObject?.dgUniqueID ? newObject.dgUniqueID : 0;
    audit.Action = action;
    audit.TransID = this.auditJson.length + 1;
    if (optionalParams) {
      if (optionalParams?.index != null || optionalParams.index != undefined) { audit.Index = optionalParams.index };
      if (optionalParams?.actionCause) { audit.ActionCause = optionalParams.actionCause };
      if (optionalParams?.columnIndex) { audit.ColumnIndex = optionalParams.columnIndex };
      if (optionalParams?.rowIndex) { audit.RowIndex = optionalParams.rowIndex };
      if(optionalParams?.internalRevision){ audit.internalRevision = optionalParams.internalRevision}
    }
    if (newObject?.headerTable) {
      audit.headerTab = newObject.headerTable;
    }
    this.cbpService.isViewUpdated = true;
    return audit;
  }

  getAuditJSON(): Array<Audit> {
    return this.auditJson;
  }
  setAuditJSON(auditJson: Array<Audit>) {
    this.auditJson = auditJson;
  }
  //UNDO FUNCTIONALITIES
  undoElement() {
    if ((this.undoJson[0].DgUniqueID == 1 && this.undoJson.length <= 1) || this.undoJson.length < 1)
      return;
    try {
      this.currentMode = AuditModes.UNDO;
      const audit: Audit = this.undoJson[this.undoJson.length - 1]
      let element;
      if (audit?.DgUniqueID != 0) {
        element = this._buildUtil.getElementByDgUniqueID(audit.DgUniqueID, this.cbpService.cbpJson.section);

        if (!element) {
          element = this._buildUtil.getElementByNumber(audit.ParentID, this.cbpService.cbpJson.section);
        }
        if (!element) {
          let DgUniqueID = audit.DgUniqueID.toString() 
          element = this._buildUtil.getElementByDgUniqueID(DgUniqueID, this.cbpService.cbpJson.section);
        }
        if(!element && audit.headerTab){
          element = this._buildUtil.getElementByDgUniqueID(audit.DgUniqueID, this.cbpService.cbpJson.documentInfo[0].header);
          if(!element){
            element = this._buildUtil.getElementByDgUniqueID(audit.DgUniqueID, this.cbpService.cbpJson.documentInfo[0].footer);
          }
        }
      }
      // if (audit.AuditType === AuditTypes.TABLE_ENTRY_HEADER_ADD) {
      //   element = this._buildUtil.getElementByDgUniqueID(audit.DgUniqueID, this.cbpService.cbpJson.documentInfo[0].header.children);
      //   this.cbpService.tableDataEntrySelected = element;
      //  // this.undoJson.pop();
      // }
      // if (audit.AuditType === AuditTypes.TABLE_ENTRY_FOOTER_ADD) {
      //   element = this._buildUtil.getElementByDgUniqueID(audit.DgUniqueID, this.cbpService.cbpJson.documentInfo[0].footer.children);
      //   this.cbpService.tableDataEntrySelected = element;
      //   // this.undoJson.pop();
      // }
      //   else {
      //    element = this.cbpService.cbpJson.documentInfo[0];
      //  }
      this.cbpService.selectedUniqueId = audit.DgUniqueID;
      this.cbpService.selectedElement = element;
      if(audit.headerTab){
        this.doUndo(element, audit, this.cbpService.cbpJson.documentInfo[0]);
      }else{
        this.doUndo(element, audit, this.cbpService.cbpJson.section);
      }
      this.cbpService.isViewUpdated = true;
      this.cbpService.detectWholePage = true;
      this.currentMode = AuditModes.AUDIT;
    } catch (error) {
      this.currentMode = AuditModes.AUDIT;
      console.error(error)
    }
    this.controlService.setSelectItem(this.cbpService.selectedElement)
    this.cdref.detectChanges();
  }

  doUndo(element: any = null, audit: Audit, section: Array<any>) {
    switch (audit.Action) {
      case Actions.Insert:
        this.doInsertUndo(audit, element, section);
        break;
      case Actions.Update:
        this.doUpdateUndo(audit, element)
        break;
      case Actions.Delete:
        this.doDeleteUndo(audit)
        break;
      default:
        break;
    }
    this.undoAuditAdded(audit);
    console.log(  this.cbpService.selectedElement)
  }

  doDeleteUndo(audit: Audit) {
    let element;
    if (audit.AuditType === AuditTypes.TABLE_COLUMN_DELETE
      || audit.AuditType === AuditTypes.TABLE_ROW_DELETE || audit.AuditType === AuditTypes.TABLE_CELL_DELETE 
      || audit.AuditType === AuditTypes.TABLE_CELL_BORDER) {
        if(audit.headerTab){
          element = this._buildUtil.getElementByDgUniqueID(audit.DgUniqueID, this.cbpService.cbpJson.documentInfo[0].header);
          if(element){
            this.cbpService.cbpJson.documentInfo[0].header = this._buildUtil.replaceElement({ dgUniqueID: element.dgUniqueID }, this.elementsRestoreSnapChats.pop(), this.cbpService.cbpJson.documentInfo[0].header);
            this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(element.dgUniqueID, this.cbpService.cbpJson.documentInfo[0].header);
            this.undoJson.pop();
          }else{
            element = this._buildUtil.getElementByDgUniqueID(audit.DgUniqueID, this.cbpService.cbpJson.documentInfo[0].footer);
            this.cbpService.cbpJson.documentInfo[0].footer = this._buildUtil.replaceElement({ dgUniqueID: element.dgUniqueID }, this.elementsRestoreSnapChats.pop(), this.cbpService.cbpJson.documentInfo[0].footer);
            this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(element.dgUniqueID, this.cbpService.cbpJson.documentInfo[0].footer);
            this.undoJson.pop();
          }
        }else{
          element = this._buildUtil.getElementByDgUniqueID(audit.DgUniqueID, this.cbpService.cbpJson.section);
          this.cbpService.cbpJson.section = this._buildUtil.replaceElement({ dgUniqueID: audit.DgUniqueID }, this.elementsRestoreSnapChats.pop(), this.cbpService.cbpJson.section);
          this.undoJson.pop();
        }
    } else if (audit.AuditType == AuditTypes.MEDIA_FILE) {
      this.undoDeleteMediaFile(audit);
    }
    else if (audit.AuditType === AuditTypes.TABLE_ENTRY_DELETE) {
      element = this.elementsRestoreSnapChats[this.elementsRestoreSnapChats.length - 1];
      if (element.headerTableItem) {
        let table = this._buildUtil.getElementByDgUniqueID(Number(element.parentDgUniqueID), this.cbpService.cbpJson.documentInfo[0].header.children);
        table.calstable[0].table.tgroup.tbody[0].row[element.row - 1].entry[element.column - 1].children.push(this.elementsRestoreSnapChats.pop());
        this.controlService.setSelectItem(table);
        this.cbpService.isViewUpdated = true;
      }
      else if (element.footerTableItem){
        let table = this._buildUtil.getElementByDgUniqueID(Number(element.parentDgUniqueID), this.cbpService.cbpJson.documentInfo[0].footer.children);
        table.calstable[0].table.tgroup.tbody[0].row[element.row - 1].entry[element.column - 1].children.push(this.elementsRestoreSnapChats.pop());
        this.controlService.setSelectItem(table);
        this.cbpService.isViewUpdated = true;
      }
      else if(audit.headerTab){
        let table = this._buildUtil.getElementByDgUniqueID(element.parentDgUniqId, this.cbpService.cbpJson.documentInfo[0])
      }
      else {
        let table = this._buildUtil.getElementByDgUniqueID(element.parentDgUniqId, this.cbpService.cbpJson.section);
        table.calstable[0].table.tgroup.tbody[0].row[element.row - 1].entry[element.column - 1].children.push(this.elementsRestoreSnapChats.pop());
        this.controlService.setSelectItem(table);
        this.cbpService.isViewUpdated = true;
      }
    }
    else if (audit.AuditType === AuditTypes.TABLE_MEDIA_FILE) {
      element = this.elementsRestoreSnapChats[this.elementsRestoreSnapChats.length - 1];
      let table = this._buildUtil.getElementByDgUniqueID(element.parentDgUniqId, this.cbpService.cbpJson.section);
      table.calstable[0].table.tgroup.tbody[0].row[element.row - 1].entry[element.column - 1].children.push(this.elementsRestoreSnapChats.pop());
      this.cbpService.isViewUpdated = true;
    }
    else {
      if (audit.ParentID) {
        if (audit.AuditType === AuditTypes.TABLE_DELETE_WINDOW) {
          element = this.elementsRestoreSnapChats[this.elementsRestoreSnapChats.length - 1];
          let table = this._buildUtil.getElementByNumber(audit.ParentID, this.cbpService.cbpJson.section);
          //  table.children.push(this.elementsRestoreSnapChats.pop());
          table.children.splice(((element['position']) - 1), 0, this.elementsRestoreSnapChats.pop());

        }
        else if (audit.AuditType === AuditTypes.TABLE_DELETE_SUB_WINDOW) {
          element = this.elementsRestoreSnapChats[this.elementsRestoreSnapChats.length - 1];
          let table = this._buildUtil.getElementByDgUniqueID(element.parentDgUniqId, this.cbpService.cbpJson.section);
          table.calstable[0].table.tgroup.tbody[0].row[element.row - 1].entry[element.column - 1].children.push(this.elementsRestoreSnapChats.pop());
          this.controlService.setSelectItem(table);
          this.cbpService.isViewUpdated = true;
        }
        else if (audit.AuditType === AuditTypes.TABLE_DELETE_DUAL) {
          let table = this._buildUtil.getElementByDgUniqueID(audit.stepParentDgUniqID, this.cbpService.cbpJson.section);
          table.children.push(this.elementsRestoreSnapChats.pop());
        }
        else if (audit.AuditType === AuditTypes.TABLE_DELETE_SUB_DUAL) {
          element = this.elementsRestoreSnapChats[this.elementsRestoreSnapChats.length - 1];
          let table = this._buildUtil.getElementByDgUniqueID(element.parentDgUniqId, this.cbpService.cbpJson.section);
          table.calstable[0].table.tgroup.tbody[0].row[element.row - 1].entry[element.column - 1].children.push(this.elementsRestoreSnapChats.pop());
          this.cbpService.isViewUpdated = true;
        }
        else {
          //  if(audit.AuditType === AuditTypes.DUALSTEP){
          //     let stepElement = this._buildUtil.getElementByNumber(audit.ParentID, this.cbpService.cbpJson.section);
          //     this.cbpService.cbpJson.section = this._buildUtil.replaceElement({dgUniqueID: stepElement.dgUniqueID}, this.elementsRestoreSnapChats.pop(), this.cbpService.cbpJson.section)
          //   }
          //  else{
          //   element = this._buildUtil.getElementByNumber(audit.ParentID, this.cbpService.cbpJson.section);
          //   this.cbpService.cbpJson.section = this._buildUtil.replaceElement({dgUniqueID: element.dgUniqueID}, this.elementsRestoreSnapChats.pop(), this.cbpService.cbpJson.section);
          //  }
          if (audit.AuditType === AuditTypes.DUALSTEP) {
            let stepElement = this._buildUtil.getElementByNumber(audit.ParentID, this.cbpService.cbpJson.section);
            if (stepElement.length == 3) {
              let step = this.elementsRestoreSnapChats.pop();
              if (JSON.stringify(stepElement[1]) !== JSON.stringify(step[1])) {
                this.cbpService.cbpJson.section = this._buildUtil.replaceElement({ dgUniqueID: step[1].dgUniqueID }, step[1], this.cbpService.cbpJson.section)
              } else if (JSON.stringify(stepElement[2]) !== JSON.stringify(step[2])) {
                this.cbpService.cbpJson.section = this._buildUtil.replaceElement({ dgUniqueID: step[2].dgUniqueID }, step[2], this.cbpService.cbpJson.section)
              }
            } else {
              this.cbpService.cbpJson.section = this._buildUtil.replaceElement({ dgUniqueID: stepElement.dgUniqueID }, this.elementsRestoreSnapChats.pop(), this.cbpService.cbpJson.section)

            }
          }
        }
      }
      else {
        if (audit.AuditType !== AuditTypes.TABLE_DELETE_HEADER && audit.AuditType !== AuditTypes.TABLE_DELETE_FOOTER) {
          element = this.cbpService.cbpJson.section;
          this.cbpService.cbpJson.section = this.elementsRestoreSnapChats.pop();
        }
      }
    }
    if (audit.AuditType === AuditTypes.TABLE_ENTRY_DELETE) {
      this.cbpService.tableDataEntrySelected = element;
      this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(element.parentDgUniqId, this.cbpService.cbpJson.section);
      this.redoJson.push(this.undoJson.pop());
    }
    if(audit.AuditType === AuditTypes.TABLE_DELETE_HEADER){
      if(this.cbpService.cbpJson.documentInfo[0].header.dgType=="Header"){
      element = this.elementsRestoreHeader[this.elementsRestoreHeader.length-1]
      this.cbpService.cbpJson.documentInfo[0].header.children.push(this.elementsRestoreHeader.pop())
      this.undoJson.pop()
      this.cbpService.isViewUpdated = true;
      }
    }
    if(audit.AuditType === AuditTypes.TABLE_DELETE_FOOTER){
      element = this.elementsRestoreHeader[this.elementsRestoreHeader.length - 1];
      this.cbpService.cbpJson.documentInfo[0].footer.children.push(this.elementsRestoreHeader.pop())
      this.undoJson.pop()
      this.cbpService.isViewUpdated = true;
    } 
    else {
      this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(audit.DgUniqueID, this.cbpService.cbpJson.section);
      this.cbpService.selectedUniqueId = audit.DgUniqueID;
      if (!this.cbpService.selectedElement) {
        this.cbpService.selectedElement = this._buildUtil.getElementByNumber(audit.ParentID, this.cbpService.cbpJson.section);
        this.cbpService.selectedUniqueId = this.cbpService.selectedElement.dgUniqueID;
        this.cbpService.selectedElement.children = this.elementsRestoreSnapChats.pop().children;
      }
      this.redoJson.push(this.undoJson.pop());
      this.controlService.setMediaItem(this.cbpService.media);
      this.cdref.detectChanges();
    }
  }
  doUpdateUndo(audit: Audit, element: any) {
    if (!element)
      return;
    if (audit.Index == null || audit.Index == undefined) {
      const propName: string = new AuditPropertyMapper()[audit.AuditType];
      if (propName && audit.AuditType != AuditTypes.TABLE_FIELD_NAME) {
        if (audit.DgUniqueID != 0) {
          if (audit.AuditType.indexOf('EMBEDED') > -1) {
            switch (audit.AuditType) {
              case AuditTypes.EMBEDED_TITLE:
              case AuditTypes.EMBEDED_DESCRIPTION:
                element[propName] = audit.OldText;
                this.cbpService.isViewUpdated = true;
                break;
              default:
                if (AuditTypes.EMBEDED_DOC_NUM) {
                  element.children = [];
                  let titleObj = this._buildUtil.setIconAndText(element);
                  let obj = { text: titleObj.text, number: element.number, dgUniqueId: element.dgUniqueID, dgType: element.dgType };
                  this.cbpService.headerItem = obj;
                }
                element['property'][propName] = audit.OldText;
                this.cbpService.isViewUpdated = true;
                break;
            }
          } else if (propName.toLowerCase() == 'prompt') {
            if (element['prompt']) {
              element['prompt'] = audit.OldText;
              this.cbpService.isViewUpdated = true;
            } else {
              element['Prompt'] = audit.OldText;
              this.cbpService.isViewUpdated = true;
            }
          }
          else if (propName.toLowerCase() == 'equation') {
            element['content'][propName] = audit.OldText;
            this.cbpService.isViewUpdated = true;
          }
          else {
            element[propName] = audit.OldText;
            this.cbpService.isViewUpdated = true;
            switch (audit.AuditType) {
              case AuditTypes.PROPERTY_TABLE_LENGTH:
              case AuditTypes.PROPERTY_TABLE_MAX:
              case AuditTypes.PROPERTY_TABLE_MIN:
              case AuditTypes.PROPERTY_TABLE_NAME:
              case AuditTypes.PROPERTY_TABLE_REQ:
              case AuditTypes.PROPERTY_TABLE_REQ_UNIT:
              case AuditTypes.PROPERTY_TABLE_RIGHT:
              case AuditTypes.PROPERTY_TABLE_LEFT:
              case AuditTypes.PROPERTY_TABLE_RIGHT_LABEL:
              case AuditTypes.PROPERTY_TABLE_LEFT_LABEL:
              case AuditTypes.PROPERTY_TABLE_SHOWLABEL:
              case AuditTypes.PROPERTY_TABLE_TIME_DISPLAY:
              case AuditTypes.PROPERTY_TABLE_UNIT:
              case AuditTypes.PROPERTY_TABLE_BOOLEAN_DISPLAY_FALSE:
              case AuditTypes.PROPERTY_TABLE_BOOLEAN_DISPLAY_TRUE:
              case AuditTypes.PROPERTY_TABLE_DECIMAL:
              case AuditTypes.PROPERTY_TABLE_DEFAULT_VALUE:
              case AuditTypes.PROPERTY_TABLE_DATE_DISPLAY:
              case AuditTypes.PROPERTY_TABLE_VALUE:
              case AuditTypes.PROPERTY_VALUE_OPTION:
              case AuditTypes.PROPERTY_TABLE_DATAENTRYSIZE:
              case AuditTypes.TABLETEXT:
                this.cbpService.tableDataEntrySelected = element;
                this.cbpService.isViewUpdated = true;
                this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(element.parentDgUniqId, this.cbpService.cbpJson.section);
                break;
            }
            if (element.dgSequenceNumber && (propName == 'title' || propName == 'action')) {
              let text = element[propName] ? element[propName].slice(0, 25) : '';
              element.text = element.number + ' ' + text + (text.length > 25 ? '...' : '');
              let titleObj = this._buildUtil.setIconAndText(element);
              let obj = { text: titleObj.text, number: element.number, dgUniqueId: element.dgUniqueID, dgType: element.dgType };
              this.cbpService.headerItem = obj;
            } else if (element.dgSequenceNumber && (propName == 'numberedChildren')) {
              this.checkAndChangesNumberedSteps(audit.OldText);
            }
            else if (element.dgSequenceNumber && (propName == 'isCritical')) {
              let titleObj = this._buildUtil.setIconAndText(element);
              let obj = { text: titleObj.text, number: element.number, dgUniqueId: element.dgUniqueID, dgType: element.dgType };
              this.cbpService.headerItem = obj;
            }
            else if (element.dgSequenceNumber && (propName == 'actionText')) {
              this.cbpService.selectedElement.actionText = '';
            }
            else if (element.source === '') {
              element.uri = '';
            }
            else if (element.dgSequenceNumber || (propName == 'VerificationType')) {
              this.cbpService.selectedElement.Prompt = 'Requires ' + element.VerificationType + ' Verification';
            }
          }
        } else {
          this.cbpService.cbpJson.documentInfo[0][propName] = audit.OldText;
        }
      } else {
        this.doMapAndUndo(audit, element)
      }
    } else {
      this.doIndexBasedUndo(audit, element);
    }
    this.redoJson.push(this.undoJson.pop());
  }
  async doInsertUndo(audit: Audit, element: any, section: Array<any>) {
    if (!element) { return }
    if (audit.AuditType === AuditTypes.TABLE_COLUMN_ADD ||
      audit.AuditType === AuditTypes.TABLE_ROW_ADD || audit.AuditType == AuditTypes.TABLE_CELL_SPILIT || audit.AuditType === AuditTypes.TABLE_ROW_ADD_DIRECTION
    || audit.AuditType === AuditTypes.TABLE_CELL_MERGE) {
      if(audit.headerTab){
        element = this._buildUtil.getElementByDgUniqueID(audit.DgUniqueID, this.cbpService.cbpJson.documentInfo[0].header);
        if(audit.AuditType == AuditTypes.TABLE_CELL_SPILIT){
          if(element){
            this.cbpService.cbpJson.documentInfo[0].header = this._buildUtil.replaceElement({ dgUniqueID: element.dgUniqueID }, null, this.cbpService.cbpJson.documentInfo[0].header);
            this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(element.dgUniqueID, this.cbpService.cbpJson.documentInfo[0].header);
            this.cbpService.selectedUniqueId = audit.DgUniqueID;
            this.redoJson.push(this.undoJson.pop());
          }else{
            element = this._buildUtil.getElementByDgUniqueID(audit.DgUniqueID, this.cbpService.cbpJson.documentInfo[0].footer);
            this.cbpService.cbpJson.documentInfo[0].footer = this._buildUtil.replaceElement({ dgUniqueID: element.dgUniqueID }, null, this.cbpService.cbpJson.documentInfo[0].footer);
            this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(element.dgUniqueID, this.cbpService.cbpJson.documentInfo[0].footer);
            this.cbpService.selectedUniqueId = audit.DgUniqueID;
            this.redoJson.push(this.undoJson.pop());
          }
        }
        else{
          if(element){
            this.cbpService.cbpJson.documentInfo[0].header = this._buildUtil.replaceElement({ dgUniqueID: element.dgUniqueID }, this.elementsRestoreSnapChats.pop(), this.cbpService.cbpJson.documentInfo[0].header);
            this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(element.dgUniqueID, this.cbpService.cbpJson.documentInfo[0].header);
            this.cbpService.selectedUniqueId = audit.DgUniqueID;
            this.redoJson.push(this.undoJson.pop());
          }else{
            element = this._buildUtil.getElementByDgUniqueID(audit.DgUniqueID, this.cbpService.cbpJson.documentInfo[0].footer);
            this.cbpService.cbpJson.documentInfo[0].footer = this._buildUtil.replaceElement({ dgUniqueID: element.dgUniqueID }, this.elementsRestoreSnapChats.pop(), this.cbpService.cbpJson.documentInfo[0].footer);
            this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(element.dgUniqueID, this.cbpService.cbpJson.documentInfo[0].footer);
            this.cbpService.selectedUniqueId = audit.DgUniqueID;
            this.redoJson.push(this.undoJson.pop());
          }
        }

      }
      else{
        if(audit.AuditType == AuditTypes.TABLE_CELL_SPILIT){
          element = this._buildUtil.getElementByDgUniqueID(Number(audit.DgUniqueID), this.cbpService.cbpJson.section);
          if(element){
            this.cbpService.cbpJson.section = this._buildUtil.replaceElement({ dgUniqueID: element.dgUniqueID }, null, this.cbpService.cbpJson.section);
            this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(element.dgUniqueID, this.cbpService.cbpJson.section);
            this.cbpService.selectedUniqueId = audit.DgUniqueID;
            this.redoJson.push(this.undoJson.pop());
          }
          else{
            element = this._buildUtil.getElementByDgUniqueID(audit.DgUniqueID.toString(), this.cbpService.cbpJson.section);
              this.cbpService.cbpJson.section = this._buildUtil.replaceElement({ dgUniqueID: element.dgUniqueID }, null, this.cbpService.cbpJson.section);
              this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(element.dgUniqueID, this.cbpService.cbpJson.section);
              this.cbpService.selectedUniqueId = audit.DgUniqueID;
              this.redoJson.push(this.undoJson.pop());
            }
          }
        else{
          element = this._buildUtil.getElementByDgUniqueID(audit.DgUniqueID, this.cbpService.cbpJson.section);
          this.cbpService.cbpJson.section = this._buildUtil.replaceElement({ dgUniqueID: element.dgUniqueID }, this.elementsRestoreSnapChats.pop(), this.cbpService.cbpJson.section);
          this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(element.dgUniqueID, this.cbpService.cbpJson.section);
          this.cbpService.selectedUniqueId = audit.DgUniqueID;
          this.redoJson.push(this.undoJson.pop());
        }

        
      }
    } 
    else if (audit.AuditType == AuditTypes.MEDIA_FILE) {
      this.undoInsertMediaFile(audit);
    }
    else {
      if (audit.headerTab) {
        this.undoAudit.next(audit);
      }
      else if (audit.AuditType !== AuditTypes.TABLE_ENTRY_HEADER_ADD) {
        if (await this.cbpService.deleteElement(element, audit, false)) {
          this.redoJson.push(this.undoJson.pop());
          this.cbpService.isViewUpdated = true;
        }
      }
      if (audit.AuditType === AuditTypes.TABLE_ENTRY_HEADER_ADD){
        if (await this.cbpService.deleteElement(element, audit, false)) {
          this.redoJson.push(this.undoJson.pop());
          this.cbpService.isViewUpdated = true;
        }
      }
       if (audit.AuditType === AuditTypes.TABLE_ENTRY_FOOTER_ADD){
        if (await this.cbpService.deleteElement(element, audit, false)) {
          this.redoJson.push(this.undoJson.pop());
          this.cbpService.isViewUpdated = true;
        }
      }
      if (audit.AuditType === AuditTypes.TABLE) {
        if(audit.headerTab){
          element = this._buildUtil.getElementByDgUniqueID(audit.DgUniqueID, this.cbpService.cbpJson.documentInfo[0].header);
          if(element){
            this.cbpService.cbpJson.documentInfo[0].header = this._buildUtil.replaceElement({ dgUniqueID: element.dgUniqueID }, this.elementsRestoreSnapChats.pop(), this.cbpService.cbpJson.documentInfo[0].header);
            this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(element.dgUniqueID, this.cbpService.cbpJson.documentInfo[0].header);
            this.cbpService.selectedUniqueId = audit.DgUniqueID;
            this.redoJson.push(this.undoJson.pop());
          }else{
            element = this._buildUtil.getElementByDgUniqueID(audit.DgUniqueID, this.cbpService.cbpJson.documentInfo[0].footer);
            this.cbpService.cbpJson.documentInfo[0].footer = this._buildUtil.replaceElement({ dgUniqueID: element.dgUniqueID }, this.elementsRestoreSnapChats.pop(), this.cbpService.cbpJson.documentInfo[0].footer);
            this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(element.dgUniqueID, this.cbpService.cbpJson.documentInfo[0].footer);
            this.cbpService.selectedUniqueId = audit.DgUniqueID;
            this.redoJson.push(this.undoJson.pop());
          }
        }
        this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(element.parentTableDgUniqueID, this.cbpService.cbpJson.section);
        this.cbpService.selectedUniqueId = audit.DgUniqueID;
      }
      if (audit.AuditType === AuditTypes.TABLE_ENTRY_ADD) {
        this.cbpService.tableDataEntrySelected = '';
        this.cbpService.isViewUpdated = true;
        this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(element.parentDgUniqId, this.cbpService.cbpJson.section);
        this.cbpService.selectedUniqueId = audit.DgUniqueID;
      }
      if (audit.AuditType === AuditTypes.TABLE_SUB_ENTRY_ADD) {
        this.cbpService.tableDataEntrySelected = '';
        this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(element.parentDgUniqId, this.cbpService.cbpJson.section);
        this.cbpService.selectedUniqueId = audit.DgUniqueID;
      }

    }
  }
  undoInsertMediaFile(audit: Audit | any) {
    const element = this._buildUtil.getElementByDgUniqueID(audit.DgUniqueID, this.cbpService.cbpJson.section);
    let imageObj = element.images[audit.Index];
    element.images.forEach((image: { name: string | any[]; }, mindex: any) => {
      if (image.name.includes(imageObj.fileName)) {
        element.images.splice(mindex, 1);
      }
    })
    this.redoJson.push(this.undoJson.pop());

    this.cbpService.media.forEach((image: { name: string | any[]; }, mindex: any) => {
      if (image.name.includes(imageObj.fileName)) {
        this.cbpService.media.splice(mindex, 1);
      }
    })
    this.cbpService.isViewUpdated = true;
  }
  undoDeleteMediaFile(audit: Audit) {
    const element = this._buildUtil.getElementByDgUniqueID(audit.DgUniqueID, this.cbpService.cbpJson.section);
    let snapChat = this.elementsRestoreSnapChats.pop();
    element.images.push(snapChat);
    this.saveFile = snapChat;
    this.cbpService.cbpZip.media.push(this.saveFile);
    this.redoJson.push(this.undoJson.pop());
  }
  doMapAndUndo(audit: Audit, element: any) {
    switch (audit.AuditType) {
      case AuditTypes.INDENT_LEFT:
        return this.undoIndentLeft(audit);
      case AuditTypes.INDENT_RIGHT:
        return this.undoIndentRight(audit);
      case AuditTypes.COPY:
      case AuditTypes.CUT:
        return this.undoCutOrCopy(audit, element);
      case AuditTypes.PASTE:
        return this.undoPaste(audit, element);
      case AuditTypes.DELETE:
        return this.undoDelete(audit, element);
      case AuditTypes.SEQUENCE:
        return this.undoSequence(audit, element);
      case AuditTypes.PROPERTY_FOOTER:
        return this.undoFooter(audit, element);
      case AuditTypes.PROPERTY_HEADER:
        return this.undoHeader(audit, element);
      case AuditTypes.PROPERTY_WATER_MARK:
        return this.undoWaterMark(audit, element);
      case AuditTypes.PROPERTY_TYPE:
        return this.undoType(audit, element);
      case AuditTypes.PROPERTY_STEP_TYPE:
        return this.undoStepType(audit, element);
      case AuditTypes.COMPONENT_INFO:
        return this.undoComponentInfo(audit, element);
      case AuditTypes.REPLACE:
        return this.undoReplace(audit, element);
      case AuditTypes.TABLE_FIELD_NAME:
        return this.undoTableFieldName(audit, element);
      case AuditTypes.MOVE_UP:
        return this.undoMoveUp(audit, element);
      case AuditTypes.MOVE_DOWN:
        return this.undoMoveDown(audit, element);
      case AuditTypes.PROPERTY_CHECK_VALUE:
        return this.updateCheckBox(audit, element);
      case AuditTypes.PROPERTY_TABLE_DGTYPE:
        return this.undoDataEntryDgType(audit, element);
      default:
        return null;
    }
  }
  undoDataEntryDgType(audit: Audit, element: any) {
    if (element.dgType === DgTypes.TextAreaDataEntry || element.dgType === DgTypes.NumericDataEntry) {
      element.dgType = audit.OldText;
      this.cbpService.tableDataEntrySelected = element;
      return element;
    }
  }
  undoMoveDown(audit: Audit, element: any) {
    if (element.dgType === DgTypes.Section || element.dgType === DgTypes.StepAction || element.dgType === DgTypes.StepInfo
      || element.dgType === DgTypes.DelayStep || element.dgType === DgTypes.Timed || element.dgType === DgTypes.Repeat) {
      this.cbpService.moveUpNumberedElements(element, audit.DgUniqueID);
    } else {
      this.cbpService.upArrowData(audit.DgUniqueID);
    }
  }
  updateCheckBox(audit: any, element: any) {
    if (audit.OldText == 'Normal') {
      this.cbpService.selectedElement.selected = false;
      this.cbpService.selectedElement.valueType = 'Normal';
    }
  }
  undoMoveUp(audit: Audit, element: any) {
    if (element.dgType === DgTypes.Section || element.dgType === DgTypes.StepAction || element.dgType === DgTypes.StepInfo
      || element.dgType === DgTypes.DelayStep || element.dgType === DgTypes.Timed || element.dgType === DgTypes.Repeat) {
      this.cbpService.moveDownNumberedElements(element, audit.DgUniqueID);
    } else {
      this.cbpService.downArrowData(audit.DgUniqueID);
    }
  }
  undoTableFieldName(audit: Audit | any, element: any) {
    element.calstable[0].table.tgroup.thead.forEach((item: any, index: any) => {
      if (index == (audit.ColumnIndex - 1)) {
        item.fieldName = audit.OldText;
      }
    })
  }
  undoReplace(audit: Audit | any, element: any) {
    element[audit.PropName] = audit.OldText;
  }
  undoComponentInfo(audit: Audit | any, element: any) {
    element['componentInformation'] = JSON.parse(audit.OldText);
  }
  undoStepType(audit: Audit, element: any) {
    element.stepType = audit.OldText;
    this.undoAudit.next(audit);
  }
  undoType(audit: Audit, element: any) {
    if (audit.OldText == DgTypes.Section)
      this.cbpService.selectedDgType = DgTypes.Section;
    if (audit.OldText == DgTypes.StepAction)
      this.cbpService.selectedDgType = DgTypes.StepAction;
  }
  undoWaterMark(audit: Audit, element: any = null) {
    this.cbpService.waterMarkValue = audit.OldText;
    this.cbpService.cbpJson.documentInfo[0].waterMarkOptions.text = this.cbpService.waterMarkValue;
    this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions'] = Object.assign({},
      this.cbpService.cbpJson.documentInfo[0]['waterMarkOptions'], this.cbpService.waterMarkValue);
  }
  undoHeader(audit: Audit, element: any = null) {
    this.cbpService.cbpJson.documentInfo[0].header.title = audit.OldText;
  }
  undoFooter(audit: Audit, element: any) {
    this.cbpService.cbpJson.documentInfo[0].header.title = audit.OldText;
  }
  undoSequence(audit: Audit, element: any) {
    switch (audit.OldText) {
      case SequenceTypes.DGSEQUENCES:
        this._buildUtil.numberedSteps(element, this.cbpService.cbpJson.section);
        break;
      case SequenceTypes.BULLETS:
        this._buildUtil.otherSteps(element, this.cbpService.cbpJson.section, SequenceTypes.BULLETS);
        break;
      case SequenceTypes.STAR:
        this._buildUtil.otherSteps(element, this.cbpService.cbpJson.section, SequenceTypes.STAR);
        break;
      case SequenceTypes.CHECKMARK:
        this._buildUtil.otherSteps(element, this.cbpService.cbpJson.section, SequenceTypes.CHECKMARK);
        break;
      case SequenceTypes.SQUARE:
        this._buildUtil.otherSteps(element, this.cbpService.cbpJson.section, SequenceTypes.SQUARE);
        break;
      case SequenceTypes.CIRCLE:
        this._buildUtil.otherSteps(element, this.cbpService.cbpJson.section, SequenceTypes.CIRCLE);
        break;
      case SequenceTypes.ARROW:
        this._buildUtil.otherSteps(element, this.cbpService.cbpJson.section, SequenceTypes.ARROW);
        break;
      case SequenceTypes.NUMERIC:
        this._buildUtil.numberedList(element, this.cbpService.cbpJson.section);
        break;
      case SequenceTypes.ALPHABETICAL:
        this._buildUtil.alphabeticList(element, audit.OldText);
        break;
      case SequenceTypes.CAPITALALPHABETICAL:
        this._buildUtil.alphabeticList(element, audit.OldText);
        break;
      case SequenceTypes.ROMAN:
        this._buildUtil.alphabeticList(element, audit.OldText);
        break;
      case SequenceTypes.CAPITALROMAN:
        this._buildUtil.alphabeticList(element, audit.OldText);
        break;
      default:
        break;
    }
    this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
  }
  undoDelete(audit: Audit, element: any) {
    throw new Error('Method not implemented.');
  }
  async undoPaste(audit: Audit, element: any) {
    if (!element) { return }
    if (await this.cbpService.deleteElement(element, false, false)) {
      // this.redoJson.push(this.undoJson.pop());
      let obj = this.elementsRestoreSnapChats.pop();
      if (!Array.isArray(obj)) {
        element = this._buildUtil.getElementByDgUniqueID(obj.dgUniqueID, this.cbpService.cbpJson.section);
        this.cbpService.cbpJson.section = this._buildUtil.replaceElement(element, obj, this.cbpService.cbpJson.section);
      } else {
        this.cbpService.cbpJson.section = obj;
      }
    }
  }
  undoCutOrCopy(audit: Audit, element: any) {
    this.cbpService.elementForCopyOrCut = null;
  }
  undoIndentRight(audit: Audit) {
    let element;
    if (audit?.ParentID) {
      element = this._buildUtil.getElementByNumber(audit.ParentID, this.cbpService.cbpJson.section);
      this.cbpService.cbpJson.section = this._buildUtil.replaceElement(element, this.elementsRestoreSnapChats.pop(), this.cbpService.cbpJson.section);
    } else {
      element = this.cbpService.cbpJson.section;
      this.cbpService.cbpJson.section = this.elementsRestoreSnapChats.pop();
    }
    this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(audit.DgUniqueID, this.cbpService.cbpJson.section);
    this.cbpService.selectedUniqueId = audit.DgUniqueID;
    this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
    // this.redoJson.push(this.undoJson.pop());
  }
  undoIndentLeft(audit: Audit) {
    let element;
    if (audit?.ParentID) {
      element = this._buildUtil.getElementByNumber(audit.ParentID, this.cbpService.cbpJson.section);
      this.cbpService.cbpJson.section = this._buildUtil.replaceElement(element, this.elementsRestoreSnapChats.pop(), this.cbpService.cbpJson.section);
    } else {
      element = this.cbpService.cbpJson.section;
      this.cbpService.cbpJson.section = this.elementsRestoreSnapChats.pop();
    }
    this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(audit.DgUniqueID, this.cbpService.cbpJson.section);
    this.cbpService.selectedUniqueId = audit.DgUniqueID;
    this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
    // this.redoJson.push(this.undoJson.pop());
  }
  doIndexBasedUndo(audit: Audit | any, element: any,) {
    switch (audit.AuditType) {
      case AuditTypes.NOTE:
        element.notes[audit.Index] = audit.OldText;
        this.cbpService.isViewUpdated = true;
        return;
      case AuditTypes.ALARA:
        element.alaraNotes[audit.Index] = audit.OldText;
        this.cbpService.isViewUpdated = true;
        return;
      case AuditTypes.MEDIA:
        element.notes[audit.Index] = audit.OldText;
        // this.redoJson.push(this.undoJson.pop());
        return;
      case AuditTypes.PROPERTY_MEDIA_CAPTION:
        element.images = [...element.images];
        element.images[audit.Index] = { ...element.images[audit.Index], caption: audit.OldText };
        this.cbpService.isViewUpdated = true;
        this.cdref.detectChanges();
        return;
      case AuditTypes.PROPERTY_MEDIA_DESC:
        element.images = [...element.images];
        element.images[audit.Index] = { ...element.images[audit.Index], description: audit.OldText };
        this.cbpService.isViewUpdated = true;
        this.cdref.detectChanges();
        return;
      case AuditTypes.PROPERY_DROPDOWN_VALUE:
        element.choice[audit.Index] = audit.OldText;
        // this.redoJson.push(this.undoJson.pop());
        return;
      case AuditTypes.PROPERY_TABLE_DROPDOWN_VALUE:
        element.choice[audit.Index] = audit.OldText;
        // this.redoJson.push(this.undoJson.pop());
        this.cbpService.tableDataEntrySelected = element;
        this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(element.parentDgUniqId, this.cbpService.cbpJson.section);
        return;
      default:
        return null;
    }
  }
  getPropName(audit: Audit): string | null {
    switch (audit.AuditType) {
      case AuditTypes.TITLE:
        return 'title';
      case AuditTypes.CAUSE:
        return 'cause';
      case AuditTypes.EFFECT:
        return 'effect';
      case AuditTypes.NOTE:
        return 'note';
      case AuditTypes.TEXT:
        return 'text';
      case AuditTypes.PROMPT:
        return 'prompt';
      case AuditTypes.CAPTION:
        return 'caption';
      case AuditTypes.NOTE:
        return 'caption';
      default:
        return null;
    }
  }
  undoAuditAdded(audit: Audit) {
    this.undoAudit.next(audit);
  }
  createLeftIndentSnapChat(indentObj: any, section: any) {
    try {
      const parent = this._buildUtil.getElementByNumber(indentObj.parentID, section);
      let superParent;
      if (parent.parentID) {
        superParent = this._buildUtil.getElementByNumber(parent.parentID, section);
      } else {
        superParent = section;
      }
      if (superParent) {
        this.elementsRestoreSnapChats.push(superParent);
      }
    } catch (error) {
      console.error(error);
    }
  }
  createRightIndentSnapChat(indentObj: any, section: any) {
    try {
      const parent = this._buildUtil.getElementByNumber(indentObj.parentID, section);
      if (parent) {
        this.elementsRestoreSnapChats.push(JSON.parse(JSON.stringify(parent)));
      }
    } catch (error) {
      console.error(error)
    }
  }
  //REPLACE AUDIT
  createReplaceAudit(fieldSnapChat: any, field: any, propName: any) {
    try {
      propName = this.getAuditType(fieldSnapChat, propName);
      this.createEntry(fieldSnapChat, field, Actions.Update, AuditTypes.REPLACE, { propName: propName });
    } catch (error) {
      console.error(error)
    }
  }
  getAuditType(item: any, propName: any) {
    if (item.dgType === DgTypes.Section || item.dgType === DgTypes.StepInfo || item.dgType === DgTypes.Para
      || item.dgType === DgTypes.DelayStep) {
      if (item.dgType === DgTypes.Section || item.dgType === DgTypes.DelayStep) {
        return 'title'
      }
      if (item.dgType === DgTypes.StepInfo || item.dgType === DgTypes.Para) {
        return 'title'
      }
    } else if (item.dgType === DgTypes.StepAction || item.dgType === DgTypes.Timed || item.dgType === DgTypes.Repeat) {
      return 'action'
    } else if (item.dgType === DgTypes.Warning || item.dgType === DgTypes.Caution) {
      if (propName) {
        if (propName == 'cause') {
          return 'cause'
        }
        if (propName == 'effect') {
          return 'effect'
        }
      }
    } else if (item.dgType === DgTypes.Address) {
      return 'title'

    } else if (item.dgType === DgTypes.Figures) {
      return 'caption'
    } else if (item.dgType === DgTypes.Link) {
      return 'caption'
    } else if (item.dgType === DgTypes.LabelDataEntry || item.dgType === DgTypes.TextDataEntry
      || item.dgType === DgTypes.NumericDataEntry || item.dgType === DgTypes.DateDataEntry
      || item.dgType === DgTypes.BooleanDataEntry || item.dgType === DgTypes.CheckboxDataEntry
      || item.dgType === DgTypes.VerificationDataEntry || item.dgType === DgTypes.InitialDataEntry
    ) {
      return 'prompt'
    }
  }
  //UTILS
  checkAndChangesNumberedSteps(state: any) {
    this.cbpService.selectedElement.numberedChildren = state;
    if (state) {
      this.cbpService.selectedElement.usage = this.cbpService.docUsage;
      if (this.cbpService.docUsage === Dependency.Information) {
        this.cbpService.selectedElement.dependency = Dependency.Independent;
      } else {
        this.cbpService.selectedElement.dependency = Dependency.Default;
      }
      this._buildUtil.numberedSteps(this.cbpService.selectedElement, this.cbpService.cbpJson.section);
    } else {
      this.cbpService.selectedElement.usage = Dependency.Information;
      this.cbpService.selectedElement.dependency = Dependency.Independent;
      this._buildUtil.unNumberedSteps(this.cbpService.selectedElement, this.cbpService.cbpJson.section);
    }
    this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
  }
  resetData() {
    this.auditJson = [];
    this.undoJson = [];
    this.redoJson = [];
    this.currentMode = AuditModes.AUDIT;
  }

  //step Option
  setArrowVisibility(field: any, direction: any) {
    if (!this.cbpService.coverPageViewEnable && !this.cbpService.documentSelected && this.cbpService.sectionHover) {
      if (field?.parentID != null && field?.parentID != undefined) {
        const parentElemnt = JSON.parse(JSON.stringify(this._buildUtil.getElementByNumber(field.parentID, this.cbpService.cbpJson.section)));
        let dataEntryList: any = [];
        if (parentElemnt) {
          parentElemnt.children.forEach((element: any) => { if (element.dgSequenceNumber == null || element.dgSequenceNumber == undefined) { dataEntryList.push(element); } });
          const fieldPostion = dataEntryList.map((field: any) => { return field.dgUniqueID; }).indexOf(field.dgUniqueID);
          if (fieldPostion == 0 && dataEntryList[1] != null) {
            return direction == 'up' ? true : false;
          }
          else if (fieldPostion == 0 && dataEntryList[0] != null && fieldPostion == dataEntryList.length - 1) {
            return true;
          }
          else if (fieldPostion != 0 && fieldPostion != dataEntryList.length - 1) {
            return false;
          }
          else {
            return direction == 'up' ? false : true;
          }
        }
      }
    }
  }
  settingStepOptionButns(field: any) {
    this.isDownArrowVisible = this.setArrowVisibility(field, 'down');
    this.isUpArrowVisible = this.setArrowVisibility(field, 'up');
    this.cbpService.isViewUpdated = true;
    this.cdref.detectChanges();
  }
}
