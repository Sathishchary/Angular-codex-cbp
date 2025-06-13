import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { DgTypes, ImagePath, SequenceTypes } from 'cbp-shared';
import { CbpService } from '../../../../services/cbp.service';
import { ControlService } from '../../../../services/control.service';
import { BuilderUtil } from '../../../../util/builder-util';
import { LayoutService } from '../../../../shared/services/layout.service';
import { StyleLevel } from '../../../../models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-table-form-builder',
  templateUrl: '../../../dynamic-form-builder.component.html',
  styleUrls: ['../../../dynamic-form-builder.component.css']
})
export class TableFormBuilderComponent implements OnInit {

  @Input() field: any;
  @Input() media: any;
  @Input() rowcolInfo: any;
  @Input() stepObject: any;
  styleLevelObj!: StyleLevel;
  @Input() headerWidth:any;
  @Input() isCoverPage: any;

  @Output() tableInfo: EventEmitter<any> = new EventEmitter();
  @Output() linkCall: EventEmitter<any> = new EventEmitter();
  @Output() getNotifyParent: EventEmitter<any> = new EventEmitter();
  @Output() selectedField: EventEmitter<any> = new EventEmitter();

  DgTypes: typeof DgTypes = DgTypes;
  ImagePath: typeof ImagePath = ImagePath;
  setItemSubscription!: Subscription;
  sequenceTypes: typeof SequenceTypes = SequenceTypes;

  constructor(public cbpService: CbpService, public controlService: ControlService,
    private _buildUtil: BuilderUtil, public cdr: ChangeDetectorRef,public layoutService: LayoutService) {
  }
  ngOnInit(): void {
    if (this._buildUtil.uniqueIdIndex < Number(this.field?.dgUniqueID)) {
      this._buildUtil.uniqueIdIndex = Number(this.field?.dgUniqueID);
    }
    this.setItemSubscription = this.controlService.selectedObjValue.subscribe((result:any)=>{
      if (result && result !== undefined && result?.dgType !== undefined) {
        this.cbpService.selectedUniqueId = result.dgUniqueID;
        this.cbpService.selectedElement = result;
        this.cdr.detectChanges();
      }
    });
  }

  getInfoFromLink(event:any){
    this.linkCall.emit({'component': 'link'});
  }
  getTableInfoFromDataEntries(event:any){
   this.tableInfo.emit(event);
  }

  notfyParentTable(event: any) {
    this.getNotifyParent.emit(event);
  }
  notifyParentEvent(field:any) {
    this.selectedField.emit(field)
  }

  ngOnDestroy(){
    this.setItemSubscription?.unsubscribe();
  }
}
