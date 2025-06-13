import { DgTypes } from "cbp-shared";

export class UnitAttribute {
  data: any[] = [];
  dgUniqueID: any;
  number: any;
  prompt = '';
  varname: any;
  dgType: DgTypes = DgTypes.Unit;
  dataEntrySize = 100;
  parentDgUniqId: any;
  dataType = 'Text';
}