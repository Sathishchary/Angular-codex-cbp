import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { CbpService } from '../../services/cbp.service';
import { BuilderUtil } from '../../util/builder-util';
import { ControlService } from '../../services/control.service';
import { DgTypes } from 'cbp-shared';

@Injectable({
  providedIn: 'root'
})

export class HyperLinkService {

  DgTypes: typeof DgTypes = DgTypes;
  hlData:any ;

  constructor( public controlService: ControlService, private cbpService: CbpService, private _buildUtil: BuilderUtil, private notifier: NotifierService) { }

  initEditorProps(field: any) {
    if(field.dgType != DgTypes.Caution && field.dgType != DgTypes.Warning){
      field['editorOpened'] = false;
      //this._buildUtil.isHTMLText(field[this._buildUtil.getSearchText()]) ? field['isHtmlText'] = true : delete field['isHtmlText'];
    } else {
      field['editorCauseOpened'] = false;
      field['editorEffectOpened'] = false;
    }
  }

  initEditorPropsNew(field: any) {
    if(field.dgType != DgTypes.Caution && field.dgType != DgTypes.Warning){
      field['editorOpened'] = false;
      //this._buildUtil.isHTMLText(field[this._buildUtil.getSearchText()]) ? field['isHtmlText'] = true : delete field['isHtmlText'];
    } else {
      field['editorCauseOpened'] = false;
      field['editorEffectOpened'] = false;
    }
    return field;
  }

  onLinkDrop(e: any, item: any) {
    if(this.cbpService.searchTemplate){
      this.notifier.hideAll();
      this.notifier.notify('warning', 'Please close the search and try again ');
      return;
    }
    if(e){
      this.hlData = e.dragData;
    } else {
      this.hlData = null;
    }
    this.cbpService.triggerHyperLink = !this.cbpService.triggerHyperLink;
  }

  //Paragraph Editor
  openParagraphEditor(item: any) {
    if (!item['editorOpened']) {
      item['editorOpened'] = true;
      this.cbpService.isViewUpdated = true;
    }
  }
  outputhtml(event: any, item: any, propName: any) {
    if(item.dgType != DgTypes.Caution && item.dgType != DgTypes.Warning){
      item['editorOpened'] = false;
      this.cbpService.isViewUpdated = true;
      if (propName!= null && propName!= undefined) {
        if(item.dgType != DgTypes.Note && item.dgType != DgTypes.Alara){
          item[propName] = event;
          this._buildUtil.isHTMLText(item[propName]) ? item['isHtmlText'] = true : delete item['isHtmlText'];
        } else {
          if(item.dgType == DgTypes.Alara){
            item.alaraNotes[propName] = event;
            this._buildUtil.isHTMLText(item.alaraNotes[propName]) ? item['isHtmlText'] = true : delete item['isHtmlText'];
          }
          else{
            item.notes[propName] = event;
            this._buildUtil.isHTMLText(item.notes[propName]) ? item['isHtmlText'] = true : delete item['isHtmlText'];
          }

        }

        if (item['isHtmlText']) {
          if (item.dgSequenceNumber) {
            item = this._buildUtil.setIconAndText(item);
            this.cbpService.headerItem = JSON.parse(JSON.stringify(item));
          }
          setTimeout(() => { }, 1);
        }
        // console.log(item);
      }
    } else {
      item[propName] = event;
      if(propName == 'cause'){
        this._buildUtil.isHTMLText(item[propName]) ? item['isCauseHtmlText'] = true : delete item['isCauseHtmlText'];
      }
      if(propName == 'effect'){
        this._buildUtil.isHTMLText(item[propName]) ? item['isEffectHtmlText'] = true : delete item['isEffectHtmlText'];
      }
    }
  }
  editorOpened(item: any, prop= null) {
    if (this.cbpService.selectedElement.dgUniqueID === item.dgUniqueID) {
      if(item.dgType != DgTypes.Caution && item.dgType != DgTypes.Warning){
        item['editorOpened'] = true;
        this.cbpService.isViewUpdated = true;
      } else {
        if(prop == 'cause'){
          item['editorCauseOpened'] = true;
          item['editorEffectOpened'] = false;
        }else if(prop == 'effect'){
          item['editorCauseOpened'] = false;
          item['editorEffectOpened'] = true;
        } else {
          item['editorCauseOpened'] = false;
          item['editorEffectOpened'] = false;
        }
        this.cbpService.isViewUpdated = true;
      }

    } else if(item.isTableDataEntry){
      item['editorOpened'] = true;
      this.cbpService.isViewUpdated = true;
    } else {
      item['editorOpened'] = false;
    }
    this.cbpService.isViewUpdated = true;
  }

  editorOpenednewUpdate(item: any, prop= null) {
    if (this.cbpService.selectedElement.dgUniqueID === item.dgUniqueID) {
      if(item.dgType != DgTypes.Caution && item.dgType != DgTypes.Warning){
        item['editorOpened'] = true;
      } else {
        if(prop == 'cause'){
          item['editorCauseOpened'] = true;
          item['editorEffectOpened'] = false;
        }else if(prop == 'effect'){
          item['editorCauseOpened'] = false;
          item['editorEffectOpened'] = true;
        } else {
          item['editorCauseOpened'] = false;
          item['editorEffectOpened'] = false;
        }
      }
    } else if(item.isTableDataEntry){
      item['editorOpened'] = true;
    } else {
      item['editorOpened'] = false;
    }
    this.cbpService.isViewUpdated = true;
    return item;
  }

  outputhtmlNew(event: any, item: any, propName: any) {
    if(item.dgType != DgTypes.Caution && item.dgType != DgTypes.Warning){
      item['editorOpened'] = false;
      this.cbpService.isTableEditorOpen = false;
      this.cbpService.isViewUpdated = true;
      if (propName!= null && propName!= undefined) {
        if(item.dgType != DgTypes.Note && item.dgType != DgTypes.Alara){
          item[propName] = event;
          this._buildUtil.isHTMLText(item[propName]) ? item['isHtmlText'] = true : delete item['isHtmlText'];
        } else {
          if(item.dgType == DgTypes.Alara){
            item.alaraNotes[propName] = event;
            this._buildUtil.isHTMLText(item.alaraNotes[propName]) ? item['isHtmlText'] = true : delete item['isHtmlText'];
          }
          else{
            item.notes[propName] = event;
            this._buildUtil.isHTMLText(item.notes[propName]) ? item['isHtmlText'] = true : delete item['isHtmlText'];
          }

        }
        if (item['isHtmlText']) {
          if (item.dgSequenceNumber) {
            item = this._buildUtil.setIconAndText(item);
            this.cbpService.headerItem = JSON.parse(JSON.stringify(item));
          }
          setTimeout(() => { }, 1);
        }
      }
    } else {
      item[propName] = event;
      if(propName == 'cause'){
        this._buildUtil.isHTMLText(item[propName]) ? item['isCauseHtmlText'] = true : delete item['isCauseHtmlText'];
      }
      if(propName == 'effect'){
        this._buildUtil.isHTMLText(item[propName]) ? item['isEffectHtmlText'] = true : delete item['isEffectHtmlText'];
      }
    }
    return item;
  }
  dragEditorOpened(item: any){
    if (item.dgUniqueID || item.dgUniqueID == undefined) {
      if(item.dgType == DgTypes.TextDataEntry || item.dgType == DgTypes.DateDataEntry || item.dgType == DgTypes.LabelDataEntry){
        item['editorOpened'] = true;
        this.cbpService.isViewUpdated = true;
      }
  }
}
}
