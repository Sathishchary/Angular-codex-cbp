import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
declare var $: any;
const findAnd = require('find-and');
@Injectable({
  providedIn: 'root'
})
export class CbpSharedService {
  imageEditorIds: any[] = [];
  mediaViewLoader!: boolean;

  private imageCaption = new BehaviorSubject<any>({});
  imageCaptionSub = this.imageCaption.asObservable();
  setMediaCaption(obj: any) {
    this.imageCaption.next(obj);
  }

  constructor() { }

  setEditImages(id: any) {
    this.imageEditorIds.push(id);
  }
  getEditImages() {
    return this.imageEditorIds;
  }
  clarEditImages() {
    this.imageEditorIds = [];
  }
  clarSelectedImage(index: any) {
    if (this.imageEditorIds.length > index) {
      this.imageEditorIds.splice(index, 1);
    }
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


  openModalPopup(modalId: any) {
    $('#' + modalId).modal('show');
    $("#" + modalId).appendTo("body");
  }
  closeModalPopup(modalId: any) {
    this.hideModal(modalId)
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    $("body>#" + modalId).remove();
  }
  removeModal(modalId: string) {
    this.hideModal(modalId)
    $('body').removeClass('modal-open');
    $("body>#" + modalId).remove();
  }
  hideModal(modalId: any) {
    $('#' + modalId).modal('hide');
  }
  removeBackdrop() {
    $('.modal-backdrop').remove();
  }


  replaceElement(source: any, target: any, section: any): any {
    return findAnd.replaceObject(section, source, target);
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
  getElementBypaginationIndex(index: any, section: any): any {
    return findAnd.returnFound(section, { paginateIndex: index });
  }

  isHTMLText(text: any): boolean {
    if (text === undefined) { text = ''; }
    if (isNaN(text) && text.indexOf('<') > -1 && text.indexOf('>', text.indexOf('<')) > -1) {
      return true;
    }
    return false;
  }
  removeHTMLTags(str: any) {
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
