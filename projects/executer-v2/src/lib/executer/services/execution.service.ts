import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DgTypes, Footer, Header, PropertyDocument, SequenceTypes, waterMarkOptions } from 'cbp-shared';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CodeValue, DataJson, ImageModal } from '../models';
const findAnd = require('find-and');
/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */

@Injectable()
export class ExecutionService {


  isClickedCurrentStep = false;
  codeValueService: CodeValue = new CodeValue();
  headers: HttpHeaders = new HttpHeaders;
  isUndoEnabled = false;
  selectedUserName!: string;
  selectedUserId!: string;
  selectedUserEmail!: string;
  closeSignature = false;
  tableSignature = false;
  showHideImageClick = false;
  detailPageNumber = 1;
  uploadMediaType = '';
  isMediaUpdated = false;
  loadPage = false;
  selectedElement: any;
  setTableRowCol!: { row: any; col: any; };
  selectCell: any;
  isPlaceDispaly = false;
  deletedCRmedia: any;
  deletedCommentMedia: any;
  tablefreeze: any;
  accessToken!: string;
  loggedInUserName!: any;
  emailId: any;
  apiUrl!: string;

  loggedInUserId!: string;
  hideDynamicSection: any = true;
  imageEditorIds: any;
  showExecutionOrder = false;
  accept = ".m4v,.avi,.mpg,.mp4,.flv,.mov,.divx,.f4v,.mpeg,.vob,.xvid,.mp3,.mpeg,.vnd.wav,.ogg,.x-mpegurl,.jpeg,.gif,.png,.jpg,.pipeg,.tiff,.jfif,.zip,.PNG,.JPG,.JPEG";
  singleMediaAccept = ".m4v,.avi,.mpg,.mp4,.flv,.mov,.wmv,.divx,.f4v,.mpeg,.vob,.xvid,.mp3,.mpeg,.vnd.wav,.ogg,.x-mpegurl,.jpeg,.gif,.png,.jpg,.pipeg,.tiff,.jfif,.PNG,.JPG,.JPEG";
  styleModel!: any;
  showPopupItem: any;
  repeatStepEnable = false;
  selectedFieldEntry: any;
  selectedNewEntry: any;
  selectedStepObj: any;
  setValueIndent = 0;
  detailUpdate: boolean = false;
  isPopupOpened = false;
  componentInfoList: any[] = [{ name: 'Component Id', type: 'componenetId' }, { name: 'Description', type: 'description' },
  { name: 'Building', type: 'building' }, { name: 'Evalution', type: 'elevation' },
  { name: 'Room', type: 'room' }, { name: 'Location', type: 'location' }
  ];
  annotations = [{ type: 'underline', color: 'blue' },
  { type: 'circle', color: 'red', padding: 10 },
  { type: 'box', color: 'orange' },
  { type: 'strike-through', color: 'blue' },
  { type: 'crossed-off', color: 'orange' },
  { type: 'highlight', color: 'yellow', iterations: 1, multiline: true },
  { type: 'bracket', color: 'red', padding: [2, 10], brackets: ['left', 'right'], strokeWidth: 3 }];

  fontNames = ['Arial', 'Calibri', 'Montserrat', 'Poppins', 'TimeNewRoman', 'Courier New'];
  fontSizes = ['1', '2', '3', '4', '5', '6', '7'];
  colors = ['#000000', '#00FF00', '#ff0000', '#0000ff'];
  storeColors: any[] = [];
  stepChildDerivedObjs: any = [];
  stepConditionalRuleObjs: any = [];
  dataEntryAlarmRuleObj: any = [];
  applicabilityObjs: any = [];
  private updateText = new BehaviorSubject<any>({});
  fieldSource = this.updateText.asObservable();

  private menuBarFields = new BehaviorSubject<{ event: string, obj: any }>({ event: '', obj: {} });
  menuBarFieldsEvent = this.menuBarFields.asObservable();

  private executerModesEvent = new BehaviorSubject<any>({});
  executerModesEventChange = this.executerModesEvent.asObservable();

  private attributeChange = new BehaviorSubject<any>({});
  attributeChangeEvent = this.attributeChange.asObservable();

  private timerStepChange = new BehaviorSubject<any>({});
  timerStepChangeEvent = this.timerStepChange.asObservable();

  mobileView: boolean = false;
  defualtInitial: any = null;
  defualtSign: any = null;
  defualtInitialEnable: any = false;
  defualtSignEnable: any = false
  referenceObjectEditMode: boolean = false;
  isDataProtected: boolean = true;
  formatPainterEnable!: boolean;
  signatureJson: any = [];
  wordHtml = '';
  wordData: any = [];
  formatStyle = {};

  authenticatorConfig!: any;
  companyID!: any;
  sequenceTypes: typeof SequenceTypes = SequenceTypes;
  private updateDropdownStyleView = new BehaviorSubject<any>({});
  styleViewUpdateDropView = this.updateDropdownStyleView.asObservable();
  setDropdownStyleView(obj: any) {
    this.updateDropdownStyleView.next(obj);
  }
  dynamicDataEntryIds: any = new Map();
  defaultInitialUserInfo: any = null;
  defaultSignUserInfo: any = null;
  constructor(public http: HttpClient, public domSanitizer: DomSanitizer,
    public location: Location) {
    this.setCodeValues();
  }
  private updateAuthConfig = new BehaviorSubject<any>({});
  signatureAuthConfigUpdate = this.updateAuthConfig.asObservable();
  updateAuthenticator(obj: any) {
    this.updateAuthConfig.next(obj);
  }

  setSignatureJson(dataJson: DataJson) {
    if (dataJson && dataJson?.dataObjects?.length > 0 && this.signatureJson.length > 0)
      dataJson.dataObjects.filter((i: any) => i.dgType == DgTypes.SignatureDataEntry || i.dgType == DgTypes.InitialDataEntry)
        .forEach((element: any) => {
          if (!this.signatureJson) {
            this.signatureJson = [];
          }
          if (element.dgType == DgTypes.SignatureDataEntry) {
            const index = this.signatureJson.indexOf(element.signatureValue);
            const indexInitial = this.signatureJson.indexOf(element.initial);
            if (index == -1) {
              if (element.signatureValue && !Number(element.signatureValue)) {
                if (element.signatureValue === "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAwIAAAD6CAYAAAASlfBRAAAAAXNSR0IArs4c6QAADwxJREFUeF7t10EBAAAIAjHpX9ogNxsw/LBzBAgQIECAAAECBAjkBJZLLDABAgQIECBAgAABAmcIeAICBAgQIECAAAECQQFDIFi6yAQIECBAgAABAgQMAT9AgAABAgQIECBAIChgCARLF5kAAQIECBAgQICAIeAHCBAgQIAAAQIECAQFDIFg6SITIECAAAECBAgQMAT8AAECBAgQIECAAIGggCEQLF1kAgQIECBAgAABAoaAHyBAgAABAgQIECAQFDAEgqWLTIAAAQIECBAgQMAQ8AMECBAgQIAAAQIEggKGQLB0kQkQIECAAAECBAgYAn6AAAECBAgQIECAQFDAEAiWLjIBAgQIECBAgAABQ8APECBAgAABAgQIEAgKGALB0kUmQIAAAQIECBAgYAj4AQIECBAgQIAAAQJBAUMgWLrIBAgQIECAAAECBAwBP0CAAAECBAgQIEAgKGAIBEsXmQABAgQIECBAgIAh4AcIECBAgAABAgQIBAUMgWDpIhMgQIAAAQIECBAwBPwAAQIECBAgQIAAgaCAIRAsXWQCBAgQIECAAAEChoAfIECAAAECBAgQIBAUMASCpYtMgAABAgQIECBAwBDwAwQIECBAgAABAgSCAoZAsHSRCRAgQIAAAQIECBgCfoAAAQIECBAgQIBAUMAQCJYuMgECBAgQIECAAAFDwA8QIECAAAECBAgQCAoYAsHSRSZAgAABAgQIECBgCPgBAgQIECBAgAABAkEBQyBYusgECBAgQIAAAQIEDAE/QIAAAQIECBAgQCAoYAgESxeZAAECBAgQIECAgCHgBwgQIECAAAECBAgEBQyBYOkiEyBAgAABAgQIEDAE/AABAgQIECBAgACBoIAhECxdZAIECBAgQIAAAQKGgB8gQIAAAQIECBAgEBQwBIKli0yAAAECBAgQIEDAEPADBAgQIECAAAECBIIChkCwdJEJECBAgAABAgQIGAJ+gAABAgQIECBAgEBQwBAIli4yAQIECBAgQIAAAUPADxAgQIAAAQIECBAIChgCwdJFJkCAAAECBAgQIGAI+AECBAgQIECAAAECQQFDIFi6yAQIECBAgAABAgQMAT9AgAABAgQIECBAIChgCARLF5kAAQIECBAgQICAIeAHCBAgQIAAAQIECAQFDIFg6SITIECAAAECBAgQMAT8AAECBAgQIECAAIGggCEQLF1kAgQIECBAgAABAoaAHyBAgAABAgQIECAQFDAEgqWLTIAAAQIECBAgQMAQ8AMECBAgQIAAAQIEggKGQLB0kQkQIECAAAECBAgYAn6AAAECBAgQIECAQFDAEAiWLjIBAgQIECBAgAABQ8APECBAgAABAgQIEAgKGALB0kUmQIAAAQIECBAgYAj4AQIECBAgQIAAAQJBAUMgWLrIBAgQIECAAAECBAwBP0CAAAECBAgQIEAgKGAIBEsXmQABAgQIECBAgIAh4AcIECBAgAABAgQIBAUMgWDpIhMgQIAAAQIECBAwBPwAAQIECBAgQIAAgaCAIRAsXWQCBAgQIECAAAEChoAfIECAAAECBAgQIBAUMASCpYtMgAABAgQIECBAwBDwAwQIECBAgAABAgSCAoZAsHSRCRAgQIAAAQIECBgCfoAAAQIECBAgQIBAUMAQCJYuMgECBAgQIECAAAFDwA8QIECAAAECBAgQCAoYAsHSRSZAgAABAgQIECBgCPgBAgQIECBAgAABAkEBQyBYusgECBAgQIAAAQIEDAE/QIAAAQIECBAgQCAoYAgESxeZAAECBAgQIECAgCHgBwgQIECAAAECBAgEBQyBYOkiEyBAgAABAgQIEDAE/AABAgQIECBAgACBoIAhECxdZAIECBAgQIAAAQKGgB8gQIAAAQIECBAgEBQwBIKli0yAAAECBAgQIEDAEPADBAgQIECAAAECBIIChkCwdJEJECBAgAABAgQIGAJ+gAABAgQIECBAgEBQwBAIli4yAQIECBAgQIAAAUPADxAgQIAAAQIECBAIChgCwdJFJkCAAAECBAgQIGAI+AECBAgQIECAAAECQQFDIFi6yAQIECBAgAABAgQMAT9AgAABAgQIECBAIChgCARLF5kAAQIECBAgQICAIeAHCBAgQIAAAQIECAQFDIFg6SITIECAAAECBAgQMAT8AAECBAgQIECAAIGggCEQLF1kAgQIECBAgAABAoaAHyBAgAABAgQIECAQFDAEgqWLTIAAAQIECBAgQMAQ8AMECBAgQIAAAQIEggKGQLB0kQkQIECAAAECBAgYAn6AAAECBAgQIECAQFDAEAiWLjIBAgQIECBAgAABQ8APECBAgAABAgQIEAgKGALB0kUmQIAAAQIECBAgYAj4AQIECBAgQIAAAQJBAUMgWLrIBAgQIECAAAECBAwBP0CAAAECBAgQIEAgKGAIBEsXmQABAgQIECBAgIAh4AcIECBAgAABAgQIBAUMgWDpIhMgQIAAAQIECBAwBPwAAQIECBAgQIAAgaCAIRAsXWQCBAgQIECAAAEChoAfIECAAAECBAgQIBAUMASCpYtMgAABAgQIECBAwBDwAwQIECBAgAABAgSCAoZAsHSRCRAgQIAAAQIECBgCfoAAAQIECBAgQIBAUMAQCJYuMgECBAgQIECAAAFDwA8QIECAAAECBAgQCAoYAsHSRSZAgAABAgQIECBgCPgBAgQIECBAgAABAkEBQyBYusgECBAgQIAAAQIEDAE/QIAAAQIECBAgQCAoYAgESxeZAAECBAgQIECAgCHgBwgQIECAAAECBAgEBQyBYOkiEyBAgAABAgQIEDAE/AABAgQIECBAgACBoIAhECxdZAIECBAgQIAAAQKGgB8gQIAAAQIECBAgEBQwBIKli0yAAAECBAgQIEDAEPADBAgQIECAAAECBIIChkCwdJEJECBAgAABAgQIGAJ+gAABAgQIECBAgEBQwBAIli4yAQIECBAgQIAAAUPADxAgQIAAAQIECBAIChgCwdJFJkCAAAECBAgQIGAI+AECBAgQIECAAAECQQFDIFi6yAQIECBAgAABAgQMAT9AgAABAgQIECBAIChgCARLF5kAAQIECBAgQICAIeAHCBAgQIAAAQIECAQFDIFg6SITIECAAAECBAgQMAT8AAECBAgQIECAAIGggCEQLF1kAgQIECBAgAABAoaAHyBAgAABAgQIECAQFDAEgqWLTIAAAQIECBAgQMAQ8AMECBAgQIAAAQIEggKGQLB0kQkQIECAAAECBAgYAn6AAAECBAgQIECAQFDAEAiWLjIBAgQIECBAgAABQ8APECBAgAABAgQIEAgKGALB0kUmQIAAAQIECBAgYAj4AQIECBAgQIAAAQJBAUMgWLrIBAgQIECAAAECBAwBP0CAAAECBAgQIEAgKGAIBEsXmQABAgQIECBAgIAh4AcIECBAgAABAgQIBAUMgWDpIhMgQIAAAQIECBAwBPwAAQIECBAgQIAAgaCAIRAsXWQCBAgQIECAAAEChoAfIECAAAECBAgQIBAUMASCpYtMgAABAgQIECBAwBDwAwQIECBAgAABAgSCAoZAsHSRCRAgQIAAAQIECBgCfoAAAQIECBAgQIBAUMAQCJYuMgECBAgQIECAAAFDwA8QIECAAAECBAgQCAoYAsHSRSZAgAABAgQIECBgCPgBAgQIECBAgAABAkEBQyBYusgECBAgQIAAAQIEDAE/QIAAAQIECBAgQCAoYAgESxeZAAECBAgQIECAgCHgBwgQIECAAAECBAgEBQyBYOkiEyBAgAABAgQIEDAE/AABAgQIECBAgACBoIAhECxdZAIECBAgQIAAAQKGgB8gQIAAAQIECBAgEBQwBIKli0yAAAECBAgQIEDAEPADBAgQIECAAAECBIIChkCwdJEJECBAgAABAgQIGAJ+gAABAgQIECBAgEBQwBAIli4yAQIECBAgQIAAAUPADxAgQIAAAQIECBAIChgCwdJFJkCAAAECBAgQIGAI+AECBAgQIECAAAECQQFDIFi6yAQIECBAgAABAgQMAT9AgAABAgQIECBAIChgCARLF5kAAQIECBAgQICAIeAHCBAgQIAAAQIECAQFDIFg6SITIECAAAECBAgQMAT8AAECBAgQIECAAIGggCEQLF1kAgQIECBAgAABAoaAHyBAgAABAgQIECAQFDAEgqWLTIAAAQIECBAgQMAQ8AMECBAgQIAAAQIEggKGQLB0kQkQIECAAAECBAgYAn6AAAECBAgQIECAQFDAEAiWLjIBAgQIECBAgAABQ8APECBAgAABAgQIEAgKGALB0kUmQIAAAQIECBAgYAj4AQIECBAgQIAAAQJBAUMgWLrIBAgQIECAAAECBAwBP0CAAAECBAgQIEAgKGAIBEsXmQABAgQIECBAgIAh4AcIECBAgAABAgQIBAUMgWDpIhMgQIAAAQIECBAwBPwAAQIECBAgQIAAgaCAIRAsXWQCBAgQIECAAAEChoAfIECAAAECBAgQIBAUMASCpYtMgAABAgQIECBAwBDwAwQIECBAgAABAgSCAoZAsHSRCRAgQIAAAQIECBgCfoAAAQIECBAgQIBAUMAQCJYuMgECBAgQIECAAAFDwA8QIECAAAECBAgQCAoYAsHSRSZAgAABAgQIECBgCPgBAgQIECBAgAABAkEBQyBYusgECBAgQIAAAQIEDAE/QIAAAQIECBAgQCAoYAgESxeZAAECBAgQIECAgCHgBwgQIECAAAECBAgEBQyBYOkiEyBAgAABAgQIEDAE/AABAgQIECBAgACBoIAhECxdZAIECBAgQIAAAQKGgB8gQIAAAQIECBAgEBQwBIKli0yAAAECBAgQIEDAEPADBAgQIECAAAECBIIChkCwdJEJECBAgAABAgQIGAJ+gAABAgQIECBAgEBQwBAIli4yAQIECBAgQIAAAUPADxAgQIAAAQIECBAIChgCwdJFJkCAAAECBAgQIGAI+AECBAgQIECAAAECQQFDIFi6yAQIECBAgAABAgQMAT9AgAABAgQIECBAIChgCARLF5kAAQIECBAgQICAIeAHCBAgQIAAAQIECAQFDIFg6SITIECAAAECBAgQMAT8AAECBAgQIECAAIGggCEQLF1kAgQIECBAgAABAg8a8gD7Fuj8SgAAAABJRU5ErkJggg==") {
                  element.signatureValue = '';
                } else {
                  this.signatureJson.push(element.signatureValue)
                  element.signatureValue = (this.signatureJson.length);
                  element.signature = (this.signatureJson.length);
                }
              }
            }
            if (index > -1) {
              element.signatureValue = index;
              element.signature = index;
            }
            if (indexInitial == -1) {
              if (element.initial && !Number(element.initial)) {
                this.signatureJson.push(element.initial)
                element.initial = (this.signatureJson.length);
              }

            }
            if (indexInitial > -1) {
              element.initial = indexInitial;
            }
          }
          if (element.dgType == DgTypes.InitialDataEntry) {
            const index = this.signatureJson.indexOf(element.initial);
            if (index == -1) {
              if (element.initialStore && !Number(element.initialStore)) {
                if (element.initialStore === "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAwIAAAD6CAYAAAASlfBRAAAAAXNSR0IArs4c6QAADwxJREFUeF7t10EBAAAIAjHpX9ogNxsw/LBzBAgQIECAAAECBAjkBJZLLDABAgQIECBAgAABAmcIeAICBAgQIECAAAECQQFDIFi6yAQIECBAgAABAgQMAT9AgAABAgQIECBAIChgCARLF5kAAQIECBAgQICAIeAHCBAgQIAAAQIECAQFDIFg6SITIECAAAECBAgQMAT8AAECBAgQIECAAIGggCEQLF1kAgQIECBAgAABAoaAHyBAgAABAgQIECAQFDAEgqWLTIAAAQIECBAgQMAQ8AMECBAgQIAAAQIEggKGQLB0kQkQIECAAAECBAgYAn6AAAECBAgQIECAQFDAEAiWLjIBAgQIECBAgAABQ8APECBAgAABAgQIEAgKGALB0kUmQIAAAQIECBAgYAj4AQIECBAgQIAAAQJBAUMgWLrIBAgQIECAAAECBAwBP0CAAAECBAgQIEAgKGAIBEsXmQABAgQIECBAgIAh4AcIECBAgAABAgQIBAUMgWDpIhMgQIAAAQIECBAwBPwAAQIECBAgQIAAgaCAIRAsXWQCBAgQIECAAAEChoAfIECAAAECBAgQIBAUMASCpYtMgAABAgQIECBAwBDwAwQIECBAgAABAgSCAoZAsHSRCRAgQIAAAQIECBgCfoAAAQIECBAgQIBAUMAQCJYuMgECBAgQIECAAAFDwA8QIECAAAECBAgQCAoYAsHSRSZAgAABAgQIECBgCPgBAgQIECBAgAABAkEBQyBYusgECBAgQIAAAQIEDAE/QIAAAQIECBAgQCAoYAgESxeZAAECBAgQIECAgCHgBwgQIECAAAECBAgEBQyBYOkiEyBAgAABAgQIEDAE/AABAgQIECBAgACBoIAhECxdZAIECBAgQIAAAQKGgB8gQIAAAQIECBAgEBQwBIKli0yAAAECBAgQIEDAEPADBAgQIECAAAECBIIChkCwdJEJECBAgAABAgQIGAJ+gAABAgQIECBAgEBQwBAIli4yAQIECBAgQIAAAUPADxAgQIAAAQIECBAIChgCwdJFJkCAAAECBAgQIGAI+AECBAgQIECAAAECQQFDIFi6yAQIECBAgAABAgQMAT9AgAABAgQIECBAIChgCARLF5kAAQIECBAgQICAIeAHCBAgQIAAAQIECAQFDIFg6SITIECAAAECBAgQMAT8AAECBAgQIECAAIGggCEQLF1kAgQIECBAgAABAoaAHyBAgAABAgQIECAQFDAEgqWLTIAAAQIECBAgQMAQ8AMECBAgQIAAAQIEggKGQLB0kQkQIECAAAECBAgYAn6AAAECBAgQIECAQFDAEAiWLjIBAgQIECBAgAABQ8APECBAgAABAgQIEAgKGALB0kUmQIAAAQIECBAgYAj4AQIECBAgQIAAAQJBAUMgWLrIBAgQIECAAAECBAwBP0CAAAECBAgQIEAgKGAIBEsXmQABAgQIECBAgIAh4AcIECBAgAABAgQIBAUMgWDpIhMgQIAAAQIECBAwBPwAAQIECBAgQIAAgaCAIRAsXWQCBAgQIECAAAEChoAfIECAAAECBAgQIBAUMASCpYtMgAABAgQIECBAwBDwAwQIECBAgAABAgSCAoZAsHSRCRAgQIAAAQIECBgCfoAAAQIECBAgQIBAUMAQCJYuMgECBAgQIECAAAFDwA8QIECAAAECBAgQCAoYAsHSRSZAgAABAgQIECBgCPgBAgQIECBAgAABAkEBQyBYusgECBAgQIAAAQIEDAE/QIAAAQIECBAgQCAoYAgESxeZAAECBAgQIECAgCHgBwgQIECAAAECBAgEBQyBYOkiEyBAgAABAgQIEDAE/AABAgQIECBAgACBoIAhECxdZAIECBAgQIAAAQKGgB8gQIAAAQIECBAgEBQwBIKli0yAAAECBAgQIEDAEPADBAgQIECAAAECBIIChkCwdJEJECBAgAABAgQIGAJ+gAABAgQIECBAgEBQwBAIli4yAQIECBAgQIAAAUPADxAgQIAAAQIECBAIChgCwdJFJkCAAAECBAgQIGAI+AECBAgQIECAAAECQQFDIFi6yAQIECBAgAABAgQMAT9AgAABAgQIECBAIChgCARLF5kAAQIECBAgQICAIeAHCBAgQIAAAQIECAQFDIFg6SITIECAAAECBAgQMAT8AAECBAgQIECAAIGggCEQLF1kAgQIECBAgAABAoaAHyBAgAABAgQIECAQFDAEgqWLTIAAAQIECBAgQMAQ8AMECBAgQIAAAQIEggKGQLB0kQkQIECAAAECBAgYAn6AAAECBAgQIECAQFDAEAiWLjIBAgQIECBAgAABQ8APECBAgAABAgQIEAgKGALB0kUmQIAAAQIECBAgYAj4AQIECBAgQIAAAQJBAUMgWLrIBAgQIECAAAECBAwBP0CAAAECBAgQIEAgKGAIBEsXmQABAgQIECBAgIAh4AcIECBAgAABAgQIBAUMgWDpIhMgQIAAAQIECBAwBPwAAQIECBAgQIAAgaCAIRAsXWQCBAgQIECAAAEChoAfIECAAAECBAgQIBAUMASCpYtMgAABAgQIECBAwBDwAwQIECBAgAABAgSCAoZAsHSRCRAgQIAAAQIECBgCfoAAAQIECBAgQIBAUMAQCJYuMgECBAgQIECAAAFDwA8QIECAAAECBAgQCAoYAsHSRSZAgAABAgQIECBgCPgBAgQIECBAgAABAkEBQyBYusgECBAgQIAAAQIEDAE/QIAAAQIECBAgQCAoYAgESxeZAAECBAgQIECAgCHgBwgQIECAAAECBAgEBQyBYOkiEyBAgAABAgQIEDAE/AABAgQIECBAgACBoIAhECxdZAIECBAgQIAAAQKGgB8gQIAAAQIECBAgEBQwBIKli0yAAAECBAgQIEDAEPADBAgQIECAAAECBIIChkCwdJEJECBAgAABAgQIGAJ+gAABAgQIECBAgEBQwBAIli4yAQIECBAgQIAAAUPADxAgQIAAAQIECBAIChgCwdJFJkCAAAECBAgQIGAI+AECBAgQIECAAAECQQFDIFi6yAQIECBAgAABAgQMAT9AgAABAgQIECBAIChgCARLF5kAAQIECBAgQICAIeAHCBAgQIAAAQIECAQFDIFg6SITIECAAAECBAgQMAT8AAECBAgQIECAAIGggCEQLF1kAgQIECBAgAABAoaAHyBAgAABAgQIECAQFDAEgqWLTIAAAQIECBAgQMAQ8AMECBAgQIAAAQIEggKGQLB0kQkQIECAAAECBAgYAn6AAAECBAgQIECAQFDAEAiWLjIBAgQIECBAgAABQ8APECBAgAABAgQIEAgKGALB0kUmQIAAAQIECBAgYAj4AQIECBAgQIAAAQJBAUMgWLrIBAgQIECAAAECBAwBP0CAAAECBAgQIEAgKGAIBEsXmQABAgQIECBAgIAh4AcIECBAgAABAgQIBAUMgWDpIhMgQIAAAQIECBAwBPwAAQIECBAgQIAAgaCAIRAsXWQCBAgQIECAAAEChoAfIECAAAECBAgQIBAUMASCpYtMgAABAgQIECBAwBDwAwQIECBAgAABAgSCAoZAsHSRCRAgQIAAAQIECBgCfoAAAQIECBAgQIBAUMAQCJYuMgECBAgQIECAAAFDwA8QIECAAAECBAgQCAoYAsHSRSZAgAABAgQIECBgCPgBAgQIECBAgAABAkEBQyBYusgECBAgQIAAAQIEDAE/QIAAAQIECBAgQCAoYAgESxeZAAECBAgQIECAgCHgBwgQIECAAAECBAgEBQyBYOkiEyBAgAABAgQIEDAE/AABAgQIECBAgACBoIAhECxdZAIECBAgQIAAAQKGgB8gQIAAAQIECBAgEBQwBIKli0yAAAECBAgQIEDAEPADBAgQIECAAAECBIIChkCwdJEJECBAgAABAgQIGAJ+gAABAgQIECBAgEBQwBAIli4yAQIECBAgQIAAAUPADxAgQIAAAQIECBAIChgCwdJFJkCAAAECBAgQIGAI+AECBAgQIECAAAECQQFDIFi6yAQIECBAgAABAgQMAT9AgAABAgQIECBAIChgCARLF5kAAQIECBAgQICAIeAHCBAgQIAAAQIECAQFDIFg6SITIECAAAECBAgQMAT8AAECBAgQIECAAIGggCEQLF1kAgQIECBAgAABAoaAHyBAgAABAgQIECAQFDAEgqWLTIAAAQIECBAgQMAQ8AMECBAgQIAAAQIEggKGQLB0kQkQIECAAAECBAgYAn6AAAECBAgQIECAQFDAEAiWLjIBAgQIECBAgAABQ8APECBAgAABAgQIEAgKGALB0kUmQIAAAQIECBAgYAj4AQIECBAgQIAAAQJBAUMgWLrIBAgQIECAAAECBAwBP0CAAAECBAgQIEAgKGAIBEsXmQABAgQIECBAgIAh4AcIECBAgAABAgQIBAUMgWDpIhMgQIAAAQIECBAwBPwAAQIECBAgQIAAgaCAIRAsXWQCBAgQIECAAAEChoAfIECAAAECBAgQIBAUMASCpYtMgAABAgQIECBAwBDwAwQIECBAgAABAgSCAoZAsHSRCRAgQIAAAQIECBgCfoAAAQIECBAgQIBAUMAQCJYuMgECBAgQIECAAAFDwA8QIECAAAECBAgQCAoYAsHSRSZAgAABAgQIECBgCPgBAgQIECBAgAABAkEBQyBYusgECBAgQIAAAQIEDAE/QIAAAQIECBAgQCAoYAgESxeZAAECBAgQIECAgCHgBwgQIECAAAECBAgEBQyBYOkiEyBAgAABAgQIEDAE/AABAgQIECBAgACBoIAhECxdZAIECBAgQIAAAQKGgB8gQIAAAQIECBAgEBQwBIKli0yAAAECBAgQIEDAEPADBAgQIECAAAECBIIChkCwdJEJECBAgAABAgQIGAJ+gAABAgQIECBAgEBQwBAIli4yAQIECBAgQIAAAUPADxAgQIAAAQIECBAIChgCwdJFJkCAAAECBAgQIGAI+AECBAgQIECAAAECQQFDIFi6yAQIECBAgAABAgQMAT9AgAABAgQIECBAIChgCARLF5kAAQIECBAgQICAIeAHCBAgQIAAAQIECAQFDIFg6SITIECAAAECBAgQMAT8AAECBAgQIECAAIGggCEQLF1kAgQIECBAgAABAg8a8gD7Fuj8SgAAAABJRU5ErkJggg==") {
                  element.initialStore = '';
                } else {
                  this.signatureJson.push(element.initialStore)
                  element.initialStore = (this.signatureJson.length);
                  element.initial = (this.signatureJson.length);
                }

              }

            }
            if (index > -1) {
              element.initialStore = index;
              element.initial = index;
            }
          }
        });
  }

  selectedField(msg: any) {
    this.updateText.next(msg);
  }
  setMenuBarField(obj: any) {
    this.menuBarFields.next(obj);
  }
  setExecuterModes(obj: any) {
    this.executerModesEvent.next(obj);
  }
  setAttributeUpdate(obj: any) {
    this.attributeChange.next(obj);
  }
  setTimerStep(obj: any) {
    this.timerStepChange.next(obj)
  }


  private styleModelobj = new BehaviorSubject<any>({});
  styleModelobjValue = this.styleModelobj.asObservable();

  private link = new BehaviorSubject<any>({});
  linkSubscription = this.link.asObservable();
  setLink(obj: any) {
    this.link.next(obj);
  }
  deletePropForTreeStructure(item: any) {
    delete item.Security;
    delete item.acknowledgementReqd;
    delete item.alarm;
    delete item.applicabilityRule;
    delete item.checkboxNode;
    delete item.componentInformation;
    delete item.configureDependency;
    delete item.createdBy;
    delete item.createdDate;
    delete item.ctrlKey;
    delete item.dataEntryEnabled;
    delete item.dependency;
    delete item.dependencyChecked;
    delete item.galleryEnabled;
    delete item.isCRAvailable;
    delete item.isCommentAvailable;
    delete item.isInView;
    delete item.isLastChild;
    delete item.layoutStyle;
    delete item.options;
    delete item.page;
    delete item.paginateIndex;
    delete item.refresh;
    delete item.rule;
    delete item.selectTable;
    delete item.setAlignIndentaion;
    delete item.setIndentaion;
    delete item.setLayoutindentation;
    delete item.styleItem;
    delete item.styleNumber;
    delete item.styleObj;
    delete item.tableName;
    delete item.tableNo;
    delete item.topStyle;
    delete item.updatedBy;
    delete item.updatedDate;
    delete item.usage;

  }

  setStyleModelItem(obj: any) {
    this.styleModelobj.next(obj);
  }

  private setTablelobj = new BehaviorSubject<any>({});
  setTablelobjValue = this.setTablelobj.asObservable();
  setRowField(obj: any) {
    this.setTablelobj.next(obj);
  }

  private setTablelobjReceive = new BehaviorSubject<any>({});
  setTablelobjValueReceive = this.setTablelobjReceive.asObservable();
  getRowField(obj: any) {
    this.setTablelobjReceive.next(obj);
  }
  private colorViewUpdate = new BehaviorSubject<any>({});
  colorUpdateView = this.colorViewUpdate.asObservable();
  setColorItem(obj: any) {
    this.colorViewUpdate.next(obj);
  }

  private styleViewUpdate = new BehaviorSubject<any>({});
  styleViewUpdateView = this.styleViewUpdate.asObservable();
  setStyleViewItem(obj: any) {
    this.styleViewUpdate.next(obj);
  }

  private windowWith = new BehaviorSubject<any>({});
  windowWithChange = this.windowWith.asObservable();
  setwidthtem(obj: any) {
    this.windowWith.next(obj);
  }

  private windSize = new BehaviorSubject<any>({});
  windSizeChange = this.windowWith.asObservable();
  setwindSize(windSize: any) {
    this.windowWith.next(windSize);
  }



  checkFileType(file: any) {
    let fileType = '';
    if (file.type.indexOf('video') > -1 || file.name.indexOf('.mp4') > -1) {
      fileType = 'Video';
    } else if (file.type.indexOf('audio') > -1) {
      fileType = 'Audio';
    } else {
      fileType = 'Image';
    }
    return fileType;
  }
  dataURItoBlob(dataURI: any) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    var bb = new Blob([ab], { type: mimeString });
    return bb;
  }

  getElementByNumber(number: any, section: any): any {
    return findAnd.returnFound(section, { dgSequenceNumber: number });
  }
  getElementByDgUniqueID(dgUniqueID: any, section: any): any {
    let obj = findAnd.returnFound(section, { dgUniqueID: dgUniqueID });
    if (!obj) {
      obj = findAnd.returnFound(section, { dgUniqueID: dgUniqueID?.toString() });
    }
    if (!obj) {
      obj = findAnd.returnFound(section, { dgUniqueID: Number(dgUniqueID) });
    }
    return obj;
  }
  deletElement(sections: any, dgUniqueID: any) {
    return findAnd.removeObject(sections, { dgUniqueID: dgUniqueID });
  }
  replaceElement(sections: any, replaceId: any, currentID: any) {
    return findAnd.replaceObject(sections, { dgUniqueID: replaceId }, { dgUniqueID: currentID })
  }
  getElementByFieldName(fieldName: any, section: any): any {
    return findAnd.returnFound(section, { fieldName: fieldName });
  }
  setCodeValues() {
    this.codeValueService = new CodeValue('COMMENT_TYPE', 'DGLN0000000000000001', '1000', '6000', 'DGLN0000000000000001');
  }

  formData() {
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.accessToken);
    const options = { headers: headers };
    return options;
  }
  isEmpty(obj: {}) {
    return Object.keys(obj).length === 0;
  }
  containsObject(obj: any, list: string | any[]) {
    for (let i = 0; i < list.length; i++) { if (list[i] === obj) { return true; } }
    return false;
  }
  containsObjectName(obj: { name: any; }, list: string | any[]) {
    for (let i = 0; i < list.length; i++) { if (list[i].name === obj.name) { return true; } }
    return false;
  }
  setImage(fileObject: any) {
    if (fileObject) {
      const objectURL = fileObject && fileObject['file'] ? URL.createObjectURL(fileObject.file) : URL.createObjectURL(fileObject);
      const url = this.domSanitizer.bypassSecurityTrustUrl(objectURL);
      return url;
    }
  }

  encodeImageFileAsURL(file: Blob) {
    const reader = new FileReader();
    reader.onloadend = function () {
      console.log('RESULT', reader.result);
      return reader.result;
    };
    reader.readAsDataURL(file);
    return;
  }

  /// clear the execution data which is added only in exeuction
  // clearing the execution media
  clearExecuteImages(dataJson: { dataObjects: any[]; }, media: any[]) {
    const images = dataJson.dataObjects.filter((item: { dgType: DgTypes; }) => item.dgType === DgTypes.Figures);
    const commentCRImages = dataJson.dataObjects.filter((item: { dgType: DgTypes; }) => (item.dgType === DgTypes.Comment || item.dgType === DgTypes.ChangeRequest));
    if (images.length > 0) {
      images.forEach((element: { images: { filter: (arg0: (y: any) => boolean) => { (): any; new(): any; length: any; }; }; }) => {
        media = media.filter((x: { name: any; }) => !element.images.filter((y: { fileName: any; }) => y.fileName === x.name).length);
      });
    }
    if (commentCRImages.length > 0) {
      commentCRImages.forEach((element: { media: { filter: (arg0: (y: any) => boolean) => { (): any; new(): any; length: any; }; }; }) => {
        media = media.filter(x => !element.media.filter((y: { fileName: any; }) => y.fileName === x.name).length);
      });
    }
    return media;
  }

  checkDataEntryDgTypes(object: { dgType: DgTypes; }) {
    if (object?.dgType === DgTypes.TextDataEntry || object?.dgType === DgTypes.TextAreaDataEntry ||
      object?.dgType === DgTypes.NumericDataEntry || object?.dgType === DgTypes.DateDataEntry ||
      object?.dgType === DgTypes.BooleanDataEntry || object?.dgType === DgTypes.CheckboxDataEntry ||
      object?.dgType === DgTypes.VerificationDataEntry) {
      return true;
    }
    return false;
  }
  isDataEntry(obj: { dgType: DgTypes; }) {
    if (obj?.dgType === DgTypes.LabelDataEntry || this.messageCondition(obj) || obj?.dgType === DgTypes.InitialDataEntry ||
      obj?.dgType === DgTypes.Link || obj?.dgType === DgTypes.Form || obj?.dgType === DgTypes.Figures ||
      obj?.dgType === DgTypes.NumericDataEntry || obj?.dgType === DgTypes.BooleanDataEntry ||
      obj?.dgType === DgTypes.Para || obj?.dgType === DgTypes.TextAreaDataEntry || obj?.dgType === DgTypes.VerificationDataEntry ||
      obj?.dgType === DgTypes.TextDataEntry || obj?.dgType === DgTypes.SignatureDataEntry ||
      obj?.dgType === DgTypes.DateDataEntry || obj?.dgType === DgTypes.CheckboxDataEntry || obj?.dgType === DgTypes.FormulaDataEntry) {
      return true;
    }
    return false;
  }
  isBulletSteps(obj: any) {
    if (obj.originalSequenceType == this.sequenceTypes.BULLETS || obj.originalSequenceType == this.sequenceTypes.STAR ||
      obj.originalSequenceType == this.sequenceTypes.CIRCLE || obj.originalSequenceType == this.sequenceTypes.SQUARE ||
      obj.originalSequenceType == this.sequenceTypes.ARROW || obj.originalSequenceType == this.sequenceTypes.CHECKMARK) {
      return true;
    } else {
      return false;
    }
  }
  stepActionCondition(obj: any) {
    if (obj !== undefined) {
      if (obj?.dgType === DgTypes.StepAction || obj?.dgType === DgTypes.DelayStep || obj?.dgType === DgTypes.Timed || obj?.dgType === DgTypes.Repeat) {
        return true;
      }
    }
    return false;
  }
  sectionAndStep(obj: any) {
    return this.stepActionCondition(obj) || obj?.dgType === DgTypes.Section ? true : false;
  }
  checkAllSteps(obj: { dgType: DgTypes; }) {
    return (this.sectionAndStep(obj) || obj?.dgType === DgTypes.StepInfo) ? true : false;
  }
  messageCondition(obj: any) {
    return (obj?.dgType === DgTypes.Warning || obj?.dgType === DgTypes.Caution || obj?.dgType === DgTypes.Note || obj?.dgType === DgTypes.Alara) ? true : false;
  }
  setLoader(event: any) {
    event.target.src = 'assets/cbp/images/loader.gif';
  }
  hasDocumentSecurityRoleQual(documentInfo: any) {
    if (documentInfo['Security'] && (documentInfo['Security'].Qualification.length !== 0 ||
      documentInfo['Security'].QualificationGroup.length !== 0 || documentInfo['Security'].Role.length !== 0)) {
      return true;
    } else {
      return false;
    }
  }

  setCurrentUser(obj: { userName: any; userId: any; emailId: any; }) {
    this.selectedUserName = obj.userName;
    this.selectedUserId = obj.userId;
    this.selectedUserEmail = obj.emailId;
  }

  isMediaEntry(obj: any) {
    return obj?.dgType === DgTypes.Figures;
  }
  stepDataEntries(array: string | any[]) {
    let value = false;
    for (let i = 0; i < array.length; i++) {
      if (this.isDataEntry(array[i])) {
        value = true;
      }
    }
    return value
  }
  sectionDataEntry(obj: { dgType: DgTypes; }) {
    if (obj?.dgType === DgTypes.LabelDataEntry || this.messageCondition(obj) ||
      obj?.dgType === DgTypes.Link || obj?.dgType === DgTypes.Form || obj?.dgType === DgTypes.Figures ||
      obj?.dgType === DgTypes.Para || obj?.dgType === DgTypes.FormulaDataEntry) {
      return true;
    }
    return false;
  }
  isSectionDataArrayEntries(array: string | any[]) {
    let value = false;
    for (let i = 0; i < array.length; i++) {
      if (this.sectionDataEntry(array[i])) {
        value = true;
      }
    }
    return value;
  }
  removeDuplicatesFromTwoArrays(array: any[], selectArray: string | any[]) {
    for (let i = 0; i < selectArray.length; i++) {
      const index = array.findIndex((item: { name: any; }) => item.name === selectArray[i].name);
      if (index != -1) {
        array.splice(index, 1);
      }
    }
    return array;
  }

  getElementBypaginationIndex(index: any, section: any): any {
    return findAnd.returnFound(section, { paginateIndex: index });
  }

  uploadMedia(event: any, mediaFiles: any, media: any, maxUniqueID: any) {
    let mediaFilesArray: any = [];
    let mediaArray = [];
    for (let i = 0; i < event.target.files.length; i++) {
      let fileBlob = event.target.files[i];
      let type = this.splitLastOccurrence(fileBlob.name, '.');
      if (this.accept.includes(type[1])) {
        let fileValue = this.splitLastOccurrence(event.target.files[i].name, '.');
        fileBlob = new File([event.target.files[i]], fileValue[0] + '_' + i + '_' + new Date().getTime().toString() + '.' + fileValue[1],
          { type: event.target.files[i].type });
        const imageObj: any = new ImageModal(fileBlob.name, '', '', this.loggedInUserId + '_' + (++maxUniqueID) + i,
          this.checkFileType(fileBlob), 'executor', 'Figure', false, fileBlob.type, fileBlob, fileBlob.name,
          fileBlob.name, 8100
        );
        const imageLoad = { url: URL.createObjectURL(event.target.files[i]), context: event.target.files[i].name }
        this.getImageDimension(imageLoad).subscribe(
          (response: any) => {
            imageObj['width'] = response.width;
            imageObj['height'] = response.height;
            imageObj['originalWidth'] = response.width;
            imageObj['originalHieght'] = response.height;
          });
        mediaFilesArray.push(imageObj);
        mediaArray.push(fileBlob);
      }
    }
    return { mediaFiles: mediaFilesArray, mediaArray: mediaArray, maxid: maxUniqueID };
  }
  splitLastOccurrence(str: string, substring: string) {
    const lastIndex = str.lastIndexOf(substring);
    let array = [];
    array.push(str.slice(0, lastIndex), str.slice(lastIndex + 1));
    return array;
  }

  getImageDimension(image: any): Observable<any> {
    return new Observable(observer => {
      const img = new Image();
      img.onload = function (event) {
        const loadedImage: any = event.currentTarget;
        image.width = loadedImage.width;
        image.height = loadedImage.height;
        observer.next(image);
        observer.complete();
      }
      img.src = image.url;
    });
  }
  setHeaderFooterWaterMark(cbpJson: any) {
    if (!cbpJson.documentInfo || cbpJson.documentInfo.length === 0) {
      cbpJson.documentInfo[0] = new PropertyDocument();
    }
    cbpJson.documentInfo[0]['waterMarkOptions'] = cbpJson.documentInfo[0]['waterMarkOptions'] ?? new waterMarkOptions();
    cbpJson.documentInfo[0]['header'] = cbpJson.documentInfo[0]['header'] ?? new Header();
    cbpJson.documentInfo[0]['footer'] = cbpJson.documentInfo[0]['footer'] ?? new Footer();
    return cbpJson;
  }

  insertArrayIndex(arr: any, index: number, newItem: any) {
    return [
      ...arr.slice(0, index),
      newItem,
      ...arr.slice(index)
    ];
  }
  clearFieldValues() {
    this.selectedFieldEntry = null;
    this.selectedStepObj = null;
    this.repeatStepEnable = false;
    this.isClickedCurrentStep = false;
  }
  toggleDisplaySections(obj: any, section: any, type = 0) {
    if (obj.level == 0) {
      section.forEach((s: any) => {
        if (s.dgUniqueID == obj.dgUniqueID) {
          s.isInView = type == 0 ? true : false;
        } else {
          if (type == 0) {
            s.isInView = false;
          }
        }
      });
    } else {
      const parent = this.getElementByNumber(obj.parentID, section);
      if (parent) {
        this.toggleDisplaySections(parent, section, type);
      }
    }
  }
  refObjID: any;
  refObjArr: Array<any> = [];
  private refObj = new BehaviorSubject<any>({});
  refObjValue = this.refObj.asObservable();
  refObjValueState = 0;
  setrefObj(obj: any) {
    this.refObj.next(obj);
  }

  setFormatStyle(stepObject: any) {
    if (this.formatPainterEnable) {
      stepObject['styleSet'] = this.formatStyle ? this.formatStyle : {};
      if (stepObject?.storeValue && stepObject['styleSet']) {
        stepObject.storeValue = this.removeHTMLTags(stepObject.storeValue);
        stepObject['innerHtmlView'] = true;
      }
      if (stepObject['styleSet']) {
        if (stepObject['styleSet']['fontsize']) {
          stepObject['defaultFontSize'] = stepObject['styleSet']['fontsize'];
        }
        if (stepObject['styleSet']['fontfamily']) {
          stepObject['defaultFontName'] = stepObject['styleSet']['fontfamily'];
        }
        if (stepObject['styleSet']['fontcolor']) {
          stepObject['color'] = stepObject['styleSet']['fontcolor'];
        }
        if (stepObject?.storeValue && stepObject.dgType !== DgTypes.DateDataEntry) {
          stepObject = this.setStyleOfStep(stepObject);
        }
      }
      stepObject['innerHtmlView'] = true;
    }
    return stepObject;
  }
  setStyleOfStep(stepObject: any) {
    let colorhtml = ''; let closeColor = '';
    let familyhtml = ''; let closeFamily = '';
    let sizehtml = ''; let closeSize = '';
    if (stepObject['styleSet']['fontcolor']) {
      colorhtml = `<font color="${stepObject['styleSet']['fontcolor']}">`; closeColor = '</font>';
    }
    if (stepObject['styleSet']['fontfamily']) {
      familyhtml = `<font face="${stepObject['styleSet']['fontfamily']}">`; closeFamily = '</font>';
    }
    if (stepObject['styleSet']['fontsize']) {
      sizehtml = `<font size="${stepObject['styleSet']['fontsize']}">`; closeSize = '</font>';
    }
    stepObject.storeValue = `${colorhtml}${familyhtml}${sizehtml}${stepObject.storeValue}${closeSize}${closeFamily}${closeColor}`;
    return stepObject;
  }
  setColorForKeyDown(type: string, event: any, stepObject: any) {
    if (type === 'contenteditable' && event?.type === 'keydown' &&
      event?.key.match(/^[0-9a-z]+$/) && event?.key !== 'Tab') {
      stepObject = this.setDefaultStyle(stepObject);
      if (stepObject.color === '#000000' && stepObject?.styleSet?.fontsize == '2' && stepObject?.styleSet?.fontfamily == 'Poppins')
        stepObject.storeValue = stepObject.storeValue + (this.isLetter(event.key) ? event.key : '');
      if (stepObject.color !== '#000000' || stepObject?.styleSet?.fontsize !== '2' || stepObject?.styleSet?.fontfamily !== 'Poppins') {
        stepObject.storeValue = stepObject.storeValue + '<font color="' + stepObject.color + '">' + event.key + '</font>';
        stepObject = this.setStyleOfStep(stepObject);
      }
    }
    if (stepObject['styleSet']) {
      if (stepObject['styleSet']['fontsize']) {
        stepObject['defaultFontSize'] = stepObject['styleSet']['fontsize'];
      }
      if (stepObject['styleSet']['fontfamily']) {
        stepObject['defaultFontName'] = stepObject['styleSet']['fontfamily'];
      }
      if (stepObject['styleSet']['fontcolor']) {
        stepObject['color'] = stepObject['styleSet']['fontcolor'];
      }
    }
    return stepObject;
  }
  setDefaultStyle(stepObject: any) {
    if (!stepObject['styleSet']) { stepObject['styleSet'] = {}; }
    if (stepObject.storeValue) {
      let item = { color: '', size: '', family: '' };
      item = this.getStyles(stepObject.storeValue, item);
      item.family = this.getFontFamily(item.family, this.fontNames);
      if (item['size']) { stepObject['styleSet']['fontsize'] = item['size']; }
      if (item['family']) { stepObject['styleSet']['fontfamily'] = item['family']; }
      if (item['color']) { stepObject['styleSet']['fontcolor'] = item['color']; }
    }
    if (!stepObject['styleSet']['fontsize']) { stepObject['styleSet']['fontsize'] = '2'; }
    if (!stepObject['styleSet']['fontfamily']) { stepObject['styleSet']['fontfamily'] = 'Poppins'; }
    if (!stepObject['styleSet']['fontcolor']) { stepObject['styleSet']['fontcolor'] = '#000000'; }
    return stepObject;
  }

  isLetter(str: any) {
    return str.length === 1 && str.match(/[a-z]/i);
  }
  removeHTMLTags(str: any) {
    if ((str === null) || (str === undefined) || (str === ''))
      return '';
    else
      str = str.toString();
    let finalString = str.replace(/(<([^>]+)>)/ig, '');
    finalString = finalString.replace(/&nbsp;/g, ' ');
    return finalString;
  }
  setFieldVal(stepObject: any) {
    if (this.selectedFieldEntry == undefined ||
      this.selectedFieldEntry?.dgUniqueID !== stepObject?.dgUniqueID) {
      this.selectedFieldEntry = stepObject;
      this.selectedNewEntry = stepObject;
    }
  }
  updateParaInCbp(currentSections: any, primarySections: any) {
    for (let i = 0; i < primarySections.length; i++) {
      let obj: any = primarySections[i];
      if (this.checkAllSteps(obj)) {
        let objtest = this.getElementByDgUniqueID(obj.dgUniqueID, currentSections)
        if (objtest?.children && objtest?.children?.length > 0) {
          obj.children = [...obj.children, ...currentSections[i]?.children];
        }
        if (obj?.children && obj?.children?.length > 0) {
          this.updateParaInCbp(currentSections, obj?.children)
        }
      }
    }
    return primarySections;
  }

  getStyles(text: string, item: any) {
    if (text?.includes('color=')) {
      let colorText = text.split('color=');
      for (let i = 0; i < colorText.length; i++) {
        if (colorText[i] !== '') {
          let colorString = colorText[i].replace(/['"]+/g, '');
          let color = colorString.substring(0, 7);
          item.color = color.includes('#') ? color : '';
          if (item.color !== '')
            this.storeColors.push(item.color);
        }
      }
    }
    if (text?.includes('size=')) {
      let colorText = text.split('size=');
      for (let i = 0; i < colorText.length; i++) {
        if (colorText[i] !== '') {
          let colorString = colorText[i].replace(/['"]+/g, '');
          item.size = colorString.substring(0, 1);
        }
      }
    }
    if (text?.includes('face=')) {
      let colorText = text.split('face=');
      for (let i = 0; i < colorText.length; i++) {
        if (colorText[i] !== '') {
          let colorString = colorText[i].replace(/['"]+/g, '');
          item.family = colorString.substring(0, 4);
        }
      }
    }
    if (text?.includes('textalign:')) {
      let colorText = text.split('textalign:');
      for (let i = 0; i < colorText.length; i++) {
        if (colorText[i] !== '') {
          let colorString = colorText[i].replace(/['"]+/g, '');
          let value = colorString.substring(0, 4);
          if ('center'.includes(value)) { item.align = 'center'; }
          if ('left'.includes(value)) { item.align = 'left'; }
          if ('right'.includes(value)) { item.align = 'right'; }
        }
      }
    }
    return item;
  }
  getFontFamily(type: string, list: any) {
    let family = '';
    for (let i = 0; i < list.length; i++) {
      if (list[i].includes(type)) { family = list[i]; break; }
    }
    return family;
  }
  removeDeletedFigures(tableMediaJson: any, deletedImages: any) {
    return tableMediaJson.filter((image: any) => {
      return !this.hasDeletedImage(image.images, deletedImages);
    });
  }
  hasDeletedImage(images: any[], deletedImages: any[]): boolean {
    for (let deletedImage of deletedImages) {
      for (let image of images) {
        if (image.name === deletedImage.name) {
          return true;
        }
      }
    }
    return false;
  }
  validateYubikeyPin(result: any) {
    const url = `https://localhost:9999/api/yubikey/verify?pin=${result}`;
    return this.http.get(url).pipe(
      catchError((err) => {
        console.error(err);
        return throwError(err);
      })
    );


  }
  removeUnnessesoryFields(obj: any) {
    for (let key in obj) {
      if (obj[key] === null || obj[key] === "" || obj[key] === undefined) {
        delete obj[key];
      } else if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        this.removeUnnessesoryFields(obj[key]); // Recursively check nested objects
        if (Object.keys(obj[key]).length === 0) {
          delete obj[key];
        }
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach((element: any, i: number) => {
          this.removeUnnessesoryFields(element); // Recursively check nested objects
          if (this.isEmptyObject(element)) {
            obj[key].splice(i, 1);
          }
        });
      }
    }
    return obj;
  }

  isEmptyObject(obj: any) {
    return obj && typeof obj === 'object' && Object.keys(obj).length === 0;
  }
  updateDerivedObjRules(parentObj: any, antlrService: any) {
    this.stepChildDerivedObjs = this.removeDuplicateRules(this.stepChildDerivedObjs);
    const derivedObjects = this.stepChildDerivedObjs || [];
    for (let i = 0; i < derivedObjects.length; i++) {
      const obj = derivedObjects[i];
      if (!obj?.DisplayValue) continue;
      let derivedObj = this.getElementByDgUniqueID(obj.dgUniqueID, parentObj);
      if (derivedObj) {
        let displayVale = derivedObj.DisplayValue;
        if (derivedObj?.isTableDataEntry) {
          displayVale = displayVale?.replace(/[\[\]']+/g, '')
        }
        derivedObj.ParsedValue = antlrService.createExpression(displayVale, null, null);
        derivedObj.ParsedValue = this.validateDerivedRuleWithDgUniqueIDs(derivedObj, this.dynamicDataEntryIds, derivedObj?.DisplayValue)
      }
    }
    return parentObj;
  }
  removeDuplicateRules(objects: any) {
    const uniqueIds = new Set<string>();
    const filteredList: any[] = [];
    for (let i = 0; i < objects?.length; i++) {
      const obj = objects[i];
      if (!obj?.dgUniqueID) continue;
      if (!uniqueIds.has(obj.dgUniqueID)) {
        uniqueIds.add(obj.dgUniqueID);
        filteredList.push(obj);
      }
    }
    return filteredList;
  }
  applyAndClearConditionalRules(newObj: any, antlrService: any, reverseTempMapUniqueID: any, sections: any) {
    if (this.stepConditionalRuleObjs?.length > 0) {
      newObj = this.updateConditionalRules(newObj, antlrService, reverseTempMapUniqueID, sections);
      this.stepConditionalRuleObjs = [];
    }
    return newObj;
  }
  updateAlarmObjRules(parentObj: any, antlrService: any) {
    this.dataEntryAlarmRuleObj = this.removeDuplicateRules(this.dataEntryAlarmRuleObj);
    const alarmObjects = this.dataEntryAlarmRuleObj || [];
    for (let i = 0; i < alarmObjects.length; i++) {
      const obj = alarmObjects[i];
      let alarmObj = this.getElementByDgUniqueID(obj.dgUniqueID, parentObj);
      for (let j = 0; j < alarmObj?.alarm?.length; j++) {
        let alarmRule = alarmObj?.alarm[j];
        if (alarmRule) {
          alarmRule = this.processRule(alarmRule, alarmObj, antlrService, 'alarm')
        }
      }
    }
    return parentObj;
  }
  updateApplicabilityRules(parentObj: any, antlrService: any) {
    this.applicabilityObjs = this.removeDuplicateRules(this.applicabilityObjs);
    const appObjects = this.applicabilityObjs || [];
    for (let i = 0; i < appObjects.length; i++) {
      const obj = appObjects[i];
      let appObj = this.getElementByDgUniqueID(obj.dgUniqueID, parentObj);
      for (let j = 0; j < appObj?.applicabilityRule.length; j++) {
        let appRule = appObj?.applicabilityRule[j];
        if (appRule) {
          appRule = this.processRule(appRule, appObj, antlrService, 'app')
        }
      }
    }
    return parentObj;
  }
  updateConditionalRules(parentObj: any, antlrService: any, reversTemp: any, sections: any) {
    this.stepConditionalRuleObjs = this.removeDuplicateRules(this.stepConditionalRuleObjs);
    const conditionalRuleObjs = this.stepConditionalRuleObjs || [];
    for (let i = 0; i < conditionalRuleObjs.length; i++) {
      const obj = conditionalRuleObjs[i];
      let conditionalRuleObj = this.getElementByDgUniqueID(obj.dgUniqueID, parentObj);
      if (conditionalRuleObj) {
        for (let j = 0; j < conditionalRuleObj?.rule?.length; j++) {
          let conditionalRule = conditionalRuleObj?.rule[j];
          const matches = [...conditionalRule?.ParsedValue.matchAll(/&([\w\d_]+)/g)].map(m => m[1]);
          if (matches) {
            for (let k = 0; k < matches?.length; k++) {
              let fieldName = reversTemp.get(matches[k]?.toString())
              if (fieldName) {
                let fieldObj = this.getElementByFieldName(fieldName, parentObj);
                if (fieldObj) {
                  fieldObj = Array.isArray(fieldObj) ? fieldObj[0] : fieldObj;
                  // if (fieldObj?.parentDgUniqueID == obj?.dgUniqueID) {
                  conditionalRule = this.processRule(conditionalRule, fieldObj, antlrService, 'conditional', sections, parentObj)
                  break;
                  // }
                }
              }
            }
          }
        }
      }
    }
    return parentObj;
  }

  extractIfCondition(input: string): string {
    const ifIndex = input.indexOf("IF");
    const thenIndex = input.indexOf("THEN");
    if (ifIndex !== -1 && thenIndex !== -1) {
      return input.substring(ifIndex, thenIndex).trim()?.replace('IF', 'if');;
    }
    return "";
  }
  extractIfConditionBlock(input: string): string {
    const ifIndex = input.indexOf("if");
    const openParenIndex = input.indexOf("(");
    const closeParenIndex = input.indexOf(")");
    if (ifIndex !== -1 && openParenIndex !== -1 && closeParenIndex !== -1 && closeParenIndex > openParenIndex) {
      return input.substring(ifIndex, closeParenIndex + 1).trim();
    }
    return "";
  }
  storeDynamicDataEntryIDs(filedName: string, dgUniqueID: any) {
    this.dynamicDataEntryIds.set(dgUniqueID, filedName);
  }
  validateDerivedRuleWithDgUniqueIDs(data: any, tempIds: any, displayValue: any) {
    if (!this.validateParsedRule(data.ParsedValue, tempIds)) {
      let reverseTempMapUniqueID: any = new Map();
      this.dynamicDataEntryIds.forEach((value: any, key: any) => reverseTempMapUniqueID.set(value?.toString(), key));
      return this.replaceDisplayRuleWithIds(displayValue, reverseTempMapUniqueID);
    }
    return data?.ParsedValue;
  }
  validateParsedRule(parsedRule: any, tempMapUniqueID: any) {
    const dgIds = this.extractNumbers(parsedRule);
    let isIdsPresent = dgIds?.length > 0 && dgIds.every((id: any) => tempMapUniqueID.has(id));
    return isIdsPresent ? isIdsPresent : ((dgIds === undefined || dgIds?.length === 0) && parsedRule ? true : false);
  }
  replaceDisplayRuleWithIds(displayRule: string, tempMap: Map<string, string>): string {
    return displayRule.replace(/&(\w+)/g, (match, key) => {
      return tempMap.has(key) ? '&' + tempMap.get(key) : match;
    });
  }
  extractNumbers(text: string): string[] {
    const matches = text.match(/&([\w\d_]+)/g);
    return matches ? matches.map(match => match.slice(1)) : [];
  }
  processRule(rule: any, fieldObj: any, antlrService: any, ruleType: any, sections: any = null, currentDynamicSection: any = null) {
    let displayValue = rule.DisplayValue;
    let extracted = '';
    if (ruleType == 'app') {
      extracted = this.extractBlockIfConditionNotWrapped(rule.ParsedValue)
    } else {
      const startIndex = rule.ParsedValue.indexOf(")") + 1;
      extracted = rule.ParsedValue.substring(startIndex).trim();
      if (ruleType == 'conditional') {
        let goToStepDgIds = this.extractGotoTargets(extracted)
        if (Array.isArray(goToStepDgIds) && goToStepDgIds?.length > 0) {
          for (let i = 0; i < goToStepDgIds?.length; i++) {
            let conditionalRuleObj = this.getElementByDgUniqueID(goToStepDgIds[i], sections);
            if (conditionalRuleObj) {
              if (Array.isArray(conditionalRuleObj)) { conditionalRuleObj = conditionalRuleObj[conditionalRuleObj?.length - 1] }
              let currentObj = this.getElementByNumber(conditionalRuleObj?.dgSequenceNumber, currentDynamicSection);
              if (currentObj) {
                extracted = this.replaceSingleGotoTarget(extracted, goToStepDgIds[i]?.toString(), currentObj?.dgSequenceNumber)
              } else {
                antlrService.callBackObject.init(conditionalRuleObj?.dgSequenceNumber, conditionalRuleObj?.dgUniqueID)
                extracted = this.replaceSingleGotoTarget(extracted, conditionalRuleObj?.dgUniqueID?.toString(), conditionalRuleObj?.dgSequenceNumber)
              }
            }
          }
        }
      }
      if (!extracted) return;
    }
    const ifCondition = this.extractIfCondition(displayValue);
    displayValue = ifCondition + extracted;
    if (fieldObj?.isTableDataEntry) {
      displayValue = displayValue.replace(/[\[\]']+/g, '');
    }
    let parsedValue = antlrService.createExpression(displayValue, null, null);
    if (ruleType == 'conditional') {
      rule.ParsedValue = parsedValue;
    } else {
      parsedValue = this.extractIfConditionBlock(parsedValue);
      rule.ParsedValue = `${parsedValue} ${extracted}`;
      if (ruleType == 'alarm' || ruleType == 'app') {
        let displayValue = `${ifCondition} ${extracted}`
        rule.ParsedValue = this.validateDerivedRuleWithDgUniqueIDs(rule, this.dynamicDataEntryIds, displayValue)
      }
    }
    return rule;
  }
  extractBlockIfConditionNotWrapped(input: string): string {
    const ifMatch = input.match(/if\s+(.+?)\s*{/);
    if (ifMatch) {
      const condition = ifMatch[1].trim();
      const isWrappedInParens = condition.startsWith('(') && condition.endsWith(')');
      if (!isWrappedInParens && condition.startsWith('&')) {
        const blockStart = input.indexOf('{');
        if (blockStart !== -1) {
          return input.substring(blockStart).trim();
        }
      }
    }
    return '';
  }
  extractGotoTargets(input: string): number[] {
    const regex = /goto\s*{([^}]+)}/g;
    const matches: number[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(input)) !== null) {
      matches.push(parseInt(match[1], 10));
    }
    return matches;
  }
  replaceSingleGotoTarget(input: string, oldValue: any, newValue: any): string {
    const target = `goto {${oldValue}}`;
    const replacement = `goto {${newValue}}`;
    const index = input.indexOf(target);
    if (index === -1) return input; // not found, return as-is
    return input.slice(0, index) + replacement + input.slice(index + target.length);
  }
  formatDate(date: Date, format: string): string {
    const map: { [key: string]: number | string } = {
      m: date.getMonth() + 1,                             // Month (1-12)
      d: String(date.getDate()).padStart(2, '0'),         // Day with leading 0
      j: date.getDate(),                                  // Day without leading 0
      Y: date.getFullYear(),
      y: date.getFullYear(),                              // Year (e.g., 2025)
      H: date.getHours(),                                 // Hours (0-23)
      h: date.getHours() % 12 || 12,                      // Hours (1-12)
      i: String(date.getMinutes()).padStart(2, '0'),      // Minutes
      s: String(date.getSeconds()).padStart(2, '0'),      // Seconds
      a: date.getHours() < 12 ? 'am' : 'pm',
      M: date.getMonth() + 1,               // am/pm
    };

    return format.replace(/m|M|y|d|j|Y|H|h|i|s|a/g, match => map[match].toString());
  }
  addDateWithFontTag(text: string, documentInfo: any) {
    const { fontsize, fontfamily, color } = documentInfo || {};
    const safeFace = fontfamily || 'Poppins';
    let safeSize = fontsize || '2';
    if (Number(safeSize) > 4) { safeSize = '4' }
    const safeColor = color || '#000000';
    return `<font face="${safeFace}" size = "${safeSize}" color = "${safeColor}" > ${text} </font>`;
  }
  getSelectedStepChildDgUniqueIds(selectedStep: any) {
    let dgUniqueIds: any = []
    if (selectedStep?.children?.length > 0) {
      selectedStep?.children.forEach((child: any) => {
        if (this.isDataEntry(child)) {
          dgUniqueIds?.push(child.dgUniqueID?.toString());
        }
      });
    }
    if (selectedStep?.dgUniqueID) {
      dgUniqueIds.push(selectedStep.dgUniqueID?.toString());
    }
    return dgUniqueIds;
  }
  hasDateOrTime(str: any) {
    if (this.isHTMLText(str)) {
      str = this.removeNewHTMLTags(str);
    }
    const date = new Date(str);
    const isValid = !isNaN(date.getTime());
    const hasDate = isValid && date.getFullYear() > 1970;
    const hasTime = isValid && (date.getHours() !== 0 || date.getMinutes() !== 0);
    return hasDate || hasTime;
  }
  isHTMLText(text: any): boolean {
    if (text === undefined) { text = ''; }
    if (isNaN(text) && text.indexOf('<') > -1 && text.indexOf('>', text.indexOf('<')) > -1) {
      return true;
    }
    return false;
  }
  removeNewHTMLTags(str: any) {
    try {
      if ((str === null) || (str === undefined) || (str === ''))
        return '';
      else {
        str = str.toString();
        let finalString = str.replace(/(<([^>]+)>)/ig, '');
        finalString = finalString.replace(/ /g, ' ');
        return finalString;
      }
    } catch (error: any) {
      console.log(error);
    }
  }
}
