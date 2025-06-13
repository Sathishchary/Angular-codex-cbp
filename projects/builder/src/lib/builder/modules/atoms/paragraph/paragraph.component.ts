import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { Actions, AuditTypes } from '../../../models';
import { AuditService } from '../../../services/audit.service';
import { CbpService } from '../../../services/cbp.service';
import { ControlService } from '../../../services/control.service';
import { BuilderUtil } from '../../../util/builder-util';
import { HyperLinkService } from '../../services/hyper-link.service';

@Component({
  selector: 'app-paragraph',
  templateUrl: './paragraph.component.html'
})
export class ParagraphComponent implements OnInit {
  @Input() field: any = {};
  @Input() rowcolInfo!: any;
  @Input() coverpage: boolean = false;
  @Output() tableEvent: EventEmitter<any> = new EventEmitter();
  isEditEmptyString: boolean = false;
  isEditEditorOpend: boolean = false;
  AuditTypes: typeof AuditTypes = AuditTypes;
  DgTypes: typeof DgTypes = DgTypes;
  setItemSubscription!: Subscription;
  subScription!: Subscription;
  styleObject: any;
  isEmptyString = false;
  @Input() hideTrackUi = false;
  fieldSnapChat: any;
  constructor(public cbpService: CbpService, public auditService: AuditService,
    private controlService: ControlService, public cdr: ChangeDetectorRef, public _buildUtil: BuilderUtil,
    public hLService: HyperLinkService) { }

  ngOnInit() {
    this.field.text = this.field.text ?? '';
    this.field = this.hLService.initEditorPropsNew(this.field);
    this.subScription = this.controlService.styleModelobjValue.subscribe((res: any) => {
      if (res && res !== undefined && !this.controlService.isEmpty(res)) {
        this.styleObject = this.controlService.setStyles(res['levelNormal']);
        if (this.cbpService.styleChangeBarSession?.includes('Normal') && !this._buildUtil.cbpStandalone) {
          this.updateChangeBar(this.field);
        }
        this.cdr.detectChanges();
      }
    });
    this.setItemSubscription = this.controlService.selectedObjValue.subscribe((result: any) => {
      if (result && result !== undefined && result?.dgType !== undefined) {
        this.cbpService.selectedUniqueId = result.dgUniqueID;
        this.cbpService.selectedElement = result;
        if (result.dgType === DgTypes.Section || result.dgType === DgTypes.StepAction || result.dgType === DgTypes.StepInfo) {
          this.cbpService.tableDataEntrySelected = undefined;
        }
        this.cdr.detectChanges();
      }
    });
    this.fieldSnapChat = JSON.parse(JSON.stringify(this.field));
  }

  outputhtml(event: any, item: any, propName: any) {
    this.field.text = event;
    item['editorOpened'] = false;
    this.field = this.hLService.outputhtmlNew(event, item, propName);
    if (this.field.text !== '' && !this.field.isTableDataEntry) {
      this.updateTrackInfo();
      if (this.field.text !== this.auditService.selectedElementSnapchat.text && this.field.dgUniqueID == this.auditService.selectedElementSnapchat.dgUniqueID) {
        this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.field, Actions.Update, AuditTypes.TEXT);
        this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.field));
        this.updatetrackUi();
      }
    }
    else {
      if (this.field.text !== this.auditService.selectedElementSnapchat.text && this.field.dgUniqueID == this.auditService.selectedElementSnapchat.dgUniqueID) {
        this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.field, Actions.Update, AuditTypes.TABLETEXT, { propName: 'text' });
        this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.field));
        this.updatetrackUi();
      } else {
        if (this.cbpService.tableDataEntrySnapChat?.dgUniqueID == this.field.dgUniqueID && this.field.text == this.cbpService.tableDataEntrySnapChat.text) {
          delete this.cbpService.selectedElement['internalRevision'];
        }
      }
    }
    this.field['editorOpened'] = false;
    if (this.field.isTableDataEntry) {
      this.cbpService.isTableEditorOpen = false;
    }
    this.cbpService.checkEditorOpenInTable(false, this.field);
    this.cdr.detectChanges();
  }

  onChangeEvent(event: any) {
    this.field.text = event.target.textContent.replace(/[aeiou]/g, '*');
    if (this.field.text !== '') {
      this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.field, Actions.Update, AuditTypes.TEXT);
      this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.field));
      this.updatetrackUi();
    }
  }
  editorOpened() {
    this.selectElement();
    this.isEmptyString = true;
    this.field['editorOpened'] = true;
    this.cbpService.checkEditorOpenInTable(true, this.field);
    this.field['isHtmlText'] = false;
    this.cdr.detectChanges();
  }
  selectedForTable(event: any) {
    if (this.rowcolInfo) {
      this.cbpService.tableDataEntrySelected = this.field;
      if (event['shiftKey']) {
        this.rowcolInfo['shiftKey'] = event.shiftKey ? true : false;
      } else {
        this.rowcolInfo['shiftKey'] = false;
      }
      this.tableEvent.emit(this.rowcolInfo);
    }
  }
  selectElement() {
    if (this.cbpService.sectionHover) {
      this.auditService.settingStepOptionButns(this.field);
    }
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.field));
    this.controlService.setSelectItem(this.field);
  }
  ngOnDestroy() {
    this.setItemSubscription?.unsubscribe();
    this.subScription?.unsubscribe();
  }
  setField(event: any) {
    //this.cbpService.selectedElement= event;
    console.log(event);
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
  }
  editorClose(event: any) {
    if (event?.from == 'AngularEditor') {
      if (this.cbpService.documentSelected || this.cbpService.selectedElement?.dgType == DgTypes.Form) {
        this.field['editorOpened'] = false;
      }
    }
    if (this.cbpService?.selectedElement?.dgType == DgTypes.Para) {
      this.cbpService.isTableEditorOpen = false;
      this.cbpService.isViewUpdated = true;
      this.field['editorOpened'] = false;
    }
    this.updatetrackUi();
    this.cdr.detectChanges();
  }
  updatetrackUi() {
    if (!this.field.isTableDataEntry) {
      if ((this.fieldSnapChat.text != this.field.text)) {
        this.field = this.cbpService.setUserUpdateInfo(this.field);
        this.controlService.hideTrackUi({ 'trackUiChange': true });
      }
    } else {
      if ((this.fieldSnapChat.text != this.field.text)) {
        let table = this._buildUtil.getElementByDgUniqueID(this.fieldSnapChat.dgUniqueID, this.cbpService.cbpJson);
        this.cbpService.setUserUpdateInfo(table);
        this.controlService.hideTrackUi({ 'trackUiChange': true });
      }
    }
  }
  updateTrackInfo() {
    if ((this.fieldSnapChat.text != this.field.text)) {
      this.field = this.cbpService.setUserUpdateInfo(this.field);
      this.controlService.hideTrackUi({ 'trackUiChange': true });
    }
  }
  updateChangeBar(field: any) {
    if (field.isTableDataEntry) {
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


