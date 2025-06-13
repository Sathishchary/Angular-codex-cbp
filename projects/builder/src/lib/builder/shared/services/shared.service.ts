import { Injectable } from '@angular/core';
import { SingleImageProperties } from 'cbp-shared';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { CbpService } from '../../services/cbp.service';
const findAnd = require('find-and');

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  imageEditorIds: any[] = [];
  showExecutionOrder = false;
  accept = ".m4v,.avi,.mpg,.mp4,.flv,.mov,.wmv,.divx,.f4v,.mpeg,.vob,.xvid,.mp3,.mpeg,.vnd.wav,.ogg,.x-mpegurl,.jpeg,.gif,.png,.jpg,.pipeg,.tiff,.jfif,.zip,.PNG,.JPG,.JPEG";
  singleMediaAccept = ".m4v,.avi,.mpg,.mp4,.flv,.mov,.wmv,.divx,.f4v,.mpeg,.vob,.xvid,.mp3,.mpeg,.vnd.wav,.ogg,.x-mpegurl,.jpeg,.gif,.png,.jpg,.pipeg,.tiff,.jfif,.PNG,.JPG,.JPEG";
  constructor(public cbpService: CbpService) { }
  builderMediaFiles = [];
  mediaFilesStorage = new BehaviorSubject<SingleImageProperties[]>([]);
  newImages = this.mediaFilesStorage.asObservable();

  mediaFilesStorageItem(val: any) {
    this.mediaFilesStorage.next(val);
    this.cbpService.mediaBuilderObjects = [...this.cbpService.mediaBuilderObjects, ...val];
  }

  // the getter will return the last value emitted in _todos subject
  get getImage(): any[] {
    return this.mediaFilesStorage.getValue();
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
    return findAnd.returnFound(section, { dgUniqueID: dgUniqueID });
  }

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
}
