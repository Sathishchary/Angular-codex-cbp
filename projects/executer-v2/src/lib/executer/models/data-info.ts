import { UserInfo } from "./user-info";
export class DataInfo extends UserInfo{
    status!: string;
    statusBy!: string;
    createdDate: any;
    createdBy!: string;
    statusDate: any;
    locationInfo!: string;
    dgType = '';
    dgUniqueID!: string;
    oldValue:any;
    selectedStepDgUniqueId!:any;
}

export class DataInfoModel extends UserInfo{
    status!: string;
    statusBy!: string;
    createdDate: any;
    createdBy!: string;
    statusDate: any;
    locationInfo!: string;
    dgType = '';
    dgUniqueID!: string;
    selectedStepDgUniqueId!:any;
    constructor(status:string, statusBy:string,createdDate:any, createdBy:string, statusDate:any, locationInfo:string, dgType:string, dgUniqueID:any, selectedStepDgUniqueId:any){
        super();
        this.status = status;
        this.statusBy = statusBy;
        this.createdDate = createdDate;
        this.createdBy = createdBy;
        this.statusDate = statusDate;
        this.locationInfo = locationInfo;
        this.dgType = dgType;
        this.dgUniqueID = dgUniqueID;
        this.selectedStepDgUniqueId = selectedStepDgUniqueId;
    }
}
