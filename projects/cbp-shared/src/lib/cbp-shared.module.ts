import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DownloadCbpComponent } from './components/download-cbp/download-cbp.component';
import { ModalPopupComponent } from './components/modal-popup/modal-popup.component';
import { ArticleExeMath } from './components/math-exp/article-math.component';
import { EditMediaComponent } from './components/edit-media/edit-media.component';
import { SectionExeDependencyComponent } from './components/section-dependency/section-dependency.component';
import { DependencyCheckboxComponent } from './components/section-dependency/dependency-checkbox/dependency-checkbox.component';

import { InnerhtmlPipe } from './directives/innerhtml.pipe';
import { CaptalLetter } from './directives/capital.directive';
import { NumericDirective } from './directives/number.directive';
import { DisableDirective } from './directives/disable.directive';
import { CbpSharedService } from './cbp-shared.service';
import { NotifierOptions, NotifierService } from 'angular-notifier';
import { ShowMediaComponent } from './components/show-media/show-media.component';
import { ErrorModalComponent } from './components/error-modal/error-modal.component';
import { DgSharedModule } from 'dg-shared';
import { AngularDraggableModule } from 'dg-shared';
import { StickyNoteComponent } from './components/sticky-note/sticky-note.component';
//AngularDraggableModule

const options: NotifierOptions = {
  position: {
    horizontal: { position: 'right', distance: 0 },
    vertical: { position: 'top', distance: 20, gap: 10 }
  },
  theme: 'material',
  behaviour: { autoHide: 5000, onClick: 'hide', onMouseover: 'pauseAutoHide', showDismissButton: true, stacking: 4 },
  animations: {
    enabled: true,
    show: { preset: 'slide', speed: 300, easing: 'ease' },
    hide: { preset: 'fade', speed: 300, easing: 'ease', offset: 50 },
    shift: { speed: 300, easing: 'ease' },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    InnerhtmlPipe,
    CaptalLetter,
    NumericDirective,
    DisableDirective,
    ArticleExeMath,
    EditMediaComponent,
    ModalPopupComponent,
    ErrorModalComponent,
    DownloadCbpComponent,
    SectionExeDependencyComponent,
    DependencyCheckboxComponent,
    ShowMediaComponent,
    StickyNoteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DgSharedModule,
    AngularDraggableModule
  ],
  exports: [
    InnerhtmlPipe,
    CaptalLetter,
    NumericDirective,
    DisableDirective,
    ArticleExeMath,
    EditMediaComponent,
    ModalPopupComponent,
    ErrorModalComponent,
    DownloadCbpComponent,
    SectionExeDependencyComponent,
    DependencyCheckboxComponent,
    ShowMediaComponent,
    StickyNoteComponent
  ],
  providers: [CbpSharedService, NotifierService]
})
export class CbpSharedModule { }
