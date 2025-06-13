import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { CbpExeService } from '../../services/cbpexe.service';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';
/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */
declare const $: any, swal: any;

@Component({
  selector: 'app-verification-view',
  templateUrl: './verification-view.component.html',
  styleUrls: ['./verification-view.component.css']
})
export class VerificationViewComponent implements AfterViewInit {

  @Input() stepObject: any;
  @Input() obj: any;
  @Output()
  closeEvent: EventEmitter<any> = new EventEmitter();
  dgType = DgTypes;
  styleModel!: any;
  styleObject: any;
  styleModel_subscription!: Subscription;
  constructor(public cbpService: CbpExeService, public executionService: ExecutionService, public cdr: ChangeDetectorRef,
    public sharedviewService: SharedviewService) {
  }

  ngAfterViewInit(): void {
    this.styleModel_subscription = this.executionService.styleModelobjValue.subscribe((res: any) => {
      if (res && res != '{}' && !this.executionService.isEmpty(res)) {
        this.styleObject = this.sharedviewService.setStyles(res['levelNormal']);
        this.cdr.detectChanges();
      }
    });
    const self = this;
    $('.popuptextClose').click(function (e: any) {
      $('#refObjLinkDrop-' + self.executionService.refObjID).find('.popuptextContent').remove();
      $('.popuptext').css("display", "none");
      self.executionService.refObjValueState = 0
      e.stopPropagation();
    })
    $('.hyperlink').unbind().click(function (e: any) {
      self.executionService.setrefObj(e);
      e.stopPropagation();
    })
    this.cdr.detectChanges();
  }

  openVerification(obj: any) {
    if ((this.stepObject?.disableField || this.stepObject?.protect)) return;
    this.closeEvent.emit(obj);
  }
  ngOnDestroy(): void {
    this.styleModel_subscription?.unsubscribe();
  }

}
