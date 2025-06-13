import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { CbpService } from '../../../services/cbp.service';
import { ControlService } from '../../../services/control.service';
import { TableService } from '../../../shared/services/table.service';
import { BuilderUtil } from '../../../util/builder-util';
import { HyperLinkService } from '../../services/hyper-link.service';

@Component({
  selector: 'lib-showlabelprompt',
  templateUrl: './showlabelprompt.component.html',
  styleUrls: ['./showlabelprompt.component.css']
})
export class ShowlabelpromptComponent implements OnInit {
  @Input() field: any;
  @Output() fieldChange: EventEmitter<any> = new EventEmitter<any>();
  DgTypes = DgTypes;
  propName = 'showLablePrompt';
  styleObject: any;
  subScription!: Subscription;
  currentField: any;
  constructor(public cbpService: CbpService, public _buildUtil: BuilderUtil,
    public hLService: HyperLinkService, public tableService: TableService,
    public cdref: ChangeDetectorRef, public controlService: ControlService
  ) { }

  ngOnInit(): void {
    if (this.field.dgType === DgTypes.CheckboxDataEntry) {
      this.propName = 'prompt';
    }
    this.subScription = this.controlService.styleModelobjValue.subscribe((res: any) => {
      if (res && res !== undefined && !this.controlService.isEmpty(res)) {
        this.styleObject = this.controlService.setStyles(res['levelNormal']);
        if (this.cbpService.styleChangeBarSession?.includes('Normal') && !this._buildUtil.cbpStandalone) {
          this.updateChangeBar(this.field);
        }
        this.cdref.detectChanges();
      }
    });
    this.currentField = JSON.parse(JSON.stringify(this.field));
  }

  outputhtml(event: any, item: any) {
    if (item.isCover)
      this.field.editorOpened = false;
    this.field[this.propName] = event;
    this.field['isHtmlText'] = true;
    // this.field = this.hLService.outputhtml(event, item, this.propName);
    this.setFieldCheck()
  }
  setFieldPromptValue(event: any) {
    if (!this.field) {
      this.cbpService.tableDataEntrySelected = this.field;
    }
    if (this.field?.isCover) {
      this.field[this.propName] = event;
    }
    this.setFieldCheck()
  }
  editorOpened(item: any, prop = null) {
    this.field = this.hLService.editorOpenednewUpdate(item);
    if (this.field['isHtmlText']) {
      this.field['editorOpened'] = true;
    }
    this.setFieldCheck()
  }
  setFieldCheck() {
    this.fieldChange.emit(this.field);
  }
  ngOnDestroy() {
    this.subScription?.unsubscribe();
  }
  viewUpdate() {
    if (JSON.stringify(this.field) !== JSON.stringify(this.currentField)) {
      this.updateChangeBar(this.field);
    }
  }
  updateChangeBar(field: any) {
    if (field.isTableDataEntry) {
      let table = this._buildUtil.getElementByDgUniqueID(this.field.parentDgUniqueID, this.cbpService.cbpJson);
      if (!table) {
        table = this._buildUtil.getElementByDgUniqueID(Number(this.field.parentDgUniqueID), this.cbpService.cbpJson);
      }
      if (table)
        this.cbpService.setUserUpdateInfo(table);
    } else {
      this.field = this.cbpService.setUserUpdateInfo(this.field);
    }
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }
  editorClose(event: any) {
    if (event?.from == 'AngularEditor') {
      this.field.editorOpened = false;
      this.field['isHtmlText'] = true;
    }
  }
}
