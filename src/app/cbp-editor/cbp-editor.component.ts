import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DocConfig, EditorType } from 'dist/builder';
import { CBP_Indv_File, DatashareService, EventType, ExecutionType, InputFileType, MenuConfig, UserApiConfig } from 'executer-v2';
import { ApicallService } from '../services/apicall.service';

@Component({
  selector: 'app-cbp-editor',
  templateUrl: './cbp-editor.component.html',
  styleUrls: ['./cbp-editor.component.css']
})
export class CbpEditorComponent implements OnInit {
  envFilesObj: any;
  userConfigInfo!: { apiUrl: string; loggedInUserId: string; loggedInUserName: string; emailId: string; accessToken: string; companyID: string };
  editorTypes!: EditorType;
  cbpZip: any = undefined;
  backZip: any = undefined;
  individual = false;
  fileObj!: File;
  inputFile: InputFileType = new InputFileType();
  executeType: ExecutionType = new ExecutionType();
  userApi!: UserApiConfig;
  isReadOnlyExecution: any;
  cbp_Individual_Files!: CBP_Indv_File;
  menuConfig: MenuConfig = new MenuConfig();
  propertyDocument: any;
  fileName!: string;

  showEditor = true;
  docConfig: DocConfig = new DocConfig();
  isBackground = false;
  cbpTrackChange: any = {};
  isDynamicSection = false;
  @Output() openexecuter: EventEmitter<any> = new EventEmitter<any>();
  cbpFileTabInfo = { isBackgroundDocument: false }
  penInkJson: any;
  isChangeBarThere = false;
  count = 0
  authenticatorConfig: any;
  constructor(public datashareService: DatashareService, public apicallService: ApicallService) { }

  ngOnInit(): void {
    this.cbpTrackChange['DGC_IS_BACKGROUND_DOCUMENT'] = false;
    this.cbpTrackChange['DGC_DOCUMENT_FILE_STATUS'] = 1000;
    this.envFilesObj = {
      apiUrl: 'http://34.220.253.127:7070/dg-common',
      apiSecurity: 'http://34.220.253.127:7070/e-security',
      oauthURL: 'http://34.220.253.127:7070/dg-oauth2-server',
      eDocumentApiUrl: 'http://34.220.253.127:7070/e-document',
      eTimeApiURL: 'http://34.220.253.127:7070/dgDocumentManager',
      clientUrl: 'http://34.220.253.127:7070',
      eWorkURL: 'http://34.220.253.127:7070/e-work'
    }
    this.apicallService.oauthURL = this.envFilesObj.oauthURL;

    this.userConfigInfo = {
      apiUrl: "http://34.220.253.127:7070",
      loggedInUserId: 'DGLN0000000000000001',
      loggedInUserName: 'dataglance',
      emailId: 'dataglance@gmail.com',
      accessToken: '7a5b21a6-9077-4a96-bdd7-657d9c756fc9',
      companyID: 'DGLN0000000000000001'
    }
    this.docConfig.isClose = true;
    this.docConfig.isSave = true;
    this.docConfig.isExit = true;
    this.docConfig.isExport = true;
    this.docConfig.isOpen = true;
    this.docConfig.isNew = true;
    this.docConfig.isExit = true;
    this.newCBp();
    this.showEditor = true;
    this.envFilesObj = JSON.parse(JSON.stringify(this.envFilesObj));
    this.getPenInkJson();
    this.authenticator();
  }
  setRefObj(event: any) { }

  getCbp(event: Event) {
    const target = event.target as HTMLInputElement;
    let fileList: FileList | null = target.files;
    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].name.includes('background')) {
          let item = fileList[i];
          this.backZip = item;
        }
        else {
          let file = fileList[i];
          this.editorTypes = {
            viewMode: false,
            editorMode: true,
            cbpStandalone: true,
            cbpZipMode: true,
            cbpZipObj: file
          }
          this.cbpZip = file;
        }
      }
    }

  }
  newCBp() {
    this.editorTypes = {
      viewMode: false,
      editorMode: true,
      cbpStandalone: false,
      cbpZipMode: false,
      cbpZipObj: {}
    }
    this.individual = true;
  }

  closeBuilder() {
    console.log('closed builder')
  }

  closeExecutor() {
    console.log(this.cbp_Individual_Files);
    console.log('closed executer');
    this.editorTypes = {
      viewMode: false,
      editorMode: true,
      cbpStandalone: false,
      cbpZipMode: false,
      cbpZipObj: {}
    }
    this.individual = true;
    this.cbpZip = undefined;
    this.showEditor = true;
    this.backZip = undefined;
  }
  showExecuter(event: any) {
    this.inputFile.CBP_ZIP = false;
    // this.executeType.Execute = event.type !== 'execution' ? false : true;
    // this.executeType.Read = event.type !== 'execution' ? true : false;
    this.executeType.Execute = false;
    this.executeType.Read = true;
    this.menuConfig = new MenuConfig();
    this.menuConfig.isCREnabled = true;
    this.menuConfig.isComents = true;
    this.menuConfig.isEditableCbp = true;
    this.menuConfig.isSwitchUser = true;
    this.menuConfig.isUndoStep = true;
    this.menuConfig.isEmail = true;
    this.menuConfig.isMedia = true;
    this.menuConfig.isReload = true;
    this.menuConfig.isSave = true;
    this.menuConfig.isAutoSave = true;
    this.menuConfig.isMobile = false;
    this.menuConfig.isReadExecutor = false;
    this.menuConfig.enableReferenceObj = true;
    this.menuConfig.autoSaveTimeInterval = 5000;
    this.isDynamicSection = event.dynamicSection === 'dynamicSection' ? true : false;
    if (this.inputFile.CBP_ZIP) {
      this.individual = false;
      this.fileObj = new File([this.fileObj], this.fileName + 'test.cbp');
    } else {
      console.log(event.builderObjects)
      this.cbp_Individual_Files = event.builderObjects
      this.individual = true;
    }
    this.showEditor = false;
  }
  setChangebar() {
    if (this.cbp_Individual_Files) {
      this.cbp_Individual_Files.cbpJson.documentInfo[0].internalRevision = ++this.count;
      this.isChangeBarThere = true;
    }
  }

  dataJsonUpdate(event: any) {
    // console.log(event);
  }

  linkBlobFiles(event: any) {
    this.getBase64(event.fileObject, (base64Data: any) => {
      console.log(base64Data);
      let newUrl = base64Data.replace('application/octet-stream', 'image/png');
      let w: any = window.open('about:blank');
      let image = new Image();
      image.src = newUrl;
      setTimeout(function () {
        w.document.write(image.outerHTML);
      }, 0);
    });
  }
  linkBlob(event: any) {
    if (event.type === 'eMedia') {
      let stepObject = event.stepObject;
      const urlType = '' + stepObject.assetType + '&' + stepObject.id + '&' + stepObject.userName + '&' + stepObject.password;
      const types = btoa(urlType);
      const url = '/mediacontent/' + types;
      window.open(url);
    }
    if (event.type === 'URL') {
      let stepObject = event.step;
      if (!stepObject.uri.includes('https')) { stepObject.uri = 'https://' + stepObject.uri; }
      window.open(stepObject.uri);
    }
    if (event.type === 'edocumentInfo') {
      console.log(event);

    }
    if (event.type === 'pdfObj') {
      const fileURL = URL.createObjectURL(event.pdfBlob);
      const urltype = btoa(fileURL);
      console.log('/pdfviewer/' + urltype);
      window.open(window.location.origin + '/pdfviewer/' + urltype, '_blank');
    }
    if (event.type === 'blobFile') {
      console.log(event);
      console.trace(event);
    }
  }

  getBase64(file: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(file);
  }

  getProperty(event: any) {
    this.propertyDocument = event.event;
    // this.cdref.detectChanges();
  }
  cbpDataJsonMsg = {
    eventType: EventType.getCBPDataJson,
    msg: "get cbp data",
    msgType: "",
  };

  callServerEvent() {
    this.datashareService.sendMessageFromOutsideToPlugin(
      this.cbpDataJsonMsg
    );
  }
  getPenInkJson() {
    this.apicallService.getPenInkJson().subscribe(result => {
      this.penInkJson = result;
    });
  }
  authenticator() {
    this.apicallService.getAuthenicatorJson().subscribe(result => {
      this.authenticatorConfig = result;
    });
  }

  refreshToken() {
    const authorization = 'Basic ' + btoa('dg-app-client:dgapp');
    const body = `grant_type=password&username=dataglance&password=super`;
    this.apicallService.securityLogin(authorization, body).subscribe((result: any) => {
      this.userConfigInfo.accessToken = result['access_token'];
      this.userConfigInfo = JSON.parse(JSON.stringify(this.userConfigInfo));
    },
      (error: any) => {
      });
  }
  openExecuter(type: string) {
    this.openexecuter.emit(type)
  }
  ewpExecuter() {
    let port = 'http://localhost:4200/';
    console.log(port);
    let url = "DV00000000005907&7f260ad8-44f6-4afb-bc9f-e28d78b6b66e&EXECUTE&test.cbp&DGLN0000000000000001";
    let encoded = btoa(url);
    console.log(encoded);
    window.open(port + 'executor/' + encoded, '_blank')?.focus();
  }
  setLinkObj(e: any) {

  }
  changeToBG() {
    this.cbpFileTabInfo = { isBackgroundDocument: true };
  }

}
