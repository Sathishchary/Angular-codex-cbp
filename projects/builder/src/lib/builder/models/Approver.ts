import { DgTypes } from "cbp-shared";
export class ApproverAttribute {
  data: any[] = [];
  dgUniqueID: any;
  number: any;
  prompt = '';
  varname: any;
  dgType: DgTypes = DgTypes.Approver;
  dataEntrySize = 100;
  parentDgUniqId: any;
  dataType = 'Text';
}