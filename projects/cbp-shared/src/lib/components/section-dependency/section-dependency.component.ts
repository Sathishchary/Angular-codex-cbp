import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Input, Output, ViewChild, SimpleChanges } from '@angular/core';
import { DependencyCheckboxComponent } from './dependency-checkbox/dependency-checkbox.component';
import { DgTypes } from '../../models';
import { CbpSharedService } from '../../cbp-shared.service';

@Component({
  selector: 'app-exe-section-dependency',
  templateUrl: './section-dependency.component.html',
  styleUrls: ['./section-dependency.component.css']
})
export class SectionExeDependencyComponent implements OnInit, OnDestroy, AfterViewInit {
  isTree = false;
  componentInfo = 'sectionDependency';
  rulesStepNo: any;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  currentNodeSelected: any;
  nodeOpenClose: any;
  @Input() isExecutor = false;
  @Input() selectedStepFromExecution: any;
  @Input() cbpJson:any;
  @Input() sharedviewService: any;
  //AUDIT & UNDO
  dgType = DgTypes;
  sdRestoreSnapchat: Array<any> = [];
  resetChanges = true;
  @ViewChild('dcComponent', {static: true}) dcComponent!:DependencyCheckboxComponent;

  constructor(public cbpSharedService: CbpSharedService) { }

  ngOnInit() {
    this.cbpSharedService.openModalPopup('Component-sectionDependency');
    this.currentNodeSelected = this.selectedStepFromExecution.dgUniqueID;
    this.rulesStepNo =  'Dependency -' + this.selectedStepFromExecution.text;
    this.sdRestoreSnapchat = JSON.parse(JSON.stringify(this.selectedStepFromExecution ));
  }
  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'cbpJson' && this.cbpJson) {
        this.cbpJson = changes.cbpJson.currentValue;
      }
    }
  }
  selectStepNode(event: any) {
    this.currentNodeSelected = event.original.dgUniqueID;
  }
  isOpenClose(event: any){
    this.nodeOpenClose = event;
    this.checkboxClosed(this.cbpJson.section,event);
  }
  checkboxClosed(data:any,event:any){
    const childrens = event.children;
    for (var j = 0; j < childrens.length; j++) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].dgUniqueID ===  Number(childrens[j]) && event.type === "close_node") {
          data[i]['checkboxNode'] = false;
        }
        if (data[i].dgUniqueID ===  Number(childrens[j]) && event.type === "open_node") {
          data[i]['checkboxNode'] = true;
        }
        if (data[i].children && data[i].children.length && typeof data[i].children === "object") {
          this.checkboxClosed(data[i].children,event);
        }
      }
    }
  }
  dependencySave(){
    this.selectedStepFromExecution.configureDependency = [];
    this.checkedStepsData(this.cbpJson.section,false);
    // if(!this.isExecutor){
    //   // this.auditService.createEntry(this.sdRestoreSnapchat, this.selectedStepFromExecution, Actions.Update, AuditTypes.SECTION_DEPENDENCY)
    // }
    this.hide();
  }
  checkedStepsData(data:any,type:any) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].dependencyChecked) {
         data[i]['disabledDependency'] = type;
         data[i]['dependencyChecked'] = type;
        const configData = {'dgUniqueId': data[i].dgUniqueID, 'number': data[i].number}
        this.selectedStepFromExecution.configureDependency.push(configData);
      }
      if (data[i].children && data[i].children.length && typeof data[i].children === "object") {
        this.checkedStepsData(data[i].children,type);
      }
    }
  }
  findByDisabled(data:any) {
    for (var i = 0; i < data.length; i++) {
      if(data[i].dgType === this.dgType.Section || data[i].dgType === this.dgType.StepAction || data[i].dgType === this.dgType.StepInfo ||
        data[i].dgType === this.dgType.DelayStep || data[i].dgType === this.dgType.Timed || data[i].dgType === this.dgType.Repeat){
          data[i]['disabledDependency'] = false;
          data[i]['dependencyChecked'] = false;
        }
       if (data[i].children && data[i].children.length && typeof data[i].children === "object") {
        this.findByDisabled(data[i].children);
      }
    }
  }
  async cancel(){
    this.hide();
  }
  ngAfterViewInit() {
   // this.currentNodeSelected = this.selectedStepFromExecution.dgUniqueID;
  }
  hide() {
    // this.cbpService.configureDependency = false;
    this.findByDisabled(this.cbpJson.section);
     this.cbpSharedService.removeModal('Component-sectionDependency');
    if(this.selectedStepFromExecution.configureDependency.length>0){
      this.closeEvent.emit(this.selectedStepFromExecution.configureDependency);
    } else {  this.closeEvent.emit(false);}
  }

  reset(){
    this.selectedStepFromExecution.configureDependency =  [];
   // this.findById(this.cbpService.cbpJson.section,false);
    this.checkedStepsData(this.cbpJson.section,false);
    this.selectedStepFromExecution = JSON.parse(JSON.stringify( this.sdRestoreSnapchat))
    this.resetChanges = !this.resetChanges;
  }
  ngOnDestroy(): void {
    this.hide();
  }
}
