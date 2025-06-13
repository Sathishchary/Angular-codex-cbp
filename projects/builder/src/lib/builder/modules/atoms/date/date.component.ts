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
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['../../../util/atoms.css']
})
export class DateComponent implements OnInit {
  @Input() field: any = {};
  @Input() stepObject: any;
  @Input() rowcolInfo!: any;
  @Output() tableEvent: EventEmitter<any> = new EventEmitter();
  AuditTypes: typeof AuditTypes = AuditTypes;
  DgTypes: typeof DgTypes = DgTypes;
  styleObject: any;
  subScription!: Subscription;
  setItemSubscription!: Subscription;
  @Input() hideTrackUi = false;

  constructor(public cbpService: CbpService, public _buildUtil: BuilderUtil,
    public cdref: ChangeDetectorRef, public controlService: ControlService, public auditService: AuditService, public hLService: HyperLinkService) { }

  ngOnInit() {
    // this.hLService.initEditorProps(this.field);
    this.field = this.cbpService.setDataEntryFieldName(this.field, DgTypes.DateDataEntry);
    this.subScription = this.controlService.styleModelobjValue.subscribe((res: any) => {
      if (res && res !== undefined && !this.controlService.isEmpty(res)) {
        this.styleObject = this.controlService.setStyles(res['levelNormal']);
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
  selectedForTable(event: any) {
    this.cbpService.tableDataEntrySelected = this.field;
    if (event.shiftKey) { this.rowcolInfo['shiftKey'] = event.shiftKey ? true : false; } else {
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
    this.field.showLablePrompt = event.target.value;
  }

}
