import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExecuterModes, ExecutionType, InputFileType, MenuConfig, UserApiConfig } from 'executer-v2';
import { ApicallService } from '../services/apicall.service';

@Component({
  selector: 'app-wrapper-view',
  templateUrl: './wrapper-view.component.html',
  styleUrls: ['./wrapper-view.component.css']
})
export class WrapperViewComponent implements OnInit {
  cbpZip: any;
  loading: boolean = false;
  dataJson: any = [];
  inputFile: InputFileType = new InputFileType();
  executeType: ExecutionType = new ExecutionType();
  @Output() cbpEditorOpen: EventEmitter<any> = new EventEmitter();
  menuConfig: MenuConfig = new MenuConfig();
  @Input() userApi!: UserApiConfig;
  executerModes!: ExecuterModes;
  penInkJson: any;
  constructor(public apicallService: ApicallService) { }

  cbp_Individual_Files: any;
  ngOnInit() {
    this.userApi = {
      apiUrl: "http://34.220.253.127:8090",
      loggedInUserId: 'DGLN0000000000000001',
      loggedInUserName: 'dataglance',
      emailId: 'dataglance@gmail.com',
      accessToken: 'd2004f5d-f9ca-4ee3-9426-54a0528d7229',
      companyID: 'DGLN0000000000000001'
    }
    this.inputFile.CBP_ZIP = false;
    this.inputFile.INDIVID_JSON_FILES = true;
    this.executeType.Execute = true;
    this.executeType.Read = false;
    this.executeType.Preview = false;
    this.menuConfig.isPreview = false;
    this.menuConfig.isCREnabled = true;
    this.menuConfig.isComents = true;
    this.menuConfig.isEditableCbp = true;
    this.menuConfig.isSwitchUser = true;
    this.menuConfig.isUndoStep = true;
    this.menuConfig.isEmail = true;
    this.menuConfig.isMedia = true;
    this.menuConfig.isReload = true;
    this.menuConfig.isSave = true;
    this.menuConfig.isMobile = false;
    this.menuConfig.isAutoSave = true;
    this.menuConfig.isReadExecutor = false;
    this.menuConfig.isExecuter = false;
    this.menuConfig.autoSaveTimeInterval = 1000 * 60 * 1;
    this.executerModes = new ExecuterModes();
    this.executerModes.viewMode = true;
    this.executerModes.fileHandler = true;
    this.executerModes.readonly = false;
    this.getPenInkJson();
  }
  getPenInkJson() {
    this.apicallService.getPenInkJson().subscribe(result => {
      this.penInkJson = result;
    });
  }

  getCbp(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    console.log(file);
    this.cbpZip = file;
  }
  closeExecutor() {
    this.cbpZip = undefined;
  }
  saveDataJson(event: any) {

  }
  saveDataObj(event: any) {
    console.log(event)
  }
  getData() {

  }
  CBPEditor() {
    this.cbpEditorOpen.emit('editor')
  }
}
