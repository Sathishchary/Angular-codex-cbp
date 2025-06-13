import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subscription } from 'rxjs';
interface ImagesMap {
  dgUniqueid: string;
  images: any[];
}

export interface Resp_Msg {
  source?: any;
  eventType?:any;//Event Types
  msg?: any,
  msgType?: any
}

export interface Request_Msg {
 eventType?:any;//Event Types
 msg?:any;//Event msg
 eventFrom?:any //Event resource
 datajson?:any;
 opt?:any;
}
/*
This is a shared service
we can use this to transfer the data between two components with out having any relation
created on : 09-05-2020
Author: venkat koniki
*/
@Injectable({
  providedIn: 'root'
})
export class DataSharingService implements OnDestroy {
  ismodalopen!: boolean;
  // cbpSubscription: Subscription;
  constructor() {
 
  }
  ngOnDestroy(): void {
    // this.cbpSubscription.unsubscribe();
  }

  imagesMap = new Map();
  previousgroupid: any = '';

  //Image Properties Broadcaster
  imageproperties_reso = new BehaviorSubject<any>('');
  imageproperties = this.imageproperties_reso.asObservable();
  changeImageProperties(imgproperties: any) {
    this.imageproperties_reso.next(imgproperties);
  }
  imageproperties_update = new BehaviorSubject<any>('');
  imagepropertiesUpdate = this.imageproperties_update.asObservable();
  updateProperties(imgproperties: any) {
    this.imageproperties_update.next(imgproperties);
  }

  mediaObjectChange = new BehaviorSubject<any>('');
  mediaObjectUpdateChange = this.mediaObjectChange.asObservable();
  mediaObjecProperties(imgproperties: any) {
    this.mediaObjectChange.next(imgproperties);
  }

  //stepsJsonArray Broadcaster
  stepsJsonArray_reso_v1 = new BehaviorSubject<any>('');
  stepsJsonArray_v1 = this.stepsJsonArray_reso_v1.asObservable();
  changeStepsJsonArray_v1(jsonArray: any) {
    // console.log('values updated');
    this.stepsJsonArray_reso_v1.next(jsonArray);
  }


  //update File List Broadcaster

  fileList_reso = new BehaviorSubject<any>('');
  filelist = this.fileList_reso.asObservable();
  changeFilelist(updatedfilelist: any) {
    this.fileList_reso.next(updatedfilelist);
  }


  //Previous Drag Type Broadcaster
  dragtype_reso = new BehaviorSubject<any>('');
  previous_dragtype = this.dragtype_reso.asObservable();
  changeDragType(imgproperties: any) {
    this.dragtype_reso.next(imgproperties);
  }

  //stepsJsonArray Coneverted into Other format Broadcaster
  stepsJsonArray_reso_v2 = new BehaviorSubject<any>('');
  stepsJsonArray_v2 = this.stepsJsonArray_reso_v2.asObservable();
  changeStepsJsonArray_v2(jsonArray2: any) {
    this.stepsJsonArray_reso_v2.next(jsonArray2);
  }

  //New Element Changed
  newElement_Added_reso=new BehaviorSubject<boolean>(false);
  newElement_Added=this.newElement_Added_reso.asObservable();
  newElementAdded(isAdded:boolean){
    this.newElement_Added_reso.next(isAdded);
  }

   //Rising Events
   public eventMessageFromPlugin = new BehaviorSubject<any>({});
   // eventMessageFromPlugin = this.eventSource.asObservable();
   sendMessageFromLibToOutside(msg: any) {
     // console.log(msg)
     this.eventMessageFromPlugin.next(msg);
   }
 
   //Retriving Events
   public receivedMessage = new BehaviorSubject<Resp_Msg>({});
   // receivedMessage = this.retriveEventSource.asObservable();
   
   sendMessageFromOutsideToPlugin(msg: Resp_Msg) {
     this.receivedMessage.next(msg);
   }

}
