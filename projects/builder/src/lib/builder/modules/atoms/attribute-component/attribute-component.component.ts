import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { Actions, AuditTypes } from '../../../models';
import { AuditService } from '../../../services/audit.service';
import { CbpService } from '../../../services/cbp.service';
import { ControlService } from '../../../services/control.service';
import { TableService } from '../../../shared/services/table.service';
import { HyperLinkService } from '../../services/hyper-link.service';

@Component({
  selector: 'lib-attribute-component',
  templateUrl: './attribute-component.component.html',
  styleUrls: ['./attribute-component.component.css']
})
export class AttributeComponentComponent implements OnInit {

  objTitle: any = {}
  @Input() field: any = {};
  @Input() rowcolInfo: any;
  @Input() coverpage: boolean = false;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  AuditTypes: typeof AuditTypes = AuditTypes;
  DgTypes: typeof DgTypes = DgTypes;
  procedure = 'Procedure';
  instructions = 'work instructions';
  readOnly: boolean = false;
  selectProperty: boolean = false;
  selectedField: any;
  displayType: any;
  styleObject: any;
  style_subscription!: Subscription;

  constructor(public cbpService: CbpService, public auditService: AuditService, public cdr: ChangeDetectorRef,
    public controlService: ControlService, public tableService: TableService, public hLService: HyperLinkService) { }

  ngOnInit(): void {
    this.cbpService.listAttributes.forEach((item: any) => {
      if (item.property === this.field.property) {
        this.displayType = item.displayType
      }
    });
    this.style_subscription = this.controlService.styleModelobjValue.subscribe((res: any) => {
      if (res && res !== undefined && !this.controlService.isEmpty(res)) {
        let item = this.field?.styleSet;
        if ((item?.fontSize == '12px' && item?.fontName == 'Poppins' && item?.color == '#000000' &&
          item?.textalign == 'left') || !item) {
          this.styleObject = this.controlService.setStyles(res['levelNormal']);
          delete this.styleObject['background-color'];
        } else {
          this.styleObject = {};
        }
        this.cdr.detectChanges();
      }
    });
  }
  selectedForTable() {
    this.cbpService.tableDataEntrySelected = this.field;
    this.tableService.setDataEntry(this.cbpService.tableDataEntrySelected);
    this.notifyParent.emit()
  }

  selectElement() {
    this.cbpService.selectedElement.isTableAttributes = this.cbpService.propertyDocument;
  }
  editorOpened(item: any, prop = null) {
    this.readOnly = true;
    if (!this.tableService.isBorderRemove) {
      this.field = this.hLService.editorOpenednewUpdate(item);
      if (this.field['isHtmlText']) {
        this.field['editorOpened'] = true;
      }
    }
    else {
      this.field['editorOpened'] = false;
    }
  }
  enableTextarea() {
    (document.getElementById('textarea' + this.field.dgUniqueID) as HTMLElement).focus();
  }
  outputhtml(event: any, item: any, propName: any) {
    this.field = this.hLService.outputhtmlNew(event, item, propName);
    this.controlService.hideTrackUi({ 'trackUiChange': true });
    this.readOnly = false;
  }
  createAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.cbpService.selectedElement));
    this.selectProperty = false;
  }
  close(event: any) {
    this.field.prompt = event.target.innerHTML;
    console.log(this.field.prompt);
    this.field['editorOpened'] = false;
  }
  ngOnDestroy() {
    this.style_subscription.unsubscribe();
  }
}

