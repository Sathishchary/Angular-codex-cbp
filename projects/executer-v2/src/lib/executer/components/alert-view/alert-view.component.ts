import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AlertMessages, DgTypes } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { ActionId, DataInfoModel, StepOption } from '../../models';
import { CbpExeService } from '../../services/cbpexe.service';
import { DatashareService } from '../../services/datashare.service';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';
const defaultImageJson = require('src/assets/cbp/json/default-style-image.json');
/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */
declare const $: any, swal: any;

@Component({
  selector: 'app-alert-view',
  templateUrl: './alert-view.component.html',
  styleUrls: ['./alert-view.component.css']
})
export class AlertViewComponent implements OnInit, OnDestroy {

  @Input() stepObject!: any;
  @Input() obj!: any;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  @Output() dataJsonEntryEvent: EventEmitter<any> = new EventEmitter();
  dgType = DgTypes;
  @Input() usageType!: any;
  stepActionValidation!: boolean;
  acknowledgeValidation!: boolean;
  styleDefaultImageJson!: any;
  @Input() isDetailTabEnabled: any = false;
  styleModel_subscription!: Subscription;
  mobilewidth!: any;
  windowwidth_subscription!: Subscription;
  windowWidth: any;
  levelStyleTitle: any = {};
  levelTitle: any = {};
  defaultImage!: any;
  notes: any;
  textAlign: any;
  alignNo: number = 3;
  constructor(public cbpService: CbpExeService, public executionService: ExecutionService,
    public sharedviewService: SharedviewService, public cdr: ChangeDetectorRef,
    public datashareService: DatashareService) {

  }
  ngOnInit() {
    if (!this.stepObject?.options) { this.stepObject['options'] = new StepOption(); }
    if (!this.stepObject['title'])
      this.stepObject['title'] = this.stepObject.dgType;
    this.styleDefaultImageJson = defaultImageJson;
    if (!this.cbpService.styleImageJson) {
      this.cbpService.styleImageJson = defaultImageJson;
    }
    this.usageType = this.usageType !== undefined || this.usageType !== '' ? this.usageType : DgTypes.Continuous;
    if (this.stepObject.dgType === this.dgType.Note || this.stepObject.dgType === this.dgType.Alara) {
      this.notes = (this.stepObject.dgType === this.dgType.Note) ? this.stepObject.notes : this.stepObject.alaraNotes;
    }
    this.styleModel_subscription = this.executionService.styleModelobjValue.subscribe((res: any) => {
      if (res && res != '{}' && !this.executionService.isEmpty(res)) {
        this.levelStyleTitle = this.sharedviewService.setStyles(res['level' + this.stepObject.dgType + 'Title']);
        this.levelTitle = this.sharedviewService.setStyles(res['level' + this.stepObject.dgType]);
        this.defaultImage = this.cbpService.styleImageJson[this.stepObject.dgType.toLowerCase() + 'Image'];
        this.textAlign = res['level' + this.stepObject.dgType + 'Title'].textAlign;
        this.alignNo = this.textAlign === 'right' ? 2 : (this.textAlign === 'left' ? 6 : 3);
        this.cdr.detectChanges();
      }
    });
    this.windowwidth_subscription = this.executionService.windowWithChange.subscribe((res: any) => {
      if (res && res != '{}' && !this.executionService.isEmpty(res)) {
        this.windowWidth = res?.width;
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
  sendEventToFormview(event: any, item: any, obj: any) {
    if (event.target.checked) {
      if (!false) {
        item = this.setAlertFields(item, true, 2);
        this.sharedviewService.isAlertMessage = false;
        this.storeAlerts(item);
        if (this.executionService.stepActionCondition(obj)) {
          this.checkPreviousAlerts(obj, this.cbpService.stepSequentialArray);
          if ((this.sharedviewService.isAlertMessage) && this.usageType === DgTypes.Continuous) {
            this.sharedviewService.isAlertMessage = false;
            item = this.setAlertFields(item, false, 0);
            if (event.target) { event.target.checked = false; }
            this.setMessageValue(obj, item, false);
            this.checkValidFormData(AlertMessages.previousAlertMessage);
          } else {
            item = this.setAlertFields(item, true, 2);
            this.setMessageValue(obj, item, true);
            if (obj.children.length > 0) {
              const hasNotifications = this.checkNotFinishedNotification(obj);
              const childrs = this.sharedviewService.getChildrenSteps(obj);
              if (childrs.length > 0 && hasNotifications.length === 0) {
                this.closeEvent.emit({ dgType: DgTypes.StepAction, object: obj });
              }
            }
          }
        } else {
          const index = this.cbpService.stepSequentialArray.indexOf(obj);
          if (index === 0) {
            this.setMessageValue(obj, item, true);
            if (this.sharedviewService.hasAnyAlertMessages(obj) && this.usageType === DgTypes.Continuous) {
              item = this.setAlertFields(item, true, 2);
              this.setMessageValue(obj, item, true);
            } else {
              this.reuseAlertCode(obj, item);
            }
          } else {
            this.checkPreviousAlerts(obj, this.cbpService.stepSequentialArray)
            if ((this.sharedviewService.isAlertMessage || this.sharedviewService.stepActionValidation) && this.usageType === DgTypes.Continuous) {
              this.setValidationFields();
              item = this.setAlertFields(item, false, 0);
              if (event.target) { event.target.checked = false; }
              this.setMessageValue(obj, item, false);
              const mesg = this.sharedviewService.isAlertMessage ? 'alert' : 'step';
              this.checkValidFormData('Previous ' + mesg + ' is not complete');
            } else {
              if (!this.sharedviewService.hasAnyAlertMessages(obj)) { this.reuseAlertCode(obj, item); }
            }
          }
        }
        this.cdr.detectChanges();
      }
    }
  }
  setAlertFields(item: any, checked: boolean, tapped: number) {
    item.isChecked = checked;
    item['isTapped'] = tapped;
    return item;
  }
  reuseAlertCode(obj: any, item: any) {
    item = this.setAlertFields(item, true, 2);
    this.setMessageValue(obj, item, true);
    this.closeEvent.emit({ dgType: DgTypes.Section, object: obj });
  }
  checkPreviousNotificationfinished(obj: any, selected: any) {
    if (obj) {
      const getNotifications = obj.children.filter((item: any) => {
        if (this.executionService.messageCondition(item)) { return true; }
      });
      if (getNotifications && getNotifications.length > 1) {
        return this.hasNotifications(getNotifications, selected);
      } else { return true; }
    }
  }
  hasNotifications(getNotifications: any, selected: any) {
    const index = getNotifications.findIndex((el: any) => el.dgUniqueID === selected.dgUniqueID);
    for (let j = 0; j < index; j++) { const noteObj = getNotifications[j]; if (!noteObj.isChecked) { return false; } }
    return true;
  }
  checkNotFinishedNotification(obj: any) {
    const values = obj.children.filter((item: any) => {
      if (this.executionService.messageCondition(item) && !item.isChecked) { return true; }
    });
    return values;
  }
  setMessageValue(obj: any, item: any, type: any) {
    item['createdDate'] = new Date();
    item['createdBy'] = this.executionService.selectedUserName;
    const index = this.cbpService.stepSequentialArray.findIndex((el: any) => el.dgUniqueID === obj.dgUniqueID);
    const value = this.cbpService.stepSequentialArray[index];
    const getValue = value.children.findIndex((el: any) => el.dgUniqueID === item.dgUniqueID);
    this.cbpService.stepSequentialArray[index].children[getValue].isChecked = type;
    this.cbpService.stepSequentialArray[index].children[getValue].isTapped = type ? 2 : 0;
  }
  storeAlerts(obj: any) {
    let user = this.executionService.selectedUserName;
    let dataInfo: any = new DataInfoModel('completed', user, new Date(), user, new Date(), '', obj.dgType, obj.dgUniqueID, '');
    let dataInfoObj = { ...dataInfo, ...this.sharedviewService.setUserInfoObj(ActionId.Alert) };
    if (obj['isParentRepeatStep']) {
      dataInfoObj['isParentRepeatStep'] = obj['isParentRepeatStep'];
    }
    this.cbpService.dataJson.dataObjects.push(dataInfoObj);
    this.datashareService.changeCount++;
  }
  async checkValidFormData(mesg: any) {
    const { value: userConfirms, dismiss } = await this.cbpService.showSwalDeactive(mesg, 'warning', 'Ok');
    if (!dismiss && userConfirms) { return true; }
  }
  setHandle(type: string, item: any, event: any) {
    let title = type === 'Note' ? 'notes' : 'alaraNotes';
    this.cbpService.handleSelection(event, this.stepObject, title)
  }
  setValidationFields() {
    this.sharedviewService.isAlertMessage = false;
    this.sharedviewService.stepActionValidation = false;
  }

  checkPreviousAlerts(currentObj: any, stepSequentialArray: any) {
    const index = stepSequentialArray.findIndex((el: any) => el.dgUniqueID === currentObj.dgUniqueID);
    for (let j = 0; j < index; j++) {
      const object = stepSequentialArray[j];
      if (currentObj !== object) {
        if (object.dgType === DgTypes.Section || object.dgType === DgTypes.StepInfo || this.executionService.stepActionCondition(object)) {
          if ((this.executionService.stepActionCondition(object)) && !object.isChecked) {
            this.stepActionValidation = true;
            break;
          }
          if ((object.dgType === DgTypes.Section || object.dgType === DgTypes.StepInfo) && object.acknowledgementReqd && !object.isChecked) {
            this.acknowledgeValidation = true;
            break;
          }
          if (this.sharedviewService.hasAnyAlertMessages(object)) { break; }
        }
      }
    }
  }
  ngOnDestroy(): void {
    this.styleModel_subscription?.unsubscribe();
    this.windowwidth_subscription?.unsubscribe();
  }
}
