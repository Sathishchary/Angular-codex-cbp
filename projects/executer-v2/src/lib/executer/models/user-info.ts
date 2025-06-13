export class UserInfo{
  TxnId: any;
  action: any
  by: any;
  date: any = new Date();
  device: any;
  gps: any
  location: any;
  userName:any;
  constructor(TxnId?:any, action?:any, by?:any, date?:any, device?:any, gps?:any, location?:any, userName?:any){
    this.TxnId = TxnId ? TxnId: '';
    this.action = action? action: '';
    this.by = by ? by: '';
    this.date = date? date: new Date();
    this.device = device ? device: '';
    this.gps = gps ? gps: '';
    this.location = location? location : '';
    this.userName = userName ? userName : '';
  }
}
