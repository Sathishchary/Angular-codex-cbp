export class CallbackObject {
  arr: any = {};
  displayToUniqueId: any = {};
  qualificationRoles: any;
  dateFormat!: string;
  init(text: any, dgUniqueId: any) {
    this.displayToUniqueId[text] = dgUniqueId;
  }
  initStepWithDgUniqueIdRule(text: any, dgUniqueId: any) {
    this.displayToUniqueId[text] = dgUniqueId;
  }
  initExecution(dgUniqueId: any, value: any) {
    this.arr[dgUniqueId] = value;
  }
  getValue(id: any) {
    return this.arr[id];
  }

  getSectionStepID(id: any) {
    return this.displayToUniqueId[id];
  }

  getDGUniqueID(id: any) {
    return this.displayToUniqueId[id];
  }

  setValue(id: any, value: any) {
    this.arr[id] = value;
  }

  gotTo(sectionId: any) {
    console.log('Goto call from parser : ' + sectionId);
  }

}
