import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { CbpExeService } from '../../../services/cbpexe.service';
import { ExecutionService } from '../../../services/execution.service';
import { SharedviewService } from '../../../services/sharedview.service';
import { TableService } from '../../../shared/services/table.service';
/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */

@Component({
  selector: 'app-table-dataentry-form',
  templateUrl: '../../../dynamic-exe-form/dynamic-exe-form.component.html',
  styleUrls: ['../../../dynamic-exe-form/dynamic-exe-form.component.css']
})
export class TableDataEntryComponent implements OnInit {

  @Input() stepObject!: any;
  @Input() obj!: any;
  @Input() tableStep!: any;
  @Input() usageType!: any;
  @Input() isDetailTabEnabled!: any;
  @Input() isCoverPage!: any;
  @Input() headerwidth: any;
  @Output() dynamicFormAlertEvent: EventEmitter<any> = new EventEmitter();
  @Output() dynamicFormValidationEvent: EventEmitter<any> = new EventEmitter();
  @Output() dynamicFormRefEvent: EventEmitter<any> = new EventEmitter();
  @Output() dynamicVerificationOpen: EventEmitter<any> = new EventEmitter();
  @Output() isHeaderFooterTable: EventEmitter<any> = new EventEmitter();
  @Output() focusEvent: EventEmitter<any> = new EventEmitter();
  @Output() protectAllFields: EventEmitter<any> = new EventEmitter();
  @Output() deleteImageEvent: EventEmitter<any> = new EventEmitter();
  @Output() deleteSingleMedia: EventEmitter<any> = new EventEmitter();
  @Output() updateFiles: EventEmitter<any> = new EventEmitter();

  dgType = DgTypes;
  @Output() setEntryDataJson: EventEmitter<any> = new EventEmitter();
  @Output() pasteDataJson: EventEmitter<any> = new EventEmitter();
  @Output() tableEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(public cbpService: CbpExeService, public executionService: ExecutionService,
    public tableService: TableService,
    public sharedviewService: SharedviewService) {
  }
  ngOnInit() {
    if (this.tableStep) { this.stepObject['isTableDataEntry'] = true; }
    if (this.cbpService.maxDgUniqueId < Number(this.stepObject?.dgUniqueID)) {
      this.cbpService.maxDgUniqueId = Number(this.stepObject?.dgUniqueID);
    }
  }
  checkValidation(eventObj: any, mainObj: any, eventValue: any) {
    this.dynamicFormValidationEvent.emit({ event: eventObj, stepObj: mainObj, value: eventValue });
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
    this.pasteDataJson.emit();
  }
  tableHeaderEmit() {
    this.isHeaderFooterTable.emit();
  }
  focusEventCheck(event: any) {
    this.focusEvent.emit(event);
  }
  protectFields() {
    this.protectAllFields.emit();
  }
  selectCell() {
    this.tableEvent.emit();
  }
}
