export class StickyNote{
  dgType:string = 'StickyNote';
  selectedStepDgUniqueId:any = 0;
  isAdded : boolean = false;
  show : boolean =  false;
  messageArray:Message[] = [new Message()];
  showColor: boolean = false;
  bgColor:string = '#FFE66E';
  deleted = false;
}

export class Message {
  message:string =  '';
  userName:string =  '';
  currentDate:any = '';
  messageAdded:boolean = false;
}
