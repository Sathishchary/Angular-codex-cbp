import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatashareService, Event_resource, EventType, ExecutionType, InputFileType, MenuConfig, Resp_Msg, UserApiConfig } from 'executer-v2';
import { EnvService } from '../env.service';

import * as menuConfigJson from '../../assets/external/ewp.json';
import { ApicallService } from '../services/apicall.service';

@Component({
  selector: 'app-ewp-executer',
  templateUrl: './ewp-executer.component.html',
  styleUrls: ['./ewp-executer.component.css']
})
export class EwpExecuterComponent implements OnInit {

  cbpZip: any;
  loading: boolean = false;
  dataJson: any = [];
  executionMode: any;
  fileName: any;
  id: any;
  sessionId: any;
  uploadUrl: any;
  downloadUrl: any;
  inputFile: InputFileType = new InputFileType();
  executeType: ExecutionType = new ExecutionType();
  menuConfig: MenuConfig = new MenuConfig();
  @Input() userApi!: UserApiConfig;
  @Output() exit: EventEmitter<any> = new EventEmitter<any>()
  propertyDocument: any;
  menuConfigObj: any;
  loginUserID: any;
  exitEwp: any;
  userProfileUrl: string = '';
  saveSuccess: any;
  penInkJson: any;
  constructor(public httpClient: HttpClient, public router: ActivatedRoute,
    public envService: EnvService, public apicallService: ApicallService,
    public dataSharingService: DatashareService) { }

  cbp_Individual_Files: any;

  ngOnInit() {
    this.menuConfigObj = (menuConfigJson['default'] ? menuConfigJson['default'] : menuConfigJson);
    // console.log(this.menuConfigObj);
    let urlPath = this.router.snapshot.params.id; // 'DV00000000005907';
    const values = atob(urlPath);
    let split = values.split('&');
    console.log(split);
    this.id = split[0];
    this.sessionId = split[1];
    this.executionMode = split[2];
    this.fileName = split[3];
    this.loginUserID = split[4];
    this.downloadUrl = this.envService.downloadUrl;
    this.uploadUrl = this.envService.uploadUrl;
    this.userProfileUrl = this.envService.userProfile;
    this.getCBPBlobFileObject(this.id, this.sessionId);
    this.getCbpUserInfo(this.loginUserID);
    document.cookie = 'JSESSIONID=' + this.sessionId + '; path=/';
    this.getPenInkJson();
  }
  getPenInkJson() {
    this.apicallService.getPenInkJson().subscribe(result => {
      this.penInkJson = result;
    });
  }
  getCBPBlobFileObject(id: any, sessionId: any) {
    this.loading = true;
    let defaultHeaders = new HttpHeaders();
    defaultHeaders.set('Content-Type', 'application/octet-stream');
    this.httpClient.get(this.downloadUrl + '?DOCUMENT_FILE_ID=' + id,
      { responseType: 'blob' }).subscribe(result => {
        // console.log(result);
        this.cbpZip = new File([result], 'test.cbp');
        this.loading = false;
      }, error => {
        this.loading = false;
        console.error(error);
      }, () => {
        this.setExecuterInfo();
        console.log(this.menuConfig);
      });
  }

  saveCbpBlobToServer(formbody: any) {
    this.loading = true;
    const headersObj = new HttpHeaders().set('DOCUMENT_FILE_ID', this.id).set('USER_ID', this.loginUserID);
    const formData = new FormData();
    formData.append('FILE_DATA', formbody);
    this.httpClient.post(this.uploadUrl, formData, { headers: headersObj }).subscribe(result => {
      this.loading = false;
      this.saveSuccess = { status: 'updated' }
    }, error => {
      this.loading = false;
      console.error(error);
    });
  }

  exitExecutor() {
    let obj = {
      update: true
    }
    this.exitEwp = JSON.parse(JSON.stringify(obj))
  }

  setExecuterInfo() {
    this.inputFile.CBP_ZIP = true;
    this.inputFile.INDIVID_JSON_FILES = false;
    if (this.executionMode === 'EXECUTE') {
      this.setExecuterMode(true, false, false)
    } else if (this.executionMode == 'READONLY') {
      this.setExecuterMode(false, true, false)
    } else {
      this.setExecuterMode(false, false, true)
    }
    this.menuConfig.isEwpExecuter = true;
    this.menuConfig.isCREnabled = this.envService.isCREnabled;
    this.menuConfig.isComents = this.envService.isComments;
    this.menuConfig.isEditableCbp = true;
    this.menuConfig.isSwitchUser = this.envService.isSwitchUser;
    this.menuConfig.isUndoStep = this.envService.isUndoStep;
    this.menuConfig.isEmail = this.envService.isEmail;
    this.menuConfig.isMedia = this.envService.isMedia;
    this.menuConfig.isReload = true;
    this.menuConfig.isSave = true;
    this.menuConfig.isMobile = false;
    this.menuConfig.isAutoSave = true;
    // this.menuConfig.autoSaveTimeInterval = 1000 * 60 * 2;
    this.menuConfig.autoSaveTimeInterval = this.menuConfigObj.autoInterval ? this.menuConfigObj.autoInterval : 1000 * 60 * 2;
  }

  setExecuterMode(executer: boolean, read: boolean, preview: boolean) {
    this.executeType.Execute = executer;
    this.executeType.Read = read;
    this.executeType.Preview = preview;
    this.menuConfig.isReadExecutor = read;
    this.menuConfig.isExecuter = executer;
    this.menuConfig.isPreview = preview;
  }

  setPropertyDocument(event: any) {
    // console.log(event)
    this.propertyDocument = JSON.parse(JSON.stringify(event.event));
  }

  closeExecutor() {
    this.cbpZip = undefined;
    window.close();
  }
  //user roles
  headersForm() {
    const headers = new HttpHeaders()
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Authorization', 'Bearer ' + '5fe21ad3-f976-42de-b794-24706b3434ab');
    return headers;
  }
  setHeaders() {
    const headers = this.headersForm();
    const options = { headers: headers };
    return options;
  }
  getCbpUserInfo(userId: any) {
    this.loading = true;
    const url = this.userProfileUrl + this.loginUserID

    let defaultHeaders = new HttpHeaders();
    defaultHeaders.set('Content-Type', 'application/octet-stream');
    this.httpClient.get(url).subscribe(result => {
      console.log(result)
      let msg: Resp_Msg = {
        source: Event_resource.userCBPInfoRef,
        eventType: EventType.userCBPInfo_success,
        msg: result
      };
      this.dataSharingService.sendMessageFromOutsideToPlugin(msg);
      this.loading = false;
    }, error => {

      //  let msg:Resp_Msg = {
      //   source: Event_resource.userCBPInfoRef,
      //   eventType: EventType.userCBPInfo_success,
      //   msg:this.userRoles };
      // this.dataSharingService.sendMessageFromOutsideToPlugin(msg);
      this.loading = false;
      console.error(error);
    });

  }
  userRoles = {

    "qualification": [

      {

        "code": "40000581",

        "display": "2834"

      },

      {

        "code": "40001463",

        "display": "35851"

      },

      {

        "code": "40002655",

        "display": "52013"

      },

      {

        "code": "40000641",

        "display": "371"

      },

      {

        "code": "40002826",

        "display": "6168"

      },

      {

        "code": "40000202",

        "display": "12632"

      },

      {

        "code": "40001354",

        "display": "32404"

      },

      {

        "code": "40001793",

        "display": "38513"

      },

      {

        "code": "40000962",

        "display": "23683"

      },

      {

        "code": "40000638",

        "display": "360"

      },

      {

        "code": "40000691",

        "display": "6531"

      },

      {

        "code": "40000898",

        "display": "22353"

      },

      {

        "code": "40002823",

        "display": "6088"

      },

      {

        "code": "40001465",

        "display": "35853"

      },

      {

        "code": "40002137",

        "display": "44693"

      },

      {

        "code": "40000642",

        "display": "373"

      },

      {

        "code": "40001307",

        "display": "31104"

      },

      {

        "code": "40001481",

        "display": "36185"

      },

      {

        "code": "40000208",

        "display": "12642"

      },

      {

        "code": "40002776",

        "display": "4103"

      },

      {

        "code": "40000000",

        "display": "108"

      },

      {

        "code": "40001184",

        "display": "28264"

      },

      {

        "code": "40001483",

        "display": "36227"

      },

      {

        "code": "40001898",

        "display": "40254"

      },

      {

        "code": "40000158",

        "display": "8568"

      }

    ],

    "role": [],

    "qualificationGroup": []

  };
}
