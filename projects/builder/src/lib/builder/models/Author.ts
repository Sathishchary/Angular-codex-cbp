import { DgTypes } from "cbp-shared";
export class AuthorAttribute {
  data: any[] = [];
  dgUniqueID: any;
  number: any;
  prompt = '';
  varname: any;
  dgType: DgTypes = DgTypes.Author;
  dataEntrySize = 100;
  parentDgUniqId: any;
  dataType = 'Text';
}