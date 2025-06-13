export class ImageModal{
  fileName = '';
  caption = '';
  description = '';
  dgUniqueID = '';
  fileType = '';
  type = 'executor';
  dgType = 'Figure';
  isSavedOnServer = false;
  mediaType = '';
  file:any;
  internalName:any;
  name:any;
  action:number;
  constructor(fileName?:string,  caption?:string, description?:string, dgUniqueID?:string, fileType?:string, 
    type?:any, dgType?:any, isSavedOnServer?:boolean, mediaType?:string,  file?:any, internalName?:any,name?:string, action?:any ){
      this.fileName = fileName ? fileName : '';
      this.caption = caption ? caption : '';
      this.description = description ? description : '';
      this.dgUniqueID = dgUniqueID ? dgUniqueID : '';
      this.fileType = fileType ? fileType : '';
      this.type = type? type: 'executor';
      this.dgType = dgType ? dgType: 'Figure';
      this.isSavedOnServer = isSavedOnServer ? isSavedOnServer:  false;
      this.mediaType = mediaType ? mediaType : '';
      this.file = file ? file : '';
      this.internalName = internalName ? internalName : '';
      this.name = name ? name : '';
      this.action = action ? action : 0;
  }
}
