import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuditTypes, Actions } from '../../../../models';
import { AuditService } from '../../../../services/audit.service';
import { BuilderService } from '../../../../services/builder.service';
import { CbpService } from '../../../../services/cbp.service';
import { ControlService } from '../../../../services/control.service';

@Component({
  selector: 'lib-reference-prop',
  templateUrl: './reference-prop.component.html',
  styleUrls: ['./reference-prop.component.css']
})
export class ReferencePropComponent implements OnInit, OnChanges {
  @Input() selectedElement: any;
  AuditTypes: typeof AuditTypes = AuditTypes;

  constructor(private controlService: ControlService, 
    public auditService: AuditService, public cbpService: CbpService, 
    public builderService: BuilderService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedElement && this.selectedElement)
      this.selectedElement = changes.selectedElement.currentValue;
  }
  ngOnInit(): void {
  }
  createAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    this.viewUpdateTrack();
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
  }
  viewUpdateTrack() {
    this.cbpService.selectedElement = this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }
}
