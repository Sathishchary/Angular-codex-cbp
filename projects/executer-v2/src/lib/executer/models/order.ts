export class Order{
  parentID: any;
  currentPosition: any;
  previousPosition: any;
  dgType!: string;
  dgUniqueID: any;
  number!: string;
  dgSequenceNumber!: string;
  previousdgType!: string;
  previousDgUniqueID: any;
  previousNumber!: string;
  previousDgSequenceNumber!: string;

  constructor(parentID: any,currentPosition: any,previousPosition: any, dgType: string,
    dgUniqueID: any,number: string, dgSequenceNumber: string, previousdgType: string, previousDgUniqueID: any,
    previousNumber: string, previousDgSequenceNumber:string){
    this.parentID = parentID;
    this.currentPosition = currentPosition;
    this.previousPosition = previousPosition;
    this.dgType = dgType;
    this.dgUniqueID = dgUniqueID;
    this.number = number;
    this.dgSequenceNumber = dgSequenceNumber;
    this.previousdgType = previousdgType;
    this.previousDgUniqueID = previousDgUniqueID;
    this.previousNumber =previousNumber;
    this.previousDgSequenceNumber = previousDgSequenceNumber;
  }
}
