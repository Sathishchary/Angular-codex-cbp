export class DynamicSec{
    dynamic_section! :any;
    dgUniqueID!: any;
    hide_section!: any;
    dynamic_number!: string;
    dgSequenceNumber!: string;
    title! : string;
    number! :string;
    index!: number
    constructor(obj:any, i:number){
      this.dynamic_section = obj.dynamic_section;
      this.dgUniqueID = obj.dgUniqueID;
      this.hide_section = obj.hide_section;
      this.dynamic_number = obj.dynamic_number;
      this.dgSequenceNumber = obj.dgSequenceNumber;
      this.title = obj.title ? obj.title : obj.action;
      this.number = obj.number;
      this.index = i;
    }
  }
