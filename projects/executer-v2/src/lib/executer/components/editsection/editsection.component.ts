import { HttpHeaders } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter, Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CbpSharedService, DgTypes } from 'cbp-shared';
import { AngularEditorConfig } from 'dg-shared';
import { Subscription } from 'rxjs';
import { DataWrapperService } from '../../../executer-wrapper/data-wrapper.service';
import { Event_resource, EventType, Request_Msg } from '../../ExternalAccess/medaiEventSource';
import { DataInfoModel, EditText } from '../../models';
import { ActionId } from '../../models/action-id';
import { CbpExeService } from '../../services/cbpexe.service';
import { DataJsonService } from '../../services/datajson.service';
import { DatashareService } from '../../services/datashare.service';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';
import { SignatureEditorComponent } from '../signature-editor/signature-editor.component';
// @author: Sathish Kotha

@Component({
  selector: 'app-editsection',
  templateUrl: './editsection.component.html',
  styleUrls: ['./editsection.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditsectionComponent implements OnInit, OnDestroy, OnChanges {
  @Input() dataJson: any;
  @Input() modal: any = {
    number: '', title: '', type: '', dgUniqueID: '', reviewerName: '', reviewerId: '',
    newTextValue: '', reason: '', comment: '', discipline: '', signature: '', userId: '',
    authenticator: false, isUserIdEditable: 1, isUserNameEditable: 1, authenticatorreviewerName: false,
    authenticatoruserId: false
  };
  @Input() selectedStepSectionInfo: any;
  @Input() editStepmodal: any;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  @Input() isUpdated = false;
  @Input() docFileInfo: any;
  valueChanged = false;
  @Input() otspData: any = [];
  isMobile: boolean | undefined = false;
  firstPage = true;
  secondPage = false;
  thirdPage = false;
  fourthPage = false;
  penInkValues: any;
  responseMsg: Subscription | undefined;
  footerList = [{ type: 'Next', disabled: true }, { type: 'Cancel' }];
  editModelText: any;
  result = '';
  loading = false;
  questions: any[] = [];
  notAllowedMessage: any;
  DEFAULT_MESSAGE: any;
  defaultAnswer: any;
  @Output() setDataJson: EventEmitter<any> = new EventEmitter();
  @Input() penInkJson: any;
  signatureValue: any;
  modalOptions: any;
  modelRef!: NgbModalRef;
  messageToSdk: any;
  @Input() authenticatorEvent: any;
  signatureEnabled!: boolean;
  userNameEditorOpened = false;
  userIdEditorOpened = false;
  userNotesEditorOpened = false;
  userNameStep: any;
  userIdStep: any;
  commentStep: any;
  userConfig!: AngularEditorConfig;
  notesConfig!: AngularEditorConfig;
  constructor(public cbpService: CbpExeService, public executionService: ExecutionService,
    public dataWrapperService: DataWrapperService,
    public sharedViewService: SharedviewService, public sharedService: CbpSharedService,
    public dataSharingService: DatashareService, private modalService: NgbModal,
    private dataJsonService: DataJsonService,
    public cdref: ChangeDetectorRef, private notifier: NotifierService,) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'lg'
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.authenticatorEvent && this.authenticatorEvent) {
      this.authenticatorEvent = changes.authenticatorEvent.currentValue;
      let res = this.authenticatorEvent;
      if (res?.msg?.msg?.data?.stepObj?.toString() == this.modal.dgUniqueID.toString()) {
        console.log(res);
        // this.messageToSdk = res?.msg?.msg?.data;
        const data = JSON.parse(res?.msg?.msg?.res.resultJson);
        this.modal.reviewerName = data?.CertificateInfo?.DGUserName;
        this.modal.userId = data?.CertificateInfo?.DGUserId;
        this.modal['authenticator'] = true;
        this.modal['signature'] = this.getSignatureValue(this.messageToSdk?.result?.value);
        this.signatureValue = this.messageToSdk?.result?.value;
        this.cdref.detectChanges();
        this.executionService.closeSignature = false;
        this.modelRef.close();
      }
    }
  }

  ngOnInit() {
    this.isMobile = this.dataSharingService.getMenuConfig()?.isMobile;
    this.questions = this.penInkJson?.DEFAULT_QUESTIONS;
    this.DEFAULT_MESSAGE = this.penInkJson?.DEFAULT_MESSAGE;
    this.defaultAnswer = this.penInkJson?.DEFAULT_RESPONSE;
    if (this.defaultAnswer == 'NO' || this.defaultAnswer == 'YES') {
      this.defaultAnswer = this.defaultAnswer.toLowerCase();
      this.defaultAnswer = this.defaultAnswer.charAt(0).toUpperCase() + this.defaultAnswer.slice(1);
    }
    this.questions.map(item => { item['criteria'] = ''; });
    this.editStepTitle();
    this.updateAngularEditorInfo()
    this.responseMsg = this.dataSharingService.receivedMessage.subscribe((res: any) => {
      if (res.eventType == EventType.penInk) {
        this.loading = false;
        this.result = res.msg.requestNbr;
        this.editModelText['requestNbr'] = res.msg.requestNbr;
        this.storeDataJsonObject(this.editModelText);
        // this.closeEvent.emit({modal: this.editModelText});
        this.cdref.detectChanges();
        res.eventType = "";
      } else if (res?.eventType == EventType.yubikey) {
        if (res?.msg?.msg?.data?.stepObj?.toString() == this.modal.dgUniqueID.toString()) {
          console.log(res);
          this.setSignatureFromSDK(res?.msg?.msg?.res,
            this.messageToSdk?.result,
            this.messageToSdk?.type,
            this.messageToSdk?.value
          )
          //   this.messageToSdk = res?.msg?.msg?.data;
          // const data = JSON.parse(res?.msg?.msg?.res.resultJson);
          // this.modal.reviewerName = data?.CertificateInfo?.DGUserName;
          // this.modal.userId = data?.CertificateInfo?.DGUserId; 
          // this.modal['authenticator'] = true;

          // this.modal['signature'] = this.getSignatureValue(this.messageToSdk?.result?.value);
          // this.signatureValue = this.messageToSdk?.result?.value;
          // this.cdref.detectChanges();
          // this.executionService.closeSignature = false;
          // this.modelRef.close();


        }
      } {
        this.loading = false;
        this.cdref.detectChanges();
      }
    })
    if (this.executionService.authenticatorConfig?.verification?.userid_iseditable == 0) {
      this.modal.isUserIdEditable = 0
    }
    if (this.executionService.authenticatorConfig?.verification?.username_iseditable == 0) {
      this.modal.isUserNameEditable = 0
    }
  }

  setSignatureFromSDK(data: any, result: any, type: number, value: any) {
    // console.log(data)
    if (data.status == 2000) {
      let res = this.isMobile ? JSON.parse(data.resultJson) : JSON.parse(data.responseMessage);
      if (res.Code == 2000) {
        result.userName = res?.CertificateInfo?.DGUserName ? res?.CertificateInfo?.DGUserName : result.userName;
        this.modal.userId = res?.CertificateInfo?.DGUserId;
        this.modal['authenticator'] = true;
        this.modal['authenticatorreviewerName'] = res?.CertificateInfo?.DGUserName ? true : false;
        this.modal['authenticatoruserId'] = res?.CertificateInfo?.DGUserId ? true : false;
        if (!result?.userId) {
          result.userId = this.modal.userId;
        }
        this.setSignatureValues(result);
        if (type == 1) {
          this.setDefaultSign(value, 'Default Sign/Initial applied', this.getSignatureValue(result.value));
          this.modal['signature'] = this.getSignatureValue(result.value);
          this.setSignatureObject()
          // this.sigNaturedateDateEntry(this.stepObject);
          this.modelRef.close();
          this.cbpService.loading = false;
          this.executionService.authenticatorConfig['state'] = false;
          this.cdref.detectChanges();
        } else if (type == 2) {
          this.modal['signature'] = this.getSignatureValue(result.value);
          // this.sigNaturedateDateEntry(this.stepObject);
          this.setSignatureObject()
          this.cdref.detectChanges();
          this.cbpService.loading = false;
          this.executionService.authenticatorConfig['state'] = false;
          this.modelRef.close();
        } else if (type == 3) {
          this.modal['signature'] = this.getSignatureValue(result.value);
          // this.sigNaturedateDateEntry(this.stepObject);
          this.setSignatureObject()
          this.cbpService.loading = false;
          this.executionService.authenticatorConfig['state'] = false;
          this.modelRef.close();
          this.cdref.detectChanges();
        }
        //this.notifier.notify('error', 'No YubiKey device found.');
      } else if (res.Code == 3000) {
        this.notifier.notify('error', 'Invalid pin.');
        this.cbpService.loading = false;
        this.executionService.authenticatorConfig['state'] = false;
        this.modelRef.close();
        this.cdref.detectChanges();

      } else if (res.Code == 4000) {
        this.notifier.notify('error', 'No yubikey found.');
        this.cbpService.loading = false;
        this.executionService.authenticatorConfig['state'] = false;
        this.modelRef.close();
        this.cdref.detectChanges();

      } else if (res.Code == 5000) {
        this.notifier.notify('error', 'Server error');
        this.cbpService.loading = false;
        this.executionService.authenticatorConfig['state'] = false;
        this.modelRef.close();
        this.cdref.detectChanges();
      } else if (res.Code == 6000) {
        this.notifier.notify('error', res?.Message);
        this.cbpService.loading = false;
        this.executionService.authenticatorConfig['state'] = false;
        this.modelRef.close();
        this.cdref.detectChanges();
      } else if (res.Code == 7000) {
        this.notifier.notify('error', res?.Message);
        this.cbpService.loading = false;
        this.executionService.authenticatorConfig['state'] = false;
        this.modelRef.close();
        this.cdref.detectChanges();
      }
      this.cbpService.loading = false;
      this.signatureEnabled = false;
    }
    if (data.status == 3000) {
      this.notifier.notify('error', 'Server error');
      this.cbpService.loading = false;
      this.executionService.authenticatorConfig['state'] = false;
      this.modelRef.close();
      this.cdref.detectChanges();
    }
    this.cbpService.loading = false;
    this.signatureEnabled = false;
  }
  changeEvent(item: any) {
    if (item.type === 'Next') { this.nextPage() }
    if (item.type === 'Save') { this.updateInfo(this.modal); }
    if (item.type === 'Cancel') { this.closeModal(); }
    if (item.type === 'Close') { this.closeSecondModal(this.modal); }
  }

  closeSecondModal(modal: any) {
    this.closeEvent.emit({ modal: modal, dataJson: this.dataJson });
  }

  editStepTitle() {
    if (!this.isUpdated) {
      this.modal.dgUniqueID = this.selectedStepSectionInfo.dgUniqueID;
      if (this.selectedStepSectionInfo.dgType === DgTypes.Section) {
        this.modal.number = this.selectedStepSectionInfo.number ? this.selectedStepSectionInfo.number : this.selectedStepSectionInfo.stepNo;
        this.modal.title = this.selectedStepSectionInfo.title.replace('\n', '');
        if (this.selectedStepSectionInfo.isEdited) { this.setDefaultEditValues(this.selectedStepSectionInfo); }
      }
      if (this.selectedStepSectionInfo.dgType !== DgTypes.Section) {
        this.modal.number = this.selectedStepSectionInfo.number ? this.selectedStepSectionInfo.number : this.selectedStepSectionInfo.stepNo;
        this.selectedStepSectionInfo.action = this.selectedStepSectionInfo.action ?
          this.selectedStepSectionInfo.action : this.selectedStepSectionInfo.title;
        this.modal.title = this.selectedStepSectionInfo.action.replace('\n', '');
        if (this.selectedStepSectionInfo.isEdited) { this.setDefaultEditValues(this.selectedStepSectionInfo); }
      }
    } else {
      this.modal = this.editStepmodal;
      this.modal.newTextValue = this.editStepmodal.newText;
      this.modal.title = this.editStepmodal.oldText;
      this.newTextChange('');
    }
    this.sharedService.openModalPopup('editStepTitle');
  }

  setDefaultEditValues(obj: any) {
    this.modal.title = obj.oldText;
  }
  newTextChange(event: any) {
    this.valueChanged = true;
    if (this.modal.newTextValue === '') { this.valueChanged = false; }
    this.cdref.detectChanges();
  }
  viewUpdated() {
    let find = this.questions.find(item => item.criteria == '');
    if (!find) {
      this.footerList = [{ type: 'Next', disabled: false }, { type: 'Cancel' }];
    }
    this.cdref.detectChanges();
  }

  nextPage() {
    let no = this.questions.every(item => item.criteria === this.defaultAnswer); // NO
    let yes = this.questions.some(item => item.criteria === (this.defaultAnswer == 'No' ? 'Yes' : 'No'));
    if (no) {
      this.setValues(false, true, false, false);
      this.footerList = [{ type: 'Save', disabled: true }, { type: 'Cancel' }];
    } else if (yes) {
      this.setValues(false, false, true, false);
      this.footerList = [{ type: 'Cancel' }];
    }
    this.cdref.detectChanges();
  }

  saveButton(event: any) {
    const authConfig = this.executionService.authenticatorConfig?.verification;
    const hasNewText = this.modal.newTextValue?.length > 0;
    const hasReason = this.modal.reason?.length > 0;
    const hasReviewerName = authConfig.userid_is_required == 1 ? this.modal.reviewerName?.length > 0 : true;
    const hasUserId = authConfig.userid_is_required == 1 ? this.modal.userId?.length > 0 : true;
    const hasSignature = !!this.modal.signature;
    this.footerList = [{ type: 'Save', disabled: !(hasNewText && hasReason && hasReviewerName && hasUserId && hasSignature) }, { type: 'Cancel' }];
    this.cdref.detectChanges();
  }
  setValues(first: any, second: any, third: any, fourth: any) {
    this.firstPage = first;
    this.secondPage = second;
    this.thirdPage = third;
    this.fourthPage = fourth;
    if (this.fourthPage) {
      this.footerList = [{ type: 'Close' }];
      this.cdref.detectChanges();
      return;
    }
    this.viewUpdated();
  }

  nocallInfo() {
    this.loading = false;
    this.storeDataJsonObject(this.editModelText);
    this.closeEvent.emit({ modal: this.editModelText });
    this.cdref.detectChanges();
  }

  updateInfo(modal: any) {
    const editTextArray = this.dataJson.dataObjects.filter((item: any) => item.dgType === DgTypes.EditText);
    if (editTextArray) { editTextArray.length = ++editTextArray.length; } else { editTextArray.length = 0; }
    let editText: any = new EditText('completed', modal.title, modal.newTextValue, modal.number, new Date(), this.executionService.loggedInUserName, modal.reason, DgTypes.EditText,
      modal.dgUniqueID, modal.comment, modal.discipline, modal.reviewerName, modal.userId, modal.userId);
    editText['signatureDate'] = modal['signatureDate'];
    this.otspData.push(editText);
    this.editModelText = editText;
    modal['otspData'] = this.otspData;
    this.penInkValues = {
      companyId: '',
      fields: [
        { fieldName: 'NEW_TEXT', fieldValue: modal.newTextValue || '' },
        { fieldName: 'REASON', fieldValue: modal.reason || '' },
        { fieldName: 'DISCIPLINE', fieldValue: modal.discipline || '' },
        { fieldName: 'REVIEWER_NAME', fieldValue: modal.reviewerName || '' },
        { fieldName: 'REVIEWER_ID', fieldValue: modal.reviewerId || '' },
        { fieldName: 'COMMENT', fieldValue: modal.comment || '' }
      ]
    };
    if (!this.isMobile) {
      this.nocallInfo()
      this.closeSecondModal(this.modal);
    }
    if (this.isMobile) {
      this.storeDataJsonObject(this.editModelText);
      // let evtComment: Request_Msg = { eventType: EventType.penInk, msg: this.penInkValues };
      // this.dataSharingService.sendMessageFromLibToOutside(evtComment);
    }

    this.setValues(false, false, false, true);
    this.closeSecondModal(this.modal);
  }

  storeDataJsonObject(obj: any) {
    let user = this.executionService.selectedUserName;
    let dataInfo: any = new DataInfoModel('Completed', user, new Date(), user, new Date(), '', 'EditText', new Date().getTime(), 0);
    dataInfo['signature'] = this.modal.signature;
    // dataInfo['userId'] = this.modal.userId;
    if (obj?.signatureValue?.toString()?.includes('data')) {
      obj['signatureValue'] = obj?.signature;
    }
    dataInfo['signatureUserName'] = this.modal.reviewerName;
    dataInfo['signatureUserId'] = this.modal.userId;
    let dataInfoObj = { ...dataInfo, ...this.sharedViewService.setUserInfoObj(ActionId.Update), ...obj };
    dataInfoObj.dgUniqueID = new Date().getTime();
    if (this.modal['authenticator']) {
      dataInfoObj['authenticator'] = true;
    }
    if (obj['comment']) {
      dataInfoObj['notes'] = obj['comment'];
    }
    this.cbpService.dataJson.dataObjects.push(dataInfoObj);
    this.setDataJsonUpdate();
  }
  setDataJsonUpdate() {
    this.setDataJson.emit(this.dataJson);
  }
  getSignatureData(obj: any, typeValu: any) {
    if (!this.modal['signature']) {
      // if (this.executionService.defualtSign) {
      // this.modal['signature'] = this.executionService.defualtSign;
      // this.sigNaturedateDateEntry(this.stepObject);
      // } else {
      this.openSignaturePopup(typeValu);
      // }
    } else {
      this.openSignaturePopup(typeValu);
    }
    this.cdref.detectChanges();
  }
  async openSignaturePopup(value: any) {
    if (!this.cbpService.selectCellEnabled) {
      this.modalOptions['size'] = 'lg';
      this.modalOptions['windowClass'] = 'my-signature-class';
      this.messageToSdk = null;
      this.signatureEnabled = true;
      const modalRef = this.modalService.open(SignatureEditorComponent, this.modalOptions);
      this.modelRef = modalRef;
      modalRef.componentInstance.selectedStepSectionInfo = this.selectedStepSectionInfo;
      modalRef.componentInstance.selectedSignture = this.modal;
      modalRef.componentInstance.hideDefault = true;
      modalRef.componentInstance.isSignatureEnabled = this.executionService.authenticatorConfig?.verification?.show_user_info;
      modalRef.componentInstance.userIdEditable = this.modal.isUserIdEditable;
      modalRef.componentInstance.userNameEditable = this.modal.isUserNameEditable;
      modalRef.componentInstance.isUserIdRequired = this.executionService.authenticatorConfig?.initial?.userid_is_required;
      modalRef.componentInstance.isUserNameRequired = this.executionService.authenticatorConfig?.initial?.username_is_required;
      modalRef.componentInstance.documentInfo = this.cbpService.documentInfo;
      modalRef.componentInstance.isYubikeyEnabled = this.executionService.authenticatorConfig?.verification?.authenticator == 'yubikey' ? true : false;
      modalRef.componentInstance.dataJsonService = this.dataJsonService;
      modalRef.componentInstance.updateFooterList();
      modalRef.componentInstance.closeEvent.subscribe(async (result: any) => {
        if (result != false) {
          this.setSignatureValues(result);
          if (this.executionService.authenticatorConfig?.verification?.authenticator == 'yubikey') {
            this.openYubikeyPopup(result, 2, value, modalRef);
          } else {
            this.modal['signature'] = this.getSignatureValue(result.value);
            this.saveButton(result);
            this.setSignatureObject();
            this.signatureEnabled = false;
            this.cdref.detectChanges();
            this.executionService.closeSignature = false;
            modalRef.componentInstance.hideDefault = false;
            modalRef.close();
          }
        } else {
          this.executionService.closeSignature = false;
          this.signatureEnabled = false;
          modalRef.close();
          this.cdref.detectChanges();
        }
      });
    }
  }
  setDefaultSign(value: any, text: string, resultValue: any) {
    if (value == 'initial') {
      this.executionService.defualtInitial = resultValue;
    } else {
      this.executionService.defualtSign = resultValue;
    }
    this.notifier.notify('success', text);
  }
  setSignatureObject() {
    this.signatureValue = this.executionService.signatureJson.find((i: any) =>
      i.TxnId == this.modal.signature)?.value;
  }
  getSignatureValue(value: any): any {
    if (value.toString().includes('data:image')) {
      const index = this.executionService.signatureJson.findIndex((i: any) => i.value == value);
      if (index == -1) {
        let dataInfo: any = { TxnId: new Date().getTime() };
        dataInfo['value'] = value;
        this.executionService.signatureJson.push(dataInfo);
        return dataInfo.TxnId;
      }
      if (index > -1) {
        return this.executionService.signatureJson[index].TxnId;
      }
    } else {
      return value;
    }

  }
  openYubikeyPopup(result: any, type: number = 1, value: any, modalRef2: NgbModalRef) {
    if (this.isMobile) {
      this.messageToSdk = {
        result: result,
        type: type,
        value: value,
        stepObj: this.modal.dgUniqueID
      }
      let message = {
        result: null,
        type: type,
        value: value,
        stepObj: this.modal.dgUniqueID
      }
      let evt: Request_Msg = { eventType: EventType.yubikey, msg: message, eventFrom: Event_resource.signature };
      this.dataSharingService.sendMessageFromLibToOutside(evt)
    } else {
      // this.cbpService.loading = true;
      this.cdref.detectChanges();
      let uniqueId = this.generateUniqueId();
      this.executionService.authenticatorConfig['state'] = true;
      let obj = {
        accessToken: this.executionService.accessToken,
        uniqueId: uniqueId,
        timeout: this.executionService.authenticatorConfig?.timeout,
        timeoutMessage: this.executionService.authenticatorConfig?.timeoutMessage,
        certificates: this.executionService.authenticatorConfig?.certificates,
        identityConfig: this.executionService.authenticatorConfig?.identityConfig,
        url: `${this.executionService.apiUrl}/dg-external-authenticator/yubikey/piv/verification/${this.executionService.loggedInUserId}/${this.executionService.companyID}`
      }
      this.executionService.removeUnnessesoryFields(obj);
      this.openMauiApp(JSON.stringify(obj));
      this.modal['authenticator'] = false;
      setTimeout(() => {
        // this.cbpService.loading = true;
        this.getResponse(result, type, value, modalRef2, uniqueId, 0);
      }, 5000);
    }
  }
  openMauiApp(data: string): void {
    console.log(data);
    const url = `yubikeypivverification://${this.executionService.apiUrl}/path?id=${encodeURIComponent(data)}`;
    window.location.href = url;
  }
  generateUniqueId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uniqueId = '';
    for (let i = 0; i < 16; i++) {
      uniqueId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return uniqueId;
  }
  getResponse(result: any, type: number, value: any, modalRef2: NgbModalRef, uniqueId: string, count: number) {
    let limit = 30000 / 3000;
    if (this.executionService.authenticatorConfig?.timeout) {
      limit = ((this.executionService.authenticatorConfig?.timeout + 5) * 1000) / 3000;
    }
    let timeoutMessage = 'Connection timed out';
    if (this.executionService.authenticatorConfig?.timeoutMessage) {
      timeoutMessage = this.executionService.authenticatorConfig?.timeoutMessage;
    }
    if (count < limit) {
      const headers = new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.executionService.accessToken);
      const options = { headers: headers };
      this.executionService.http.get(this.executionService.apiUrl + '/dg-external-authenticator/yubikey/piv/fetch/' + uniqueId, options)
        .subscribe(
          (data: any) => {
            console.log('API Data:', data);
            if (data.status == 2000) {
              let res;
              if (this.isMobile) {
                res = JSON.parse(data.resultJson);
              } else {
                res = JSON.parse(data.responseMessage);
              }
              if (res.Code == 2000) {
                result.userName = res?.CertificateInfo?.DGUserName ? res?.CertificateInfo?.DGUserName : result.userName;
                this.modal.userId = res?.CertificateInfo?.DGUserId;
                this.modal['authenticator'] = true;
                this.modal['authenticatorreviewerName'] = res?.CertificateInfo?.DGUserName ? true : false;
                this.modal['authenticatoruserId'] = res?.CertificateInfo?.DGUserId ? true : false;
                if (!result.userId) {
                  result.userId = this.modal.userId;
                }
                this.setSignatureValues(result);
                if (type == 1) {
                  this.setDefaultSign(value, 'Default Sign/Initial applied', this.getSignatureValue(result.value));
                  this.modal['signature'] = this.getSignatureValue(result.value);
                  this.setSignatureObject()
                  // this.sigNaturedateDateEntry(this.stepObject);
                  modalRef2.close();
                  this.cbpService.loading = false;
                  this.executionService.authenticatorConfig['state'] = false;
                  this.cdref.detectChanges();
                } else if (type == 2) {
                  this.modal['signature'] = this.getSignatureValue(result.value);
                  // this.sigNaturedateDateEntry(this.stepObject);
                  this.setSignatureObject()
                  this.cdref.detectChanges();
                  this.cbpService.loading = false;
                  this.executionService.authenticatorConfig['state'] = false;
                  modalRef2.close();
                } else if (type == 3) {
                  this.modal['signature'] = this.getSignatureValue(result.value);
                  // this.sigNaturedateDateEntry(this.stepObject);
                  this.setSignatureObject()
                  this.cbpService.loading = false;
                  this.executionService.authenticatorConfig['state'] = false;
                  modalRef2.close();
                  this.cdref.detectChanges();
                }
                //this.notifier.notify('error', 'No YubiKey device found.');
              } else if (res.Code == 3000) {
                this.notifier.notify('error', 'Invalid pin.');
                this.cbpService.loading = false;
                this.executionService.authenticatorConfig['state'] = false;
                this.modelRef.close();
                this.cdref.detectChanges();

              } else if (res.Code == 4000) {
                this.notifier.notify('error', 'No yubikey found.');
                this.cbpService.loading = false;
                this.executionService.authenticatorConfig['state'] = false;
                this.modelRef.close();
                this.cdref.detectChanges();

              } else if (res.Code == 5000) {
                this.notifier.notify('error', 'Server error');
                this.cbpService.loading = false;
                this.executionService.authenticatorConfig['state'] = false;
                this.modelRef.close();
                this.cdref.detectChanges();
              } else if (res.Code == 6000) {
                this.notifier.notify('error', timeoutMessage);
                this.cbpService.loading = false;
                this.executionService.authenticatorConfig['state'] = false;
                this.modelRef.close();
                this.cdref.detectChanges();
              } else if (res.Code == 7000) {
                this.notifier.notify('error', timeoutMessage);
                this.cbpService.loading = false;
                this.executionService.authenticatorConfig['state'] = false;
                this.modelRef.close();
                this.cdref.detectChanges();
              }
              this.cbpService.loading = false;
            }
            if (data.status == 3000) {
              this.notifier.notify('error', 'Server error');
              this.cbpService.loading = false;
              this.executionService.authenticatorConfig['state'] = false;
              this.modelRef.close();
              this.cdref.detectChanges();
            }
            this.cbpService.loading = false;
            this.signatureEnabled = false;
            this.cdref.detectChanges();
          },
          error => {
            setTimeout(() => {
              this.getResponse(result, type, value, modalRef2, uniqueId, ++count);
            }, 3000);
          },
          () => {
            console.log('Polling stopped after receiving the first response.');
          }
        );
    } else {
      this.cbpService.loading = false;
      this.executionService.authenticatorConfig['state'] = false;
      this.signatureEnabled = false;
      // this.notifier.notify('error', 'Connection timed out');
    }
  }
  setSignatureValues(result: any) {
    if (this.executionService.authenticatorConfig?.verification?.show_user_info) {
      this.modal.userId = result.userId;
      this.modal.reviewerName = result.userName;
      this.modal.comment = result.commentInfo;
      this.modal['signature'] = this.modal['signature'] ? this.modal['signature'] : this.getSignatureValue(result.value);
      this.modal['signatureDate'] = result?.signatureDate ? result?.signatureDate : this.executionService.formatDate(new Date(), `${this.cbpService.documentInfo?.dateFormatNew} h: i a`);
      this.saveButton('');
    }
  }
  updateUserInfo(fieldName: any, newVal: string,) {
    this.modal[fieldName] = newVal;
    this.saveButton(fieldName);
  }
  saveSignatureUserInfo(eventObj: any, event: any, fieldName: string) {
    console.log(event, fieldName);
    if (typeof event == 'string') {
      this.modal[fieldName] = event;
    }
    this.openOrCloseEditor(fieldName, false);
    this.saveButton(fieldName);
  }
  openOrCloseEditor(inputType: any, event: any) {
    (this as any)[inputType] = event;
    this.cdref.detectChanges();
  }
  getValue(fieldName: any) {
    let value = this.modal[fieldName];
    return value;
  }
  resetConfig() {
    this.userConfig = this.dataJsonService.config;
    this.userConfig.toolbarPosition = 'bottom';
    this.userConfig.maxHeight = '23px';
    this.userConfig.minHeight = '34px';
    this.userConfig.overFlow = 'hidden';
    this.userConfig.onlyNumber = false;
    this.userConfig.maxLengthEnabled = false;
    this.userConfig = JSON.parse(JSON.stringify(this.userConfig));
    this.notesConfig = this.dataJsonService.config;
    this.notesConfig.toolbarPosition = 'bottom';
    this.notesConfig.maxHeight = 'none';
    this.notesConfig.minHeight = this.selectedStepSectionInfo.height ? (this.selectedStepSectionInfo?.height) + 'px' : '70px';
    this.selectedStepSectionInfo['height'] = '70px';
    this.notesConfig.onlyNumber = false;
    this.notesConfig = JSON.parse(JSON.stringify(this.notesConfig));
  }
  updateAngularEditorInfo() {
    const defaultSettings = { foreColor: '#000000', defaultFontSize: '2', defaultFontName: 'Poppins' };
    const { fontsize, fontfamily, color } = this.cbpService.documentInfo || {};
    const fontChanged = (fontsize && fontsize !== defaultSettings.defaultFontSize) || (fontfamily && fontfamily !== defaultSettings.defaultFontName) || (color && color !== defaultSettings.foreColor);
    if (fontChanged) {
      this.modal['isHtmlView'] = true;
    } else {
      this.modal['isHtmlView'] = false;
    }
    this.resetConfig();
    const appliedSettings = {
      foreColor: this.cbpService.documentInfo?.color || defaultSettings.foreColor,
      defaultFontSize: this.cbpService.documentInfo?.fontsize || defaultSettings.defaultFontSize,
      defaultFontName: this.cbpService.documentInfo?.fontfamily || defaultSettings.defaultFontName
    };
    Object.assign(this.userConfig, appliedSettings);
    Object.assign(this.notesConfig, appliedSettings);
    this.userNameStep = { ...this.modal };
    this.userIdStep = { ...this.modal };
    this.commentStep = { ...this.modal };
  }
  closeModal() {
    this.sharedService.closeModalPopup('editStepTitle');
    this.closeEvent.emit(false);
  }
  ngOnDestroy(): void {
    this.closeModal();
    this.responseMsg?.unsubscribe();
  }
}
