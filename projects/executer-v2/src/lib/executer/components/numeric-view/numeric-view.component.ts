import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { DgTypes, ErrorModalComponent } from 'cbp-shared';
import { AngularEditorConfig } from 'dg-shared';
import { Subscription } from 'rxjs';
import { ApproveStatus, ApproveUser } from '../../models';
import { CbpExeService } from '../../services/cbpexe.service';
import { DataJsonService } from '../../services/datajson.service';
import { DatashareService } from '../../services/datashare.service';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';
import { AntlrService } from '../../shared/services/antlr.service';
import { ProtectApprovalComponent } from '../protect-approval/protect-approval.component';

/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */
declare const $: any;

@Component({
  selector: 'app-numeric-view',
  templateUrl: './numeric-view.component.html',
  styleUrls: ['./numeric-view.component.css']
})
export class NumericViewComponent {
  @Input() stepObject: any;
  @Input() obj: any;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  @Output() focusEvent: EventEmitter<any> = new EventEmitter();
  dgType = DgTypes;
  styleObject: any = {};
  styleModel_subscription!: Subscription;
  style_subscription!: Subscription;
  color_subscription!: Subscription;
  config!: AngularEditorConfig;
  modalOptions: NgbModalOptions;
  link_subscription!: Subscription;
  counter = 0;
  constructor(public cbpService: CbpExeService, public cdr: ChangeDetectorRef,
    private dataJsonService: DataJsonService, private modalService: NgbModal, public datashareService: DatashareService,
    public executionService: ExecutionService, private sharedviewService: SharedviewService,
    public notifier: NotifierService, public antlrService: AntlrService) {
    this.modalOptions = this.dataJsonService.modalOptions;
  }
  ngOnInit() {
    if (this.stepObject?.isTableDataEntry) {
      this.cbpService.storeTempMapID(this.stepObject['fieldName'], this.stepObject);
    }
    this.setConfig();
    this.stepObject['negative'] = 0;
    this.config = JSON.parse(JSON.stringify(this.config));
    this.stepObject = this.dataJsonService.setObjectItem(this.stepObject);
    this.styleModel_subscription = this.executionService.styleModelobjValue.subscribe((res: any) => {
      if (res && res != '{}' && !this.executionService.isEmpty(res)) {
        this.styleObject = this.sharedviewService.setStyles(res['levelNormal']);
        this.styleObject = this.sharedviewService.setBackgroundTrans(this.styleObject);
        // angular-editor open and close issue. unable to enter the data in textbox due to below code
        // if (!this.stepObject?.styleSet) { this.stepObject['styleSet'] = {}; }
        // this.stepObject.styleSet['fontsize'] = this.styleObject['font-size'];
        // this.stepObject.styleSet['fontfamily'] = this.styleObject['font-family'];
      }
    });
     if (this.stepObject?.defaultValue && !this.stepObject?.storeValue && !this.stepObject?.isLoadedFromJson) {
      this.stepObject.storeValue = this.stepObject?.defaultValue;
      this.storeItemOfEnter(this.stepObject,this.stepObject?.storeValue?.toString())
      this.antlrService.callBackObject.initExecution(this.stepObject.dgUniqueID, this.stepObject.storeValue);
    }
    if (this.stepObject?.minimum < 0 || this.stepObject?.maximum < 0) {
      this.stepObject['negative'] = 1;
    }
    if (this.stepObject?.minimum > 0 && this.stepObject?.maximum > 0) {
      this.stepObject['negative'] = 0;
    }
    this.color_subscription = this.executionService.colorUpdateView.subscribe((res: any) => {
      if (res && res != '{}' && !this.executionService.isEmpty(res) && res?.color && this.stepObject?.storeValue == '') {
        this.stepObject['innerHtmlView'] = false;
        this.stepObject['color'] = JSON.parse(JSON.stringify(res.color));
        this.config.foreColor = this.stepObject['color'];
        this.config = JSON.parse(JSON.stringify(this.config));
        if (this.stepObject?.valueType != 'Derived') {
          this.stepObject['innerHtmlView'] = true;
          this.stepObject = this.cbpService.checkInnerHtml(this.stepObject);
        }
        if (!this.stepObject['styleSet']) { this.stepObject['styleSet'] = {}; }
        this.stepObject['styleSet']['fontcolor'] = this.stepObject['color'];
      }
      if (res?.enableCommentsProtect && !res?.selectedField) {
        this.stepObject.commentsEnabled = res?.bol;
      }
      if (res?.enableCommentsProtect && res?.selectedField) {
        if (this.stepObject.dgUniqueID !== this.executionService?.selectedFieldEntry?.dgUniqueID) {
          this.stepObject.commentsEnabled = res?.bol;
        }
      }
      this.cdr.detectChanges();
    });
    this.style_subscription = this.executionService.styleViewUpdateView.subscribe((res: any) => {
      if (res && res != '{}' && !this.executionService.isEmpty(res) && this.stepObject?.storeValue == '') {
        if (this.stepObject?.valueType != 'Derived') {
          this.stepObject['innerHtmlView'] = true;
        }
        if (!this.stepObject['styleSet']) { this.stepObject['styleSet'] = {}; }
        if (!this.stepObject['styleSet']) { this.stepObject['styleSet'] = {}; }
        if (res?.type == 'fontfamily') {
          this.config.defaultFontName = res?.fontfamily;
          this.stepObject['styleSet']['fontfamily'] = res?.fontfamily;
        }
        if (res?.type == 'fontsize') {
          this.config.defaultFontSize = res?.fontsize;
          this.stepObject['styleSet']['fontsize'] = res?.fontsize;
        }
        if (res?.type == 'size&family') {
          this.config.defaultFontName = res?.fontfamily;
          this.stepObject['styleSet']['fontfamily'] = res?.fontfamily;
          this.config.defaultFontSize = res?.fontsize;
          this.stepObject['styleSet']['fontsize'] = res?.fontsize;
        }
        this.config = this.cbpService.setStyleEditor(this.stepObject, this.config);
        this.config = JSON.parse(JSON.stringify(this.config));
        this.cdr.detectChanges();
      }
    });
    const self = this
    $('.popuptextClose').click(function (e: any) {
      $('#refObjLinkDrop-' + self.executionService.refObjID).find('.popuptextContent').remove();
      $('.popuptext').css("display", "none");
      self.executionService.refObjValueState = 0
      e.stopPropagation();
    })
    $('.hyperlink').unbind().click(function (e: any) {
      self.executionService.setrefObj(e);
      e.stopPropagation();
    });
    this.link_subscription = this.executionService.linkSubscription.subscribe((response: any) => {
      if (this.cbpService.selectedFieldID == this.stepObject.dgUniqueID) {
        ++this.counter;
        if (this.counter == 1) {
          this.setLink(response);
        }
      }
    })
    this.cdr.detectChanges();
  }
  setLink(response: any) {
    let linkText = '';
    let selectedText = this.cbpService.getSelectionText().trim();
    if (response && response.msg && response.msg[0]) {
      linkText = ' <a href="javascript:void(0);" id="a-' + this.stepObject.dgUniqueID + '" class="hyperlink popup" dgc_reference_object_key="' + response.msg[0].DGC_REFERENCE_OBJECT_KEY + '" '
        + ' reference_object_code= "' + response.msg[0].DGC_REFERENCE_OBJECT_CODE + '" placement="top"  [ngbTooltip]="refContent">' + selectedText + '</a> ';
      this.stepObject.storeValue = this.stepObject.storeValue.replace(selectedText, linkText)
      this.coreEventMethod('checkValidation', this.stepObject, this.stepObject.storeValue);
      this.storeItemOfEnter(this.stepObject, this.stepObject.storeValue);
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
  setConfig() {
    this.config = this.dataJsonService.config;
    this.config.toolbarPosition = 'bottom';
    this.config.maxHeight = '23px';
    this.config.minHeight = '34px';
    this.config.overFlow = 'hidden';
    this.config['onlyNumber'] = true;
    this.config.maxLengthEnabled = false;
    this.config = this.cbpService.setStyleEditor(this.stepObject, this.config);
  }
  checkValidation(eventV: any, eventObj: any, eventValue: any) {
    let isValidText: any = eventValue;
    if (this.stepObject?.innerHtmlView && eventValue !== "") {
      isValidText = this.cbpService.removeHTMLTags(eventValue);
    } else {
      this.stepObject.storeValue = this.stepObject.storeValue.toString().replace(/(?!^-)[^0-9.]/g, '');
    }
    isValidText = this.checkDecimalValues(isValidText);
    if (!this.stepObject?.innerHtmlView && isValidText !== "") {
      this.stepObject.storeValue = isValidText;
    }
    if (this.cbpService.isValidNumber(eventValue) || eventValue === "" || this.cbpService.isValidNumber(isValidText))
      this.closeEvent.emit({ event: eventV, stepObj: eventObj, value: this.stepObject.storeValue });
    let storeValue = this.cbpService.removeHTMLTags(this.stepObject.storeValue);
    if (Number(storeValue) < Number(this.stepObject?.minimum) && (this.stepObject?.minimum != null && this.stepObject?.minimum != undefined && this.stepObject?.minimum != '')) {
      this.stepObject.storeValue = '';
    }
    if (Number(storeValue) > Number(this.stepObject?.maximum) && (this.stepObject?.maximum != null && this.stepObject?.maximum != undefined && this.stepObject?.maximum != '')) {
      this.stepObject.storeValue = '';
    }
  }
  checkDecimalValues(eventValue: any): string {
    eventValue = eventValue.toString().replace(/(?!^-)[^0-9.]/g, '');
    const parts = eventValue.split('.');
    if (parts.length > 2) {
      eventValue = parts[0] + '.' + parts.slice(1).join('');
    }
    if (!eventValue) return '';
    const decimalPlaces = Number(this.stepObject.decimal);
    if (!isNaN(decimalPlaces) && decimalPlaces > 0) {
      if (eventValue.includes('.')) {
        const [wholePart, decimalPart = ''] = eventValue.split('.');
        const trimmedDecimal = decimalPart.slice(0, decimalPlaces);
        return `${wholePart}.${trimmedDecimal}`;
      } else {
        return eventValue;
      }
    }
    try {
      const [whole] = eventValue.split('.');
      return whole.length > 15 ? BigInt(whole).toString() : Math.trunc(Number(whole)).toString();
    } catch (e) {
      return '';
    }
  }
  public checkValidNumber = this.debounceTime((stepObject: any, itemno: any, isEditor: boolean) => {
    this.isValid(stepObject, itemno, isEditor);
    this.cdr.detectChanges();
  }, 1000);

  debounceTime(cb: any, delay = 1000) {
    let timeout: any;
    return (...args: any) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        cb(...args);
      }, delay)
    }
  }
  setObject(event: any, type: string) {
    this.checkElement('click');
    if (event && (!this.cbpService.selectCellEnabled)) {
      this.stepObject = this.cbpService.setDefaultColor(this.stepObject, this.cbpService.documentInfo);
      this.stepObject = this.executionService.setColorForKeyDown(type, event, this.stepObject);
      this.setFieldItem();
    }
  }
  setFieldItem() {
    this.setConfig();
    this.executionService.selectedField({ stepItem: this.obj, stepObject: this.stepObject, showMenuText: true });
    this.executionService.selectedFieldEntry = this.stepObject;
    this.executionService.selectedNewEntry = this.stepObject;
    this.config = this.cbpService.setStyleEditor(this.stepObject, this.config);
    this.config = JSON.parse(JSON.stringify(this.config));
    if (this.stepObject?.protect) {
      this.stepObject.commentsEnabled = true;
      this.executionService.setColorItem({ 'enableCommentsProtect': 'enableComments', bol: false, 'selectedField': true });
    }
    this.stepObject = this.executionService.setFormatStyle(this.stepObject);
    if (this.executionService.formatPainterEnable) {
      this.executionService.selectedField({ stepItem: this.obj, stepObject: this.stepObject, showMenuText: true });
    }
    this.cdr.detectChanges();
  }
  validNumb(stepObject: any) {
    const num = /[^0-9]/g;
    let valueItem = this.cbpService.isHTMLText(stepObject.storeValue) ? this.cbpService.removeHTMLTags(stepObject.storeValue) : stepObject.storeValue;
    let res = num.test(valueItem?.toString());
    if (res) {
      stepObject.storeValue = stepObject.storeValue?.toString()?.replace(/(?<=>)([^<]*)(?=<)/g, (match: any) => {
        return match.replace(/[a-zA-Z]/g, ''); // Remove letters within text content
      });
      return stepObject.storeValue;
    } else {
      return stepObject.storeValue;
    }
  }
  isValidNum(stepObject: any, event: any, isEditor: boolean) {
    var theEvent = event || window.event;
    if (theEvent.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
    }
    const num = /[^0-9]/g;
    let valueItem = this.cbpService.isHTMLText(stepObject.storeValue) ? this.cbpService.removeHTMLTags(stepObject.storeValue) : stepObject.storeValue;
    let res = num.test(valueItem);
    if (res) {//valueItem.match(letterNumber)
      //this.setNotNumerError(stepObject, true);
      stepObject.storeValue = stepObject.storeValue?.toString()?.replace(/[a-zA-Z]/g, '');
    } else {
      this.clearError();
    }
  }

  isValid(stepObject: any, itemno: any, isEditor: boolean) {
    const letterNumber = /^[a-zA-Z]+$/;
    let valueItem = this.cbpService.isHTMLText(stepObject.storeValue) ? this.cbpService.removeHTMLTags(stepObject.storeValue) : stepObject.storeValue;
    valueItem = valueItem?.toString();
    if (valueItem.match(letterNumber)) {
      //  this.setNotNumerError(stepObject, true);
    } else if (!stepObject.minimum && !stepObject.maximum) {
      this.clearError();
      return true;
    } else {
      stepObject['isError'] = false;
      stepObject['isNotNumberError'] = false;
      const value = Number(valueItem);
      const type = stepObject.minimum && stepObject.maximum ? 'all' : (
        stepObject.minimum !== null && stepObject.maximum === null ? 'lessthan' : 'greater');
      const lessthan = value < stepObject.minimum;
      const greater = value > stepObject.maximum;
      if (type === 'all' && value !== undefined && (greater || lessthan)) {
        this.setEmptyValues();
        itemno.target.value = '';
      } else if (type === 'greater' && value !== undefined && greater) {
        this.setEmptyValues();
        itemno.target.value = '';
      } else if (type === 'lessthan' && value !== undefined && lessthan) {
        this.setEmptyValues();
        itemno.target.value = '';
      } else {
        this.clearError();
        this.setReturnValue(stepObject, false);
      }
    }
  }
  setEmptyValues() {
    this.stepObject['isError'] = true;
    this.stepObject.storeValue = '';
    setTimeout(() => {
      this.stepObject['editorOpened'] = false;
    }, 2000);
    this.clearError()
    this.cdr.detectChanges();
  }
  clearError() {
    setTimeout(() => {
      this.setNotNumerError(this.stepObject, false);
      this.cdr.detectChanges();
    }, 5000);
    this.cdr.detectChanges();
  }
  setReturnValue(stepObject: any, isError: any) {
    stepObject['isError'] = isError;
    return isError;
  }
  setNotNumerError(stepObject: any, isError: any) {
    stepObject['isNotNumberError'] = isError;
    stepObject['isError'] = isError;
    return isError;
  }
  coreEventMethod(item: any, type: string, event: any) {
    let isFocusCall = false;
    if (this.stepObject.dgUniqueID === this.executionService.selectedFieldEntry?.dgUniqueID
      && event && (!this.cbpService.selectCellEnabled)) {
      this.stepObject['color'] = this.cbpService.documentInfo.color;
      isFocusCall = true;
      this.validationMethod({ type: type, obj: item });
    }
    if (!isFocusCall) { this.validationMethod({ type: type, obj: item }); }
  }
  validationMethod(item: any) {
    if (item.type === 'checkValidation') {
      if (!item.obj?.disableField) { }
      this.checkValidation(this.obj, item.obj, item.obj.storeValue);
      return;
    }
    if (item.type === 'protectApproval') {
      this.showProtectApproval(item.obj);
      return;
    }
  }
  showProtectApproval(stepObj: any) {
    this.modalOptions.size = 'lg';
    const modalRef = this.modalService.open(ProtectApprovalComponent, this.modalOptions);
    if (stepObj['approveList'].length > 0) {
      if ((stepObj['approveList'].at(-1).status !== 'Pending') && stepObj['approveList'].at(-1).newText !== stepObj.storeValue) {
        this.setProtectObj();
      }
    } else {
      this.setProtectObj();
    }
    if (stepObj['approveList'].at(-1).by !== this.executionService.selectedUserName) {
      let index = this.stepObject['approveList'].at(-1).approveUser.findIndex((i: any) => i.status === '');
      if (this.stepObject['approveList'].at(-1).status === 'Pending' || this.stepObject['approveList'].at(-1).status === '') {
        this.stepObject['approveList'].at(-1).approveUser[index] = new ApproveUser('', this.executionService.selectedUserName, this.executionService.selectedUserName, new Date(), '', '', '');
      }
    }
    modalRef.componentInstance.cbpService = this.cbpService;
    modalRef.componentInstance.stepObject = stepObj;
    modalRef.componentInstance.closeEvent.subscribe((receivedEntry: any) => {
      if (receivedEntry.type != false && receivedEntry.type !== 'saveApprove') {
        this.stepObject = receivedEntry.obj;
        if (this.stepObject.approveList.at(-1).status === 'Approved' || this.stepObject.approveList.at(-1).status === 'Complete') {
          this.stepObject['protectColor'] = 'green';
        }
        if (this.stepObject.approveList.at(-1).status === 'Rejected') {
          this.stepObject['protectColor'] = 'red';
        }
        this.checkValidation(this.obj, stepObj, stepObj.storeValue);
        this.cdr.detectChanges();
      }
      if (receivedEntry.type !== 'saveApprove') { modalRef.close(); }
      if (receivedEntry.type === 'saveApprove') {
        this.stepObject = receivedEntry.obj;
        this.checkValidation(this.obj, stepObj, stepObj.storeValue);
        this.cdr.detectChanges();
      }
    });
  }
  setProtectObj() {
    this.stepObject['approveList'].push(new ApproveStatus(this.stepObject.protectOldValue, this.stepObject.storeValue, this.executionService.selectedUserName, '', new Date(), 'Pending', this.stepObject.comments))
  }
  closePopup() {
    this.stepObject.commentsEnabled = false;
    this.cdr.detectChanges();
  }
  ngOnDestroy(): void {
    this.styleModel_subscription?.unsubscribe();
    this.color_subscription?.unsubscribe();
    this.style_subscription?.unsubscribe();
  }
  storeItemOfEnter(stepObject: any, value: any) {
    stepObject.oldValue = stepObject?.oldValue ? stepObject.oldValue : '';
    if (value !== stepObject?.oldValue && !stepObject?.disableField) {
      let dataInfoObj = this.sharedviewService.storeDataObj(stepObject, value);
      this.cbpService.dataJsonStoreChange(dataInfoObj, stepObject);
      this.datashareService.changeCount++;
    }
  }
  checkElement(event: any) {
    this.setDerviedRule();
    this.executionService.setFieldVal(this.stepObject);
    if (event !== 'click' && !this.cbpService.selectCellEnabled)
      this.focusEvent.emit({ step: this.stepObject, event: event });
  }
  setDerviedRule() {
    if (this.stepObject.valueType == 'Derived') {
      if (this.cbpService.isDgUniqueIdPresentInAntlr(this.stepObject.ParsedValue, this.antlrService.callBackObject)) {
        let storeData = this.antlrService.executeExpression(this.stepObject.ParsedValue);
        if (Array.isArray(storeData)) {
          this.stepObject.storeValue = storeData ? this.cbpService.roundOffValue(storeData[storeData?.length - 1], this.stepObject?.decimal, this.stepObject.dgType) : '';
          this.stepObject.storeValue = this.stepObject.storeValue.toString();
          if (this.stepObject.storeValue == '<<DG_EMPTY>>') { this.stepObject.storeValue = ''; }
        } else {
          storeData = this.cbpService.roundOffValue(storeData, this.stepObject?.decimal, this.stepObject.dgType);
          this.stepObject.storeValue = storeData ? storeData : '';
        }
        this.checkValidation(this.obj, this.stepObject, this.stepObject.storeValue);
      }
    }
  }
  viewUpdate() {
    this.stepObject.editorOpened = true;
    this.cdr.detectChanges();
  }
}
