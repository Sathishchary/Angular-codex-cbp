export class PropertyData {
    documentName!: any;
    status!: any;
    title!: any;
    pending = false;
    offline = false;
    validation = false;
    downloadable = false;
  
    controlType!:any; 
    approval=false;
    printable=false;
  
  
    typeDoc = false;
    subTypedoc = false;
    subTypePDF = false;
    subTypeCBP = false;
    subTypeXML = false;
  
    lessThanMb!: number;
    greaterThanMb!: number;
  
    addedMinDate!: any;
    addedMaxDate!: any;
  
    ststausMinDate!: any;
    ststausMaxDate!: any;
  
    validMinDate!: any;
    validMaxDate!: any;
  
    addedBy = 0;
    isEmpty(property: PropertyData){
      if (property.documentName && property.documentName !== '') {
        return false;
      }
       if (property.status) {
         return false;
       }
      if (property.title) {
        return false;
      }
      if (property.pending) {
        return false;
      }
      if (property.offline) {
        return false;
      }
      if (property.validation) {
        return false;
      }
      if (property.downloadable) {
        return false;
      }
      if (property.typeDoc) {
        return false;
      }
      if (property.subTypedoc) {
        return false;
      }
      if (property.subTypeCBP) {
        return false;
      }
      if (property.subTypePDF) {
        return false;
      }
      if (property.subTypedoc) {
        return false;
      }
      if (property.lessThanMb) {
        return false;
      }
      if (property.greaterThanMb) {
        return false;
      }
      if (property.addedMinDate) {
        return false;
      }
      if (property.addedMaxDate) {
        return false;
      }
      if (property.validMinDate) {
        return false;
      }
      if (property.validMaxDate) {
        return false;
      }
      if (property.ststausMinDate) {
        return false;
      }
      if (property.ststausMaxDate) {
        return false;
      }
      if (property.controlType) {
        return false;
      }
      if (property.approval) {
        return false;
      }
      if (property.printable) {
        return false;
      }
      return true;
    }
  }
  