export class SaveObject{
    dgType: any;
    value: string;
    oldValue: string;
    dgUniqueID :any;
    fieldName:any;
    constructor(dgType:any, value:any, old:any, id:any){
        this.dgType = dgType;
        this.value = value;
        this.oldValue = old;
        this.dgUniqueID = id;
    }
}
