import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import flatpickr from 'flatpickr';
import { Subscription } from 'rxjs';
import { AuditService } from '../../../services/audit.service';
import { CbpService } from '../../../services/cbp.service';
import { ControlService } from '../../../services/control.service';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['../../../util/atoms.css']
})
export class SignatureComponent implements OnInit {
  @Input() field: any = {};
  @Input() rowcolInfo!: any;
  styleObject: any;
  subScription!: Subscription;
  setItemSubscription!: Subscription;
  @Output() tableEvent: EventEmitter<any> = new EventEmitter();
  @Input() hideTrackUi = false;
  constructor(public cbpService: CbpService,
    public cdref: ChangeDetectorRef, public controlService: ControlService, public auditService: AuditService) { }

  ngOnInit() {
    flatpickr('.flatpickr', {
      enableTime: true,
      dateFormat: 'm/j/Y h:i K',
      time_24hr: false,
      minDate: new Date(),
      position: 'auto',
      static: true,
      defaultDate: '',
    });
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
    })
  }
  selectedForTable(event: any) {
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
    this.controlService.setSelectItem(this.field);
  }
  ngOnDestroy() {
    this.subScription?.unsubscribe();
    this.setItemSubscription?.unsubscribe();
  }
  setField(event: any) {

  }
  setValue(event: any) {
    this.field.prompt = event.target.value;
  }
}
