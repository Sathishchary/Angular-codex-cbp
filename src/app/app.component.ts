import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import { Page } from 'dist/validation-routien/lib/_models/_page';
// import { Validation } from 'validation-routien';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dataglane executor';
  loggedInUser = false;
  userAPIInfo: any;

  pageViewEnabled = false;//for mobile sdk
  wrapperViewEnabled = false;
  mobileViewEnabled = false;
  ewpWrapperViewEnabled = false; // for kathir's sdk
  cbpEditor = true;

  constructor(public router: Router) {

  }
  ngOnInit() {
    if (window.location.href.includes('/executor')) {
      this.setPageItems(false, false, false, true, false);
    }

  }
  setPageItems(pageView: boolean, wrapper: boolean, mobile: boolean, ewp: boolean, cbp: boolean) {
    this.pageViewEnabled = pageView;
    this.wrapperViewEnabled = wrapper;
    this.mobileViewEnabled = mobile;
    this.ewpWrapperViewEnabled = ewp;
    this.cbpEditor = cbp;
  }
  getUserApi(event: any) {
    this.userAPIInfo = event.userApi;
    this.loggedInUser = true;
  }
  setCBP(ev: any) {
    if (ev === 'tablet')
      this.setPageItems(true, false, false, false, false);
    if (ev === 'executer')
      this.setPageItems(false, true, false, false, false);
  }
}
