import { Component, OnInit ,Input, SimpleChanges, OnChanges} from '@angular/core';
import { DgTypes } from '../../../models/dg-types';

@Component({
  selector: 'app-dependency-checkbox',
  templateUrl: './dependency-checkbox.component.html',
  styleUrls: ['./dependency-checkbox.component.css']
})
export class DependencyCheckboxComponent implements OnInit, OnChanges {
  @Input()
  section: any;
  @Input()
  openClosetree: any;
  @Input()
  resetChanges: boolean = false;
  @Input() cbpJson:any;
  @Input() selectedElement:any;
  dgType = DgTypes;
  constructor() { }

  ngOnInit() {
   if(this.cbpJson){
    this.selectedIdDisabled(this.cbpJson.section,true);
    this.updateDependency(this.cbpJson.section, this.selectedElement.configureDependency);
   }
  }
  checkSectionIds(item: any, event: any){
    if (item.children && item.children.length && typeof item.children === "object"){
    this.childrenStepsUnchecked(item.children, event.target.checked);
  }
  }
  childrenStepsUnchecked(data: string | any[],type: boolean) {
    for (var i = 0; i < data.length; i++) {
      if(data[i].dgType === this.dgType.Section || data[i].dgType === this.dgType.StepAction || data[i].dgType === this.dgType.StepInfo ||
        data[i].dgType === this.dgType.DelayStep || data[i].dgType === this.dgType.Timed || data[i].dgType === this.dgType.Repeat){
          data[i]['disabledDependency'] = type;
          data[i]['dependencyChecked'] = false;
        }
       if (data[i].children && data[i].children.length && typeof data[i].children === "object") {
        this.childrenStepsUnchecked(data[i].children,type);
      }
    }
  }
  selectedIdDisabled(data: string | any[],type: boolean) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].dgUniqueID === this.selectedElement.dgUniqueID) {
         data[i]['disabledDependency'] = type;
         this.childrenStepsUnchecked(data[i].children,type);
      }
      if (data[i].children && data[i].children.length  && typeof data[i].children === "object") {
        this.selectedIdDisabled(data[i].children,type);
      }
    }
  }
  updateDependency(sectionData: string | any[],selectedDependent: string | any[]){
    for (var i = 0; i < sectionData.length; i++) {
      if (selectedDependent.length > 0) {
       for(var j = 0; j < selectedDependent.length; j++){
        if(sectionData[i].dgUniqueID === selectedDependent[j].dgUniqueId){
         sectionData[i].dependencyChecked = true;
         this.childrenStepsUnchecked(sectionData[i].children, true);
        }
       }
      }
    if (sectionData[i].children && sectionData[i].children.length  && typeof sectionData[i].children === "object") {
      this.updateDependency(sectionData[i].children, selectedDependent);
    }
  }
  }

  ngOnChanges(changes: SimpleChanges) {
    // tslint:disable-next-line: forin
    for (const propName in changes) {

      if (propName === 'resetChanges' && !changes.resetChanges.firstChange) {
        this.selectedIdDisabled(this.cbpJson.section,true);
        this.updateDependency(this.cbpJson.section, this.selectedElement.configureDependency);
        console.log(this.selectedElement.configureDependency)
      }

    }
  }

}
