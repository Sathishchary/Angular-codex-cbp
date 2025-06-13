import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { AuditTypes } from '../../../models';
import { AuditService } from '../../../services/audit.service';
import { CbpService } from '../../../services/cbp.service';
import { ControlService } from '../../../services/control.service';
import { HyperLinkService } from '../../services/hyper-link.service';

@Component({
  selector: 'app-boolean',
  templateUrl: './boolean.component.html',
  styleUrls: ['../../../util/atoms.css']
})
export class BooleanComponent implements OnInit {
  @Input() field: any = {};
  @Input() rowcolInfo!: any;
  @Input() stepObject!: any;
  @Output() tableEvent: EventEmitter<any> = new EventEmitter();
  AuditTypes: typeof AuditTypes = AuditTypes;
  DgTypes: typeof DgTypes = DgTypes;
  setItemSubscription!: Subscription;
  @Input() hideTrackUi = false;
  @Input() headerWidth: any;

  constructor(public cbpService: CbpService,
    private controlService: ControlService, public auditService: AuditService,
    private cdr: ChangeDetectorRef, public hLService: HyperLinkService) { }

  ngOnInit() {
    this.hLService.initEditorProps(this.field);
    this.field = this.cbpService.setDataEntryFieldName(this.field, DgTypes.BooleanDataEntry);
    this.setItemSubscription = this.controlService.selectedObjValue.subscribe((result: any) => {
      if (result && result !== undefined && result?.dgType !== undefined) {
        this.cbpService.selectedUniqueId = result.dgUniqueID;
        this.cbpService.selectedElement = result;
        this.cdr.detectChanges();
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
    this.setItemSubscription?.unsubscribe();
  }
  setField(event: any) {
    //this.cbpService.selectedElement= event;
  }

  setValue(event: any, fieldType: any) {
    this.field[fieldType] = event.target.value;
  }
}
