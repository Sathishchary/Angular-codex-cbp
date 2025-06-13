import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CbpSharedService, DgTypes } from 'cbp-shared';
import { ActionId, DataInfoModel } from '../../models';
import { UndoCommentStore } from '../../models/undo-comment-store';
import { CbpExeService } from '../../services/cbpexe.service';
import { ExecutionService } from '../../services/execution.service';
import { SharedviewService } from '../../services/sharedview.service';

/* @author: Sathish Kotha ; @contact: sathishcharykotha@gmail.com */
@Component({
  selector: 'app-undo-comment',
  templateUrl: './undo-comment.component.html',
  styleUrls: ['./undo-comment.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UndoCommentComponent implements OnInit, OnDestroy {
  @Input() selectedStepSectionInfo: any;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  @Output() sendDataEntryJson: EventEmitter<any> = new EventEmitter();
  undoCommentValue: any;
  constructor(public cbpService: CbpExeService, public executionService: ExecutionService,
    public sharedviewService: SharedviewService, public sharedService: CbpSharedService, public cdref: ChangeDetectorRef) { }

  ngOnInit() {
    this.sharedService.openModalPopup('undoComment');
  }
  viewUpdated() {
    this.cdref.detectChanges();
  }
  undoCommentStore(value: any) {
    let undoObj = new UndoCommentStore(value, value, new Date(), this.executionService.selectedUserName);
    this.storeDataJsonObject(undoObj);
    this.closeEvent.emit({ undoObj: undoObj });
  }

  storeDataJsonObject(undoObj: any) {
    let userName = this.executionService.selectedUserName;
    let dgUniqueID = (++this.cbpService.lastSessionUniqueId).toString();
    let dataInfo: DataInfoModel = new DataInfoModel(DgTypes.UndoStep, userName, new Date(), userName, new Date(), '', DgTypes.UndoComment, dgUniqueID, this.selectedStepSectionInfo.dgUniqueID);
    dataInfo = { ...dataInfo, ...this.sharedviewService.setUserInfoObj(ActionId.UndoVerification), ...undoObj };
    this.sendDataEntryJson.emit(dataInfo);

  }
  closeModal() {
    this.sharedService.closeModalPopup('undoComment');
    this.closeEvent.emit(false);
  }
  ngOnDestroy(): void {
    this.closeModal();
  }
}
