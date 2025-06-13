import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { Actions, AuditTypes } from '../../../../models';
import { AuditService } from '../../../../services/audit.service';
import { BuilderService } from '../../../../services/builder.service';
import { CbpService } from '../../../../services/cbp.service';
import { ControlService } from '../../../../services/control.service';
import { DataSharingService } from '../../../../services/data-sharing.service';
import { BuilderUtil } from '../../../../util/builder-util';

@Component({
  selector: 'lib-figure-prop',
  templateUrl: './figure-prop.component.html',
  styleUrls: ['./figure-prop.component.css']
})
export class FigurePropComponent implements OnInit, OnChanges {
  AuditTypes: typeof AuditTypes = AuditTypes;
  dgType = DgTypes;
  @Input() selectedElement: any;
  imgpropertiessubscription!: Subscription;

  constructor(private propertyaChangeService: DataSharingService, private _buildUtil: BuilderUtil, private controlService: ControlService, public auditService: AuditService, public cbpService: CbpService, public builderService: BuilderService) { }

  ngOnInit(): void {
    this.imgpropertiessubscription = this.propertyaChangeService.imageproperties.subscribe(
      (res) => {
        if (res !== '' && res !== undefined) {
          // console.log("Res",res)
          // console.log("Res",this.selectedElement)
          //selected image propertie updation
          if (this.selectedElement.images.length) {
            this.cbpService.fileproperties = res;
          }
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedElement && this.selectedElement)
      this.selectedElement = changes.selectedElement.currentValue;
  }

  updateImageView(image: any) {
    this.propertyaChangeService.changeImageProperties(image);
    this.cbpService.isViewUpdated = true;
  }
  keyPressEvent(event: any) {
    // if(Number(event?.target?.value) < 0){
    //  event.target.value = 0;
    // }
    // if(Number(event?.target?.value) >100){
    //  event.target.value = 100;
    // }
  }
  updateMedia(mediaObj: any) {
    // if(!mediaObj['modifiedHeight']) { mediaObj['modifiedHeight'] = 500 / (100/ mediaObj.height); }
    this.propertyaChangeService.mediaObjecProperties(mediaObj);
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

  updateLink() {
    this.cbpService.isViewUpdated = true;
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

  tablePropertyCreateAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    this.updateLink();
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.tableDataEntrySelected, Actions.Update, auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.tableDataEntrySelected));
  }
  showErrorMsg(dgType: any, dgTypeMsg: any) {
    this.setErrorMesg(dgTypeMsg, dgType, true)
  }
  setErrorMesg(mesg: string, type: any, popup: boolean) {
    this.cbpService.displayMsg = mesg;
    this.cbpService.errorDgType = type;
    this.cbpService.showErrorPopup = popup;
  }
  onFocusEvent() {
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }


  createAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }
  checkBoxAudit(event: any, auditType: AuditTypes, optionalParams: any = {}) {
    this.cbpService.selectedElement[optionalParams.propName] = event.target.checked;
    this.createAuditEntry(auditType, optionalParams)
  }
  viewUpdateTrack() {
    this.cbpService.setViewUpdateTrack();
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }
  updateVerify() {
    this.cbpService.isViewUpdated = true;
  }
  ngOnDestroy() {
    this.imgpropertiessubscription?.unsubscribe();
  }

}
