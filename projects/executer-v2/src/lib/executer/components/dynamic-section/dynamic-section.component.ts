import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DgTypes } from 'cbp-shared';
import { DynamicSec } from '../../models/';

@Component({
  selector: 'dynamic-section',
  templateUrl: './dynamic-section.component.html',
  styleUrls: ['./dynamic-section.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicSectionComponent implements OnInit {
  @Input() section!: any;
  newSectionObj!: any;
  dynamicSection = [];
  loading = false;
  currentSectionInfo = [];
  @Input() sectionInfo: any[] = [];
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  newSectionInfo = [];
  constructor() { }

  ngOnInit(): void {
    if (!this.sectionInfo) { this.sectionInfo = []; } else {
      this.sectionInfo.forEach((item: any, i: number) => { item['update'] = false; });
      this.currentSectionInfo = JSON.parse(JSON.stringify(this.sectionInfo));
    }
    if (this.currentSectionInfo.length > 0) {
      this.currentSectionInfo.forEach((item: any, i: number) => { item['update'] = false; });
    }
    if (this.sectionInfo.length === 0) {
      // this.section.forEach((item:any, i:number) => {
      //   if(item?.dynamic_section){
      //     this.sectionInfo.push(new DynamicSec(item, i));
      //    }
      // });
      this.loadDynamicObjects(this.section);
    }
    this.newSectionInfo = JSON.parse(JSON.stringify(this.sectionInfo));
  }
  loadDynamicObjects(sections: any) {
    if (sections?.length > 0) {
      for (let i = 0; i < sections.length; i++) {
        if ((this.stepActionCondition(sections[i])) && sections[i]?.dynamic_section) {
          this.sectionInfo.push(new DynamicSec(sections[i], i));
        }
        if (sections[i].children && sections[i].children?.length > 0) {
          this.loadDynamicObjects(sections[i].children);
        }
      }
    }
  }
  closeModal() {
    this.sectionInfo = JSON.parse(JSON.stringify(this.newSectionInfo));
    this.closeEvent.emit({ type: 'cancel', obj: this.sectionInfo });
  }
  keyPressEvent(event: any) {
    if (Number(event?.target?.value) < 0) {
      event.target.value = 0;
    }
    if (Number(event?.target?.value) > 10) {
      event.target.value = 10;
    }
  }
  stepActionCondition(obj: any) {
    if (obj !== undefined) {
      if (obj?.dgType === DgTypes.Section || obj?.dgType === DgTypes.StepAction || obj?.dgType === DgTypes.DelayStep || obj?.dgType === DgTypes.Timed || obj?.dgType === DgTypes.Repeat) {
        return true;
      }
    }
    return false;
  }
  setSectionObj(item: any, i: number) {
    if (item.dynamic_number > 10) {
      item.dynamic_number = 10;
      this.sectionInfo[i].dynamic_number = 10;
    } if (item.dynamic_number < 0 || item.dynamic_number == null || item.dynamic_number === '') {
      item.dynamic_number = 0;
      this.sectionInfo[i].dynamic_number = 0;
      this.setSectionInfo(i, 0, true, item);
    } else {
      if (item.dynamic_number === 0) {
        this.setSectionInfo(i, 0, true, item);
      }
      if (item.dynamic_number !== 0) {
        this.setSectionInfo(i, item.dynamic_number, false, item);
      }
    }
  }
  setSectionInfo(i: number, num: any, hide: boolean, item: any) {
    item.hide_section = hide;
    this.sectionInfo[i].dynamic_number = num;
    this.sectionInfo[i].hide_section = hide;
    this.sectionInfo = JSON.parse(JSON.stringify(this.sectionInfo));
  }
  setDynamicChange() {
    this.loading = true;
    setTimeout(() => {
      this.currentSectionInfo.forEach((item: any, i: any) => {
        this.sectionInfo[i]['previousNumber'] = item.dynamic_number;
      });
      this.newSectionInfo = JSON.parse(JSON.stringify(this.sectionInfo));
      this.loading = false;
      this.closeEvent.emit({ type: 'save', dynamicExecution: this.sectionInfo });
    }, 500);

  }
}
