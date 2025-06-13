import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'lib-track-user',
  templateUrl: './track-user.component.html',
  styleUrls: ['./track-user.component.css']
})
export class TrackUserComponent implements OnInit {
  @Input() stepObject:any;
  @Output() closePopupEvent:EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  closePopup(event:Event){
    console.log('close click');
    this.stepObject.commentsEnabled = false;
    this.closePopupEvent.emit();
    event.stopPropagation();
  }

}
