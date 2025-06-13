import { Component, OnInit, Input, EventEmitter,Output } from '@angular/core';
import { CbpSharedService } from 'cbp-shared';

@Component({
  selector: 'lib-showcrcomment',
  templateUrl: './showcrcomment.component.html',
  styleUrls: ['./showcrcomment.component.css']
})
export class ShowcrcommentComponent implements OnInit {
  @Input() number :any;
  @Input() typeOfModal :any;
  @Input() comments:any;
  @Input() crArrayData:any;
  stepComments:any[] = [];
  stepCrArrayData:any[] = [];

  @Output() closeEvent: EventEmitter<any> =  new EventEmitter<any>();
  constructor(public sharedService: CbpSharedService) { }

  ngOnInit(): void {
    this.stepComments = this.comments.filter((item:any)=>item.selectedStepDgUniqueId === this.number);
    this.stepCrArrayData = this.crArrayData.filter((item:any)=>item.selectedStepDgUniqueId === this.number);
    this.sharedService.openModalPopup('commentsCrModal');
  }
  cancel(){
    this.sharedService.closeModalPopup('commentsCrModal');
    this.closeEvent.emit(false);
  }

}
