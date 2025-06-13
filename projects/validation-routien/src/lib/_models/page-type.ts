/***************************************
 *  @author: G Rammohan ;              *
 *  @contact: grammohan@stratapps.com  *
 ***************************************/

export enum PageTypes {
  LIST = 1000,
  DETAIL = 2000,
  SECTION = 3000,
  POP_UP_PAGE = 4000,
  CUSTOME_PAGE = 5000,
  NEW_OR_CREATE_PAGE = 6000,
  OFFLINE_LIST_PAGE = 9999
}


export enum PageSubTypes {
  STANDARD_PAGE = 1000,
  ATTRIBUTE_PAGE = 2000,
  LIST_PAGE = 3000,
  POP_UP_PAGE = 4000,
  NEW_OR_CREATE_PAGE = 6000,
  OFFLINE_LIST_PAGE = 9999,
  SECTION_CUSTOME_PAGE = 10000,

}

export enum ActionStates {
  COMPLETED = 'COMPLETED',
  HOLD = 'HOLD',
  INPROGRESS = 'INPROGRESS',
  CANCEL = 'CANCEL',
  PARTIAL = 'PARTIAL',

}

export enum Types {
  PACKAGE = 'PACKAGE',
  DETAIL = 'DETAIL',
  FILE_TABS = 'FILE_TABS',
  POPUP = 'POPUP',
  MULTI_ACTION_SERVICE = 'MULTI_ACTION_SERVICE',

}

export enum DisplayTypes {
  TEXT_BOX = 1000,
  DATE = 2000,
  TIME_STAMP = 3000,
  CHECK_BOX = 4000,
  IMAGE = 8000,
  DROP_DOWN = 5000,
  DATE_RANGE = 10000,
  RADIO = 6000,
  BAR_CODE = 7000,
  LINK = 11000,
  LINK_ICON = 17000,
  PROMPT = 12000,
  SEARCH = 13000,
  FILE_BROWSE = 14000,
  HTML_TEXT = 15000,
  SIGNATURE = 16000,




}

export enum DataTypes {
  VARCHAR = 12,
  DECIMAL = 3,
  INTEGER = 4,
  DATE = 91,
  TIMESTAMP = 93,
  BOOLEAN = 16,
  CHAR = 1

}


export enum PopUpTypes {
  GENERAL = 'GENERAL',
  PROMPT = 'PROMPT',
  FILTER_BUTTON = 'FILTER_BUTTON',
  DETAIL = "DETAIL"
}

export enum ValidationTypes {
  MTEADD_DEFAULT = 'MTEADD_DEFAULT',
  MTEADD = 'DGValidateMTE',
  TIMESHEETADD ='DGValidateTimeEntry',
  NOTIFICATIONADD = 'DGDocumentOrderNotify',
  NOTIFICATIONEDIT = 'DGDocumentOrderNotifyEdit',
  RELEVANCYREVIEWPROCEDURE = 'DGRelevancyReviewProcedure',
  RELEVANCYREVIEWOPTION = 'DGRelevancyReviewOption',
  DGTASKSTATUSUPDATEVALIDATE = 'DGTaskStatusUpdateValidate',
  DGDOCUMENTUPLOADVALIDATION = 'DGDocumentUploadValidation',
  DGMEDIAREVISIONVALIDATION = 'DGMediaRevisionValidation'
}
