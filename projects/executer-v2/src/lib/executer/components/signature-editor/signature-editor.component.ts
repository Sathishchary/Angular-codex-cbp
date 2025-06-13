import { AfterContentInit, ChangeDetectorRef, Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignaturePad } from 'angular2-signaturepad';
import { AngularEditorConfig } from 'dg-shared';
import { ExecutionService } from '../../services/execution.service';
declare var $: any;

@Component({
  selector: 'lib-signature-editor',
  templateUrl: './signature-editor.component.html',
  styleUrls: ['./signature-editor.component.css'],
})
export class SignatureEditorComponent implements AfterContentInit {
  @Input() title: string = 'Signature Pad';
  @Input() selectedSignture: any;
  @Input() selectedStep: any;
  @Input() isEdit: any;
  @Input() width: any = 765;
  @Input() height: any = 250;
  @Input() fromExecution = false;
  @Input() loading = false;
  @Input() hideDefault: any;
  signature: any;
  @Input() isSignatureFromFormView = true;
  @Input() type: any;
  @Input() isSignatureEnabled = false;
  @Input() userIdEditable = 1;
  @Input() userNameEditable = 1;
  @Input() signatureDate: any = 'mm/dd/yyyy';
  dateTimeId = new Date().getTime().toString();
  footerList: any = [{ type: 'Clear' }, { type: 'Save' }, { type: 'Cancel' }];
  @ViewChild(SignaturePad, { static: false }) signaturePad!: SignaturePad;
  defaultSigText = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAv0AAAD6CAYAAAAyXPiFAAAAAXNSR0IArs4c6QAADw1JREFUeF7t1kERAAAIAkHpX9oeN2sDFh/sHAECBAgQIECAAAECaYGl0wlHgAABAgQIECBAgMAZ/Z6AAAECBAgQIECAQFzA6I8XLB4BAgQIECBAgAABo98PECBAgAABAgQIEIgLGP3xgsUjQIAAAQIECBAgYPT7AQIECBAgQIAAAQJxAaM/XrB4BAgQIECAAAECBIx+P0CAAAECBAgQIEAgLmD0xwsWjwABAgQIECBAgIDR7wcIECBAgAABAgQIxAWM/njB4hEgQIAAAQIECBAw+v0AAQIECBAgQIAAgbiA0R8vWDwCBAgQIECAAAECRr8fIECAAAECBAgQIBAXMPrjBYtHgAABAgQIECBAwOj3AwQIECBAgAABAgTiAkZ/vGDxCBAgQIAAAQIECBj9foAAAQIECBAgQIBAXMDojxcsHgECBAgQIECAAAGj3w8QIECAAAECBAgQiAsY/fGCxSNAgAABAgQIECBg9PsBAgQIECBAgAABAnEBoz9esHgECBAgQIAAAQIEjH4/QIAAAQIECBAgQCAuYPTHCxaPAAECBAgQIECAgNHvBwgQIECAAAECBAjEBYz+eMHiESBAgAABAgQIEDD6/QABAgQIECBAgACBuIDRHy9YPAIECBAgQIAAAQJGvx8gQIAAAQIECBAgEBcw+uMFi0eAAAECBAgQIEDA6PcDBAgQIECAAAECBOICRn+8YPEIECBAgAABAgQIGP1+gAABAgQIECBAgEBcwOiPFyweAQIECBAgQIAAAaPfDxAgQIAAAQIECBCICxj98YLFI0CAAAECBAgQIGD0+wECBAgQIECAAAECcQGjP16weAQIECBAgAABAgSMfj9AgAABAgQIECBAIC5g9McLFo8AAQIECBAgQICA0e8HCBAgQIAAAQIECMQFjP54weIRIECAAAECBAgQMPr9AAECBAgQIECAAIG4gNEfL1g8AgQIECBAgAABAka/HyBAgAABAgQIECAQFzD64wWLR4AAAQIECBAgQMDo9wMECBAgQIAAAQIE4gJGf7xg8QgQIECAAAECBAgY/X6AAAECBAgQIECAQFzA6I8XLB4BAgQIECBAgAABo98PECBAgAABAgQIEIgLGP3xgsUjQIAAAQIECBAgYPT7AQIECBAgQIAAAQJxAaM/XrB4BAgQIECAAAECBIx+P0CAAAECBAgQIEAgLmD0xwsWjwABAgQIECBAgIDR7wcIECBAgAABAgQIxAWM/njB4hEgQIAAAQIECBAw+v0AAQIECBAgQIAAgbiA0R8vWDwCBAgQIECAAAECRr8fIECAAAECBAgQIBAXMPrjBYtHgAABAgQIECBAwOj3AwQIECBAgAABAgTiAkZ/vGDxCBAgQIAAAQIECBj9foAAAQIECBAgQIBAXMDojxcsHgECBAgQIECAAAGj3w8QIECAAAECBAgQiAsY/fGCxSNAgAABAgQIECBg9PsBAgQIECBAgAABAnEBoz9esHgECBAgQIAAAQIEjH4/QIAAAQIECBAgQCAuYPTHCxaPAAECBAgQIECAgNHvBwgQIECAAAECBAjEBYz+eMHiESBAgAABAgQIEDD6/QABAgQIECBAgACBuIDRHy9YPAIECBAgQIAAAQJGvx8gQIAAAQIECBAgEBcw+uMFi0eAAAECBAgQIEDA6PcDBAgQIECAAAECBOICRn+8YPEIECBAgAABAgQIGP1+gAABAgQIECBAgEBcwOiPFyweAQIECBAgQIAAAaPfDxAgQIAAAQIECBCICxj98YLFI0CAAAECBAgQIGD0+wECBAgQIECAAAECcQGjP16weAQIECBAgAABAgSMfj9AgAABAgQIECBAIC5g9McLFo8AAQIECBAgQICA0e8HCBAgQIAAAQIECMQFjP54weIRIECAAAECBAgQMPr9AAECBAgQIECAAIG4gNEfL1g8AgQIECBAgAABAka/HyBAgAABAgQIECAQFzD64wWLR4AAAQIECBAgQMDo9wMECBAgQIAAAQIE4gJGf7xg8QgQIECAAAECBAgY/X6AAAECBAgQIECAQFzA6I8XLB4BAgQIECBAgAABo98PECBAgAABAgQIEIgLGP3xgsUjQIAAAQIECBAgYPT7AQIECBAgQIAAAQJxAaM/XrB4BAgQIECAAAECBIx+P0CAAAECBAgQIEAgLmD0xwsWjwABAgQIECBAgIDR7wcIECBAgAABAgQIxAWM/njB4hEgQIAAAQIECBAw+v0AAQIECBAgQIAAgbiA0R8vWDwCBAgQIECAAAECRr8fIECAAAECBAgQIBAXMPrjBYtHgAABAgQIECBAwOj3AwQIECBAgAABAgTiAkZ/vGDxCBAgQIAAAQIECBj9foAAAQIECBAgQIBAXMDojxcsHgECBAgQIECAAAGj3w8QIECAAAECBAgQiAsY/fGCxSNAgAABAgQIECBg9PsBAgQIECBAgAABAnEBoz9esHgECBAgQIAAAQIEjH4/QIAAAQIECBAgQCAuYPTHCxaPAAECBAgQIECAgNHvBwgQIECAAAECBAjEBYz+eMHiESBAgAABAgQIEDD6/QABAgQIECBAgACBuIDRHy9YPAIECBAgQIAAAQJGvx8gQIAAAQIECBAgEBcw+uMFi0eAAAECBAgQIEDA6PcDBAgQIECAAAECBOICRn+8YPEIECBAgAABAgQIGP1+gAABAgQIECBAgEBcwOiPFyweAQIECBAgQIAAAaPfDxAgQIAAAQIECBCICxj98YLFI0CAAAECBAgQIGD0+wECBAgQIECAAAECcQGjP16weAQIECBAgAABAgSMfj9AgAABAgQIECBAIC5g9McLFo8AAQIECBAgQICA0e8HCBAgQIAAAQIECMQFjP54weIRIECAAAECBAgQMPr9AAECBAgQIECAAIG4gNEfL1g8AgQIECBAgAABAka/HyBAgAABAgQIECAQFzD64wWLR4AAAQIECBAgQMDo9wMECBAgQIAAAQIE4gJGf7xg8QgQIECAAAECBAgY/X6AAAECBAgQIECAQFzA6I8XLB4BAgQIECBAgAABo98PECBAgAABAgQIEIgLGP3xgsUjQIAAAQIECBAgYPT7AQIECBAgQIAAAQJxAaM/XrB4BAgQIECAAAECBIx+P0CAAAECBAgQIEAgLmD0xwsWjwABAgQIECBAgIDR7wcIECBAgAABAgQIxAWM/njB4hEgQIAAAQIECBAw+v0AAQIECBAgQIAAgbiA0R8vWDwCBAgQIECAAAECRr8fIECAAAECBAgQIBAXMPrjBYtHgAABAgQIECBAwOj3AwQIECBAgAABAgTiAkZ/vGDxCBAgQIAAAQIECBj9foAAAQIECBAgQIBAXMDojxcsHgECBAgQIECAAAGj3w8QIECAAAECBAgQiAsY/fGCxSNAgAABAgQIECBg9PsBAgQIECBAgAABAnEBoz9esHgECBAgQIAAAQIEjH4/QIAAAQIECBAgQCAuYPTHCxaPAAECBAgQIECAgNHvBwgQIECAAAECBAjEBYz+eMHiESBAgAABAgQIEDD6/QABAgQIECBAgACBuIDRHy9YPAIECBAgQIAAAQJGvx8gQIAAAQIECBAgEBcw+uMFi0eAAAECBAgQIEDA6PcDBAgQIECAAAECBOICRn+8YPEIECBAgAABAgQIGP1+gAABAgQIECBAgEBcwOiPFyweAQIECBAgQIAAAaPfDxAgQIAAAQIECBCICxj98YLFI0CAAAECBAgQIGD0+wECBAgQIECAAAECcQGjP16weAQIECBAgAABAgSMfj9AgAABAgQIECBAIC5g9McLFo8AAQIECBAgQICA0e8HCBAgQIAAAQIECMQFjP54weIRIECAAAECBAgQMPr9AAECBAgQIECAAIG4gNEfL1g8AgQIECBAgAABAka/HyBAgAABAgQIECAQFzD64wWLR4AAAQIECBAgQMDo9wMECBAgQIAAAQIE4gJGf7xg8QgQIECAAAECBAgY/X6AAAECBAgQIECAQFzA6I8XLB4BAgQIECBAgAABo98PECBAgAABAgQIEIgLGP3xgsUjQIAAAQIECBAgYPT7AQIECBAgQIAAAQJxAaM/XrB4BAgQIECAAAECBIx+P0CAAAECBAgQIEAgLmD0xwsWjwABAgQIECBAgIDR7wcIECBAgAABAgQIxAWM/njB4hEgQIAAAQIECBAw+v0AAQIECBAgQIAAgbiA0R8vWDwCBAgQIECAAAECRr8fIECAAAECBAgQIBAXMPrjBYtHgAABAgQIECBAwOj3AwQIECBAgAABAgTiAkZ/vGDxCBAgQIAAAQIECBj9foAAAQIECBAgQIBAXMDojxcsHgECBAgQIECAAAGj3w8QIECAAAECBAgQiAsY/fGCxSNAgAABAgQIECBg9PsBAgQIECBAgAABAnEBoz9esHgECBAgQIAAAQIEjH4/QIAAAQIECBAgQCAuYPTHCxaPAAECBAgQIECAgNHvBwgQIECAAAECBAjEBYz+eMHiESBAgAABAgQIEDD6/QABAgQIECBAgACBuIDRHy9YPAIECBAgQIAAAQJGvx8gQIAAAQIECBAgEBcw+uMFi0eAAAECBAgQIEDA6PcDBAgQIECAAAECBOICRn+8YPEIECBAgAABAgQIGP1+gAABAgQIECBAgEBcwOiPFyweAQIECBAgQIAAAaPfDxAgQIAAAQIECBCICxj98YLFI0CAAAECBAgQIGD0+wECBAgQIECAAAECcQGjP16weAQIECBAgAABAgSMfj9AgAABAgQIECBAIC5g9McLFo8AAQIECBAgQICA0e8HCBAgQIAAAQIECMQFjP54weIRIECAAAECBAgQMPr9AAECBAgQIECAAIG4gNEfL1g8AgQIECBAgAABAka/HyBAgAABAgQIECAQFzD64wWLR4AAAQIECBAgQMDo9wMECBAgQIAAAQIE4gJGf7xg8QgQIECAAAECBAgY/X6AAAECBAgQIECAQFzA6I8XLB4BAgQIECBAgAABo98PECBAgAABAgQIEIgLGP3xgsUjQIAAAQIECBAgYPT7AQIECBAgQIAAAQJxAaM/XrB4BAgQIECAAAECBIx+P0CAAAECBAgQIEAgLmD0xwsWjwABAgQIECBAgMADc6gA+2BrtbMAAAAASUVORK5CYII=";
  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 2,
    'canvasWidth': this.width ? this.width : 765,
    'canvasHeight': this.height ? this.height : 250,
    'penColor': 'rgb(66, 133, 244)'
  };

  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  @Output() defaultSignEvent: EventEmitter<any> = new EventEmitter();
  @Output() protectAllFields: EventEmitter<any> = new EventEmitter();
  @ViewChild('datePopupModal') datePopupModalContent!: TemplateRef<any>;

  isUploadImage = false;
  userId: any = '';
  userName: any = '';
  commentInfo: any = '';
  modalOptions: any;
  @Input() documentInfo: any;
  dateModalRef: any;
  @Input() isUserNameRequired = 1;
  @Input() isUserIdRequired = 1;
  userConfig!: AngularEditorConfig;
  notesConfig!: AngularEditorConfig;
  @Input() dataJsonService: any
  userNameEditorOpened = false;
  userIdEditorOpened = false;
  userNotesEditorOpened = false;
  userNameStep: any;
  userIdStep: any;
  commentStep: any;
  @Input() isYubikeyEnabled = false;
  constructor(public executionService: ExecutionService, private activeModal: NgbActiveModal,
    private modalService: NgbModal, public cdref: ChangeDetectorRef) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'lg'
    }
  }

  ngAfterViewInit() {
    try {
      this.signaturePad.set('minWidth', 2);
      this.signaturePad.set('canvasWidth', this.width);
      this.signaturePad.set('canvasHeight', this.height);
    } catch (err) {
    }
  }

  setSignature() {
    if (this.isSignatureEnabled) {
      if (!this.isYubikeyEnabled && this.userIdEditable == 1 && !this.userId)
        return;
    }
    if (!this.isUploadImage)
      this.drawComplete();
    this.closeEvent.emit(this.getEmitObject(this.type));

  }
  closeModal() {
    this.activeModal.close();
    this.closeEvent.emit(false);
  }
  drawComplete() {
    this.signature = this.signaturePad.toDataURL();
    if (this.signature === this.defaultSigText) {
      this.signature = '';
    }
    this.updateFooterList()
  }
  updateFooterList() {
    const isVerification = this.selectedSignture?.dgType === 'VerificationDataEntry';
    const isInitialPad = this.title === 'Initial Pad';
    const isSignaturePad = this.title === 'Signature Pad';
    let isUserIdInvalid = (this.isUserIdRequired == 1 && this.userIdEditable == 1) ? !this.userId?.toString().trim() : false;
    let isUserNameInvalid = (this.isUserNameRequired == 1 && this.userNameEditable == 1) ? !this.userName?.toString().trim() : false;
    const isSignatureInvalid = !this.signature;
    if (this.isYubikeyEnabled) {
      isUserIdInvalid = false;
      isUserNameInvalid = (this.isUserNameRequired == 1 && this.userNameEditable == 1) ? !this.userName?.toString().trim() : false;
    } else {
      isUserIdInvalid = (this.isUserIdRequired == 1 && this.userIdEditable == 1) ? !this.userId?.toString().trim() : false;
      isUserNameInvalid = (this.isUserNameRequired == 1 && this.userNameEditable == 1) ? !this.userName?.toString().trim() : false;
    }
    const isSignatureValid = isSignatureInvalid || isUserIdInvalid || isUserNameInvalid;
    this.footerList = [
      { type: 'Upload' },
      { type: 'Clear' },
      { type: 'Set As Default', hidden: isVerification || this.hideDefault, disabled: isSignatureValid },
      { type: 'Remove Default', hidden: isVerification || this.hideDefault, disabled: (isInitialPad && !this.executionService.defualtInitialEnable) || (isSignaturePad && !this.executionService.defualtSignEnable) },
      { type: 'Save & Protect', hidden: isVerification || this.hideDefault, disabled: isSignatureValid },
      { type: 'Save', disabled: isSignatureValid },
      { type: 'Cancel' }];
  }

  clear() {
    if (this.signaturePad || !this.isUploadImage) {
      this.executionService.isPlaceDispaly = true;
      this.signaturePad?.clear();
    }
    this.signature = '';
    this.updateDatePlaceholder();
    this.commentInfo = '';
    this.userName = '';
    this.userId = ''
    this.isUploadImage = true;
    this.updateFooterList()
    setTimeout(() => { this.isUploadImage = false; }, 1);
    this.userIdEditorOpened = false;
    this.userNameEditorOpened = false;
    this.userNotesEditorOpened = false;
    this.cdref.detectChanges();
  }


  uploadImage() {
    $('#fileUploadSignature').trigger('click');
  }
  uploadSig(event: any) {
    let files: any = (<HTMLInputElement>event.target).files;
    this.isUploadImage = true;
    if (files.length > 0) {
      this.getBase64(files[0], (base64Data: any) => {
        this.signature = base64Data;
      });
    }
  }

  updateDatePlaceholder() {
    const isSignatureType = this.selectedSignture?.dgType === 'SignatureDataEntry';
    const includeTime = this.selectedSignture?.isTimeDisplayOpen || this.selectedSignture?.timePromptDisplay;
    const format = this.documentInfo?.formatPlaceHolder || 'mm/dd/yyyy';
    this.signatureDate = isSignatureType && this.signatureDate === 'mm/dd/yyyy' ? (includeTime ? `${format} HH: MM` : format) : `${format} HH: MM`;
  }
  ngAfterContentInit() {
    this.updateDatePlaceholder();
    const defaultSettings = { foreColor: '#000000', defaultFontSize: '2', defaultFontName: 'Poppins' };
    const { fontsize, fontfamily, color } = this.documentInfo || {};
    const fontChanged = (fontsize && fontsize !== defaultSettings.defaultFontSize) || (fontfamily && fontfamily !== defaultSettings.defaultFontName) || (color && color !== defaultSettings.foreColor);
    if (fontChanged) {
      this.selectedSignture['isHtmlView'] = true;
      this.signatureDate = this.executionService.addDateWithFontTag(this.signatureDate, this.documentInfo)
    } else {
      this.selectedSignture['isHtmlView'] = false;
    }
    this.resetConfig();
    const appliedSettings = {
      foreColor: this.documentInfo?.color || defaultSettings.foreColor,
      defaultFontSize: this.documentInfo?.fontsize || defaultSettings.defaultFontSize,
      defaultFontName: this.documentInfo?.fontfamily || defaultSettings.defaultFontName
    };
    Object.assign(this.userConfig, appliedSettings);
    Object.assign(this.notesConfig, appliedSettings);
    this.userNameStep = { ...this.selectedSignture };
    this.userIdStep = { ...this.selectedSignture };
    this.commentStep = { ...this.selectedSignture };
  }

  openOrCloseEditor(inputType: any, event: any) {
    (this as any)[inputType] = event;
  }
  saveSignatureUserInfo(eventObj: any, event: any, fieldName: string) {
    // (this as any)[fieldName] = event;
    this.openOrCloseEditor(fieldName, false);
    this.updateFooterList();
    this.cdref.detectChanges();
  }
  updateUserName(fieldName: any, newVal: string,) {
    (this as any)[fieldName] = newVal;
  }
  getValue(fieldName: any) {
    let value = (this as any)[fieldName];
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
    this.notesConfig.minHeight = this.selectedSignture?.height ? (this.selectedSignture?.height) + 'px' : '70px';
    this.selectedSignture['height'] = '70px';
    this.notesConfig.onlyNumber = false;
    this.notesConfig = JSON.parse(JSON.stringify(this.notesConfig));
  }

  onInputClick = (event: any) => {
    const element = event.target as HTMLInputElement
    element.value = ''
  }

  drawStart() {
    this.signature = this.signaturePad.toDataURL();
  }
  setAsDefault() {
    this.defaultSignEvent.emit(this.getEmitObject('save'));
    this.setDefaultSignValues();
  }

  removeDefault() {
    this.defaultSignEvent.emit({
      type: 'remove', value: this.signature,
      obj: this.selectedSignture
    });
    this.setDefaultSignValues();
  }
  setDefaultSignValues() {
    if (this.title == 'Signature Pad') {
      this.executionService.defualtSignEnable = !this.executionService.defualtSignEnable;
    } else {
      this.executionService.defualtInitialEnable = !this.executionService.defualtInitialEnable;
    }
    this.updateFooterList();
  }
  getBase64(file: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(file);
  }
  protectEntireCbp() {
    this.protectAllFields.emit(this.getEmitObject('protectAllFields'));
  }
  openDate() {
    this.signatureDate = this.executionService.removeHTMLTags(this.signatureDate);
    try {
      this.dateModalRef = this.modalService.open(this.datePopupModalContent, this.modalOptions);
      if (this.dateModalRef.componentInstance) {
        this.dateModalRef.componentInstance.dateFormat = this.documentInfo?.dateFormatNew;
        this.dateModalRef.componentInstance.execution = true;
      } else {
        console.warn("Component instance is undefined.");
      }
    } catch (error) {
      console.error("Error opening modal:", error);
    }
  }

  changeDate(event: any) {
    this.signatureDate = event;
  }
  cancel() {
    this.dateModalRef.close();
    // this.closeEvent.emit(false);
  }
  save() {
    if (this.selectedSignture['isHtmlView']) {
      this.signatureDate = this.executionService.addDateWithFontTag(this.signatureDate, this.documentInfo)
    }
    this.dateModalRef.close();
  }
  clearDate() {
    this.signatureDate = 'mm/dd/yyyy';
    this.updateDatePlaceholder();
  }

  getEmitObject(type: any) {
    const baseFormat = this.documentInfo?.dateFormatNew ?? 'm/d/Y';
    const includeTime = this.selectedSignture?.dgType == 'SignatureDataEntry' ? this.selectedSignture?.isTimeDisplayOpen || this.selectedSignture?.timePromptDisplay : true
    const format = includeTime ? `${baseFormat} h: i a` : baseFormat;
    return {
      type: type, value: this.signature,
      obj: this.selectedSignture, userId: this.userId,
      signatureDate: this.executionService.hasDateOrTime(this.signatureDate) ? this.signatureDate : this.selectedSignture['isHtmlView'] ? this.executionService.addDateWithFontTag(this.executionService.formatDate(new Date(), format), this.documentInfo) : this.executionService.formatDate(new Date(), format),
      userName: this.userName, notes: this.commentInfo, commentInfo: this.commentInfo
    }
  }

}
