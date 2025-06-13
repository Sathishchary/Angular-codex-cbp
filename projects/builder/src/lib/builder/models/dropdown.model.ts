import { DgTypes } from "cbp-shared";
import { Security } from "./security";
export class DropDown {
  choice: any[] = [];
  data!: any[];
  allowOther: any;
  dgUniqueID: any;
  unnumbered: any;
  number: any;
  prompt = '';
  varname: any;
  fieldName = '';
  fieldNameUpdated = false;
  required = false;
  dataType = 'Dropdown';
  dgType: DgTypes  = DgTypes.TextDataEntry;
  alarm = [];
  rule = [];
  isDataEntry = true;
  showLabel = false;
  showLablePrompt = '';
  dataEntrySize = 100;
  labelSide = 'left';
  Security = new Security();

}
