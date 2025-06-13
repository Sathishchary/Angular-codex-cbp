import { formatDate } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  OnInit,
  Output
} from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DgTypes } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { CbpExeService } from '../../services/cbpexe.service';
import { DataJsonService } from '../../services/datajson.service';
import { DatashareService } from '../../services/datashare.service';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';
import { DatePopupComponent } from '../date-popup/date-popup.component';
declare const $: any;

@Component({
  selector: 'app-date-view',
  templateUrl: './date-view.component.html',
  styleUrls: ['./date-view.component.css']
})
export class DateViewComponent implements OnInit, AfterViewInit {
  @Input() stepObject: any;
  @Input() obj: any;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  dgType = DgTypes;
  styleModel_subscription!: Subscription;
  placeHolderSub!: Subscription;
  styleObject: any;
  modalOptions: NgbModalOptions;
  libDatePlaceholder!: any;
  documentInfo!: any;
  title = '';
  dateFormat: any;
  propertyType!: string;
  style_subscription!: Subscription;
  oldDateValue: any;
  constructor(public cbpService: CbpExeService, public sharedviewService: SharedviewService, public cdr: ChangeDetectorRef,
    public executionService: ExecutionService, @Inject(LOCALE_ID) public locale: string,
    private dataJsonService: DataJsonService, private modalService: NgbModal,
    public datashareService: DatashareService) {
    this.modalOptions = this.dataJsonService.modalOptions;
    this.modalOptions.size = 'md';
  }
  ngOnInit(): void {
    if (this.stepObject?.isTableDataEntry) {
      this.cbpService.storeTempMapID(this.stepObject['fieldName'], this.stepObject);
    }
    if (this.stepObject?.coverType) {
      this.propertyType = this.stepObject['property'];
      this.stepObject[this.stepObject['property']] = this.stepObject[this.stepObject['property']] ? this.stepObject[this.stepObject['property']] : "";
      this.stepObject['isDateDisplayOpen'] = true;
      this.stepObject['isTimeDisplayOpen'] = false;
      if (this.stepObject?.dgType == "DateDataEntry") {
        this.propertyType = 'storeValue';
      }
      if(this.stepObject.dgUniqueID){
        let attList =  this.cbpService.dataJson.dataObjects.filter((item:any)=>item.dgUniqueID == this.stepObject.dgUniqueID)
        if(attList.length){
          attList.forEach((item:any)=>{
          if(item.dgUniqueID==this.stepObject.dgUniqueID){
          this.stepObject[this.stepObject['property']] = item.value
            }
          })

          //  this.propertyType =attList[0].value
        }
      }
    } else {
      this.propertyType = 'storeValue';
    }
    this.placeHolderSub = this.dataJsonService.datePlaceholderValue.subscribe((res: any) => {
      if (res && !this.executionService.isEmpty(res)) {
        this.documentInfo = res;
        if (res.dateFormat == null) {
          res['formatPlaceHolder'] = "dd/mm/yyyy";
          res.dateFormat = "dd/mm/yyyy";
        }
        this.libDatePlaceholder = this.stepObject?.isDateDisplayOpen && !this.stepObject.isTimeDisplayOpen ?
          res['formatPlaceHolder'] : !this.stepObject?.isDateDisplayOpen && this.stepObject.isTimeDisplayOpen ? 'HH:MM' :
            res['formatPlaceHolder'] + ' HH:MM'
        this.cdr.detectChanges();
      }
    });
    this.style_subscription = this.executionService.styleViewUpdateView.subscribe((res: any) => {
      if (res && res != '{}' && !this.executionService.isEmpty(res) && (this.stepObject?.storeValue == '' || !('storeValue' in this.stepObject))) {
        this.stepObject['innerHtmlView'] = true;
        if (!this.stepObject['styleSet']) { this.stepObject['styleSet'] = {}; }
        if (res?.type == 'fontfamily') {
          this.stepObject['styleSet']['fontfamily'] = res?.fontfamily;
        }
        if (res?.type == 'fontsize') {
          this.stepObject['styleSet']['fontsize'] = res?.fontsize;
        }
        if (res?.type == 'size&family') {
          this.stepObject['styleSet']['fontfamily'] = res?.fontfamily;
          this.stepObject['styleSet']['fontsize'] = res?.fontsize;
        }
        this.cdr.detectChanges();
      }
    });
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
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.stepObject.storeValue = this.stepObject.storeValue ?? '';
    this.styleModel_subscription = this.executionService.styleModelobjValue.subscribe((res: any) => {
      if (res && res != '{}' && !this.executionService.isEmpty(res)) {
        this.styleObject = this.sharedviewService.setStyles(res['levelNormal']);
        this.styleObject = this.sharedviewService.setBackgroundTrans(this.styleObject);
        // if (!this.stepObject?.styleSet) { this.stepObject['styleSet'] = {}; }
        // this.stepObject.styleSet['fontsize'] = this.styleObject['font-size'];
        // this.stepObject.styleSet['fontfamily'] = this.styleObject['font-family'];
        this.cdr.detectChanges();
      }
    });
    if (this.stepObject?.storeValue) {
      this.title = this.cbpService.removeHTMLTags(this.stepObject.storeValue);
    }
  }

  checkValidation(eventV: any, eventObj: any, eventValue: any) {
 
    if(eventObj?.attributeType){
      let dataArr = this.cbpService.documentInfo?.coverPageData?.listAttributeProperty;
      //assinging table values if listAttributeProperty not contains date for old files 
      if(eventObj[eventObj["property"]]){
        if(dataArr){
          dataArr.forEach((item:any)=>{
            if(item.property != eventObj.property){
              item.property  =  eventObj.property  
              this.cbpService.documentInfo[eventObj['property']]=  eventObj.property  
            }
          })
        }
      }

      if (!dataArr) {
        dataArr = this.cbpService.documentInfo.coverPageData.listAttributeProperty = [];
      }
      const index = dataArr.findIndex((item: any) => item.property === eventObj.property);
      if (index === -1) {
        dataArr.push({ property: eventObj["property"], propertyValue: eventObj[eventObj["property"]] });
      } else {
        dataArr[index] = { property: eventObj["property"], propertyValue: eventObj[eventObj["property"]] };
      }
      this.cbpService.documentInfo[eventObj['property']]= eventObj[eventObj["property"]] 
      
    }
    
    if (!this.stepObject.coverType || (this.stepObject.coverType && eventObj.dgType == "DateDataEntry")) {
      this.closeEvent.emit({ event: eventV, stepObj: eventObj, value: eventValue });
      this.storeItemOfEnter(eventObj, eventValue);
    }
    if (this.stepObject.coverType) {
     // this.closeEvent.emit({ event: eventV, stepObj: eventObj, value: eventValue });
      this.storeItemOfEnter(eventObj, eventValue);
    }
  }

  setAutoPopulate(obj: any) {
    let dateFormat = this.documentInfo.dateFormat;
    dateFormat = this.sharedviewService.getDateValue(dateFormat);
    if ((obj.isTimeDisplayOpen && obj.isDateDisplayOpen)) {
      this.stepObject['isTimeDisplayOpen'] = true;
      let date = this.sharedviewService.getDateInfo(new Date());
      const mapObj: any = { m: date.month + 1, M: date.monthName, Y: date.year, j: date.day };
      let dateStore = dateFormat.replace(/\b(?:m|M|Y|j)\b/gi, (matched: any) => mapObj[matched]);
      obj.storeValue = dateStore + ' ' + date.hours + ':' + date.minutes + '' + date.ampm;
    }
    if ((!obj.isTimeDisplayOpen && obj.isDateDisplayOpen)) {
      this.stepObject['isTimeDisplayOpen'] = false;
      let date = this.sharedviewService.getDateInfo(new Date());
      let month = date.month + 1;
      let monthItem = month < 10 ? '0' + month : month;
      const mapObj: any = { m: monthItem, M: date.monthName, Y: date.year, j: date.day };
      obj.storeValue = dateFormat.replace(/\b(?:m|M|Y|j)\b/gi, (matched: any) => mapObj[matched]);
    }
    if ((obj.isTimeDisplayOpen && !obj.isDateDisplayOpen)) {
      obj.storeValue = formatDate(new Date(), 'HH:mm', this.locale);;
    }
    this.checkValidation(this.stepObject, this.stepObject, this.stepObject.storeValue);
  }

  openDate() {
    this.cbpService.isInputClicked();
    this.executionService.selectedField({ stepItem: this.obj, stepObject: this.stepObject, showMenuText: true });
    if (!this.cbpService.selectCellEnabled && !this.executionService.formatPainterEnable) {
      const modalRef = this.modalService.open(DatePopupComponent, this.modalOptions);
      if (this.cbpService.isHTMLText(this.stepObject[this.propertyType]) && this.stepObject?.innerHtmlView) {
        this.oldDateValue = this.stepObject[this.propertyType];
      }
      modalRef.componentInstance.stepObject = this.stepObject;
      modalRef.componentInstance.dateFormat = this.documentInfo?.dateFormatNew;
      modalRef.componentInstance.execution = true;
      modalRef.componentInstance.closeEvent.subscribe((receivedEntry: any) => {
        if (receivedEntry !== false) {
          if (this.stepObject.innerHtmlView && !!this.oldDateValue) {
            receivedEntry = this.replaceDateInHtml(this.oldDateValue, this.cbpService.removeHTMLTags(this.oldDateValue), receivedEntry)
          }
          if(this.stepObject.coverType){
            this.stepObject[this.stepObject['property']] = receivedEntry;
          }else{
            this.stepObject[this.propertyType] = receivedEntry;
            this.executionService.selectedNewEntry = this.stepObject;
            if (this.executionService.selectedNewEntry) {
              this.executionService.selectedNewEntry[this.propertyType] = receivedEntry;
            }
          }
         
          this.checkValidation(this.obj, this.stepObject, this.stepObject[this.propertyType]);
          this.title = this.cbpService.removeHTMLTags(this.stepObject[this.propertyType]);
          this.cdr.detectChanges();
        } else {
          if (this.stepObject.innerHtmlView && !!this.oldDateValue) {
            this.stepObject[this.propertyType] = this.replaceDateInHtml(this.oldDateValue, this.cbpService.removeHTMLTags(this.oldDateValue), this.stepObject[this.propertyType])
            this.cdr.detectChanges();
          }
        }
        modalRef.close();
      });
    }
    if (this.executionService.formatPainterEnable) {
      this.stepObject = this.executionService.setFormatStyle(this.stepObject);
    }
  }
  replaceDateInHtml(htmlString: string, oldDate: string, newDate: string) {
    if (this.cbpService.isHTMLText(htmlString)) {
      let newText = htmlString.replace(new RegExp(oldDate, 'g'), newDate);
      return newText;
    }
    return htmlString;
  }
  ngOnDestroy(): void {
    this.styleModel_subscription?.unsubscribe();
    this.placeHolderSub?.unsubscribe();
    this.style_subscription?.unsubscribe();
  }
  storeItemOfEnter(stepObject: any, value: any) {
    stepObject.oldValue = stepObject?.oldValue ? stepObject.oldValue : '';
    if(stepObject.attributeType || stepObject.coverPageAttribute){
      let dataInfoObj = this.sharedviewService.storeAttributeObj(stepObject, value);
      this.cbpService.dataJsonStoreChange(dataInfoObj, stepObject);
    }
    if (value !== stepObject?.oldValue && !stepObject.attributeType) {
      // this.executionService.formatPainterEnable = false;
      let dataInfoObj = this.sharedviewService.storeDataObj(stepObject, value);
      this.cbpService.dataJsonStoreChange(dataInfoObj, stepObject);
      this.datashareService.changeCount++;
    }
  }
}
