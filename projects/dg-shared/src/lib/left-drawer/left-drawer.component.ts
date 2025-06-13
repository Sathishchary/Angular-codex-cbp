import { Component, OnInit, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';

export interface listObj{
  displayUrl:string;
  url:string;
  icon:string;
  isSelected?:boolean;
  disabled?:boolean;
}

@Component({
  selector: 'dg-lib-drawer',
  templateUrl: './left-drawer.component.html',
  styleUrls: ['./left-drawer.component.css']
})
export class LeftDrawerComponent implements OnInit, OnChanges {

  @Input() routerList:listObj[] = [];

  constructor(public location: Location) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.routerList && this.routerList) {
      this.routerList = changes.routerList.currentValue;
    }
  }

  ngOnInit(): void {
  }
 

}
