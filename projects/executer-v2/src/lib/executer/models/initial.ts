import { DgTypes } from "cbp-shared";
export class Initial{
    initialName!: string;
    initialStore!: string;
    name!: string;
    initial!: string;
    dgUniqueID!: string;
    dgType = DgTypes.InitialDataEntry;
    createdDate: any;
    statusDate: any;
    locationInfo!: string;
    constructor(initialName:string, initialStore:string, name:string, initial:string, dgUniqueID:string){
       this.initialName = initialName;
       this.initialStore = initialStore;
       this.name = name;
       this.initial = initial;
       this.dgUniqueID = dgUniqueID;
       this.createdDate = new Date();
       this.statusDate = new Date();
    }
}
