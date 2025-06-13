import { Component, OnInit, OnDestroy, Input, Output, EventEmitter,ChangeDetectionStrategy } from '@angular/core';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';
import { Order } from '../../models/order';
import { DgTypes } from 'cbp-shared';
import { CbpExeService } from '../../services/cbpexe.service';
import { CbpSharedService } from 'cbp-shared';
/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */

@Component({
  selector: 'app-execution-order',
  templateUrl: './execution-order.component.html',
  styleUrls: ['./execution-order.component.css']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExecutionOrderComponent implements OnInit, OnDestroy {
  loading = false;
  @Input() selectedStep:any;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  sectionTitle: any;
  stepChildren :any= [];
  selectedItem: any;
  DgTypes = DgTypes;
  isTree = true;
  currentNodeSelected: any;
  currentSessionOrder:any = [];
  disableDownArrow = false;
  disableUpArrow = true;
  indexValue: any;
  storedSectionData: any;
  orderObj: any;
  orderJson:any = [];
  treeObject!: { section: any; };
  constructor( public cbpService: CbpExeService, public executionService: ExecutionService,
    public sharedviewService: SharedviewService,  public sharedService: CbpSharedService) {
  }

  ngOnInit() {
    const selectedArray = this.hideSubChilds(this.selectedStep.children);
    this.stepChildren = JSON.parse(JSON.stringify(selectedArray));
    if(this.stepChildren) {
      this.selectedItem = this.stepChildren[0];
      this.currentNodeSelected = this.selectedItem.dgUniqueID;
    }
    this.sectionTitle = this.selectedStep.number + ' ' +this.selectedStep.title;
    this.treeObject = { section:  this.stepChildren};
    this.sharedService.openModalPopup('executionOrder');
  }

  hideSubChilds(data:any) {
    for (var i = 0; i < data.length; i++) {
      if (this.executionService.stepActionCondition(data[i]) || data[i].dgType === DgTypes.Section
       || data[i].dgType === DgTypes.StepInfo) {
        if (data[i].children && data[i].children.length && typeof data[i].children === "object") {
          data[i].children.forEach((item:any)=>item['state'] = { 'hidden': true});
        }
      }
    }
    return data;
  }
  selectStepNode(event:any){
    this.selectedItem = event.original;
    console.log(this.selectedItem);
    this.indexValue = this.stepChildren.findIndex((i:any) => i.dgUniqueID === this.selectedItem.dgUniqueID);
    this.checkAvailabilityForUpDown();
  }

  checkAvailabilityForUpDown(){
    if(this.indexValue !== -1){
      this.getIndex(this.stepChildren,this.selectedItem.dgUniqueID);
    } else {
      const element = this.executionService.getElementByNumber(this.selectedItem.parentID, this.stepChildren);
      if(element && element.children){
        this.getIndex(element.children,this.selectedItem.dgUniqueID);
      };
    }
  }
  getIndex(selectedElement:any, id:any){
    const i = selectedElement.findIndex((i:any) => i.dgUniqueID === id);
    this.disableUpArrow = i != 0 ? false : true;
    this.disableDownArrow = selectedElement.length - 1 != i ? false: true;
  }

  upArrowData(){
    if(this.indexValue !== -1){
      this.upArrowReUseCodeNew(this.stepChildren,this.selectedItem.dgUniqueID);
    } else {
      const element = this.executionService.getElementByNumber(this.selectedItem.parentID, this.stepChildren);
      if(element && element.children){
        this.upArrowReUseCodeNew(element.children,this.selectedItem.dgUniqueID);
      };
    }
    this.setTreeData();
  }
  downArrowData(){
    if(this.indexValue !== -1){
      this.downArrowReUseCodenNew(this.stepChildren, this.selectedItem.dgUniqueID);
    } else {
      const element = this.executionService.getElementByNumber(this.selectedItem.parentID, this.stepChildren);
      if(element && element.children){
        this.downArrowReUseCodenNew(element.children, this.selectedItem.dgUniqueID);
      };
    }
    this.setTreeData();
  }
  upArrowReUseCodeNew(selectedElement:any,id:any){
    const i = selectedElement.findIndex((i :any)=> i.dgUniqueID === id);
    // if (i != 0) {
      this.storeOrderJson(selectedElement, i, 'up');
      this.reuseOrderCode(selectedElement, i-1, i);
    // }
  }
  downArrowReUseCodenNew(selectedElement:any,id:any){
    const i = selectedElement.findIndex((i :any)=> i.dgUniqueID === id);
    // if (selectedElement.length - 1 != i) {
      this.storeOrderJson(selectedElement, i, 'down');
      this.reuseOrderCode(selectedElement, i+1, i);
    // }
  }
  reuseOrderCode(selectedElement:any, index:any, i:any){
    let temp = selectedElement[index]; selectedElement[index] = selectedElement[i]; selectedElement[i] = temp;
    let fistElement = JSON.parse(JSON.stringify(selectedElement[index]));
    let secondElement = JSON.parse(JSON.stringify(selectedElement[i]));
    selectedElement[i] = this.setSectionObject(selectedElement[i], fistElement, secondElement);
    selectedElement[index] = this.setSectionObject(selectedElement[index], secondElement, fistElement);
  }

  storeOrderJson(arrayObj:any, i:any, type:any){
    let pos = type =='up' ? i-1 : i+1;
    let obj = arrayObj[pos];
    let preobj = arrayObj[i];
    const order = new Order(arrayObj[i].parentID, pos, i, obj.dgType, obj.dgUniqueID, obj.number, obj.dgSequenceNumber,
      preobj.dgSequenceNumber,preobj.dgUniqueID,preobj.number, preobj.dgSequenceNumber);
    this.orderJson.push(order);
  }

  setSectionObject(secObj:any, fistElement:any, secondElement:any) {
    secObj.children = JSON.parse(JSON.stringify(secondElement.children));
    return secObj;
  }
  setTreeData(){
    this.isTree = false;
    // this.treeObject = JSON.parse(JSON.stringify(this.treeObject));
    setTimeout(() => {
      this.isTree = true;
    }, 100);

  }
  updateExecutionOrder(){
    console.log(this.stepChildren);
    if(!this.orderJson){
      this.selectedStep['orderChanged'] = true;
    }
    this.closeEvent.emit({selectedData: this.stepChildren, oderJson: this.orderJson});
    this.closeModal();
  }
  closeModal(){
   this.executionService.showExecutionOrder = false;
   this.sharedService.removeModal('executionOrder');
   this.closeEvent.emit(false);
  }
  ngOnDestroy(){
    this.closeModal();
  }
}
