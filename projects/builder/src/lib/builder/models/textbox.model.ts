import { DgTypes } from 'cbp-shared';
import { Security } from './security';

export class Textbox {
  choice: any[] = [];
  data: any[] = [];
  allowOther: any;
  dgUniqueID: any;
  unnumbered: any;
  prompt = '';
  varname = '';
  fieldName = '';
  fieldNameUpdated = false;
  innerHtmlView = false;
  required = false;
  type = 'data element';
  dataType = 'Text';
  valueType = 'Entered';
  DisplayValue = '';
  ParsedValue = '';
  autoPopulate = 'CurrentUser';
  dgType: DgTypes = DgTypes.TextDataEntry;
  Maxsize = '';
  storeValue = '';
  alarm = [];
  isDataEntry = true;
  showLablePrompt = '';
  showLabel = false;
  labelSide = 'left';
  dataEntrySize = 100;
  parentDgUniqId: any;
  Security = new Security();
}
