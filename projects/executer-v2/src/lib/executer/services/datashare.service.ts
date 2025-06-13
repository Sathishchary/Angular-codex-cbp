import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuConfig } from '../ExternalAccess';
import { Device_Platform, Request_Msg, Resp_Msg } from '../ExternalAccess/medaiEventSource';
import { ExecutionService } from './execution.service';

@Injectable()
export class DatashareService {
  @Output() mediaComment: EventEmitter<any> = new EventEmitter();
  @Output() mediaCr: EventEmitter<any> = new EventEmitter();
  constructor(private executionServ:ExecutionService) { }
  //Menu config
  private menuConfig!: MenuConfig;
  setMenuConfig(menuConfig: MenuConfig) {
    this.menuConfig = menuConfig;
  }

  mediaCommentUpload(event:any){
    this.mediaComment.emit(event);
  }
  mediaCRUpload(event:any){
    this.mediaCr.emit(event);
  }

  getMenuConfig() {
    return this.menuConfig;
  }
 //set media Path
  private meadiaPath: string = '';

  changeCount = 0;

  setMeadiaPath(meadiaPath: string) {
    this.meadiaPath = meadiaPath;
  }

  getMediaPath() {
    return this.meadiaPath;
  }
 //set Device platform
  private devicePlatform:Device_Platform=Device_Platform.web;
  setDevicePlatform(platform: Device_Platform) {
    this.devicePlatform = platform;
  }
  getDevicePlatform() {
    return this.devicePlatform;
  }

  //Rising Events
  public eventMessageFromPlugin = new BehaviorSubject<Request_Msg>({});
  // eventMessageFromPlugin = this.eventSource.asObservable();
  sendMessageFromLibToOutside(msg: Request_Msg) {
    // console.log(msg)
    this.eventMessageFromPlugin.next(msg);
  }

  //Retriving Events
  public receivedMessage = new BehaviorSubject<Resp_Msg>({});
  // receivedMessage = this.retriveEventSource.asObservable();
  
  sendMessageFromOutsideToPlugin(msg: Resp_Msg) {
    this.receivedMessage.next(msg);
  }

  setCurrentUser(user:any){
    console.log(user);
    this.executionServ.setCurrentUser(user);
  }
  
  setUserName(userName:string){
    this.executionServ.loggedInUserName=userName;
  }

}
