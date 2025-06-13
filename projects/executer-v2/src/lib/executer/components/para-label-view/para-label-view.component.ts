
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { ExecutionService } from '../../services/execution.service';
import { CbpExeService } from '../../services/cbpexe.service';
import { Subscription } from 'rxjs';
import { SharedviewService } from '../../services/sharedview.service';
import { DataJsonService } from './../../services/datajson.service';

/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */
declare const $: any;

@Component({
  selector: 'app-para-label-view',
  templateUrl: './para-label-view.component.html',
  styleUrls: ['./para-label-view.component.css']
})
export class ParaLabelViewComponent implements OnInit  {

  @Input() stepObject: any;
  @Input() obj: any;
  @Input() isCoverPage: any;
  
  dgType = DgTypes;
  styleModel!:any;
  styleObject:any;
  styleModel_subscription!: Subscription;
  constructor(public sharedviewService: SharedviewService, public executionService: ExecutionService,
    public cbpService: CbpExeService, public cdr: ChangeDetectorRef, public dataJsonService: DataJsonService) { }

  ngOnInit(){
    this.styleModel_subscription = this.executionService.styleModelobjValue.subscribe((res: any) => {
      if (res && res!='{}' && !this.executionService.isEmpty(res)) {
        this.styleObject = this.sharedviewService.setStyles(res['levelNormal']);
        this.styleObject = this.sharedviewService.setBackgroundTrans(this.styleObject);
        this.cdr.detectChanges();
      }
    });
    const self = this;
    $('.popuptextClose').click(function(e:any){
      $('#refObjLinkDrop-'+self.executionService.refObjID).find('.popuptextContent').remove();
       $('.popuptext').css("display", "none");
       self.executionService.refObjValueState = 0
       e.stopPropagation();
    })
    $('.hyperlink').unbind().click(function(e:any){
      self.executionService.setrefObj(e);
      e.stopPropagation();
    });
    this.cdr.detectChanges();
  }

  selectStep(obj: any, type: string) {
    console.log(obj, type);
    this.cbpService.handleSelection('', obj, 'prompt')
  }

  ngOnDestroy(): void {
    this.styleModel_subscription?.unsubscribe();
  }

}
