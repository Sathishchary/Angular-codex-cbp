import { AfterViewInit, ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { Dependency, PropertyDocument } from 'cbp-shared';
import { Actions, AuditTypes } from '../../../../models';
import { AuditService } from '../../../../services/audit.service';
import { BuilderService } from '../../../../services/builder.service';
import { CbpService } from '../../../../services/cbp.service';
import { ControlService } from '../../../../services/control.service';
import { TableService } from '../../../../shared/services/table.service';
import { DateEditorPopupComponent } from '../../../date-popup/date-popup.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BuilderUtil } from '../../../../util/builder-util';
const findAnd = require('find-and');
@Component({
  selector: 'app-doc-property',
  templateUrl: './doc-property.component.html',
  styleUrls: ['./doc-property.component.css',]
})
export class DocPropertyComponent implements OnInit, AfterViewInit {
  @Input() isRead = false;
  @Input() propertyDocument!: PropertyDocument;
  @Input() editorType: any;

  AuditTypes: typeof AuditTypes = AuditTypes;
  document: any;
  sectionUsages = [Dependency.Continuous, Dependency.Reference, Dependency.Information];
  dateValue1!: string;
  attribbutelist: any = [];
  attributeValueEnable = true;
  attributePropertyEnable = false;
  apiResponse: any = [];
  apidata: any;
  attribute = 0;
  itemOptionsValues: any;
  selectedValue: any;
  parentvalue = "";
  isDependencyCheck = false;
  windowWidth!: number;
  tab1Name!: string;
  tab2Name!: string;
  modalOptions: NgbModalOptions = {
    backdrop: 'static',
    backdropClass: 'customBackdrop',
    size: 'md'
  }


  constructor(public cbpService: CbpService, public auditService: AuditService, public controlService: ControlService
    , public tableService: TableService,private _buildUtil: BuilderUtil, public builderService: BuilderService,private modalService: NgbModal, private cdrf: ChangeDetectorRef) {
    this.windowWidth = window.innerWidth;
    this.setTabNames();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = window.innerWidth;
    this.setTabNames();
  }

  ngOnInit() {
    console.log("editor", this.editorType)
    this.document = this.cbpService.cbpJson.documentInfo[0];
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.document));
    // console.log(this.auditService.selectedElementSnapchat);
    if (!this.cbpService.cbpJson.documentInfo[0]?.dateFormat) {
      this.cbpService.cbpJson.documentInfo[0].dateFormat = 'm/j/Y';
    }

    this.setAtrributeValue();


    this.dateValue1 = this.cbpService.cbpJson.documentInfo[0].dateFormat;
    // this.cbpService.listAttributes.forEach((element:any)=>{

    // })


  }
  changeControl(type: any) {
    this.attribute = type;
    // if (type === 1) {
    //   this.attribute = 1
    // } else {
    //   this.attribute = 0
    // }
  }
  private setTabNames() {
    if (this.windowWidth < 1706) {
      this.tab1Name = 'Value';
      this.tab2Name = 'Property';
    } else {
      this.tab1Name = 'Attribute Value';
      this.tab2Name = 'Attribute Property';
    }
  }

  setAtrributeValue() {
    //cbpjson value 
    const object = this.cbpService.cbpJson.documentInfo[0]?.coverPageData?.listAttributeProperty;
    if (object?.length) {
      this.cbpService.listProperties.forEach((itemMain) => {
        if (this.editorType.cbpStandalone) {
          this.AttriValues(itemMain, object)
          this.setUsageContinous(itemMain, object)
        } else {
          this.edocMap(itemMain)
        }
      })
    } else {
      this.cbpService.listProperties.forEach((itemMain) => {
        if (this.editorType.cbpStandalone) {
          this.AttriValues(itemMain, {})
          this.setUsageContinous(itemMain, {})
        } else {
          this.edocMap(itemMain)
        }
      })
    }
  }

  edocMap(itemMain: any) {
    // const colsObj = this.cbpService.cbpJson.documentInfo[0].coverPageData.calstable[0].table.tgroup.tbody;
    const object = this.cbpService.cbpJson.documentInfo[0]?.coverPageData?.listAttributeProperty;
    if (itemMain.dataType == '5000') {
      if (itemMain[itemMain['property']] != null) {
        this.AttriValues(itemMain, object)
      }
    }
    else if (itemMain.dataType == '1000') {
      this.AttriValues(itemMain, object)
    }

    else if (itemMain.dataType == '4000') {
      this.AttriValues(itemMain, object)
    }
   else if (itemMain.dataType == '2000') {
      if (itemMain[itemMain['property']] == null || itemMain[itemMain['property']] == "null" || itemMain[itemMain['property']] == undefined) {
        itemMain[itemMain['property']] = ''
        this.AttriValues(itemMain, object);
      }
    }
    else if (itemMain.dataType == '3000') {
      if (itemMain[itemMain['property']] == null || itemMain[itemMain['property']] == "null" || itemMain[itemMain['property']] == undefined) {
        itemMain[itemMain['property']] = ''
        this.AttriValues(itemMain, object);
      }
    }
  }

  // dropdown 1st option select
  setUsageContinous(item: any, object: any) {
    if (item.property === 'Usage' || item.property === 'DateFormat') {
      this.getDropDown(item, "")
      if (this.itemOptionsValues) {
        item.options.DISPLAY = item.options[0].DISPLAY
        item[item['property']] = item.options[0].DISPLAY
      }
    }
  }


  //for rightside mapping 
 AttriValues(item: any, object: any) {
  const docInfo = this.cbpService.cbpJson.documentInfo?.[0];
  const colsObj = docInfo?.coverPageData?.calstable?.[0]?.table?.tgroup?.tbody;
  const itemProp = item?.property;
  if (!itemProp) return;
  // Try to find a matching object based on property
  const match = Array.isArray(object) ? object?.find((obj: any) => obj?.property === itemProp) : null;

  // Handle based on dataType
  switch (item.dataType) {
    case 5000: // Dropdown
      if (match) {
        this.getDropDown(item, match.propertyValue);
        if (this.itemOptionsValues) {
          item.options = this.itemOptionsValues;
          item.options.DISPLAY = item[itemProp];
          if (item.isEditable === 0 || item.isEditable == null) {
            item.options.DISPLAY = match.propertyValue;
            item[itemProp] = match.propertyValue;
          }
          if (item.isEditable === 1) {
            // for issued documents to display the values in edoc
            item[itemProp] = docInfo?.[itemProp];
          }
        }
      }
      break;
    case 1000: // Text field or standard value
      if (match) {
        //for standalone cbp
        if (item.isEditable === 0 || item.isEditable == null) {
          item[itemProp] = match.propertyValue;
          //for old cover pages to update the values in docInfo
          docInfo[itemProp] = match.propertyValue;
        } else if (item.isEditable === 1) {
          //for issued documents to display the values in edoc
          item[itemProp] = docInfo?.[itemProp];
        }
      }
      break;
    case 4000: // Dynamic document
      if (itemProp === 'dynamicDocument') {
        item[itemProp] = docInfo?.[itemProp];
      }
      if (match && (item.isEditable === 0 || item.isEditable == null)) {
        item[itemProp] = match.propertyValue;
      }
      break;
    case 2000:
      if (item.isEditable === 0 || item.isEditable == null) {
        if (item[itemProp] == 'null') {
          item[itemProp] = '';
        }
        if (match) {
          item[itemProp] = match.propertyValue;
        }
      } else if (item.isEditable === 1) {
        //for issued documents to display the values in edoc
        item[itemProp] = docInfo?.[itemProp];
      }
      this.tableMap(colsObj, item);
      break;
    case 3000:
      if (item.isEditable === 0 || item.isEditable == null) {
        if (item[itemProp] == 'null') {
          item[itemProp] = '';
        }
        if (match) {
          item[itemProp] = match.propertyValue;
        }
      } else if (item.isEditable === 1) {
        //for issued documents to display the values in edoc
        item[itemProp] = docInfo?.[itemProp];
      }
      this.tableMap(colsObj, item);
      break;
  }
  // Fallback when property doesn't match or object is empty
  if (!match || !Array.isArray(object) || !object.length) {
      // console.log("In doc-prop editable =1  else condition:: ",item['property'],item[item['property']])
    item[itemProp] = docInfo?.[itemProp];
  }
  // Ensure the value is not undefined
  if (item[itemProp] === undefined) {
    item[itemProp] = '';
  }
  // Update in table and attributes
  this.tableMap(colsObj, item);
  this.tableService.setRightAttributes(item, item[itemProp]);
}




 tableMap(colsObj: any, item: any) {
    if(!Array.isArray(colsObj)) return;
     let element = findAnd.returnFound(colsObj, { property: item?.property });
    if (element) {
      const itemProp = item.property;
      const itemValue = item[itemProp];
      if (item?.isEditable === 1) {
        element[itemProp] = itemValue;
      } else {
        item[itemProp] = element[itemProp];
      }
    }}



  setValues(item: any, value: any) {
    if (value == undefined) {
      value = ''
    }
    const listValue = this.cbpService.cbpJson.documentInfo[0].coverPageData['listAttributeProperty'];
    //to set the values to doc Info 
    this.cbpService.cbpJson.documentInfo[0][item['property']] = value
    this.cbpService.listProperties.forEach((itemValue, i) => {
      if (listValue) {
        const indexAtt = listValue.findIndex((itemV: any) => itemV.property == item.property)
        if (indexAtt != -1) {
          if (item.attributeName == itemValue.pakgAttr) {
            const indexValue = listValue.findIndex((itemV: any) => itemV.property == itemValue.property)
            if (indexValue != -1) {
              this.cbpService.listProperties.forEach((childItem: any) => {
                if (childItem.property == listValue[indexValue].property) {
                  childItem[childItem['property']] = ''
                  childItem.options = []
                  this.setValues(childItem, '')
                  this.isDependencyCheck = true
                }
              })
              this.cdrf.detectChanges();
              this.cbpService.isViewUpdated = true;
            }
          }
        }
      }
    })
    const colsObj = this.cbpService.cbpJson.documentInfo[0].coverPageData.calstable[0].table.tgroup.tbody;
    this.tableValueUpdate(colsObj, item, value)
  }

  tableValueUpdate(colsObj: any, item: any, value: any) {

    // const element = findAnd.returnFound(colsObj, { property: item.property });
    for (let j = 0; j < colsObj.length; j++) {
      if (colsObj[j]) {
        const tableObj = colsObj[j].row;
         if (!Array.isArray(tableObj)) continue;
        for (let k = 0; k < tableObj.length; k++) {
          if (tableObj[k]) {
            const entryObj = tableObj[k].entry;
             if (!Array.isArray(entryObj)) continue;
            for (let l = 0; l < entryObj.length; l++) {
              if (entryObj[l]) {
                let object = entryObj[l].children
                   if (!Array.isArray(object)) continue;
                if (object.length) {
                  for (let m = 0; m < object.length; m++) {
                    if (object[m]?.calstable) {
                      this.tableValueUpdate(object[m].calstable[0].table.tgroup.tbody, item, value)
                    }
                    else {
                      if (object[m].property === item.property) {
                        if (item.isEditable == 0 || item.isEditable == null) {
                          object[m][object[m].property] = value;
                        }

                        this.tableService.setRightAttributes(item, value)
                      } else if (object[m].property === item.property && value == "" && this.isDependencyCheck) {
                        this.isDependencyCheck = false
                        if (item.isEditable == 0 || item.isEditable == null) {
                          object[m][object[m].property] = value;
                        }
                      }
                      else {
                        this.tableService.setRightAttributes(item, value)
                      }
                    }
                  }
                }
                else {
                  this.tableService.setRightAttributes(item, value)
                }

              }
            }
          }
        }
      }
    }
    this.cbpService.isViewUpdated = true;
  }





  getDropDown(item: any, propValue: any) {

    //for ework 
    if (item[item['property']] !== undefined || item[item['property']] !== null) {
      this.cbpService.listProperties.forEach((itemValue, i) => {
        if (itemValue.attributeName == item.pakgAttr) {
          this.parentvalue = itemValue[itemValue['property']]
        }
      })
    }


    let obj = this.cbpService.cbpJson.documentInfo[0].coverPageData?.listAttributeProperty

    if (obj?.length) {
      this.cbpService.listProperties.forEach((itemValue, i) => {
        if (itemValue.attributeName == item.pakgAttr) {
          obj.forEach((objValue: any) => {
            if (objValue.property == itemValue.property) {
              if (itemValue.attributeName == item.pakgAttr) {
                itemValue[itemValue['property']] = objValue.propertyValue
                this.parentvalue = objValue.propertyValue
              }

            }
          })
        }
      }
      )
    }


    if (item.dataType == "5000") {
      this.apidata = {
        "companyId": this.cbpService.companyId,
        "productId": 7000,
        "outputField": item.attributeName,
        "fields": [
          {
            "fieldName": item.pakgAttr,
            "fieldValue": this.parentvalue || ""


          },
          {
            "fieldName": "companyId",
            "fieldValue": "DGLN0000000000000001"
          },
          {
            "fieldName": "productId",
            "fieldValue": 7000
          }
        ]
      }
    }
    else {
      this.apidata = {
        "companyId": this.cbpService.companyId,
        "productId": 7000,
        "outputField": item.attributeName,
        "fields": [
          {
            "fieldName": "companyId",
            "fieldValue": "DGLN0000000000000001"
          },
          {
            "fieldName": "productId",
            "fieldValue": 7000
          }
        ]
      }
    }

    // if(item.options === '' || item.options ===undefined ||item.options ===null ){
    this.builderService.getDropDownValues(this.apidata, 750).subscribe((response: any) => {
      //console.log(response);
      item['options'] = response.items;
      this.itemOptionsValues = item.options;
      item[item['property']] = propValue;
    })
  }

  //COverpage code

  setDocInfoValues(item: any, event: any) {
    this.cbpService.cbpJson.documentInfo[0][item.property] = event.target?.checked;
    if (item.property == 'dynamicDocument') {
      this.cbpService.dynamicDocumentUnChecked = !event.target?.checked;
    }
    this.tableService.setRightAttributes(item, event.target?.checked)
    let findIndex = this.cbpService.cbpJson.documentInfo[0]?.coverPageData?.listAttributeProperty.findIndex((prop: any) => prop.property === item.property);
    if (findIndex != -1) {
      this.cbpService.cbpJson.documentInfo[0].coverPageData.listAttributeProperty[findIndex].propertyValue = event.target?.checked;
    }
  }


  attributeValueShow() {
    this.attributePropertyEnable = false;
    this.attributeValueEnable = true
  }
  attributePropertyShow() {
    this.attributePropertyEnable = true;
    this.attributeValueEnable = false
  }
  updateDate() {
    this.cbpService.cbpJson.documentInfo[0].dateFormat = this.dateValue1;
  }
  ngAfterViewInit() {
    // if(this.cbpService.selectedElement?.coverPageTable){
    //   this.cbpService.selectedElement = this.cbpService.selectedElement?.coverPageData;
    // }
  }
  //AUDIT RELATED


  createAuditEntry(auditType: AuditTypes, optionalParams: any = {}) {
    this.auditService.createEntry(this.auditService.selectedElementSnapchat, this.document, Actions.Update, auditType, optionalParams);
    this.auditService.selectedElementSnapchat = JSON.parse(JSON.stringify(this.document));
    this.cbpService.isViewUpdated = true;
  }
  coverpageProperty() {
    this.tableService.attributesDisable(this.document.coverPageData, this.document.coverPageData?.['listAttributeProperty']);
    this.cbpService.isViewUpdated = true;
  }
  sectionUsage(usage: any) {
    this.cbpService.docUsage = usage;
  }
  selectedProperty() {
    console.log(this.cbpService.selectedElement);
    console.log(this.cbpService.tableDataEntrySelected);
  }
  setProperty(value: String) {
    this.cbpService.tableDataEntrySelected.prompt = value;
    console.log(value);
  }
  checkValue(item: any) {
    console.log(item['promt']);
  }

  openDate(item: any) {
    const modalRef = this.modalService.open(DateEditorPopupComponent, this.modalOptions);
    item['dataEntrySize'] = '100'
    item.dgUniqueID = this._buildUtil.getUniqueIdIndex();
    item.isDateDisplayOpen = true ;
    modalRef.componentInstance.stepObject = item;
    modalRef.componentInstance.dateFormat = this.cbpService.getDateValue(this.cbpService.cbpJson.documentInfo[0].dateFormat);
    let title = item.property == "date" ? "date" : "time stamp";
    modalRef.componentInstance.dateTitle = 'Select ' + title + ' Date';
    modalRef.componentInstance.closeEvent.subscribe((receivedEntry: any) => {
      if (receivedEntry !== false) {
      //  this.selectedElement[type] = receivedEntry;
        const docInfo = this.cbpService.cbpJson.documentInfo?.[0];
        const colsObj = docInfo?.coverPageData?.calstable?.[0]?.table?.tgroup?.tbody;
      item[item['property']] = receivedEntry ;
      this.tableValueUpdate(colsObj, item, receivedEntry)
    //  this.tableMap(colsObj, item);
       console.log("receivedEntry",receivedEntry,item )
     //   this.createAuditEntry(item, { propName: type });
        this.viewUpdateTrack()
      //  this.onFocusEvent();
      }
      modalRef.close();
    });
  }
  viewUpdateTrack() {
    this.cbpService.selectedElement = this.cbpService.setUserUpdateInfo(this.cbpService.selectedElement);
    this.controlService.hideTrackUi({ 'trackUiChange': true });
  }
}
