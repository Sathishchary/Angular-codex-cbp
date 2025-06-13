import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DgTypes, ImagePath } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { Actions, AuditTypes } from '../../../models';
import { AuditService } from '../../../services/audit.service';
import { CbpService } from '../../../services/cbp.service';
import { ControlService } from '../../../services/control.service';
import { BuilderUtil } from '../../../util/builder-util';
import { HyperLinkService } from '../../services/hyper-link.service';

@Component({
  selector: 'lib-editor-text',
  templateUrl: './prompt.component.html',
  styleUrls: ['../../../util/atoms.css']
})
export class PromptComponent implements OnInit {

  @Input() field: any = {};
  @Input() placeholder: any = {};
  AuditTypes: typeof AuditTypes = AuditTypes;
  DgTypes: typeof DgTypes = DgTypes;
  ImagePath: typeof ImagePath = ImagePath;
  styleObject: any;
  subScription!: Subscription;
  setItemSubscription!: Subscription;
  @Output() fieldChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();
  @Output() linkDataEntry: EventEmitter<any> = new EventEmitter<any>();
  currentField: any;
  propName = 'prompt';

  constructor(public cbpService: CbpService, public auditService: AuditService, public _buildUtil: BuilderUtil,
    public cdref: ChangeDetectorRef, public controlService: ControlService, public hLService: HyperLinkService) { }

  ngOnInit() {
    if (this.field.dgType === DgTypes.Link) {
      this.propName = 'caption';
    }
    this.currentField = JSON.parse(JSON.stringify(this.field));
    this.focus.emit(this.field);
    this.subScription = this.controlService.styleModelobjValue.subscribe((res: any) => {
      if (res && res !== undefined && !this.controlService.isEmpty(res)) {
        let name = this.field.dgType === DgTypes.Link ? 'level' + this.capitalize(this.field.source) : 'levelNormal';
        this.styleObject = this.controlService.setStyles(res[name]);
        // let styleName = name.replace('level', '');
        // if (this.cbpService.styleChangeBarSession?.includes(styleName) && !this._buildUtil.cbpStandalone) {
        //   this.updateChangeBar(this.field);
        // }
        this.cdref.detectChanges();
      }
    });
    this.setItemSubscription = this.controlService.selectedObjValue.subscribe((result: any) => {
      if (result && result !== undefined && result?.dgType !== undefined) {
        this.cbpService.selectedUniqueId = result.dgUniqueID;
        this.cbpService.selectedElement = result;
        this.cdref.detectChanges();
      }
    });
  }

  selectElement() {
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.field));
    this.controlService.setSelectItem(this.field);
    if (this.field.dgType === DgTypes.Link) {
      this.linkDataEntry.emit(this.field);
    }
    if (JSON.stringify(this.field) !== JSON.stringify(this.currentField))
      this.controlService.hideTrackUi({ 'trackUiChange': true });
  }
  createAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    if (this.field.dgType === DgTypes.InitialDataEntry) {
      auditType = AuditTypes.INITIAL_PROMPT;
      optionalParams = { propName: 'prompt' }
    }
    if (this.field.dgType === DgTypes.VerificationDataEntry) {
      auditType = AuditTypes.VERIFICATION_PROMPT;
    }
    if (this.field.dgType === DgTypes.Link) {
      auditType = AuditTypes.CAPTION;
    }
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }
  outputhtml(event: any, item: any, propName: any) {
    if (this.field.dgType === DgTypes.Link) { propName = 'caption'; }
    this.field = this.hLService.outputhtmlNew(event, item, propName);
    this.fieldChange.emit(this.field);
    this.cbpService.isViewUpdated = true;
  }
  editorOpened(item: any, prop = null) {
    this.field = this.hLService.editorOpenednewUpdate(item);
    if (this.field['isHtmlText']) {
      this.field['editorOpened'] = true;
    }
    this.fieldChange.emit(this.field);
  }
  capitalize(s: string) {
    s = s.toLowerCase();
    return s === "" ? 'Normal' : s[0].toUpperCase() + s.slice(1);
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
    // this.field.prompt = event.target.value;
    this.field.dgType === DgTypes.Link ? this.field.caption = event.target.value : this.field.prompt = event.target.value;
    this.viewUpdate()
  }

  onTextareaFocus(field: any) {
    if (field.dgType !== DgTypes.CheckboxDataEntry)
      this.cbpService.selectedElement = field;
    this.cbpService.selectedUniqueId = field.dgUniqueID
  }
  ngOnDestroy() {
    this.subScription?.unsubscribe();
    this.setItemSubscription?.unsubscribe();
  }

  viewUpdate() {
    if (this.field[this.propName] !== this.currentField[this.propName]) {
      this.updateChangeBar(this.field);
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
