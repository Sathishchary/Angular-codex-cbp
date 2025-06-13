import { DgTypes } from "cbp-shared";
export class DescriptionAttribute {
  data: any[] = [];
  dgUniqueID: any;
  number: any;
  prompt = '';
  varname: any;
  dgType: DgTypes = DgTypes.Description;
  dataEntrySize = 100;
  parentDgUniqId: any;
  dataType = 'Text';
}