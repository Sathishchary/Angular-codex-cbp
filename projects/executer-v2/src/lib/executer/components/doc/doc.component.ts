import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CoverPageFrom, DgTypes, ImagePath, PropertyDocument } from 'cbp-shared';
import { CbpExeService } from '../../services/cbpexe.service';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';
const templatesJson = require('src/assets/cbp/json/templates.json');


@Component({
  selector: 'app-exe-doc',
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocExeComponent {
  @Input() propertyDocument: any = new PropertyDocument();
  ImagePath: typeof ImagePath = ImagePath;
  @Input() cbpJson: any;
  showNew: boolean = true;
  showOld: boolean = true;

  constructor(public cbpService: CbpExeService, public executionService: ExecutionService,
    public sharedviewService: SharedviewService
  ) {
  }

  ngOnInit() {
    if (!this.propertyDocument['templateId']) {
      this.propertyDocument['templateId'] = '1';
    }
    if (this.propertyDocument?.newCoverPageeEnabled) {
      if (!this.propertyDocument['coverPageData']) {
        let coverPage = templatesJson['template-cp'] ?? new CoverPageFrom();
        this.setCoverPageItem(coverPage);
      }
    }
  }
  setCoverPageItem(obj: any) {
    this.propertyDocument['coverPageData'] = obj;
    this.propertyDocument['coverPageData']['coverPageTable'] = true;
    this.propertyDocument['isTableAttributes'] = true;
    this.propertyDocument['propertyFieldAdd'] = true;
    this.cbpJson.documentInfo[0] = this.propertyDocument;
  }

  dataEntryJsonEvent(dataInfos: any) {
    if (dataInfos?.stepObj?.dgType != DgTypes.SignatureDataEntry && dataInfos?.stepObj?.dgType != DgTypes.InitialDataEntry) {
      if ('createdDate' in dataInfos && dataInfos.hasOwnProperty('createdDate') && dataInfos.createdDate) {
        this.cbpService.dataJson.dataObjects.push(dataInfos);
      }
      else {
        let obj = this.sharedviewService.storeDataObj(dataInfos.stepObj, dataInfos.stepObj.storeValue);
        this.cbpService.dataJson.dataObjects.push(obj);
      }
    }
  }

}