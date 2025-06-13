import { Component, OnInit, OnDestroy} from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { Actions,AuditTypes} from '../../models';
import { AuditService } from '../../services/audit.service';
import { CbpService } from '../../services/cbp.service';
import { BuilderService } from '../../services/builder.service';
import {CbpSharedService } from 'cbp-shared';

export enum LINK_EMEADIA{
  Assets="ASSETS",
  Collections="COLLECTION"
}
@Component({
  selector: 'app-link-assets',
  templateUrl: './link-assets.component.html',
  styleUrls: ['./link-assets.component.css']
})
export class LinkAssetsComponent implements OnInit,OnDestroy {
  listOfAssets = [];
  userName = '';
  password = '';
  userId = '';
  companyId = '';
  accessToken = '';
  linkloading = false;
  name!: any;
  type =LINK_EMEADIA.Assets;
  constructor(public cbpService:CbpService, public notifier: NotifierService,
    public auditService: AuditService, private builderService: BuilderService, public sharedService: CbpSharedService) { }


  ngOnInit() {
    this.sharedService.openModalPopup('link-assets');
    this.userInfo();
  }
  hide(){
   this.cbpService.isLinkAssetsOpen = false;
    this.sharedService.closeModalPopup('link-assets');
  }
   userInfo(){
    let currentUser:string|null = localStorage?.getItem('currentUser');
    let userStorageInfo:any = currentUser ? JSON.parse(currentUser) : null;
    this.accessToken = userStorageInfo.access_token;
    this.userId = userStorageInfo.loggedInUserID;
    this.companyId = userStorageInfo.companyID;
    let isArrayOfProducts = userStorageInfo.products;
    if(isArrayOfProducts.find((obj:any) => obj === "/emedia")){
      this.getAssets();
    } else {
      this.notifier.hideAll();
      this.notifier.notify('info', 'No Records are available for this user');
    }
   }
  getAssets(){
    this.cbpService.selectedElement['id'] = '';
    this.type = LINK_EMEADIA.Assets;
    this.customSearch(this.userId,this.companyId, this.accessToken,this.type);
  }
  getCollection(){
    this.type = LINK_EMEADIA.Collections;
    this.cbpService.selectedElement['id'] = '';
    this.customSearch(this.userId,this.companyId, this.accessToken,this.type);
  }
  customSearch(id:any, companyId:any, token:any, link:any) {
    this.linkloading = true;
    this.builderService.customSearch(id, companyId, this.cbpService.apiUrl, token, link).subscribe((result: any) => {
      if(link == LINK_EMEADIA.Assets && result._embedded){
        if(result._embedded.contents){
        this.listOfAssets = result._embedded.contents;
        this.linkloading = false;
        }
      }
      if(link == LINK_EMEADIA.Collections && result._embedded){
        if(result._embedded.collections){
        this.listOfAssets = result._embedded.collections;
        this.linkloading = false;
        }
      }
      },
    (error: any) => {
      console.log(error);
      this.linkloading = false;
    });
}
selectedAssets(id:any, name:any, event:any){
  if (event.target.checked === true) {
    this.cbpService.selectedElement['id'] = id;
    this.cbpService.selectedElement['assetType'] = this.type;
    this.cbpService.selectedElement.userName = this.userName;
    this.cbpService.selectedElement.password = this.password;
    this.name = name;
  }
}
addAssetCollection(){
  this.cbpService.selectedElement.uri = this.name;
  this.auditService.createEntry(this.auditService.selectedElementSnapchat,  this.cbpService.selectedElement, Actions.Update, AuditTypes.PROPERY_EMEDIA_LINK_DOC,{propName: 'uri'})
  this.hide();
}
getAssetsInfo(){
  this.listOfAssets = [];
  this.userInfo();
}
getCollectionInfo(){
  this.listOfAssets = [];
  let currentUser:string|null = localStorage?.getItem('currentUser');
  let userStorageInfo:any = currentUser ? JSON.parse(currentUser) : null;
  let isArrayOfProducts = userStorageInfo.products;
  if(isArrayOfProducts.find((obj:any) => obj === "/emedia")){
    this.getCollection();
  } else {
    this.notifier.hideAll();
    this.notifier.notify('info', 'No Records are available for this user');
    this.linkloading = false;
  }
}
  ngOnDestroy() {
    this.hide();
  }
}
