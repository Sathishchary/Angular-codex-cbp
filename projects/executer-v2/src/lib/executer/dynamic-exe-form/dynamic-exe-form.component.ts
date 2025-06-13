import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { CbpExeService } from '../services/cbpexe.service';
import { DataJsonService } from '../services/datajson.service';
import { ExecutionService } from '../services/execution.service';
import { SharedviewService } from '../services/sharedview.service';
import { AntlrService } from '../shared/services/antlr.service';
import { TableService } from '../shared/services/table.service';
/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */

@Component({
  selector: 'app-dynamic-exe-form',
  templateUrl: './dynamic-exe-form.component.html',
  styleUrls: ['./dynamic-exe-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicExeFormComponent implements DoCheck, OnInit {

  @Input() stepObject!: any;
  @Input() obj!: any;
  @Input() tableStep!: any;
  @Input() usageType!: any;
  @Input() isDetailTabEnabled!: any;
  @Input() menuConfig!: any;
  @Input() headerwidth: any;
  @Input() isCoverPage!: any;
  @Input() annotateJson: any;

  @Output() dynamicFormAlertEvent: EventEmitter<any> = new EventEmitter();
  @Output() dynamicFormValidationEvent: EventEmitter<any> = new EventEmitter();
  @Output() dynamicFormRefEvent: EventEmitter<any> = new EventEmitter();
  @Output() dynamicVerificationOpen: EventEmitter<any> = new EventEmitter();
  @Output() setEntryDataJson: EventEmitter<any> = new EventEmitter();
  @Output() parentNotifyError: EventEmitter<any> = new EventEmitter();
  @Output() isHeaderFooterTable: EventEmitter<any> = new EventEmitter();
  @Output() refObj: EventEmitter<any> = new EventEmitter();
  @Output() deleteSingleMedia: EventEmitter<any> = new EventEmitter();
  @Output() updateFiles: EventEmitter<any> = new EventEmitter();
  @Output() pasteDataJson: EventEmitter<any> = new EventEmitter();
  @Output() focusEvent: EventEmitter<any> = new EventEmitter();
  @Output() deleteImageEvent: EventEmitter<any> = new EventEmitter();
  @Output() tableEvent: EventEmitter<any> = new EventEmitter<any>();

  dgType = DgTypes;
  dataJson_subscription!: Subscription;

  constructor(public cbpService: CbpExeService, public executionService: ExecutionService,
    public tableService: TableService, private antlrService: AntlrService,
    public sharedviewService: SharedviewService, private cdref: ChangeDetectorRef,
    public dataJsonService: DataJsonService) {
  }

  ngDoCheck(): void {
    if (this.cbpService?.selectedElement === undefined) { this.cbpService.selectedElement = this.cbpService?.defaultSection; }
    if (this.sharedviewService.detectAll ||
      (this.sharedviewService.isViewUpdated && this.obj.dgUniqueID === this.cbpService?.selectedElement['dgUniqueID'])) {
      this.cdref.detectChanges();
      setTimeout(() => {
        this.sharedviewService.isViewUpdated = false;
        this.sharedviewService.detectAll = false;
      }, 1);
    }
  }

  ngOnInit() {
    // if (this.executionService.messageCondition(this.stepObject)) {
    //   if(!this.obj['options']['notApplicable']){
    //     this.stepObject['notApplicable'] = false;
    //     this.stepObject = this.sharedviewService.setMessageValues(this.stepObject, []);
    //   }
    // }
  }
  setImageCaption(objects: any, stepObject: any) {
    let updateFigures = objects.filter((item: any) => item.dgType === 'UpdateFigure');
    for (let i = 0; i < stepObject.images?.length; i++) {
      let selectedFile = updateFigures.filter((file: any) => file.name === stepObject.images[i].name);
      if (selectedFile?.length > 0)
        stepObject.images[i].caption = selectedFile[selectedFile.length - 1].caption;
    }
    return stepObject;
  }
  checkDuplicateUserExecution(dataObject: any) {
    if (this.menuConfig.isPreProcessorEnabled) {
      if (dataObject.length > 0 && this.sharedviewService.containsDuplicates(dataObject)) {
        this.dataJsonService.errorMessage = true;
      }
    }
  }
  setObjectValue(valueObj: any, defaultValue: any, stepObj: any) {
    if (valueObj && valueObj.length > 0) {
      this.antlrService.callBackObject.initExecution(stepObj.dgUniqueID, valueObj[valueObj.length - 1].value);
    }
    return valueObj && valueObj.length > 0 ? valueObj[valueObj.length - 1].value : defaultValue;
  }

  setOldObjectValue(valueObj: any, defaultValue: any, stepObj: any) {
    if (valueObj && valueObj.length > 0) {
      defaultValue = valueObj.length > 1 ? valueObj[valueObj.length - 2].value : valueObj[valueObj.length - 1].value;
    }
    return defaultValue;
  }
  setProtectOldObjectValue(valueObj: any, defaultValue: any, stepObj: any) {
    if (valueObj && valueObj.length > 0) {
      defaultValue = valueObj.length > 1 ? valueObj[valueObj.length - 2]?.oldValue : valueObj[valueObj.length - 1].value;
    }
    return defaultValue;
  }
  checkValidation(eventObj: any, mainObj: any, eventValue: any) {
    this.dynamicFormValidationEvent.emit({ event: eventObj, stepObj: mainObj, value: eventValue });
  }
  selectCell() {
    this.tableEvent.emit();
  }
  alertViewOutput(event: any) {
    this.dynamicFormAlertEvent.emit(event);
  }
  openReferenceInLinkTab(event: any) {
    this.dynamicFormRefEvent.emit(event);
  }
  openVerification(obj: any) {
    this.dynamicVerificationOpen.emit(obj);
  }
  dataEntryJsonEvent(event: any) {
    this.setEntryDataJson.emit(event);
  }

  tableHeaderEmit() {
    this.isHeaderFooterTable.emit();
  }
  deleteSingle(stepObj: any) {
    this.deleteSingleMedia.emit({ step: this.stepObject, mediaObj: stepObj });
  }
  deleteImage(event: any) {
    this.deleteImageEvent.emit(event);
  }
  updateFilesEvent(files: any) {
    this.updateFiles.emit(files);
  }
  pasteDataJsonEvent() {

  }

  focusEventCheck(event: any) {
    this.focusEvent.emit(event);
  }
  ngOnDestroy() {
    this.dataJson_subscription?.unsubscribe();
  }

}
