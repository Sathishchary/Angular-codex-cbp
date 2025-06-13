import {
  Component, OnInit, OnDestroy, Output, EventEmitter, Input, ChangeDetectionStrategy,
  ChangeDetectorRef, isDevMode
} from '@angular/core';
import { ExecutionService } from '../../services/execution.service';
import { NotifierService } from 'angular-notifier';
import { SharedviewService } from '../../services/sharedview.service';
import { ActionId, DataInfoModel, Email } from '../../models';
import { CbpExeService } from '../../services/cbpexe.service';
import { CbpSharedService } from 'cbp-shared';
// @author: Sathish Kotha

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailComponent implements OnInit, OnDestroy {
  email: Email = new Email();
  @Input() dataJson: any;
  loading = false;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  @Output() sendDataEntryJson: EventEmitter<any> = new EventEmitter();
  validEmail = true;
  validMessage = false;
  validSubject = false
  isDev = false;
  footerList = [{ type: 'Save', disabled: true }, { type: 'Cancel' }];
  constructor(public executionService: ExecutionService, public cbpService: CbpExeService,
    public cdref: ChangeDetectorRef, public sharedService: CbpSharedService,
    public notifier: NotifierService, public sharedviewService: SharedviewService) {
  }

  ngOnInit() {
    this.isDev = isDevMode();
    this.sharedService.openModalPopup('emailpopup');
    this.email.name = this.executionService.selectedUserName;
    this.email.email = this.executionService.selectedUserEmail;
  }
  footerEvent(event: any) {
    if (event.type === 'Save') {
      this.sendEmailRequest();
    }
    if (event.type === 'Cancel') {
      this.closeModal();
    }
  }
  update() {
    this.cdref.detectChanges();
  }

  sendEmailRequest() {
    this.storeDataJsonObject();
    this.sharedService.closeModalPopup('emailpopup');
    this.closeEvent.emit(this.email);
  }
  validateEmail(value: any) {
    this.validEmail = this.sharedviewService.validateEmail(value);
    this.checkAll()
    this.cdref.detectChanges();
  }
  validateSubject(value: any) {
    if (value) {
      this.validSubject = true
    }
    this.checkAll()
    this.cdref.detectChanges();
  }

  validateMessage(value: any) {
    if (value) {
      this.validMessage = true
    }
    this.checkAll()
    this.cdref.detectChanges();
  }

  checkAll() {
    if (this.validEmail && this.validSubject && this.validMessage) {
      this.footerList = [{ type: 'Save', disabled: false }, { type: 'Cancel' }];
    }
  }
  closeModal() {
    this.sharedService.closeModalPopup('emailpopup');
    this.closeEvent.emit(false);
  }

  storeDataJsonObject() {
    let user = this.executionService.selectedUserName;
    let dataInfo: DataInfoModel = new DataInfoModel('Email', user, new Date(), user, new Date(), '', 'Email', (++this.cbpService.lastSessionUniqueId).toString(), 0);
    dataInfo = { ...dataInfo, ...this.sharedviewService.setUserInfoObj(ActionId.Email), ...this.email };
    this.sendDataEntryJson.emit(dataInfo);
  }

  ngOnDestroy(): void {
    this.closeModal();
  }

}
