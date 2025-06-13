import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BuilderModule } from 'dist/builder';
import { LibExecuterModule } from 'dist/executer-v2';


import { DgSharedModule } from 'dist/dg-shared';
// import { ValidationRoutienModule } from 'dist/validation-routien';
import { NgxLoadingModule } from 'ngx-loading';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CbpEditorComponent } from './cbp-editor/cbp-editor.component';
import { EwpExecuterComponent } from './ewp-executer/ewp-executer.component';
import { TopNavComponent } from './ewp-executer/top-nav/top-nav.component';
import { AuthInterceptor } from './intercept.service';
import { MobileExecutorComponent } from './mobile-executor/mobile-executor.component';
import { PageviewComponent } from './pageview/pageview.component';
import { TableDemoComponent } from './table-demo/table-demo.component';
import { WrapperViewComponent } from './wrapper-view/wrapper-view.component';
import { EnvServiceProvider } from './env.service.provider';

@NgModule({
  declarations: [
    AppComponent,
    PageviewComponent,
    MobileExecutorComponent,
    WrapperViewComponent,
    EwpExecuterComponent,
    TopNavComponent,
    CbpEditorComponent,
    TableDemoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxLoadingModule.forRoot({}),
    LibExecuterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BuilderModule,
    // ValidationRoutienModule,
    DgSharedModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    EnvServiceProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
