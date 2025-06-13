import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { AlertMessages, CbpSharedService, Dependency, DgTypes } from 'cbp-shared';
import { DataInfo } from '../../models';
import { CbpExeService } from '../../services/cbpexe.service';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';
/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */

@Component({
  selector: 'app-usage-option',
  templateUrl: './usage-option.component.html',
  styleUrls: ['./usage-option.component.css']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsageOptionComponent implements OnInit, OnDestroy {
  loading = false;
  @Input() selectedStep: any;
  @Input() cbpJson: any;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  sectionTitle: any;
  sectionUsage = ['Continuous', 'Reference', 'Information'];
  sectionDependency = ['Default', 'Independent', 'Section/Step'];
  selectedUsage: any;
  selectedDependency: any;
  usageReason: any;
  configureDependency = [];
  configureDependencyShow = false;
  selectedObj: any;
  orderJson: any;
  mainOrderJson: any;
  sectionDisabled = false;
  @Input() executionOrderJson: any;
  changeOrder!: boolean;
  dgType!: DgTypes;
  @Output() sendDataEntryJson: EventEmitter<any> = new EventEmitter();

  constructor(public cbpService: CbpExeService, public executionService: ExecutionService,
    public sharedviewService: SharedviewService,
    public notifierService: NotifierService, public sharedService: CbpSharedService) {
  }

  ngOnInit() {
    if (!this.selectedStep['children'])
      this.selectedStep = this.cbpJson.section.filter((item: any) => item.dgUniqueID === this.selectedStep.dgUniqueID)[0];
    this.selectedUsage = this.selectedStep.usage ? this.selectedStep.usage : this.sectionUsage[0];
    this.selectedDependency = this.selectedStep.dependency ? this.selectedStep.dependency : this.sectionDependency[0];
    this.sectionTitle = this.selectedStep.number + ' ' + this.selectedStep.title;
    // to disable ok button for section
    if (this.selectedStep['children'] && this.selectedStep.children.length > 0) { this.isSectionExecuteStarted(this.selectedStep.children); }
    this.sharedService.openModalPopup('usageModal');
  }

  setSelectUsage() {
    this.changeOrder = this.selectedUsage === this.sectionUsage[2] || !this.selectedStep?.children;
  }

  isSectionExecuteStarted(data: any) {
    for (let i = 0; i < data.length; i++) {
      if (this.executionService.stepActionCondition(data[i])) {
        if (data[i].isChecked) {
          this.sectionDisabled = true; break;
        }
      }
      if (data[i].children && data[i].children.length && typeof data[i].children === "object") {
        this.isSectionExecuteStarted(data[i].children);
      }
    }
  }

  saveUsageOption() {
    if (this.selectedDependency === Dependency.SectionStep && this.configureDependency.length === 0) {
      this.notifierService.notify('warning', AlertMessages.invalidSectionStep);
    } else {
      const obj = {
        'usage': this.selectedUsage, 'dependency': this.selectedDependency,
        'reason': this.usageReason, 'dgUniqueID': this.selectedStep.dgUniqueID,
        'dgType': DgTypes.SectionDependency, 'configureDependency': []
      };
      if (this.selectedDependency === Dependency.SectionStep) { obj['configureDependency'] = this.configureDependency }
      this.storeDataJsonObject(obj);
      this.closeEvent.emit({ obj: obj, order: this.selectedObj, oderJson: this.executionOrderJson });
      this.sharedService.closeModalPopup('usageModal');
    }
  }
  storeDataJsonObject(obj: any) {
    let dataInfo: DataInfo = new DataInfo();
    dataInfo.statusBy = this.executionService.selectedUserName;
    dataInfo.statusDate = new Date();
    dataInfo.action = 7000;
    let dataInfoObj = { ...dataInfo, ...this.sharedviewService.setUserInfoObj(dataInfo.action), ...obj };
    this.sendDataEntryJson.emit(dataInfoObj);
    if (this.orderJson && this.orderJson.length > 0) { this.storeJsonAndUpdateCbpJson(); }
  }
  storeDataJsonOrderObject() {
    let dataInfo: DataInfo = new DataInfo();
    dataInfo.statusBy = this.executionService.selectedUserName;
    dataInfo.status = 'orderChange';
    dataInfo.statusDate = new Date();
    dataInfo.dgUniqueID = this.executionService.loggedInUserId + '_' + (++this.cbpService.lastSessionUniqueId);
    dataInfo['selectedStepDgUniqueId'] = this.selectedStep.dgUniqueID;
    dataInfo.action = 7000;
    let dataInfoObj = { ...dataInfo, ...this.sharedviewService.setUserInfoObj(dataInfo.action) };
    this.sendDataEntryJson.emit(dataInfoObj);
  }
  storeJsonAndUpdateCbpJson() {
    try {
      if (!this.executionOrderJson?.orderObjects) {
        this.executionOrderJson = { orderObjects: [] };
      }
    } catch (error) { console.log(error); }
    if (this.executionOrderJson?.orderObjects?.length > 0) {
      const objectExists = this.executionOrderJson.orderObjects.some((item: any) => item.dgUniqueID == this.mainOrderJson.dgUniqueID);
      if (objectExists) {
        const index = this.executionOrderJson.orderObjects.findIndex((item: any) => item.dgUniqueID == this.mainOrderJson.dgUniqueID);
        this.executionOrderJson.orderObjects[index].orderJson =
          [...this.executionOrderJson.orderObjects[index].orderJson, ...this.orderJson];
      } else {
        this.executionOrderJson.orderObjects.push(this.mainOrderJson);
      }
    } else {
      this.executionOrderJson.orderObjects.push(this.mainOrderJson);
    }
    this.storeDataJsonOrderObject();
  }
  getResponseFromOrder(event: any) {
    if (event !== false) {
      this.selectedObj = event.selectedData;
      this.orderJson = event.oderJson;
      this.mainOrderJson = { dgUniqueID: this.selectedStep.dgUniqueID, orderJson: this.orderJson };
    }
    this.executionService.showExecutionOrder = false;
  }
  getSectionDependency(eventObj: any) {
    if (eventObj !== false) { this.configureDependency = eventObj; }
    this.configureDependencyShow = false;
  }
  closeModal() {
    this.sharedService.closeModalPopup('usageModal');
    this.closeEvent.emit(false);
  }
  ngOnDestroy() {
    this.closeModal();
  }
}
