import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CbpSharedService, DgTypes } from 'cbp-shared';
import { Actions, AuditTypes } from '../../models';
import { AuditService } from '../../services/audit.service';
import { CbpService } from '../../services/cbp.service';
import { ControlService } from '../../services/control.service';

@Component({
  selector: 'app-setup-url',
  templateUrl: './setup-url.component.html',
  styleUrls: ['./setup-url.component.css', '../../util/modal.css']
})
export class SetupURLComponent implements OnInit, OnDestroy {
  filedURL!: string;
  @Output()
  closeEvent: EventEmitter<any> = new EventEmitter();
  constructor(public cbpService: CbpService, public auditService: AuditService,
    public sharedService: CbpSharedService, public controlService: ControlService) { }

  ngOnInit() {
    this.sharedService.openModalPopup('Setup-Url');
  }
  saveURL() {
    let item: any;
    if (this.cbpService.selectedElement.dgType === DgTypes.Table) {
      this.cbpService.tableDataEntrySelected.uri = this.filedURL;
      item = this.cbpService.tableDataEntrySelected;
      this.viewUpdateTrack();
    } else {
      this.cbpService.selectedElement.uri = this.filedURL;
      item = this.cbpService.selectedElement;
      this.viewUpdateTrack();
    }
    this.cbpService.setUpStyle = true;
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, item, Actions.Update, AuditTypes.PROPERY_URL_LINK_DOC, { propName: 'uri' })
    this.hide();
  }
  ngOnDestroy(): void {
    this.hide();

  }
  hide() {
    this.cbpService.issetupURLOpen = false;
    this.sharedService.closeModalPopup('Setup-Url');
    this.closeEvent.emit(false);
  }

  viewUpdateTrack() {
    this.cbpService.selectedElement = this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }
}
