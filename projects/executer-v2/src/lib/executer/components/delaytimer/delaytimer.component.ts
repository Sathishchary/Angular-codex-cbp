import { Component, OnInit, EventEmitter, Output, Input, OnDestroy, ViewChild } from '@angular/core';
import { CbpSharedService } from 'cbp-shared';
import { CountdownComponent } from 'ngx-countdown';
import { CbpExeService } from '../../services/cbpexe.service';
import { ExecutionService } from '../../services/execution.service';
// @author: Sathish Kotha

@Component({
  selector: 'app-delaytimer',
  templateUrl: './delaytimer.component.html',
  styleUrls: ['./delaytimer.component.css'],
  interpolation: ['$$', '$$']
})
export class DelaytimerComponent implements OnInit, OnDestroy {
  @Input() selectedStepSectionInfo: any;
  @Output()
  closeEvent: EventEmitter<any> =  new EventEmitter();
  @ViewChild('cd', { static: false }) private countdown!: CountdownComponent;
  @Input() stepTime = 20;
  message = 'Time Left';
  constructor(public cbpService: CbpExeService, public sharedService: CbpSharedService, public executionService: ExecutionService) { }

  ngOnInit() {
    this.sharedService.openModalPopup('delayTimer');
  }
  timerFinished(e:any){
   if (e.action === "done"){
     this.closeEvent.emit(this.selectedStepSectionInfo);
   }
  }
  closeTimer(){
    this.closeEvent.emit({'object': this.selectedStepSectionInfo, 'time': this.countdown.i.text});
  }
  delayVerify() {
    this.closeEvent.emit(this.selectedStepSectionInfo);
  }
  closeModal() {
    this.sharedService.closeModalPopup('delayTimer');
  }
  ngOnDestroy(): void {
    this.closeModal();
  }

}
