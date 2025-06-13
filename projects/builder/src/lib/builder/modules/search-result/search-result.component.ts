import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { HighlightTag } from 'dg-shared';
import { Subscription } from 'rxjs';
import { Actions, AuditTypes } from '../../models';
import { AuditService } from '../../services/audit.service';
import { CbpService } from '../../services/cbp.service';
import { ControlService } from '../../services/control.service';
import { StylesService } from '../../shared/services/styles.service';
import { BuilderUtil } from '../../util/builder-util';
import { NONE_TYPE } from '@angular/compiler';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
})
export class SearchResultComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() field: any = {};
  text: any;
  @Input() propName: any = null;
  @Input() searchString = '';
  @Input()
  triggerReplace: boolean = false;
  @Input()
  triggerReplaceAll: boolean = false;
  tags: HighlightTag[] = [];
  indexes: any[] = [];
  isHTMLText = false;
  textSnapChat: any;
  fieldSnapChat: any;
  @Output()
  modelChange: EventEmitter<any> = new EventEmitter();

  searchObj: any;
  styleObject: any;
  searchNavigate_reso_subscription: Subscription = new Subscription();
  replace_reso_subscription: Subscription = new Subscription();
  refresh_reso_subscription: Subscription = new Subscription();
  dgType = DgTypes;
  constructor(
    public _buildUtil: BuilderUtil,
    public stylesService: StylesService,
    public auditService: AuditService,
    public cbpService: CbpService,
    private cdr: ChangeDetectorRef,
    public controlService: ControlService
  ) { }

  ngOnInit() {
    this.text = this._buildUtil.getSearchText(this.field, this.propName)[0]
      ? this._buildUtil.getSearchText(this.field, this.propName)[0]
      : '';
    this.textSnapChat = JSON.parse(JSON.stringify(this.text ? this.text : ''));
    this.fieldSnapChat = JSON.parse(JSON.stringify(this.field));
    this.getSearchTags();
    this.styleObject = this.stylesService.setStyles(
      this.cbpService.styleModel['levelNormal']
    );
    this.searchNavigate_reso_subscription =
      this.cbpService.searchNavigate_reso.subscribe((result: any) => {
        this.setCurrentActiveSearch();
      });
    this.refresh_reso_subscription = this.cbpService.refreshSearch.subscribe(
      (result: any) => {
        this.text = this._buildUtil.getSearchText(this.field, this.propName)[0];
        this.textSnapChat = JSON.parse(
          JSON.stringify(this.text ? this.text : '')
        );
        this.fieldSnapChat = JSON.parse(JSON.stringify(this.field));
        this.getSearchTags();
        this.styleObject = this.stylesService.setStyles(
          this.cbpService.styleModel['levelNormal']
        );
      }
    );
    this.replace_reso_subscription = this.cbpService.replaceSearch.subscribe(
      (result: any) => {
        this.replaceCurrentActive();
      }
    );
  }
  replaceSearch(result: any) {
    // if (result == 'REPLACE') {
    //   this.replaceCurrentActive();
    // }
  }
  replaceAll() {
    this.indexes.forEach((element: any) => {
      let str = '';
      for (let index = element.start; index < element.end; index++) {
        str = str + '^';
      }
      this.text =
        this.text.substring(0, element.start) +
        str +
        this.text.substring(element.end);
    });
    let position = -1;
    for (let index = 0; index < this.indexes.length; index++) {
      if (position == this.indexes[index].index) {
        continue;
      }
      this.text =
        this.text.substring(0, this.indexes[index].start) +
        this.cbpService.replaceString +
        this.text.substring(this.indexes[index].end);
      position = this.indexes[index].index;
      for (let i = index + 1; i < this.indexes.length; i++) {
        this.indexes[i].start =
          this.indexes[i].start +
          (this.cbpService.replaceString.length -
            this.cbpService.searchString.length);
        this.indexes[i].end =
          this.indexes[i].end +
          (this.cbpService.replaceString.length -
            this.cbpService.searchString.length);
      }
    }
    this.postProcessReplaceAll();
  }
  async replaceCurrentActive() {
    if (!this.cbpService.replaceState) {
      return;
    }
    if (this.cbpService.searchObj.searchResult.length > 0) {
      if (
        this.cbpService.searchObj.searchResult[
          this.cbpService.searchObj.currentElement
        ].dgUniqueID == this.fieldSnapChat.dgUniqueID
      ) {

        await this.selectElement();
        await this.getSearchTags();
        if (
          this.cbpService.searchObj.searchResult[
            this.cbpService.searchObj.currentElement
          ].dgType === DgTypes.Warning ||
          this.cbpService.searchObj.searchResult[
            this.cbpService.searchObj.currentElement
          ].dgType === DgTypes.Caution
        ) {
          if (
            this.propName !=
            this.cbpService.searchObj.searchResult[
              this.cbpService.searchObj.currentElement
            ].propName
          ) {
            return;
          }
        }
        this.indexes.forEach((element) => {
          if (element.index == this.cbpService.searchObj.currentIndex) {
            let str = '';
            for (let index = element.start; index < element.end; index++) {
              str = str + '^';
            }
            this.text =
              this.text.substring(0, element.start) +
              str +
              this.text.substring(element.end);
          }
        });
        // this.indexes.forEach(element => {

        // })
        for (let index = 0; index < this.indexes.length; index++) {
          if (
            this.indexes[index].index == this.cbpService.searchObj.currentIndex
          ) {
            this.text =
              this.text.substring(0, this.indexes[index].start) +
              this.cbpService.replaceString +
              this.text.substring(this.indexes[index].end);
            break;
          }
        }
        // this.cbpService.searchObj.searchResult.forEach((element:any,index:any) => {
        //   if (index == this.cbpService.searchObj.currentElement) {
        //   element.indexes= element.indexes.filter((ele:any)=> ele!==this.cbpService.searchObj.currentIndex);
        //   }
        // });
        this.postProcessReplace();
      }
    }
  }
  postProcessReplace() {
    this.text = this.text.replace(/\^/g, '');
    const ele = document.getElementById('dataEntry' + this.field?.dgUniqueID);
    if (ele) {
      ele.innerHTML = this.text;
    }

    this.cdr.detectChanges();
    let textWithoutHtml = this.text.replace(/<em class="search-bg-blue">/g, '').replace(/<em class="search-bg-show">/g, '').replace(/<\/em>/g, '');

    let fieldSnapChat = JSON.parse(JSON.stringify(this.fieldSnapChat));
    this._buildUtil.updateReplace(this.field, textWithoutHtml, this.propName);
    this._buildUtil.updateReplace(this.fieldSnapChat, textWithoutHtml, this.propName);
    this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;

    this.auditService.createReplaceAudit(fieldSnapChat, this.fieldSnapChat, this.propName);

if(this.cbpService.replaceState ){
    if (this.cbpService.searchObj.totalOccurance > 0 && this.cbpService.replaceString != this.cbpService.searchString) {
      --this.cbpService.searchObj.totalOccurance;

      //   this.cbpService.searchObj.currentActivePosition > 1 ? ++this.cbpService.searchObj.currentActivePosition : NONE_TYPE;
      this.cbpService.searchObj.searchResult[this.cbpService.searchObj.currentElement].indexes = this._buildUtil.findAllOccurences(this.cbpService.searchString, this.text, false); //search method
      if (this.cbpService.searchObj.searchResult[this.cbpService.searchObj.currentElement].indexes.length == 0) {
        if (this.cbpService.searchObj.currentElement < this.cbpService.searchObj.searchResult.length - 1) {
          ++this.cbpService.searchObj.currentElement;
          this.cbpService.searchObj.currentIndex = 0;
        } else {
          --this.cbpService.searchObj.currentElement;
          this.cbpService.searchObj.currentIndex =
            this.cbpService.searchObj.searchResult[
              this.cbpService.searchObj.currentElement
            ].indexes.length - 1;
        }
      } else if (this.cbpService.searchObj.currentIndex >= this.cbpService.searchObj.searchResult[this.cbpService.searchObj.currentElement].indexes.length - 1) {
        this.cbpService.searchObj.totalOccurance = 0;
        this.cbpService.searchObj.searchResult.forEach((element: any) => {
          this.cbpService.searchObj.totalOccurance += element.indexes.length;
        });
        this.cbpService.searchObj.currentActivePosition < this.cbpService.searchObj.totalOccurance ? ++this.cbpService.searchObj.currentActivePosition : this.cbpService.searchObj.currentActivePosition = 1;
        if (this.cbpService.searchObj.currentElement < this.cbpService.searchObj.searchResult.length - 1) {
          ++this.cbpService.searchObj.currentElement;
          this.cbpService.searchObj.currentIndex = 0;
        } else if (this.cbpService.searchObj.currentElement >= this.cbpService.searchObj.searchResult.length - 1) {
          // if (this.cbpService.searchObj.currentIndex > 0) {
          //     --this.cbpService.searchObj.currentIndex;
          // }
          this.cbpService.searchObj.currentElement = 0;
          this.cbpService.searchObj.currentIndex = 0;
        }
      } else if (this.cbpService.searchObj.currentIndex < this.cbpService.searchObj.searchResult[this.cbpService.searchObj.currentElement].indexes.length - 1) {
        this.cbpService.searchObj.totalOccurance = 0;
        this.cbpService.searchObj.searchResult.forEach((element: any) => {
          this.cbpService.searchObj.totalOccurance += element.indexes.length;
        });
        this.cbpService.searchObj.currentActivePosition < this.cbpService.searchObj.totalOccurance ? ++this.cbpService.searchObj.currentActivePosition : this.cbpService.searchObj.currentActivePosition = 1;
        ++this.cbpService.searchObj.currentIndex
      }
      if (this.cbpService.searchObj.currentIndex < 0) {
        this.cbpService.searchObj.currentIndex = 0;
      }
      if (this.cbpService.searchObj.currentElement < 0) {
        this.cbpService.searchObj.currentElement = 0;
      }


    }
  }
    this.getSearchTags(true);
    this.cbpService.replaceState = false;
    // this.cbpService.isViewUpdated = true;

    this.cdr.detectChanges();
    this.cbpService.searchNavigate.next(this.cbpService.searchObj.searchResult[this.cbpService.searchObj.currentElement].dgUniqueID);

  }
  postProcessReplaceAll() {
    this.text = this.text.replace(/\^/g, '');
    this.cdr.detectChanges();
    let textWithoutHtml = this.text
      .replace(/<em class="search-bg-blue">/g, '')
      .replace(/<em class="search-bg-show">/g, '')
      .replace(/<\/em>/g, '');
    let fieldSnapChat = JSON.parse(JSON.stringify(this.fieldSnapChat));
    this._buildUtil.updateReplace(this.field, textWithoutHtml, this.propName);
    this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
    this.auditService.createReplaceAudit(
      fieldSnapChat,
      this.fieldSnapChat,
      this.propName
    );
    //this.cbpService.searchObj.searchResult[this.cbpService.searchObj.currentElement].indexes = []
    this.cbpService.setSearchObj({
      totalOccurance: 0,
      currentElement: 0,
      currentIndex: 0,
      currentActivePosition: 0,
      searchResult: [],
    });
    this.getSearchTags(true);
    this.cbpService.searchNavigate.next(true);
    this.cbpService.replaceState = false;
  }
  getSearchTags(setPosition = true) {
    this.removeEmTags();
    this.isHTMLText = this._buildUtil.isHTMLText(this.text);
    this.tags = this._buildUtil.getSearchTags(
      this.text,
      this.cbpService.searchString,
      this.isHTMLText
    );
    if (this.tags.length > 0) {
      let arr = [];
      // if(this.isHTMLText) {
      let position = 0;
      while (position < this.text.length) {
        for (let index = 0; index < this.tags.length; index++) {
          if (this.tags[index].indices.start >= position) {
            arr.push(
              this.text.substring(position, this.tags[index].indices.start)
            );
            if (this.isHTMLText) {
              arr.push(
                '<em class="search-bg-blue">' +
                this.text.substring(
                  this.tags[index].indices.start,
                  this.tags[index].indices.end + 1
                ) +
                '</em>'
              );
            } else {
              arr.push(
                '<em class="search-bg-blue">' +
                this.text.substring(
                  this.tags[index].indices.start,
                  this.tags[index].indices.end
                ) +
                '</em>'
              );
            }
            if (index == this.tags.length - 1) {
              if (this.isHTMLText) {
                arr.push(
                  this.text.substring(
                    this.tags[index].indices.end + 1,
                    this.text.length
                  )
                );
              } else {
                arr.push(
                  this.text.substring(
                    this.tags[index].indices.end,
                    this.text.length
                  )
                );
              }
              position = this.text.length;
              break;
            }
            if (this.isHTMLText) {
              position = this.tags[index].indices.end + 1;
            } else {
              position = this.tags[index].indices.end;
            }
          } else {
            if (index == this.tags.length - 1) {
              position = this.text.length;
              break;
            }
            continue;
          }
        }
      }
      this.text = arr.join('');
      this.indexes = this.setNewIndexesForTags(arr, this.cbpService.searchString);
      // console.log(arr)
      if (setPosition) this.setCurrentActiveSearch();
    } else {
      this.indexes = [];
    }
  }
  setNewIndexesForTags(arr: any[], searchText: any) {
    let indexes: any[] = [];
    let position = 0;
    let length = '<em class="search-bg-blue">'.length;
    let sum = 0;
    arr.forEach((str) => {
      if (
        str.startsWith('<em class="search-bg-blue">') &&
        str.endsWith('</em>')
      ) {
        indexes.push({
          start: position + length,
          end: position + str.indexOf('</em>'),
          index: parseInt((sum / searchText.length).toString()),
        });
        sum = sum + (str.indexOf('</em>') - length);
      }
      // if(position ==0){
      //   position = position + (str.length - 1);
      // } else{
      position = position + str.length;
      //}
    });
    indexes.forEach((element) => {
      // console.log(this.text.substring(element.start, element.end))
    });
    return indexes;
  }

  setCurrentActiveSearch() {
    if (!this.cbpService.searchObj) {
      return;
    }
    this.replaceActiveTags();
    if (this.cbpService.searchObj.searchResult.length > 0) {
      if (
        this.cbpService.searchObj.searchResult[
          this.cbpService.searchObj.currentElement
        ].dgUniqueID == this.fieldSnapChat.dgUniqueID
      ) {
        this.indexes.forEach((element) => {
          if (element.index == this.cbpService.searchObj.currentIndex) {
            this.text =
              this.text.substring(0, element.start - 27) +
              '<em class="search-bg-show">' +
              this.text.substring(element.start);
          }
        });
      }
    }
  }
  replaceActiveTags() {
    this.text = this.text.replace(
      /<em class="search-bg-show">/g,
      '<em class="search-bg-blue">'
    );
  }

  selectElement() {
    this.controlService.setSelectItem(this.field);
    this.cbpService.selectedUniqueId = this.field.dgUniqueID;
    this.cbpService.selectedElement = this.field;
    this.auditService.selectedElementSnapchat = JSON.parse(
      JSON.stringify(this.field)
    );
    this.cbpService.isViewUpdated = true;
    // this.cdr.detectChanges();
    this.controlService.detectAllView(true);
  }

  onChangeEvent(event: any) {
    this.fieldSnapChat.text = event.target.textContent.replace(/[aeiou]/g, '*');
    if (!this.cbpService.replaceState) {
      if (!this.text) {
        this.text = '';
      }
      this.text = event.target.innerHTML;
      this._buildUtil.updateReplace(
        this.field,
        event.target.innerHTML,
        this.propName
      );
      this.cbpService.refreshTreeNav = !this.cbpService.refreshTreeNav;
      this.auditService.createEntry(
        this.fieldSnapChat,
        this.field,
        Actions.Update,
        AuditTypes.TEXT,
        { propName: this.propName }
      );
      this.getSearchTags(true);
    }
    this.cdr.detectChanges();
  }
  removeEmTags() {
    this.text = this.text
      .replace(/<em class="search-bg-blue">/g, '')
      .replace(/<em class="search-bg-show">/g, '')
      .replace(/<\/em>/g, '');
  }
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
  ngOnChanges(changes: SimpleChanges) {
    // tslint:disable-next-line: forin
    for (const propName in changes) {
      if (propName === 'searchString' && !changes.searchString.firstChange && this.field.dgUniqueID ==  this.cbpService.searchObj.searchResult[
        this.cbpService.searchObj.currentElement].dgUniqueID ) {
        console.log('==============')
        console.log(this.field.dgUniqueID)
        this.getSearchTags();
        console.log(this.indexes)
      }

      // if (
      //   propName === 'triggerReplace' &&
      //   !changes.triggerReplace.firstChange &&
      //   this.cbpService.replaceState
      // ) {
      //   this.replaceCurrentActive();
      // }
      if (
        propName === 'triggerReplace' &&
        !changes.triggerReplace.firstChange &&
        !this.cbpService.replaceState  && this.field.dgUniqueID ==  this.cbpService.searchObj.searchResult[
          this.cbpService.searchObj.currentElement].dgUniqueID 
      ) {
        this.setCurrentActiveSearch();
      }
      // if (propName === 'triggerReplaceAll' && !changes.triggerReplaceAll.firstChange && this.cbpService.replaceState) {
      //   setTimeout(() => {
      //   this.replaceAll();
      // }, 1);
      // }
    }
  }

  ngOnDestroy(): void {
    this.searchNavigate_reso_subscription.unsubscribe();
    this.refresh_reso_subscription
      ? this.refresh_reso_subscription.unsubscribe()
      : '';
    this.replace_reso_subscription
      ? this.refresh_reso_subscription.unsubscribe()
      : '';
    if (this.textSnapChat != this.text) {
      let textWithoutHtml = this.text
        .replace(/<em class="search-bg-blue">/g, '')
        .replace(/<em class="search-bg-show">/g, '')
        .replace(/<\/em>/g, '');
      this._buildUtil.updateReplace(this.field, textWithoutHtml, this.propName);
      if (this.field.number) {
        this.field.text =
          this.field.number +
          ' ' +
          textWithoutHtml.slice(0, 25) +
          (textWithoutHtml.length > 25 ? '...' : '');
        let titleobj = this._buildUtil.setIconAndText(this.field);
        let obj = {
          text: titleobj.text,
          number: this.field.number,
          dgUniqueId: this.field.dgUniqueID,
          dgType: this.field.dgType,
        };
        this.cbpService.headerItem = obj;
        this.cbpService.popupDocumentSave = false;
      }
      if (!this.isHTMLText) {
        this.modelChange.emit(this.text);
      } else {
        this.removeEmTags();
      }
    }
  }
}
