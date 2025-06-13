import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { AuditTypes } from '../../../models';
import { AuditService } from '../../../services/audit.service';
import { CbpService } from '../../../services/cbp.service';
import { ControlService } from '../../../services/control.service';
import { HyperLinkService } from '../../services/hyper-link.service';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['../../../util/atoms.css']
})
export class LinkComponent implements OnInit {
  @Input() field: any = {};
  @Input() stepObject: any = {};
  @Input() hideTrackUi = false;
  @Input() rowcolInfo!: any;
  @Output() getLinAtom: EventEmitter<any> = new EventEmitter();
  @Output() tableEvent: EventEmitter<any> = new EventEmitter();
  setItemSubscription!: Subscription;
  AuditTypes: typeof AuditTypes = AuditTypes;
  DgTypes: typeof DgTypes = DgTypes;

  constructor(public cbpService: CbpService,
    public cdref: ChangeDetectorRef, public controlService: ControlService,
    public auditService: AuditService, public hLService: HyperLinkService) { }

  ngOnInit() {
    this.hLService.initEditorProps(this.field);
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
    if (event['shiftKey']) { this.rowcolInfo['shiftKey'] = event.shiftKey ? true : false; } else {
      this.rowcolInfo['shiftKey'] = false;
    }
    this.tableEvent.emit(this.rowcolInfo);
  }

  selectedLink() {
    this.getLinAtom.emit('eventFromLink');
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

  }
  setValue(event: any) {
    this.field.prompt = event.target.value;
  }
}
