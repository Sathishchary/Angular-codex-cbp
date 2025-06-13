import { Component, Input, OnInit, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { DatashareService } from '../../services/datashare.service';
import { ExecutionService } from '../../services/execution.service';
import { Subscription } from 'rxjs';
import { SharedviewService } from '../../services/sharedview.service';
import { CbpExeService } from '../../services/cbpexe.service';
declare const $: any;

/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */

@Component({
  selector: 'app-link-view',
  templateUrl: './link-view.component.html',
  styleUrls: ['./link-view.component.css']
})
export class LinkViewComponent implements OnInit {
  @Input() stepObject: any;
  @Input() obj: any;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  isMobile = false;
  styleObject:any = {};
  styleModel_subscription!: Subscription;

  constructor(public cdr:ChangeDetectorRef, public executionService: ExecutionService, public cbpService:CbpExeService,
    private dataSharingService: DatashareService, public sharedviewService: SharedviewService) {
      this.isMobile = this.dataSharingService.getMenuConfig()?.isMobile;
    }

  ngOnInit(){
    this.styleModel_subscription = this.executionService.styleModelobjValue.subscribe((res: any) => {
      if (res && res!='{}' && !this.executionService.isEmpty(res)) {
        let name = 'level'+ this.sharedviewService.capitalize(this.stepObject.source);
        this.styleObject = this.sharedviewService.setStyles(res[name]);
        this.cdr.detectChanges();
      }
    });
    const self = this;
    $('.popuptextClose').click(function(e:any){
      $('#refObjLinkDrop-'+self.executionService.refObjID).find('.popuptextContent').remove();
       $('.popuptext').css("display", "none");
       self.executionService.refObjValueState = 0
       e.stopPropagation();
    });
    $('.hyperlink').unbind().click(function(e:any){
      self.executionService.setrefObj(e);
      e.stopPropagation();
    });
    this.cdr.detectChanges();
  }
  openReferenceInLinkTab(stepObject: any, e: any) {
    this.closeEvent.emit(stepObject);
  }
  ngOnDestroy(): void {
    this.styleModel_subscription?.unsubscribe();
  }
}
