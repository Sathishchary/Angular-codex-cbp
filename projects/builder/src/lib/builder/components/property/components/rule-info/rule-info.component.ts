import { Component, OnInit, Input, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { CbpService } from '../../../../services/cbp.service';
import { ControlService } from '../../../../services/control.service';

@Component({
  selector: 'app-rule-info',
  templateUrl: './rule-info.component.html',
  styleUrls: ['./rule-info.component.css']
})
export class RuleInfoComponent implements OnInit {
  @Input() hideConditionalRule = false;
  @Input() hideComponent = false;
  @Input() showAlarm = false;
  @Input() hideApplicablityRule = false;
  @Input() hideRoleQual = false;
  @Input() hideRamaining = false;
  enableRole = false;
  @Input() selectedElement:any;
  constructor(public cbpService: CbpService, public cdref: ChangeDetectorRef, public controlService: ControlService) { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedElement && this.selectedElement) {
      this.selectedElement = changes.selectedElement.currentValue;
    }
  }
}
