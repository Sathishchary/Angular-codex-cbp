import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
// components
import { DynamicFormBuilderComponent } from './dynamic-form-builder.component';
import { EditorComponent } from './editor/editor.component';
import { DualStepComponent } from './dual-step/dual-step.component';

// Control Components
import { AlertsComponent } from './atoms/alerts/alerts.component';
import { ParagraphComponent } from './atoms/paragraph/paragraph.component';
import { TextboxComponent } from './atoms/textbox/textbox.component';
import { TextareaComponent } from './atoms/textarea/textarea.component';
import { CheckboxComponent } from './atoms/checkbox/checkbox.component';
import { TableComponent } from './atoms/table/table.component';
import { DateComponent } from './atoms/date/date.component';
import { NumberComponent } from './atoms/number/number.component';
import { BooleanComponent } from './atoms/boolean/boolean.component';
import { MediaComponent } from './atoms/media/media.component';
import { LinkComponent } from './atoms/link/link.component';
import { VerificationComponent } from './atoms/verification/verification.component';
import { SignatureComponent } from './atoms/signature/signature.component';
import { LabelComponent } from './atoms/label/label.component';
import { InitialComponent } from './atoms/initial/initial.component';
import { TextEditorComponent } from './atoms/text-editor/text-editor.component';
import { StepOptionComponent } from './atoms/step-option/step-option.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { FormulaComponent } from './atoms/formula/formula.component';
import { DgSharedModule } from 'dg-shared';
import { HyperLinkService } from './services/hyper-link.service';
import { SharedModule } from '../shared/shared.module';
import { TableFormBuilderComponent } from './atoms/table/table-form-builder/table-form-builder.component';
import { PromptComponent } from './atoms/prompt/prompt.component';
import { TrackUiComponent } from './atoms/track-ui/track-ui.component';
import { TrackChangeComponent } from '../components/track-change/track-change.component';
import { MatIconModule } from '@angular/material/icon';
import { AttributeComponentComponent } from './atoms/attribute-component/attribute-component.component';
import { LockiconComponent } from '../components/lockicon/lockicon.component';
import { ShowlabelpromptComponent } from './atoms/showlabelprompt/showlabelprompt.component';

// import { StickyNoteComponent } from './atoms/sticky-note/sticky-note.component';

let components = [
  DynamicFormBuilderComponent,
  DateComponent,
  LabelComponent,
  BooleanComponent,
  NumberComponent,
  VerificationComponent,
  SignatureComponent,
  AlertsComponent,
  ParagraphComponent,
  TextboxComponent,
  TextareaComponent,
  CheckboxComponent,
  TableComponent,
  MediaComponent,
  LinkComponent,
  EditorComponent,
  DualStepComponent,
  InitialComponent,
  TextEditorComponent,
  StepOptionComponent,
  SearchResultComponent,
  FormulaComponent,
  TableFormBuilderComponent,
  PromptComponent,
  TrackUiComponent,
  TrackChangeComponent,
  AttributeComponentComponent,
  LockiconComponent,
  ShowlabelpromptComponent

  // StickyNoteComponent
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    DgSharedModule,
    HttpClientModule,
    MatIconModule
  ],
  declarations: components,
  exports: components,
  providers: [HyperLinkService]
})
export class DynamicFormBuilderModule { }
