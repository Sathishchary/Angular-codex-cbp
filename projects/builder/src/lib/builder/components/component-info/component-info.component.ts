import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { CbpSharedService } from 'cbp-shared';
import { ComponentInfo } from '../../models';
import { AuditService } from '../../services/audit.service';
import { CbpService } from '../../services/cbp.service';
import { ControlService } from '../../services/control.service';

@Component({
  selector: 'app-component-info',
  templateUrl: './component-info.component.html',
  styleUrls: ['./component-info.component.css', '../../util/modal.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentInfoComponent implements OnInit, OnDestroy {
  componentInfo: any = new ComponentInfo();
  applicabilityRestoreSnapchat: any;
  componentAuditJSON: Array<any> = [];
  footerList = [{ type: 'Save' }, { type: 'Undo' }, { type: 'Close' }];
  @Input() selectedElement: any;
  @Output() saveComponentEvent: EventEmitter<any> = new EventEmitter<any>();;

  constructor(public cbpService: CbpService, public notifier: NotifierService,
    public controlService: ControlService,
    public auditService: AuditService, public sharedService: CbpSharedService) { }

  ngOnInit() {
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.selectedElement));
    if (this.selectedElement['componentInformation'] === undefined) {
      this.selectedElement.componentInformation = [];
    }
    if (this.selectedElement.componentInformation.length > 0) {
      this.componentInfo = this.selectedElement.componentInformation[0];
    }
    this.sharedService.openModalPopup('Component-info');
  }
  componentInformationData() {
    const keys = Object.keys(this.componentInfo);
    for (const key of keys) {
      if (key !== "stepNumber" && this.componentInfo[key] !== "") {
        this.saveComponentEvent.emit(this.selectedElement);
        this.componentInfo.stepNumber = this.selectedElement.number;
        this.selectedElement = this.cbpService.setUserUpdateInfo(this.selectedElement);
        this.controlService.hideTrackUi({ 'trackUiChange': true });
        this.selectedElement.componentInformation.push(this.componentInfo);
        this.hide()
        return;
      }
    }
    this.notifier.hideAll();
    this.notifier.notify('warning', 'Please fill Atleast One Field');
  }
  ngOnDestroy(): void {
    this.hide();
  }
  hide() {
    this.cbpService.iscomponentInfo = false;
    this.sharedService.closeModalPopup('Component-info');
  }
  undoComponent() {
    this.selectedElement.componentInformation = [];
    this.componentInfo = new ComponentInfo();
  }
}
