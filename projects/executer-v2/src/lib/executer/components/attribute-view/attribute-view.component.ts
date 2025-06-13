import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { CbpExeService } from '../../services/cbpexe.service';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';
import { DatashareService } from '../../services/datashare.service';

@Component({
  selector: 'lib-attribute-view',
  templateUrl: './attribute-view.component.html',
  styleUrls: ['./attribute-view.component.css']
})
export class AttributeViewComponent implements OnInit {

  @Input() stepObject: any;
  dgType = DgTypes;
  property: any;
  styleObject: any;
  styleModel_subscription!: Subscription;
  attributeSubscription!: Subscription;
  @Output() tableEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private cdr: ChangeDetectorRef, public executionService: ExecutionService,
    public sharedviewService: SharedviewService, public cbpService: CbpExeService,public datashareService: DatashareService
  ) { }

  ngOnInit(): void {
    // console.log("obj checkinng", this.stepObject)
    if(this.stepObject.dgUniqueID){
      let attList =  this.cbpService.dataJson.dataObjects.filter((item:any)=>item.dgUniqueID == this.stepObject.dgUniqueID)
      if(attList.length){
        attList.forEach((item:any)=>{
          if(item.dgUniqueID==this.stepObject.dgUniqueID){
          this.stepObject[this.stepObject['property']] = item.value
            }
          })
      }
    }
     
    if (!this.stepObject?.dynamic) { this.stepObject['dynamic'] = 0; }
  }
  ngAfterViewInit() {
    this.styleModel_subscription = this.executionService.styleModelobjValue.subscribe((res: any) => {
      if (res && res !== undefined && !this.executionService.isEmpty(res)) {
        let item = this.stepObject?.styleSet;
        if ((item?.fontSize == '12px' && item?.fontName == 'Poppins' && item?.color == '#000000' &&
          item?.textalign == 'left') || !item) {
          this.styleObject = this.sharedviewService.setStyles(res['levelNormal']);
          delete this.styleObject['background-color'];
        } else {
          this.styleObject = {};
        }
        this.cdr.detectChanges();
      }
    });
    this.attributeSubscription = this.executionService.attributeChangeEvent.subscribe((res: any) => {
      if (res && res !== undefined && !this.executionService.isEmpty(res)) {
        this.cdr.detectChanges();
      }
    });

  }

  coreEventMethod(obj: any, objs: any, value: any) {

  }
  selectObject() {
    this.stepObject['coverPageAttribute'] = true;
    this.executionService.selectedNewEntry = this.stepObject;
    this.executionService.selectedFieldEntry = this.stepObject;
    this.executionService.selectedField({ stepItem: this.stepObject, stepObject: this.stepObject, showMenuText: true });
    this.tableEvent.emit();
  }
  saveCoverPageDynmEntriesData(objs: any) {
    let dataArr = this.cbpService.documentInfo?.coverPageData?.listAttributeProperty;
    if (!dataArr) {
      dataArr = this.cbpService.documentInfo.coverPageData.listAttributeProperty = [];
    }
    const index = dataArr.findIndex((item: any) => item.property === objs.property);
    if (index === -1) {
      dataArr.push({ property: objs["property"], propertyValue: objs[objs["property"]] });
    } else {
      dataArr[index] = { property: objs["property"], propertyValue: objs[objs["property"]] };
    }
    this.cbpService.documentInfo[objs['property']]= objs[objs["property"]] 
    this.storeItemOfEnter(objs,objs[objs["property"]]);
  }

  storeItemOfEnter(stepObject: any, value: any) {
    stepObject.oldValue = stepObject?.oldValue ? stepObject.oldValue : '';
    if (value !== stepObject?.oldValue && !stepObject?.disableField) {
      let dataInfoObj = this.sharedviewService.storeAttributeObj(stepObject, value);
      this.cbpService.dataJsonStoreChange(dataInfoObj, stepObject);
      this.datashareService.changeCount++;
    }
  }


  ngOnDestroy() {
    this.styleModel_subscription.unsubscribe();
    this.attributeSubscription.unsubscribe();
  }
}
