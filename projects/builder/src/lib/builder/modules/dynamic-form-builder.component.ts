import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DgTypes, ImagePath, SequenceTypes } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { StyleLevel } from '../models';
import { CbpService } from '../services/cbp.service';
import { ControlService } from '../services/control.service';
import { LayoutService } from '../shared/services/layout.service';
import { BuilderUtil } from '../util/builder-util';

@Component({
  selector: 'dynamic-form-builder',
  templateUrl: './dynamic-form-builder.component.html',
  styleUrls: ['./dynamic-form-builder.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormBuilderComponent implements OnInit {
  @Input() field: any;
  @Input() rowcolInfo: any;
  @Input() media: any = [];
  @Input() stepObject: any;
  @Input() styleLevelObj!: StyleLevel;
  @Input() headerWidth: any;
  @Input() isCoverPage: any;

  @Output() tableInfo: EventEmitter<any> = new EventEmitter();
  @Output() linkCall: EventEmitter<any> = new EventEmitter();
  DgTypes: typeof DgTypes = DgTypes;
  detectviewSubscribe!: Subscription;

  ImagePath: typeof ImagePath = ImagePath;
  sequenceTypes: typeof SequenceTypes = SequenceTypes;

  constructor(public cbpService: CbpService, public cdref: ChangeDetectorRef,
    public controlService: ControlService, private builderUtil: BuilderUtil,
    public layoutService: LayoutService) {
  }
  ngDoCheck(): void {
    if (this.cbpService.detectWholePage || (this.cbpService.isViewUpdated &&
      this.field.dgUniqueID === this.cbpService?.selectedElement['dgUniqueID'])) {
      this.cdref.detectChanges();
      this.cbpService.isViewUpdated = false;
      setTimeout(() => { this.cbpService.detectWholePage = false; }, 10);
    }
  }
  ngOnInit(): void {
    if (this.builderUtil.uniqueIdIndex < Number(this.field?.dgUniqueID)) {
      this.builderUtil.uniqueIdIndex = Number(this.field?.dgUniqueID);
      if (Number(this.cbpService.cbpJson.documentInfo[0]['dgUniqueID']) < this.builderUtil.uniqueIdIndex) {
        this.cbpService.cbpJson.documentInfo[0]['dgUniqueID'] = this.builderUtil.uniqueIdIndex;
      }
    }
    // this.field = this.cbpService.setCbpUserInfo(this.field);
    this.detectviewSubscribe = this.controlService.detectAllChangeView$.subscribe((result: any) => {
      if (result === true) {
        this.cdref.detectChanges();
      }
    });
  }

  getInfoFromLink(event: any) {
    this.linkCall.emit({ 'component': 'link' });
  }
  getTableInfoFromDataEntries(event: any) {
    this.tableInfo.emit(event);
  }
  notfyParentTable(event: any) {
    // this.cbpService.tableDataEntrySelected = event;
    console.log(event);
  }
  notifyParentEvent(event: any) {
    this.cbpService.tableDataEntrySelected = event;
  }
  ngOnDestroy() {
    this.detectviewSubscribe?.unsubscribe();
  }
}
