import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter,
  Input,
  OnInit, Output,
  SimpleChanges
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DgTypes, ImagePath } from 'cbp-shared';
import { Subscription } from 'rxjs';
import { ActionId } from '../../models';
import { CommentInf, CrData, OtSData } from '../../models/detail-execution';
import { CbpExeService } from '../../services/cbpexe.service';
import { DataJsonService } from '../../services/datajson.service';
import { DatashareService } from '../../services/datashare.service';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';
const findAnd = require('find-and');

/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */

@Component({
  selector: 'app-detail-execution',
  templateUrl: './detail-execution.component.html',
  styleUrls: ['./detail-execution.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailExecutionComponent implements OnInit {

  commentType: any = 'All';
  changeRequestType: any = 'All';
  codeValue: any;
  ImagePath: typeof ImagePath = ImagePath;
  mediaFiles: any[] = [];
  @Output() notifyDetailFormExectution: EventEmitter<any> = new EventEmitter();
  allRadioButton = false;
  addedRadioButton = true;
  builderMediaFiles = [];
  callMedia = 0;
  refresh = true;
  CRfilteredArr: any;
  @Input() dataJson: any;
  @Input() comments: CommentInf[] = [];
  @Input() tempComments: CommentInf[] = [];
  @Input() otspData: OtSData[] = [];
  @Input() crArrayData: CrData[] = [];
  @Input() mediaAllObjects = [];
  @Input() tempCrData: any;
  @Input() codeValues: any[] = [];
  @Input() typeValues: any = [];
  sideNavVariables!: any;
  @Input() freezePage: any;
  isMobile: boolean = false;
  subscription!: Subscription;

  commentNavigation: boolean = true;
  mediaLink = false;
  crNavigation = false;
  otspView = false;


  constructor(public executionService: ExecutionService, public cbpService: CbpExeService,
    public sanitizer: DomSanitizer, private cdr: ChangeDetectorRef,
    private dataSharingService: DatashareService, public sharedviewService: SharedviewService,
    public dataWrapperService: DatashareService, private dataJsonService: DataJsonService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'crArrayData' && this.crArrayData) {
        this.crArrayData = changes.crArrayData.currentValue;
        this.cdr.detectChanges();
      }
    }
  }

  ngOnInit() {
    this.isMobile = this.dataSharingService.getMenuConfig()?.isMobile;
    this.getExecutionMediaFiles();
    this.setRadioButton('all');
    this.subscription = this.dataJsonService.detailsChangeView$.subscribe((result: any) => {
      if (result !== undefined) {
        this.sideNavVariables = result;
        this.commentNavigation = result.commentNavigation;
        this.mediaLink = result.mediaLink;
        this.crNavigation = result?.crNavigation;
        this.otspView = result.otspView;
        if (this.mediaLink) {
          this.setRadioButton('all');
        }
        this.cdr.detectChanges();
        this.sharedviewService.isViewUpdated = true;
        this.sharedviewService.detectAll = true;
        this.Pagination();
      }
    });
    this.setTypes()
    this.Pagination();
  }
  commentsPage: any[] = [];
  crArrayDataPage: any[] = [];
  Pagination() {
    this.commentsPage = this.comments.filter((item: any) => item.action == ActionId.AddComment);
    this.crArrayDataPage = this.crArrayData.filter((item: any) => item.action == ActionId.AddCR);
    this.cdr.detectChanges();
    this.sharedviewService.isViewUpdated = true;
    this.sharedviewService.detectAll = true;
  }

  getExecutionMediaFiles() {
    console.log(this.cbpService.media);

    if (this.dataJson && this.dataJson.dataObjects.length > 0) {
      let storeimages = this.dataJson.dataObjects.filter((item: any) => item.dgType === DgTypes.Figures);
      let delFig = this.dataJson.dataObjects.filter((item: any) => item.dgType === 'DeleteFigure');
      let figureItems = storeimages.filter((item: any) => item.dgType !== 'DeleteFigure');
      let captionItems = this.dataJson.dataObjects.filter((item: any) => item.dgType === 'UpdateFigure'
        && item.caption);
      figureItems.forEach((itemmedia: any) => {
        if (itemmedia.images) {
          itemmedia.images = itemmedia.images.filter((item: any) => {
            return !delFig.some((img: any) => img.fileName === item.fileName);
          });
        }

      });
      if (figureItems.length > 0) {
        figureItems.forEach((itemmedia: any) => {
          if (itemmedia.images) {
            this.cbpService.mediaExecutorObjects = [...this.cbpService.mediaExecutorObjects, ...itemmedia.images];
          }
        })
      }
      this.cbpService.mediaExecutorObjects = this.cbpService.removeDuplicates(this.cbpService.mediaExecutorObjects, 'fileName');
      captionItems.forEach((capItem: any) => {
        let image = findAnd.returnFound(this.cbpService.mediaExecutorObjects, { fileName: capItem.fileName });
        let image1 = findAnd.returnFound(this.cbpService.mediaExecutorObjects, { fileName: capItem.fileName });
        if (image) {
          image.caption = capItem.caption;
        }
        if (image1) {
          image1.caption = capItem.caption;
        }
      });
    }
    this.commentCrFiles();
  }
  setTypes() {
    if (!this.codeValues.length) {
      this.codeValues.push({
        cdValue: "1000",
        cdvalDisplay: "General Comment",
        codeDescription: "Comment Type - General",
        codeVlaueID: null
      }, {
        cdValue: "2000",
        cdvalDisplay: "As Found",
        codeVlaueID: null,
        codeDescription: "Comment Type - As Found"
      })
    }
    if (!this.typeValues.length) {
      this.typeValues.push({
        cdValue: "1000",
        cdvalDisplay: "Change Request",
        codeDescription: "CR Type - Change Request",
        codeVlaueID: null
      }, {
        cdValue: "2000",
        cdvalDisplay: "Action Request",
        codeVlaueID: null,
        codeDescription: "CR Type - Action Request"
      },
        {
          cdValue: "3000",
          cdvalDisplay: "Work Request",
          codeVlaueID: null,
          codeDescription: "CR Type - Work Request"
        });
    }
  }
  commentCrFiles() {
    if (this.comments.length > 0) {
      this.comments.forEach((comment: any) => {
        if (comment.media) {
          this.storeCrCommentMedia(comment.media);
        }
      })
    }
    if (this.crArrayData.length > 0) {
      this.crArrayData.forEach((crItem: any) => {
        if (crItem.media) {
          this.storeCrCommentMedia(crItem.media);
        }
      })
    }
    // this.cbpService.mediaExecutorObjects = this.cbpService.removeDuplicates(this.cbpService.mediaExecutorObjects, 'fileName');
    console.log(this.cbpService.mediaExecutorObjects);
  }
storeCrCommentMedia(media: any[]) {
  if (!this.cbpService.mediaExecutorObjects) {
    this.cbpService.mediaExecutorObjects = [];
  }

  for (let item of media) {
    const index = this.cbpService.mediaExecutorObjects.findIndex(obj => obj.fileName === item.fileName);
    if (index !== -1) {
      this.cbpService.mediaExecutorObjects[index] = item;
    } else {
      this.cbpService.mediaExecutorObjects.push(item);
    }
  }
}

  getSelectedObject(item: any, index: any) {
    if (!index) { index = this.crArrayData.indexOf(item); }
    this.notifyDetailFormExectution.emit({ obj: item, i: index, type: 'crObject' });
  }

  getComment(item: any, index: any) {
    if (!index) { index = this.comments.indexOf(item); }
    this.notifyDetailFormExectution.emit({ obj: item, i: index, type: 'comment' });
  }

  setImage(image: any) {
    if (image.fileName.endsWith('.wmf')) {
      return 'assets/cbp/images/loader.gif';
    } else {
      if (this.isMobile) {
        return this.dataSharingService.getMediaPath() + image.name;
      } else {
        const fileObject = this.cbpService.media.find((x: any) => x.name.includes(image.fileName));
        if (fileObject) {
          const objectURL = fileObject['file'] ? URL.createObjectURL(fileObject.file) : URL.createObjectURL(fileObject);
          const url = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          return url;
        } else {
          return 'assets/cbp/images/loader.gif';
        }
      }
    }
  }

  crTypeChange() {
    if (this.changeRequestType !== 'All') {
      this.crArrayData = this.tempCrData.filter((item: any) => (item.requestType === this.changeRequestType || item?.crType?.cdValue == this.changeRequestType));
    } else {
      this.crArrayData = JSON.parse(JSON.stringify(this.tempCrData));
    }
    this.cdr.detectChanges();

  }
  commentTypeChange() {
    if (this.commentType !== 'All') {
      this.comments = this.tempComments.filter((item: any) => (item.type === this.commentType || item.cdValue == this.commentType));
    } else {
      this.comments = JSON.parse(JSON.stringify(this.tempComments));
    }
    this.cdr.detectChanges();
  }
  getSelectedOtSpObject(item: any, index: any) {
    this.notifyDetailFormExectution.emit({ obj: item, i: index, type: 'otsp' });
  }

  setRadioButton(type: string) {
    if (type === 'all') {
      this.setValues(true, false);
      this.commentCrFiles();
      if (this.cbpService.mediaBuilderObjects.length > 0) { this.cbpService.mediaBuilderObjects.forEach((item: any) => item['fileName'] = item.name); }
      this.cbpService.mediaExecutorObjects = [...this.cbpService.mediaExecutorObjects, ...this.cbpService.mediaExecutorObjects];
      this.mediaFiles = [...this.cbpService.mediaBuilderObjects, ...this.cbpService.mediaExecutorObjects, ...this.mediaAllObjects];
      this.executionService.detailPageNumber = 1;
    } else {
      this.setValues(false, true);
      this.commentCrFiles();
      this.mediaFiles = this.mediaFiles.filter((media: any) => media?.isExecuter || media?.type === 'executor');
      this.executionService.detailPageNumber = 1;
    }
    this.mediaFiles = this.cbpService.removeDuplicates(this.mediaFiles, 'fileName');
    this.cbpService.mediaExecutorObjects = this.cbpService.removeDuplicates(this.cbpService.mediaExecutorObjects, 'fileName');
    if (this.isMobile) {
      this.cbpService.media = [...this.cbpService.mediaBuilderObjects, ...this.cbpService.mediaExecutorObjects];
    }
    this.mediaFiles = this.validateMediaFiles();
    this.cdr.detectChanges();
  }
  setValues(all: any, added: any) {
    this.allRadioButton = all;
    this.addedRadioButton = added;
  }

  validateMediaFiles() {
    let mediaFiles: any[] = [];
    for (let i = this.cbpService.media.length - 1; i >= 0; i--) {
      let item = this.cbpService.media[i];
      let find = this.mediaFiles.filter((media: any) => item.name.includes(media.fileName) &&
        this.cbpService.checkFileNameExist(media.fileName, item.name));
      if (find?.length > 0) {
        mediaFiles.push(find[0]);
      }
    }
    return mediaFiles;
  }
  pagination(event: any) {
    this.executionService.detailPageNumber = event;
    this.cdr.detectChanges();
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
