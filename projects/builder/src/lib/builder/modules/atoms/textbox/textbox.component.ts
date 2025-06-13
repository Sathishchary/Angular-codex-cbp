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
  selector: 'app-textbox',
  templateUrl: './textbox.component.html',
  styleUrls: ['../../../util/atoms.css']
})
export class TextboxComponent implements OnInit {
  @Input() field: any = {};
  @Input() rowcolInfo: any;
  @Input() stepObject: any;
  @Output() tableEvent: EventEmitter<any> = new EventEmitter();
  AuditTypes: typeof AuditTypes = AuditTypes;
  DgTypes: typeof DgTypes = DgTypes;
  ImagePath: typeof ImagePath = ImagePath;
  setItemSubscription!: Subscription;
  @Input() hideTrackUi = false;
  constructor(public cbpService: CbpService, public _buildUtil: BuilderUtil,
    public auditService: AuditService, public hLService: HyperLinkService,
    public cdref: ChangeDetectorRef, public controlService: ControlService,
    public tableService: TableService) { }

  ngOnInit() {
    this.hLService.initEditorProps(this.field);
    let dgType = this.field.dataType === 'Text' ? DgTypes.TextDataEntry : DgTypes.DropDataEntry;
    this.field = this.cbpService.setDataEntryFieldName(this.field, dgType);
    this.setItemSubscription = this.controlService.selectedObjValue.subscribe((result: any) => {
      if (result && result !== undefined && result?.dgType !== undefined) {
        this.cbpService.selectedUniqueId = result.dgUniqueID;
        this.cbpService.selectedElement = result;
        this.cdref.detectChanges();
      }
    })
  }
  ngAfterViewInit() {
    this.cdref.detectChanges();
  }
  updateView() {
    this.field = JSON.parse(JSON.stringify(this.field));
    this.cdref.detectChanges();
  }
  selectedForTable(event: { [x: string]: any; shiftKey: any; }) {
    // this.cbpService.tableDataEntrySelected = JSON.parse(JSON.stringify(this.field));
    this.cbpService.tableDataEntrySelected = this.field;
    if (event['shiftKey']) { this.rowcolInfo['shiftKey'] = event.shiftKey ? true : false; } else {
      this.rowcolInfo['shiftKey'] = false;
    }
    this.tableEvent.emit(this.rowcolInfo);
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
  }
  setField(event: any) {
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
    this.field.showLablePrompt = event.target.value;
  }
  outputhtml(event: any, item: any, type: string) {
    if (item.isCover)
      this.field.editorOpened = false;
  }
  setFieldPromptValue(event: any) {
    if (this.field?.isCover) {
      this.cbpService.tableDataEntrySelected.prompt = event;
    }
  }
  editorOpened(item: any, prop = null) {
    // if (!this.cbpService.documentSelected) {
    this.field = this.hLService.editorOpenednewUpdate(item);
    if (this.field['isHtmlText']) {
      this.field['editorOpened'] = true;
    }
    // }
    // else {
    //   this.field['editorOpened'] = false;
    // }
  }
}
