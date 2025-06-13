import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { DatashareService } from './services/datashare.service';
import { DataWrapperService } from '../executer-wrapper/data-wrapper.service';

import { ChangeRequestComponent } from './components/change-request/change-request.component';
import { EditsectionComponent } from './components/editsection/editsection.component';
import { UploadMediaComponent } from './components/upload-media/upload-media.component';
import { CommentsComponent } from './components/comments/comments.component';
import { UndoCommentComponent } from './components/undo-comment/undo-comment.component';
import { EmailComponent } from './components/email/email.component';
import { DelaytimerComponent } from './components/delaytimer/delaytimer.component';
import { DetailExecutionComponent } from './components/detail-execution/detail-execution.component';
import { SecurityVerifyUserComponent } from './components/security-verify-user/security-verify-user.component';
import { DocSizeChangeComponent } from './components/doc-size-change/doc-size-change.component';
import { ShowUsersComponent } from './components/show-users/show-users.component';
import { AlertViewComponent } from './components/alert-view/alert-view.component';
import { MediaViewComponent } from './components/media-view/media-view.component';
import { ParaLabelViewComponent } from './components/para-label-view/para-label-view.component';
import { LinkViewComponent } from './components/link-view/link-view.component';
import { TableViewComponent } from './components/table-view/table-view.component';
import { TextboxViewComponent } from './components/textbox-view/textbox-view.component';
import { SignatureViewComponent } from './components/signature-view/signature-view.component';
import { InitialSignViewComponent } from './components/initial-sign-view/initial-sign-view.component';
import { TextareaViewComponent } from './components/textarea-view/textarea-view.component';
import { NumericViewComponent } from './components/numeric-view/numeric-view.component';
import { BooleanViewComponent } from './components/boolean-view/boolean-view.component';
import { DateViewComponent } from './components/date-view/date-view.component';
import { CheckboxViewComponent } from './components/checkbox-view/checkbox-view.component';
import { ExecutionOrderComponent } from './components/execution-order/execution-order.component';
import { FormulaViewComponent } from './components/formula-view/formula-view.component';
import { ExecutionMenuBarComponent } from './components/execution-menu-bar/execution-menu-bar.component';
import { GalleryViewComponent } from './components/gallery-view/gallery-view.component';
import { HeaderExefooterComponent } from './components/headerfooter/headerfooter.component';
import { DocExeComponent } from './components/doc/doc.component';
import { DynamicSectionComponent } from './components/dynamic-section/dynamic-section.component';
import { FormexecutionComponent } from './formexecution/formexecution.component';
import { FormviewComponent } from './formview/formview.component';
import { DynamicExeFormComponent } from './dynamic-exe-form/dynamic-exe-form.component';
import { VerificationComponent } from './components/verification/verification.component';
import { VerificationViewComponent } from './components/verification-view/verification-view.component';
import { UsageOptionComponent } from './components/usage-option/usage-option.component';
import { SignatureEditorComponent } from './components/signature-editor/signature-editor.component';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { ExecuterWrapperComponent } from '../executer-wrapper/executer-wrapper/executer-wrapper.component';
import { TextEditorComponent } from './components/text-editor/text-editor.component';
import { ColorupdateComponent } from './components/colorupdate/colorupdate.component';
import { TableDataEntryComponent } from './components/table-view/table-data-entries/table-entry.component';
import { ProtectApprovalComponent } from './components/protect-approval/protect-approval.component';
import { TrackUserComponent } from './components/track-user/track-user.component';
import { ExecutionService } from './services/execution.service';
import { CbpSharedModule } from 'cbp-shared';
import { DgSharedModule } from 'dg-shared';
import { DatePopupComponent } from './components/date-popup/date-popup.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgDragDropModule } from 'ng-drag-drop';
// import { MatIconModule } from '@angular/material/icon';
import { ShowcrcommentComponent } from './components/showcrcomment/showcrcomment.component';
import { AttributeViewComponent } from './components/attribute-view/attribute-view.component';
import { ScrollEventModule } from 'ngx-scroll-event';
import { LockiconComponent } from './components/lockicon/lockicon.component';
import { CopyFromWordComponent } from './components/copy-from-word/copy-from-word.component';
import { ShowRulesComponent } from './components/show-rules/show-rules.component';
import { TrackUiComponent } from './components/track-ui/track-ui.component';
import { YubikeyComponent } from './components/yubikey/yubikey.component';

let components = [
  FormexecutionComponent,
  FormviewComponent,
  DynamicExeFormComponent,
  DocExeComponent,
  HeaderExefooterComponent,
  VerificationComponent,
  ChangeRequestComponent,
  EditsectionComponent,
  UploadMediaComponent,
  UndoCommentComponent,
  CommentsComponent,
  EmailComponent,
  DelaytimerComponent,
  DetailExecutionComponent,
  SecurityVerifyUserComponent,
  DocSizeChangeComponent,
  ShowUsersComponent,
  AlertViewComponent,
  MediaViewComponent,
  LinkViewComponent,
  ParaLabelViewComponent,
  TableViewComponent,
  TextboxViewComponent,
  SignatureViewComponent,
  InitialSignViewComponent,
  TextareaViewComponent,
  NumericViewComponent,
  VerificationViewComponent,
  BooleanViewComponent,
  DateViewComponent,
  CheckboxViewComponent,
  UsageOptionComponent,
  ExecutionOrderComponent,
  FormulaViewComponent,
  ExecutionMenuBarComponent,
  GalleryViewComponent,
  DynamicSectionComponent,
  SignatureEditorComponent,
  MenuBarComponent,
  ExecuterWrapperComponent,
  TextEditorComponent,
  ColorupdateComponent,
  TableDataEntryComponent,
  ProtectApprovalComponent,
  TrackUserComponent,
  DatePopupComponent,
  ShowcrcommentComponent,
  AttributeViewComponent,
  LockiconComponent,
  CopyFromWordComponent,
  ShowRulesComponent,
  TrackUiComponent,
  YubikeyComponent
]

@NgModule({
  declarations: components,
  imports: [
    HttpClientModule,
    SharedModule,
    CbpSharedModule,
    DgSharedModule,
    NgbTooltipModule,
    DragDropModule,
    NgDragDropModule.forRoot(),
    // MatIconModule,
    ScrollEventModule

  ],
  exports: [...components, ...[SharedModule]],
  providers: [ DataWrapperService, DatashareService, ExecutionService]
})
export class LibExecuterModule {

}
