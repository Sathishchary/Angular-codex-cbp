import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { DgTypes, ErrorModalComponent } from 'cbp-shared';
import { AngularEditorConfig } from 'dg-shared';
import { Subscription } from 'rxjs';
import { ApproveStatus, ApproveUser } from '../../models/approve-model';
import { CbpExeService } from '../../services/cbpexe.service';
import { DataJsonService } from '../../services/datajson.service';
import { DatashareService } from '../../services/datashare.service';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';
import { AntlrService } from '../../shared/services/antlr.service';
import { TableService } from '../../shared/services/table.service';
import { ProtectApprovalComponent } from '../protect-approval/protect-approval.component';

declare const $: any;

@Component({
  selector: 'app-textbox-view',
  templateUrl: './textbox-view.component.html',
  styleUrls: ['./textbox-view.component.css']
})
export class TextboxViewComponent implements AfterViewInit, OnInit {
  @Input() stepObject: any;
  @Input() obj: any;
  @Input() i: any = 0;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  @Output() pasteDataJson: EventEmitter<any> = new EventEmitter();
  @Output() focusEvent: EventEmitter<any> = new EventEmitter();
  dgType = DgTypes;
  styleModel: any;
  styleObject: any = {};
  modalOptions: NgbModalOptions;
  styleModel_subscription!: Subscription;
  color_subscription!: Subscription;
  config!: AngularEditorConfig;
  style_subscription!: Subscription;
  link_subscription!: Subscription;
  counter = 0;
  dropDownStyleSubscription!: Subscription;
  dropDownStyleObject: any = {};
  constructor(public cbpService: CbpExeService, public executionService: ExecutionService,
    private dataJsonService: DataJsonService, public tableService: TableService,
    public cdr: ChangeDetectorRef, public sharedviewService: SharedviewService,
    private modalService: NgbModal, public notifier: NotifierService,
    public datashareService: DatashareService, public antlrService: AntlrService) {
    this.modalOptions = this.dataJsonService.modalOptions;
  }

  ngOnInit() {
    if (this.stepObject?.isTableDataEntry) {
      this.cbpService.storeTempMapID(this.stepObject['fieldName'], this.stepObject);
    }
    this.resetConfig();
    this.stepObject = this.dataJsonService.setObjectItem(this.stepObject);
    if (this.stepObject?.defaultValue && !this.stepObject.storeValue) {
      this.stepObject.storeValue = this.stepObject?.defaultValue;
    }
    if (this.stepObject?.dataType == "Dropdown" && this.stepObject?.choice?.length > 0) {
      this.dropDownStyleObject = this.getDropdownStyles();
    }
  }
  resetConfig() {
    this.config = this.config ? this.config : this.dataJsonService.config;
    this.config.toolbarPosition = 'bottom';
    this.config.maxHeight = 'auto';
    this.config.minHeight = '34px';
    this.config.overFlow = 'hidden';
    this.config = this.cbpService.setStyleEditor(this.stepObject, this.config);
    this.config.onlyNumber = false;
    if (this.stepObject?.MaxSize || ('MaxSize' in this.stepObject)) {
      this.stepObject['Maxsize'] = this.stepObject?.MaxSize;
      delete this.stepObject.MaxSize;
    }
    if (this.stepObject?.Maxsize !== null && this.stepObject?.Maxsize !== '' && ('Maxsize' in this.stepObject)) {
      this.config.maxLengthEnabled = true;
      this.config.maxLength = Number(this.stepObject?.Maxsize);
    } else {
      this.config.maxLengthEnabled = false;
    }
    this.config = JSON.parse(JSON.stringify(this.config));
  }
  ngAfterViewInit(): void {
    this.stepObject.isTableDataEntry = this.stepObject.isTableDataEntry ?? false;
    this.styleModel_subscription = this.executionService.styleModelobjValue.subscribe((res: any) => {
      if (res && res !== undefined && !this.executionService.isEmpty(res)) {
        this.styleObject = this.sharedviewService.setStyles(res['levelNormal']);
        this.styleObject = this.sharedviewService.setBackgroundTrans(this.styleObject);
        this.cdr.detectChanges();
      }
    });
    this.color_subscription = this.executionService.colorUpdateView.subscribe((res: any) => {
      if (res && res != '{}' && !this.executionService.isEmpty(res) && res?.color && this.stepObject?.storeValue == '') {
        this.stepObject['color'] = JSON.parse(JSON.stringify(res.color));
        this.config.foreColor = this.stepObject['color'];
        this.config = JSON.parse(JSON.stringify(this.config));
        if (this.stepObject?.valueType != 'Derived') {
          this.stepObject['innerHtmlView'] = true;
          this.stepObject = this.cbpService.checkInnerHtml(this.stepObject);
        }
        if (!this.stepObject['styleSet']) { this.stepObject['styleSet'] = {}; }
        if (this.stepObject?.dataType != "Dropdown" && this.stepObject?.choice?.length == 0) {
          this.stepObject['styleSet']['fontcolor'] = this.stepObject['color'];
        }
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
    this.link_subscription = this.executionService.linkSubscription.subscribe((response: any) => {
      if (this.cbpService.selectedFieldID == this.stepObject.dgUniqueID) {
        ++this.counter;
        if (this.counter == 1) {
          this.setLink(response);
        }
      }
    })
    const self = this;
    $('.popuptextClose').click(function (e: any) {
      $('#refObjLinkDrop-' + self.executionService.refObjID).find('.popuptextContent').remove();
      $('.popuptext').css("display", "none");
      self.executionService.refObjValueState = 0
      e.stopPropagation();
    });
    $('.hyperlink').unbind().click(function (e: any) {
      self.executionService.setrefObj(e);
      e.stopPropagation();
    });
    if (this.stepObject?.storeValue && this.cbpService.isHTMLText(this.stepObject?.storeValue)) {
      this.stepObject['innerHtmlView'] = true;
    }
    this.dropDownStyleSubscription = this.executionService.styleViewUpdateDropView.subscribe((response: any) => {
      if (response && response != '{}' && !this.executionService.isEmpty(response)) {
        if (this.executionService.selectedNewEntry?.dgUniqueID == this.stepObject.dgUniqueID && this.stepObject?.dataType == "Dropdown" && this.stepObject?.choice?.length > 0) {
          this.stepObject['innerHtmlView'] = true;
          if (!this.stepObject['styleSet']) { this.stepObject['styleSet'] = {}; }
          this.config.defaultFontName = response?.fontfamily;
          this.config.defaultFontSize = response?.fontsize;
          console.log(response);
          this.stepObject['styleSet'] = response;
          this.dropDownStyleObject = this.getDropdownStyles();
          this.cdr.detectChanges();
        }
      }

    })
    this.cdr.detectChanges();
  }
  setLink(response: any) {
    let linkText = '';
    let selectedText = this.cbpService.getSelectionText().trim();
    if (response && response.msg && response.msg[0]) {
      linkText = '<a href="javascript:void(0);" id="a-' + this.stepObject.dgUniqueID + '" class="hyperlink popup" dgc_reference_object_key="' + response.msg[0].DGC_REFERENCE_OBJECT_KEY + '" '
        + ' reference_object_code= "' + response.msg[0].DGC_REFERENCE_OBJECT_CODE + '" placement="top"  [ngbTooltip]="refContent">' + selectedText + '</a> ';
      this.stepObject.storeValue = this.stepObject.storeValue.replace(selectedText, linkText)
      this.coreEventMethod('checkValidation', this.stepObject, this.stepObject.storeValue);
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
  checkValidation(eventV: any, eventObj: any, eventValue: any) {
    this.stepObject['color'] = this.cbpService.documentInfo.color;
    this.storeItemOfEnter(this.stepObject, this.stepObject.storeValue);
    this.closeEvent.emit({ event: eventV, stepObj: eventObj, value: eventValue })
  }
  setAutoPopulate(obj: any) {
    if (obj.autoPopulate === 'CurrentUser' || obj.autoPopulate === 'CurrentLogin') {
      obj.storeValue = this.executionService.loggedInUserName;
    }
    if (obj.autoPopulate === 'CurrentPersonnelID') { obj.storeValue = this.executionService.loggedInUserId; }
  }
  validationMethod(item: any) {
    if (item.type === 'checkValidation') {
      // item.obj.oldValue = item.obj?.oldValue ? item.obj.oldValue : '';
      // if(item.obj.storeValue !== item.obj.oldValue) {
      if (!item.obj?.disableField)
        this.checkValidation(this.obj, item.obj, item.obj.storeValue);
      // }
      return;
    }
    if (item.type === 'autopopulate') {
      this.setAutoPopulate(item.obj);
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
    this.stepObject['approveList'].push(new ApproveStatus(this.stepObject.protectOldValue, this.stepObject.storeValue,
      this.executionService.selectedUserName, '', new Date(), 'Pending', this.stepObject.comments))
  }
  coreEventMethod(type: string, item: any, event: any) {
    let isFocusCall = false;
    if (this.stepObject.dgUniqueID === this.executionService.selectedFieldEntry?.dgUniqueID
      && (!this.cbpService.selectCellEnabled)) {
      isFocusCall = true;
      this.stepObject['color'] = this.cbpService.documentInfo.color;
      this.validationMethod({ type: type, obj: item });
      // this.storeItemOfEnter(this.stepObject, this.stepObject.storeValue);
      // this.executionService.selectedField({stepItem: {}, stepObject: {}, showMenuText : false});
    } else {
      if (this.cbpService.refTabOpen) {
        this.stepObject['editorOpened'] = false;
        this.stepObject['isEditMode'] = false;
      }
      if (this.stepObject?.isTableDataEntry) {
        this.executionService.selectedField({ stepItem: this.obj, stepObject: this.stepObject, showMenuText: true });
      }
    }
    if (!isFocusCall) { this.validationMethod({ type: type, obj: item }); }
  }
  selectElement() {
    this.cbpService.selectedFieldID = this.stepObject.dgUniqueID;
  }
  setColor(color: any) {
    this.stepObject['color'] = color;
  }
  setObject(event: any, type: string) {
    this.checkElement('click');
    if (event && (!this.cbpService.selectCellEnabled)) {
      if (event.target.className == 'hyperlink popup') {
        $('#textarea' + this.stepObject.dgUniqueID).css('overflow', 'visible')
        this.executionService.setrefObj(event);
      } else {
        try {
          if (this.stepObject?.MaxSize && Number(this.stepObject?.MaxSize) && this.stepObject?.storeValue) {
            if (this.stepObject.storeValue) {
              this.stepObject.storeValue = this.stepObject.storeValue.substring(0, this.stepObject.MaxSize);
            }
          }
        } catch (error) {
          console.log(error);
        }
        this.stepObject = this.cbpService.setDefaultColor(this.stepObject, this.cbpService.documentInfo);
        this.stepObject = this.executionService.setColorForKeyDown(type, event, this.stepObject);
        this.resetConfig();
        this.executionService.selectedField({ stepItem: this.obj, stepObject: this.stepObject, showMenuText: true });
        this.executionService.selectedFieldEntry = this.stepObject;
        this.executionService.selectedNewEntry = this.stepObject;
        this.styleObject = this.sharedviewService.setBackgroundTransOrWhite(this.styleObject, true);
        this.isRefferenceObject(this.stepObject);
        this.editorOpenCheck();
        if (this.stepObject?.protect) {
          this.stepObject.commentsEnabled = true;
          this.executionService.setColorItem({ 'enableCommentsProtect': 'enableComments', bol: false, 'selectedField': true });
        }
        this.config = this.cbpService.setStyleEditor(this.stepObject, this.config);
        this.config = JSON.parse(JSON.stringify(this.config));
        this.stepObject = this.executionService.setFormatStyle(this.stepObject);
        if (this.executionService.formatPainterEnable) {
          this.executionService.selectedField({ stepItem: this.obj, stepObject: this.stepObject, showMenuText: true });
        }
        this.cdr.detectChanges();
      }
    }
  }
  editorOpenCheck() {
    if (this.stepObject.dgUniqueID === this.executionService.selectedNewEntry?.dgUniqueID) {
      if (!this.stepObject.innerHtmlView) {
        this.stepObject.innerHtmlView = this.executionService.referenceObjectEditMode;
      }
      if (!this.stepObject.editorOpened) {
        this.stepObject.editorOpened = this.executionService.referenceObjectEditMode;
      }
      if (!this.stepObject.isEditMode) {
        this.stepObject.isEditMode = this.executionService.referenceObjectEditMode;
      }
      if (!this.stepObject.isReferenceObject) {
        this.stepObject.editorOpened = true;
      }
    } else {
      this.stepObject.editorOpened = false;
      this.stepObject.isEditMode = false;
    }
  }
  isRefferenceObject(stepObject: any) {
    this.removeEmptyHtmlTags(stepObject);
    stepObject['isReferenceObject'] = stepObject.storeValue.includes('reference_object_code');
  }
  removeEmptyHtmlTags(stepObject: any) {
    // stepObject.storeValue=stepObject.storeValue.replace(/<[\S]+><\/[\S]+>/gim, "");
  }
  setRefEditMode() {
    this.stepObject['isEditMode'] = true;
    this.stepObject.editorOpened = true;
  }
  closePopup() {
    this.stepObject.commentsEnabled = false;
    this.cdr.detectChanges();
  }
  pasteData() {
    this.pasteDataJson.emit();
  }

  checkElement(event: any) {
    this.executionService.setFieldVal(this.stepObject);
    if (event !== 'click' && !this.cbpService.selectCellEnabled)
      this.focusEvent.emit({ step: this.stepObject, event: event });
  }

  ngOnDestroy(): void {
    this.styleModel_subscription?.unsubscribe();
    this.color_subscription?.unsubscribe();
    this.style_subscription?.unsubscribe();
    this.link_subscription?.unsubscribe();
  }

  storeItemOfEnter(stepObject: any, value: any) {
    stepObject.oldValue = stepObject?.oldValue ? stepObject.oldValue : '';
    if (value !== stepObject.oldValue && !stepObject?.disableField) {
      let dataInfoObj = this.sharedviewService.storeDataObj(stepObject, value);
      if (Object.keys(dataInfoObj?.styleSet).length === 0) {
        dataInfoObj.styleSet['fontcolor'] = stepObject.color;
      }
      const dataObjLength = JSON.parse(JSON.stringify(this.cbpService?.dataJson?.dataObjects?.length));
      this.cbpService.dataJsonStoreChange(dataInfoObj, stepObject);
       if (dataObjLength != this.cbpService?.dataJson?.dataObjects?.length) {
        stepObject['oldValue'] = value;
      }
      this.datashareService.changeCount++;
    }
  }
  setDerviedRule() {
    if (this.stepObject.valueType == 'Derived') {
      if (this.cbpService.isDgUniqueIdPresentInAntlr(this.stepObject.ParsedValue, this.antlrService.callBackObject)) {
        let storeData = this.antlrService.executeExpression(this.stepObject.ParsedValue);
        if (Array.isArray(storeData)) {
          this.stepObject.storeValue = storeData ? this.cbpService.isValidNumber(storeData[storeData?.length - 1]) ? this.cbpService.roundOffValue(storeData[storeData?.length - 1], null, this.stepObject.dgType) : storeData[storeData?.length - 1] : '';
          this.stepObject.storeValue = this.stepObject.storeValue.toString();
          if (this.stepObject.storeValue == '<<DG_EMPTY>>') { this.stepObject.storeValue = ''; }
        } else {
          storeData = this.cbpService.isValidNumber(storeData) ? this.cbpService.roundOffValue(storeData, null, this.stepObject.dgType) : storeData;
          this.stepObject.storeValue = storeData ? storeData : '';
        }
        this.checkValidation(this.obj, this.stepObject, this.stepObject.storeValue);
      }
    }
  }
  getDropdownStyles() {
    return {
      'color': this.stepObject?.styleSet?.fontcolor || '#000000',
      'font-family': this.stepObject?.styleSet?.fontfamily || 'Poppins',
      'font-size': this.stepObject?.styleSet?.fontsize ? this.stepObject.styleSet.fontsize : '12px'
    };
  }
}
