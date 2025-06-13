export class EnvService {

  // The values that are defined here are the default values that can
  // be overridden by environment.js
  // API url http =//ec2-54-71-91-68.us-west-2.compute.amazonaws.com =8080/e-media
  isSwitchUser = false;
  isEmail = false;
  isCREnabled = false;
  isMedia = true;
  isComments = true;
  isUndoStep = true;
  isReload = true;
  isSave = true;
  isAutoSave = true;
  isNavigation = true;
  isPageHeader = true;
  isPageFooter = true;
  isDisableCircle = true;
  isShowSectionStepIcon = true;
  downloadUrl = '';
  uploadUrl = '';
  userProfile = '';

  constructor() {
  }

}
