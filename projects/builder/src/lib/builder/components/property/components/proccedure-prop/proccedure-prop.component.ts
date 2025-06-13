import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { AuditTypes, Actions } from '../../../../models';
import { AuditService } from '../../../../services/audit.service';
import { BuilderService } from '../../../../services/builder.service';
import { CbpService } from '../../../../services/cbp.service';
import { ControlService } from '../../../../services/control.service';
import { BuilderUtil } from '../../../../util/builder-util';

@Component({
  selector: 'lib-proccedure-prop',
  templateUrl: './proccedure-prop.component.html',
  styleUrls: ['./proccedure-prop.component.css']
})
export class ProccedurePropComponent implements OnInit,OnChanges {

  dgType = DgTypes;
  AuditTypes: typeof AuditTypes = AuditTypes;
  constructor(private _buildUtil: BuilderUtil,private controlService: ControlService,public auditService: AuditService,public cbpService: CbpService,public builderService: BuilderService) { }
  @Input() selectedElement: any;
  ngOnChanges(changes: SimpleChanges): void {
      if(changes.selectedElement&&this.selectedElement)
        this.selectedElement=changes.selectedElement.currentValue;
    }
      
  ngOnInit(): void {
  }
  onFocusEvent() {
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }
 

  createAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    this.viewUpdateTrack();
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }

  viewUpdateTrack(){
    this.cbpService.selectedElement = this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
    this.controlService.hideTrackUi({'trackUiChange': true});
  }
  showErrorMsg(dgType: any, dgTypeMsg: any){
    this.setErrorMesg(dgTypeMsg, dgType, true)
  }

  setErrorMesg(mesg:string, type:any, popup:boolean){
    this.cbpService.displayMsg = mesg;
    this.cbpService.errorDgType  = type;
    this.cbpService.showErrorPopup = popup;
  }


}
