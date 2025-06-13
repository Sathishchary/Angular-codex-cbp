import { DgTypes } from "cbp-shared";

export class ObjectiveAttribute {
  data: any[] = [];
  dgUniqueID: any;
  number: any;
  prompt = '';
  varname: any;
  dgType: DgTypes = DgTypes.Objective;
  dataEntrySize = 100;
  parentDgUniqId: any;
  dataType = 'Text';
}