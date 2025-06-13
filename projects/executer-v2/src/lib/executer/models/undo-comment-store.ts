import { DgTypes } from "cbp-shared";

export class UndoCommentStore {
    dgType = DgTypes.UndoComment;
    value = '';
    comment!: string;
    createdDate = new Date();
    createdBy: any;
    constructor(value:string, comment:string, createdDate:any, createdBy:any){
        this.dgType = DgTypes.UndoComment;
        this.value = value;
        this.comment = comment;
        this.createdDate = createdDate;
        this.createdBy = createdBy;
    }
}
