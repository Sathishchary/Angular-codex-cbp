/***************************************
 *  @author: G Rammohan ;              *
 *  @contact: grammohan@stratapps.com  *
 ***************************************/

export interface Action {
  isCommonAction: number;
  isRowAction?: number;
  isToolbarAction: number;
  order: number;
  packageAction: string;
  packageActionCode: number;
  packageActionDisplay: string;
  isCustom: number;
  actionApplicable: number;
  masterNotApplicable: number;
  loginReq: number;
  connectivityReq: number;
  checkoutReq: number;
  autoCheckinReq: number;
  confirmationReq: number;
  editReq: number;
  hideIfDisabled: number;
  groupDtlPage: string;
  packageGroupDtlPage: string;
  confirmationMsg: string;
  nextPackageStatusId: any;
  actionServiceId: any;
  actionDocument: any;
  supportMultiStatus: number;
  supportMultiSelect: number;
  disabled: boolean;
  pageId: string;
  packageCommentOption: number;
  packageCommentType: string;
  isStatic: string;

}
