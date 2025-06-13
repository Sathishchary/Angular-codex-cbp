import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { CbpExeService } from '../../services/cbpexe.service';
import { DatashareService } from '../../services/datashare.service';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';
declare const $: any;
/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */

@Component({
  selector: 'app-boolean-view',
  templateUrl: './boolean-view.component.html',
  styleUrls: ['./boolean-view.component.css']
})
export class BooleanViewComponent implements AfterViewInit, OnDestroy {

  @Input() stepObject: any;
  @Input() obj: any;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  @Input() headerwidth: any;
  dgType = DgTypes;
  styleObject: any;
  styleModel_subscription!: Subscription;
  constructor(public cbpService: CbpExeService, private sharedviewService: SharedviewService,
    public cdr: ChangeDetectorRef, public executionService: ExecutionService,
    public datashareService: DatashareService) {

  }
  ngAfterViewInit(): void {
    if (this.stepObject?.isTableDataEntry) {
      this.cbpService.storeTempMapID(this.stepObject['fieldName'], this.stepObject);
    }
    this.styleModel_subscription = this.executionService.styleModelobjValue.subscribe((res: any) => {
      if (res && res != '{}' && !this.executionService.isEmpty(res)) {
        this.styleObject = this.sharedviewService.setStyles(res['levelNormal']);
        this.styleObject = this.sharedviewService.setBackgroundTrans(this.styleObject);
        this.cdr.detectChanges();
      }
    });
    const self = this
    $('.popuptextClose').click(function (e: any) {
      $('#refObjLinkDrop-' + self.executionService.refObjID).find('.popuptextContent').remove();
      $('.popuptext').css("display", "none");
      self.executionService.refObjValueState = 0
      e.stopPropagation();
    });
    $('.hyperlink').unbind().click(function (e: any) {
      self.executionService.setrefObj(e);
      e.stopPropagation();
    });
    this.cdr.detectChanges();
  }
  storeItemOfEnter(stepObject: any, value: any) {
    stepObject.oldValue = stepObject?.oldValue ? stepObject.oldValue : 0;
    if (value != stepObject?.oldValue) {
      let dataInfoObj = this.sharedviewService.storeDataObj(stepObject, value);
      this.cbpService.dataJson.dataObjects.push(dataInfoObj);
      this.datashareService.changeCount++;
    }
  }
  checkValidation(eventV: any, eventObj: any, eventValue: any) {
    this.cbpService.isInputClicked();
    this.executionService.selectedField({ stepItem: this.obj, stepObject: this.stepObject, showMenuText: true });
    // this.storeItemOfEnter(eventObj, eventValue);
    this.closeEvent.emit({ event: eventV, stepObj: eventObj, value: eventValue })
  }
  ngOnDestroy(): void {
    this.styleModel_subscription?.unsubscribe();
  }
}
