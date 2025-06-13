import { Component, Input, AfterViewInit } from '@angular/core';
import { ExecutionService } from '../../services/execution.service';
declare const $: any, swal: any;

@Component({
  selector: 'app-formula-view',
  templateUrl: './formula-view.component.html',
  styleUrls: ['./formula-view.component.css']
})
export class FormulaViewComponent implements AfterViewInit {
  @Input() stepObject: any;
  @Input() obj: any;

  constructor( public executionService: ExecutionService) {}
  ngAfterViewInit(): void {
    setTimeout(function () {
     const mathJax:any = (<any>window).MathJax;
     mathJax.Hub.Queue(["Typeset", mathJax.Hub]);
    });
    const self = this
    $('.popuptextClose').click(function(e:any){
     
      $('#refObjLinkDrop-'+self.executionService.refObjID).find('.popuptextContent').remove();
       $('.popuptext').css("display", "none");
       self.executionService.refObjValueState = 0
       e.stopPropagation();
    })
    
    $('.hyperlink').unbind().click(function(e:any){
     
      self.executionService.setrefObj(e);
      e.stopPropagation();
  })
   
  }

}
