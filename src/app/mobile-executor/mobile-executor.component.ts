import { Component, OnInit } from '@angular/core';
declare var cbpJson: any;
declare var dataJson: any;
declare var styleJson: any;
declare var styleImageJson: any;
declare var layoutJson: any;
declare var defaultStyleImageJson: any;
//future
declare var execution_order: any;

declare var ACTIVE_CBP_PATH: any;
@Component({
  selector: 'app-mobile-executor',
  templateUrl: './mobile-executor.component.html',
  styleUrls: ['./mobile-executor.component.css']
})
export class MobileExecutorComponent implements OnInit {
  cbpJson:any=cbpJson;
  dataJson:any=dataJson;
  styleJson:any=styleJson;
  styleImageJson:any=styleImageJson;
  layoutJson:any=layoutJson;
  defaultStyleImageJson:any=defaultStyleImageJson;
  execution_order:any=execution_order;
  ACTIVE_CBP_PATH:any=ACTIVE_CBP_PATH;
  isExecutor:boolean=false;
  userAPIInfo:any;
  constructor() { }

  ngOnInit(): void {
    
  }

  gotoExecutor(){
   this.isExecutor=!this.isExecutor;
  }

}
