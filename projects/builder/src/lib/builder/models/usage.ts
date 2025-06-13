import { DgTypes } from "cbp-shared";

export class UsageAttribute {
  data: any[] = [];
  dgUniqueID: any;
  number: any;
  prompt = '';
  varname: any;
  dgType: DgTypes = DgTypes.Usage;
  dataEntrySize = 100;
  parentDgUniqId: any;
  dataType = 'Text';
}