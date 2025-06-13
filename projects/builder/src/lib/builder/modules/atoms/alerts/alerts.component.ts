import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import { DgTypes, ImagePath } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { Actions, AuditTypes } from '../../../models';
import { AuditService } from '../../../services/audit.service';
import { CbpService } from '../../../services/cbp.service';
import { ControlService } from '../../../services/control.service';
import { BuilderUtil } from '../../../util/builder-util';
import { HyperLinkService } from '../../services/hyper-link.service';
declare var $: any;

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['../../../util/atoms.css']
})
export class AlertsComponent implements AfterViewInit {
  @Input() field: any = {};
  @Input() stepObject: any;
  AuditTypes: typeof AuditTypes = AuditTypes;
  DgTypes: typeof DgTypes = DgTypes;
  ImagePath: typeof ImagePath = ImagePath;
  active = '';
  subScription!: Subscription;
  styleTitleObject: any;
  styleObject: any;
  setItemSubscription!: Subscription;
  activeIndex: any;
  dateTime: any;
  tempNotes: any[] = [];
  textAlign: any = 'center';
  marginTop: any;
  alertImage: any;
  lineHeight = 1.5;
  @Input() hideTrackUi = false;
  @Input() cbpServiceNew!: CbpService;

  fieldSnapChat: any;
  constructor(public cbpService: CbpService,
    public auditService: AuditService, public hLService: HyperLinkService,
    private cdr: ChangeDetectorRef, public controlService: ControlService, public _buildUtil: BuilderUtil) {
  }

  ngAfterViewInit() {
    this.fieldSnapChat = JSON.parse(JSON.stringify(this.field))
    if (this.cbpService.styleImageJson === undefined) {
      this.cbpService = this.cbpServiceNew;
    }
    this.field = this.hLService.initEditorPropsNew(this.field);
    if (this.field.dgType === DgTypes.Note || this.field.dgType === DgTypes.Alara) {
      this.dateTime = new Date().getTime();
      this.tempNotes = this.field.dgType === DgTypes.Note ? this.field.notes : this.field.alaraNotes;
    }
    this.setAlertChanges();
    this.subScription = this.controlService.styleModelobjValue.subscribe((res: any) => {
      if (res && res !== undefined && !this.controlService.isEmpty(res)) {
        this.styleTitleObject = this.controlService.setStyles(res['level' + this.field.dgType + 'Title']);
        this.styleObject = this.controlService.setStyles(res['level' + this.field.dgType]);
        this.setAlertChanges();
        if (this.cbpService.styleChangeBarSession?.includes(this.field.dgType) && !this._buildUtil.cbpStandalone) {
          this.field = this.cbpService.setUserUpdateInfo(this.field);
          this.controlService.hideTrackUi({ 'trackUiChange': true });
        }
        this.cdr.detectChanges();
      }
    });
    this.setItemSubscription = this.controlService.selectedObjValue.subscribe((result: any) => {
      if (result && result !== undefined && result?.dgType !== undefined && !this.hideTrackUi) {
        this.cbpService.selectedUniqueId = result.dgUniqueID;
        this.cbpService.selectedElement = result;
        this.cbpService.backSelctedItem = this.cbpService.selectedElement;
        this.cdr.detectChanges();
      }
    });
  }
  setAlertChanges() {
    this.textAlign = this.cbpService.styleModel['level' + this.field.dgType + 'Title'].textAlign;
    this.marginTop = this.cbpService.styleModel['level' + this.field.dgType + 'Title'].marginTop;
    this.alertImage = this.cbpService.styleImageJson[this.field.dgType.toLowerCase() + 'Image'];
    this.cdr.detectChanges();
  }
  keytab(event: any) {
    let element = event.srcElement.nextElementSibling; // get the sibling element
    if (element == null)  // check if its null
      return;
    else
      element.focus();   // focus if not null
  }
  selectElement() {
    if (this.cbpService.sectionHover) {
      this.auditService.settingStepOptionButns(this.field);
    }
    this.controlService.setSelectItem(this.field);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.field));
  }
  createAuditEntry(auditType: AuditTypes) {
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, auditType);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }
  updatetrackUi() {
    if (this.field.dgType === DgTypes.Alara || this.field.dgType === DgTypes.Note) {
      if (this.field.dgType === DgTypes.Note) {
        if (this.fieldSnapChat?.notes[0] !== this.field?.notes[0]) {
          if (`<font size="2" face="Poppins">${this.fieldSnapChat?.notes[0]}</font>` !== this.field?.notes[0]) {
            this.field = this.cbpService.setUserUpdateInfo(this.field);
            this.controlService.hideTrackUi({ 'trackUiChange': true });
          }
        }
      }
      if (this.field.dgType === DgTypes.Alara) {
        if (this.fieldSnapChat?.alaraNotes[0] !== this.field?.alaraNotes[0]) {
          if (`<font size="2" face="Poppins">${this.fieldSnapChat?.alaraNotes[0]}</font>` !== this.field?.alaraNotes[0]) {
            this.field = this.cbpService.setUserUpdateInfo(this.field);
            this.controlService.hideTrackUi({ 'trackUiChange': true });
          }
        }
      }
      if (this.cbpService.backgroundJson?.section) {
        let element = this._buildUtil.getElementByDgUniqueID(this.cbpService.backSelctedItem.dgUniqueID, this.cbpService.backgroundJson.section);
        element = this.cbpService.setUserUpdateInfo(element);
        this.controlService.hideTrackUi({ 'trackUiChange': true });
      }
    } else {

      if ((this.fieldSnapChat.cause != this.field.cause || this.fieldSnapChat.effect != this.field.effect)) {
        this.field = this.cbpService.setUserUpdateInfo(this.field);
        this.controlService.hideTrackUi({ 'trackUiChange': true });
        if (this.cbpService.backgroundJson?.section) {
          let element = this._buildUtil.getElementByDgUniqueID(this.cbpService.backSelctedItem.dgUniqueID, this.cbpService.backgroundJson.section);
          element = this.cbpService.setUserUpdateInfo(element);
          this.controlService.hideTrackUi({ 'trackUiChange': true });
        }
      }
    }
  }
  updateEditor() {
    this.field = this.cbpService.setUserUpdateInfo(this.field);
  }
  changeActive(prop: any) {
    if (prop == 'cause') {
      this.cbpService.selectedIndex = 0;
      this.setValues(true, false);
    } else if (prop == 'effect') {
      this.cbpService.selectedIndex = 1;
      this.setValues(false, true);
    } else {
      this.setValues(false, true);
      this.cbpService.selectedIndex = -1;
    }
    this.active = prop;
    setTimeout(() => { }, 1);
    this.cbpService.isViewUpdated = true;

    this.cdr.detectChanges();
  }
  setValues(cause: boolean, effect: boolean) {
    this.field['editorCauseOpened'] = cause;
    this.field['editorEffectOpened'] = effect;
  }
  closeEditor(type: string) {
    if (type === 'cause') {
      this.codeReuse('editorCauseOpened', 'isCauseHtmlText', this.field.cause);
    } else {
      this.codeReuse('editorEffectOpened', 'isEffectHtmlText', this.field.effect);
    }
  }
  codeReuse(type: string, htmltype: string, value: any) {
    this.field[type] = false;
    this.field[htmltype] = this.controlService.isHTMLText(value) ? true : false;
  }
  outputhtml(event: any, item: any, propName: any, index: any = 0) {
    if (item.dgType === DgTypes.Alara || item.dgType === DgTypes.Note) {
      item = this.hLService.outputhtmlNew(event, item, index);
      this.tempNotes = this.field.dgType === DgTypes.Note ? this.field.notes : this.field.alaraNotes;
      let auditType = this.field.dgType === DgTypes.Note ? AuditTypes.NOTE : AuditTypes.ALARA;
      this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.field, Actions.Update, auditType, { index: index });
      setTimeout(() => { }, 1);
      this.cbpService.isViewUpdated = true;
      this.cdr.detectChanges();
    } else {
      item[propName] = event === "" ? item[propName] : event;
      if (propName == 'cause') {
        this.controlService.isHTMLText(item[propName]) ? item['isCauseHtmlText'] = true : delete item['isCauseHtmlText'];
        this.createAuditEntry(AuditTypes.CAUSE);
        setTimeout(() => { }, 1);
        this.cbpService.isViewUpdated = true;
        this.cdr.detectChanges();
      }
      if (propName == 'effect') {
        this.controlService.isHTMLText(item[propName]) ? item['isEffectHtmlText'] = true : delete item['isEffectHtmlText'];
        this.createAuditEntry(AuditTypes.EFFECT);
        setTimeout(() => { }, 1);
        this.cbpService.isViewUpdated = true;
        this.cdr.detectChanges();
      }
    }
    this.updatetrackUi();
  }
  editEvent(i: number) {
    if (i != null && i != undefined) {
      this.field['editorOpened'] = true;
      this.activeIndex = i;
      this.cbpService.isViewUpdated = true;
      this.cdr.detectChanges();
    }
  }
  updateNote(dateTime: any, index: number) {
    if (this.field.dgType === DgTypes.Note) {
      this.field.notes[index] = $('#note-' + dateTime + index).val();
    } else {
      this.field.alaraNotes[index] = $('#note-' + dateTime + index).val();
    }
    this.tempNotes = this.field.dgType === DgTypes.Note ? this.field.notes : this.field.alaraNotes;
    let auditType = this.field.dgType === DgTypes.Note ? AuditTypes.NOTE : AuditTypes.ALARA;
    if (this.tempNotes[0] !== '' && this.field.dgType === this.cbpService.selectedElement.dgType) {
      this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, auditType, { index: index });
      this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
      this.updatetrackUi()
    }
  }
  editorOpened(item: any, prop = null) {
    this.field = this.hLService.editorOpenednewUpdate(item);
    if (this.field['isHtmlText']) {
      this.field['editorOpened'] = true;
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
    if (element && (element.dgType === DgTypes.Warning ||
      element.dgType === DgTypes.Caution)
    ) {
      element.cause = event.cause;
      element.effect = event.effect;


    } else if (element && (element.dgType === DgTypes.Note)
    ) {
      element.notes = event.notes;
      if (this.field.dgType === DgTypes.Note || this.field.dgType === DgTypes.Alara) {
        this.dateTime = new Date().getTime();
        this.tempNotes = this.field.dgType === DgTypes.Note ? this.field.notes : this.field.alaraNotes;
      }
    } else if (element && (element.dgType === DgTypes.StepAction ||
      element.dgType === DgTypes.DelayStep ||
      element.dgType === DgTypes.Timed ||
      element.dgType === DgTypes.Repeat)
    ) {
      propName = 'action'
      let text = event[propName] ? event[propName].slice(0, 25) : '';
      element.title = event[propName];
      element.text = element.number + ' ' + text + (text.length > 25 ? '...' : '');
      element[propName] = event[propName];
      let newText = this._buildUtil.setIconAndText(element);
      let obj = { text: newText.text, number: element.number, dgUniqueId: element.dgUniqueID, dgType: element.dgType };
      this.cbpService.headerItem = obj;
      this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
    } else if (element) {
      propName = 'prompt'
      element[propName] = event[propName];
    }

    this.createAuditEntry(this.cbpService.selectedElement);
    this.cdr.detectChanges();
  }

  setValue(event: any, type: any) {
    this.field[type] = event.target.value;
    this.updatetrackUi();
  }
}
