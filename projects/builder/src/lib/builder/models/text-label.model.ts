import { DgTypes } from "cbp-shared";
import { Security } from "./security";
export class TextLabel {
  choice: any[] = [];
  alarm = [];
  rule = [];
  data: any[] = [];
  allowOther: any;
  dgUniqueID: any;
  unnumbered: any;
  prompt = '';
  varname: any;
  fieldName = '';
  fieldNameUpdated = false;
  required = false;
  dataType = 'label';
  dgType: DgTypes = DgTypes.LabelDataEntry;
  isDataEntry = false;
  showLabel = false;
  dataEntrySize = 100;
  parentDgUniqId: any;
  Security = new Security();
}
