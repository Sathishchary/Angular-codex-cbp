import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularEditorConfig } from 'dg-shared';
import { ApproveUser } from '../../models/approve-model';
import { ExecutionService } from '../../services/execution.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'lib-protect-approval',
  templateUrl: './protect-approval.component.html',
  styleUrls: ['./protect-approval.component.css']
})
export class ProtectApprovalComponent implements OnInit {

  @Input() stepObject:any;
  newStepObject:any;
  @Output() closeEvent = new EventEmitter<any>();
  list = [ {name:'by', display: 'By'}, {name:'name', display: 'Name'}, {name:'personnelId', display: 'Personnel Id'}, {name:'position', display: 'Position'}, {name:'date', display: 'Date'}, {name:'status', display: 'Status'}];
  selectedItem:any;
  toolbarHiddenButtons= [
    [
    'heading',
    ],
    [
    'customClasses',
    'insertImage',
    'insertVideo',
    'insertHorizontalRule',
    ]
  ];
  config: AngularEditorConfig = {
  editable: true,
    spellcheck: false,
    minHeight: '5rem',
    maxHeight: '15rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'montserrat', name: 'Montserrat'},
      {class: 'Light 400', name: 'Poppins'},
      {class: 'time-new-roman', name: 'Time New Roman'},
    ],
    defaultParagraphSeparator: 'p',
    toolbarHiddenButtons: this.toolbarHiddenButtons,
    customClasses: [
      {
        name: "Custom1",
        class: "Custom1",
      },
    ]
  };
  disabledEditFields = false;
  @Input() cbpService: any;
  completeDisable = true;
  rejectedCondtion = true;
  constructor(public executionService: ExecutionService,public notifier: NotifierService,) { }

  ngOnInit(): void {
    if(this.stepObject.oldValue === undefined || this.stepObject.oldValue === ''){
      this.stepObject.oldValue = JSON.parse(JSON.stringify(this.stepObject.storeValue));
    }
    this.stepObject.approveList.forEach((element:any, i:number) => {
      if(element.by.includes('@')){
        let item = element.by.split('@');
        element.by = item[0];
      }
      if(element.status === 'Approved' || element.status === 'Rejected'){
        this.disabledEditFields = true;
      }
      let reject = element.approveUser.filter((item:any)=>item.status ==='');
      this.rejectedCondtion = reject.length>0 ? false : true;
      let complete = element.approveUser.filter((item:any)=>( item.status ==='Approved' ||item.status ==='Rejected') );
      this.completeDisable = complete.length>0 ? false : true;
    });
    this.selectedItem = this.stepObject.approveList.at(-1);
    this.newStepObject = JSON.parse(JSON.stringify(this.stepObject));
  }

  addRow(item:any, i:number){
    this.stepObject.approveList[i].approveUser.push(new ApproveUser('', this.executionService.selectedUserName,this.executionService.selectedUserName, new Date(), '', '', ''));
  }
  approve(item:any){
    if(item.by !== this.executionService.selectedUserName){
      const isApproved = this.stepObject.approveList.at(-1).approveUser.every((it:any)=>it.status === 'Approved');
      if(isApproved){
        item.status = 'Approved';
      }
      this.updateValidation('Approved');
      let complete =  this.stepObject.approveList.at(-1).approveUser.filter((item:any)=>( item.status ==='Approved' ||item.status ==='Rejected') );
      this.completeDisable = complete.length>0 ? false : true;
      this.closeEvent.emit({type:'saveApprove', obj:this.stepObject});
    }
  }
  updateValidation(status:any){
    this.stepObject.approveList.at(-1).approveUser.forEach((element:any) => {
      if(element.name !==''){
        element.by = this.executionService.selectedUserName;
        element.date = new Date();
        element.status = status;
      }
    });
  }
  async reject(item:any){
    if(item.by !== this.executionService.selectedUserName){ 
        const { value: userConfirms, dismiss } = await this.cbpService.showSwalDeactive('Do you want to reject the approval process?', 'warning', 'Ok');
        if (!dismiss && userConfirms) {
          item.status = 'Rejected';
          this.updateValidation('Rejected');
          this.stepObject.storeValue = this.stepObject.oldValue;
          this.closeEvent.emit({type: 'reject', obj:this.stepObject});
        }
    }
  }
 
  async complete(item:any){
    if(item.by !== this.executionService.selectedUserName){ 
      const { value: userConfirms, dismiss } = await this.cbpService.showSwalDeactive('Do you want to complete the approval process?', 'warning', 'Ok');
      if (!dismiss && userConfirms) {
        item.status = 'Complete';
        this.closeEvent.emit({type: 'complete', obj:this.stepObject});
      }
    }
  }
  showErrorMsg(mesg:string, type:any, popup:boolean){
    this.cbpService.displayMsg = mesg;
    this.cbpService.errorDgType  = type;
    this.cbpService.showErrorPopup = popup;
  }
  cancel(){
    this.stepObject = this.newStepObject;
    this.closeEvent.emit({type:false, obj:this.stepObject});
  }

}
