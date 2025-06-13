export class ExecuteObj{
  statusDate = new Date();
  createdDate = new Date();
  createdBy: any;
  status: any;
  constructor(createdBy:any, status:any){
    this.createdBy = createdBy;
    this.status = status;
  }
}

