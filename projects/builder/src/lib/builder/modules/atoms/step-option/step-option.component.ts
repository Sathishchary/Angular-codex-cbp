import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { AuditTypes, Actions } from '../../../models';
import { AuditService } from '../../../services/audit.service';
import { CbpService } from '../../../services/cbp.service';
import { BuilderUtil } from '../../../util/builder-util';
import { HyperLinkService } from '../../services/hyper-link.service';

@Component({
  selector: 'app-step-option',
  templateUrl: './step-option.component.html',
  styleUrls: ['../../../util/atoms.css', './step-option.component.css']
})
export class StepOptionComponent implements OnInit {

  @Input() field: any;
  @Input() mode: any;
  @Input() prop: any;
  @Output() edit: EventEmitter<any> = new EventEmitter();

  DgTypes: typeof DgTypes = DgTypes;

  constructor(public cbpService: CbpService, public auditService: AuditService, public _buildUtil: BuilderUtil, public hLService: HyperLinkService) { }

  ngOnInit() {
  }
  upArrow(id: any) {
    this.cbpService.upArrowData(id);
    this.auditService.createEntry({}, this._buildUtil.getElementByDgUniqueID(id, this.cbpService.cbpJson.section), Actions.Update, AuditTypes.MOVE_UP);
  }
  downArrow(id: any) {
    this.cbpService.downArrowData(id);
    this.auditService.createEntry({}, this._buildUtil.getElementByDgUniqueID(id, this.cbpService.cbpJson.section), Actions.Update, AuditTypes.MOVE_DOWN);

  }
  deleteListAlert(field: any) {
    try {
      let element = JSON.parse(JSON.stringify(this._buildUtil.getElementByNumber(field.parentID, this.cbpService.cbpJson.section)))
      this.cbpService.deleteListAlert(field);
      this.auditService.elementsRestoreSnapChats.push(element);
      this.auditService.createEntry(this.auditService.selectedElementSnapchat, field, Actions.Delete);
    } catch (error) {
      console.log(error)
    }
  }
  editEvent() {
    //this.hLService.editorOpened(this.field, this.prop)
    this.field['editorOpened'] = true;
    this.edit.emit();
  }
  setField(event: any) {

  }
  setValue(event: any) {
    this.field.prompt = event.target.value;
  }



}
