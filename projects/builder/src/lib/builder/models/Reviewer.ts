import { DgTypes } from "cbp-shared";
export class ReviewerAttribute {
  data: any[] = [];
  dgUniqueID: any;
  number: any;
  prompt = '';
  varname: any;
  dgType: DgTypes = DgTypes.Reviewer;
  dataEntrySize = 100;
  parentDgUniqId: any;
  dataType = 'Text';
}