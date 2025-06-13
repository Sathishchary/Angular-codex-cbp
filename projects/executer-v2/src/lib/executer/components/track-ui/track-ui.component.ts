import { Component, Input, OnInit } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { ExecutionService } from '../../services/execution.service';
import { CbpExeService } from './../../services/cbpexe.service';

@Component({
  selector: 'lib-track-ui',
  templateUrl: './track-ui.component.html',
  styleUrls: ['./track-ui.component.css']
})
export class TrackUiComponent implements OnInit {
  @Input() field: any;
  dgType = DgTypes;
  showTrackChange = false;
  constructor(public cbpService: CbpExeService, public executionService: ExecutionService) { }

  ngOnInit(): void {
    if (this.field?.internalRevision) {
      let number = Number(this.field.internalRevision);
      let internalRevision: any = 0;
      // if (this.cbpService.documentInfo?.internalRevision) {
      //   internalRevision = this.cbpService.documentInfo.internalRevision;
      // }
      internalRevision = this.validateTrackChange(internalRevision, this.cbpService.documentInfo);
      if (number === Number(internalRevision)) {
        this.showTrackChange = true;
      }
    }
  }

  validateTrackChange(internalRevision: any, documentInfo: any) {
    if (documentInfo?.internalRevision) {
      internalRevision = documentInfo?.internalRevision;
    } else if (documentInfo?.internalVersion) {
      internalRevision = documentInfo?.internalVersion;
    }
    return internalRevision;
  }
}
