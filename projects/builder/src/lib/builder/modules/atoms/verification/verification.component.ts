import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { Actions, AuditTypes } from '../../../models';
import { AuditService } from '../../../services/audit.service';
import { CbpService } from '../../../services/cbp.service';
import { ControlService } from '../../../services/control.service';
import { BuilderUtil } from '../../../util/builder-util';
import { HyperLinkService } from '../../services/hyper-link.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['../../../util/atoms.css']
})
export class VerificationComponent implements OnInit {
  @Input() field: any = {};
  @Input() stepObject: any;
  AuditTypes: typeof AuditTypes = AuditTypes;
  DgTypes: typeof DgTypes = DgTypes;
  setItemSubscription!: Subscription;
  @Input() hideTrackUi = false;
  constructor(public cbpService: CbpService, public _buildUtil: BuilderUtil,
    public cdref: ChangeDetectorRef, public controlService: ControlService,
    public auditService: AuditService, public hLService: HyperLinkService) { }

  ngOnInit() {
    if (!this.field['prompt'] && this.field['Prompt']) {
      this.field['prompt'] = this.field['Prompt'];
      delete this.field['Prompt'];
    }
    this.hLService.initEditorProps(this.field);
    this.setItemSubscription = this.controlService.selectedObjValue.subscribe((result: any) => {
      if (result && result !== undefined && result?.dgType !== undefined) {
        this.cbpService.selectedUniqueId = result.dgUniqueID;
        this.cbpService.selectedElement = result;
        this.cdref.detectChanges();
      }
    })
  }
  selectElement() {
    if (this.cbpService.sectionHover) {
      this.auditService.settingStepOptionButns(this.field);
    }
    this.controlService.setSelectItem(this.field);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.field));
  }
  ngOnDestroy() {
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
  }
}
