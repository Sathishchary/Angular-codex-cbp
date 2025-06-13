import { HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { DgTypes, ErrorModalComponent } from 'cbp-shared';
import { AngularEditorConfig } from 'dg-shared';
import { Subscription } from 'rxjs';
import { Event_resource, EventType, Request_Msg } from '../../ExternalAccess/medaiEventSource';
import { ActionId, DataInfo, SignatureStore, UserInfo } from '../../models';
import { ProtectObject } from '../../models/protectObject';
import { CbpExeService } from '../../services/cbpexe.service';
import { DataJsonService } from '../../services/datajson.service';
import { DatashareService } from '../../services/datashare.service';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';
import { TableService } from '../../shared/services/table.service';
import { SignatureEditorComponent } from '../signature-editor/signature-editor.component';
import { DatePopupComponent } from './../date-popup/date-popup.component';
declare const $: any;
/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */
@Component({
  selector: 'app-signature-view',
  templateUrl: './signature-view.component.html',
  styleUrls: ['./signature-view.component.css'],
})
export class SignatureViewComponent {
  @Input() stepObject: any;
  @Input() obj: any;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  @Output() saveEvent: EventEmitter<any> = new EventEmitter();
  @Output() setDataEntryJson: EventEmitter<any> = new EventEmitter();
  dgType = DgTypes;
  @Input() styleModel!: any;
  styleValue!: any;
  styleObject: any;
  modalOptions: any;
  styleModel_subscription!: Subscription;
  mindDate = new Date();
  config!: AngularEditorConfig;
  notesConfig!: AngularEditorConfig;
  userIdconfig!: AngularEditorConfig;
  color_subscription!: Subscription;
  style_subscription!: Subscription;
  libDatePlaceholder!: any;
  documentInfo!: any;
  placeHolderSub!: Subscription;
  title = '';
  link_subscription!: Subscription;
  counter = 0;
  signatureValue = '';
  initialValue = '';
  removeSignature!: Subscription;
  subscription!: Subscription;
  isMobile: boolean = false;
  modelRef!: NgbModalRef;
  messageToSdk!: any;
  authConfigUpdate!: Subscription;
  constructor(public cbpService: CbpExeService, public executionService: ExecutionService,
    public cdr: ChangeDetectorRef, public sharedviewService: SharedviewService, private modalService: NgbModal,
    private dataJsonService: DataJsonService, public tableService: TableService,
    private notifier: NotifierService, public datashareService: DatashareService) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'lg'
    }
  }
  ngOnInit() {
    this.resetConfig();
    this.stepObject = this.dataJsonService.setObjectItem(this.stepObject);
    this.stepObject['signatureName'] = this.stepObject['signatureName'] ?? '';
    this.stepObject['dateTimePrompt'] = this.stepObject['dateTimePrompt'] ?? '';
    this.stepObject['signatureUserId'] = this.stepObject['signatureUserId'] ?? '';
    this.stepObject['signatureNotes'] = this.stepObject['signatureNotes'] ?? '';
    this.setFields(false);
    this.stepObject['userIdEditorOpened'] = false;
    this.stepObject['notesEditorOpened'] = false;
    this.isMobile = this.datashareService.getMenuConfig()?.isMobile;
    this.setSignatureObject();
    if (this.signatureValue != '' && this.signatureValue != undefined) {
      this.cbpService.protectAllFields.emit();
    }
    this.styleModel_subscription = this.executionService.styleModelobjValue.subscribe((res: any) => {
      if (res && res != '{}' && !this.executionService.isEmpty(res)) {
        this.styleObject = this.sharedviewService.setStyles(res['levelNormal']);
        this.styleObject = this.sharedviewService.setBackgroundTrans(this.styleObject);
        this.cdr.detectChanges();
      }
    });
    this.color_subscription = this.executionService.colorUpdateView.subscribe((res: any) => {
      res['type'] = 'color';
      this.signFieldStyles(res);
      this.cdr.detectChanges();
    });
    this.style_subscription = this.executionService.styleViewUpdateView.subscribe((res: any) => {
      this.signFieldStyles(res);
      this.cdr.detectChanges();
    });
    const self = this;
    this.placeHolderSub = this.dataJsonService.datePlaceholderValue.subscribe((res: any) => {
      if (res && !this.executionService.isEmpty(res)) {
        self.setSignatureDate(res);
        self.cdr.detectChanges();
      }
    });
    this.removeSignature = this.dataJsonService.removeSignEventValue.subscribe((res: any) => {
      if (res && !this.executionService.isEmpty(res)) {
        let findId = res.filter((item: any) => item.dgUniqueID == this.stepObject.dgUniqueID);
        if (findId?.length > 0) {
          let dataInfo: any = this.storeDataObj();
          dataInfo['value'] = '';
          this.stepObject.signatureValue = '';
          // this.executionService.signatureJson.push(dataInfo);
          this.signatureValue = '';
          this.sigNaturedateDateEntry(this.stepObject)
          this.setSignatureObject();
        }
      }
    });
    if (this.stepObject?.signatureDate) {
      this.title = this.cbpService.removeHTMLTags(this.stepObject.signatureDate);
    }
    if (this.stepObject.signatureDate.includes('undefined')) {
      this.setSignatureDate(this.cbpService.documentInfo);
    }
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
    this.link_subscription = this.executionService.linkSubscription.subscribe((response: any) => {
      if (this.cbpService.selectedFieldID == this.stepObject.dgUniqueID) {
        ++this.counter;
        if (this.counter == 1) {
          this.setLink(response);
        }
      }
    })
    this.subscription = this.datashareService.receivedMessage.subscribe((res: Request_Msg) => {
      if (res?.eventType == EventType.yubikey) {
        if (res?.msg?.msg?.data?.stepObj?.toString() == this.stepObject.dgUniqueID.toString()) {
          console.log(res)
          this.setSignatureFromSDK(res?.msg?.msg?.res,
            this.messageToSdk?.result,
            this.messageToSdk?.type,
            this.messageToSdk?.value
          )
        }
      }
    });
    this.authConfigUpdate = this.executionService.signatureAuthConfigUpdate.subscribe((response: any) => {
      if (response && !this.executionService.isEmpty(response)) {
        if (response) {
          if (response?.signature?.userid_iseditable == 0) {
            this.stepObject['signatureUserIdDisable'] = true;
          }
          if (response?.signature?.username_iseditable == 0) {
            this.stepObject['signatureNameDisable'] = true;
          }
          this.cdr.detectChanges();
        }
      }
    });
    this.cdr.detectChanges();
  }
  setSignatureDate(res: any) {
    let self = this;
    self.documentInfo = res;
    if (res['formatPlaceHolder'] == undefined || res['formatPlaceHolder'] == null) {
      let date = this.sharedviewService.getPlaceHolder(res.dateFormatNew);
      res['formatPlaceHolder'] = date;
    }
    self.libDatePlaceholder = this.stepObject?.datePromptDispaly && !this.stepObject.timePromptDisplay ?
      res['formatPlaceHolder'] : !this.stepObject?.datePromptDispaly && this.stepObject.timePromptDisplay ? 'HH:MM' :
        res['formatPlaceHolder'] + ' HH:MM';
    if (this.stepObject.signatureDate === '' || this.stepObject.signatureDate === undefined || this.stepObject?.singatureDate?.includes('undefined'))
      this.stepObject.signatureDate = self.libDatePlaceholder;
  }

  ngAfterViewInit(): void {
    this.setFields(false);
  }
  signFieldStyles(res: any) {
    if (res && res != '{}' && !this.executionService.isEmpty(res) && this.stepObject.signatureName == '') {
      this.setStyles(res);
    }
    if (res && res != '{}' && !this.executionService.isEmpty(res) && this.stepObject.signatureUserId == '') {
      this.setStyles(res);
    }
    if (res && res != '{}' && !this.executionService.isEmpty(res) && this.stepObject.signatureNotes == '') {
      this.setStyles(res);
    }
  }

  setStyles(res: any) {
    this.setInnerHtml(true);
    this.styleDefaultSet();
    if (res?.type == 'fontfamily') {
      this.setConfigStyles(res, res?.type, 'defaultFontName');
    }
    if (res?.type == 'fontsize') {
      this.setConfigStyles(res, res?.type, 'defaultFontSize');
    }
    if (res?.type == 'color') {
      res['fontcolor'] = res.color;
      this.setConfigStyles(res, 'fontcolor', 'foreColor');
    }

    this.configUpdates();
  }
  resizeEvent(event: any) {
    this.stepObject['height'] = event.height;
  }
  setInnerHtml(bol: boolean) {
    this.stepObject['innerHtmlView'] = bol;
    this.stepObject['userIdHtmlView'] = bol;
    this.stepObject['notesHtmlView'] = bol;
  }

  setFields(bol: boolean) {
    this.setInnerHtml(false);
    if (this.stepObject?.signatureName !== '' && this.cbpService.isHTMLText(this.stepObject.signatureName)) {
      this.stepObject['innerHtmlView'] = true;
    }
    if (this.stepObject?.signatureUserId !== '' && this.cbpService.isHTMLText(this.stepObject.signatureUserId)) {
      this.stepObject['userIdHtmlView'] = true;
    }
    if (this.stepObject?.signatureNotes !== '' && this.cbpService.isHTMLText(this.stepObject.signatureNotes)) {
      this.stepObject['notesHtmlView'] = true;
    }
  }
  setConfigStyles(res: any, type: string, configType: any) {
    let item: any = { foreColor: '#000000', defaultFontSize: '2', defaultFontName: 'Poppins' }
    if (this.stepObject.signatureName == '') {
      this.stepObject['styleSet'][type] = res?.[type];
      this.config[configType as keyof AngularEditorConfig] = res?.[type] ? res[type] : item[configType];
    }
    if (this.stepObject.signatureNotes == '') {
      this.stepObject['notesStyleSet'][type] = res?.[type];
      this.notesConfig[configType as keyof AngularEditorConfig] = res?.[type] ? res[type] : item[configType];
    }
    if (this.stepObject.signatureUserId == '') {
      this.stepObject['userIdStyleSet'][type] = res?.[type];
      this.userIdconfig[configType as keyof AngularEditorConfig] = res?.[type] ? res[type] : item[configType];
    }
  }
  styleDefaultSet() {
    if (!this.stepObject['styleSet']) { this.stepObject['styleSet'] = {}; }
    if (!this.stepObject['notesStyleSet']) { this.stepObject['notesStyleSet'] = {}; }
    if (!this.stepObject['userIdStyleSet']) { this.stepObject['userIdStyleSet'] = {}; }
  }
  configUpdates() {
    this.notesConfig = JSON.parse(JSON.stringify(this.notesConfig));
    this.userIdconfig = JSON.parse(JSON.stringify(this.userIdconfig));
    this.config = JSON.parse(JSON.stringify(this.config));
  }
  setSignatureObject() {
    this.signatureValue = this.executionService.signatureJson.find((i: any) =>
      i.TxnId == this.stepObject.signatureValue)?.value;
    this.initialValue = this.executionService.signatureJson.find((i: any) =>
      i.TxnId == this.stepObject.initial)?.value;
    if (this.stepObject.authenticator) {
      if (this.stepObject.signatureName) {
        this.stepObject['signatureNameDisable'] = true;
      }
      if (this.stepObject.signatureUserId) {
        this.stepObject['signatureUserIdDisable'] = true;
      }
    }
    if (this.executionService.authenticatorConfig?.signature?.userid_iseditable == 0) {
      this.stepObject['signatureUserIdDisable'] = true;
    }
    if (this.executionService.authenticatorConfig?.signature?.username_iseditable == 0) {
      this.stepObject['signatureNameDisable'] = true;
    }
  }
  setLink(response: any) {
    let linkText = '';
    let selectedText = this.cbpService.getSelectionText().trim();
    if (response && response.msg && response.msg[0]) {
      linkText = ' <a href="javascript:void(0);" id="a-' + this.stepObject.dgUniqueID + '" class="hyperlink popup" dgc_reference_object_key="' + response.msg[0].DGC_REFERENCE_OBJECT_KEY + '" '
        + ' reference_object_code= "' + response.msg[0].DGC_REFERENCE_OBJECT_CODE + '" placement="top"  [ngbTooltip]="refContent">' + selectedText + '</a> ';
      this.stepObject.signatureName = this.stepObject.signatureName.replace(selectedText, linkText)
      this.stepObject.innerHtmlView = true;
      this.cdr.detectChanges();
    }
    if (response && response.msg && (!response.msg || response.msg.length == 0)) {
      const modalRef = this.modalService.open(ErrorModalComponent, JSON.parse(JSON.stringify(this.modalOptions)));
      modalRef.componentInstance.errorDgType = DgTypes.ErrorMsg;
      modalRef.componentInstance.displayMsg = 'Equipment link is invalid';
      modalRef.componentInstance.closeEvent.subscribe((result: any) => {
        modalRef.close();
        this.counter = 0;
      });
    }
  }
  resetConfig() {
    this.config = this.dataJsonService.config;
    this.notesConfig = this.dataJsonService.config;
    this.userIdconfig = this.dataJsonService.config;
    this.config.toolbarPosition = 'bottom';
    this.config.maxHeight = '23px';
    this.config.minHeight = '34px';
    this.config.overFlow = 'hidden';
    this.config.onlyNumber = false;
    this.config.maxLengthEnabled = false;
    this.config = JSON.parse(JSON.stringify(this.config));
    this.notesConfig.toolbarPosition = 'bottom';
    this.notesConfig.maxHeight = 'none';
    this.notesConfig.minHeight = this.stepObject?.height ? (this.stepObject?.height) + 'px' : '70px';
    this.stepObject.height = '70px';
    this.notesConfig.onlyNumber = false;
    this.notesConfig = JSON.parse(JSON.stringify(this.notesConfig));
    this.userIdconfig.toolbarPosition = 'bottom';
    this.userIdconfig.maxHeight = '23px';
    this.userIdconfig.minHeight = '34px';
    this.userIdconfig.overFlow = 'hidden';
    this.userIdconfig.onlyNumber = false;
    this.userIdconfig.maxLengthEnabled = false;
    this.userIdconfig = JSON.parse(JSON.stringify(this.userIdconfig));
  }

  saveSignature(eventObj: any, event: any, type: string) {
    if (eventObj?.disableField) {
      return;
    }
    if (type === 'signatureName') {
      if ((eventObj?.protect && eventObj?.signatureName && eventObj?.signatureNameProtect) ||
        eventObj?.signatureNameDisable ||
        (this.executionService?.authenticatorConfig?.signature?.username_iseditable == 0)) {
        return;
      }
    } else if (type === 'signatureUserId') {
      if ((eventObj?.protect && eventObj?.signatureUserId && eventObj?.signatureUserIdProtect) ||
        eventObj?.signatureUserIdDisable ||
        (this.executionService?.authenticatorConfig?.signature?.userid_iseditable == 0)) {
        return;
      }
    } else if (type === 'signatureNotes') {
      if (eventObj?.protect && eventObj?.signatureNotes && eventObj?.signatureNotesProtect) {
        return;
      }
    }

    this.cbpService.signatureFieldItem = type;
    this.sigNaturedateDateEntry(this.stepObject);
  }
  selectElement(type: string) {
    this.cbpService.signatureFieldItem = type;
    this.executionService.selectedNewEntry = this.stepObject;
    this.executionService.selectedField({ stepItem: this.obj, stepObject: this.stepObject, showMenuText: true });
  }
  sigNaturedateDateEntry(stepObject: any) {
    const hasSignatureData = [
      stepObject.signatureValue,
      stepObject.initial,
      stepObject.signatureName,
      stepObject.signatureNotes,
      stepObject.signatureUserId
    ].some(val => val); // checks if at least one is truthy
    if (hasSignatureData) {
      stepObject.signatureDate = !this.executionService.hasDateOrTime(stepObject.signatureDate) ? this.getCurrentDate() : stepObject.signatureDate;
    } else {
      return;
    }
    const obj = new SignatureStore(stepObject.signatureValue, stepObject.signatureName, stepObject.signatureName, stepObject.signatureValue,
      stepObject.signatureDate, stepObject.initial, stepObject.dgUniqueID,
      this.executionService.selectedUserName, new Date(), stepObject.signatureUserId, stepObject.signatureNotes);
    this.storeDataJsonObject(obj, 6200);
  }
  storeDataJsonObject(obj: any, action: any) {
    let dataInfo: DataInfo = new DataInfo();
    dataInfo.statusBy = this.executionService.selectedUserName;
    dataInfo.createdDate = new Date();
    dataInfo.createdBy = this.executionService.selectedUserName;
    dataInfo.statusDate = new Date();
    dataInfo.action = action
    let dataInfoObj = { ...dataInfo, ...this.sharedviewService.setUserInfoObj(dataInfo.action), ...obj };
    dataInfoObj['styleSet'] = this.stepObject['styleSet'];
    dataInfoObj['notesStyleSet'] = this.stepObject['notesStyleSet'];
    dataInfoObj['userIdstyleSet'] = this.stepObject['userIdstyleSet'];
    if (this.executionService?.authenticatorConfig?.['state']) {
      dataInfoObj['authenticator'] = true;
      dataInfoObj['signatureName'] = this.stepObject['signatureName']
      dataInfoObj['signatureUserId'] = this.stepObject['signatureUserId']
    }
    if (this.stepObject['isParentRepeatStep']) {
      dataInfoObj['isParentRepeatStep'] = this.stepObject['isParentRepeatStep'];
    }
    this.cbpService.dataJson.dataObjects.push(dataInfoObj);
    this.datashareService.changeCount++;
    this.setDataEntryJson.emit(false);
  }

  getSignatureData(obj: any, typeValu: any) {
    if (typeValu == 'initial') {
      if (!this.stepObject['initial']) {
        if (this.executionService.defualtInitial) {
          this.stepObject['initial'] = this.executionService.defualtInitial;
          this.updateDefaultUserInfo(this.executionService.defaultInitialUserInfo);
          this.sigNaturedateDateEntry(this.stepObject);
          this.setSignObjects({ value: this.executionService.defualtInitial });
        } else {
          this.openSignaturePopup(typeValu);
        }
      } else {
        this.openSignaturePopup(typeValu);
      }
    } else {
      if (!this.stepObject['signatureValue']) {
        if (this.executionService.defualtSign) {
          this.stepObject['signatureValue'] = this.executionService.defualtSign;
          this.updateDefaultUserInfo(this.executionService.defaultSignUserInfo);
          this.sigNaturedateDateEntry(this.stepObject);
          this.setSignObjects({ value: this.executionService.defualtSign });
        } else {
          this.openSignaturePopup(typeValu);
        }
      } else {
        this.openSignaturePopup(typeValu);
      }
    }
    this.cdr.detectChanges();
  }

  async openSignaturePopup(value: any) {
    if (!this.cbpService.selectCellEnabled) {
      this.modalOptions['size'] = 'lg';
      this.messageToSdk = null;
      const modalRef = this.modalService.open(SignatureEditorComponent, this.modalOptions);
      this.modelRef = modalRef;
      modalRef.componentInstance.selectedStepSectionInfo = this.obj;
      modalRef.componentInstance.selectedSignture = this.stepObject;
      const authConfig = value === 'initial' ? this.executionService.authenticatorConfig?.initial : this.executionService.authenticatorConfig?.signature;
      modalRef.componentInstance.isSignatureEnabled = value === 'initial' ? this.executionService.authenticatorConfig?.initial?.show_user_info :
        this.executionService.authenticatorConfig?.signature?.show_user_info;
      modalRef.componentInstance.userIdEditable = authConfig?.userid_iseditable;
      modalRef.componentInstance.userNameEditable = authConfig?.username_iseditable;
      modalRef.componentInstance.isUserIdRequired = authConfig?.userid_is_required;
      modalRef.componentInstance.isUserNameRequired = authConfig?.username_is_required;
      modalRef.componentInstance.documentInfo = this.cbpService.documentInfo;
      modalRef.componentInstance.dataJsonService = this.dataJsonService;
      modalRef.componentInstance.isYubikeyEnabled = authConfig?.authenticator == 'yubikey' ? true : false;
      modalRef.componentInstance.updateFooterList();
      if (value === 'initial')
        modalRef.componentInstance.title = 'Initial Pad';
      modalRef.componentInstance.defaultSignEvent.subscribe(async (result: any) => {
        if (result != false) {
          if (result.type == 'save') {
            this.setSignatureValues(result);
            if (this.executionService.authenticatorConfig?.signature?.authenticator == 'yubikey' ||
              this.executionService.authenticatorConfig?.initial?.authenticator == 'yubikey'
            ) {
              if (value == 'initial') {
                if (this.executionService.authenticatorConfig?.initial?.authenticator == 'yubikey'
                ) {
                  this.openYubikeyPopup(result, 1, value, modalRef);
                } else {
                  this.setDefaultSign(value, 'Default Sign/Initial applied', this.getSignatureValue(result.value), result);
                  if (value == 'initial') {
                    this.stepObject['initial'] = this.getSignatureValue(result.value);
                  } else {
                    this.stepObject['signatureValue'] = this.getSignatureValue(result.value);
                  }
                  this.updateUserNameAndIdAndNotes(result);
                  this.sigNaturedateDateEntry(this.stepObject);
                  this.setSignObjects(this.getSignatureValue(result.value));
                  this.executionService.closeSignature = false;
                  modalRef.close();
                }
                this.stepObject['initial'] = this.getSignatureValue(result.value);
              } else {
                if (this.executionService.authenticatorConfig?.signature?.authenticator == 'yubikey'
                ) {
                  this.openYubikeyPopup(result, 1, value, modalRef);
                } else {
                  this.setDefaultSign(value, 'Default Sign/Initial applied', this.getSignatureValue(result.value), result);
                  if (value == 'initial') {
                    this.stepObject['initial'] = this.getSignatureValue(result.value);
                  } else {
                    this.stepObject['signatureValue'] = this.getSignatureValue(result.value);
                  }
                  this.updateUserNameAndIdAndNotes(result);
                  this.sigNaturedateDateEntry(this.stepObject);
                  this.setSignObjects(this.getSignatureValue(result.value));
                  this.executionService.closeSignature = false;
                  modalRef.close();
                }
              }
            } else {
              this.setDefaultSign(value, 'Default Sign/Initial applied', this.getSignatureValue(result.value), result);
              if (value == 'initial') {
                this.stepObject['initial'] = this.getSignatureValue(result.value);
              } else {
                this.stepObject['signatureValue'] = this.getSignatureValue(result.value);
              }
              this.updateUserNameAndIdAndNotes(result);
              this.sigNaturedateDateEntry(this.stepObject);
              this.setSignObjects(this.getSignatureValue(result.value));
              this.executionService.closeSignature = false;
              modalRef.close();
            }
          }
          if (result.type == 'remove') {
            this.setDefaultSign(value, 'Default Sign/Initial removed', null, result);
            this.executionService.closeSignature = false;
            modalRef.close();
          }
        } else {
          this.executionService.closeSignature = false;
          modalRef.close();
        }
      })
      modalRef.componentInstance.closeEvent.subscribe(async (result: any) => {
        if (result != false) {
          this.setSignatureValues(result);
          if (this.executionService.authenticatorConfig?.signature?.authenticator == 'yubikey' ||
            this.executionService.authenticatorConfig?.initial?.authenticator == 'yubikey'
          ) {
            if (value == 'initial') {
              if (this.executionService.authenticatorConfig?.initial?.authenticator == 'yubikey'
              ) {
                this.openYubikeyPopup(result, 2, value, modalRef);
              } else {
                this.stepObject['type'] = result.type;
                if (value == 'initial') {
                  this.stepObject['initial'] = this.getSignatureValue(result.value);
                  this.sigNaturedateDateEntry(this.stepObject);
                } else {
                  this.stepObject['signatureValue'] = this.getSignatureValue(result.value);
                  this.sigNaturedateDateEntry(this.stepObject);
                }
                this.setSignObjects(this.getSignatureValue(result.value));
                this.cdr.detectChanges();
                this.executionService.closeSignature = false;
                modalRef.close();
              }
            } else {
              if (this.executionService.authenticatorConfig?.signature?.authenticator == 'yubikey'
              ) {
                this.openYubikeyPopup(result, 2, value, modalRef);
              } else {
                this.stepObject['type'] = result.type;
                if (value == 'initial') {
                  this.stepObject['initial'] = this.getSignatureValue(result.value);
                  this.sigNaturedateDateEntry(this.stepObject);
                } else {
                  this.stepObject['signatureValue'] = this.getSignatureValue(result.value);
                  this.sigNaturedateDateEntry(this.stepObject);
                }
                this.setSignObjects(this.getSignatureValue(result.value));
                this.cdr.detectChanges();
                this.executionService.closeSignature = false;
                modalRef.close();
              }
            }
          } else {
            this.stepObject['type'] = result.type;
            if (value == 'initial') {
              this.stepObject['initial'] = this.getSignatureValue(result.value);
              this.sigNaturedateDateEntry(this.stepObject);
            } else {
              this.stepObject['signatureValue'] = this.getSignatureValue(result.value);
              this.sigNaturedateDateEntry(this.stepObject);
            }
            this.setSignObjects(this.getSignatureValue(result.value));
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
          this.setSignatureValues(result);
          if (this.executionService.authenticatorConfig?.signature?.authenticator == 'yubikey' ||
            this.executionService.authenticatorConfig?.initial?.authenticator == 'yubikey'
          ) {
            if (value == 'initial') {
              if (this.executionService.authenticatorConfig?.initial?.authenticator == 'yubikey'
              ) {
                this.openYubikeyPopup(result, 3, value, modalRef);
              } else {
                this.stepObject['type'] = result.type;
                if (value == 'initial') {
                  this.stepObject['initial'] = this.getSignatureValue(result.value);
                  this.sigNaturedateDateEntry(this.stepObject);
                } else {
                  this.stepObject['signatureValue'] = this.getSignatureValue(result.value);
                  this.sigNaturedateDateEntry(this.stepObject);
                }
                this.setSignatureObject()
                this.cbpService.protectAllFields.emit();
                this.cdr.detectChanges();
                this.executionService.closeSignature = false;
                modalRef.close();
              }
            } else {
              if (this.executionService.authenticatorConfig?.signature?.authenticator == 'yubikey'
              ) {
                this.openYubikeyPopup(result, 3, value, modalRef);
              } else {
                this.stepObject['type'] = result.type;
                if (value == 'initial') {
                  this.stepObject['initial'] = this.getSignatureValue(result.value);
                  this.sigNaturedateDateEntry(this.stepObject);
                } else {
                  this.stepObject['signatureValue'] = this.getSignatureValue(result.value);
                  this.sigNaturedateDateEntry(this.stepObject);
                }
                this.setSignatureObject()
                this.cbpService.protectAllFields.emit();
                this.cdr.detectChanges();
                this.executionService.closeSignature = false;
                modalRef.close();
              }
            }
          } else {
            this.stepObject['type'] = result.type;
            if (value == 'initial') {
              this.stepObject['initial'] = this.getSignatureValue(result.value);
              this.sigNaturedateDateEntry(this.stepObject);
            } else {
              this.stepObject['signatureValue'] = this.getSignatureValue(result.value);
              this.sigNaturedateDateEntry(this.stepObject);
            }
            this.setSignatureObject()
            this.cbpService.protectAllFields.emit();
            this.cdr.detectChanges();
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
  openYubikeyPopup(result: any, type: number = 1, value: any, modalRef2: NgbModalRef) {
    if (this.isMobile) {
      this.executionService.authenticatorConfig['state'] = true;
      this.messageToSdk = {
        result: result,
        type: type,
        value: value,
        stepObj: this.stepObject.dgUniqueID
      }
      let message = {
        result: null,
        type: type,
        value: value,
        stepObj: this.stepObject.dgUniqueID
      }
      let evt: Request_Msg = { eventType: EventType.yubikey, msg: message, eventFrom: Event_resource.signature };
      this.datashareService.sendMessageFromLibToOutside(evt)
    } else {
      // this.cbpService.loading = true;
      this.cdr.detectChanges();
      let uniqueId = this.generateUniqueId();
      this.executionService.authenticatorConfig['state'] = true;
      //accessToken: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',

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
                //   res.CertificateInfo = {"DGUserName":"nns","DGUserId":"123"};
                this.stepObject['signatureName'] = res?.CertificateInfo?.DGUserName;
                this.stepObject['signatureUserId'] = res?.CertificateInfo?.DGUserId;
                if (this.stepObject.signatureName) {
                  result.userName = this.stepObject.signatureName;
                }
                if (!result.userId) {
                  result.userId = this.stepObject['signatureUserId'];
                }
                this.setSignatureValues(result);
                if (type == 1) {
                  this.setDefaultSign(value, 'Default Sign/Initial applied', this.getSignatureValue(result.value), result);
                  if (value == 'initial') {
                    this.stepObject['initial'] = this.getSignatureValue(result.value);
                  } else {
                    this.stepObject['signatureValue'] = this.getSignatureValue(result.value);
                  }
                  this.sigNaturedateDateEntry(this.stepObject);
                  this.setSignObjects(this.getSignatureValue(result.value));
                  modalRef2.close();
                  this.cbpService.loading = false;
                  this.executionService.authenticatorConfig['state'] = false;
                  this.cdr.detectChanges();

                } else if (type == 2) {
                  this.stepObject['type'] = result.type;

                  if (value == 'initial') {
                    this.stepObject['initial'] = this.getSignatureValue(result.value);
                    this.sigNaturedateDateEntry(this.stepObject);
                  } else {
                    this.stepObject['signatureValue'] = this.getSignatureValue(result.value);
                    this.sigNaturedateDateEntry(this.stepObject);
                  }

                  this.setSignObjects(this.getSignatureValue(result.value));
                  this.cdr.detectChanges();
                  this.cbpService.loading = false;
                  this.executionService.authenticatorConfig['state'] = false;
                  modalRef2.close();
                } else if (type == 3) {
                  this.stepObject['type'] = result.type;
                  if (value == 'initial') {
                    this.stepObject['initial'] = this.getSignatureValue(result.value);
                    this.sigNaturedateDateEntry(this.stepObject);
                  } else {
                    this.stepObject['signatureValue'] = this.getSignatureValue(result.value);
                    this.sigNaturedateDateEntry(this.stepObject);
                  }

                  this.setSignatureObject()
                  this.cbpService.protectAllFields.emit();
                  this.cbpService.loading = false;
                  this.executionService.authenticatorConfig['state'] = false;
                  modalRef2.close();
                  this.cdr.detectChanges();
                }
                //this.notifier.notify('error', 'No YubiKey device found.');
              } else if (res.Code == 3000) {
                this.notifier.notify('error', 'Invalid pin.');
                this.cbpService.loading = false;
                this.executionService.authenticatorConfig['state'] = false;
                modalRef2.close();
                this.cdr.detectChanges();

              } else if (res.Code == 4000) {
                this.notifier.notify('error', 'No yubikey found.');
                this.cbpService.loading = false;
                this.executionService.authenticatorConfig['state'] = false;
                modalRef2.close();
                this.cdr.detectChanges();

              } else if (res.Code == 5000) {
                this.notifier.notify('error', 'Server error');
                this.cbpService.loading = false;
                this.executionService.authenticatorConfig['state'] = false;
                modalRef2.close();
                this.cdr.detectChanges();
              } else if (res.Code == 6000) {
                this.notifier.notify('error', timeoutMessage);
                this.cbpService.loading = false;
                this.executionService.authenticatorConfig['state'] = false;
                modalRef2.close();
                this.cdr.detectChanges();
              } else if (res.Code == 7000) {
                //this.notifier.notify('error', timeoutMessage);
                this.cbpService.loading = false;
                this.executionService.authenticatorConfig['state'] = false;
                modalRef2.close();
                this.cdr.detectChanges();
              }
            }
            if (data.status == 3000) {
              this.notifier.notify('error', timeoutMessage);
              this.cbpService.loading = false;
              this.executionService.authenticatorConfig['state'] = false;
              this.modelRef.close();
              this.cdr.detectChanges();
            }
            this.cbpService.loading = false;
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
      // this.notifier.notify('error', timeoutMessage);

    }
  }

  setSignatureFromSDK(data: any, result: any, type: number, value: any) {
    if (data.status == 2000) {
      let timeoutMessage = 'Connection timed out';
      if (this.executionService.authenticatorConfig?.timeoutMessage) {
        timeoutMessage = this.executionService.authenticatorConfig?.timeoutMessage;
      }
      const res = JSON.parse(data.resultJson);
      if (res.Code == 2000) {
        this.stepObject['signatureUserId'] = res?.CertificateInfo?.DGUserId;
        result.userName = res?.CertificateInfo?.DGUserName ? res?.CertificateInfo?.DGUserName : result.userName;
        this.stepObject['signatureName'] = result.userName;
        if (this.stepObject?.signatureName) {
          result.userName = this.stepObject.signatureName;
        }
        if (!result?.userId) {
          result['userId'] = this.stepObject['signatureUserId'];
        }
        this.setSignatureValues(result);
        if (type == 1) {
          this.setDefaultSign(value, 'Default Sign/Initial applied', this.getSignatureValue(result.value), result);
          if (value == 'initial') {
            this.stepObject['initial'] = this.getSignatureValue(result.value);
          } else {
            this.stepObject['signatureValue'] = this.getSignatureValue(result.value);
          }
          this.sigNaturedateDateEntry(this.stepObject);
          this.setSignObjects(this.getSignatureValue(result.value));
          this.modelRef.close();
          this.cbpService.loading = false;
          this.cdr.detectChanges();

        } else if (type == 2) {
          this.stepObject['type'] = result.type;
          if (value == 'initial') {
            this.stepObject['initial'] = this.getSignatureValue(result.value);
            this.sigNaturedateDateEntry(this.stepObject);
          } else {
            this.stepObject['signatureValue'] = this.getSignatureValue(result.value);
            this.sigNaturedateDateEntry(this.stepObject);
          }
          this.setSignObjects(this.getSignatureValue(result.value));
          this.cdr.detectChanges();
          this.cbpService.loading = false;
          this.modelRef.close();
        } else if (type == 3) {
          this.stepObject['type'] = result.type;
          if (value == 'initial') {
            this.stepObject['initial'] = this.getSignatureValue(result.value);
            this.sigNaturedateDateEntry(this.stepObject);
          } else {
            this.stepObject['signatureValue'] = this.getSignatureValue(result.value);
            this.sigNaturedateDateEntry(this.stepObject);
          }
          this.setSignatureObject()
          this.cbpService.protectAllFields.emit();
          this.cbpService.loading = false;
          this.modelRef.close();
          this.cdr.detectChanges();
        }
        //this.notifier.notify('error', 'No YubiKey device found.');
      } else if (res.Code == 3000) {
        this.notifier.notify('error', 'Invalid pin.');
        this.cbpService.loading = false;
        this.modelRef.close();
        this.cdr.detectChanges();

      } else if (res.Code == 4000) {
        this.notifier.notify('error', 'No yubikey found.');
        this.cbpService.loading = false;
        this.modelRef.close();
        this.cdr.detectChanges();

      } else if (res.Code == 5000) {
        this.notifier.notify('error', 'Server error');
        this.cbpService.loading = false;
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
    }
    if (data.status == 3000) {
      this.notifier.notify('error', 'Server error');
      this.cbpService.loading = false;
      this.modelRef.close();
      this.cdr.detectChanges();
    }
  }
  openMauiApp(data: string): void {
    console.log(data);
    const url = `yubikeypivverification://${this.executionService.apiUrl}/path?id=${encodeURIComponent(data)}`;
    console.log(url.length)
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
  async setSignObjects(result: any) {
    this.setSignatureObject();
    if (result.value !== "") {
      if (this.cbpService.documentInfo['isDataProtected'] && this.executionService.isDataProtected) {
        this.protectData(true);
      } else if (this.cbpService.documentInfo['isDataProtected'] && !this.executionService.isDataProtected) {
        const { value: userConfirms, dismiss } = await this.cbpService.showCustomSwal('Do you want to protect data?', 'info', 'cancel', 'Ok');
        if (!dismiss && userConfirms) { this.protectData(true); }
        else if (dismiss) {
          this.protectData(false);
        }
      }
    }
    this.closeEvent.emit({ event: this.obj, stepObj: this.stepObject, value: result });
    this.cdr.detectChanges();
  }
  protectData(protect: any) {
    if (this.cbpService.selectedElement && !this.stepObject?.isCover) {
      if (this.cbpService.selectedElement.dgType == "SignatureStep") {
        this.protectOrUnProtectData(this.cbpService.selectedElement, protect);
      }
      else {
        this.protectOrUnProtectData(this.cbpService.selectedElement.children, protect);
      }
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

    if (obj.dgType == 'SignatureStep') {
      let newobj = [obj]
      obj = newobj
    }

    if (obj.length > 0) {
      const protectJsonObject = new ProtectObject().init();
      protectJsonObject.by = this.executionService.selectedUserId;
      protectJsonObject.Action = ActionId.Update;
      protectJsonObject.device = this.sharedviewService.getDeviceInfo();
      for (let i = 0; i < obj.length; i++) {
        // Check if this is the signature being modified
        const isTargetSignature = obj[i].dgUniqueID === this.stepObject.dgUniqueID;

        // Only modify protection state if this is the target signature or we're protecting
        if (isTargetSignature || protect) {
          if (this.executionService.stepActionCondition(obj[i])) {
            obj[i]['protect'] = protect;
          }

          if (this.executionService.checkDataEntryDgTypes(obj[i])) {
            if (obj[i].storeValue !== '' && obj[i]?.storeValue &&
              (obj[i].dgType != DgTypes.SignatureDataEntry && obj[i].dgType != DgTypes.InitialDataEntry)) {
              obj[i]['protect'] = protect;
              obj[i]['protectOldValue'] = obj[i]['storeValue'];
              obj[i]['oldValue'] = obj[i]['storeValue'];
            }

            // if (!protect) { obj[i]['protect'] = false; }

            if (obj[i]['storeValue'] != null && obj[i]['storeValue'] != undefined && obj[i]['storeValue'] != ''
              && (obj[i].dgType != DgTypes.SignatureDataEntry && obj[i].dgType != DgTypes.InitialDataEntry)) {
              let dataInfo: any = this.sharedviewService.storeDataObj(obj[i], obj[i]['storeValue']);
              dataInfo['signature'] = obj[i]['signatureValue'];
              dataInfo['signatureValue'] = obj[i]['signatureValue'];
              dataInfo['initial'] = obj[i]['initial'];
              //this.cbpService.dataJson.dataObjects.push(dataInfo);
              if (protect) {
                protectJsonObject.dgUniqueIDProtectList.push(obj[i].dgUniqueID.toString());
              } else if (isTargetSignature) {
                protectJsonObject.dgUniqueIDUnProtectList.push(obj[i].dgUniqueID.toString());
              }
              await this.tableService.delay(10);
            }

          }

          if (obj[i].dgType == DgTypes.SignatureDataEntry) {
            obj[i]['protect'] = protect;
            obj[i]['protectOldValue'] = obj[i]['signatureValue'];
            obj[i]['oldValue'] = obj[i]['signatureValue'];
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

          if (obj[i].dgType == DgTypes.SignatureDataEntry && obj[i]['signature']) {
            let dataInfo: any = this.sharedviewService.storeDataObj(obj[i], obj[i]['signature']);
            dataInfo['initialStore'] = obj[i]['initialStore'];
            //this.cbpService.dataJson.dataObjects.push(dataInfo);
            if (protect) {
              protectJsonObject.dgUniqueIDProtectList.push(obj[i].dgUniqueID.toString());
            } else if (isTargetSignature) {
              protectJsonObject.dgUniqueIDUnProtectList.push(obj[i].dgUniqueID.toString());
            }
            await this.tableService.delay(10);
          }
          if (obj[i].dgType == DgTypes.InitialDataEntry && obj[i]['initialStore']) {
            let dataInfo = this.sharedviewService.storeDataObj(obj[i], obj[i]['initialStore']);
            //this.cbpService.dataJson.dataObjects.push(dataInfo);
            if (protect) {
              protectJsonObject.dgUniqueIDProtectList.push(obj[i].dgUniqueID.toString());
            } else if (isTargetSignature) {
              protectJsonObject.dgUniqueIDUnProtectList.push(obj[i].dgUniqueID.toString());
            }
            await this.tableService.delay(10);
          }
          if (obj[i].dgType === DgTypes.Form) {
            // changed setDefaultTableChanges from table to cbpservice
            obj[i] = this.cbpService.setDefaultCBPTableChanges(obj[i], { type: 'protect', protect: protect, dataObject: [] }, null, protectJsonObject);
          }
        }

        // Recursively process children if they exist
        if (obj[i].children && Array.isArray(obj[i].children) && obj[i].children.length > 0 && typeof obj[i].children === "object") {
          this.protectOrUnProtectData(obj[i].children, protect);
        }
      }

      // Only push the protect object if we have changes
      if (protectJsonObject.dgUniqueIDProtectList.length > 0 || protectJsonObject.dgUniqueIDUnProtectList.length > 0) {
        this.cbpService.pushProtectObject(protectJsonObject);
      }
    }
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

  openDate() {
    if (!this.cbpService.selectCellEnabled) {
      let options = this.modalOptions;
      options['size'] = 'md';
      const modalRef = this.modalService.open(DatePopupComponent, options);
      if (this.stepObject?.isHtmlView && this.cbpService.isHTMLText(this.stepObject.signatureDate)) {
        this.stepObject.signatureDate = this.cbpService.removeHTMLTags(this.stepObject.signatureDate);
      }
      if (this.stepObject?.hasOwnProperty('datePromptDisplay')) {
        this.stepObject.datePromptDispaly = this.stepObject?.datePromptDisplay;
      }
      modalRef.componentInstance.stepObject = this.stepObject;
      modalRef.componentInstance.signatureView = true;
      modalRef.componentInstance.dateFormat = this.documentInfo?.dateFormat;
      modalRef.componentInstance.dateTitle = 'Select Signature Date';
      modalRef.componentInstance.closeEvent.subscribe((receivedEntry: any) => {
        if (receivedEntry === "") {
          this.stepObject.signatureDate = this.libDatePlaceholder
          this.sigNaturedateDateEntry(this.stepObject);
          this.title = this.cbpService.removeHTMLTags(this.stepObject.signatureDate);
          this.cdr.detectChanges();
        } else if (receivedEntry !== false) {
          this.stepObject.signatureDate = receivedEntry;
          if (this.stepObject?.isHtmlView || this.cbpService.isHTMLText(this.stepObject.signatureDate)) {
            if (!this.stepObject?.isHtmlView) { this.stepObject.isHtmlView = true }
            this.stepObject.signatureDate = this.cbpService.removeHTMLTags(this.stepObject.signatureDate);
          }
          this.sigNaturedateDateEntry(this.stepObject);
          this.title = this.cbpService.removeHTMLTags(this.stepObject.signatureDate);
          this.cdr.detectChanges();
        }
        modalRef.close();
      });
    }
  }

  setDefaultSign(value: any, text: string, resultValue: any, result: any) {
    const isInitial = value === 'initial';
    if (isInitial) {
      this.executionService.defualtInitialEnable = true;
      this.executionService.defualtInitial = resultValue;
    } else {
      this.executionService.defualtSignEnable = true;
      this.executionService.defualtSign = resultValue;
    }
    const userInfo = resultValue != null ? {
      userName: result.userName ?? '',
      userId: result.userId ?? '',
      notes: result.notes ?? '',
      signDate: result.signatureDate ?? ''
    } : null;
    if (isInitial) {
      this.executionService.defaultInitialUserInfo = userInfo;
    } else {
      this.executionService.defaultSignUserInfo = userInfo;
    }
    this.notifier.notify('success', text);
  }


  setSignatureValues(result: any) {
    if (this.executionService.authenticatorConfig?.signature?.show_user_info ||
      this.executionService.authenticatorConfig?.initial?.show_user_info) {
      this.stepObject['signatureUserId'] = result.userId;
      this.stepObject['signatureName'] = result.userName;
      this.stepObject['signatureNotes'] = result.commentInfo;
      this.stepObject['signatureDate'] = result?.signatureDate ? result?.signatureDate : this.getCurrentDate();
      if (this.cbpService.isHTMLText(result.userId)) { this.stepObject.userIdHtmlView = true };
      if (this.cbpService.isHTMLText(result.userName)) { this.stepObject.notesHtmlView = true }
      if (this.cbpService.isHTMLText(result.commentInfo)) { this.stepObject.innerHtmlView = true }
    }
  }

  ngOnDestroy(): void {
    this.styleModel_subscription?.unsubscribe();
    this.color_subscription?.unsubscribe();
    this.style_subscription.unsubscribe();
    this.placeHolderSub?.unsubscribe();
    this.removeSignature?.unsubscribe();
    this.authConfigUpdate?.unsubscribe();
  }

  updateUserNameAndIdAndNotes(result: any) {
    if (result?.userId) { this.stepObject['signatureUserId'] = result.userId }
    if (result?.userName) { this.stepObject['signatureName'] = result.userName }
    if (result?.notes) { this.stepObject['signatureNotes'] = result.notes };
  }
  updateDefaultUserInfo(result: any) {
    const formattedDate = this.getCurrentDate()
    if (formattedDate) { this.stepObject['signatureDate'] = formattedDate }
    if (!!result) {
      this.stepObject['signatureNotes'] = result.notes;
      this.stepObject['signatureUserId'] = result.userId;
      this.stepObject['signatureName'] = result.userName;
      if (this.cbpService.isHTMLText(result?.notes)) {
        this.stepObject['signatureDate'] = this.executionService.addDateWithFontTag(this.stepObject['signatureDate'], this.cbpService.documentInfo)
      }
    }
  }
  getCurrentDate() {
    const baseFormat = this.documentInfo?.dateFormat ?? 'm/d/Y';
    const includeTime = this.stepObject?.isTimeDisplayOpen || this.stepObject?.timePromptDisplay;
    const format = includeTime ? `${baseFormat} h: i a` : baseFormat;
    return this.executionService.formatDate(new Date(), format);
  }

}
