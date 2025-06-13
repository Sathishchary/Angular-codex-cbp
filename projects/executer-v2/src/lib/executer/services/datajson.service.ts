import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularEditorConfig } from 'dg-shared';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DgTypes } from 'cbp-shared';


@Injectable()
export class DataJsonService {

  toolbarHiddenButtons= [
    [ 'heading'],
    [
      'customClasses',
      'insertImage',
      'insertVideo',
      'insertHorizontalRule',
      'toggleEditorMode'
    ]
  ];
  modalOptions: NgbModalOptions = {
    backdrop:'static',
    backdropClass:'customBackdrop',
    size: 'lg',
    centered: true
  }
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    minHeight: '5rem',
    maxHeight: '15rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'montserrat', name: 'Montserrat'},
      {class: 'Light 400', name: 'Poppins'},
      {class: 'time-new-roman', name: 'Time New Roman'},
      {class: 'Courier New', name: 'Courier New'}
    ],
    defaultParagraphSeparator: 'p',
    toolbarHiddenButtons: this.toolbarHiddenButtons,
    customClasses: [
      {
        name: "Custom1",
        class: "Custom1",
      },
    ],
    toolbarPosition: 'top'
  };


    errorMessage = false;
    private dataJsonUpdate = new BehaviorSubject<any>({});
    dataJsonUpdateValue = this.dataJsonUpdate.asObservable();
    setDataJsonItem(obj: any) {
      this.dataJsonUpdate.next(obj);
    }
    private mediaUpdate = new BehaviorSubject<any>({});
    mediaUpdateValue = this.mediaUpdate.asObservable();
    setMediaItem(obj: any) {
      this.mediaUpdate.next(obj);
    }

    private protectData = new BehaviorSubject<any>({});
    protectDataValue = this.protectData.asObservable();
    setprotectData(obj: any) {
      this.protectData.next(obj);
    }
    private attachMentUpdate = new BehaviorSubject<any>({});
    attachMentUpdateValue = this.attachMentUpdate.asObservable();
    setAttachItem(obj: any) {
      this.attachMentUpdate.next(obj);
    }
    private selectedElement = new BehaviorSubject<any>({});
    selectedElement$ = this.selectedElement.asObservable();
    setSelectItem(obj: any) {
      this.selectedElement.next(obj);
    }

    private detailsChange = new BehaviorSubject<any>({});
    detailsChangeView$ = this.detailsChange.asObservable();
    setDetailsChange(obj: any) {
      this.detailsChange.next(obj);
    }

    private datePlaceholder = new BehaviorSubject<any>({});
    datePlaceholderValue = this.datePlaceholder.asObservable();
    setdatePlaceholderItem(obj: any) {
      this.datePlaceholder.next(obj);
    }

    private removeSignEvent = new BehaviorSubject<any>({});
    removeSignEventValue = this.removeSignEvent.asObservable();
    clearSignItem(obj: any) {
      this.removeSignEvent.next(obj);
    }

    setObjectItem(stepObject:any){
      stepObject['color'] = stepObject['color'] ?? '#000000';
      stepObject['protectColor'] = stepObject['protectColor'] ?? '#c7ab21';
      stepObject['approveList'] = stepObject['approveList'] ?? [];
      stepObject['comments'] =  stepObject['comments'] ?? '';
      if(stepObject.dgType !== DgTypes.SignatureDataEntry && stepObject.dgType != DgTypes.InitialDataEntry)
      stepObject['storeValue'] =  stepObject['storeValue'] ?? '';
      stepObject['commentsEnabled'] = stepObject['commentsEnabled'] ? true: false;
      stepObject['isCommentUpdated'] = stepObject['commentsEnabled'] ? true :false;
      if(stepObject?.storeValue !='' && stepObject.dgType !== DgTypes.SignatureDataEntry &&
      stepObject.dgType != DgTypes.InitialDataEntry){
        if(this.isHTMLText(stepObject.storeValue)){
          stepObject['innerHtmlView'] = true;
        } else {
          stepObject['innerHtmlView'] = false;
        }
      } else {
        stepObject['innerHtmlView'] = false;
      }
      if(stepObject?.approveList?.length>0){
        stepObject.approveList.forEach((element:any) => {
          if(element.by.includes('@')){
            let item = element.by.split('@');
            element.by = item[0];
          }
        });
      }
      return stepObject;
    }
    isHTMLText(text: any): boolean {
      if(text === undefined){ text= ''; }
      if(text.indexOf('<') > -1 && text.indexOf('>', text.indexOf('<')) > -1){
        return true;
      }
      return false;
    }
}
