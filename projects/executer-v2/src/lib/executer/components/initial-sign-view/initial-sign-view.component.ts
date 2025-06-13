import { HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { DgTypes } from 'cbp-shared';
import { AngularEditorConfig } from 'dg-shared';
import { Subscription } from 'rxjs';
import { Event_resource, EventType, Request_Msg } from '../../ExternalAccess/medaiEventSource';
import { ActionId, DataInfo, Initial, UserInfo } from '../../models';
import { ProtectObject } from '../../models/protectObject';
import { CbpExeService } from '../../services/cbpexe.service';
import { DataJsonService } from '../../services/datajson.service';
import { DatashareService } from '../../services/datashare.service';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';
import { TableService } from '../../shared/services/table.service';
import { SignatureEditorComponent } from '../signature-editor/signature-editor.component';
declare const $: any, swal: any;

/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */

@Component({
  selector: 'app-initial-sign-view',
  templateUrl: './initial-sign-view.component.html',
  styleUrls: ['./initial-sign-view.component.css']
})
export class InitialSignViewComponent {
  @Input() stepObject: any;
  @Input() obj: any;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  @Output() setDataEntryJson: EventEmitter<any> = new EventEmitter();
  dgType = DgTypes;
  styleObject: any;
  modalOptions: {};
  styleModel_subscription!: Subscription;
  config!: AngularEditorConfig;
  color_subscription!: Subscription;
  initialValue: any;
  removeSignature!: Subscription;
  subscription!: Subscription;
  isMobile: boolean = false;
  modelRef!: NgbModalRef;
  messageToSdk!: any;
  notesConfig!: AngularEditorConfig;

  constructor(public cbpService: CbpExeService, public executionService: ExecutionService, public cdr: ChangeDetectorRef,
    public sharedviewService: SharedviewService, private modalService: NgbModal,
    private dataJsonService: DataJsonService, public tableService: TableService,
    private notifier: NotifierService, public datashareService: DatashareService) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'lg'
    }
  }
  ngOnInit(): void {
    if (this.stepObject['Prompt'] && !this.stepObject['prompt']) {
      this.stepObject['prompt'] = this.stepObject['Prompt'];
    }
    this.isMobile = this.datashareService.getMenuConfig()?.isMobile;
    if (this.stepObject?.isTableDataEntry && !this.stepObject['initialNotes']) { this.stepObject['initialNotes'] = '' }
  }
  ngAfterViewInit(): void {
    const self = this;
    $('.popuptextClose').click(function (e: any) {
      $('#refObjLinkDrop-' + self.executionService.refObjID).find('.popuptextContent').remove();
      $('.popuptext').css("display", "none");
      self.executionService.refObjValueState = 0
      e.stopPropagation();
    })
    $('.hyperlink').unbind().click(function (e: any) {
      self.executionService.setrefObj(e);
      e.stopPropagation();
    })
    this.setInitialObj();
    this.cdr.detectChanges();
    this.resetConfig();
    this.stepObject = this.dataJsonService.setObjectItem(this.stepObject);
    this.stepObject['initialName'] = this.stepObject['initialName'] ?? '';
    this.config = JSON.parse(JSON.stringify(this.config));
    this.styleModel_subscription = this.executionService.styleModelobjValue.subscribe((res: any) => {
      if (res && res != '{}' && !this.executionService.isEmpty(res)) {
        this.styleObject = this.sharedviewService.setStyles(res['levelNormal']);
        this.cdr.detectChanges();
      }
    });
    this.color_subscription = this.executionService.colorUpdateView.subscribe((res: any) => {
      if (res && res != '{}' && !this.executionService.isEmpty(res) && res?.color) {
        if (this.stepObject?.isTableDataEntry) { this.stepObject['notesHtmlView'] = false; }
        this.stepObject['innerHtmlView'] = false;
        this.stepObject['color'] = JSON.parse(JSON.stringify(res.color));
        this.config.foreColor = this.stepObject['color'];
        this.config = JSON.parse(JSON.stringify(this.config));
        this.stepObject['innerHtmlView'] = true;
        if (this.stepObject?.isTableDataEntry) {
          this.stepObject['notesHtmlView'] = true;
          this.notesConfig.foreColor = this.stepObject['color'];
          this.notesConfig = JSON.parse(JSON.stringify(this.notesConfig));
        }
        this.stepObject = this.cbpService.checkInnerHtml(this.stepObject);
        if (this.stepObject) { this.stepObject['notesHtmlView'] = this.stepObject['innerHtmlView']; }
      }
      this.cdr.detectChanges();
    });
    this.removeSignature = this.dataJsonService.removeSignEventValue.subscribe((res: any) => {
      if (res && !this.executionService.isEmpty(res)) {
        let findId = res.filter((item: any) => item.dgUniqueID == this.stepObject.dgUniqueID);
        if (findId?.length > 0) {
          // clear sign and store sign
          let dataInfo: any = this.storeDataObj();
          dataInfo['value'] = '';
          this.stepObject.signatureValue = '';
          // this.executionService.signatureJson.push(dataInfo);
          this.stepObject.initialStore = '';
          this.stepObject.initialName = '';
          this.saveInitial(this.stepObject)
          this.setInitialObj();
        }
      }
    });
    this.subscription = this.datashareService.receivedMessage.subscribe((res: Request_Msg) => {
      if (res?.eventType == EventType.yubikey) {
        if (res?.msg?.msg?.data?.stepObj?.toString() == this.stepObject.dgUniqueID.toString()) {
          console.log(res)
          this.setInitialFromSDK(res?.msg?.msg?.res,
            this.messageToSdk?.result,
            this.messageToSdk?.type)
        }
      }
    })

  }
  setInitialObj() {
    this.initialValue = this.executionService.signatureJson.find((i: any) =>
      i.TxnId == this.stepObject.initialStore)?.value;
    if (this.stepObject.authenticator) {
      if (this.stepObject.initialName) {
        this.stepObject['initialNameDisable'] = true;
      }
    }
    if (this.executionService.authenticatorConfig?.initial?.username_iseditable == 0) {
      this.stepObject['initialNameDisable'] = true;
    }
  }
  resetConfig() {
    this.config = this.dataJsonService.config;
    this.config.toolbarPosition = 'bottom';
    this.config.maxHeight = '23px';
    this.config.minHeight = '34px';
    this.config.overFlow = 'hidden';
    this.config.onlyNumber = false;
    this.config.maxLengthEnabled = false;
    this.config = JSON.parse(JSON.stringify(this.config));
    this.notesConfig = this.dataJsonService.config;
    this.notesConfig.toolbarPosition = 'bottom';
    this.notesConfig.maxHeight = 'none';
    this.notesConfig.minHeight = this.stepObject?.height ? (this.stepObject?.height) + 'px' : '70px';
    this.stepObject.height = '70px';
    this.notesConfig.onlyNumber = false;
    this.notesConfig = JSON.parse(JSON.stringify(this.notesConfig));
  }

  fireSignatureEvent(stepObject: any, isInitial = false, component = 'signature') {
    // this.cbpService.activeComponent = component;
    // if(isInitial) {
    //   stepObject['dimensions'] = { window_width : '60px' , window_height : '60px'};
    // } else {
    //   stepObject['dimensions'] = { window_width : '650px' , window_height : '60px'};
    // }
    // eventHandler.fireSignatureEvent(stepObject, isInitial);
  }

  saveSignature(eventObj: any, event: any) {
    this.cbpService.signatureFieldItem = 'initialName';
    this.executionService.selectedNewEntry = this.stepObject;
    this.executionService.selectedField({ stepItem: this.obj, stepObject: this.stepObject, showMenuText: true });
  }

  saveInitial(stepObject: any) {
    this.saveSignature({}, {});
    const obj: any = new Initial(stepObject.initialName, stepObject.initialStore, stepObject.initialName,
      stepObject.initialStore, stepObject.dgUniqueID);
    if (stepObject.initialUserId) {
      obj['initialUserId'] = stepObject.initialUserId;
      obj['signatureUserId'] = stepObject.initialUserId;
    }
    if (stepObject.initialNotes) {
      obj['initialNotes'] = stepObject.initialNotes;
      obj['notes'] = stepObject.initialNotes;
    }
    if (stepObject.initialName) {
      obj['signatureUserName'] = stepObject.initialName
    }
    if (stepObject?.signatureDate) {
      obj['signatureDate'] = stepObject.signatureDate
    }
    this.storeDataJsonObject(obj, 6300);
  }
  storeDataJsonObject(obj: any, action: any) {
    let dataInfo: DataInfo = new DataInfo();
    dataInfo.statusBy = this.executionService.selectedUserName;
    dataInfo.createdDate = new Date();
    dataInfo.createdBy = this.executionService.selectedUserName;
    dataInfo.statusDate = new Date();
    dataInfo.action = action;
    let dataInfoObj = { ...dataInfo, ...this.sharedviewService.setUserInfoObj(dataInfo.action), ...obj };
    if (this.executionService?.authenticatorConfig?.['state']) {
      dataInfoObj['authenticator'] = true;
      dataInfoObj['initialName'] = this.stepObject['initialName']
      dataInfoObj['initialUserId'] = this.stepObject['initialUserId']
      dataInfoObj['initialNotes'] = this.stepObject['initialNotes']

    }
    if (this.stepObject['isParentRepeatStep']) {
      dataInfoObj['isParentRepeatStep'] = this.stepObject['isParentRepeatStep'];
    }
    this.cbpService.dataJson.dataObjects.push(dataInfoObj);
    this.datashareService.changeCount++;
    this.setDataEntryJson.emit(false);
  }

  async getSignatureData(obj: any, typeValu: any) {
    // this.closeEvent.emit({step: obj, type: typeValu});
    if (!this.stepObject['initialStore'] && this.executionService.defualtInitial) {
      this.stepObject['initialStore'] = this.getSignatureValue(this.executionService.defualtInitial);
      //  this.stepObject['signatureValue'] = this.getSignatureValue(this.executionService.defualtInitial);
      this.updateDefaultUserInfo(this.executionService.defaultInitialUserInfo);
      this.cdr.detectChanges();
      this.saveInitial(this.stepObject);
      this.setInitialObj();
      if (this.stepObject['initialStore'] !== '') {
        if (this.cbpService.documentInfo['isDataProtected'] && this.executionService.isDataProtected) {
          this.protectData();
        } else if (this.cbpService.documentInfo['isDataProtected'] && !this.executionService.isDataProtected) {
          const { value: userConfirms, dismiss } = await this.cbpService.showCustomSwal('Do you want to protect data?', 'info', 'cancel', 'Ok');
          if (!dismiss && userConfirms) {
            this.protectData();
          }
        }
      }
    } else {
      this.openSignaturePopup();
    }
  }

  updateDefaultUserInfo(result: any) {
    const baseFormat = this.cbpService.documentInfo?.dateFormat ?? 'm/d/Y';
    const formattedDate = this.executionService.formatDate(new Date(), `${baseFormat} h: i a`);
    if (formattedDate) { this.stepObject['signatureDate'] = formattedDate }
    if (!!result) {
      this.stepObject['initialNotes'] = result?.notes;
      this.stepObject['initialUserId'] = result?.userId;
      this.stepObject['initialName'] = result?.userName;
      if (this.cbpService.isHTMLText(result?.notes)) {
        this.stepObject['signatureDate'] = this.executionService.addDateWithFontTag(this.stepObject['signatureDate'], this.cbpService.documentInfo)
      }
    }
  }
  openSignaturePopup() {
    if (!this.cbpService.selectCellEnabled) {
      this.messageToSdk = null;
      const modalRef = this.modalService.open(SignatureEditorComponent, this.modalOptions);
      this.modelRef = modalRef;
      modalRef.componentInstance.selectedStepSectionInfo = this.obj;
      modalRef.componentInstance.selectedSignture = this.stepObject;
      modalRef.componentInstance.title = 'Initial Pad';
      modalRef.componentInstance.isSignatureEnabled = this.executionService.authenticatorConfig?.initial?.show_user_info;
      modalRef.componentInstance.isUserIdRequired = this.executionService.authenticatorConfig?.initial?.userid_is_required;
      modalRef.componentInstance.isUserNameRequired = this.executionService.authenticatorConfig?.initial?.username_is_required;
      modalRef.componentInstance.userIdEditable = this.executionService.authenticatorConfig?.initial?.userid_iseditable;
      modalRef.componentInstance.userNameEditable = this.executionService.authenticatorConfig?.initial?.username_iseditable;
      modalRef.componentInstance.documentInfo = this.cbpService.documentInfo;
      modalRef.componentInstance.dataJsonService = this.dataJsonService;
      modalRef.componentInstance.isYubikeyEnabled = this.executionService.authenticatorConfig?.initial?.authenticator == 'yubikey' ? true : false;
      modalRef.componentInstance.updateFooterList();
      modalRef.componentInstance.defaultSignEvent.subscribe(async (result: any) => {
        if (result != false) {
          if (result.type == 'save') {
            this.setInitialValues(result);
            if (this.executionService.authenticatorConfig?.initial?.authenticator == 'yubikey') {
              this.openYubikeyPopup(result, 1, modalRef);
            } else {
              this.executionService.defualtInitial = this.getSignatureValue(result.value);
              this.setDefaultInitialUserInfo(result);
              this.stepObject['type'] = result.type;
              this.stepObject['initialStore'] = this.getSignatureValue(result.value);
              if (result?.notes) { this.stepObject['initialNotes'] = result?.notes }
              this.saveInitial(this.stepObject);
              this.setInitialObj();
              this.notifier.notify('success', 'Default Initial applied');
              if (result.value !== '') {
                if (this.cbpService.documentInfo['isDataProtected'] && this.executionService.isDataProtected) {
                  this.protectData();
                } else if (this.cbpService.documentInfo['isDataProtected'] && !this.executionService.isDataProtected) {
                  const { value: userConfirms, dismiss } = await this.cbpService.showCustomSwal('Do you want to protect data?', 'info', 'cancel', 'Ok');
                  if (!dismiss && userConfirms) {
                    this.protectData();
                  }
                }
              }
              this.closeEvent.emit({ event: this.obj, stepObj: this.stepObject, value: this.getSignatureValue(result.value) });
              this.cdr.detectChanges();
              this.executionService.closeSignature = false;
              modalRef.close();
            }
          }
          if (result.type == 'remove') {
            this.executionService.defualtInitial = null;
            this.setDefaultInitialUserInfo(result);
            this.notifier.notify('success', 'Default Initial removed');
            this.executionService.closeSignature = false;
            modalRef.close();
          }
        }
      })
      modalRef.componentInstance.closeEvent.subscribe(async (result: any) => {
        if (result != false) {
          this.setInitialValues(result);
          if (this.executionService.authenticatorConfig?.initial?.authenticator == 'yubikey') {
            this.openYubikeyPopup(result, 2, modalRef);
          } else {
            this.stepObject['type'] = result.type;
            this.stepObject['initialStore'] = this.getSignatureValue(result.value);
            this.saveInitial(this.stepObject);
            this.setInitialObj();
            if (result.value !== '') {
              if (this.cbpService.documentInfo['isDataProtected'] && this.executionService.isDataProtected) {
                this.protectData();
              } else if (this.cbpService.documentInfo['isDataProtected'] && !this.executionService.isDataProtected) {
                const { value: userConfirms, dismiss } = await this.cbpService.showCustomSwal('Do you want to protect data?', 'info', 'cancel', 'Ok');
                if (!dismiss && userConfirms) {
                  this.protectData();
                }
              }
            }
            this.closeEvent.emit({ event: this.getSignatureValue(result.value), stepObj: this.stepObject, value: this.getSignatureValue(result.value) });
            this.cdr.detectChanges();
            this.executionService.closeSignature = false;
            modalRef.close();
          }
        } else {
          this.executionService.closeSignature = false;
          modalRef.close();
        }
      });
      modalRef.componentInstance.protectAllFields.subscribe(async (result: any) => {
        if (result != false) {
          this.setInitialValues(result);
          if (this.executionService.authenticatorConfig?.initial?.authenticator == 'yubikey') {
            this.openYubikeyPopup(result, 3, modalRef);
          } else {
            this.stepObject['type'] = result.type;
            this.stepObject['initialStore'] = this.getSignatureValue(result.value);
            this.saveInitial(this.stepObject);
            this.setInitialObj();
            this.cbpService.protectAllFields.emit();
            this.executionService.closeSignature = false;
            modalRef.close();
          }
        } else {
          this.executionService.closeSignature = false;
          modalRef.close();
        }
      });
    }
  }
  openYubikeyPopup(result: any, type: number = 1, modalRef2: NgbModalRef) {
    if (this.isMobile) {
      this.executionService.authenticatorConfig['state'] = true;
      this.messageToSdk = {
        result: result,
        type: type,
        stepObj: this.stepObject.dgUniqueID
      }
      let message = {
        result: null,
        type: type,
        stepObj: this.stepObject.dgUniqueID
      }
      let evt: Request_Msg = { eventType: EventType.yubikey, msg: message, eventFrom: Event_resource.initial };
      this.datashareService.sendMessageFromLibToOutside(evt)
    } else {
      // this.cbpService.loading = true;
      this.cdr.detectChanges();

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
        this.getResponse(result, type, modalRef2, uniqueId, 0);
      }, 5000);
    }

  }
  getResponse(result: any, type: number, modalRef2: NgbModalRef, uniqueId: string, count: number) {
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
          async (data: any) => {
            console.log('API Data:', data);
            if (data.status == 2000) {
              let res;
              if (this.isMobile) {
                res = JSON.parse(data.resultJson);
              } else {
                res = JSON.parse(data.responseMessage);
              }
              if (res.Code == 2000) {
                this.stepObject['initialName'] = res?.CertificateInfo?.DGUserName;
                this.stepObject['initialUserId'] = res?.CertificateInfo?.DGUserId;
                if (!result.userId) {
                  result.userId = this.stepObject['initialUserId'];
                }
                if (this.stepObject['initialName']) {
                  result.userName = this.stepObject['initialName'];
                }
                this.setInitialValues(result);
                if (type == 1) {
                  this.executionService.defualtInitial = this.getSignatureValue(result.value);
                  this.setDefaultInitialUserInfo(result);
                  this.setInitialObj();
                  this.notifier.notify('success', 'Default Initial applied');
                  if (result.value !== '') {
                    if (this.cbpService.documentInfo['isDataProtected'] && this.executionService.isDataProtected) {
                      this.protectData();
                    } else if (this.cbpService.documentInfo['isDataProtected'] && !this.executionService.isDataProtected) {
                      const { value: userConfirms, dismiss } = await this.cbpService.showCustomSwal('Do you want to protect data?', 'info', 'cancel', 'Ok');
                      if (!dismiss && userConfirms) {
                        this.protectData();
                      }
                    }
                  }
                  this.closeEvent.emit({ event: this.getSignatureValue(result.value), stepObj: this.stepObject, value: this.getSignatureValue(result.value) });

                  modalRef2.close();
                  this.cbpService.loading = false;
                  this.executionService.authenticatorConfig['state'] = false;

                  this.cdr.detectChanges();

                } else if (type == 2) {
                  this.stepObject['type'] = result.type;
                  this.stepObject['initialStore'] = this.getSignatureValue(result.value);
                  this.saveInitial(this.stepObject);
                  this.setInitialObj();
                  if (result.value !== '') {
                    if (this.cbpService.documentInfo['isDataProtected'] && this.executionService.isDataProtected) {
                      this.protectData();
                    } else if (this.cbpService.documentInfo['isDataProtected'] && !this.executionService.isDataProtected) {
                      const { value: userConfirms, dismiss } = await this.cbpService.showCustomSwal('Do you want to protect data?', 'info', 'cancel', 'Ok');
                      if (!dismiss && userConfirms) {
                        this.protectData();
                      }
                    }
                  }
                  this.closeEvent.emit({ event: this.getSignatureValue(result.value), stepObj: this.stepObject, value: this.getSignatureValue(result.value) });
                  this.cbpService.loading = false;
                  this.executionService.authenticatorConfig['state'] = false;
                  modalRef2.close();

                  this.cdr.detectChanges();
                } else if (type == 3) {
                  this.stepObject['type'] = result.type;
                  this.stepObject['initialStore'] = this.getSignatureValue(result.value);
                  this.saveInitial(this.stepObject);
                  this.setInitialObj();
                  this.cbpService.protectAllFields.emit();
                  this.cbpService.loading = false;
                  modalRef2.close();
                  this.cdr.detectChanges();
                }
                //this.notifier.notify('error', 'No YubiKey device found.');
              } else if (res.Code == 3000) {
                this.notifier.notify('error', 'Invalid pin.');
                this.cbpService.loading = false;
                this.executionService.authenticatorConfig['state'] = false;
                this.modelRef.close();
                this.cdr.detectChanges();

              } else if (res.Code == 4000) {
                this.notifier.notify('error', 'No yubikey found.');
                this.cbpService.loading = false;
                this.executionService.authenticatorConfig['state'] = false;
                this.modelRef.close();
                this.cdr.detectChanges();

              } else if (res.Code == 5000) {
                this.notifier.notify('error', 'Server error');
                this.cbpService.loading = false;
                this.executionService.authenticatorConfig['state'] = false;
                this.modelRef.close();
                this.cdr.detectChanges();
              } else if (res.Code == 6000) {
                this.notifier.notify('error', timeoutMessage);
                this.cbpService.loading = false;
                this.executionService.authenticatorConfig['state'] = false;
                this.modelRef.close();
                this.cdr.detectChanges();
              } else if (res.Code == 7000) {
                //this.notifier.notify('error', timeoutMessage);
                this.cbpService.loading = false;
                this.executionService.authenticatorConfig['state'] = false;
                this.modelRef.close();
                this.cdr.detectChanges();
              }
              this.cbpService.loading = false;
            }
            if (data.status == 3000) {
              this.notifier.notify('error', 'Server error');
              this.cbpService.loading = false;
              this.executionService.authenticatorConfig['state'] = false;
              this.modelRef.close();
              this.cdr.detectChanges();
            }
            this.cbpService.loading = false;
          },
          error => {
            setTimeout(() => {
              this.getResponse(result, type, modalRef2, uniqueId, ++count);
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
      //this.notifier.notify('error', timeoutMessage);
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

  protectData() {
    if (this.cbpService.selectedElement && !this.stepObject.isCover) {
      this.protectOrUnProtectData(this.cbpService.selectedElement.children, true);
      this.setDataEntryJson.emit(false);
      this.sharedviewService.detectAll = true;
    } else {
      if (this.stepObject.isCover) {
        const protectJsonObject = new ProtectObject().init();
        protectJsonObject.by = this.executionService.selectedUserId;
        protectJsonObject.Action = ActionId.Update;
        protectJsonObject.device = this.sharedviewService.getDeviceInfo();
        this.cbpService.documentInfo.coverPageData = this.cbpService.setDefaultCBPTableChanges(this.cbpService.documentInfo.coverPageData, { type: 'protect', protect: true, dataObject: [] }, null, protectJsonObject) //this.cbpService.protectJson);

        this.cbpService.pushProtectObject(protectJsonObject);
        this.sharedviewService.detectAll = true;
      }
    }
  }

  async protectOrUnProtectData(obj: any, protect: boolean) {
    obj['protect'] = protect;
    if (obj.length > 0) {
      let protectJsonObject = new ProtectObject().init();
      protectJsonObject.by = this.executionService.selectedUserId;
      protectJsonObject.Action = ActionId.Update;
      protectJsonObject.device = this.sharedviewService.getDeviceInfo();
      for (let i = 0; i < obj.length; i++) {
        if (this.executionService.stepActionCondition(obj[i])) {
          obj[i]['protect'] = protect;
        }

        if (this.executionService.checkDataEntryDgTypes(obj[i])) {
          if (obj[i].storeValue !== '' && obj[i]?.storeValue && protect &&
            (obj[i].dgType != DgTypes.SignatureDataEntry && obj[i].dgType != DgTypes.InitialDataEntry)) {
            obj[i]['protect'] = protect;
            obj[i]['protectOldValue'] = obj[i]['storeValue'];
            obj[i]['oldValue'] = obj[i]['storeValue'];
          }

          if (!protect) { obj[i]['protect'] = false; }

          if (obj[i]['storeValue'] != null && obj[i]['storeValue'] != undefined && obj[i]['storeValue'] != ''
            && (obj[i].dgType != DgTypes.SignatureDataEntry && obj[i].dgType != DgTypes.InitialDataEntry)) {
            let dataInfo = this.sharedviewService.storeDataObj(obj[i], obj[i]['storeValue']);
            //this.cbpService.dataJson.dataObjects.push(dataInfo);
            if (protect) {
              protectJsonObject.dgUniqueIDProtectList.push(obj[i].dgUniqueID.toString());
            } else {
              protectJsonObject.dgUniqueIDUnProtectList.push(obj[i].dgUniqueID.toString());
            }
            await this.tableService.delay(10);
          }

        }
        if (obj[i].dgType == DgTypes.SignatureDataEntry) {
          obj[i]['protect'] = protect;
          obj[i]['protectOldValue'] = obj[i]['signature'];
          obj[i]['oldValue'] = obj[i]['signature'];
          obj[i] = this.cbpService.signatureFieldsPro(obj[i]);
          this.cdr.detectChanges();
        }
        if (obj[i].dgType == DgTypes.InitialDataEntry) {
          obj[i]['protect'] = protect;
          obj[i]['protectOldValue'] = obj[i]['initialStore'];
          obj[i]['oldValue'] = obj[i]['initialStore'];
          obj[i] = this.cbpService.signatureFieldsPro(obj[i]);
          this.cdr.detectChanges();
        }
        if (!protect) { obj[i]['protect'] = false; }
        if (obj[i].dgType == DgTypes.SignatureDataEntry && obj[i]['signature']) {
          let dataInfo = this.sharedviewService.storeDataObj(obj[i], obj[i]['signature']);
          dataInfo['signature'] = obj[i]['signature'];
          dataInfo['signatureValue'] = obj[i]['signature'];
          dataInfo['initial'] = obj[i]['initial'];
          //this.cbpService.dataJson.dataObjects.push(dataInfo);
          if (protect) {
            protectJsonObject.dgUniqueIDProtectList.push(obj[i].dgUniqueID.toString());
          } else {
            protectJsonObject.dgUniqueIDUnProtectList.push(obj[i].dgUniqueID.toString());
          }
          await this.tableService.delay(10);

        }
        if (obj[i].dgType == DgTypes.InitialDataEntry && obj[i]['initialStore']) {
          let dataInfo = this.sharedviewService.storeDataObj(obj[i], obj[i]['initialStore']);
          dataInfo['initialStore'] = obj[i]['initialStore'];
          // this.cbpService.dataJson.dataObjects.push(dataInfo);
          if (protect) {
            protectJsonObject.dgUniqueIDProtectList.push(obj[i].dgUniqueID.toString());
          } else {
            protectJsonObject.dgUniqueIDUnProtectList.push(obj[i].dgUniqueID.toString());
          }
          await this.tableService.delay(10);
        }
        if (obj[i].dgType === DgTypes.Form) {
          // changed setDefaultTableChanges from table to cbpservice
          obj[i] = this.cbpService.setDefaultCBPTableChanges(obj[i], { type: 'protect', protect: protect, dataObject: [] }, null, protectJsonObject);
        }
        if (obj[i].children && Array.isArray(obj[i].children) && obj[i].children.length > 0 && typeof obj[i].children === "object") {
          this.protectOrUnProtectData(obj[i].children, protect);
        }
      }
      this.cbpService.pushProtectObject(protectJsonObject);
    }
  }
  async setInitialFromSDK(data: any, result: any, type: number) {
    if (data.status == 2000) {
      let timeoutMessage = 'Connection timed out';
      if (this.executionService.authenticatorConfig?.timeoutMessage) {
        timeoutMessage = this.executionService.authenticatorConfig?.timeoutMessage;
      }
      let res;
      if (this.isMobile) {
        res = JSON.parse(data.resultJson);
      } else {
        res = JSON.parse(data.responseMessage);
      }

      if (res.Code == 2000) {
        this.stepObject['initialName'] = res?.CertificateInfo?.DGUserName;
        this.stepObject['initialUserId'] = res?.CertificateInfo?.DGUserId;
        if (type == 1) {
          this.executionService.defualtInitial = this.getSignatureValue(result.value);
          this.setDefaultInitialUserInfo(result);
          this.setInitialObj();
          this.notifier.notify('success', 'Default Initial applied');
          if (result.value !== '') {
            if (this.cbpService.documentInfo['isDataProtected'] && this.executionService.isDataProtected) {
              this.protectData();
            } else if (this.cbpService.documentInfo['isDataProtected'] && !this.executionService.isDataProtected) {
              const { value: userConfirms, dismiss } = await this.cbpService.showCustomSwal('Do you want to protect data?', 'info', 'cancel', 'Ok');
              if (!dismiss && userConfirms) {
                this.protectData();
              }
            }
          }
          this.closeEvent.emit({ event: this.getSignatureValue(result.value), stepObj: this.stepObject, value: this.getSignatureValue(result.value) });

          this.modelRef.close();
          this.cbpService.loading = false;

          this.cdr.detectChanges();
          this.executionService.authenticatorConfig['state'] = false;
        } else if (type == 2) {
          this.stepObject['type'] = result.type;
          this.stepObject['initialStore'] = this.getSignatureValue(result.value);
          this.saveInitial(this.stepObject);
          this.setInitialObj();
          if (result.value !== '') {
            if (this.cbpService.documentInfo['isDataProtected'] && this.executionService.isDataProtected) {
              this.protectData();
            } else if (this.cbpService.documentInfo['isDataProtected'] && !this.executionService.isDataProtected) {
              const { value: userConfirms, dismiss } = await this.cbpService.showCustomSwal('Do you want to protect data?', 'info', 'cancel', 'Ok');
              if (!dismiss && userConfirms) {
                this.protectData();
              }
            }
          }
          this.closeEvent.emit({ event: this.getSignatureValue(result.value), stepObj: this.stepObject, value: this.getSignatureValue(result.value) });
          this.cbpService.loading = false;
          this.modelRef.close();

          this.cdr.detectChanges();
          this.executionService.authenticatorConfig['state'] = false;
        } else if (type == 3) {
          this.stepObject['type'] = result.type;
          this.stepObject['initialStore'] = this.getSignatureValue(result.value);
          this.saveInitial(this.stepObject);
          this.setInitialObj();
          this.cbpService.protectAllFields.emit();
          this.cbpService.loading = false;
          this.modelRef.close();
          this.cdr.detectChanges();
          this.executionService.authenticatorConfig['state'] = false;
        }
        //this.notifier.notify('error', 'No YubiKey device found.');
      } else if (res.Code == 3000) {
        this.notifier.notify('error', 'Invalid pin.');

      } else if (res.Code == 4000) {
        this.notifier.notify('error', 'No yubikey found.');

      } else if (res.Code == 5000) {
        this.notifier.notify('error', 'Server error');
      } else if (res.Code == 6000) {
        this.notifier.notify('error', timeoutMessage);
        this.cbpService.loading = false;
        this.executionService.authenticatorConfig['state'] = false;
        this.modelRef.close();
        this.cdr.detectChanges();
      } else if (res.Code == 7000) {
        //this.notifier.notify('error', timeoutMessage);
        this.cbpService.loading = false;
        this.executionService.authenticatorConfig['state'] = false;
        this.modelRef.close();
        this.cdr.detectChanges();
      }
    }
    if (data.status == 3000) {
      this.notifier.notify('error', 'Server error');
    }
  }

  getSignatureValue(value: any): any {
    if (value.toString().includes('data:image')) {
      const index = this.executionService.signatureJson.findIndex((i: any) => i.value == value);
      if (index == -1) {
        let dataInfo: any = { TxnId: new Date().getTime() };
        dataInfo['value'] = value;
        this.executionService.signatureJson.push(dataInfo);
        // this.executionService.signatureJson.push(value);
        return dataInfo.TxnId;
      }
      if (index > -1) {
        return this.executionService.signatureJson[index].TxnId;
      }
    } else {
      return value;
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

  setAsDefault() {

  }
  setInitialValues(result: any) {
    if (this.executionService.authenticatorConfig?.initial?.show_user_info) {
      this.stepObject['initialUserId'] = result.userId;
      this.stepObject['initialName'] = result.userName;
      this.stepObject['initialNotes'] = result.commentInfo;
      this.stepObject['signatureDate'] = result?.signatureDate ? result?.signatureDate : this.executionService.formatDate(new Date(), `${this.cbpService.documentInfo?.dateFormatNew} h: i a`);
      if (this.cbpService.isHTMLText(result.userName)) { this.stepObject.innerHtmlView = true }
      if (this.stepObject.isTableDataEntry && this.cbpService.isHTMLText(result.commentInfo)) { this.stepObject.notesHtmlView = true }
    }
  }
  setDefaultInitialUserInfo(result: any) {
    const userInfo = this.executionService.defualtInitial != null ? {
      userName: result.userName ?? '',
      userId: result.userId ?? '',
      notes: result.notes ?? '',
      signDate: result.signatureDate ?? ''
    } : null;
    this.executionService.defaultInitialUserInfo = userInfo;
  }
  ngOnDestroy(): void {
    this.styleModel_subscription?.unsubscribe();
    this.color_subscription?.unsubscribe();
    this.removeSignature?.unsubscribe();
  }
  resizeEvent(event: any) {
    this.stepObject['height'] = event.height;
  }
}
