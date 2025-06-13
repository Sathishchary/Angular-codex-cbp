import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// external components

import { DgSharedModule } from 'dg-shared';
import { AuditService } from '../services/audit.service';

import { NgxLoadingModule } from 'ngx-loading';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { AutosizeModule } from 'ngx-autosize';
import { NgDragDropModule } from 'ng-drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import { ScrollEventModule } from 'ngx-scroll-event';
import { NgxWatermarkModule } from 'ngx-watermark';
import { ColorPickerModule } from 'ngx-color-picker';
import { CbpSharedModule } from 'cbp-shared';
import { DisableDirective } from './directives/disable.directive';
import { InnerhtmlPipe } from './directives/innerhtml.pipe';
import { InView } from './directives/inview.directive';
import { NumericDirective } from './directives/number.directive';
import { NumericNegativeDirective } from './directives/numeric-negative';
import { layoutStyle } from './directives/layout.pipe';
import { ResizableDirective } from './directives/resize.directive';
import { DatePlaceholderPipe } from './directives/date-placeholder.pipe';

const options: NotifierOptions = {
  position: {
    horizontal: {  position: 'right', distance: 0 },
    vertical: { position: 'top', distance: 20,  gap: 10 }
  },
  theme: 'material',
  behaviour: { autoHide: 5000, onClick: 'hide', onMouseover: 'pauseAutoHide', showDismissButton: true,  stacking: 4 },
  animations: {
    enabled: true,
    show: { preset: 'slide',  speed: 300,  easing: 'ease' },
    hide: { preset: 'fade', speed: 300,  easing: 'ease', offset: 50  },
    shift: {  speed: 300,  easing: 'ease' },
    overlap: 150
  }
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DgSharedModule,
    AutosizeModule,
    NgxLoadingModule,
    DeviceDetectorModule,
    NgDragDropModule.forRoot(),
    DragDropModule,
    NotifierModule.withConfig(options),
    NgbPaginationModule,
    ScrollEventModule,
    NgxWatermarkModule,
    ColorPickerModule,
    CbpSharedModule
    ],
  declarations:  [DisableDirective,
    InnerhtmlPipe,InView,
    NumericDirective,
    NumericNegativeDirective,
    layoutStyle,
    ResizableDirective, DatePlaceholderPipe
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DgSharedModule,
    AutosizeModule,
    NgxLoadingModule,
    DeviceDetectorModule,
    NgDragDropModule,
    DragDropModule,
    NotifierModule,
    FormsModule,
    NgbPaginationModule,
    ScrollEventModule,
    NgxWatermarkModule,
    ColorPickerModule,
    CbpSharedModule,
    DisableDirective,
    InnerhtmlPipe,
    InView,
    NumericDirective,
    NumericNegativeDirective,
    layoutStyle,
    ResizableDirective,
    DatePlaceholderPipe
  ],
   providers: [AuditService],
})
export class SharedModule { }
