import { DgTypes } from "cbp-shared";
import { Security } from "./security";
export class Initial {
  choice: any[] = [];
  alarm = [];
  data: any[] = [];
  allowOther: any;
  dgUniqueID: any;
  unnumbered: any;
  prompt = 'Requires Initials';
  valueType = 'Entered';
  autoPopulate = 'CurrentInitial';
  Varname = '';
  dgType: DgTypes = DgTypes.InitialDataEntry;
  nameDisplay = false;
  required = false;
  initial = '';
  isDataEntry = true;
  security = new Security();
}
