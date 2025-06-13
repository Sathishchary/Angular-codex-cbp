/***************************************
 *  @author: G Rammohan ;              *
 *  @contact: grammohan@stratapps.com  *
 ***************************************/

export interface Atributes {
  attrRow: number;
  attrColumn: number;
  attrOrder: number;
  name: string;
  attrColumnSpan: number;
  attrRowSpan: number;
  attrSize: number;
  dataType: number;
  displayAttr: number;
  displayType: number;
  fontSize: number;
  isPackageInternalKey: number;
  isPackageKey: number;
  isRequired: number;
  isEditable: number;
  isSortable: number;
  packageAttrDisplay: string;
  packageAttrLabel: string;
  packageGroupDtlPage: string;
  showShortLabel: number;
  hideLabel: number;
  value: any;
  savedValue: any;
  groupDtlPage: string;
  activeSort: string;
  qsRow: any;
  isAttrPge: boolean;
  multiSelect: number;
  enableComments: number;
  commentsReqd: number;
  comments: string;
  qsResponseHeader: any;
  parentAttribute: string;
  pageId: string;
  options: any;
}
