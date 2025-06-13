import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DgTypes, ImagePath } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { Actions, AuditTypes } from '../../../models';
import { AuditService } from '../../../services/audit.service';
import { CbpService } from '../../../services/cbp.service';
import { ControlService } from '../../../services/control.service';
import { TableService } from '../../../shared/services/table.service';
import { BuilderUtil } from '../../../util/builder-util';
import { HyperLinkService } from '../../services/hyper-link.service';


@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['../../../util/atoms.css', './label.component.css']
})
export class LabelComponent implements OnInit {
  @Input() field: any = {};
  @Input() rowcolInfo: any = {};
  @Input() coverpage: boolean = false;

  @Output() tableEvent: EventEmitter<any> = new EventEmitter();
  AuditTypes: typeof AuditTypes = AuditTypes;
  DgTypes: typeof DgTypes = DgTypes;
  ImagePath: typeof ImagePath = ImagePath;
  styleObject: any;
  subScription!: Subscription;
  setItemSubscription!: Subscription;
  @Input() hideTrackUi = false;

  fieldSnapChat: any;

  constructor(public cbpService: CbpService, public _buildUtil: BuilderUtil,
    public cdref: ChangeDetectorRef, public controlService: ControlService,
    public auditService: AuditService, public hLService: HyperLinkService,
    public tableService: TableService) { }

  ngOnInit() {
    this.field = this.hLService.initEditorPropsNew(this.field);
    this.field['isHtmlText'] = this.controlService.isHTMLText(this.field['prompt'] || '');
    this.subScription = this.controlService.styleModelobjValue.subscribe((res: any) => {
      if (res && res !== undefined && !this.controlService.isEmpty(res)) {
        this.styleObject = this.controlService.setStyles(res['levelNormal']);
        if (this.cbpService.styleChangeBarSession?.includes('Normal') && !this._buildUtil.cbpStandalone) {
          this.updateChangeBar(this.field);
        }
        this.cdref.detectChanges();
      }
    });
    this.setItemSubscription = this.controlService.selectedObjValue.subscribe((result: any) => {
      if (result && result !== undefined && result?.dgType !== undefined) {
        this.cbpService.selectedUniqueId = result?.dgUniqueID;
        this.cbpService.selectedElement = result;
        if (result.dgType === DgTypes.Section || result.dgType === DgTypes.StepAction || result.dgType === DgTypes.StepInfo) {
          this.cbpService.tableDataEntrySelected = undefined;
        }
        this.cdref.detectChanges();
      }
    });
    this.fieldSnapChat = JSON.parse(JSON.stringify(this.field));
  }
  selectedForTable(event: any) {
    if (!this.tableService.viewMode && !this.cbpService.documentSelected) {
      this.labelSelected(event)
    }
    if (!this.tableService.viewMode && this.cbpService.editCoverPage) {
      this.labelSelected(event)
    }
  }

  labelSelected(event: any) {
    this.cbpService.tableDataEntrySelected = this.field;
    this.cbpService.selectedUniqueId = this.field?.dgUniqueID;
    if (event['shiftKey']) { this.rowcolInfo['shiftKey'] = event.shiftKey ? true : false; } else {
      this.rowcolInfo['shiftKey'] = false;
    }
    this.tableEvent.emit(this.rowcolInfo);
    this.cbpService.isViewUpdated = true;
  }
  selectElement() {
    if (!this.cbpService.editCoverPage && this.cbpService.sectionHover) {
      this.auditService.settingStepOptionButns(this.field);
    }
    if (!this.tableService.viewMode) {
      this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.field));
      this.controlService.setSelectItem(this.field);
    }
  }

  createAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, auditType, optionalParams);
    this.updatetrackUi()
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }
  enableTextarea() {
    (document.getElementById('textarea' + this.field.dgUniqueID) as HTMLElement).focus();
  }

  viewUpdated(item: any) {
    if (item?.isTableDataEntry) {
      this.cbpService.isViewUpdated = true;
    }
    this.updatetrackUi();
  }
  outputhtml(event: any, item: any, propName: any) {
    if (item.isCover)
      this.field.editorOpened = false;
    this.field = this.hLService.outputhtmlNew(event, item, propName);
    if (this.field.prompt !== '' && !this.field?.isTableDataEntry) {
      if (this.field.prompt !== this.auditService.selectedElementSnapchat.prompt && this.field?.dgUniqueID == this.auditService.selectedElementSnapchat.dgUniqueID) {
        this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.field, Actions.Update, AuditTypes.PROMPT);
        this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.field));
        this.updatetrackUi();
      }
    }
    else {
      if (this.field.prompt !== this.auditService.selectedElementSnapchat.prompt && this.field?.dgUniqueID == this.auditService.selectedElementSnapchat.dgUniqueID) {
        this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.field, Actions.Update, AuditTypes.PROMPT_TEXT_TABLE, { propName: 'tabletext' });
        this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.field));
        this.updatetrackUi();
      } else {
        if (this.cbpService.tableDataEntrySnapChat?.dgUniqueID == this.field?.dgUniqueID && this.field.prompt == this.cbpService.tableDataEntrySnapChat.prompt) {
          delete this.cbpService.selectedElement['internalRevision'];
        }
      }
    }
    if (this.field?.isTableDataEntry) {
      this.cbpService.isTableEditorOpen = false;
    }
    this.cbpService.isViewUpdated = true;
    this.cdref.detectChanges();
  }
  setFieldPromptValue(event: any) {
    if (this.field?.isCover) {
      this.cbpService.tableDataEntrySelected.prompt = event;
    }
  }
  editorOpened(item: any, prop = null) {
    if (!this.cbpService.documentSelected || ((item.isCover || this.cbpService.editCoverPage) && item.dgType === DgTypes.LabelDataEntry)) {
      this.field = this.hLService.editorOpenednewUpdate(item);
      if (this.field['isHtmlText']) {
        this.field['editorOpened'] = true;
      }
    }
    else {
      this.field['editorOpened'] = false;
    }
  }

  ngOnDestroy() {
    this.subScription?.unsubscribe();
    this.setItemSubscription?.unsubscribe();
  }

  setField(event: any) {
    //this.cbpService.selectedElement= event;
    // console.log(event);
    let element;
    let propName = '';
    if (event.dgUniqueID != 0) {
      element = this._buildUtil.getElementByDgUniqueID(event.dgUniqueID, this.cbpService.cbpJson.section);
    }
    if (element && (element.dgType === DgTypes.StepAction ||
      element.dgType === DgTypes.DelayStep ||
      element.dgType === DgTypes.Timed ||
      element.dgType === DgTypes.Repeat)
    ) {
      propName = 'action'
    } else if (element) {
      propName = 'prompt'
    }
    let text = event[propName] ? event[propName].slice(0, 25) : '';
    element.title = event[propName];
    element.text = element.number + ' ' + text + (text.length > 25 ? '...' : '');
    element[propName] = event[propName];
    let newText = this._buildUtil.setIconAndText(element);
    let obj = { text: newText.text, number: element.number, dgUniqueId: element.dgUniqueID, dgType: element.dgType };
    this.cbpService.headerItem = obj;
    this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, AuditTypes.PROMPT);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }

  setValue(event: any) {
    this.field.prompt = event.target.value;
    this.viewUpdated(this.field)
  }

  updatetrackUi() {
    if (this.field) {
      if (!this.field?.isTableDataEntry) {
        if ((this.fieldSnapChat.prompt != this.field.prompt)) {
          this.field = this.cbpService.setUserUpdateInfo(this.field);
          this.controlService.hideTrackUi({ 'trackUiChange': true });
        }
      } else {
        if ((this.fieldSnapChat.prompt != this.field.prompt)) {
          this.updateChangeBar(this.field);
        }
      }
    }

  }
  updateChangeBar(field: any) {
    if (field) {
      if (field?.isTableDataEntry) {
        let table = this._buildUtil.getElementByDgUniqueID(this.field.parentDgUniqueID, this.cbpService.cbpJson);
        if (!table) {
          table = this._buildUtil.getElementByDgUniqueID(Number(this.field.parentDgUniqueID), this.cbpService.cbpJson);
        }
        if (table)
          this.cbpService.setUserUpdateInfo(table);
      } else {
        this.field = this.cbpService.setUserUpdateInfo(this.field);
      }
      this.controlService.hideTrackUi({ 'trackUiChange': true });
    }

  }
  editorClose(event: any) {
    if (event?.from == 'AngularEditor') {
      if (this.cbpService.documentSelected || this.cbpService.selectedElement?.dgType == DgTypes.Form) {
        this.field['editorOpened'] = false;
        this.field['isHtmlText'] = this.controlService.isHTMLText(this.field['prompt']);
      }
    }
  }
}
