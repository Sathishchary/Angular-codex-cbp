import { Component, EventEmitter, Input, ChangeDetectorRef, Output, AfterViewInit } from '@angular/core';
import { DgTypes } from '../../models';
import { ImagePath } from '../../models';
import { CbpSharedService } from '../../cbp-shared.service';

@Component({
  selector: 'lib-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent implements AfterViewInit {
  imagePath: typeof ImagePath = ImagePath;
  errorMsgImg: any;
  @Input() errorDgType:any;
  @Input() displayMsg:any;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();

  constructor(public cdref: ChangeDetectorRef, public cbpSharedService: CbpSharedService) { }

  ngAfterViewInit(): void {
    if(this.errorDgType=== DgTypes.Warning){
      this.errorMsgImg = this.imagePath.warningImg;
    }
    if(this.errorDgType === DgTypes.ErrorMsg){
      this.errorMsgImg = this.imagePath.errorMsg;
    }
    this.cbpSharedService.openModalPopup('error-modal');
    this.cdref.detectChanges();
  }
  closeModal(){
    this.closeEvent.emit();
    this.cbpSharedService.closeModalPopup('error-modal');
  }

}
