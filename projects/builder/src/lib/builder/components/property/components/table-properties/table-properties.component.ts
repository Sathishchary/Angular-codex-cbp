import { ChangeDetectorRef, Component, EventEmitter, Input, isDevMode, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DgTypes, LinkTypes } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { Actions, Audit, AuditTypes } from '../../../../models';
import { AuditService } from '../../../../services/audit.service';
import { BuilderService } from '../../../../services/builder.service';
import { CbpService } from '../../../../services/cbp.service';
import { ControlService } from '../../../../services/control.service';
import { DataSharingService } from '../../../../services/data-sharing.service';
import { TableService } from '../../../../shared/services/table.service';
import { BuilderUtil } from '../../../../util/builder-util';
import { DateEditorPopupComponent } from '../../../date-popup/date-popup.component';
const findAnd = require('find-and');

@Component({
  selector: 'lib-table-properties',
  templateUrl: './table-properties.component.html',
  styleUrls: ['./table-properties.component.css']
})
export class TablePropertiesComponent implements OnInit, OnChanges {
  dgType = DgTypes;
  AuditTypes: typeof AuditTypes = AuditTypes;
  typetextarraList = [{ type: DgTypes.TextDataEntry, display: 'Text' }, { type: DgTypes.TextAreaDataEntry, display: 'TextArea' }, { type: DgTypes.NumericDataEntry, display: 'Numeric' }]
  showDateOnCondition = true;
  @Input() selectedElement: any;
  @Input() tempsectionnumbers: any;
  @Input() isCoverPage: any;
  imgpropertiessubscription!: Subscription;
  setDataEntrySubscription!: Subscription;
  @Output() checkNameExistEvent: EventEmitter<any> = new EventEmitter<any>();
  sourceList = [LinkTypes.Local, LinkTypes.Attach, LinkTypes.URL, LinkTypes.eDocument];
  currentDate = new Date();
  maxdate = new Date();
  modalOptions: NgbModalOptions = {
    backdrop: 'static',
    backdropClass: 'customBackdrop',
    size: 'md'
  }
  isDevEnable = false;
  coverPageDgUniqueId: any;
  isTableRowMaxExceeded: any = false;
  selectedStepnumber: any;
  constructor(private propertyaChangeService: DataSharingService, private modalService: NgbModal,
    public tableService: TableService, private _buildUtil: BuilderUtil, public cdref: ChangeDetectorRef,
    private controlService: ControlService, public auditService: AuditService,
    public cbpService: CbpService, public builderService: BuilderService) {
    this.isDevEnable = isDevMode();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedElement && this.selectedElement) {
      this.selectedElement = changes.selectedElement.currentValue;
      if (this.cbpService.tableDataEntrySelected?.dgType === DgTypes.Link) {
        this.selectedStepnumber = this.cbpService.tableDataEntrySelected?.sectionNumber ?? '';
      }
      if (this.cbpService.selectedElement?.dgType === DgTypes.Link) {
        this.selectedStepnumber = this.cbpService.selectedElement?.sectionNumber ?? '';
      }
    }
    if (changes.tempsectionnumbers && this.tempsectionnumbers) {
      this.tempsectionnumbers = changes.tempsectionnumbers.currentValue;
    }
  }

  ngOnInit(): void {
    this.imgpropertiessubscription = this.propertyaChangeService.imageproperties_reso.subscribe(
      (res) => { if (res !== '' && res !== undefined) { this.cbpService.fileproperties = res; } });
    this.coverPageDgUniqueId = this.selectedElement.calstable[0].dgUniqueID;

    this.setDataEntrySubscription = this.tableService.selectedDataEntry.subscribe((result: any) => {
      if (result && result !== undefined && !this.controlService.isEmpty(result)) {
        // result.notesPromptDispaly = result.notesPromptDispaly ?? true;
        this.cbpService.tableDataEntrySelected = result;
        this.cdref.detectChanges();
      }
    });
  }
  checkTableNameExistOrnot() {
    if (!this.tableService.checkTableNameExistOrnot()) {
      this.createAuditEntry(AuditTypes.TABLE_NAME, { propName: 'tableName' });
    }
  }

  createAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    let item = this.cbpService.selectedElement;
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, item, Actions.Update, auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(item));
  }
  updateViewTrack() {
    this.cbpService.setViewUpdateTrack();
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }
  onFocusEvent() {
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }

  tablefieldNameExistOrNot() {
    let isExist = false;
    let stepNumber;
    const res = this.cbpService.fieldsMaps.get(this.cbpService.tableDataEntrySelected.dgUniqueID);
    if (this.cbpService.tableDataEntrySelected.fieldName === res) {
    } else {
      for (const [key, value] of this.cbpService.fieldsMaps) {
        if (value === this.cbpService.tableDataEntrySelected.fieldName) {
          stepNumber = this._buildUtil.getElementByDgUniqueID(key, this.cbpService.cbpJson.section);
          isExist = true;
        }
      }
      if (isExist && this.cbpService.tableDataEntrySelected.fieldName) {
        this.showErrorMsg(DgTypes.ErrorMsg, 'Table Data Field already exist at Step' + stepNumber.parentID);
        this.cbpService.tableDataEntrySelected.fieldName = res;
        return;
      } else {
        this.cbpService.fieldsMaps.set(this.cbpService.tableDataEntrySelected.dgUniqueID, this.cbpService.tableDataEntrySelected.fieldName);
      }
    }
  }

  showErrorMsg(dgType: any, dgTypeMsg: any) {
    this.setErrorMesg(dgTypeMsg, dgType, true)
  }

  setErrorMesg(mesg: string, type: any, popup: boolean) {
    this.cbpService.displayMsg = mesg;
    this.cbpService.errorDgType = type;
    this.cbpService.showErrorPopup = popup;
  }
  onFocusEventTable() {
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.tableDataEntrySelected));
    this.cbpService.isViewUpdated = true;
    this.cbpService.detectWholePage = true;
  }
  updateLink() {
    this.updateLinkRequired();
    this.cbpService.isViewUpdated = true;
  }
  checkMaxValue(val: any) {
    if (val.maximum != null && val.minimum != null) {
      const max = parseInt(val.maximum);
      const min = parseInt(val.minimum);
      const defaultValue = parseInt(val.defaultValue);

      if (max < min) {
        this.showErrorMsg(DgTypes.ErrorMsg, 'Max value should be greater than Min');
        this.cbpService.tableDataEntrySelected.maximum = null;
        this.cbpService.tableDataEntrySelected.minimum = null;
      }
      if (defaultValue != null) {
        if (defaultValue < min) {
          this.showErrorMsg(DgTypes.ErrorMsg, 'Default Value should be greater than or equal to minimum');
          this.cbpService.tableDataEntrySelected.defaultValue = null;
        }
        if (defaultValue > max) {
          this.showErrorMsg(DgTypes.ErrorMsg, 'Default Value should be less than or equal to maximum');
          this.cbpService.tableDataEntrySelected.defaultValue = null;
        }
      }
    }
  }

  checkUnit(v: string) {
    if (v != '') {
      this.selectUnitValue(false);
    } else {
      this.selectUnitValue(true);
    }
  }

  selectUnitValue(event: boolean) {
    if (event) {
      this.cbpService.numericUnit.push(this.selectedElement.dgUniqueID);
      if (this.cbpService.numericUnit.length > 0) {
        this.cbpService.numericUnit = this.removeDuplicates(this.cbpService.numericUnit);
      }
    }
    else {
      let id = this.cbpService.numericUnit.findIndex(l => l === this.selectedElement.dgUniqueID)
      if (id != -1)
        this.cbpService.numericUnit.splice(id, 1);
    }
  }
  removeDuplicates(arr: any) {
    return arr.filter((item: any, index: number) => arr.indexOf(item) === index);
  }

  showDate() {
    this.showDateOnCondition = false;
    setTimeout(() => { this.showDateOnCondition = true; }, 10);
    this.updateLinkRequired();
  }
  tablePropertyCreateAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.tableDataEntrySelected, Actions.Update, auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.tableDataEntrySelected));
    this.cbpService.isViewUpdated = true;
    this.cbpService.detectWholePage = true;
  }
  valueTypeRequired(value: any) {
    if (value === 'Derived') {
      if (this.cbpService.tableDataEntrySelected) {
        this.cbpService.tableDataEntrySelected.required = false;
      } else {
        this.cbpService.selectedElement.required = false;
      }
    }
    this.cbpService.isViewUpdated = true;
    this.cbpService.detectWholePage = true;
  }
  decimalValid(value: any) {
    if (!value.decimal) {
      value.defaultValue = Math.floor(value.defaultValue);
    }
  }
  changeTableEntryType(type: any, audit?: Audit) {
    this.cbpService.tableDataEntrySelected.dgType = type;
    if (this.cbpService.tableDataEntrySelected !== undefined) {
      if (this.cbpService.tableDataEntrySelected.parentID || this.cbpService.tableDataEntrySelected.dgType === DgTypes.TextDataEntry || this.cbpService.tableDataEntrySelected.dgType === DgTypes.TextAreaDataEntry || this.cbpService.tableDataEntrySelected.dgType === DgTypes.NumericDataEntry) {
        const element = this._buildUtil.getElementByNumber(this.cbpService.tableDataEntrySelected.parentID, this.cbpService.cbpJson.section);
        if (element?.dgType === DgTypes.StepAction || element?.dgType === DgTypes.Section) {
          this.dataTableEntrySturcture(audit)
        }
      }
    }
  }
  setCheckBoxSide(type: any) {
    this.cbpService.tableDataEntrySelected.checkboxSide = type;
    this.updateLinkRequired();

  }
  updateCheckBox(type: any, isTable: any) {
    if (isTable) {
      this.cbpService.tableDataEntrySelected.selected = (type == 'Selected') ? true : false;
      this.tablePropertyCreateAuditEntry(AuditTypes.PROPERTY_TABLE_CHECK_VALUE, { propName: 'valueType' });
    } else {
      this.cbpService.selectedElement.selected = (type == 'Selected') ? true : false;
      this.createAuditEntry(AuditTypes.PROPERTY_CHECK_VALUE, { propName: 'valueType' });
    }
    this.updateLink();
  }
  dataTableEntrySturcture(audit: Audit | undefined) {
    this.EntryTableReuseCode();
    if (this.cbpService.tableDataEntrySelected.dgType === DgTypes.NumericDataEntry) {
      this.cbpService.tableDataEntrySelected.dgType = DgTypes.NumericDataEntry;
      this.updateLinkRequired();
      this.cbpService.tableDataEntrySelected.fieldName = DgTypes.NumericDataEntry + (++this.cbpService.dataFieldNumber);
    }
    else if (this.cbpService.tableDataEntrySelected.dgType === DgTypes.TextAreaDataEntry) {
      this.cbpService.tableDataEntrySelected.dgType = DgTypes.TextAreaDataEntry;
      this.updateLinkRequired();
      this.cbpService.tableDataEntrySelected.fieldName = DgTypes.TextAreaDataEntry + (++this.cbpService.dataFieldNumber);
      if (audit !== undefined) {
        this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(this.cbpService.tableDataEntrySelected.parentDgUniqId, this.cbpService.cbpJson.section);
        this.cbpService.selectedUniqueId = audit.DgUniqueID;
      }
    }
    else if (this.cbpService.tableDataEntrySelected.dgType === DgTypes.TextDataEntry) {
      this.cbpService.tableDataEntrySelected.dgType = DgTypes.TextDataEntry;
      this.updateLinkRequired()
      this.cbpService.tableDataEntrySelected.fieldName = DgTypes.TextDataEntry + (++this.cbpService.dataFieldNumber);
      this.cbpService.tableDataEntrySelected.valueType = 'Entered';
      if (audit !== undefined) {
        this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(this.cbpService.tableDataEntrySelected.parentDgUniqId, this.cbpService.cbpJson.section);
        this.cbpService.selectedUniqueId = audit.DgUniqueID;
      }
    }
  }
  unitValue(val: any) {
    if (val.unitsRequired === true && !val.units) {
      this.updateLink();
      this.showErrorMsg(DgTypes.ErrorMsg, 'Please Enter Unit value');
      this.selectUnitValue(true);
      return false;
    }
    else {
      this.selectUnitValue(false);
    }
  }
  updateLinkRequired() {
    this.updateViewTrack();
    // this.cbpService.isViewUpdated = true;
    // this.cbpService.selectedElement = this._buildUtil.getElementByDgUniqueID(this.cbpService.tableDataEntrySelected.parentDgUniqId, this.cbpService.cbpJson.section);
    // this.controlService.setSelectItem(this.cbpService.selectedElement);
  }
  checkBoxTableAudit(event: any, auditType: AuditTypes, optionalParams: any = {}) {
    if (event?.event) { event = event?.event; }
    // this.cbpService.tableDataEntrySelected[optionalParams.propName] = event.target.checked;
    this.updateLinkRequired();
    this.tablePropertyCreateAuditEntry(auditType, optionalParams);
    this.cbpService.isViewUpdated = true;
    this.cbpService.detectWholePage = true;
  }
  EntryTableReuseCode() {
    if (this.cbpService.tableDataEntrySelected.dgType === DgTypes.TextAreaDataEntry) {
      delete this.cbpService.tableDataEntrySelected.valueType;
      delete this.cbpService.tableDataEntrySelected.fieldName;
    }
    else if (this.cbpService.tableDataEntrySelected.dgType === DgTypes.NumericDataEntry) {
      delete this.cbpService.tableDataEntrySelected.fieldName;
    }
  }
  updateImageView(image: any) {
    this.propertyaChangeService.changeImageProperties(image);
    this.updateViewTrack();
    this.cbpService.isViewUpdated = true;
  }
  updateVerify(event: any) {
    this.cbpService.fileproperties['align'] = event;
    this.updateImageView(this.cbpService.fileproperties);
    this.cbpService.isViewUpdated = true;
  }
  checkMaxDate(val: any) {
    if (val.isTimeDisplayOpen === true || val.isDateDisplayOpen === true) {
      const minDate = val.minimum;
      const maxDate = val.maximum;
      if (val.maximum === '' || val.minimum === '') {
        this.showDateOnCondition = false;
        setTimeout(() => { this.showDateOnCondition = true; }, 10);
        return;
      } else {
        if (val.minimum !== '') {
          this.createAuditEntry(AuditTypes.PROPERTY_MIN, { propName: 'minimum' });

        }
        else if (val.maximum !== '') {
          if (minDate > maxDate) {
            this.showErrorMsg(DgTypes.ErrorMsg, 'Max date should be greater than Min date');
            this.createAuditEntry(AuditTypes.PROPERTY_MAX, { propName: 'maximum' })
            return;
          }
        }
      }
    }

  }
  keyPressEvent(event: any) {
    if (Number(event?.target?.value) < 0) {
      event.target.value = 0;
    }
  }
  sectionId(item: any) {
    // this.selectedLinkItem = item;
    const selected = this.tempsectionnumbers.filter((it: any) => it.number === item);
    const element = findAnd.returnFound(this.cbpService.cbpJson.section, { dgUniqueID: this.cbpService.tableDataEntrySelected.dgUniqueID });
    if (element) {
      this.cbpService.tableDataEntrySelected.sectiondgUniqueId = selected[0].dgUniqueID;
      this.cbpService.tableDataEntrySelected.sectionNumber = item;
      element.sectiondgUniqueId = selected[0].dgUniqueID;
      element.sectionNumber = item;
    }

  }
  checkNameExistOrnot() {
    this.checkNameExistEvent.emit();
  }
  changeUI(evnt: any) {

  }
  onNewFileSelected(event: any) {
    let files: any = (event.target as HTMLInputElement)?.files;
    if (files?.length > 0) {
      this.cbpService.attachment.push(files[0]);
      this.cbpService.tableDataEntrySelected.uri = files[0].name;
      this.updateViewTrack();
      this.createAuditEntry(AuditTypes.AUDIT_DEFAULT, { propName: 'uri' });
    } else {
      // console.log('No Media Found');
    }
  }
  openDate(type: string) {
    const modalRef = this.modalService.open(DateEditorPopupComponent, this.modalOptions);
    modalRef.componentInstance.stepObject = this.cbpService.tableDataEntrySelected;
    modalRef.componentInstance.dateFormat = this.cbpService.getDateValue(this.cbpService.cbpJson.documentInfo[0].dateFormat);
    modalRef.componentInstance.closeEvent.subscribe((receivedEntry: any) => {
      if (receivedEntry !== false) {
        this.cbpService.tableDataEntrySelected[type] = receivedEntry;
      }
      let item: any;
      let isMinHigh = this.cbpService.tableDataEntrySelected?.minimum > this.cbpService.tableDataEntrySelected?.maximum ? true : false;
      if (type === 'minimum' && isMinHigh) {
        this.cbpService.tableDataEntrySelected.maximum = '';
        item = AuditTypes.PROPERTY_MIN;
      } else {
        item = AuditTypes.PROPERTY_MAX;
      }
      this.onFocusEvent();
      this.createAuditEntry(item, { propName: type });
      modalRef.close();
    });
  }
  keyDownEvent(event: any) {
    if (event.keyCode >= 46 && event.keyCode <= 57) {
      let totalRows: any = this.cbpService.selectedElement?.calstable[0]?.table.tgroup.tbody[0]?.row.length;
      if (this.cbpService.selectedElement['rowsCount'] > totalRows) {
        this.isTableRowMaxExceeded = true;
        this.cbpService.selectedElement['rowsCount'] = 0;
        setTimeout(() => {
          this.isTableRowMaxExceeded = false;
        }, 1000);
      }
    } else {
      return false;
    }
  }
  ngOnDestroy() {
    this.imgpropertiessubscription.unsubscribe();
    this.setDataEntrySubscription.unsubscribe();
  }
  tableNotes(event: any): void {
    this.cbpService.tableDataEntrySelected.notesPromptDispaly = event;
    this.cbpService.isViewUpdated = true;
    this.cdref.detectChanges();
  }
}
