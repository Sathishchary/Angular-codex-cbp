import { Injectable } from '@angular/core';
import { AlertMessages, DgTypes } from 'cbp-shared';
import { ActionId, DataInfo, DataInfoModel, SaveObject, StepOption, StepTypes, UserInfo } from '../models';
import { ExecutionService } from './execution.service';
declare var $: any;

/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */

@Injectable()
export class SharedviewService {

  stepFieldValidation = false;
  stepActionValidation = false;
  alertsValidation = false;
  isAlertMessage = false;
  childStepValidation = false;
  childHoldValidation = false;
  whileRuleCondition = false;
  acknowledgeValidation = false;
  depedencyValidation = false;
  isLinkSelected = false;
  whileRuleMessage: any;
  dependencyArray = [];
  longtitude!: string;
  latitude!: string;
  deviceInfo: any;
  stepTypes = StepTypes;
  isSectionComplete = false;
  isNavigationOpen = true;
  isViewUpdated!: boolean;
  hasStoreItem!: boolean;
  detectAll: boolean = false;
  viewUpdated: any = false;
  col12 = 'col-lg-12 col-md-12 col-sm-12 col-xs-12 col-12';
  col10 = 'col-lg-10 col-md-10 col-sm-10 col-xs-10 col-10';
  col6 = 'col-6 col-sm-6 col-sm-6 col-md-6 col-lg-6';
  col3 = 'col-3 col-sm-3 col-sm-3 col-md-3 col-lg-3';
  col2 = 'col-2 col-sm-2 col-sm-2 col-md-2 col-lg-2';
  midPaste: boolean = false;
  tableViewUpdated = false;
  colorNodes: any[] = [];
  showComments = false;
  userCbpInfo: any;
  dateFormats = [
    { 'value': "m/j/Y", 'date': 'mm/dd/yyyy' },
    { 'value': "j/m/Y", 'date': 'dd/mm/yyyy' },
    { 'value': "j/M/Y", 'date': 'dd/mon/yyyy' },
    { 'value': "Y/M/j", 'date': 'yyyy/mon/dd' },
    { 'value': "m-j-Y", 'date': 'mm-dd-yyyy' },
    { 'value': "j-m-Y", 'date': 'dd-mm-yyyy' },
    { 'value': "j-M-Y", 'date': 'dd-mon-yyyy' },
    { 'value': "Y-M-j", 'date': 'yyyy-mon-dd' }
  ];
  storeColors: any[] = [];
  fontNames = ['Arial', 'Calibri', 'Montserrat', 'Poppins', 'TimeNewRoman', 'Courier New'];
  fontSizes = ['1', '2', '3', '4', '5', '6', '7'];
  colors = ['#000000', '#00FF00', '#ff0000', '#0000ff'];
  constructor(public executionService: ExecutionService) { }

  // check whether the current step has any pending alert notifications
  hasAnyAlertMessages(obj: any) {
    if (obj.children !== undefined && obj.children.length > 0) {
      this.isAlertMessage = false;
      for (let i = 0; i < obj.children.length; i++) {
        if (this.executionService.messageCondition(obj.children[i])) {
          if (obj.children[i]?.complete === true ||
            obj.children[i].isTapped == 2 || obj.children[i].options.complete === true) { obj.children[i].isChecked = true; }
          if (!obj.children[i].isChecked && !obj['options']['notApplicable'] &&
            !obj?.options?.notApplicable &&
            !obj?.options?.notApplicable && !obj?.options?.skip) {
            this.isAlertMessage = true; break;  // one alert is not completed
          }
        }
      }
      return this.isAlertMessage;
    } else {
      this.isAlertMessage = false;
      return false; // no alerts || all alerts have been completed
    }
  }
  // check whether the current step has any pending alert notifications or ack or step actions
  checkPreviousAlerts(currentObj: any, stepSequentialArray: any) {
    // this.setValidationFields();
    const index = stepSequentialArray.findIndex((el: any) => el.dgUniqueID === currentObj.dgUniqueID);
    for (let j = 0; j < index; j++) {
      const object = stepSequentialArray[j];
      if (currentObj !== object) {
        if (object.dgType === DgTypes.Section || object.dgType === DgTypes.StepInfo || this.executionService.stepActionCondition(object)) {
          if ((this.executionService.stepActionCondition(object)) && !object.isChecked) {
            this.stepActionValidation = true;
            break;
          }
          if ((object.dgType === DgTypes.Section || object.dgType === DgTypes.StepInfo) && object.acknowledgementReqd && !object.isChecked) {
            this.acknowledgeValidation = true;
            break;
          }
          if (this.hasAnyAlertMessages(object)) { break; }
        }
      }
    }
  }
  // return the step action hold status( check whether step is in hold or not)
  isStepInHold(obj: any) { return obj.options.hold; }
  // return the step action inprogress status( check whether step is inprogress or not)
  isStepInProgress(obj: any) { return obj.options.inProgress; }

  // get the children step actions which are not completed
  getChildrenSteps(obj: any) {
    return obj.children.filter((item: any) => this.executionService.stepActionCondition(item) && !item.isChecked);
  }
  // check whether entered value is valid email address
  validateEmail(email: any) {
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  storeDataJsonObject(obj: any, action: any) {
    let dataInfo: DataInfo = new DataInfo();
    dataInfo.statusBy = this.executionService.selectedUserName;
    dataInfo.createdDate = new Date();
    dataInfo.createdBy = this.executionService.selectedUserName;
    dataInfo.statusDate = new Date();
    // dataInfo.dgUniqueID = (++this.cbpService.cbpZip.dataJson.lastSessionUniqueId).toString();
    dataInfo.action = action
    let dataInfoObj = { ...dataInfo, ...this.setUserInfoObj(dataInfo.action), ...obj };
    return dataInfoObj;
    // this.storeDataJsonObj(dataInfoObj);
  }
  dgTypeExists(arr: any, value: any) { return arr.some((el: any) => el.dgType === value); }
  timedChildren(obj: any) {
    obj['timedChild'] = true;
    obj.children.forEach((item: any) => {
      if (item.dgType === DgTypes.StepAction || item.dgType === DgTypes.StepInfo) { item['timedChild'] = true; }
    });
    return obj;
  }
  getDeviceInfo() {
    if (this.deviceInfo && this.deviceInfo?.isMobile()) { return 'Mobile'; }
    if (this.deviceInfo && this.deviceInfo?.isTablet()) { return 'Tablet'; }
    if (this.deviceInfo && this.deviceInfo?.isDesktop()) { return 'Desktop'; }
    return 'UnKnown';
  }
  setStepActionValue(type: any) {
    let actionId: any;
    switch (type) {
      case this.stepTypes.InProgressStep:
        actionId = 1000;
        break;
      case this.stepTypes.CompletedStep:
        actionId = 2000;
        break;
      case this.stepTypes.SkipStep:
        actionId = 3000;
        break;
      case this.stepTypes.HoldStep:
        actionId = 5000;
        break;
      case this.stepTypes.NotApplicableStep:
        actionId = 9999;
        break;
      case 'DynamicSection':
        actionId = 9200;
        break;
      case 'RowUpdated':
        actionId = 9300;
        break;
      default:
        break;
    }
    return actionId;
  }
  // return the alert message move to form execution
  getSwitchMessage() {
    let mesg: any;
    switch (true) {
      case this.stepActionValidation:
        mesg = AlertMessages.previousStepMessage;
        break;
      case this.stepFieldValidation:
        mesg = AlertMessages.allDataRequiredMesage;
        break;
      case this.alertsValidation || this.isAlertMessage:
        mesg = AlertMessages.allAlertMessage;
        break;
      case this.childStepValidation:
        mesg = AlertMessages.childAlertMessage;
        break;
      case this.childHoldValidation:
        mesg = AlertMessages.holdMessage;
        break;
      case this.acknowledgeValidation:
        mesg = AlertMessages.acknowlegeMessage;
        break;
      case this.whileRuleCondition:
        mesg = this.whileRuleMessage;
        break;
      case this.depedencyValidation:
        mesg = AlertMessages.dependencyMessage + this.dependencyArray.toString();
        break;
      default:
        mesg = undefined;
        break;
    }
    return mesg;
  }
  // set gps info
  gpsInfo() {
    if (this.longtitude !== 'No data found') { return this.latitude + ',' + this.longtitude; }
    return 'No Data Found';
  }
  setUserInfoObj(action: any) {
    const userInfo: UserInfo = new UserInfo(new Date().getTime(), action, this.executionService.selectedUserId, new Date(), this.getDeviceInfo(), this.gpsInfo(), '', this.executionService.selectedUserName);
    return userInfo;
  }

  isStepOptionsValid(type: any) {
    if (type === this.stepTypes.NotApplicableStep || type === this.stepTypes.HoldStep
      || type === this.stepTypes.SkipStep || type === this.stepTypes.InProgressStep) {
      return true;
    }
    return false;
  }
  // disable the step which is already selected
  // (means: step action is inprogress, so again we shouldn't let the user to select inprogress)
  setDisable(object: any, type: any) {
    try {
      if (object['options']) {
        if (type === this.stepTypes.InProgressStep) {
          return object['options']['inProgress'] ? true : false;
        }
        if (type === this.stepTypes.HoldStep) {
          return object['options']['hold'] ? true : false;
        }
        if (type === this.stepTypes.SkipStep) {
          return object['options']['skip'] ? true : false;
        }
        if (type === this.stepTypes.NotApplicableStep) {
          return object['options']['notApplicable'] ? true : false;
        }
        if (type === this.stepTypes.CompleteStep) {
          return object['options']['complete'] ? true : false;
        }
      }
      return;
    } catch (error) { console.error(error); }
  }
  // set the step actions options and apply the color to the tree nodes
  setDropDownValues(object: any, inProgress: any, notApplicable: any, hold: any, complete: any, skip: any) {
    object['options'] = new StepOption();
    object['options']['inProgress'] = inProgress;
    object['options']['notApplicable'] = notApplicable;
    object['options']['hold'] = hold;
    object['options']['complete'] = complete;
    object['options']['skip'] = skip;
    if (hold) { this.applyColorToNode(object, 'yellow'); }
    if (skip) { this.applyColorToNode(object, 'silver'); }
    if (inProgress) { object.isTapped = 1; this.applyColorToNode(object, 'lightblue'); }
    if (notApplicable) { object.isTapped = 0; this.applyColorToNode(object, undefined); }
    if (complete) { this.applyColorToNode(object, undefined); }
    return object;
  }
  applyColorToNode(obj: any, color: any) {
    const objValue = $('#' + obj.dgUniqueID + ' > div');
    if (color) { objValue.css('background', color); } else { objValue.removeAttr('style'); }
  }

  hideStepInTree(item: any) {
    try {
      if ($('#' + item)) {
        $('#' + item + ' > div').css('display', 'none');
        $('#' + item + ' > i').css('display', 'none');
        $('#' + item + ' > a').css('display', 'none');
        item.added = true;
      }
    } catch (err) { }
    return item;
  }
  // swap the elements in array with index postions, indexA position will reflect to indexB in array
  swapElements(inputArray: any, index_A: any, index_B: any) {
    let temp = inputArray[index_A];
    inputArray[index_A] = inputArray[index_B];
    inputArray[index_B] = temp;
    return inputArray;
  }
  // set step with default values in formview component
  setUserAndDateInfo(obj: any) {
    obj['isChecked'] = true;
    obj['createdBy'] = this.executionService.selectedUserName;
    obj['createdDate'] = new Date();
    obj['statusDate'] = new Date();
    return obj;
  }

  // duplicate obejcts remove
  removeDuplicates(originalArray: any, prop: any) {
    const newArray = [];
    const lookupObject: any = {};
    for (var i in originalArray) { lookupObject[originalArray[i][prop]] = originalArray[i]; }
    for (i in lookupObject) { newArray.push(lookupObject[i]); }
    return newArray;
  }

  isContinuousStepValid(stepObject: any, parentObj: any, stepSequentialArray: any) {
    if (this.hasAnyAlertMessages(stepObject)) { return false; }
    const startIndex = stepSequentialArray.findIndex((el: any) => el.dgUniqueID === parentObj.dgUniqueID);
    const endIndex = stepSequentialArray.findIndex((el: any) => el.dgUniqueID === stepObject.dgUniqueID);
    let isStepValid = true;
    for (let i = startIndex; i < endIndex; i++) {
      if (this.executionService.stepActionCondition(stepSequentialArray[i])) {
        if (stepSequentialArray[i].isChecked) {
          isStepValid = true;
          this.stepActionValidation = false;
        } else {
          this.stepActionValidation = true;
          isStepValid = false; break;
        }
      }
    }
    return isStepValid;
  }
  isContinuousWithIndependentStepsValid(stepObject: any, parentObj: any) {
    const endIndex = parentObj.children.findIndex((el: any) => el.dgUniqueID === stepObject.dgUniqueID);
    let isStepValid = true;
    for (let i = 0; i < endIndex; i++) {
      if (this.executionService.stepActionCondition(parentObj.children[i])) {
        if (parentObj.children[i].isChecked) {
          isStepValid = true;
          this.stepActionValidation = false;
        } else {
          this.stepActionValidation = true;
          isStepValid = false; break;
        }
      }
      if (this.hasAnyAlertMessages(parentObj.children[i])) {
        isStepValid = false; break;
      }
    }
    return isStepValid;
  }

  getSelectedStepObj(uniqueID: any, stepSequentialArray: any) {
    const parentIndex = stepSequentialArray.findIndex((el: any) => el.dgUniqueID === uniqueID);
    return stepSequentialArray[parentIndex];
  }
  hasConfigureDependencyCompleted(obj: any, stepSequentialArray: any) {
    if (obj.configureDependency.length > 0) {
      let isStepsValid = true;
      for (let i = 0; i < obj.configureDependency.length; i++) {
        const stepObj = this.getSelectedStepObj(obj.configureDependency[i].dgUniqueId, stepSequentialArray);
        const getChildrenSteps = stepObj.children.filter((item: any) => this.executionService.stepActionCondition(item) && !item.isChecked);
        isStepsValid = getChildrenSteps.length > 0 ? false : true;
        if (!isStepsValid) { this.depedencyValidation = true; break; }
      }
      if (!isStepsValid) { this.dependencyArray = obj.configureDependency.map((s: any) => s.number); }
      return isStepsValid;
    }
    return true;
  }
  storeMediaUpload(uploadMedia: any, mediaType: any, stepNo: any, uniqueId: any) {
    let user = this.executionService.selectedUserName;
    let dataInfo: any = new DataInfoModel('figures', user, new Date(), user, new Date(), '', DgTypes.Figures, 'data-' + new Date().getTime(), stepNo);
    for (let i = 0; i < uploadMedia.length; i++) {
      uploadMedia[i] = { ...uploadMedia[i], ...this.setUserInfoObj(ActionId.AddMedia) };
      uploadMedia[i].TxnId = uploadMedia[i].TxnId + i;
      uploadMedia[i].dgType = DgTypes.Figure;
    }
    dataInfo['images'] = uploadMedia;
    dataInfo['mediaType'] = mediaType;
    dataInfo['state'] = { 'hidden': true };
    let dataInfoObj = { ...dataInfo, ...this.setUserInfoObj(ActionId.AddMedia) };
    return dataInfoObj
  }

  setRoleQuals(object: any, lock: boolean, require: boolean) {
    if (this.hasSecurity(object)) {
      object['showLockIcon'] = lock;
      object['stepRoleQualRequired'] = require;
      object = this.setRoleMessage(object);
    }
    return object;
  }
  setRoleMessage(object: any) {
    let roles = '';
    let qualification = '';
    let group = '';
    if (object?.Security) {
      object['showLockMessage'] = '';
      if (object?.Security?.Role?.length > 0) {
        object?.Security?.Role.forEach((element: any) => {
          roles = roles + ',' + element.role;
        });
      }
      if (object?.Security?.Qualification?.length > 0) {
        object?.Security?.Qualification.forEach((element: any) => {
          qualification = qualification + ',' + element.role;
        });
      }
      if (object?.Security?.QualificationGroup?.length > 0) {
        object?.Security?.QualificationGroup.forEach((element: any) => {
          group = group + ',' + element.role;
        });
      }
      if (group !== '' || qualification != '' || roles != '') {
        let rolesNew = roles ? 'Role: ' + roles?.substring(1) : '';
        let qualificationNew = qualification ? 'Qualification: ' + qualification?.substring(1) : '';
        let groupNew = group ? 'Qualification Group: ' + group?.substring(1) : '';
        let lockMessage = `Section/Step requires:
${rolesNew}
${qualificationNew}
${groupNew}`;
        object['showLockMessage'] = lockMessage?.replace(/^\s*[\r\n]/gm, '');
      }
    }
    return object;
  }
  setSectionValues(object: any, type: any) {
    object['orderChanged'] = type;
    return object;
  }

  setEditTextValues(object: any, infoObj: any) {
    object['oldText'] = infoObj.oldText;
    object['newText'] = infoObj.newText;
    object['text'] = object.number + ' ' + this.executionService.removeHTMLTags(object['newText'])
    object.isEdited = true;
    return object;
  }
  stepActionInitialize(object: any) {
    if (object.dgType === DgTypes.Timed) { object['stepTimerStart'] = false; }
    if (object.dgType === DgTypes.DelayStep) { object['showTimeInRed'] = false; }
    object['isTapped'] = 0;
    object = this.setStepActionStatus(object, [], false);
    return object;
  }
  commentCrintialize(object: any) {
    object['isCommentAvailable'] = false;
    object['isCRAvailable'] = false;
    object['isEdited'] = false;
    return object;
  }

  setMessageValues(object: any, valueObj: any) {
    object.isChecked = valueObj && valueObj?.length > 0 ? (valueObj[valueObj.length - 1]?.status === 'completed' ? true : false) : false;
    object['createdDate'] = valueObj && valueObj.length > 0 ? valueObj[valueObj.length - 1].createdDate : new Date();
    object['createdBy'] = valueObj && valueObj.length > 0 ? valueObj[valueObj.length - 1].createdBy : '';
    if (!object?.options) { object['options'] = new StepOption(); }
    object['options'].complete = object.isChecked;
    object['isTapped'] = object?.isChecked ? 2 : 0;

    if (valueObj && valueObj?.length > 0) {
      if (valueObj[valueObj.length - 1]['status'] === 'Not Applicable') {
        object['options'] = new StepOption();
        object['options'].notApplicable = true;
        object['isChecked'] = true;
      }
    }
    return object;
  }

  setStepActionStatus(object: any, data: any, type: any) {
    object.isChecked = type;
    object.statusDate = data.statusDate ? data.statusDate : new Date();
    object['createdBy'] = data.createdBy ? data.createdBy : '';
    if (type) {
      object['showLockIcon'] = false;
      object['stepRoleQualRequired'] = false;
    }
    return object;
  }

  setDefaultSignature(object: any, valueObj: any) {
    if (valueObj?.length !== 0) {
      object['signatureValue'] = valueObj.length > 0 ? valueObj[valueObj.length - 1].signatureValue : '';
      object['signatureName'] = valueObj.length > 0 ? valueObj[valueObj.length - 1].signatureName : '';
      object['signatureDate'] = valueObj.length > 0 ? valueObj[valueObj.length - 1].signatureDate : '';
      object['initial'] = valueObj.length > 0 ? valueObj[valueObj.length - 1].initial : '';
      object['signatureUserId'] = valueObj.length > 0 ? valueObj[valueObj.length - 1].signatureUserId : '';;
      object['signatureNotes'] = valueObj.length > 0 ? valueObj[valueObj.length - 1].signatureNotes : '';;
      object['authenticator'] = valueObj.length > 0 ? valueObj[valueObj.length - 1].authenticator : '';;

    } else {
      object['signatureValue'] = '';
      object['signatureName'] = '';
      object['signatureDate'] = '';
      object['initial'] = '';
      object['signatureUserId'] = '';
      object['signatureNotes'] = '';
      object['authenticator'] = '';
    }
    return object;
  }
  setDefaultInitial(object: any, valueObj: any) {
    if (valueObj.length === 0) {
      object['initialStore'] = '';
      object['initialName'] = '';
      object['authenticator'] = '';
      object['initialNotes'] = '';
    } else {
      object['initialStore'] = valueObj.length > 0 ? valueObj[valueObj.length - 1].initialStore : '';
      object['initialName'] = valueObj.length > 0 ? valueObj[valueObj.length - 1].initialName : '';
      object['authenticator'] = valueObj.length > 0 ? valueObj[valueObj.length - 1].authenticator : '';
      object['initialNotes'] = valueObj.length > 0 ? valueObj[valueObj.length - 1]?.initialNotes : '';
    }
    return object;
  }
  setDefaultCheckbox(object: any, valueObj: any) {
    if (valueObj.length === 0) {
      object['storeValue'] = '';
    } else {
      object['storeValue'] = valueObj.length > 0 ? this.convertStringToBoolean(valueObj[valueObj.length - 1].value) : '';
    }
    return object;
  }
  convertStringToBoolean(value: any) {
    value = value?.toString();
    if (!value) {
      return false;
    }
    return value.toLowerCase() == 'true';
  }
  getBase64(file: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(file);
  }

  clearStyleKeys(data: any) {
    delete data['setIndentaion'];
    delete data['setAlignIndentaion'];
    delete data['setSpaceIndentaion'];
    delete data['styleObj'];
    if (data.dgType === DgTypes.Section && data.dataType === 'Attachment') {
      delete data['styleObjAttach'];
      delete data['styleObjAttachTitle'];
    }
    delete data['setLayoutindentation'];
    delete data['iconStyle'];
    delete data['isCheckDgSequence'];
    return data;
  }

  containsDuplicates(arr: any) {
    var result: any = [];
    for (var i = 1; i < arr.length; i++) {
      if (arr[i].by !== arr[i - 1].by && !result.includes(arr[i].by)) {
        result.push(arr[i].by);
      }
    }
    return result.length > 0 ? true : false;
  }

  setStyles(styleValue: any) {
    return {
      'font-family': styleValue.fontName ? styleValue.fontName : '',
      'font-weight': styleValue.fontWeight ? styleValue.fontWeight : '500',
      'font-size': styleValue.fontSize ? styleValue.fontSize : '12px',
      'line-height': styleValue.lineHeight ? styleValue.lineHeight : 'unset',
      'font-style': styleValue.fontStyle ? styleValue.fontStyle : 'unset',
      'color': styleValue.color ? styleValue.color : '#555',
      'background-color': styleValue.backgroundColor ? styleValue.backgroundColor : 'transparent',
      'text-align': styleValue.textAlign ? styleValue.textAlign : 'unset',
      'text-decoration': styleValue.textDecoration ? styleValue.textDecoration : 'unset'
    };
  }

  capitalize(s: string) {
    s = s.toLowerCase();
    return s === "" ? 'Normal' : s[0].toUpperCase() + s.slice(1);
  }


  storeAttributeObj(stepObject: any, value: any) {
    let obj = new SaveObject(stepObject.dgType, value, stepObject.oldValue, stepObject.dgUniqueID);
    let attrObj: any = {}
    attrObj['attributeType'] = stepObject.attributeType
    attrObj['coverPageAttribute'] = true;
    attrObj['property'] = stepObject.property;
    attrObj[attrObj['property']] = stepObject[stepObject['property']];
    let dataInfo: DataInfo = new DataInfo();
    dataInfo.statusBy = this.executionService.selectedUserName;
    dataInfo.createdDate = new Date();
    dataInfo.createdBy = this.executionService.selectedUserName;
    dataInfo.statusDate = new Date();
    dataInfo.action = ActionId.Update;
    let dataInfoObj: any = { ...dataInfo, ...attrObj, ...this.setUserInfoObj(dataInfo.action), ...obj };
    if (stepObject?.styleSet) {
      dataInfoObj['styleSet'] = stepObject?.styleSet;
    }

    return dataInfoObj;
  }


  storeDataObj(stepObject: any, value: any) {
    let obj = new SaveObject(stepObject.dgType, value, stepObject.oldValue, stepObject.dgUniqueID);
    let dataInfo: DataInfo = new DataInfo();
    dataInfo.statusBy = this.executionService.selectedUserName;
    dataInfo.createdDate = new Date();
    dataInfo.createdBy = this.executionService.selectedUserName;
    dataInfo.statusDate = new Date();
    dataInfo.action = obj.oldValue === '' || obj.oldValue === undefined ? ActionId.DataEntry : ActionId.Update;
    let dataInfoObj: any = { ...dataInfo, ...this.setUserInfoObj(dataInfo.action), ...obj };
    if (stepObject['protect'] === true) {
      dataInfoObj['protect'] = true;
    }
    if (stepObject.dgType === DgTypes.TextAreaDataEntry && stepObject?.height) {
      dataInfoObj['height'] = stepObject?.height;
    }
    if (stepObject?.protect) {
      dataInfoObj['approveList'] = stepObject['approveList']?.length > 0 ? stepObject['approveList'] : [];
      dataInfoObj['protect'] = stepObject.protect;
      dataInfoObj['comments'] = stepObject?.comments;
      dataInfoObj['isCommentUpdated'] = stepObject?.isCommentUpdated;
      dataInfoObj['protectColor'] = stepObject?.protectColor;
    }
    if (stepObject?.styleSet) {
      dataInfoObj['styleSet'] = stepObject?.styleSet;
    }
    if (stepObject?.isParentRepeatStep) {
      dataInfoObj['isParentRepeatStep'] = stepObject?.isParentRepeatStep;
    }
    return dataInfoObj;
  }
  setStyleValue(valueObj: any, defaultValue: any) {
    return valueObj && valueObj?.length > 0 && valueObj[valueObj.length - 1]?.styleSet ? valueObj[valueObj.length - 1]?.styleSet : defaultValue;
  }

  setBackgroundTrans(styleObject: any) {
    if (styleObject['background-color'] === '#fff' || styleObject['background-color'] === '#ffffff') {
      styleObject['background-color'] = 'transparent';
    }
    return styleObject;
  }
  setBackgroundTransOrWhite(styleObject: any, reverse: boolean) {
    if (!reverse) {
      if (styleObject['background-color'] === '#fff' || styleObject['background-color'] === '#ffffff') {
        styleObject['background-color'] = 'transparent';
      }
    }
    if (reverse) {
      if (styleObject['background-color'] === 'transparent') {
        styleObject['background-color'] = '#ffffff';
      }
    }
    return styleObject;
  }
  getDateValue(date: string) {
    if (!date) { date = 'mm/dd/yyyy'; }
    let find = this.dateFormats.find(item => item.date === date);
    if (!find) { find = this.dateFormats.find(item => item.value === date); }
    return find?.value;
  }
  getPlaceHolder(res: any) {
    let find = this.dateFormats.find(item => item.date === res);
    if (!find) { find = this.dateFormats.find(item => item.value === res); }
    return find?.date;
  }
  getDateInfo(date: any) {
    return {
      day: date.getDate(),
      month: date.getMonth(),
      monthName: date.toLocaleString('default', { month: 'short' }),
      year: date.getFullYear(),
      hours: date.getHours(),
      minutes: date.getMinutes(),
      ampm: date.getHours() >= 12 ? 'Pm' : 'Am'
    }
  }

  dataURItoBlob(dataURI: any) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    var bb = new Blob([ab], { type: mimeString });
    return bb;
  }
  setFormatStyle(stepObject: any) {
    if (this.executionService.formatPainterEnable) {
      stepObject['styleSet'] = (this.executionService.selectedNewEntry?.['styleSet']) ? this.executionService.selectedNewEntry?.['styleSet'] : {};
      if (stepObject?.storeValue) {
        stepObject.storeValue = this.executionService.removeHTMLTags(stepObject.storeValue);
        stepObject['innerHtmlView'] = true;
      }
      if (stepObject['styleSet']) {
        if (stepObject['styleSet']['fontsize']) {
          stepObject['defaultFontSize'] = stepObject['styleSet']['fontsize'];
        }
        if (stepObject['styleSet']['fontfamily']) {
          stepObject['defaultFontName'] = stepObject['styleSet']['fontfamily'];
        }
        if (stepObject['styleSet']['fontcolor']) {
          stepObject['color'] = stepObject['styleSet']['fontcolor'];
        }
        if (stepObject?.storeValue && stepObject.dgType !== DgTypes.DateDataEntry) {
          let colorhtml = ''; let closeColor = '';
          let familyhtml = ''; let closeFamily = '';
          let sizehtml = ''; let closeSize = '';
          if (stepObject['styleSet']['fontcolor']) {
            colorhtml = `<font color="${stepObject['styleSet']['fontcolor']}">`; closeColor = '</font>';
          }
          if (stepObject['styleSet']['fontfamily']) {
            familyhtml = `<font face="${stepObject['styleSet']['fontfamily']}">`; closeFamily = '</font>';
          }
          if (stepObject['styleSet']['fontsize']) {
            sizehtml = `<font size="${stepObject['styleSet']['fontsize']}">`; closeSize = '</font>';
          }
          stepObject.storeValue = `${colorhtml}${familyhtml}${sizehtml}${stepObject.storeValue}${closeSize}${closeFamily}${closeColor}`;
        }
      }
    }
    return stepObject;
  }
  removeDuplicateJson(dataObjects: any) {
    let uniqueDataJsonArray: any = [];
    if (dataObjects?.length > 0) {


      dataObjects = dataObjects.sort((a: any, b: any) => (a.TxnId - b.TxnId));
      dataObjects.forEach((i: any, index: number) => {
        if (!i.dgUniqueID) {
          i.dgUniqueID = new Date().getTime() + '_' + index;
        }
      });
      dataObjects.forEach((item: any) => {
        if (item.dgType === 'RowUpdated' || item.dgType === 'RowDeleted') {
          uniqueDataJsonArray.push(item)
        } else {
          if (item.dgType == DgTypes.CheckboxDataEntry) {
            if (typeof item.value == 'string') {
              item.valuee = item.value == "true" ? true : false;
            }
          }
          const index = uniqueDataJsonArray.findIndex((i: any) => i.dgUniqueID == item.dgUniqueID);
          if (index == -1) {
            uniqueDataJsonArray.push(item)
          } else {
            uniqueDataJsonArray[index] = item;
          }
        }
      });
    }
    //  return uniqueDataJsonArray;
    //uniqueDataJsonArray  = uniqueDataJsonArray.sort((a:any,b:any) => a.TxnId - b.TxnId);

    return this.removeDuplicateObjectsByTxnID(uniqueDataJsonArray);
  }
  removeDuplicateObjectsByTxnID(dataObjects: any) {
    const uniqueDataJsonArray: any = [];
    dataObjects.forEach((item: any) => {
      if (item.dgType === 'RowUpdated' || item.dgType === 'RowDeleted') {
        // uniqueDataJsonArray.push(item)
        const index = uniqueDataJsonArray.findIndex((i: any) => {
          if (i.TxnId == item.TxnId && i.dgUniqueID == item.dgUniqueID) {
            if (i.tableInfo?.rowDgUniqueID) {
              if (i.tableInfo?.rowDgUniqueID == item.tableInfo?.rowDgUniqueID) {
                return true;
              }
            } else {
              return true;
            }
          }
          return false;
        });

        if (index == -1) {
          uniqueDataJsonArray.push(item)
        } else {
          uniqueDataJsonArray[index] = item;
        }
      } else {
        const index = uniqueDataJsonArray.findIndex((i: any) =>
          (i.TxnId == item.TxnId && i.dgUniqueID == item.dgUniqueID) && (i.dgType != 'RowUpdated' && i.dgType != 'RowDeleted'));
        if (index == -1) {
          uniqueDataJsonArray.push(item)
        } else {
          uniqueDataJsonArray[index] = item;
        }
      }

    });
    return uniqueDataJsonArray;
  }
  getReplaceText(list: any, text: string) {
    let replace = '';
    for (let i = list.length - 1; i > 0; i--) {
      replace = `<span id="${list[i].id}">` + replace;
    }
    replace = replace + text;
    for (let i = 0; i < list.length; i++) {
      replace = replace + `</span>`;
    }
    return replace;
  }

  checkRoles(securityObj: any, type = false, userSecurity: any) {
    let hasDocRoles = false;
    let hasDocQualificaiton = false;
    let hasDocQualGroup = false;
    try {

      for (let i = 0; i < userSecurity.role.length; i++) {
        for (let j = 0; j < securityObj['Security'].Role.length; j++) {
          let roles = userSecurity.role.filter((item: any) => item.code == securityObj['Security'].Role[j].code)
          hasDocRoles = roles.length > 0 ? true : false;
          if (hasDocRoles) break;
        }
        if (hasDocRoles) break;
      }
      for (let i = 0; i < userSecurity.qualification.length; i++) {
        for (let j = 0; j < securityObj['Security'].Qualification.length; j++) {
          let qualification = userSecurity.qualification.filter((item: any) => item.code == securityObj['Security'].Qualification[j].code)
          hasDocQualificaiton = qualification.length > 0 ? true : false;
          if (hasDocQualificaiton) break;
        }
        if (hasDocQualificaiton) break;
      }
      for (let i = 0; i < userSecurity.qualificationGroup.length; i++) {
        for (let j = 0; j < securityObj['Security'].QualificationGroup.length; j++) {
          let qualifications = userSecurity.qualificationGroup.filter((item: any) => item.code == securityObj['Security'].QualificationGroup[j].code)
          hasDocQualGroup = qualifications.length > 0 ? true : false;
          if (hasDocQualGroup) break;
        }
        if (hasDocQualGroup) break;
      }
      if (hasDocRoles || hasDocQualificaiton || hasDocQualGroup) {
        return true;
      } else {
        return false;
      }
    } catch (err) { }

  }
  hasSecurity(obj: any) {
    return obj['Security']?.Qualification?.length > 0 ||
      obj['Security']?.QualificationGroup?.length > 0 ||
      obj['Security']?.Role?.length > 0;
  }
  getType(type: string) {
    let value = '';
    if (type === DgTypes.Section || type === DgTypes.StepInfo) {
      value = 'title';
    } else if (type === DgTypes.StepAction) {
      value = 'action';
    }
    return value;
  }
  checkInludes(main: string, text: string) {
    main = main.replace(/\s/g, '');
    text = text.replace(/\s/g, '');
    return main === text ? true : false;
  }
  spaceCheck(main: string, text: string) {
    main = main.split(" ").join("");
    text = text.split(" ").join("");
    return main === text ? true : false;
  }
  getQuerySelectorAll(text: any) {
    let e = document.querySelectorAll(text);
    if (e == null) {
      e = document.querySelectorAll(text);
    }
    if (e == null) {
      e = document.querySelectorAll(text);
    }
    if (e == null) {
      e = document.querySelectorAll(text);
    }
    return e;
  }
  getElement(findobj: any) {
    let e: any;
    if (e == null || e == '') {
      e = document.getElementById(findobj.id);
    }
    if (e == null || e == '') {
      e = document.getElementById(findobj.id);
    }
    if (e == null || e == '') {
      e = document.getElementById(findobj.id);
    }
    return e;
  }
  getStepID(obj: any, type: string) {
    let stepId = `#stepAno${obj.dgUniqueID}`
    if (type === 'cause') {
      stepId = `#stepAnoCause${obj.dgUniqueID}`
    }
    if (type === 'effect') {
      stepId = `#stepAnoEffect${obj.dgUniqueID}`
    }
    if (obj?.isEdited) {
      let text = type === 'oldText' ? 'Old' : 'New';
      stepId = `#step${text}${obj.dgUniqueID}`;
    }
    if (obj.dgType === DgTypes.SignatureDataEntry) {
      stepId = `#step${type}${obj.dgUniqueID}`
    }
    let step: any = document.querySelector(stepId);
    return step;
  }
  clearSelection() {
    if (window.getSelection && window) {
      if (window.getSelection()?.empty) {  // Chrome
        window.getSelection()?.empty();
      } else if (window?.getSelection()?.removeAllRanges) {  // Firefox
        if (window?.getSelection()) {
          window.getSelection()?.removeAllRanges();
        }
      }
    }
    // else if (document['selection']) {  // IE?
    //   document['selection']?.empty();
    // }
    if (window?.getSelection) {
      if (window.getSelection()?.empty) {  // Chrome
        window.getSelection()?.empty();
      } else if (window?.getSelection()?.removeAllRanges) {  // Firefox
        window?.getSelection()?.removeAllRanges();
      }
    }
    // else if (document['selection']) {  // IE?
    //   document['selection']?.empty();
    // }
  }

  createHTMLFragment(html: string): DocumentFragment {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content.cloneNode(true) as DocumentFragment;
  }
  validateMinMax(valueItem: any, stepObject: any) {
    const value = Number(valueItem);
    const type = stepObject.minimum && stepObject.maximum ? 'all' : (
      stepObject.minimum !== '' && stepObject.maximum === '' ? 'lessthan' : 'greater');
    const lessthan = value < stepObject.minimum;
    const greater = value > stepObject.maximum;
    if (type === 'all' && value !== undefined && (greater || lessthan)) {
      return false
    } else if (type === 'greater' && value !== undefined && greater) {
      return false
    } else if (type === 'lessthan' && value !== undefined && lessthan) {
      return false
    }
    return true;
  }

  getStyles(text: string, item: any) {
    text = text?.toString();
    if (text?.includes('color=')) {
      let colorText = text.split('color=');
      for (let i = 0; i < colorText.length; i++) {
        if (colorText[i] !== '') {
          let colorString = colorText[i].replace(/['"]+/g, '');
          let color = colorString.substring(0, 7);
          item.color = color.includes('#') ? color : '';
          if (item.color !== '')
            this.storeColors.push(item.color);
        }
      }
    }
    if (text?.includes('size=')) {
      let colorText = text.split('size=');
      for (let i = 0; i < colorText.length; i++) {
        if (colorText[i] !== '') {
          let colorString = colorText[i].replace(/['"]+/g, '');
          item.size = colorString.substring(0, 1);
        }
      }
    }
    if (text?.includes('face=')) {
      let colorText = text.split('face=');
      for (let i = 0; i < colorText.length; i++) {
        if (colorText[i] !== '') {
          let colorString = colorText[i].replace(/['"]+/g, '');
          item.family = colorString.substring(0, 4);
        }
      }
    }
    if (text?.includes('textalign:')) {
      let colorText = text.split('textalign:');
      for (let i = 0; i < colorText.length; i++) {
        if (colorText[i] !== '') {
          let colorString = colorText[i].replace(/['"]+/g, '');
          let value = colorString.substring(0, 4);
          if ('center'.includes(value)) { item.align = 'center'; }
          if ('left'.includes(value)) { item.align = 'left'; }
          if ('right'.includes(value)) { item.align = 'right'; }
        }
      }
    }
    return item;
  }
  getFontFamily(type: string, list: any) {
    let family = '';
    for (let i = 0; i < list.length; i++) {
      if (list[i].includes(type)) { family = list[i]; break; }
    }
    return family;
  }
  checkInt(id: any, txid: any) {
    if (typeof id !== 'number') {
      id = Number(id);
    }
    if (typeof id !== 'number') {
      txid = Number(txid);
    }
    return id > txid;
  }
  getSizeStyles(font: any) {
    let fontObj: any;
    switch (font) {
      case '10px':
        fontObj = 1;
        break;
      case '12px':
        fontObj = 2;
        break;
      case '16px':
        fontObj = 3;
        break;
      case '18px':
        fontObj = 4;
        break;
      case '24px':
        fontObj = 5;
        break;
      case '30px':
        fontObj = 6;
        break;
      case '38px':
        fontObj = 7;
        break;
      case '60px':
        fontObj = 8;
        break;
      case '80px':
        fontObj = 9;
        break;
      default: break;
    }
    return fontObj;
  }
}
