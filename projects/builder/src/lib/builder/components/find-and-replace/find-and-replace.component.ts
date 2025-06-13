import { Component, OnInit, Input, SimpleChanges, OnDestroy, AfterViewInit, OnChanges, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CbpService } from '../../services/cbp.service';
import { ControlService } from '../../services/control.service';
import { BuilderUtil } from '../../util/builder-util';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-find-and-replace',
  templateUrl: './find-and-replace.component.html',
  styleUrls: ['./find-and-replace.component.css'] 
})
export class FindAndReplaceComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input()
  searchString = '';
  replaceString = '';
  searchObj: any = {
    totalOccurance: 0,
    currentElement: 0,
    currentIndex: 0,
    currentIndexInCrrentElement: 0,
    searchResult: [],
    searchString: ''
  };

  hideReplaceTemplate = true;

  @Output()
  selectedNode: EventEmitter<any> = new EventEmitter();

  @Output()
  closeEvent: EventEmitter<any> = new EventEmitter();

  @Output()
  selectedAllNode: EventEmitter<any> = new EventEmitter();

  @Output()
  triggerReplaceAll: EventEmitter<any> = new EventEmitter();
  searchSub$!: Subscription;
  constructor(public cbpService: CbpService, public _buildUtil: BuilderUtil,
    private cdr: ChangeDetectorRef, public controlService: ControlService, public notifier: NotifierService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.searchSub$ = this.cbpService.searchNavigate_reso.subscribe((result: any) => {
      if (result) {
        this.searchObj = this.cbpService.searchObj;
      }
    })
  }

  search() {
    this.searchObj = {
      totalOccurance: 0,
      currentElement: 0,
      currentIndex: 0,
      currentActivePosition: 0,
      searchResult: [],
      searchString: this.searchString
    };
    this.cbpService.searchObj = this.searchObj;
    this.cbpService.searchString = this.searchString;
    this.searchObj.searchResult = this._buildUtil.search(this.searchString.toLowerCase(), this.cbpService.cbpJson);
    this.searchObj.searchResult.forEach((element: any) => {
      this.searchObj.totalOccurance += element.indexes.length;
    });
    if (this.searchObj.totalOccurance > 0) {
      this.setCurrentActivePosition();
    }
    this.cbpService.searchTemplate = true;
    this.cbpService.isViewUpdated = true;
    this.controlService.detectAllView(true);
  }

  findNext() {
    if (this.searchObj.currentElement < this.searchObj.searchResult.length) {
      if (this.searchObj.currentIndex < (this.searchObj.searchResult[this.searchObj.currentElement].indexes.length - 1)) {
        ++this.searchObj.currentIndex;
      } else {
        if (this.searchObj.currentElement < this.searchObj.searchResult.length - 1) {
          ++this.searchObj.currentElement;
          this.searchObj.currentIndex = 0;
        }
      }
    }
    this.setCurrentActivePosition(true);
    this.cbpService.isViewUpdated = true;
    this.controlService.detectAllView(true);
  }
  findPrev() {
    if (this.searchObj.currentElement > 0) {
      if (this.searchObj.currentIndex > 0) {
        --this.searchObj.currentIndex;
      } else {
        --this.searchObj.currentElement;
        this.searchObj.currentIndex = this.searchObj.searchResult[this.searchObj.currentElement].indexes.length - 1;
      }
    } else {
      if (this.searchObj.currentIndex > 0) { --this.searchObj.currentIndex; }
    }
    this.setCurrentActivePosition(true);
    this.cbpService.isViewUpdated = true;
    this.controlService.detectAllView(true);
  }

  setCurrentActivePosition(isNavigate = false) {
    this.searchObj.currentActivePosition = 0;
    for (let i = 0; i <= this.searchObj.currentElement; i++) {
      if (i != this.searchObj.currentElement) {
        for (let j = 0; j < this.searchObj.searchResult[i].indexes.length; j++) {
          ++this.searchObj.currentActivePosition;
        }
      } else {
        for (let j = 0; j <= this.searchObj.currentIndex; j++) {
          ++this.searchObj.currentActivePosition;
        }
      }
    }
    if (isNavigate) {
      this.cbpService.setSearchObj(this.searchObj)
    } else {
      this.cbpService.searchObj = this.searchObj;
    }
    this.selectedNode.emit(this.searchObj.searchResult[this.searchObj.currentElement].dgUniqueID);
  }
  replace() {
    if (this.searchString.toLowerCase() == this.cbpService.replaceString.toLowerCase()) {
      this.notifier.hideAll();
      this.notifier.notify('warning', 'Search and replece text should not be identical');
      return;
    }
    try {
      let element = this._buildUtil.getElementByDgUniqueID(this.cbpService.searchObj.searchResult[this.cbpService.searchObj.currentElement].dgUniqueID, this.cbpService.cbpJson.section);
      if (element) {
    //  //this.selectedNode.emit(element.dgUniqueID);
    //  // this.controlService.detectAllView(true);      
         this.cbpService.replaceState = true;
         this.cbpService.replaceSearch.next(true);
    //     this.cbpService.triggerReplace = !this.cbpService.triggerReplace;
    //     //this.cbpService.isViewUpdated = true;
      
    //     // setTimeout(() => { this.search(); }, 1);
      }
    } catch (error) {
      console.log(error)
    }

  }

  // async replaceCurrentActive() {
  //   if (!this.cbpService.replaceState) {
  //     return;
  //   }
  //   if (this.cbpService.searchObj.searchResult.length > 0) {
  //     if (
  //       this.cbpService.searchObj.searchResult[
  //         this.cbpService.searchObj.currentElement
  //       ].dgUniqueID == this.fieldSnapChat.dgUniqueID
  //     ) {
  //       // this.selectElement();
  //       if (
  //         this.cbpService.searchObj.searchResult[
  //           this.cbpService.searchObj.currentElement
  //         ].dgType === DgTypes.Warning ||
  //         this.cbpService.searchObj.searchResult[
  //           this.cbpService.searchObj.currentElement
  //         ].dgType === DgTypes.Caution
  //       ) {
  //         if (
  //           this.propName !=
  //           this.cbpService.searchObj.searchResult[
  //             this.cbpService.searchObj.currentElement
  //           ].propName
  //         ) {
  //           return;
  //         }
  //       }
  //       this.indexes.forEach((element) => {
  //         if (element.index == this.cbpService.searchObj.currentIndex) {
  //           let str = '';
  //           for (let index = element.start; index < element.end; index++) {
  //             str = str + '^';
  //           }
  //           this.text =
  //             this.text.substring(0, element.start) +
  //             str +
  //             this.text.substring(element.end);
  //         }
  //       });
  //       // this.indexes.forEach(element => {

  //       // })
  //       for (let index = 0; index < this.indexes.length; index++) {
  //         if (
  //           this.indexes[index].index == this.cbpService.searchObj.currentIndex
  //         ) {
  //           this.text =
  //             this.text.substring(0, this.indexes[index].start) +
  //             this.cbpService.replaceString +
  //             this.text.substring(this.indexes[index].end);
  //           break;
  //         }
  //       }
  //       // this.cbpService.searchObj.searchResult.forEach((element:any,index:any) => {
  //       //   if (index == this.cbpService.searchObj.currentElement) {
  //       //   element.indexes= element.indexes.filter((ele:any)=> ele!==this.cbpService.searchObj.currentIndex);
  //       //   }
  //       // });
  //       this.postProcessReplace();
  //     }
  //   }
  // }
  // postProcessReplace() {
  //   this.text = this.text.replace(/\^/g, '');
  //   this.cdr.detectChanges();
  //   let textWithoutHtml = this.text
  //     .replace(/<em class="search-bg-blue">/g, '')
  //     .replace(/<em class="search-bg-show">/g, '')
  //     .replace(/<\/em>/g, '');
  //   let fieldSnapChat = JSON.parse(JSON.stringify(this.fieldSnapChat));
  //   this._buildUtil.updateReplace(this.field, textWithoutHtml, this.propName);
  //   this._buildUtil.updateReplace(
  //     this.fieldSnapChat,
  //     textWithoutHtml,
  //     this.propName
  //   );
  //   this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;

  //   this.auditService.createReplaceAudit(
  //     fieldSnapChat,
  //     this.fieldSnapChat,
  //     this.propName
  //   );
  //   if (
  //     this.cbpService.searchObj.totalOccurance > 0 &&
  //     !this.cbpService.replaceString.includes(this.cbpService.searchString)
  //   ) {
  //     --this.cbpService.searchObj.totalOccurance;
  //     this.cbpService.searchObj.currentActivePosition > 1
  //       ? --this.cbpService.searchObj.currentActivePosition
  //       : NONE_TYPE;
  //     this.cbpService.searchObj.searchResult[
  //       this.cbpService.searchObj.currentElement
  //     ].indexes = this._buildUtil.findAllOccurences(
  //       this.searchString,
  //       this.text,
  //       false
  //     ); //search method
  //     if (
  //       this.cbpService.searchObj.searchResult[
  //         this.cbpService.searchObj.currentElement
  //       ].indexes.length == 0
  //     ) {
  //       if (
  //         this.cbpService.searchObj.currentElement <=
  //         this.cbpService.searchObj.searchResult.length - 1
  //       ) {
  //         ++this.cbpService.searchObj.currentElement;
  //         this.cbpService.searchObj.currentIndex = 0;
  //       } else {
  //         --this.cbpService.searchObj.currentElement;
  //         this.cbpService.searchObj.currentIndex =
  //           this.cbpService.searchObj.searchResult[
  //             this.cbpService.searchObj.currentElement
  //           ].indexes.length - 1;
  //       }
  //     } else if (
  //       this.cbpService.searchObj.currentIndex >=
  //       this.cbpService.searchObj.searchResult[
  //         this.cbpService.searchObj.currentElement
  //       ].indexes.length
  //     ) {
  //       if (
  //         this.cbpService.searchObj.currentElement <
  //         this.cbpService.searchObj.searchResult.length - 1
  //       ) {
  //         ++this.cbpService.searchObj.currentElement;
  //         this.cbpService.searchObj.currentIndex = 0;
  //       } else if (
  //         this.cbpService.searchObj.currentElement >=
  //         this.cbpService.searchObj.searchResult.length - 1
  //       ) {
  //         if (this.cbpService.searchObj.currentIndex > 0)
  //           --this.cbpService.searchObj.currentIndex;
  //       }
  //     }
  //     if (this.cbpService.searchObj.currentIndex < 0) {
  //       this.cbpService.searchObj.currentIndex = 0;
  //     }
  //     if (this.cbpService.searchObj.currentElement < 0) {
  //       this.cbpService.searchObj.currentElement = 0;
  //     }
  //     this.cbpService.replaceState = false;
  //   }

  //   this.getSearchTags(true);
  //    this.cbpService.searchNavigate.next(this.cbpService.searchObj.searchResult[this.cbpService.searchObj.currentElement].dgUniqueID);
  //    this.cbpService.isViewUpdated = true;
   
  //   this.cdr.detectChanges();
  // }
  replaceAll() {
    if (this.searchString.toLowerCase() == this.cbpService.replaceString.toLowerCase()) {
      this.notifier.hideAll();
      this.notifier.notify('warning', 'Search and replece text should not be identical');
      return;
    }
    //this.cbpService.searchReplace.next('REPLACE_ALL');
    this.cbpService.replaceState = true;
    this.triggerReplaceAll.emit(this.searchObj);
    // this.cbpService.triggerReplaceAll = !this.cbpService.triggerReplaceAll;
    this.cbpService.isViewUpdated = true;
    this.controlService.detectAllView(true);
    this.searchString = '';
    this.cbpService.replaceString = '';
  }

  ngOnChanges(changes: SimpleChanges) {
    // tslint:disable-next-line: forin
    for (const propName in changes) {
      if (propName === 'refreshTreeNav' && !changes.refreshTreeNav.firstChange) {
        this.cbpService.isViewUpdated = true;
        this.cdr.detectChanges();
      }
    }
  }
  close() {
    this.closeEvent.emit();
  }

  ngOnDestroy(): void {
    this.searchString = '';
    this.cbpService.searchTemplate = false;
    this.cbpService.searchString = null;
    this.cbpService.replaceString = '';
    this.cbpService.replaceState = false;
    this.cbpService.setSearchObj({
      totalOccurance: 0,
      currentElement: 0,
      currentIndex: 0,
      currentActivePosition: 0,
      searchResult: []
    })
    this.searchSub$?.unsubscribe();
  }
}
