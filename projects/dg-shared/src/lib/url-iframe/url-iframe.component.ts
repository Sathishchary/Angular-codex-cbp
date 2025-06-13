import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-url-iframe',
  templateUrl: './url-iframe.component.html',
  styleUrls: ['./url-iframe.component.css']
})
export class UrlIframeComponent implements OnInit {

  @Input()
  fileInfo: any;


  @Input()
  activeTab = -1;

  @Output()
  notifyParent: EventEmitter<any> = new EventEmitter();

  @Input()
  changeEvent: any;
  @Input()
  actionEvent: any;

  constructor() { }

  ngOnInit(): void {
  }

}
