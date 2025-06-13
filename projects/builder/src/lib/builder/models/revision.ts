import { DgTypes } from "cbp-shared";
export class RevisonAttribute {
  data: any[] = [];
  dgUniqueID: any;
  number: any;
  prompt = '';
  varname: any;
  dgType: DgTypes = DgTypes.Revision;
  dataEntrySize = 100;
  parentDgUniqId: any;
  dataType = 'Text';
}