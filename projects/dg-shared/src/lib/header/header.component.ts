import { Component, EventEmitter, Input, OnInit, Output ,} from '@angular/core';
import { Router } from '@angular/router';

export interface TopBarInfo{
  setupUrl:string;
  logo:string;
  default:string;
  userLogo:string;
  userEmail:string;
  userName:string;
  showNav?:boolean;
}

@Component({
  selector: 'dt-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.css' ]
})
export class HeaderComponent implements OnInit {

  @Input() topBarInfo!:TopBarInfo;
  @Input() isTitleEnable = false;
  @Input() titleInfo!:any;
  @Input() cbp= false;
  @Input() documentType!:any;
  @Input() propertyDocument!:any;
  @Output() changeSidebarEvent:EventEmitter<any> = new EventEmitter<any>();
  @Output() logoutEvent:EventEmitter<any> = new EventEmitter<any>();
  @Output() myProfileEvent:EventEmitter<any> = new EventEmitter<any>();
  @Output() myAboutEvent:EventEmitter<any> = new EventEmitter<any>();
  @Output() closeCBPEvent:EventEmitter<any> = new EventEmitter<any>();
  @Output() ewpExitEvent:EventEmitter<any> = new EventEmitter<any>()

  constructor(public router: Router) { }

  ngOnInit(): void {
    if(this.topBarInfo['showNav'] == undefined){
      this.topBarInfo['showNav'] = true;
    }
  }
  handleError(event: any) {
    event.target.src = this.topBarInfo.default;
  }
  changeSideBar(){
    this.changeSidebarEvent.emit('changeSidebar');
  }
  logout(){
   this.logoutEvent.emit('logout');
  }
  openMyProfile(){
    this.myProfileEvent.emit('profile');
  }
  openMyAbout(){
    this.myAboutEvent.emit('about');
  }
  gotoAdmin(){
    if(!this.cbp){
      this.router.navigateByUrl(this.topBarInfo.setupUrl)
    }
    else if(this.documentType == "EXECUTE"){
    console.log("in CBP EWP")
    this.ewpExitEvent.emit()
    }
    else{
      this.closeCBPEvent.emit('close')
    }
   
  }


}
