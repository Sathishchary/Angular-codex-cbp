import { DgTypes } from "cbp-shared";

export class AlertBase{
    number!:string;
    dgUniqueID: any;
    dgType: DgTypes;
    type:string;
    dataType:string;
    isDataEntry = false;
    constructor(number:string, id:any,dgType:DgTypes, type:any, dataType:string,isDataEntry:boolean){
        this.number = number
        this.dgUniqueID = id;
        this.dgType = dgType;
        this.type = type;
        this.dataType = dataType;
        this.isDataEntry = isDataEntry;
    }
}

export class Warning extends AlertBase {
    cause = '';
    effect = '';
    constructor(){
        super('', '',  DgTypes.Warning, 'Warning', 'warning', false);
    }
}
export class Caution extends AlertBase{
    cause = '';
    effect = '';
    constructor(){
        super('', '',  DgTypes.Caution, 'Caution', 'caution', false);
    }
}
export class Note extends AlertBase{
    note = '';
    notes: string[] = [''];
    constructor(){
        super('', '',  DgTypes.Note, 'Note', 'note', false);
    }
}
export class Alara extends AlertBase{
    note = '';
    alaraNotes: string[] = [''];
    constructor(){
        super('', '',  DgTypes.Alara, 'Alara', 'alara', false);
    }
 }  