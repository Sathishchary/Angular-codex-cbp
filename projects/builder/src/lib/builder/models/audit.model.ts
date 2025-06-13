import { Actions } from "./actions";
import { AuditTypes } from "./audit-types";

export class Audit {
    CreatedBy!: string;
    CreatedID!: string;
    UpdatedBy!: string;
    UpdatedID!: string;
    CreatedDate!: Date;
    UpdatedDate!: Date;
    DgUniqueID!: number;
    TransID!: number;
    Index?: number;
    PropName?: string;
    OldText?: string;
    NewText?: string;
    Details?: string;
    ParentID?: string;
    ActionCause?: string;
    Action!: Actions;
    AuditType!: AuditTypes;
    ColumnIndex? : number;
    RowIndex? : number;
    headerTab?: boolean;
    dualStep?: boolean;
    stepParentDgUniqID!:number;
    number?:string;
    level?:number;
    originalSequenceType:any;
    childSequenceType:any;
    internalRevision:any;
}
