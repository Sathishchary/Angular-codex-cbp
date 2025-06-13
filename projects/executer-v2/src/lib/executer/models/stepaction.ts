import { UserInfo } from "./user-info";

export class StepAction extends UserInfo{
    status!: string;
    statusBy!: string;
    createdDate: any;
    createdBy!: string;
    statusDate: any;
    locationInfo!: string;
    dgType = 'StepAction';
    dgUniqueID!: string;
    action:any;

    constructor(status:string, statusBy:string, createdDate:any, createdBy:any, statusDate:any, locationInfo:string, dgType:string, dgUniqueID:string, action:string){
        super();
        this.status = status;
        this.statusBy = statusBy;
        this.createdDate = createdDate;
        this.createdBy = createdBy;
        this.statusDate = statusDate;
        this.locationInfo = locationInfo;
        this.dgType = dgType;
        this.dgUniqueID = dgUniqueID;
        this.action = action;
    }

}
