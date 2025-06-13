import { DgTypes } from "cbp-shared";
import { Security } from "./security";
export class TextArea {
  choice: any[] = [];
  data: any[] = [];
  allowOther: any;
  dgUniqueID: any;
  unnumbered: any;
  prompt = '';
  varname: any;
  fieldName = '';
  fieldNameUpdated = false;
  innerHtmlView = false;
  type = 'data element';
  dataType = 'Text Area';
  multiline = 'true';
  dgType: DgTypes = DgTypes.TextAreaDataEntry;
  required = false;
  alarm = [];
  isDataEntry = true;
  Maxsize = null;
  showLablePrompt = '';
  showLabel = false;
  labelSide = 'left';
  dataEntrySize = 100;
  Security = new Security();
}
