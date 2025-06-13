import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { SignaturePadModule } from 'angular2-signaturepad';
import { NgbPaginationModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CountdownModule } from 'ngx-countdown';
import { NgxWatermarkModule } from 'ngx-watermark';
import { AutosizeModule } from 'ngx-autosize';
import { NotifierService } from 'angular-notifier';

// DataGlance custom libraries
import { CbpSharedModule } from 'cbp-shared';
import { DgSharedModule } from 'dg-shared';
import { DisableDirective } from './directives/disable.directive';
import { CaptalLetter } from './directives/capital.directive';
import { InnerhtmlPipe } from './directives/innerhtml.pipe';
import { NumericDirective } from './directives/number.directive';
import { InView } from './directives/inview.directive';
import { InViewDirective } from './directives/inview-step.directive';
import { removehtmlPipe } from './directives/removehtml.pipe'
import { NumericNegativeDirective } from './directives/numeric-negative';

import { ColorPickerModule } from 'ngx-color-picker';
import { ResizeDirective } from './directives/resize.directive';
import { FontSizePipe } from './directives/fontsize.pipe';

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
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff'
    }),
    DeviceDetectorModule,
    NotifierModule.withConfig(options),
    SignaturePadModule,
    NgbPaginationModule,
    CountdownModule,
    NgxWatermarkModule,
    AutosizeModule,
    NgbModule,
    CbpSharedModule,
    DgSharedModule,
    ColorPickerModule
  ],
  declarations: [
    CaptalLetter,
    DisableDirective,
    InnerhtmlPipe,
    InView,
    NumericDirective,
    removehtmlPipe,
    NumericNegativeDirective,
    ResizeDirective,
    FontSizePipe,
    InViewDirective
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CbpSharedModule,
    NgxLoadingModule,
    DeviceDetectorModule,
    NotifierModule,
    FormsModule,
    SignaturePadModule,
    NgbPaginationModule,
    CountdownModule,
    NgxWatermarkModule,
    AutosizeModule,
    NgbModule,
    DgSharedModule,
    CaptalLetter,
    DisableDirective,
    InnerhtmlPipe,
    InView,
    InViewDirective,
    NumericDirective,
    removehtmlPipe,
    NumericNegativeDirective,
    ColorPickerModule,
    ResizeDirective,
    FontSizePipe
  ],
   providers: [NotifierService],
})
export class SharedModule { }
