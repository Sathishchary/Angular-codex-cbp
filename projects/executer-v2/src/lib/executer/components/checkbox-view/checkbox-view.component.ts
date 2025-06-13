import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { CbpExeService } from '../../services/cbpexe.service';
import { DatashareService } from '../../services/datashare.service';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';
declare const $: any, swal: any;

@Component({
  selector: 'app-checkbox-view',
  templateUrl: './checkbox-view.component.html',
  styleUrls: ['./checkbox-view.component.css']
})
export class CheckboxViewComponent {
  @Input() stepObject: any;
  @Input() obj: any;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  dgType = DgTypes;
  styleObject: any;
  styleModel_subscription!: Subscription;
  constructor(public cbpService: CbpExeService, public sharedviewService: SharedviewService,
    public executionService: ExecutionService, public cdr: ChangeDetectorRef,
    public datashareService: DatashareService) {
  }
  ngOnInit() {
    if (this.stepObject?.isTableDataEntry) {
      this.cbpService.storeTempMapID(this.stepObject['fieldName'], this.stepObject);
    }
    if (this.stepObject.valueType == 'Selected' && (this.stepObject?.storeValue == '' || this.stepObject?.storeValue == undefined)) {
      this.stepObject.storeValue = true;
    } else if (typeof this.stepObject.storeValue == 'string') {
      this.stepObject.storeValue = this.stepObject.storeValue == "true" ? true : false;
    } else if (!this.stepObject.storeValue) {
      this.stepObject.storeValue = false;
    }
    const self = this
    $('.popuptextClose').click(function (e: any) {
      $('#refObjLinkDrop-' + self.executionService.refObjID).find('.popuptextContent').remove();
      $('.popuptext').css("display", "none");
      self.executionService.refObjValueState = 0
      e.stopPropagation();
    })
    $('.hyperlink').unbind().click(function (e: any) {
      self.executionService.setrefObj(e);
      e.stopPropagation();
    });
    this.cdr.detectChanges();
  }
  ngAfterViewInit(): void {
    this.styleModel_subscription = this.executionService.styleModelobjValue.subscribe((res: any) => {
      if (res && res != '{}' && !this.executionService.isEmpty(res)) {
        this.styleObject = this.sharedviewService.setStyles(res['levelNormal']);
        this.styleObject = this.sharedviewService.setBackgroundTrans(this.styleObject);
        this.cdr.detectChanges();
      }
    });
  }

  checkValidation(eventV: any, eventObj: any, eventValue: any, bol: boolean) {
    this.cbpService.isInputClicked();
    this.executionService.selectedField({ stepItem: this.obj, stepObject: this.stepObject, showMenuText: true });
    eventObj.storeValue = bol;
    this.closeEvent.emit({ event: eventV, stepObj: eventObj, value: bol })
    this.cdr.detectChanges();
  }
  ngOnDestroy(): void {
    this.styleModel_subscription?.unsubscribe();
  }
  storeItemOfEnter(stepObject: any, value: any) {
    stepObject.oldValue = stepObject?.oldValue ? stepObject.oldValue : false;
    if (value !== stepObject?.oldValue) {
      let dataInfoObj = this.sharedviewService.storeDataObj(stepObject, value);
      this.cbpService.dataJson.dataObjects.push(dataInfoObj);
      this.datashareService.changeCount++;
    }
  }
}
