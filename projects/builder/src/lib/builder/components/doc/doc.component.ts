import {
  ChangeDetectorRef, Component,
  EventEmitter,
  Input, OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { CoverPageFrom, DgTypes, ImagePath, PropertyDocument } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { AuditService } from '../../services/audit.service';
import { BuilderService } from '../../services/builder.service';
import { CbpService } from '../../services/cbp.service';
import { ControlService } from '../../services/control.service';
import { StylesService } from '../../shared/services/styles.service';
import { TableService } from '../../shared/services/table.service';
import { BuilderUtil } from '../../util/builder-util';
const templatesJson = require('src/assets/cbp/json/templates.json');

@Component({
  selector: 'app-doc',
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.scss']
})
export class DocComponent implements OnInit, OnChanges, OnDestroy {
  @Input() propertyDocument: any = new PropertyDocument();
  @Input() section: any;
  DgTypes: typeof DgTypes = DgTypes;
  ImagePath: typeof ImagePath = ImagePath;
  options!: any;
  dashboard: any;
  @Input() cbpJson: any;
  @Input() coverpageData: any;
  dataAdded: any;
  default = "col-xs-12 col-md-12 col-lg-12";
  setItemSubscription!: Subscription;
  CoverPageView!: boolean;;

  @Input() windowWidth: any;
  @Input() editorType: any;
  @Output() selectField: EventEmitter<any> = new EventEmitter<any>();

  constructor(public cbpService: CbpService, public stylesService: StylesService,
    public builderService: BuilderService, public cdr: ChangeDetectorRef, public _buildUtil: BuilderUtil,
    public auditService: AuditService,
    public tableService: TableService, public controlService: ControlService) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.propertyDocument && this.propertyDocument) {
      this.propertyDocument = changes.propertyDocument.currentValue;
      const obj = this.propertyDocument['coverPageData'];
      if (obj)
        this.tableService.attributesDisable(obj, obj?.['listAttributeProperty']);
    }
    if (changes.editorType && this.editorType) {
      this.editorType = changes.editorType.currentValue;
    }
  }

  ngOnInit() {
    if (!this.cbpService.showviewCoverPage) {
      this.viewCoverPage();
    }

    if (this.propertyDocument?.newCoverPageeEnabled) {
      if (!this.propertyDocument['coverPageData']) {
        let coverPage = templatesJson['template-cp'] ?? new CoverPageFrom();
        this.setCoverPageItem(coverPage);
        this.setCoverpage();
      }
    }
    if (this.cbpJson.section.length > 1 && !this.propertyDocument['coverPageData']) {
      this.tableService.showOld = true;
      this.tableService.showNew = false;
      this.propertyDocument['templateId'] = this.propertyDocument['templateId'] ?? '1'
      if (this.propertyDocument === undefined) {
        this.propertyDocument = new PropertyDocument();
        if (!this.propertyDocument['templateId']) { this.propertyDocument['templateId'] = '1'; }
      }
    } else {
      if (this.propertyDocument?.newCoverPageeEnabled)
        this.setCoverpage();
      this.selectCoverPage();
      if (this.cbpService.docFileStatus == "10000") {
        this.tableService.isPropertyDisable = true
      }
    }

 //  console.log("cbpjson in doc Component :: ",this.cbpService.cbpJson)
    if(this.cbpService.coverPagedataEmpty == true){
      let object = this.cbpService.cbpJson.documentInfo[0]?.coverPageData?.listAttributeProperty
      this.cbpService.listProperties.forEach((listitem: any) => {
        if (listitem.isEditable == 1) {
          if (object?.length) {
            object.forEach((obj:any)=>{
                if (obj.property == listitem.property) {
                obj.propertyValue = listitem[listitem['property']]
                // console.log("In doc  isEditable =1 updating list  ::",  listitem['property'],obj.propertyValue)
                  this.cbpService.cbpJson.documentInfo[0][listitem['property']] = listitem[listitem['property']]
              }
            })              
          }
        }
        if(listitem.isEditable == 0 || listitem.isEditable == null){
          if (object?.length) {
              for (const obj of object) {
                if (obj.property == listitem.property) {
                  listitem[listitem['property']] = obj.propertyValue
                  this.cbpService.cbpJson.documentInfo[0][listitem['property']] = obj.propertyValue
                  // console.log("In Builder isEditable =0 ::",  listitem['property'],listitem[listitem['property']])
                }
                else {
                  if (listitem.property == 'dynamicDocument') {
                    listitem[listitem['property']] = this.cbpService.cbpJson.documentInfo[0][listitem.property]
                    //  console.log(" dynamic document ",listitem[listitem['property']])
                  }
                  else {
                    this.cbpService.cbpJson.documentInfo[0][listitem['property']] =listitem[listitem['property']]
                  }
                }
              }
            }
        }
      })
    }
    if (!this.propertyDocument?.newCoverPageeEnabled) {
      this.setItemSubscription = this.controlService.changeTempObj.subscribe((result: any) => {
        if (result.value === true && this.cbpJson.section.length > 1) {
          this.tableService.showNew = true;
          this.tableService.showOld = false;
          const num = JSON.parse(result.data);
          switch (num) {
            case 1:
              this.setCoverPageItem(templatesJson['template-cp']);
              break;
            case 2:
              this.setCoverPageItem(templatesJson['template-2']);
              break;
            case 3:
              this.setCoverPageItem(templatesJson['template-3']);
              break;
            case 4:
              this.setCoverPageItem(templatesJson['template-4']);
              break;
          }
          this.cbpService.selectedElement.withoutLines = true;
          if ((this.tableService.selectedTable === undefined || null) && this.cbpService.documentSelected) {
            this.cbpService.selectedElement = this.propertyDocument?.['coverPageData'];
            this.cbpService.selectedElement.withoutLines = true;
            this.tableService.isBorderRemove = true;
            this.tableService.isPropertyDisable = true;
          }
          this.propertyDocument['isTableCreated'] = true;
        }
      });
      this.propertyDocument['templateId'] = this.propertyDocument['templateId'] ?? '1'
      this.cdr.detectChanges();
    }
  }

  selectCoverPage() {
    if (this.cbpService.documentSelected) {
      this.tableService.selectedTable = this.propertyDocument?.['coverPageData'];
      this.controlService.setSelectItem(this.tableService.selectedTable);
      this.cbpService.isViewUpdated = true;
    }
  }
  editCoverPage() {
    this.cbpService.showviewCoverPage = true;
    this.cbpService.editCoverPage = true;
    this.cbpService.hideCoverPageButton = true
    this.cbpService.hideButtonsImg = false;
    this.cbpService.isDisabledControl = false;
    if (this.propertyDocument?.['coverPageData']) {
      this.cbpService.selectedElement = this.propertyDocument?.['coverPageData'];
      this.CoverPageView = false;
      this.controlService.setViewVal(this.CoverPageView);
      this.tableService.isBorderRemove = false;
      this.cbpService.selectedElement.withoutLines = false;
      if (this.cbpService.docFileStatus == "10000") {
        this.tableService.isPropertyDisable = true
      } else {
        this.tableService.isPropertyDisable = false;
      }
      this.tableService.viewMode = false;
      this.cbpService.isViewUpdated = true;
    }
  }
  viewCoverPage() {
    this.cbpService.tableDataEntrySelected = undefined;
    this.cbpService.showviewCoverPage = false;
    this.cbpService.editCoverPage = false;
    this.cbpService.hideButtonsImg = true;
    this.cbpService.isDisabledControl = true;
    if (this.propertyDocument?.['coverPageData']) {
      this.cbpService.selectedElement = this.propertyDocument?.['coverPageData'];
      this.CoverPageView = true;
      this.controlService.setViewVal(this.CoverPageView);
      this.tableService.viewMode = true;
      this.tableService.isBorderRemove = true;
      this.cbpService.selectedElement.withoutLines = true;
      this.tableService.isPropertyDisable = true;
      this.tableService.selectedRow.length = 0;
      this.tableService.attributesDisable(this.cbpService.cbpJson.coverPageData, this.cbpService.cbpJson.coverPageData?.['listAttributeProperty']);
      this.cbpService.isViewUpdated = true;
    }
    if (this.propertyDocument?.newCoverPageeEnabled) {
      if (!this.propertyDocument['coverPageData']) {
        this.setCoverPageItem(new CoverPageFrom());
        this.setCoverpage();
      }
    }
  }

  setCoverpage() {
    if ((this.tableService.selectedTable === undefined || null) && this.cbpService.documentSelected
      && this.cbpService.selectedElement) {
      this.tableService.selectedTable = this.propertyDocument?.['coverPageData'];
      this.cbpService.selectedElement = this.tableService.selectedTable;
      this.cbpService.selectedElement = this.propertyDocument?.['coverPageData'];
      const documentProperty = this.propertyDocument['coverPageData'];
      // console.log(documentProperty);
      this.cbpService.selectedElement.withoutLines = true;
      this.tableService.isBorderRemove = true;
    }
    this.propertyDocument['isTableCreated'] = true;
    if (!this.propertyDocument['templateId']) { this.propertyDocument['templateId'] = '1'; }
    if (this.propertyDocument === undefined) {
      this.propertyDocument = new PropertyDocument();
      if (!this.propertyDocument['templateId']) { this.propertyDocument['templateId'] = '1'; }
    }
    // console.log(this.propertyDocument);
    if (this.propertyDocument?.['coverPageData']) {
      this.tableService.attributesDisable(this.propertyDocument?.['coverPageData'], this.propertyDocument['coverPageData']['listAttributeProperty']);
    }
  }
  setCoverPageItem(obj: any) {
    this.propertyDocument['coverPageData'] = obj;
    this.propertyDocument['coverPageData']['coverPageTable'] = true;
    this.propertyDocument['isTableAttributes'] = true;
    this.propertyDocument['propertyFieldAdd'] = true;
    this.tableService.attributesDisable(this.propertyDocument?.['coverPageData'], this.propertyDocument['coverPageData']['listAttributeProperty']);
    this.cbpService.cbpJson.documentInfo[0] = this.propertyDocument;
  }
  setOldCoverPage() {

  }

  selectedFieldEvent(event: any) {
    this.selectField.emit(event);
  }

  ngOnDestroy() {
    if (this.propertyDocument['coverPageData']) {
      this.propertyDocument['coverPageData']['selectTable'] = false;
  }
    //this.propertyDocument['coverPageData']['selectTable'] = false;
  }

}
