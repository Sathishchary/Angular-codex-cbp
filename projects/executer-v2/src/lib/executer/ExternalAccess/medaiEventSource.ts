export enum Event_resource {
  uploadRef = 'uploadRef',
  camUpload = "camUpload",
  commentsRef = 'commentsRef',
  crRef = 'crRef',
  details_execution = 'details_execution',
  sendEmailRef = 'sendEmailRef',
  saveDataJsonRef = "saveDataJsonRef",
  refreshDataJsonRef = "refreshDataJsonRef",
  verifyLoginSecurityRef = "verifyLoginSecurity",
  userCBPInfoRef = "userCBPInfo",
  penInk = "penInk",
  annotationSDK = "annotationSDK",
  signature = "signature",
  initial = "initial",
  yubikey = "yubikey",
  reStartExecution ="reStartExecution",
}

export interface Resp_Msg {
  source?: Event_resource;
  eventType?: EventType;//Event Types
  msg?: any,
  msgType?: any
}

export interface Request_Msg {
  eventType?: EventType;//Event Types
  msg?: any;//Event msg
  eventFrom?: Event_resource //Event resource
  dynamicSection?: any;
  dynamicSectionInfo?: any;
  datajson?: any;
  signatureJson?: any;
  protectJson?: any;
  annotateJson?: any;
  executionOrderJson?: any;
  opt?: any;
  isAutoSave?: boolean;
  lastUpdatedEvent?:any ;
  msgData?:any ;
}

export interface Request_Executor_Msg {
  eventType?: string;//Event Types
  requestObj?: any;//Event msg
}

export enum Device_Platform {
  ios = 'ios',
  android = 'android',
  windows = 'windows',
  web = 'web'
}

export enum EventType {
  setUserProfile = "setUserProfile",
  sendMsgToPlugin = "sendMsgToPlugin",
  setAutoSave = "setAutoSave",
  updateLocation = "updateLocation",
  getTextData = "setUserProfile",
  setCodeValues = 'setCodeValues',
  annotationSDK = "annotationSDK",
  setAnnotation_Success = "setAnnotation_Success",
  setReasonCodeValues = "setReasonCodeValues",
  setFacility = "setFacility",
  setCommentTypes = "setCommentTypes",
  refreshMedia = "refreshMedia",
  clearCbpData = "clearCbpData",
  saveEvent = "saveEvent",
  saveEventFromMobile = "saveEventFromMobile",
  saveDynamicJsonEvent = "saveDynamicJsonEvent",
  refreshEvent = "refreshEvent",
  stopexecution = "stopexecution",
  startexecution = "startexecution",
  TableStartExecution = "TableStartExecution",
  refreshCbpData = "refreshCbpData",
  crMediaEvent = "crMediaEvent",
  fireMediaEditEvent = "fireMediaEditEvent",
  fireMediaPreviewEvent = "fireMediaPreviewEvent",
  fireMediaEvent = "fireMediaEvent",
  fireCameraEvent = "fireCameraEvent",
  fireCameraVideoEvent = "fireCameraVideoEvent",
  fireCameraVideoReceivedEvent = "fireCameraVideoReceivedEvent",
  fireVideoPlayEvent = "fireVideoPlayEvent",
  fireCancelMediaEvent = "fireCancelMediaEvent",
  fireSaveMediaEvent = "fireSaveMediaEvent",
  fireSignatureEvent = "fireSignatureEvent",
  fireVerificationLoginEvent = "fireVerificationLoginEvent",
  fireLinkAttachmentEvent = "fireLinkAttachmentEvent",
  fireLinkEdocEvent = "fireLinkEdocEvent",
  fireLinkURLEvent = "fireLinkURLEvent",
  fireLinkEmeadiaEvent = "fireLinkEmeadiaEvent",
  triggerScanevent = "triggerScanevent",
  triggerCodeScanevent = "triggerCodeScanevent",
  setUserName = "setUserName",
  setUserInfo = "setUserInfo",
  fireVerificationCodeLoginEvent = "fireVerificationCodeLoginEvent",
  setScanData = "setScanData",
  setCodeScanData = "setCodeScanData",
  setVerificationCodeName = "setVerificationCodeName",
  setMedia = "setMedia",
  setVideo = "setVideo",
  setSignature = "setSignature",
  setSignatureForIOS = "setSignatureForIOS",
  showLoader = "showLoader",
  hideLoader = "hideLoader",
  setDataJson = "setDataJson",
  getCbpData = "getCbpData",
  send_mail = 'send_mail',
  saveEvent_HandShake = 'save_event_handshake',
  crOpened = "crOpened",
  setClosecbp = "setClosecbp",
  fireMeadiaRemove = "fireMeadiaRemove",
  setMediaEdit = 'setMediaEdit' ,
  fireEditedMedia = 'fireEditedMedia',
  //DeskTop Events
  // execution
  SaveDataJson = "SaveDataJson",
  RefreshDataJson = "RefreshDataJson",
  refreshDataJson_failed = "refreshDataJson_failed",
  saveDataJson_failed = "SaveDataJsonFailed",
  getCBPDataJson = "getCBPDataJson",

  freezeExecuter = "freezeExecute",

  SendEmail = "SendEmail",

  // change request
  CRTypes = "CRTypes",
  CRReasons = "CRReasons",
  CRFecility = 'CRFecility',
  CRUnit = 'CRUnit',
  CRDecipline = 'CRDecipline',
  // comments
  CommentTypes = 'CommentTypes',
  CodeValues = "CodeValues",
  VerificationLogin = 'VerificationLogin',
  UserInfo = "UserInfo",
  //setCodeValues ="setCodeValues",
  setFacilityValues = "setFacilityValues",
  //setReasonCodeValues = "setReasonCodeValues",
  //setCommentTypes ="setCommentTypes",
  setUnitFacility = "setUnitFacility",
  verifyLoginSecurity = "verifyLoginSecurity",
  userCBPInfo = "userCBPInfo",
  //Output Events For Web
  sendEmail_success = 'SendEmail_Success',
  saveDataJson_success = "SaveDataJsonSuccess",
  refreshDataJson_success = "RefreshDataJsonSuccess",
  setReasonCodeValues_success = "setReasonCodeValuesSuccess",
  setCodeValues_success = "setCodeValuesSuccess",
  setFacilityValues_success = "setFacilityValuesSuccess",
  setCommentTypes_success = "setCommentTypesSuccess",
  setUnitFacility_success = "setUnitFacilitySuccess",
  verifyLoginSecurity_success = "verifyLoginSecuritySuccess",
  userCBPInfo_success = "userCBPInfoSuccess",
  getCBPZip = "getCBPZip",
  verifyLoginSecurity_Fail = "verifyLoginSecurity_Fail",
  getCbpFile = "getCbpFile",
  refObj = "refObj",
  linkObj = "linkObj",
  penInk = "penink",
  changeEvent = "changeEvent",
  yubikey = "yubikey",
  reStartExecution ="reStartExecution",
}


export enum MenuBarEventType {
  protectAllFields = "protectAllFields",
  ClearSelectedFields = "ClearSelectedFields"

}
