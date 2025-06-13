export class ApproveStatus{
    oldText:string;
    newText:string;
    by:string;
    personnelId:string;
    date:string;
    status:string = 'Pending';
    comment:string;
    approveUser:ApproveUser[];
    constructor(oldText:string, newText:string,by:string, personnelId:string, date:any, status:string, comment:string){
        this.oldText = oldText;
        this.newText = newText;
        this.by = by;
        this.personnelId = personnelId;
        this.date = date;
        this.status = status;
        this.comment = comment;
        this.approveUser = this.listApprove();
    }

    listApprove(){
        let obj:ApproveUser[] = [];
        for(let i = 0; i < 4; i++){
            obj.push(new ApproveUser('', '', '', '', '', '', '', ));
        }
        return obj;
    }
}

export class ApproveUser{
    action:string;
    by:string;
    personnelId:string;
    date:string;
    name:string;
    position:string;
    status:string;
    constructor(action:string, by:string, name:string, date:any, personnelId:string, position:string,  status:string){
        this.action = action;
        this.by = by;
        this.name = name;
        this.date = date;
        this.personnelId = personnelId;
        this.position = position;
        this.status = status;
    }
}

