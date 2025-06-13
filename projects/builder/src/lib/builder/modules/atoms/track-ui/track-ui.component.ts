import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DgTypes } from 'cbp-shared';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TrackChangeComponent } from '../../../components/track-change/track-change.component';
import { CbpService } from '../../../services/cbp.service';
import { ControlService } from '../../../services/control.service';
import { LayoutService } from '../../../shared/services/layout.service';

@Component({
  selector: 'dg-track-ui',
  templateUrl: './track-ui.component.html',
  styleUrls: ['./track-ui.component.css']
})
export class TrackUiComponent implements OnInit {

  @Input() field: any;
  modalOptions!: NgbModalOptions;
  styles: any;
  DgTypes = DgTypes;
  showTrackChange = false;
  showTrackChange$ = new BehaviorSubject<boolean>(this.showTrackChange);
  @Output() fieldChange: EventEmitter<any> = new EventEmitter<any>();
  detectviewSubscribe!: Subscription;
  setItemSubscription !: Subscription;
  trackUiSubscribe!: Subscription;
  @Input() index: any;
  constructor(public cbpService: CbpService, private modalService: NgbModal, private layoutService: LayoutService,
    private controlService: ControlService) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'xl'
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      let change = changes[propName];
      if (propName === 'field' && change.currentValue) {
        this.checkUiPart();
      }
    }
  }

  checkUiPart() {
    if (this.field?.internalRevision && this.field?.internalRevision !== '') {
      this.showTrackChange = false;
      let internalRevision: any = '';
      internalRevision = this.cbpService.validateTrackChange(internalRevision, this.cbpService.cbpJson.documentInfo[0]);
      if (this.field?.internalRevision == internalRevision) {
        this.showTrackChange = true;
      }
    }
    if (!this.cbpService.isChangeUpdates) { this.showTrackChange = false; }
    this.showTrackChange$.next(this.showTrackChange);
  }

  ngOnInit(): void {
    this.applyStyles();
    this.detectviewSubscribe = this.controlService.detectAllChangeView$.subscribe((result: any) => {
      if (result === true) {
        this.checkUiPart();
      }
    });
    this.trackUiSubscribe = this.controlService.hideTrackUiChangeView$.subscribe((result: any) => {
      if (result['trackUiChange'] === true) {
        this.checkUiPart();
      }
    });
    this.setItemSubscription = this.controlService.selectedObjValue.subscribe((result: any) => {
      if (result && result !== undefined && result?.dgType !== undefined) {
        this.cbpService.selectedUniqueId = result.dgUniqueID;
        this.cbpService.selectedElement = result;
        if (this.field.dgUniqueID === result.dgUniqueID) {
          if (this.field.dgType === DgTypes.FormulaDataEntry) {
            this.styles = this.setStyles("absolute", "-15px", "5px");
          }
          if (this.field.dgType === DgTypes.VerificationDataEntry || this.field.dgType === DgTypes.QA || this.field.dgType === DgTypes.Peer || this.field.dgType === DgTypes.Independent
            || this.field.dgType === DgTypes.Concurrent) {
            this.styles = this.setStyles("absolute", "-15px", "5px");
          }
          if (this.field.dgType === DgTypes.TextDataEntry || this.field.dgType === DgTypes.NumericDataEntry || this.field.dgType === DgTypes.CheckboxDataEntry
            || this.field.dgType === DgTypes.BooleanDataEntry || this.field.dgType === DgTypes.DateDataEntry) {
            this.styles = this.setStyles("absolute", "-15px", "5px");
          }
          else {
            this.applyStyles();
          }
        } else {
          this.applyStyles();
        }
      }
    });
  }

  applyStyles() {
    // if(this.index !== undefined){
    //   this.styles = this.setStyles("absolute", "-20px", (this.index * 48)+"px");
    // } 

    //warnings done
    this.styles = this.setStyles("absolute", "-20px", (this.index * 48) + "px");
    if (this.field.dgType === DgTypes.Warning || this.field.dgType === DgTypes.Caution || this.field.dgType === DgTypes.Note || this.field.dgType === DgTypes.Alara) {
      if (this.layoutService.isDisableNumber && this.layoutService.layoutIcons[0].showIcons) {
        this.styles = this.setStyles("absolute", "-13px", "0px");
        return;
      } else if (!this.layoutService.isDisableNumber && !this.layoutService.layoutIcons[0].showIcons) {
        this.styles = this.setStyles("absolute", "-11px", "0px");
        return;
      } else if (this.layoutService.isDisableNumber && !this.layoutService.layoutIcons[0].showIcons) {
        this.styles = this.setStyles("absolute", "-8px", "0px");
        return;
      } else {
        this.styles = this.setStyles("absolute", "-15px", "5px");
        return;
      }
    }//verification
    if (this.field.dgType === DgTypes.VerificationDataEntry || this.field.dgType === DgTypes.QA || this.field.dgType === DgTypes.Peer || this.field.dgType === DgTypes.Independent
      || this.field.dgType === DgTypes.Concurrent || this.field.dgType === DgTypes.SignatureDataEntry || this.field.dgType === DgTypes.InitialDataEntry) {
      if (this.layoutService.isDisableNumber && this.layoutService.layoutIcons[0].showIcons) {
        this.styles = this.setStyles("absolute", "-13px", "4px");
        return;
      } else if (!this.layoutService.isDisableNumber && !this.layoutService.layoutIcons[0].showIcons) {
        this.styles = this.setStyles("absolute", "-11px", "4px");
        return;
      } else if (this.layoutService.isDisableNumber && !this.layoutService.layoutIcons[0].showIcons) {
        this.styles = this.setStyles("absolute", "-5px", "4px");

        return;
      } else {
        this.styles = this.setStyles("absolute", "-15px", "5px");

        return;
      }
    }//data entry done
    if (this.field.dgType === DgTypes.TextDataEntry || this.field.dgType === DgTypes.NumericDataEntry || this.field.dgType === DgTypes.CheckboxDataEntry
      || this.field.dgType === DgTypes.BooleanDataEntry || this.field.dgType === DgTypes.DateDataEntry || this.field.dgType === DgTypes.Table || this.field.dgType === DgTypes.TextAreaDataEntry) {
      if (this.layoutService.isDisableNumber && this.layoutService.layoutIcons[0].showIcons) {//icon
        this.styles = this.setStyles("absolute", "-10px", "4px");
        return;
      } else if (!this.layoutService.isDisableNumber && !this.layoutService.layoutIcons[0].showIcons) {//number
        this.styles = this.setStyles("absolute", "-10px", "6px");
        return;
      } else if (this.layoutService.isDisableNumber && !this.layoutService.layoutIcons[0].showIcons) {//none
        this.styles = this.setStyles("absolute", "-6px", "5px");
        return;
      } else {//others
        this.styles = this.setStyles("absolute", "-15px", "5px");
        return;
      }
    }//media
    if (this.field.dgType === DgTypes.VerificationDataEntry || this.field.dgType === DgTypes.Figures || this.field.dgType === DgTypes.Figure) {
      if (this.layoutService.isDisableNumber && this.layoutService.layoutIcons[0].showIcons) {
        this.styles = this.setStyles("absolute", "-8px", "7px");
        return;
      } else if (!this.layoutService.isDisableNumber && !this.layoutService.layoutIcons[0].showIcons) {
        this.styles = this.setStyles("absolute", "-10px", "6px");
        return;
      } else if (this.layoutService.isDisableNumber && !this.layoutService.layoutIcons[0].showIcons) {
        this.styles = this.setStyles("absolute", "-5px", "7px");
        return;
      } else {
        this.styles = this.setStyles("absolute", "-15px", "5px");
        return;
      }
    }
    else if (this.field.dgType === DgTypes.VerificationDataEntry) {
      if (this.layoutService.isDisableNumber && this.layoutService.layoutIcons[0].showIcons) {
        this.styles = this.setStyles("absolute", "-10px", "1px");
        return;
      } else if (!this.layoutService.isDisableNumber && !this.layoutService.layoutIcons[0].showIcons) {
        this.styles = this.setStyles("absolute", "-10px", "1px");
        return;
      } else if (this.layoutService.isDisableNumber && !this.layoutService.layoutIcons[0].showIcons) {
        this.styles = this.setStyles("absolute", "-5px", "1px");
        return;
      } else {
        this.styles = this.setStyles("absolute", "-15px", "5px");
        return;
      }
    }
    else if (this.field.dgType === DgTypes.Link) {
      if (this.layoutService.isDisableNumber && this.layoutService.layoutIcons[0].showIcons) { //icon
        this.styles = this.setStyles("absolute", "-10px", "6px");
        return;
      } else if (!this.layoutService.isDisableNumber && !this.layoutService.layoutIcons[0].showIcons) { //num
        this.styles = this.setStyles("absolute", "-10px", "6px");
        return;
      } else if (this.layoutService.isDisableNumber && !this.layoutService.layoutIcons[0].showIcons) { //none
        this.styles = this.setStyles("absolute", "-5px", "5px");
        return;
      } else {
        this.styles = this.setStyles("absolute", "-15px", "5px");
        return;
      }
    }
    //label,para,formula done
    if (this.field.dgType === DgTypes.LabelDataEntry || this.field.dgType === DgTypes.FormulaDataEntry) {
      if (this.layoutService.isDisableNumber && this.layoutService.layoutIcons[0].showIcons) {
        this.styles = this.setStyles("absolute", "-10px", "1px");
        return;
      } else if (!this.layoutService.isDisableNumber && !this.layoutService.layoutIcons[0].showIcons) {
        this.styles = this.setStyles("absolute", "-10px", "1px");
        return;
      } else if (this.layoutService.isDisableNumber && !this.layoutService.layoutIcons[0].showIcons) {
        this.styles = this.setStyles("absolute", "-7px", "1px");
        return;
      } else {
        this.styles = this.setStyles("absolute", "-15px", "5px");
        return;
      }
    }
    if (this.field.dgType === DgTypes.Para) {
      if (this.layoutService.isDisableNumber && this.layoutService.layoutIcons[0].showIcons) {
        this.styles = this.setStyles("absolute", "-10px", "6px");
        return;
      } else if (!this.layoutService.isDisableNumber && !this.layoutService.layoutIcons[0].showIcons) {
        this.styles = this.setStyles("absolute", "-10px", "6px");
        return;
      } else if (this.layoutService.isDisableNumber && !this.layoutService.layoutIcons[0].showIcons) {
        this.styles = this.setStyles("absolute", "-7px", "6px");
        return;
      } else {
        this.styles = this.setStyles("absolute", "-15px", "5px");
        return;
      }
    }
    //done
    else if (this.field.dgType === DgTypes.Section || this.field.dgType === DgTypes.StepInfo || this.field.dgType === DgTypes.StepAction || this.field.dgType === DgTypes.DelayStep || this.field.dgType === DgTypes.Timed) {
      this.styles = this.setStyles("relative", "-3px", "0px");
    } else if (this.field.dgType === DgTypes.Repeat) {
      this.styles = this.setStyles("relative", "-3px", "0px");
    }
    else {
      this.styles = this.setStyles("absolute", "-15px", "5px");
    }
  }

  setStyles(pos: string, left: string, top: string) {
    return { "position": pos, "left": left, "color": "red", "top": top };
  }

  openTrackChange() {
    if (this.field.dgType !== DgTypes.Figures && this.field.dgType !== DgTypes.Figure && this.field.dgType !== DgTypes.Table) {
      const modalRef = this.modalService.open(TrackChangeComponent, this.modalOptions);
      modalRef.componentInstance.cbpServiceNew = this.cbpService;
      modalRef.componentInstance.controlService = this.controlService;
      modalRef.componentInstance.field = JSON.parse(JSON.stringify(this.field));
      modalRef.componentInstance.layoutService = this.layoutService;
      modalRef.componentInstance.closeEvent.subscribe((result: any) => {
        if (result != false) {

          this.fieldChange.emit(result);
        }
        modalRef.close();
      });
    }
  }

  ngOnDestroy() {
    this.detectviewSubscribe?.unsubscribe();
    this.showTrackChange$?.unsubscribe();
    this.setItemSubscription?.unsubscribe();
    this.trackUiSubscribe?.unsubscribe();
  }
  setValue(event: any) {
    this.field.prompt = event.target.value;
  }
}
