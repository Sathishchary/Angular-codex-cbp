import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DgTypes, ImagePath } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { Actions, AuditTypes } from '../../../models';
import { AuditService } from '../../../services/audit.service';
import { CbpService } from '../../../services/cbp.service';
import { ControlService } from '../../../services/control.service';
import { BuilderUtil } from '../../../util/builder-util';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['../../../util/atoms.css']
})
export class FormulaComponent implements OnInit {
  @Input() field: any = {};
  isEditorOpend: boolean = false;
  DgTypes: typeof DgTypes = DgTypes;
  ImagePath: typeof ImagePath = ImagePath;
  AuditTypes: typeof AuditTypes = AuditTypes;
  setItemSubscription!: Subscription;
  @ViewChild('mathFormula', { static: false }) mathFormulaValue: any;
  fieldSnapChat!: any;

  constructor(public cbpService: CbpService, public _buildUtil: BuilderUtil,
    public controlService: ControlService, public cd: ChangeDetectorRef,
    public auditService: AuditService) { }

  ngOnInit() {
    if (!this.field.isTableDataEntry) {
      this.field = this.cbpService.setDataEntryFieldName(this.field, DgTypes.FormulaDataEntry);
    }
    this.setItemSubscription = this.controlService.selectedObjValue.subscribe((result: any) => {
      if (result && result !== undefined && result?.dgType !== undefined) {
        this.cbpService.selectedUniqueId = result.dgUniqueID;
        this.cbpService.selectedElement = result;
        this.cd.detectChanges();
      }
    });
    this.fieldSnapChat = JSON.parse(JSON.stringify(this.field));
  }
  ngDoCheck(): void {
    if (this.mathFormulaValue !== undefined) {
      if (this.field && this.field.content.equation !== '') {
        setTimeout(function () {
          const mathJax: any = (<any>window).MathJax;
          try { if (mathJax['Hub']) { mathJax.Hub.Queue(["Typeset", mathJax.Hub]); } } catch (err) { }
        }, 1);
      }
    }
  }
  formulaOpened() {
    this.isEditorOpend = this.cbpService.selectedElement.dgType === DgTypes.FormulaDataEntry ? false : true;
  }
  selectElement() {
    if (this.cbpService.sectionHover) {
      this.auditService.settingStepOptionButns(this.field);
    }
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.field));
    this.controlService.setSelectItem(this.field);
  }
  createAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.cbpService.selectedElement, Actions.Update, auditType, optionalParams);
  }

  ngOnDestroy() {
    this.setItemSubscription?.unsubscribe();
  }

  setValue(event: any) {
    this.field.content.equation = event.target.value;
  }
  updateViewTrack() {
    this.field = this.cbpService.setUserUpdateInfo(this.field);
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }
}
