import { Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DgTypes, LinkTypes } from 'cbp-shared';
import { Actions, AuditTypes } from '../../../../models';
import { AuditService } from '../../../../services/audit.service';
import { BuilderService } from '../../../../services/builder.service';
import { CbpService } from '../../../../services/cbp.service';
import { ControlService } from '../../../../services/control.service';
import { BuilderUtil } from '../../../../util/builder-util';

@Component({
  selector: 'lib-link-prop',
  templateUrl: './link-prop.component.html',
  styleUrls: ['./link-prop.component.css']
})
export class LinkPropComponent implements OnInit, OnChanges {
  //sourceList = [LinkTypes.Local, LinkTypes.Attach, LinkTypes.URL, LinkTypes.eDocument, LinkTypes.eMedia];
  sourceList = [LinkTypes.Local, LinkTypes.Attach, LinkTypes.URL, LinkTypes.eDocument];
  tempsectionnumbers: any[] = [];
  selectedLinkItem: any;
  dgType = DgTypes;
  AuditTypes: typeof AuditTypes = AuditTypes;
  tempMapNumberAndUniqueid = new Map();
  constructor(private _buildUtil: BuilderUtil, private controlService: ControlService, public auditService: AuditService, public cbpService: CbpService, public builderService: BuilderService) { }
  @Input() selectedElement: any;
  @Input() selectedElementChange: EventEmitter<any> = new EventEmitter<any>();
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedElement && this.selectedElement)
      this.selectedElement = changes.selectedElement.currentValue;
    if (this.cbpService.selectedElement.source == "URL" && this.cbpService.selectedElement.uri !== '' && this.cbpService.selectedElement.uri !== undefined) {
      this.cbpService.setUpStyle = true;
    }
  }

  ngOnInit(): void {
    // this.selectedElement.source = LinkTypes.Attach;
    // this.selectedElement.source = this.selectedElement.source;
    this.callStepSectionInfo();
  }
  onFocusEvent() {
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }
  updateLink() {
    this.cbpService.isViewUpdated = true;
  }
  setUpdates(action: string, uri: string) {
    this.cbpService.selectedElement.action = action;
    this.cbpService.selectedElement.uri = uri;
  }
  changeUI(source: string) {
    if (source === 'Local') {
      this.cbpService.selectedElement.action = 'Execute';
      this.callStepSectionInfo();
    } else if (source === 'Attach') {
      this.setUpdates('Reference', '');
      this.cbpService.selectedElement.target = '';
    } else if (source === 'URL' || source === 'eMedia') {
      this.setUpdates('N/A', '');
    } else if (source === 'eDocument') {
      this.setUpdates('Execute', '');
      this.cbpService.selectedElement.target = '';
    }
    this.viewUpdateTrack();
    this.controlService.setStyleModelItem(this.cbpService.styleModel);
    this.updateLink();
  }

  callStepSectionInfo() {
    this.tempsectionnumbers = [];
    this.tempMapNumberAndUniqueid = new Map();
    this.getStepSectionNumbers(this.cbpService.cbpJson.section);
  }
  getStepSectionNumbers(object: any) {
    if (object !== undefined) {
      for (let i = 0; i < object.length; i++) {
        if (object[i].dgType === DgTypes.Section || object[i].dgType === DgTypes.StepInfo
          || object[i].dgType === DgTypes.Timed
          || object[i].dgType === DgTypes.DelayStep || object[i].dgType === DgTypes.Repeat) {
          this.tempsectionnumbers.push({
            number: object[i].dgSequenceNumber,
            dgUniqueID: object[i].dgUniqueID, title: object[i].title, text: object[i].text
          });
          this.tempMapNumberAndUniqueid.set(object[i].dgSequenceNumber, object[i].dgUniqueID);
        }
        if (object[i].dgType === DgTypes.StepAction) {
          this.tempsectionnumbers.push({
            number: object[i].dgSequenceNumber,
            dgUniqueID: object[i].dgUniqueID, title: object[i].action, text: object[i].text
          });
          this.tempMapNumberAndUniqueid.set(object[i].dgSequenceNumber, object[i].dgUniqueID);
        }
        if (object[i].children) {
          this.getStepSectionNumbers(object[i].children);
        }
      }
    }
  }
  createAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
    this.selectedElementChange.emit(this.selectedElement);
  }
  checkBoxAudit(event: any, auditType: AuditTypes, optionalParams: any = {}) {
    this.cbpService.selectedElement[optionalParams.propName] = event.target.checked;
    this.createAuditEntry(auditType, optionalParams)
  }
  viewUpdateTrack() {
    this.cbpService.setViewUpdateTrack();
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }
  showErrorMsg(dgType: any, dgTypeMsg: any) {
    this.setErrorMesg(dgTypeMsg, dgType, true)
  }

  setErrorMesg(mesg: string, type: any, popup: boolean) {
    this.cbpService.displayMsg = mesg;
    this.cbpService.errorDgType = type;
    this.cbpService.showErrorPopup = popup;
  }
  onNewFileSelected(e: any) {
    let files: any = (e.target as HTMLInputElement)?.files;
    if (files?.length > 0) {
      this.viewUpdateTrack();
      this.cbpService.attachment.push(files[0]);
      this.cbpService.selectedElement.uri = files[0].name;
      this.createAuditEntry(AuditTypes.AUDIT_DEFAULT, { propName: 'uri' });
    } else {
      // console.log('No Media Found');
    }
  }
  sectionId(item: any) {
    this.selectedLinkItem = item;
    const selected = this.tempsectionnumbers.filter(it => it.number === item);
    this.cbpService.selectedElement.sectiondgUniqueId = selected[0].dgUniqueID;
    this.cbpService.selectedElement.sectionNumber = item;
    this.viewUpdateTrack();
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
        this.viewUpdateTrack();
        this.cbpService.fieldsMaps.set(this.cbpService.selectedElement.dgUniqueID, this.cbpService.selectedElement.fieldName);
        this.createAuditEntry(AuditTypes.PROPERTY_TEXT, { propName: 'fieldName' })
      }
    }
  }
}
