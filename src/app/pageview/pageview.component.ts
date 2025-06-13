import { Component, Input, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatashareService, Device_Platform, EventType, Event_resource, ExecutionType, InputFileType, MenuConfig, Resp_Msg, UserApiConfig } from 'executer-v2';
import JSZip from 'jszip';
import { Subscription } from 'rxjs';
import { ApicallService } from '../services/apicall.service';

declare var eventHandler: any;
//Mobile Plugin Changes
declare var cbpJson: any;
declare var signatureJson: any;
declare var protectJson: any;
declare var annotateJson: any;
declare var dataJson: any;
declare var styleJson: any;
declare var styleImageJson: any;
declare var layoutJson: any;
declare var dynamic_section: any;

declare var isreadMode: boolean;
//future
declare var executionOrderJson: any;
declare var ACTIVE_CBP_PATH: any;

declare var loggedInUser: any;
@Component({
  selector: 'app-pageview',
  templateUrl: './pageview.component.html',
  styleUrls: ['./pageview.component.css']
})
export class PageviewComponent implements OnInit, OnChanges {
  cbpZip: any;
  loading: boolean = false;
  dataJson: any = [];
  isDynamicSection: boolean = false;
  inputFile: InputFileType = new InputFileType();
  executeType: ExecutionType = new ExecutionType();
  menuConfig: MenuConfig = new MenuConfig();
  @Input() userApi!: UserApiConfig;
  subscription!: Subscription;
  activeEventComponent: Event_resource | undefined;
  MEDIA_PATH = 'data/packages/' + ACTIVE_CBP_PATH + '/media/';
  CBP_PATH = 'data/packages/' + ACTIVE_CBP_PATH;
  penInkJson: any;
  authenticatorConfig: any;
  imageObject :any ;

  constructor(public dataWrapperService: ApicallService, private datashareService: DatashareService, _ngZone: NgZone) {
    window['mobilesdk'] = { component: this, zone: _ngZone };
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.userApi = loggedInUser != undefined ? loggedInUser : {
      apiUrl: "http://34.220.253.127:8090",
      loggedInUserId: 'DGLN0000000000000001',
      loggedInUserName: 'dataglance',
      emailId: 'dataglance@gmail.com',
      accessToken: 'd2004f5d-f9ca-4ee3-9426-54a0528d7229',
      companyID: '143225235235235235'
    }

    eventHandler.setPlatFormDetails();
    this.datashareService.setMeadiaPath(this.MEDIA_PATH);
    this.datashareService.setDevicePlatform(Device_Platform.ios);
    this.inputFile.CBP_ZIP = false;
    this.inputFile.INDIVID_JSON_FILES = true;
    this.executeType.Execute = true;
    this.executeType.Read = false;
    this.menuConfig.isCREnabled = true;
    this.menuConfig.isComents = true;
    this.menuConfig.isEditableCbp = true;
    this.menuConfig.isSwitchUser = true;
    this.menuConfig.isUndoStep = true;
    this.menuConfig.isEmail = true;
    this.menuConfig.isMedia = true;
    this.menuConfig.isReload = true;
    this.menuConfig.isSave = true;
    this.menuConfig.isMobile = true;
    this.menuConfig.isAutoSave = true;
    if (isreadMode) {
      this.menuConfig.isSwitchUser = false;
      this.menuConfig.play = false;
      this.executeType.Execute = false;
      this.executeType.Read = true;
    } else {
      this.executeType.Execute = true;
      this.executeType.Read = false;
    }
    this.menuConfig.autoSaveTimeInterval = 1000 * 60 * 2;
    // this.createCbpZipFile();
    console.log(ACTIVE_CBP_PATH + "/data/data.json");
    // const builderObjects = {
    //   // attachment: this.cbpService.cbpZip.attachment,

    //   cbpJson: cbpJson,
    //   dataJson: dataJson,
    //   executionOrderJson: execution_order,
    //   dynamicSectionInfo: [],
    //   layOutJson: layoutJson,
    //   // media: this.cbpService.cbpZip.media,
    //   styleImageJson: styleImageJson,
    //   styleJson: styleJson
    // };
    const builderObjects = {
      attachment: undefined,
      cbpJson: cbpJson,
      dataJson: dataJson,
      executionOrderJson: executionOrderJson,
      dynamicSectionInfo: dynamic_section,
      layOutJson: layoutJson,
      media: undefined,
      styleImageJson: styleImageJson,
      styleJson: styleJson,
      signatureJson: signatureJson,
      protectJson: protectJson,
      annotateJson: annotateJson
      // dynamic_section :
    };
    console.log("builderObject values ", builderObjects);
    if (dynamic_section.length > 0) {
      this.isDynamicSection = true
    }
    //this.cbpJsonData = JSON.stringify(this.cbpService.cbpJson);
    this.cbp_Individual_Files = builderObjects;
  }

  mobilePluginEvents(res: any) {
    console.log('pageview', res);

    if (res && res != '{}') {
      console.log(res);
      switch (res.eventType) {
        case EventType.fireMediaEvent:
          if (res.eventFrom == Event_resource.uploadRef) {
            this.activeEventComponent = Event_resource.uploadRef;
            // let msg:Resp_Msg={source:Event_resource.uploadRef,msg:'download.jpg',msgType:''};
            // console.log('pageview',msg);
            // this.datashareService.sendMessageFromOutsideToPlugin(msg);
            eventHandler.fireMediaEvent('media');
          } else if (res.eventFrom == Event_resource.crRef) {
            this.activeEventComponent = Event_resource.crRef;
            // let msg:Resp_Msg={source:Event_resource.crRef,msg:'download.jpg',msgType:''};
            // console.log('pageview',msg);
            // this.datashareService.sendMessageFromOutsideToPlugin(msg);
            eventHandler.fireMediaEvent('changeRequest');
          } else if (res.eventFrom == Event_resource.commentsRef) {
            this.activeEventComponent = Event_resource.commentsRef;
            // let msg:Resp_Msg={source:Event_resource.commentsRef,msg:'download.jpg',msgType:''};
            // console.log('pageview',msg);
            // this.datashareService.sendMessageFromOutsideToPlugin(msg);
            eventHandler.fireMediaEvent('comments');
          }
          //  console.log('Nothing 1');
          break;
        case EventType.fireCameraEvent:
          //  console.log('Nothing 2');
          if (res.eventFrom == Event_resource.uploadRef) {
            this.activeEventComponent = Event_resource.uploadRef;
            // let msg:Resp_Msg={source:Event_resource.uploadRef,msg:'download.jpg',msgType:''};
            // console.log('pageview',msg);
            // this.datashareService.sendMessageFromOutsideToPlugin(msg);
            eventHandler.fireCameraEvent('media');
          } else if (res.eventFrom == Event_resource.crRef) {
            this.activeEventComponent = Event_resource.crRef;
            // let msg:Resp_Msg={source:Event_resource.crRef,msg:'download.jpg',msgType:''};
            // console.log('pageview',msg);
            // this.datashareService.sendMessageFromOutsideToPlugin(msg);
            eventHandler.fireCameraEvent('changeRequest');
          } else if (res.eventFrom == Event_resource.commentsRef) {
            this.activeEventComponent = Event_resource.commentsRef;
            // let msg:Resp_Msg={source:Event_resource.commentsRef,msg:'download.jpg',msgType:''};
            // console.log('pageview',msg);
            // this.datashareService.sendMessageFromOutsideToPlugin(msg);
            eventHandler.fireCameraEvent('comments');
          }
          break;
        case EventType.SendEmail:
          console.log('Send Email');
          eventHandler.fireSendEmailEvent(res.msg);
          break;
        case EventType.fireMediaEditEvent:
          eventHandler.fireMediaEditEvent(res.msg);
          this.imageObject = res.msg ;
          break;
        case EventType.fireMeadiaRemove:
          eventHandler.fireMeadiaRemove(res.msg);
          break;
        case EventType.verifyLoginSecurity:
          alert(res);
          eventHandler.fireVerifyLoginSecurity(res.msg);
          // this.securityLogin(res.msg.username,res.msg.pwd);
          break;
        case EventType.fireLinkAttachmentEvent:
          eventHandler.fireLinkAttachmentEvent(res);
          break;
        case EventType.fireLinkEdocEvent:
          eventHandler.fireLinkEdocEvent(res);
          break;
        case EventType.fireLinkURLEvent:
          eventHandler.fireLinkURLEvent(res);
          break;
        case EventType.fireLinkEmeadiaEvent:
          eventHandler.fireLinkEmeadiaEvent(res);
          break;
        case EventType.refreshEvent:
          console.log(res);
          eventHandler.refreshEvent(res.datajson, res.opt);
          break;
        case EventType.startexecution:
          console.log(res);
          eventHandler.startexecution(res.datajson, res.opt);
          break;
        case EventType.stopexecution:
          console.log(res);
          eventHandler.stopexecution(res.datajson, res.opt);
          break;
        case EventType.TableStartExecution:
          console.log('tablet-execution', res);
          eventHandler.tabletExecutionStart();
          break;
        case EventType.saveEvent:
          console.log(res);
          this.loading = true;
          // res.datajson?.dataObjects?.map(obj=>obj.dgUniqueID=parseInt(obj.dgUniqueID));
          // res.datajson?.dataObjects?.map((obj: any) => obj.dgUniqueID = obj.dgUniqueID != null ? parseInt(obj.dgUniqueID) : null);
          console.log(res);
          eventHandler.saveEvent(res, res.opt);
          break;
        case EventType.saveDynamicJsonEvent:
          eventHandler.saveDynamicJsonEvent(res.datajson, res.opt);
          console.log(res.datajson);
          break;
        case EventType.crOpened:
          console.log(res);
          eventHandler.crOpened();
          break;
        case EventType.fireVerificationCodeLoginEvent:
          // {username: userName, pwd: password}
          eventHandler.fireVerificationCodeLoginEvent(res.msg?.username, res.msg?.pwd);
          break;
        case EventType.fireVerificationLoginEvent:
          eventHandler.fireVerificationLoginEvent(res.msg?.username, res.msg?.pwd);
          console.log(res);
          break;

        case EventType.penInk:
          console.log("IN PenkInk PageView", res);
          // if (res.eventFrom == Event_resource.commentsRef) {
          //   this.activeEventComponent = Event_resource.commentsRef;
          // }
          eventHandler.getPenInk(res);
          break;

        // case EventType.annotationSDK:
        //   console.log("IN annotaionSDK PageView to index.html", res);
        // if (res.eventFrom == Event_resource.commentsRef) {
        //   this.activeEventComponent = Event_resource.commentsRef;
        // }
        // eventHandler.getAnnoationstoSDK(res);
        // break;

        case EventType.setCommentTypes:
          console.log(res);
          // if (res.eventFrom == Event_resource.commentsRef) {
          //   this.activeEventComponent = Event_resource.commentsRef;
          // }
          eventHandler.getCommentTypes();
          break;
        case EventType.CodeValues:
          // if (res.eventFrom == Event_resource.crRef) {
          //   this.activeEventComponent = Event_resource.crRef;
          // }
          eventHandler.getCodeValues();
          console.log(res);
          break;
        case EventType.SaveDataJson:
          eventHandler.saveDataJson(res);
          console.log(res);
          break;
        case EventType.setReasonCodeValues:
          // if (res.eventFrom == Event_resource.crRef) {
          //   this.activeEventComponent = Event_resource.crRef;
          // }
          eventHandler.getReasonCodeValues();
          console.log(res);
          break;
        case EventType.setFacilityValues:
          eventHandler.getFacilityValues();
          console.log(res);
          break;
        case EventType.fireCameraVideoReceivedEvent:
          if (res.eventFrom == Event_resource.camUpload) {
            this.activeEventComponent = Event_resource.camUpload;
          }
          break;
        case EventType.fireCameraVideoEvent:
          if (res.eventFrom == Event_resource.camUpload) {
            this.activeEventComponent = Event_resource.camUpload;
          }
          eventHandler.fireCameraVideoEvent();
          console.log(res);
          break;
        case EventType.setUnitFacility:
          eventHandler.getUnitFacility(res.msg);
          console.log(res);
          break;
        case EventType.userCBPInfo:
          if (res.eventFrom == Event_resource.crRef) {
            this.activeEventComponent = Event_resource.crRef;
          }
          eventHandler.fireGetUserCBPInfo();
          console.log(res);
          break;
        case EventType.refObj:

          eventHandler.fireRefObj(res.msg);
          console.log(res);
          break;
        case EventType.yubikey:

          eventHandler.fireYubikeyPIVverfication(res.msg);
          console.log(res);
          break;

        case EventType.fireEditedMedia:
          eventHandler.fireEditedMedia(res.msg);
          //console.log("objectcheck",res.msg);
          break;

        default:
          console.log('Nothing matched');
          break;
      }
    }
  }

  cbp_Individual_Files: any;

  ngOnInit() {
    this.userApi = loggedInUser != undefined ? loggedInUser : {
      apiUrl: "http://34.220.253.127:8090",
      loggedInUserId: 'DGLN0000000000000001',
      loggedInUserName: 'dataglance',
      emailId: 'dataglance@gmail.com',
      accessToken: 'd2004f5d-f9ca-4ee3-9426-54a0528d7229',
      companyID: '143225235235235235'
    }
    eventHandler.setPlatFormDetails();
    this.datashareService.setMeadiaPath(this.MEDIA_PATH);
    this.datashareService.setDevicePlatform(Device_Platform.ios);
    this.inputFile.CBP_ZIP = false;
    this.inputFile.INDIVID_JSON_FILES = true;
    this.executeType.Execute = true;
    this.executeType.Read = false;
    this.menuConfig.isCREnabled = true;
    this.menuConfig.isComents = true;
    this.menuConfig.isEditableCbp = true;
    this.menuConfig.isSwitchUser = true;
    this.menuConfig.isUndoStep = true;
    this.menuConfig.isEmail = true;
    this.menuConfig.isMedia = true;
    this.menuConfig.isReload = true;
    this.menuConfig.isSave = true;
    this.menuConfig.isMobile = true;
    this.menuConfig.isAutoSave = true;
    if (isreadMode) {
      this.menuConfig.isSwitchUser = false;
      this.menuConfig.play = false;
      this.executeType.Execute = false;
      this.executeType.Read = true;
    } else {
      this.executeType.Execute = true;
      this.executeType.Read = false;
    }
    this.menuConfig.autoSaveTimeInterval = 1000 * 60 * 2;
    //this.createCbpZipFile();
    const builderObjects = {
      attachment: undefined,
      cbpJson: cbpJson,
      dataJson: dataJson,
      executionOrderJson: executionOrderJson,
      dynamicSectionInfo: dynamic_section,
      layOutJson: layoutJson,
      media: undefined,
      styleImageJson: styleImageJson,
      styleJson: styleJson,
      signatureJson: signatureJson,
      protectJson: protectJson,
      annotateJson: annotateJson
      // dynamic_section : dynamic_section,
    };
    this.cbp_Individual_Files = builderObjects;

  }

  getProperty() {

  }

  getCbp(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    console.log(file);
    this.cbpZip = file;
  }

  getData() {
    console.log(this.dataJson);
  }

  closeExecutor(data: any) {
    console.log('closed');
    eventHandler.closeExecutor(data);
  }
  //Create CBP File
  createCbpZipFile() {
    // console.log(cbpJson);
    // console.log(dataJson);
    // console.log(execution_order);
    // console.log(styleJson);
    // console.log(layoutJson);
    // console.log(styleImageJson);
    console.log('before dataJson:::', dataJson);
    dataJson?.dataObjects?.map((obj: any) => obj.dgUniqueID = obj.dgUniqueID != null ? parseInt(obj.dgUniqueID) : null);
    console.log('dataJson:::', dataJson);
    const zip = new JSZip();
    zip.file('cbp.json', JSON.stringify(cbpJson));
    //Data folder
    zip.file('data/data.json', JSON.stringify(dataJson));
    zip.file('data/annotate.json', JSON.stringify(annotateJson));
    zip.file('data/protect.json', JSON.stringify(protectJson));
    zip.file('data/execution-order.json', JSON.stringify(executionOrderJson));
    //style folder
    zip.file('style/style.json', JSON.stringify(styleJson));
    zip.file('style/layout.json', JSON.stringify(layoutJson));
    zip.file('style/style-image.json', JSON.stringify(styleImageJson));
    zip.generateAsync({ type: 'blob' }).then((blob) => {
      const file = new File([blob], 'testcbp');
      this.cbpZip = file;
      console.log(this.cbpZip);
    }, (err) => {
      console.log('err: ' + err);
    });

  }

  loadAsArrayBuffer(url: any, callback: any) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "arraybuffer";
    xhr.onerror = function () {/* handle errors*/ };
    xhr.onload = function () {
      if (xhr.status === 200) { callback(xhr.response, url) }
      else {/* handle errors*/ }
    };
    xhr.send();
  }

  reloadCBPFile() {
    this.createCbpZipFile();
  }

  setMediaEdit(fileData:any){
  //  console.log("fileddd",fileData)
    let msg: any = {};
    msg = { eventType: EventType.setMediaEdit, source: Event_resource.commentsRef, msg: fileData, msgData: this.imageObject };
    this.datashareService.sendMessageFromOutsideToPlugin(msg);

  }

  //set Media
  setMedia(fileName: any) {
    let msg: Resp_Msg = {};
    // console.log('fileName', fileName + ':::::' + this.activeEventComponent);
    if (this.activeEventComponent === Event_resource.uploadRef) {
      msg = { eventType: EventType.fireMediaEditEvent, source: Event_resource.uploadRef, msg: fileName, msgType: '' };
    } else if (this.activeEventComponent === Event_resource.crRef) {
      msg = { eventType: EventType.fireMediaEditEvent, source: Event_resource.crRef, msg: fileName, msgType: '' };
    } else if (this.activeEventComponent === Event_resource.commentsRef) {
      msg = { eventType: EventType.fireMediaEditEvent, source: Event_resource.commentsRef, msg: fileName, msgType: '' };
    }
    else if (this.activeEventComponent === Event_resource.camUpload) {
      msg = { eventType: EventType.fireCameraVideoReceivedEvent, source: Event_resource.camUpload, msg: { fileName: fileName, type: '' }, msgType: '' };
    }
    console.log('msg', msg);
    if (this.activeEventComponent !== Event_resource.commentsRef && this.activeEventComponent !== Event_resource.crRef) {
      this.datashareService.sendMessageFromOutsideToPlugin(msg);
    }

    if (this.activeEventComponent == Event_resource.commentsRef) {
      this.setMediaComment(msg)
    }
    if (this.activeEventComponent == Event_resource.crRef) {
      this.setMediaCRUpload(msg)
    }

  }
  setMediaComment(fileName: any) {
    this.datashareService.mediaCommentUpload(fileName)
  }
  setMediaCRUpload(fileName: any) {
    this.datashareService.mediaCRUpload(fileName)
  }
  //set Video
  setVideo(fileName: any) {
    // console.log('fileName', fileName + ':::::' + this.activeEventComponent);
    let msg: Resp_Msg = {};
    if (this.activeEventComponent == Event_resource.uploadRef) {
      msg = { eventType: EventType.fireCameraEvent, source: Event_resource.uploadRef, msg: fileName, msgType: '' };
    } else if (this.activeEventComponent == Event_resource.crRef) {
      msg = { eventType: EventType.fireCameraEvent, source: Event_resource.crRef, msg: fileName, msgType: '' };
    } else if (this.activeEventComponent == Event_resource.commentsRef) {
      msg = { eventType: EventType.fireCameraEvent, source: Event_resource.commentsRef, msg: fileName, msgType: '' };
    }
    console.log('msg', msg);
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }

  setSingleVideo(fileName: string, type: any) {
    let msg: any = { eventType: EventType.fireCameraVideoReceivedEvent, source: null, msg: { fileName: fileName, type: type }, msgType: '' };
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }
  //set user Profile
  setUserProfile(user?: any) {
    //  user= {
    //     userName:'admin',
    //     userId : 'DGLN000000001',
    //     emailId : 'test@gmail.com'
    //   }
    this.datashareService.setCurrentUser(user);
  }

  setAutoSave(milliSeconds: number) {
    this.menuConfig.autoSaveTimeInterval = milliSeconds;
  }
  //
  saveDataJson(event: any) {
    console.log(event);
  }

  getCbpData() {
    let msg = { eventType: EventType.getCbpData, msg: this.typeValues, msgType: '' };
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }

  refreshCbpData() {

  }
  setUserName(userName: string) {
    //this.cbpService.loggedInUserName = userName;
    this.datashareService.setUserName(userName);
  }

  setUserInfo(userInfo: any) {
    let msg = { eventType: EventType.setUserInfo, msg: userInfo, msgType: '' };
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }

  serverHandShake(operation: any) {
    this.loading = false;
    if (operation != 'success') {

    } else {
      let msg = { eventType: EventType.saveEvent_HandShake, msg: 'Reset Data Json', msgType: '' };
      this.datashareService.sendMessageFromOutsideToPlugin(msg);
    }
  }

  setScanData(userName: any, password: any, name: any) {
    let msg = { eventType: EventType.setScanData, msg: { userName: userName, password: password, name: name }, msgType: '' };
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }

  toggleExecution() {
    let msg = { eventType: EventType.startexecution, msg: "", msgType: '' };
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }

  saveEventFromMobile() {
    console.log('saveEventFromMobile');
    let msg = { eventType: EventType.saveEventFromMobile, msg: "", msgType: '' };
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }


  setCodeScanData(userName: any, password: any, name: any) {
    let msg = { eventType: EventType.setCodeScanData, msg: { userName: userName, password: password, name: name }, msgType: '' };
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }

  setVerificationCodeName(codeName: any) {
    let msg = { eventType: EventType.setVerificationCodeName, msg: codeName, msgType: '' };
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }
  setSignature(base64Image: any, data: any) {
    let msg = { eventType: EventType.setSignature, msg: { base64Image: base64Image, data: data }, msgType: '' };
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }

  setSignatureForIOS(base64Image: any, dgUniqueID: any, isInitial: any) {
    let msg = { eventType: EventType.setSignatureForIOS, msg: { base64Image: base64Image, isInitial: isInitial, dgUniqueID: dgUniqueID }, msgType: '' };
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }

  showLoader() {
    this.loading = true;
  }

  hideLoader() {
    this.loading = false;
  }

  devicePlatform(platform: Device_Platform) {
    this.datashareService.setDevicePlatform(platform);
  }

  sendMsgToPlugin() {
    // let msg = { eventType: EventType.sendMsgToPlugin, msg: msgObjct, msgType: '' };
    // this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }

  typeValues = [];
  reasonValues = [];
  facility = [];
  listOfFacilities = [];
  listOfUnits = [];
  listOfDecipline = [];
  codeValues = [];

  setReasonCodeValues(data: any) {
    //console.log('setReasons called in pageview',data ,"rrrrr",JSON.stringify(data));
    this.reasonValues = data.data;
    let msg = { eventType: EventType.setReasonCodeValues_success, msg: this.reasonValues, msgType: '' };
    // console.log(msg);
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }

  setFacility(result: any) {
    // console.log('setFacility called in pageview',result ,"rrrrr",JSON.stringify(result));
    this.facility = result.Content;
    // console.log("Facility called in pageview::",facility)
    let msg: Resp_Msg = {
      source: this.activeEventComponent,
      eventType: EventType.setFacilityValues_success,
      msg: this.facility
    };
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }

  setUnitFacility(result: any) {
    console.log("setUnitFacility called in pageviewWW", result)
    // console.log('setUnitFacility called in pageview'+JSON.stringify(result));
    let msg: Resp_Msg = {
      source: this.activeEventComponent,
      eventType: EventType.setUnitFacility_success,
      msg: result.Content
    };
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }
  setVerifyLoginSecurity(result: any) {
    let msg: Resp_Msg = {
      source: this.activeEventComponent,
      eventType: EventType.verifyLoginSecurity_success,
      msg: result
    };
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }
  setUserCBPInfo(result: any) {
    let msg: Resp_Msg = {
      source: this.activeEventComponent,
      eventType: EventType.userCBPInfo_success,
      msg: result
    };
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }
  setUnit(data: any) {
    this.listOfUnits = data;
    // let msg = { eventType: EventType.setUnit, msg:this.typeValues, msgType: '' };
    // this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }
  setDecipline(data: any) {
    this.listOfDecipline = data.data;
    // let msg = { eventType: EventType.setDecipline, msg:this.typeValues, msgType: '' };
    // this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }
  setTypes(data: any) {
    this.codeValues = data.data;
    let msg = { eventType: EventType.setCommentTypes, msg: this.codeValues, msgType: '' };
    // console.log(msg);
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }
  saveSyncData() {
    this.createCbpZipFile();
  }
  closeCBP() {
    let msg = { eventType: EventType.setClosecbp, msg: this.codeValues, msgType: '' };
    // console.log(msg);
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }

  setPenInk(result: any) {
    console.log("message", result)
    let msg: Resp_Msg = {
      source: Event_resource.penInk,
      eventType: EventType.penInk,
      msg: result
    };
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }
  setPenInkQuestions(result: any) {
    //console.log("PenInk Questions", result)
    let msg: Resp_Msg = {
      source: Event_resource.penInk,
      eventType: EventType.penInk,
      msg: result
    };
    this.penInkJson = result;
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }

  setRestartExecution(result: any) {
    console.log("setRestartExecution ", result)
    let msg: Resp_Msg = {
      source: Event_resource.reStartExecution,
      eventType: EventType.reStartExecution,
      msg: result
    };
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }


  setAnnoationSDK(result: any) {
    // console.log("setAnnoationSDK message", result)
    // let msg: Resp_Msg = {
    //   source: Event_resource.annotationSDK,
    //   eventType: EventType.setAnnotation_Success,
    //   msg: result
    // };
    // this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }
  setCodeValues(result: any) {
    let msg: Resp_Msg = {
      source: this.activeEventComponent,
      eventType: EventType.setCodeValues_success,
      msg: result.data
    };
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }

  //For Email Sent status to plugin
  sendEmailStatus() {
    let msg: Resp_Msg = {
      source: Event_resource.sendEmailRef,
      eventType: EventType.sendEmail_success,
      msg: 'Email Sent Successfully', msgType: ''
    };
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }

  //For CBP User Info to plugin
  setCbpUserInfo(result: any) {
    let msg: Resp_Msg = {
      source: Event_resource.userCBPInfoRef,
      eventType: EventType.userCBPInfo_success,
      msg: result
    };
    console.log('::::::::::', result);
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }

  setRespVerificationLogin(result: any) {
    let msg: Resp_Msg = {
      source: Event_resource.verifyLoginSecurityRef,
      eventType: EventType.verifyLoginSecurity_success,
      msg: result
    };
    console.log('::::::::::', result);
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }

  //Api call implementation
  setCommentTypesV2(result: any) {
    let msg: Resp_Msg = {
      source: Event_resource.commentsRef,
      eventType: EventType.setCommentTypes_success,
      msg: result.data
    };
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }

  //For Yubikey events
  verifyYubikey(data: any) {
    let msg: Resp_Msg = {
      source: Event_resource.yubikey,
      eventType: EventType.yubikey,
      msg: data, msgType: ''
    };
    this.datashareService.sendMessageFromOutsideToPlugin(msg);
  }

  setAuthenticator(data: any) {
    this.authenticatorConfig = data;

  }

  reloadCBP() {
    this.createCbpZipFile();
  }
}



