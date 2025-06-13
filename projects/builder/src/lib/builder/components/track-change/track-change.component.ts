import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DgTypes, ImagePath } from 'cbp-shared';
import { CbpService } from '../../services/cbp.service';
import { ControlService } from '../../services/control.service';

@Component({
  selector: 'lib-track-change',
  templateUrl: './track-change.component.html',
  styleUrls: ['./track-change.component.css','../../util/modal.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackChangeComponent implements OnInit {
  @Input() field:any;
  DgTypes: any = DgTypes;
  ImagePath: typeof ImagePath = ImagePath;
  @Output() closeEvent:EventEmitter<any> = new EventEmitter<any>();
  selectedValue= 'applicability';
  @Input() cbpServiceNew!:CbpService;
  @Input() layoutService!:any;
  hideTrackUi = true;
  updateIndicator = 0; 
  selectedVersionId = '';
  selectedVersion :any;
  selectedTitle = '';
  trackChanges:any = {
    versions:[]
  };
  constructor(public cbpService:CbpService, public controlService: ControlService,
    private _cdRef:ChangeDetectorRef) { }

  ngOnInit(): void {
    if(this.cbpService.styleImageJson === undefined){
      this.cbpService = this.cbpServiceNew;
    }
    // console.log(this.controlService.cbp_track_changes)
   // this.selectedVersion = this.trackChanges.versions[0];
    this.selectedTitle = this.field.title;
    this.setTracking();
  }
  setTracking() {
 
    this.controlService.getTrackChanges(
      this.controlService.cbp_track_changes.DGC_DOCUMENT_ID,
      this.field.dgUniqueID
       ).subscribe((result:any)=>{
      this.trackChanges.versions = result;
       if(this.trackChanges.versions && this.trackChanges.versions.length > 0){
        this.selectedVersion = this.trackChanges.versions[0];
        this.selectedVersionId = this.selectedVersion.dgcID;
        this.trackChanges.versions.forEach((element:any) => {
          switch (this.field.dgType) {
            case DgTypes.Warning:
            case DgTypes.Caution:
              element['cause'] = JSON.parse(element.dynamicObjCompleteText)['cause'];
              element['effect'] = JSON.parse(element.dynamicObjCompleteText)['effect'];
              
              break;
            case DgTypes.Note:
              element['notes'] = element.dynamicObjCompleteText.split('$$');
              
              break;
          
            default:
             
              break;
          }
        });
       }
       
        // console.log(this.trackChanges.versions)
        this._cdRef.detectChanges();
       })
  }
  ngAfterViewInit(){
    
  }
  hide(){
    this.closeEvent.emit(false);
  }
  submit(){
    if(this.updateIndicator == 1){
      switch (this.field.dgType) {
        case DgTypes.Warning:
        case DgTypes.Caution:
          this.field.cause = this.selectedVersion.cause;
          this.field.effect = this.selectedVersion.effect;
          
          break;
        case DgTypes.Note:
          this.field.notes = this.selectedVersion.notes;
         
          break;
        case DgTypes.Alara:
          this.field.alaraNotes = this.selectedVersion.alaraNotes;
          
          break;
        case DgTypes.LabelDataEntry:
        case DgTypes.Para:
        case DgTypes.TextDataEntry:
        case DgTypes.TextAreaDataEntry:
        case DgTypes.NumericDataEntry:
        case DgTypes.DateDataEntry:
        case DgTypes.BooleanDataEntry:
        case DgTypes.CheckboxDataEntry:
        case DgTypes.Link:
        case DgTypes.VerificationDataEntry:
        case DgTypes.InitialDataEntry:
        case DgTypes.FormulaDataEntry:
          this.field.prompt = this.selectedVersion.dynamicObjCompleteText;
          this.field.text = this.selectedVersion.dynamicObjCompleteText;
        
          
          break;
        case DgTypes.Section:
        case DgTypes.StepInfo:
          this.field.title = this.selectedVersion.dynamicObjCompleteText;
          this.field.text = this.selectedVersion.dynamicObjCompleteText;
          break;
        case DgTypes.StepAction:
        case DgTypes.DelayStep:
        case DgTypes.Timed:
        case DgTypes.Repeat:
        case DgTypes.Procedure:
          this.field.action  = this.selectedVersion.dynamicObjCompleteText;
          this.field.text = this.selectedVersion.dynamicObjCompleteText;
          break;
        
      
        default:
          this.field.title = this.selectedVersion.dynamicObjCompleteText;
          this.field.text = this.selectedVersion.dynamicObjCompleteText;
          break;
      }

      
      this.closeEvent.emit(this.field);
      this._cdRef.detectChanges();
    }
  }
  updateValue(value:any){
   this.selectedValue = value;
  }
  updateVersion(versionId:any){
    this.updateIndicator = 0;
    this.selectedVersion = this.trackChanges.versions.find((i:any)=> versionId == i.dgcID);
  }
  setIndicator(){
    this.updateIndicator == 0 ? this.updateIndicator = 1: '';
    this.selectedTitle = this.selectedVersion.title;
  }

}
