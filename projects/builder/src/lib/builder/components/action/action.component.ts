import { Component, OnInit, OnDestroy , AfterViewInit, Input, Output, EventEmitter,
  ChangeDetectionStrategy} from '@angular/core';
import { CbpService } from '../../services/cbp.service';
import { Actiontext,AuditTypes, Actions} from '../../models';
import { AuditService } from '../../services/audit.service';
import { BuilderUtil } from '../../util/builder-util';
import { ControlService } from '../../services/control.service';
import { DgTypes, CbpSharedService} from 'cbp-shared';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css', '../../util/modal.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ActionComponent implements OnInit, OnDestroy, AfterViewInit {
  control = false;
  headerItem: any;
  createNode: any;
  isTree = false;
  quickAccess = false;
  currentNodeSelected: any;
  selectedUniqueId:any;
  nodes = [];
  stepActionObjects: any;
  actiontext: any;
  componentInfo = 'actiontext';
  footerList = [{type:'Save'},{type:'Close'}]
  actionCbpJson:any;
  @Input() selectedElement: any;
  @Output() saveActionEvent: EventEmitter<any> =  new EventEmitter();
  constructor(public cbpService: CbpService,public _buildUtil: BuilderUtil,
     public auditService: AuditService, public controlService: ControlService,
    public sharedService:CbpSharedService) { }

  ngOnInit() {
    this.changeControl(true);
    this.sharedService.openModalPopup('Action-text');
    this.currentNodeSelected = this.selectedElement.dgUniqueID;
    this.actiontext = new Actiontext();
    this.update();
    this.actionCbpJson = JSON.parse(JSON.stringify(this.cbpService.cbpJson));
    this.updateDisableNodes(this.actionCbpJson.section);
    this.isTree = true;
  }

  updateDisableNodes(object:any){
    if (object?.length > 0) {
      for (let i = 0; i < object.length; i++) {
        if(object[i].number){
          if(object[i].dualStep){
            object[i] = this.setDisable(object[i])
          }
          if(object[i].dgType === DgTypes.DualAction){
            object[i] = object[i]['children'][0];
            object[i] = this.setDisable(object[i])
          }
        }
        if (object[i]?.children && object[i]?.children?.length > 0) {
          this.updateDisableNodes(object[i].children);
        }
      }
    }
  }
  setDisable(object:any){
    let obj = {'disabled': true };
    object.state = {...object.state, ...obj};
    return object;
  }

  hide(){
    this.sharedService.closeModalPopup('Action-text');
    this.cbpService.isActionOpen = false;
    this.selectedElement.actionStepType='';
  }
  changeControl(type:any) {
    this.control = this.quickAccess =  type === 'control' ? true : false;
  }
  selectStepNode(event: any) {
    this.currentNodeSelected= event.original.dgUniqueID;
    this.selectedElement = this._buildUtil.getElementByDgUniqueID(this.currentNodeSelected,this.cbpService.cbpJson.section);
    if (this.cbpService.currentStep !== event.original.dgUniqueID) {
      this.cbpService.currentStep = event.original.dgUniqueID;
    }
    this.selectedElement.number = event.original.number;
    // this.controlService.setSelectItem(this.selectedElement);
    this.selectedUniqueId = JSON.parse(JSON.stringify(this.selectedElement.dgUniqueID));
    this.update();
   }
   refreshActionInfo(){
     if (this.selectedElement.actionStepType === 'IF THEN'){
      this.actiontext.finalActionText = 'IF '.bold()+ ' ' + this.actiontext.ifCondition + ' THEN '.bold()+ ' ' + this.actiontext.criticalLocation + ' ' +
       this.actiontext.action.bold() + ' ' + this.actiontext.actionModifier.bold() + ' ' + this.actiontext.object + ' ' +
        this.actiontext.criticalInfo + ' ' + this.actiontext.additionalInfo;
     } else if (this.selectedElement.actionStepType === 'IF THEN ELSE'){
      this.actiontext.finalActionText = 'IF '.bold()+ ' ' + this.actiontext.ifCondition + ' THEN '.bold()+ ' ' + this.actiontext.criticalLocation + ' ' +
       this.actiontext.action.bold() + ' ' + this.actiontext.actionModifier.bold() + ' ' + this.actiontext.object + ' ' +
        this.actiontext.criticalInfo + ' ' + this.actiontext.additionalInfo + ' '+
        'ELSE'.bold()+ ' ' + this.actiontext.elsecriticalLocation + ' '+  this.actiontext.elseaction.bold() + ' ' + this.actiontext.elseactionModifier.bold() + ' ' + this.actiontext.elseobject;
     } else if (this.selectedElement.actionStepType === 'WHEN THEN'){
      this.actiontext.finalActionText = 'WHEN '.bold()+ ' ' + this.actiontext.whenCondition + ' THEN '.bold()+ ' ' + this.actiontext.criticalLocation + ' ' +
       this.actiontext.action.bold() + ' ' + this.actiontext.actionModifier.bold() + ' ' + this.actiontext.object + ' ' +
        this.actiontext.criticalInfo + ' ' + this.actiontext.additionalInfo;
     } else if (this.selectedElement.actionStepType === 'WHILE'){
      this.actiontext.finalActionText = 'WHILE '.bold()+ ' ' + this.actiontext.whileaction.bold() + ' ' + this.actiontext.whileactionModifier.bold() + ' ' +
       this.actiontext.whileCondition + ' ' + this.actiontext.action.bold() + ' ' + this.actiontext.actionModifier.bold() + ' ' +
        this.actiontext.object + ' ' + this.actiontext.criticalInfo + ' ' + this.actiontext.additionalInfo;
     } else {
    this.actiontext.finalActionText =  this.actiontext.criticalLocation + ' ' + this.actiontext.action.bold() + ' ' +
    this.actiontext.actionModifier.bold() + ' ' + this.actiontext.object + ' ' + this.actiontext.criticalInfo + ' ' +
     this.actiontext.additionalInfo;
     }
   }
   saveAction(){
      this.selectedElement.action = this.actiontext.finalActionText;
      this.selectedElement.isHtmlText = true;
      let text = this._buildUtil.setIconAndText(this.selectedElement);
      let obj = { text: text.text, number: this.selectedElement.number, dgUniqueId: this.selectedElement.dgUniqueID, dgType: this.selectedElement.dgType };
      this.cbpService.headerItem = obj;
      this.cbpService.refreshTreeNav = false;
      this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.selectedElement, Actions.Update, AuditTypes.PROPERTY_MODAL_ACTION_TEXT, {propName : 'actionText'});
      this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.selectedElement));
      this.cbpService.isActionOpen = false;
      this.saveActionEvent.emit(this.selectedElement)
   }
   update(){
    this.actiontext.finalActionText = this.selectedElement.action;

   }
   ngAfterViewInit() {
    this.currentNodeSelected = this.selectedElement.dgUniqueID;
    // this._buildUtil.hideObject();
  }
   ngOnDestroy(): void {
    this.hide();
  }
}
