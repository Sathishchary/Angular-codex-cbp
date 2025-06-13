import { Component, OnInit } from '@angular/core';
import { Actions, AuditTypes } from '../../../../models';
import { AuditService } from '../../../../services/audit.service';
import { BuilderService } from '../../../../services/builder.service';
import { CbpService } from '../../../../services/cbp.service';
import { ControlService } from '../../../../services/control.service';
import { BuilderUtil } from '../../../../util/builder-util';

@Component({
  selector: 'lib-timed-step-properties',
  templateUrl: './timed-step-properties.component.html',
  styleUrls: ['./timed-step-properties.component.css']
})
export class TimedStepPropertiesComponent implements OnInit {
  AuditTypes: typeof AuditTypes = AuditTypes;
  constructor(private _buildUtil: BuilderUtil,private controlService: ControlService,public auditService: AuditService,public cbpService: CbpService,public builderService: BuilderService) { }


  ngOnInit(): void {
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

}
