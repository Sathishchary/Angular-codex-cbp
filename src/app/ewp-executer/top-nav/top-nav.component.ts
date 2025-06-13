import { Component, OnInit, Input, SimpleChanges,Output,EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {
  @Input() propertyDocument: any;
  loggedInUserName:any ='';
  @Input() documentType = '';
  @Output() closeCBPEventCheck:EventEmitter<any> = new EventEmitter<any>();
  @Output() closeCBPEwpEvent:EventEmitter<any> =  new EventEmitter<any>() ;
  
  topBarObj:any;
  constructor(public router: Router) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.propertyDocument && changes.propertyDocument){
      this.propertyDocument = changes.propertyDocument.currentValue;
    }
    if(this.documentType && changes.documentType){
      this.documentType = changes.documentType.currentValue;
    }
  }
  ngOnInit() {
    $(document).ready(function () { $('.dropdown-toggle').dropdown(); });
    this.topBarObj = {
      setupUrl: '',
      logo: 'assets/cbp/images/DGCBP.svg',
      userLogo: 'assets/cbp/images/user-small.png',
      userEmail: this.loggedInUserName,
      userName : this.loggedInUserName,
      showNav: false
    };
  }
  openMyProfile(){
    
  }
  ewpExitEventTop(){
    this.closeCBPEwpEvent.emit()
  }

  closeCBPEvent(){
    this.closeCBPEventCheck.emit('close')
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('language');
    localStorage.clear();
    }
}
