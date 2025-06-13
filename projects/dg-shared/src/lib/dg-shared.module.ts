import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { TextInputHighlightComponent } from './angular-text-input-highlight/text-input-highlight.component';
import { TextInputHighlightContainerDirective } from './angular-text-input-highlight/text-input-highlight-container.directive';
import { TextInputElementDirective } from './angular-text-input-highlight/text-input-element.directive';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AeSelectComponent } from './angular-editor/ae-select/ae-select.component';
import { AngularEditorComponent } from './angular-editor/angular-editor.component';
import { AngularEditorToolbarComponent } from './angular-editor/angular-editor-toolbar.component';
import { DateTimeComponent } from './date-time/date-time.component';
import { RouterModule } from '@angular/router';
import { LeftDrawerComponent } from './left-drawer/left-drawer.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DgPaginationComponent } from './dg-pagination/dg-pagination.component';
import { PaginationService } from './dg-pagination/pagination.service';
import { TableComponent } from './table/table.component';
import { TreeStructureComponent } from './tree-structure/tree-structure.component';

import { UrlIframeComponent } from './url-iframe/url-iframe.component';
import { WebViewromponent } from './web-viewr/web-viewr.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ResizeLibDirective } from './angular-editor/resize.directive';

@NgModule({
  declarations:[ TextInputHighlightComponent, TextInputHighlightContainerDirective,
    TextInputElementDirective,LeftDrawerComponent,HeaderComponent,
    AngularEditorComponent, AngularEditorToolbarComponent, AeSelectComponent,
    DateTimeComponent, DgPaginationComponent,TableComponent,
    TreeStructureComponent,ResizeLibDirective,
    WebViewromponent, UrlIframeComponent, BreadcrumbComponent],
  imports: [ CommonModule, FormsModule, ReactiveFormsModule,
    RouterModule, NgbPaginationModule
  ],
  exports:[ TextInputHighlightComponent, TextInputHighlightContainerDirective,
    TextInputElementDirective,LeftDrawerComponent,HeaderComponent,
    AngularEditorComponent, AngularEditorToolbarComponent, AeSelectComponent,
    DateTimeComponent, DgPaginationComponent,TableComponent,
    TreeStructureComponent, RouterModule, ResizeLibDirective,
    WebViewromponent, UrlIframeComponent, BreadcrumbComponent],
  providers: [PaginationService]
})
export class DgSharedModule { }
