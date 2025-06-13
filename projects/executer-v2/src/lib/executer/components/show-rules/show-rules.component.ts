import { Component, OnInit,Input, Output,EventEmitter } from '@angular/core';
import { CbpSharedService } from 'cbp-shared';

@Component({
  selector: 'lib-show-rules',
  templateUrl: './show-rules.component.html',
  styleUrls: ['./show-rules.component.css']
})
export class ShowRulesComponent implements OnInit {

  @Input() rules:any;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  constructor(  public sharedService: CbpSharedService) { }

  ngOnInit(): void {
    console.log(this.rules);
  }

  ok(){
    this.closeEvent.emit()
  }

}
