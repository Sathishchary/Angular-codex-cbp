import { Component, OnInit } from '@angular/core';
import { Dependency } from 'cbp-shared';
import { Actions, AuditTypes } from '../../../../models';
import { AuditService } from '../../../../services/audit.service';
import { CbpService } from '../../../../services/cbp.service';
import { ControlService } from '../../../../services/control.service';

@Component({
  selector: 'lib-basic-section-prop',
  templateUrl: './basic-section-prop.component.html',
  styleUrls: ['./basic-section-prop.component.css']
})
export class BasicSectionPropComponent implements OnInit {
  AuditTypes: typeof AuditTypes = AuditTypes;
 
  sectionUsage:any[] = [Dependency.Continuous, Dependency.Reference, Dependency.Information];
 
  sectionDependency = [Dependency.Default, Dependency.Independent, Dependency.SectionStep];
  
  constructor(private controlService: ControlService, public auditService: AuditService,public cbpService: CbpService) { }

  ngOnInit(): void {
    // console.log(this.sectionUsage);
    // console.log(this.sectionDependency);
  }
  modifyDependency(array: any) {
    let modifiedArray: any[] = [];
    array.forEach((item: any) => {
      modifiedArray.push(item.number);
    });
    return modifiedArray.toString();
  }
  levelOfUsage(usage: any) {
    if (usage === Dependency.Information) {
      this.cbpService.selectedElement.dependency = Dependency.Independent;
    } else if (usage === Dependency.Reference || usage === Dependency.Continuous) {
      this.cbpService.selectedElement.dependency = Dependency.Default;
    }
    this.createAuditEntry(AuditTypes.PROPERTY_USAGE, { propName: 'usage' })
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
