/*
 * Public API Surface of dg-shared
 */

export * from './lib/dg-shared.service';
export * from './lib/dg-shared.module';

/*angular editor*/

export * from './lib/angular-editor/angular-editor.service';
export * from './lib/angular-editor/angular-editor.component';
export * from './lib/angular-editor/angular-editor-toolbar.component';
export { AngularEditorConfig, CustomClass } from './lib/angular-editor/config';


/*text input highlight*/
export * from './lib/angular-text-input-highlight/text-input-highlight.component';
export * from './lib/angular-text-input-highlight/text-input-highlight-container.directive';
export * from './lib/angular-text-input-highlight/text-input-element.directive';
export * from './lib/angular-text-input-highlight/highlight-tag.interface';

/*date-time*/
export * from './lib/date-time/date-time.component';

/*dg-pagination*/
export * from './lib/dg-pagination/pagination';
export * from './lib/dg-pagination/pagination.service';
export * from './lib/dg-pagination/dg-pagination.component';

/*header*/
export * from './lib/header/header.component';

/*left-drawer*/
export * from './lib/left-drawer/left-drawer.component';

/*table*/
export * from './lib/table/table.component';

/*tree-structure*/
export * from './lib/tree-structure/tree-structure.component';

/*angular draggable */
export * from './lib/draggable/angular-draggable.directive';
export * from './lib/draggable/angular-resizable.directive';
export * from './lib/draggable/angular-draggable.module';
export * from './lib/draggable/models/position';
