import { HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CbpSharedService, DgTypes, PropertyDocument } from 'cbp-shared';
import { AngularEditorConfig } from 'dg-shared';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import { Event_resource, EventType, Request_Msg, Resp_Msg } from '../../ExternalAccess/medaiEventSource';
import { ActionId, DataInfo, UserInfo, VerificationForm, verificationproperty } from '../../models';
import { CbpExeService } from '../../services/cbpexe.service';
import { DataJsonService } from '../../services/datajson.service';
import { DatashareService } from '../../services/datashare.service';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';
import { SignatureEditorComponent } from '../signature-editor/signature-editor.component';
/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css'],
  providers: [DeviceDetectorService]
})
export class VerificationComponent implements OnInit, OnDestroy, OnChanges {
  @Input() dataJson: any;
  @Input() verifyDataJson: any;
  @Input() isMonitorExecution = false;
  @Input() verification: any;
  @Input() verificationType: any;
  @Input() selectedStepSectionInfo: any;
  verificationForm: any = new VerificationForm();
  deviceInfo: any;
  isMobile = false;
  subscrption: Subscription | undefined;
  web_subscription: Subscription | undefined;
  isTablet = false;
  isDesktopDevice = false;
  userName = '';
  password = '';
  verifiedUserName = '';
  loading = false;
  signaturePad = '';
  initialPad = '';
  propertyDocument: PropertyDocument = new PropertyDocument();
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  dgType = DgTypes;
  selectedSavedUser: any = 'List of Saved User';
  verificatinoName: any;
  verificatinoNotes: any;
  verificatinoSaveInfo: any;
  setSignatureAgain = true;
  @Input() verificationUsers!: any;
  @Output() verificationUsersChange: EventEmitter<any> = new EventEmitter();
  modalOptions: NgbModalOptions;
  @Output() sendDataEntryJson: EventEmitter<any> = new EventEmitter();
  signatureValue: any;
  initialValue: any;
  reviewerName: any = '';
  reviewerUserId: any = '';
  modelRef: any;
  signatureId: any = '';
  messageToSdk: any;
  @Input() authenticatorEvent: any;
  reviewerNameEditable = 1
  reviewerUserIdEditable = 1
  footerList: any = [];
  signatureEnabled!: boolean;
  userNameEditorOpened = false;
  userIdEditorOpened = false;
  userNotesEditorOpened = false;
  userNameStep: any;
  userIdStep: any;
  commentStep: any;
  userConfig!: AngularEditorConfig;
  notesConfig!: AngularEditorConfig;
  signatureDate: any = '';
  constructor(public executionService: ExecutionService,
    public cbpService: CbpExeService, public notifier: NotifierService,
    public cdref: ChangeDetectorRef, public sharedviewService: SharedviewService, private modalService: NgbModal,
    private dataSharingService: DatashareService, public dataWrapperService: DatashareService,
    public sharedService: CbpSharedService, private dataJsonService: DataJsonService) {
    this.isMobile = this.dataSharingService.getMenuConfig()?.isMobile;
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
      if (res?.msg?.msg?.data?.stepObj?.toString() == this.selectedStepSectionInfo.dgUniqueID.toString()) {
        // this.messageToSdk = res?.msg?.msg?.data;
        this.signatureId = this.getSignatureValue(this.messageToSdk?.result?.value);
        this.signatureValue = this.messageToSdk?.result?.value;
        this.cdref.detectChanges();
        this.executionService.closeSignature = false;
        this.modelRef.close();
      }
    }
  }

  ngOnInit() {
    this.subscrption = this.dataSharingService.receivedMessage.subscribe((res: Resp_Msg) => {
      console.log('uploadRef', res);
      if (res && res.eventType == EventType.setUserInfo) {
        this.setUserInfo(res.msg);
      }
      if (res && res.eventType == EventType.verifyLoginSecurity_success) {
        this.loading = false;
        this.verificationForm.verificationproperty.loginName = res.msg.userName;
        this.verificationForm.signature = '';
        this.verificationForm.initial = '';
        this.setSignValues();
        this.verificationForm.verificationproperty.signatureName = '';
        this.verificationForm.verificationproperty.signatureNotes = '';
        this.verificationForm.verificationproperty.signatureSaveInfo = false;
        this.verificationForm.empId = '';
        this.verificationForm.name = '';
        this.verificationForm.verificationproperty.codeName = '';
        this.verificationForm.verificationproperty.codeNotes = '';
        this.verificationForm.verificationproperty.codeSaveInfo = false;
        this.footerList = [{ type: 'Save', disabled: false }, { type: 'Cancel' }];
        this.cdref.detectChanges();
      }
      if (res && res.eventType == EventType.verifyLoginSecurity_Fail) {
        this.loading = false;
        this.notifier.hideAll();
        this.notifier.notify('error', 'Please enter valid credentials');
      }
      if (res?.eventType == EventType.yubikey) {
        if (res?.msg?.msg?.data?.stepObj?.toString() == this.selectedStepSectionInfo.dgUniqueID.toString()) {
          // this.messageToSdk = res?.msg?.msg?.data;
          console.log(res);
          this.setSignatureFromSDK(res?.msg?.msg?.res,
            this.messageToSdk?.result,
            this.messageToSdk?.type,
            this.messageToSdk?.value
          )
          // const data = JSON.parse(res?.msg?.msg?.res.resultJson);
          // this.reviewerName = data?.CertificateInfo?.DGUserName;
          // this.reviewerUserId = data?.CertificateInfo?.DGUserId;
          // this.verificationForm.verificationproperty.signatureName = this.reviewerName;
          // this.verificationForm.authenticator = true;
          // this.signatureId = this.getSignatureValue(this.messageToSdk?.result?.value);
          // this.signatureValue = this.messageToSdk?.result?.value;
          // this.cdref.detectChanges();
          // this.executionService.closeSignature = false;
          // this.modelRef.close();
        }
      }
    });
    this.verificationForm = new VerificationForm();
    this.verificationForm.loginType = 'login';
    this.initializeVerification();
    if (this.verification.storeValue === '' || this.verificationType === DgTypes.SkipVerification
      || this.verificationType === DgTypes.UndoAuthorization) {
      this.verificationForm.loginType = 'login';
    }
    this.sharedService.openModalPopup('verification');
    if (this.executionService.authenticatorConfig?.verification?.userid_iseditable == 0) {
      this.reviewerUserIdEditable = 0
    }
    if (this.executionService.authenticatorConfig?.verification?.username_iseditable == 0) {
      this.reviewerNameEditable = 0
    }
    this.updateFooterList();
  }
  setSignatureFromSDK(data: any, result: any, type: number, value: any) {
    if (data.status == 2000) {
      let res;
      if (this.isMobile) {
        res = JSON.parse(data.resultJson);
      } else {
        res = JSON.parse(data.responseMessage);
      }

      if (res.Code == 2000) {
        if (res?.CertificateInfo?.DGUserName) {
          this.verificationForm.authenticatorreviewerName = true;
        }
        if (res?.CertificateInfo?.DGUserId) {
          this.verificationForm.authenticatoruserId = true;
        }

        result.userName = res?.CertificateInfo?.DGUserName ? res?.CertificateInfo?.DGUserName : result.userName;
        this.reviewerUserId = res?.CertificateInfo?.DGUserId;
        this.verificationForm.verificationproperty.signatureName = result.userName;
        this.verificationForm.authenticator = true;
        if (!result.userId) {
          result.userId = this.reviewerUserId;
        }
        this.setVerificationUserInfo(result);
        this.updateFooterList();
        this.cdref.detectChanges();
        if (type == 1) {
          this.setDefaultSign(value, 'Default Sign/Initial applied', this.getSignatureValue(result.value));
          this.signatureId = this.getSignatureValue(result.value);
          this.setSignatureObject()
          // this.sigNaturedateDateEntry(this.stepObject);
          this.modelRef.close();
          this.cbpService.loading = false;
          this.executionService.authenticatorConfig['state'] = false;
          this.cdref.detectChanges();
        } else if (type == 2) {
          this.signatureId = this.getSignatureValue(result.value);
          // this.sigNaturedateDateEntry(this.stepObject);
          this.setSignatureObject()
          this.cdref.detectChanges();
          this.cbpService.loading = false;
          this.executionService.authenticatorConfig['state'] = false;
          this.modelRef.close();
        } else if (type == 3) {
          this.signatureId = this.getSignatureValue(result.value);
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

  initializeVerification() {
    let verification: any = this.dataJson.dataObjects.filter((x: any) => x.dgType === DgTypes.VerificationDataEntry);
    // console.log(verification);
    if (verification.length > 0) {
      const saveInfo: any = verification.filter((item: any) => item.name === this.verification.storeValue);
      if (saveInfo.length > 0) {
        this.verificationForm = saveInfo[saveInfo.length - 1];
        this.setInitializeValues();
        this.updateAngularEditorInfo();
      } else {
        this.setDefaultVerification();
      }
    } else {
      this.setDefaultVerification();
    }
  }
  setDefaultVerification() {
    this.verificationForm.title = (this.verificationType === DgTypes.VerificationDataEntry) ? this.verification['Prompt'] : (this.verification['action'] ? this.verification['action'] : this.verification['title']);
    this.verificationForm.title = this.cbpService.removeHTMLTags(this.verificationForm.title);
  }
  validationCheck(userName: string, password: string, isFromCode = false) {
    this.verificationForm.loginType = 'login';
    this.loading = true;
    if (this.isMobile) {
      if (!userName || !password) {
        this.loading = false;
        this.notifier.notify('error', 'Please enter valid credentials');
      } else {
        if (!isFromCode) {
          // eventHandler.fireVerificationLoginEvent(userName, password);
          let ev2: Request_Msg = { eventType: EventType.fireVerificationLoginEvent, msg: { userName: userName, password: password } };
          this.dataSharingService.sendMessageFromLibToOutside(ev2);
          this.loading = false;
        }
        else {
          let ev2: Request_Msg = { eventType: EventType.fireVerificationCodeLoginEvent, msg: { userName: userName, password: password } };
          this.dataSharingService.sendMessageFromLibToOutside(ev2);
          //this.securityLogin(userName, password);
        }
      }
    } else {
      if (!userName || !userName) {
        this.loading = false;
        this.notifier.notify('error', 'Please enter valid credentials');
      } if (userName.toLocaleLowerCase() === this.executionService.selectedUserName.toLocaleLowerCase()) {
        this.loading = false;
        this.notifier.notify('error', 'Current user is not valid to verify');
      } else {
        // this.securityLogin(userName, password);
        let evt: Request_Msg = { eventType: EventType.verifyLoginSecurity, msg: { username: userName, pwd: password } };
        this.dataWrapperService.sendMessageFromLibToOutside(evt);
      }
    }
  }

  close() {
    this.sharedService.closeModalPopup('verification');
    this.closeEvent.emit(false);
  }
  validateSignatureName() {
    if (!this.verificationForm.verificationproperty.signatureName) {
      return true;
    } else if (this.verificationForm.verificationproperty.signatureName?.trim() === '') {
      return true;
    } else {
      return false;
    }
  }
  validateCodeName() {
    if (!this.verificationForm.verificationproperty.codeName) {
      return true;
    } else if (this.verificationForm.verificationproperty.codeName?.trim() === '') {
      return true;
    } else {
      return false;
    }
  }
  saveVerification() {
    this.setVerificationInfo(this.verificationForm.verificationproperty);
    this.verificationForm['signature'] = this.signatureId;
    this.verificationForm['signatureUserName'] = !!this.reviewerName ? this.reviewerName : this.verificationForm?.loginType == 'login' ? this.verificationForm?.name : '';
    this.verificationForm['signatureUserId'] = !!this.reviewerUserId ? this.reviewerUserId : this.verificationForm?.loginType == 'login' ? this.verificationForm?.userId : '';
    if (this.verificationForm.saveInfo) { this.saveTempUser(this.verificationForm); }
    this.verificationForm.dgUniqueID = this.verification.dgUniqueID;
    this.verificationForm.createdBy = this.verificationForm.name;
    this.verificationForm.verifiedMethod = this.verificationForm.loginType;
    this.verificationForm.verifiedBy = this.executionService.selectedUserName;
    this.verificationForm.verifiedUserId = this.executionService.selectedUserId;
    this.verificationForm['signatureDate'] = this.signatureDate;
    delete this.verificationForm.verificationproperty;
    this.verificationForm.value = this.verificationForm.name;
    if (this.verificationForm['comment']) {
      this.verificationForm['notes'] = this.verificationForm['comment'];
    }
    if (this.verificationType !== DgTypes.SkipVerification) {
      this.verificationForm.dgType = this.verificationType;
      this.storeDataJsonObject(JSON.parse(JSON.stringify(this.verificationForm)));
    }
    this.closeEvent.emit({
      type: this.verificationType, object: this.verificationForm,
      dataJson: this.dataJson, verifyUsers: this.verificationUsers
    });
  }
  storeDataJsonObject(obj: any) {
    let dataInfo: any = new DataInfo();
    dataInfo.statusBy = this.executionService.selectedUserName;
    dataInfo.createdDate = new Date();
    dataInfo.createdBy = this.executionService.selectedUserName;
    dataInfo.statusDate = new Date();
    dataInfo['signature'] = this.signatureId;
    dataInfo['signatureUserName'] = !!this.reviewerName ? this.reviewerName : obj?.loginType == 'login' ? obj?.name : '';
    dataInfo['signatureUserId'] = !!this.reviewerUserId ? this.reviewerUserId : obj?.loginType == 'login' ? obj?.userId : '';
    if (this.verificationType === DgTypes.UndoAuthorization) {
      dataInfo.status = DgTypes.UndoStep;
      dataInfo['selectedStepDgUniqueID'] = this.verification.dgUniqueID;
    }
    if (this.verification['isParentRepeatStep']) {
      dataInfo['isParentRepeatStep'] = this.verification['isParentRepeatStep'];
    }
    dataInfo.dgUniqueID = (++this.dataJson.lastSessionUniqueId).toString();
    if (this.verificationType === DgTypes.VerificationDataEntry) { dataInfo.action = ActionId.Verification; }
    else if (this.verificationType === DgTypes.SkipVerification) { dataInfo.action = ActionId.SkipVerification; }
    else { dataInfo.action = ActionId.UndoVerification; }
    let dataInfoObj = { ...dataInfo, ...this.sharedviewService.setUserInfoObj(dataInfo.action), ...obj };
    if (this.verificationForm.authenticator) {
      dataInfoObj['authenticator'] = true;
    }
    if (dataInfoObj['comment']) {
      dataInfoObj['notes'] = dataInfoObj['comment'];
    }
    this.sendDataEntryJson.emit(dataInfoObj);
  }
  drawComplete(event: any) {
    this.verificationForm.signature = event;
  }
  drawInitialComplete(event: any) {
    this.verificationForm.initial = event;
  }

  setVerificationInfo(item: any) {
    if (this.verificationForm.loginType === 'login') {
      this.setVerificationItem(item.loginName, item.loginNotes, item.loginSaveInfo);
    }
    if (this.verificationForm.loginType === 'signature') {
      this.setVerificationItem(item.signatureName, item.signatureNotes, item.signatureSaveInfo);
    }
    if (this.verificationForm.loginType === 'code') {
      this.setVerificationItem(item.codeName, item.codeNotes, item.codeSaveInfo);
    }
  }

  setVerificationItem(name: any, notes: any, saveInfo: any) {
    this.verificationForm.name = name;
    this.verificationForm.comment = notes;
    this.verificationForm.saveInfo = saveInfo;
  }
  setStoreVerificationInfo() {
    if (this.verificationForm.loginType === 'login') {
      this.setStoreKeyValues('loginName', 'loginNotes', 'loginSaveInfo');
    }
    if (this.verificationForm.loginType === 'signature') {
      this.setStoreKeyValues('signatureName', 'signatureNotes', 'signatureSaveInfo');
    }
    if (this.verificationForm.loginType === 'code') {
      this.setStoreKeyValues('codeName', 'codeNotes', 'codeSaveInfo');
    }
  }
  setStoreKeyValues(name: any, notes: any, saveInfo: any) {
    this.verificationForm.verificationproperty[name] = this.verificationForm.name; //!! means it's checking the null and undefined and empty
    this.verificationForm.verificationproperty[notes] = this.getFallbackValue(this.verificationForm['notes'], this.verificationForm['comment'])
    this.verificationForm.verificationproperty[saveInfo] = this.verificationForm.saveInfo;
    this.reviewerName = this.getFallbackValue(this.verificationForm['reviewerName'], this.verificationForm['signatureUserName'])
    this.reviewerUserId = this.getFallbackValue(this.verificationForm['reviewerUserId'], this.verificationForm['signatureUserId'])
  }

  getSelectedUserInfo(event: any, oldTitle: string) {
    const userInfo = this.verificationUsers.filter((x: any) => x.name === this.selectedSavedUser);
    if (userInfo.length > 0) {
      this.verificationForm = userInfo[0].userObj;
      this.signatureId = this.verificationForm['signature'];
      this.reviewerName = this.getFallbackValue(this.verificationForm['reviewerName'], this.verificationForm['signatureUserName']);
      this.reviewerUserId = this.getFallbackValue(this.verificationForm['reviewerUserId'], this.verificationForm['signatureUserId']);
      this.verificationForm.title = oldTitle;
      this.verificationForm.dgUniqueID = this.verification.dgUniqueID;
      this.signatureDate = this.executionService.formatDate(new Date(), `${this.cbpService.documentInfo?.dateFormatNew} h: i a`);
      this.setInitializeValues();
      this.updateHtmlView({ userName: this.reviewerName, userId: this.reviewerUserId, commentInfo: this.verificationForm?.comment });
      if (this.verification?.isHtmlView) { this.updateAngularEditorInfo() }
      this.updateFooterList();
    }
  }

  getFallbackValue(value: any, fallback: any): any {
    return (value !== undefined && value !== null && value !== '') ? value : fallback;
  }

  setInitializeValues() {
    this.verificationForm.verificationproperty = new verificationproperty();
    this.setStoreVerificationInfo();
    console.log(this.verificationForm);
    if (this.verificationForm.loginType === 'signature') {
      this.setSignatureAgain = false;
      setTimeout(() => {
        this.setSignValues();
        this.setSignatureAgain = true;
      }, 10);
    }
  }
  setSignValues() {
    this.signatureValue = this.executionService.signatureJson.find((i: any) =>
      i.TxnId == this.verificationForm.signature)?.value;
    this.initialValue = this.executionService.signatureJson.find((i: any) =>
      i.TxnId == this.verificationForm.initial)?.value;
  }
  saveTempUser(user: any) {
    const isNameThere = this.verificationUsers.filter((x: any) => x.name === user.name);
    if (isNameThere.length > 0) {
      console.log('name is there');
    } else {
      const userObjKey = this.removeUnUsedKeys(user);
      this.verificationUsers.push({ name: user.name, userObj: JSON.parse(JSON.stringify(userObjKey)), isHtmlText: this.cbpService.isHTMLText(user?.name) });
      console.log(this.verificationUsers);
    }
  }
  removeUnUsedKeys(obj: any) {
    delete obj.title;
    delete obj.dgUniqueID;
    return obj;
  }
  selectSaveVerificatin(event: any) {
    if (event.target.checked) {
      console.log(event);
    } else {
      const userDelete = this.verificationUsers.filter((x: any) => x.name === this.verificationForm.name);
      if (userDelete.length > 0) {
        const index = this.verificationUsers.findIndex((x: any) => x.name === this.verificationForm.name);
        this.verificationUsers.splice(index, 1);
        this.selectedSavedUser = 'List of Saved User';
      }
    }
    this.saveVerifyUsers();
  }
  setTabType() {
    console.log(this.reviewerName && this.verificationForm.authenticator && this.verificationForm.authenticatorreviewerName || this.reviewerNameEditable == 0);
    if (this.verificationForm.loginType == 'signature') {
      if (!this.verificationForm['verificationproperty']) { this.verificationForm.verificationproperty = new verificationproperty(); }
      this.verificationForm.verificationproperty['signatureNotes'] = ''
      this.updateAngularEditorInfo();
    }
    //  console.log(this.verificationForm.loginType);
  }

  saveVerifyUsers() {
    this.verificationUsersChange.emit(this.verificationUsers);
  }

  setSignature(event: any) {
    if (event.type === 'signature') {
      this.verificationForm.signature = this.getSignatureValue(event.value);
      this.signatureValue = this.executionService.signatureJson.find((i: any) =>
        i.TxnId == this.verificationForm.signature)?.value;
    } else {
      this.verificationForm.initial = this.getSignatureValue(event.value);
      this.initialValue = this.executionService.signatureJson.find((i: any) =>
        i.TxnId == this.verificationForm.initial)?.value;
    }
    if (this.verificationForm.signature || this.verificationForm.initial) {
      this.verificationForm.userId = '';
      this.verificationForm.password = '';
      this.verificationForm.verificationproperty.loginName = '';
      this.verificationForm.verificationproperty.loginNotes = '';
      this.verificationForm.verificationproperty.loginSaveInfo = false;
      this.verificationForm.empId = '';
      this.verificationForm.name = '';
      this.verificationForm.verificationproperty.codeName = '';
      this.verificationForm.verificationproperty.codeNotes = '';
      this.verificationForm.verificationproperty.codeSaveInfo = false;
      this.cdref.detectChanges();
    }
  }

  storeDataObj() {
    let dataInfo: DataInfo = new DataInfo();
    dataInfo.statusBy = this.executionService.selectedUserName;
    dataInfo.createdDate = new Date();
    dataInfo.createdBy = this.executionService.selectedUserName;
    dataInfo.statusDate = new Date();
    let dataInfoObj = { ...dataInfo, ...this.setUserInfoObj(dataInfo.action) };
    return dataInfoObj;
  }

  setUserInfoObj(action: any) {
    const userInfo: UserInfo = new UserInfo(new Date().getTime(), action, this.executionService.selectedUserId, new Date(), this.sharedviewService.getDeviceInfo(), this.sharedviewService.gpsInfo(), '', this.executionService.selectedUserName);
    return userInfo;
  }
  setUserInfo(userName: string) {
    this.verificationForm.verificationproperty.loginName = userName;
    this.loading = false;
    this.cdref.detectChanges();
  }
  //Tablet Functionality
  fireSignatureEvent(stepObject: any, isInitial = false, component = 'verification') {
    // this.cbpService.activeComponent = component;
    // if(isInitial) {
    //   stepObject['dimensions'] = { window_width : '770px' , window_height : '250px'};
    // } else {
    //   stepObject['dimensions'] = { window_width : '770px' , window_height : '250px'};
    // }

    let ev2: Request_Msg = { eventType: EventType.fireSignatureEvent, msg: { stepObject: stepObject, isInitial: isInitial } };
    this.dataSharingService.sendMessageFromLibToOutside(ev2);
    // eventHandler.fireSignatureEvent(stepObject, isInitial);
  }
  triggerScanevent(verificationForm: any) {
    //  eventHandler.triggerScanevent(verificationForm);
    let ev2: Request_Msg = { eventType: EventType.triggerScanevent, msg: verificationForm };
    this.dataSharingService.sendMessageFromLibToOutside(ev2);
  }
  triggerCodeScanevent(verificationForm: any) {
    // eventHandler.triggerCodeScanevent(verificationForm);
    let ev2: Request_Msg = { eventType: EventType.triggerCodeScanevent, msg: verificationForm };
    this.dataSharingService.sendMessageFromLibToOutside(ev2);
  }
  getSignatureData(obj: any, typeValu: any) {
    if (!this.signatureValue) {
      // if (this.executionService.defualtSign) { //commented this line as default sign is not applicable for verifications
      //   this.signatureValue = this.executionService.defualtSign;
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
      this.messageToSdk = null;
      this.modalOptions['windowClass'] = 'my-signature-class';
      this.signatureEnabled = true;
      const modalRef = this.modalService.open(SignatureEditorComponent, this.modalOptions);
      this.modelRef = modalRef;
      modalRef.componentInstance.selectedStep = this.verification;
      modalRef.componentInstance.selectedSignture = this.verification;
      modalRef.componentInstance.isSignatureFromFormView = false;
      modalRef.componentInstance.hideDefault = true;
      modalRef.componentInstance.type = value;
      const authConfig = this.executionService.authenticatorConfig?.verification
      modalRef.componentInstance.isSignatureEnabled = authConfig?.show_user_info;
      modalRef.componentInstance.userIdEditable = this.reviewerUserIdEditable;
      modalRef.componentInstance.userNameEditable = this.reviewerNameEditable;
      modalRef.componentInstance.isUserIdRequired = authConfig?.userid_is_required;
      modalRef.componentInstance.isUserNameRequired = authConfig?.username_is_required;
      modalRef.componentInstance.documentInfo = this.cbpService.documentInfo;
      modalRef.componentInstance.dataJsonService = this.dataJsonService;
      modalRef.componentInstance.isYubikeyEnabled = this.executionService.authenticatorConfig?.verification?.authenticator == 'yubikey' ? true : false;
      modalRef.componentInstance.updateFooterList();
      modalRef.componentInstance.closeEvent.subscribe(async (result: any) => {
        if (result != false) {
          if (this.executionService.authenticatorConfig?.verification?.authenticator == 'yubikey') {
            this.openYubikeyPopup(result, 2, value, modalRef);
          } else {
            this.signatureId = this.getSignatureValue(result.value);
            this.setSignatureObject();
            this.setSignatureValues(result);
            this.signatureEnabled = false;
            this.cdref.detectChanges();
            this.executionService.closeSignature = false;
            modalRef.close();
          }
          this.updateSignatureFooterList()
        } else {
          this.signatureEnabled = false;
          this.executionService.closeSignature = false;
          modalRef.close();
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
      i.TxnId == this.signatureId)?.value;
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
        stepObj: this.selectedStepSectionInfo.dgUniqueID
      }
      let message = {
        result: null,
        type: type,
        value: value,
        stepObj: this.selectedStepSectionInfo.dgUniqueID
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
                if (res?.CertificateInfo?.DGUserName) {
                  this.verificationForm.authenticatorreviewerName = true;
                }
                if (res?.CertificateInfo?.DGUserId) {
                  this.verificationForm.authenticatoruserId = true;
                }
                result.userName = res?.CertificateInfo?.DGUserName ? res?.CertificateInfo?.DGUserName : result.userName;
                this.reviewerUserId = res?.CertificateInfo?.DGUserId;
                this.verificationForm.verificationproperty.signatureName = result.userName;
                this.verificationForm.authenticator = true;
                if (!result.userId) {
                  result.userId = this.reviewerUserId;
                }
                this.setVerificationUserInfo(result);
                this.updateFooterList();
                this.cdref.detectChanges();
                if (type == 1) {
                  this.setDefaultSign(value, 'Default Sign/Initial applied', this.getSignatureValue(result.value));
                  this.signatureId = this.getSignatureValue(result.value);
                  this.setSignatureObject()
                  // this.sigNaturedateDateEntry(this.stepObject);
                  modalRef2.close();
                  this.cbpService.loading = false;
                  this.executionService.authenticatorConfig['state'] = false;
                  this.cdref.detectChanges();
                } else if (type == 2) {
                  this.signatureId = this.getSignatureValue(result.value);
                  // this.sigNaturedateDateEntry(this.stepObject);
                  this.setSignatureObject()
                  this.cdref.detectChanges();
                  this.cbpService.loading = false;
                  this.executionService.authenticatorConfig['state'] = false;
                  modalRef2.close();
                } else if (type == 3) {
                  this.signatureId = this.getSignatureValue(result.value);
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
                //this.notifier.notify('error', timeoutMessage);
                this.cbpService.loading = false;
                this.executionService.authenticatorConfig['state'] = false;
                this.modelRef.close();
                this.cdref.detectChanges();
              }
              this.signatureEnabled = false;
              this.cbpService.loading = false;
              this.cdref.detectChanges();
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
            this.cbpService.loading = false;
            console.log('Polling stopped after receiving the first response.');
          }
        );
    } else {
      this.cbpService.loading = false;
      this.executionService.authenticatorConfig['state'] = false;
      // this.notifier.notify('error', 'Connection timed out');
    }
  }
  updateUserInfo(fieldName: any, newVal: string,) {
    if (fieldName == 'signatureNotes') {
      this.verificationForm.verificationproperty.signatureNotes = newVal;
      return;
    }
    (this as any)[fieldName] = newVal;
    if (fieldName == 'reviewerName') { this.changeEvent(newVal); }
    this.updateSignatureFooterList()
  }
  saveSignatureUserInfo(eventObj: any, event: any, fieldName: string) {
    // (this as any)[fieldName] = event;
    this.openOrCloseEditor(fieldName, false);
    this.updateSignatureFooterList();
  }
  getValue(fieldName: any) {
    if (fieldName == 'signatureNotes') {
      return this.verificationForm.verificationproperty.signatureNotes
    }
    let value = (this as any)[fieldName];
    return value;
  }
  openOrCloseEditor(inputType: any, event: any) {
    (this as any)[inputType] = event;
  }
  changeEvent(name: string) {
    this.verificationForm.verificationproperty.signatureName = name;
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
    this.notesConfig.minHeight = this.verification?.height ? (this.verification?.height) + 'px' : '70px';
    this.verification['height'] = '70px';
    this.notesConfig.onlyNumber = false;
    this.notesConfig = JSON.parse(JSON.stringify(this.notesConfig));
  }
  updateAngularEditorInfo() {
    const defaultSettings = { foreColor: '#000000', defaultFontSize: '2', defaultFontName: 'Poppins' };
    const { fontsize, fontfamily, color } = this.cbpService.documentInfo || {};
    const fontChanged = (fontsize && fontsize !== defaultSettings.defaultFontSize) || (fontfamily && fontfamily !== defaultSettings.defaultFontName) || (color && color !== defaultSettings.foreColor);
    if (fontChanged) {
      this.verification['isHtmlView'] = true;
    } else {
      this.verification['isHtmlView'] = false;
    }
    this.resetConfig();
    const appliedSettings = {
      foreColor: this.cbpService.documentInfo?.color || defaultSettings.foreColor,
      defaultFontSize: this.cbpService.documentInfo?.fontsize || defaultSettings.defaultFontSize,
      defaultFontName: this.cbpService.documentInfo?.fontfamily || defaultSettings.defaultFontName
    };
    Object.assign(this.userConfig, appliedSettings);
    Object.assign(this.notesConfig, appliedSettings);
    this.userNameStep = { ...this.verification };
    this.userIdStep = { ...this.verification };
    this.commentStep = { ...this.verification };
  }
  setSignatureValues(result: any) {
    if (this.executionService.authenticatorConfig?.verification?.show_user_info) {
      this.setVerificationUserInfo(result);
      this.changeEvent(result.userName);
      // this.updateFooterList();
      this.cdref.detectChanges();
    }
  }
  setVerificationUserInfo(result: any) {
    this.reviewerUserId = result.userId;
    this.reviewerName = result.userName;
    this.verificationForm.verificationproperty.signatureNotes = result.commentInfo;
    this.signatureDate = result?.signatureDate ? result?.signatureDate : this.executionService.formatDate(new Date(), `${this.cbpService.documentInfo?.dateFormatNew} h: i a`),
      this.updateHtmlView(result);
  }
  updateHtmlView(result: any) {
    if (this.cbpService.isHTMLText(result.userId) || this.cbpService.isHTMLText(result.userName) || this.cbpService.isHTMLText(result.commentInfo)) {
      this.verification['isHtmlView'] = true; this.userNameStep = { ...this.verification };
      this.userIdStep = { ...this.verification };
      this.commentStep = { ...this.verification };
    };
    this.updateFooterList();
  }
  updateFooterList() {
    this.footerList = [{
      type: 'Save', disabled: !this.verificationForm.verificationproperty?.loginName &&
        this.validateSignatureName() && this.validateCodeName()
    }, { type: 'Cancel' }];
  }
  updateSignatureFooterList() {
    const authConfig = this.executionService.authenticatorConfig?.verification
    let isUserIdInvalid = false;
    let isUserNameInvalid = false;
    if (authConfig?.authenticator == "yubikey") {
      isUserIdInvalid = (authConfig?.userid_is_required == 1) ? !this.reviewerUserId?.toString().trim() : false;
      isUserNameInvalid = (authConfig?.username_is_required == 1) ? !this.reviewerName?.toString().trim() : false;
    } else {
      isUserIdInvalid = (authConfig?.userid_is_required == 1 && this.reviewerUserIdEditable == 1) ? !this.reviewerUserId?.toString().trim() : false;
      isUserNameInvalid = (authConfig?.username_is_required == 1 && this.reviewerNameEditable == 1) ? !this.reviewerName?.toString().trim() : false;
    }
    const isSignatureInvalid = !this.signatureValue;
    const isSignatureValid = isSignatureInvalid || isUserIdInvalid || isUserNameInvalid;
    this.footerList = [{ type: 'Save', disabled: isSignatureValid }, { type: 'Cancel' }];
  }
  ngOnDestroy(): void {
    this.close();
    this.subscrption?.unsubscribe();
    this.web_subscription?.unsubscribe();
  }
}
