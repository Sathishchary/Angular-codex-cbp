import { DgTypes } from "cbp-shared";
import { Security } from "./security";
export class NumberList {
  data: any[] = [];
  dgUniqueID: any;
  prompt = '';
  varname: any;
  dataEntrySize = 100;
  parentDgUniqId: any;
  dataType = 'Text';
  dgType: DgTypes = DgTypes.Number;
  Security = new Security();
}
