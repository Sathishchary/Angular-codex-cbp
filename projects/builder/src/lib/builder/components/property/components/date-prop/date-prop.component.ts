import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DgTypes } from 'cbp-shared';
import { Actions, AuditTypes } from '../../../../models';
import { AuditService } from '../../../../services/audit.service';
import { BuilderService } from '../../../../services/builder.service';
import { CbpService } from '../../../../services/cbp.service';
import { ControlService } from '../../../../services/control.service';
import { BuilderUtil } from '../../../../util/builder-util';
import { DateEditorPopupComponent } from '../../../date-popup/date-popup.component';

@Component({
  selector: 'lib-date-prop',
  templateUrl: './date-prop.component.html',
  styleUrls: ['./date-prop.component.css']
})
export class DatePropComponent implements OnInit, OnChanges {
  currentDate = new Date();
  dgType = DgTypes;
  AuditTypes: typeof AuditTypes = AuditTypes;
  maxdate = new Date();
  @Input() selectedElement: any;
  modalOptions: NgbModalOptions = {
    backdrop: 'static',
    backdropClass: 'customBackdrop',
    size: 'md'
  }
  dateFieldItem: any;


  constructor(private _buildUtil: BuilderUtil, private controlService: ControlService,
    public auditService: AuditService, public cbpService: CbpService, private modalService: NgbModal,
    public builderService: BuilderService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedElement && this.selectedElement)
      this.selectedElement = changes.selectedElement.currentValue;
  }
  ngOnInit(): void {
  }

  onFocusEvent() {
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }
  showDateOnCondition = true;
  checkMaxDate(val: any, type: any) {
    if (val.isTimeDisplayOpen === true || val.isDateDisplayOpen === true) {
      const minDate = val.minimum;
      const maxDate = val.maximum;
      if (val.maximum === '' || val.minimum === '') {
        this.updateDate();
        return;
      } else {
        if (val.minimum !== '') {
          this.createAuditEntry(AuditTypes.PROPERTY_MIN, { propName: 'minimum' });
        }
        if (val.maximum !== '' && val.minimum !== '') {
          if (minDate > maxDate) {
            this.showErrorMsg(DgTypes.ErrorMsg, 'Max date should be greater than Min date');
            this.createAuditEntry(AuditTypes.PROPERTY_MAX, { propName: 'maximum' })
            if (type == 'maxdate')
              this.selectedElement.maximum = null;
            else
              this.selectedElement.minimum = null;
            return;
          }
        }
      }
    }
  }
  setmaxDate() {
    this.maxdate.setDate(this.maxdate.getDate() + 1);
    this.updateDate();
  }
  setOnlyTime() {
    if (!this.selectedElement.isDateDisplayOpen) {
      this.selectedElement.minimum = null;
      this.selectedElement.maximum = null;

    }
  }
  setOnlyDate() {
    if (!this.selectedElement.isTimeDisplayOpen) {
      this.selectedElement.minimum = null;
      this.selectedElement.maximum = null;
    }
  }

  createAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }
  checkBoxAudit(event: any, auditType: AuditTypes, optionalParams: any = {}) {
    this.setmaxDate();
    this.updateDate();
    this.cbpService.selectedElement[optionalParams.propName] = event.target.checked;
    this.createAuditEntry(auditType, optionalParams)
  }
  viewUpdateTrack() {
    this.cbpService.setViewUpdateTrack();
    // this.cbpService.selectedElement = this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }
  showErrorMsg(dgType: any, dgTypeMsg: any) {
    this.setErrorMesg(dgTypeMsg, dgType, true)
  }
  updateDate() {
    this.showDateOnCondition = false;
    setTimeout(() => { this.showDateOnCondition = true; }, 10);
  }

  setErrorMesg(mesg: string, type: any, popup: boolean) {
    this.cbpService.displayMsg = mesg;
    this.cbpService.errorDgType = type;
    this.cbpService.showErrorPopup = popup;
  }
  checkNameExistOrnot() {
    let isExist = false;
    let stepNumber;
    const res = this.cbpService.fieldsMaps.get(this.cbpService.selectedElement.dgUniqueID);
    if (this.cbpService.selectedElement.fieldName === res) {
    } else {
      for (const [key, value] of this.cbpService.fieldsMaps) {
        if (value === this.cbpService.selectedElement.fieldName) {
          stepNumber = this._buildUtil.getElementByDgUniqueID(key, this.cbpService.cbpJson.section);
          isExist = true;
        }
      }
      if (isExist && this.cbpService.selectedElement.fieldName) {
        this.showErrorMsg(DgTypes.ErrorMsg, 'Data Field already exist at Step' + stepNumber.parentID);
        return;
      } else {
        this.cbpService.selectedElement.fieldNameUpdated = true;
        this.cbpService.fieldsMaps.set(this.cbpService.selectedElement.dgUniqueID, this.cbpService.selectedElement.fieldName);
        this.createAuditEntry(AuditTypes.PROPERTY_TEXT, { propName: 'fieldName' })
      }
    }
  }

  openDate(type: string) {
    const modalRef = this.modalService.open(DateEditorPopupComponent, this.modalOptions);
    modalRef.componentInstance.stepObject = this.selectedElement;
    modalRef.componentInstance.dateFormat = this.cbpService.getDateValue(this.cbpService.cbpJson.documentInfo[0].dateFormat);
    let title = type == "minimum" ? "Minimum" : "Maximum";
    modalRef.componentInstance.dateTitle = 'Select ' + title + ' Date';
    modalRef.componentInstance.closeEvent.subscribe((receivedEntry: any) => {
      if (receivedEntry !== false) {
        this.selectedElement[type] = receivedEntry;
        let item: any;
        let isMinHigh = this.selectedElement?.minimum > this.selectedElement?.maximum ? true : false;
        if (type === 'Minimum' && isMinHigh) {
          this.selectedElement.maximum = '';
          item = AuditTypes.PROPERTY_MIN;
        } else {
          item = AuditTypes.PROPERTY_MAX;
        }
        this.onFocusEvent();
        this.createAuditEntry(item, { propName: type });
        this.viewUpdateTrack()
      }
      modalRef.close();
    });
  }
}
