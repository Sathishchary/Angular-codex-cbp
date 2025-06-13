import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { CBP_Indv_File, ExecuterModes, ExecutionType, InputFileType, MenuConfig, UserApiConfig } from '../../executer/ExternalAccess';
import { Event_resource, EventType, Resp_Msg } from '../../executer/ExternalAccess/medaiEventSource';
import { DatashareService } from '../../executer/services/datashare.service';
import { DataWrapperService } from '../data-wrapper.service';

export class CodeValue {
  codeName!: string;
  companyID!: string;
  languageCode!: string;
  productID!: string;
  userID!: string;
}

@Component({
  selector: 'lib-executer-wrapper',
  templateUrl: './executer-wrapper.component.html',
  styleUrls: ['./executer-wrapper.component.css']
})
export class ExecuterWrapperComponent implements OnInit {
  subscription!: Subscription;
  codeValue!: CodeValue;

  //Menu Dynamic Config
  @Input()
  fileType: InputFileType = new InputFileType();
  @Input()
  sourcepath: any = '';

  @Input()
  executionType: ExecutionType = new ExecutionType();

  @Input()
  menuConfig: MenuConfig = new MenuConfig();


  @Input() isDynamicSection: any;

  @Input()
  envFiles: any;
  //Ouput Events
  @Input() executionDataObj = false;
  @Output() getSaveDataJson: EventEmitter<any> = new EventEmitter();
  @Output() propertyDoc: EventEmitter<any> = new EventEmitter();
  @Output() saveDataJson: EventEmitter<any> = new EventEmitter();
  @Input()
  userApiConfig!: UserApiConfig;

  @Output() pdfBlobFile: EventEmitter<any> = new EventEmitter();
  @Output() refObj: EventEmitter<any> = new EventEmitter();
  @Output() linkObj: EventEmitter<any> = new EventEmitter();
  @Output() exitExecutorChange: EventEmitter<any> = new EventEmitter();
  // unzip files
  @Input() cbp_Indv_File: CBP_Indv_File | any;

  // zip file
  @Input() cbpJsonZip: any;
  selectedUniqueId!: number;
  @Input() attachmentBlobs: any;


  @Input() cbpTab = false;
  @Input() refTabDisplay = false;
  @Input() getCurrentDataJson: any;
  @Output() setCurrentDataJson: EventEmitter<any> = new EventEmitter();
  @Input() executerModes: ExecuterModes = new ExecuterModes();
  @Input() stickyUiCss = false;
  @Output() dataJsonChange: EventEmitter<any> = new EventEmitter();
  @Output() getCBPFile: EventEmitter<any> = new EventEmitter();
  @Input() standalone = false;
  @Input() showNotifications: any;

  @Input() cbpServerDataJsonInput: boolean = false;
  @Output() cbpServerDataJson: EventEmitter<any> = new EventEmitter();
  isServer = true;

  @Input() cbp_track_change: any;
  @Input() cbpFileTabInfo: any;
  @Input() yubikeySignature = false;
  @Input() yubikeyInitial = false;
  @Input() penInkJson: any;

  @Input() authenticatorConfig!: any;
  constructor(public dataWrapperService: DataWrapperService, public dataSharingService: DatashareService,
    public notifier: NotifierService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.userApiConfig);
    if (changes.userApiConfig && this.userApiConfig) {
      this.dataWrapperService.accessToken = this.userApiConfig.accessToken;
      this.dataWrapperService.apiUrl = this.userApiConfig.apiUrl;
      this.dataWrapperService.loggedInUserId = this.userApiConfig.loggedInUserId;
      this.dataWrapperService.loggedInUserName = this.userApiConfig.loggedInUserName;
      this.dataWrapperService.emailId = this.userApiConfig.emailId;
      this.dataWrapperService.documentFileId = this.userApiConfig.documentFileId;
      this.dataWrapperService.companyID = this.userApiConfig.companyID;
      this.dataWrapperService.productCode = this.userApiConfig.productCode;
    }
    if (changes.envFiles && this.envFiles) {
      this.dataWrapperService.oauthURL = this.envFiles?.oauthURL;
    }
    if (changes.attachmentBlobs && this.attachmentBlobs) {
      this.attachmentBlobs = changes.attachmentBlobs.currentValue
    }
    if (changes.cbp_track_change && this.cbp_track_change) {
      this.cbp_track_change = changes.cbp_track_change.currentValue;
      this.cbp_track_change = JSON.parse(JSON.stringify(this.cbp_track_change));
    }
    if (changes.cbpFileTabInfo && this.cbpFileTabInfo) {
      this.cbpFileTabInfo = changes.cbpFileTabInfo.currentValue;
    }
    // if (changes.updatedBackground && this.updatedBackground) {
    //   this.updatedBackground = changes.updatedBackground.currentValue;
    // }
  }

  instanceid: any;
  packagefileid: any;
  documentFileId: any;
  locationid: any;

  saveDataObj(item: any) {
    this.saveDataJson.emit(item);
  }

  getPdf(event: any) {
    // console.log(event);
    this.pdfBlobFile.emit(event)
  }

  getCBP(event: any) {
    this.getCBPFile.emit(event)
  }

  closeExecutor(data: any) {
    this.exitExecutorChange.emit(data);
  }

  getProperty(event: any) {
    this.propertyDoc.emit(event);
  }
  dataJsonChangeNew(event: any) {
    this.dataJsonChange.emit({ 'dataJsonChnage': event });
  }

  getSaveDataJsonObj(event: any) {
    this.getSaveDataJson.emit(event);
  }
  ngOnInit(): void {
    this.subscription = this.dataSharingService.eventMessageFromPlugin.subscribe((item: Resp_Msg) => {
      if (item.eventType === EventType.SendEmail) {
        if (this.dataWrapperService.apiUrl)
          this.sendEmailStatus(item);
      }
      if (item.eventType === EventType.SaveDataJson) {
        if (this.executionDataObj) {
          this.getSaveDataJsonObj({ obj: item.msg.fileObj, type: item.msg.type });
        } else {
          if (this.dataWrapperService.apiUrl &&
            (this.packagefileid || this.locationid || this.instanceid))
            this.saveJsonZipFile(item.msg.fileObj, item.msg.type);
        }
      }
      if (item.eventType === EventType.RefreshDataJson) {
        if (this.dataWrapperService.apiUrl)
          this.refreshCbpFile();
      }
      if (item.eventType === EventType.setCommentTypes) {
        if (this.dataWrapperService.apiUrl)
          this.getCodeValues();
      }
      if (item.eventType === EventType.penInk) {
        if (this.dataWrapperService.apiUrl)
          this.setPinkInkValues(item.msg)
        // this.getCodeValues();
      }
      //need to start
      if (item.eventType === EventType.CodeValues) {
        if (this.dataWrapperService.apiUrl)
          this.getCrTypeValues();
      }
      if (item.eventType === EventType.setReasonCodeValues) {
        if (this.dataWrapperService.apiUrl)
          this.getReasonCodeValues();
      }
      if (item.eventType === EventType.setFacilityValues) {
        if (this.dataWrapperService.apiUrl)
          this.getListOfFacilities();
      }
      if (item.eventType === EventType.setUnitFacility) {
        if (this.dataWrapperService.apiUrl)
          this.getFacility(item.msg)
      }
      if (item.eventType === EventType.verifyLoginSecurity) {
        if (this.dataWrapperService.apiUrl)
          this.securityLogin(item.msg.username, item.msg.pwd)
      }
      if (item.eventType === EventType.userCBPInfo) {
        // this.securityLogin(item.msg.username, item.msg.pwd)
        if (this.dataWrapperService.apiUrl)
          this.getCbpUserInfo(item.msg.userId);
      }
    })
  }

  sendEmailStatus(item: any) {
    this.dataWrapperService.sendEmail(item.msg).subscribe((result: any) => {
      // let msg:Resp_Msg = {
      //    source: Event_resource.sendEmailRef,
      //    eventType: EventType.sendEmail_success,
      //    msg:'Email Sent Successfully',msgType:''};
      // this.dataSharingService.sendMessageFromOutsideToPlugin(msg);
      this.notifier.notify('success', 'Email Sent Successfully');
    },
      (error: any) => {
        console.log(error);
      });
  }

  saveJsonZipFile(blob: any, type: any) {
    this.dataWrapperService.saveJsonZipFile(blob, this.instanceid, this.locationid, this.packagefileid).subscribe(() => {
      if (type === 'save') {
        let msg: Resp_Msg = {
          source: Event_resource.saveDataJsonRef,
          eventType: EventType.saveDataJson_success,
          msg: 'DataJson Saved Successfully', msgType: ''
        };
        this.dataSharingService.sendMessageFromOutsideToPlugin(msg);
      } else {
        this.refreshCbpFile();
      }
    }, error => {
      console.log(error);
      // this.setLoader(false);
      let msg: Resp_Msg = {
        source: Event_resource.saveDataJsonRef,
        eventType: EventType.saveDataJson_failed,
        msg: 'DataJson Saved Failed', msgType: ''
      };
      this.dataSharingService.sendMessageFromOutsideToPlugin(msg);
    });
  }

  refreshCbpFile() {
    if (this.instanceid) {
      this.dataWrapperService.refreshJsonZipFile(this.instanceid).subscribe((data: any) => {
        const file = new File([data.body], 'test.cbp');
        // this.clearMediaFiles();
        let msg: Resp_Msg = {
          source: Event_resource.refreshDataJsonRef,
          eventType: EventType.refreshDataJson_success,
          msg: { file: file }, msgType: ''
        };
        this.dataSharingService.sendMessageFromOutsideToPlugin(msg);
      }, error => {
        console.log(error);
        let msg: Resp_Msg = {
          source: Event_resource.refreshDataJsonRef,
          eventType: EventType.refreshDataJson_failed,
          msg: '', msgType: ''
        };
        this.dataSharingService.sendMessageFromOutsideToPlugin(msg);
      }, () => {
        // this.setLoader(false);
        // this.sharedviewService.isViewUpdated = true;
      });
    }

  }
  setCurrentDataObject(event: any) {
    this.setCurrentDataJson.emit({ time: new Date().getMilliseconds(), dataJson: event });
  }

  setCodeValueType(type: string) {
    this.codeValue = new CodeValue();
    this.codeValue.codeName = type
    this.codeValue.languageCode = '1000';
    this.codeValue.productID = '6000';
    this.codeValue.companyID = 'DGLN0000000000000001';
    this.codeValue.userID = 'DGLN0000000000000001';
  }

  getCodeValues() {
    // console.log('get comment types event called');
    this.setCodeValueType('COMMENT_TYPE');
    this.dataWrapperService.getCodeValues(this.codeValue).subscribe((result: any) => {
      let msg: Resp_Msg = {
        source: Event_resource.commentsRef,
        eventType: EventType.setCommentTypes_success,
        msg: result.data
      };
      this.dataSharingService.sendMessageFromOutsideToPlugin(msg);
    },
      (error: any) => {
        console.log(error);
        //  this.codeValues = [];
        //  this.loading = false;
      });
  }


  setPinkInkValues(data: any) {
    // this.setCodeValueType('COMMENT_TYPE');
    this.dataWrapperService.savePinkInk(data).subscribe((result: any) => {
      let msg: Resp_Msg = {
        source: Event_resource.penInk,
        eventType: EventType.penInk,
        msg: result
      };
      this.dataSharingService.sendMessageFromOutsideToPlugin(msg);
    },
      (error: any) => {
        console.log(error);
        //  this.codeValues = [];
        //  this.loading = false;
      });
  }


  getCrTypeValues() {
    this.setCodeValueType('REQUEST_TYPE');
    this.dataWrapperService.getCodeValues(this.codeValue).subscribe((result: any) => {
      // this.typeValues = result.data;
      // this.loading = false;
      let msg: Resp_Msg = {
        source: Event_resource.crRef,
        eventType: EventType.setCodeValues_success,
        msg: result.data
      };
      this.dataSharingService.sendMessageFromOutsideToPlugin(msg);
    },
      (error: any) => { console.log(error); },
      // this.loading = false; },
      () => {
        //  this.getReasonCodeValues()
      });
  }
  getReasonCodeValues() {
    this.setCodeValueType('REASON_CODE');
    this.dataWrapperService.getCodeValues(this.codeValue).subscribe((result: any) => {
      // this.reasonValues = result.data;
      // this.loading = false;
      let msg: Resp_Msg = {
        source: Event_resource.crRef,
        eventType: EventType.setReasonCodeValues_success,
        msg: result.data
      };
      this.dataSharingService.sendMessageFromOutsideToPlugin(msg);
    },
      (error: any) => {
        console.log(error);
        // this.loading = false;
      });
  }
  getListOfFacilities() {
    this.dataWrapperService.getFacilityGroupListInfo().subscribe((result: any) => {
      // this.listOfFacilities = result;
      const msg: Resp_Msg = {
        source: Event_resource.crRef,
        eventType: EventType.setFacilityValues_success,
        msg: result
      };
      this.dataSharingService.sendMessageFromOutsideToPlugin(msg);
    },
      (error) => {

        console.log(error); //this.loading = false;
      });
  }
  getFacility(facility: any) {
    this.dataWrapperService.getUnitGroupList(facility).subscribe((result: any) => {
      // this.listOfUnits = result;
      let msg: Resp_Msg = {
        source: Event_resource.crRef,
        eventType: EventType.setUnitFacility_success,
        msg: result
      };
      this.dataSharingService.sendMessageFromOutsideToPlugin(msg);
      // console.log(result);
    },
      (error) => {
        console.log(error);
      });
  }
  securityLogin(userName: string, password: string) {
    try {
      const authorization = 'Basic ' + btoa('dg-app-client:dgapp');
      const body = `grant_type=password&username=${userName}&password=${password}`;
      this.dataWrapperService.securityLogin(authorization, body).subscribe((result: any) => {
        this.getUserInfo(result.access_token);
      },
        (error: any) => {
          // console.log('error: ', error); this.loading = false;
          //  this.notifier.notify('error', 'Please Enter valid credentials');
          let msg: Resp_Msg = {
            source: Event_resource.verifyLoginSecurityRef,
            eventType: EventType.verifyLoginSecurity_Fail,
            msg: 'Please Enter valid credentials'
          };
          this.dataSharingService.sendMessageFromOutsideToPlugin(msg);
        });
    } catch (error) {
      console.log(error);
      // this.notifier.notify('error', 'Please Enter valid credentials');
      let msg: Resp_Msg = {
        source: Event_resource.verifyLoginSecurityRef,
        eventType: EventType.verifyLoginSecurity_Fail,
        msg: 'Please Enter valid credentials'
      };
      this.dataSharingService.sendMessageFromOutsideToPlugin(msg);
    }
  }
  getUserInfo(token: string) {
    this.dataWrapperService.getUserInfoIndividual(token).subscribe((result: any) => {
      // this.verificationForm.verificationproperty.loginName = result.userName;
      // this.loading = false;
      let msg: Resp_Msg = {
        source: Event_resource.verifyLoginSecurityRef,
        eventType: EventType.verifyLoginSecurity_success,
        msg: result
      };
      this.dataSharingService.sendMessageFromOutsideToPlugin(msg);
      this.getCbpUserInfo(result.userId)
    },
      (error: any) => {
        // this.loading = false;
        this.notifier.notify('error', 'Please Enter valid credentials');
      });
  }

  getCbpUserInfo(userId: any) {
    this.dataWrapperService.getCbpUserInfo(userId).subscribe((result: any) => {
      // console.log(result);
      let msg: Resp_Msg = {
        source: Event_resource.userCBPInfoRef,
        eventType: EventType.userCBPInfo_success,
        msg: result
      };
      this.dataSharingService.sendMessageFromOutsideToPlugin(msg);
    });
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  fetchRefObj(refObj: any) {
    this.refObj.emit(refObj)

  }
  referenceListItems: any[] = [];

  getRefObj(data: any) {
    if (data.type && data.type == 'link') {
      // this.linkObj.emit(data)
      this.dataWrapperService.getLinkInfo(data.selectedText).subscribe((result: any) => {
        console.log(result)
        let msg: Resp_Msg = {
          eventType: EventType.linkObj,
          msg: result.body
        };
        this.dataSharingService.sendMessageFromOutsideToPlugin(msg);
      }, (error) => {
        const msg: Resp_Msg = {
          source: Event_resource.crRef,
          eventType: EventType.setFacilityValues_success,
          msg: null
        };
        this.dataSharingService.sendMessageFromOutsideToPlugin(msg);
        console.log(error);
      })
    } else {
      this.dataWrapperService.getReferenceInfo(data.refid, data.childRefid).subscribe((result: any) => {
        if (data.refid === '' && data.childRefid === '') {
          result.body.forEach((v: any) => {
            v['level'] = 0;
            v['show'] = false;
          });
          this.referenceListItems = result.body;

        } else {
          this.setRef(result, data.item, data.refid);
        }
        data.item['children'] = result.body;
        data.item['show'] = true
        console.log(data)
      }, (error) => {
        console.log(error);
      })
    }

  }
  dragReferenceObj(item: any) {
    if (item.DGC_HAS_CHILD == 0) {

    }
  }


  setRef(result: any, item: any, refid: string = '',) {
    result.body.forEach((v: any) => {
      v['level'] = item.level + 1;
      v['refid'] = refid;
      if (v.DGC_REFERENCE_OBJECT_DETAIL) {
        v.DGC_REFERENCE_OBJECT_DETAIL = JSON.parse(v.DGC_REFERENCE_OBJECT_DETAIL);
      }
      v.dragLinks = [];
      if (v.DGC_REFERENCE_DISPLAY_OPTION && v.DGC_REFERENCE_OBJECT_DETAIL) {
        v.DGC_REFERENCE_DISPLAY_OPTION = v.DGC_REFERENCE_DISPLAY_OPTION.replace(/\</g, "").replace(/\>/g, "").split(';');
        v.DGC_REFERENCE_DISPLAY_OPTION.forEach((i: any) => {
          i = i.indexOf(',') > -1 ? i.split(',') : i.split(" ");
          let link = '';
          i.forEach((k: any) => {
            if (v.DGC_REFERENCE_OBJECT_DETAIL[k.trim()]) {
              link = link + v.DGC_REFERENCE_OBJECT_DETAIL[k.trim()] + " ";
            }
          });
          if (link) {
            v.dragLinks.push(link);
          }

        });
      }
    });
  }

  callRefMethod(item: any, index: any) {
    if (item.DGC_REFERENCE_OBJECT_DETAIL) {
      item['show'] = true
      return;
    }
    if (item.DGC_ID && item.level === 0) {

      this.getRefObj({ item: item, refid: item.DGC_ID, childRefid: '' })
    }
    if (item.DGC_ID && item.level > 0 && item.DGC_HAS_CHILD > 0) {
      this.getRefObj({ item: item, refid: item.refid, childRefid: item.DGC_ID })


      return;
    }
  }
  openItem(item: any) {
    item.show = !item.show;
  }

  sendCBPDataJson(event: any) {
    this.cbpServerDataJson.emit(event);
  }

}
