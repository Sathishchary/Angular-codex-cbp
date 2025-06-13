import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HighlightDirective } from './directives/highlight.directive';
import { NumberDirective } from './directives/number.directive';
import { CtrlClickDirective } from './directives/ctrl-click.directive';
import { DynamicFormBuilderModule } from './modules/dynamic-form-builder.module';
import { DocComponent } from './components/doc/doc.component';
import { ShowlabelComponent } from './components/property/components/showlabel/showlabel.component';
import { DgUniqueIdpropertyComponent } from './components/property/components/dg-unique-idproperty/dg-unique-idproperty.component';
import { SharedModule } from './shared/shared.module';
import { ActionComponent } from './components/action/action.component';
import { AlarmComponent } from './components/alarm/alarm.component';
import { ApplicabilityComponent } from './components/applicability/applicability.component';
import { ComponentInfoComponent } from './components/component-info/component-info.component';
import { DocPropertyComponent } from './components/property/components/doc-property/doc-property.component';
import { DropdownItemsComponent } from './components/dropdown-items/dropdown-items.component';
import { FindAndReplaceComponent } from './components/find-and-replace/find-and-replace.component';
import { FormbuildComponent } from './formbuild/formbuild.component';
import { HeaderfooterComponent } from './components/headerfooter/headerfooter.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LinkAssetsComponent } from './components/link-assets/link-assets.component';
import { PropertyComponent } from './components/property/property.component';
import { RoleQualComponent } from './components/role-qual/role-qual.component';
import { RuleInfoComponent } from './components/property/components/rule-info/rule-info.component';
import { RulesComponent } from './components/rules/rules.component';
import { SelectTemplateComponent } from './components/select-template/select-template.component';
import { SetupComponent } from './components/setup/setup.component';
import { SetupURLComponent } from './components/setup-url/setup-url.component';
import { ShowDgTypeComponent } from './components/property/components/show-dg-type/show-dg-type.component';
import { StylesComponent } from './components/styles/styles.component';
import { StyleToolbarComponent } from './components/styles/style-toolbar/style-toolbar.component';
import { TableaddComponent } from './components/table/tableadd/tableadd.component';
import { TablepropertiesComponent } from './components/table/tableproperties/tableproperties.component';
import { TableToolbarComponent } from './components/table/table-toolbar/table-toolbar.component';
import { DataSharingService } from './services/data-sharing.service';
import { DgSharedModule } from 'dg-shared';
import { IntialDataEntryPropComponent } from './components/property/components/intial-data-entry-prop/intial-data-entry-prop.component';
import { BasicPropertyComponent } from './components/property/components/basic-property/basic-property.component';
import { BasicSectionPropComponent } from './components/property/components/basic-section-prop/basic-section-prop.component';

import { VerificationComponentComponent } from './components/property/components/verification-component/verification-component.component';
import { DataEntryPropComponent } from './components/property/components/data-entry-prop/data-entry-prop.component';
import { TypeSteptypeNumComponent } from './components/property/components/type-steptype-num/type-steptype-num.component';
import { SectionVerificationPropertyComponent } from './components/property/components/section-verification-property/section-verification-property.component';
import { SectionHoldPropertiesComponent } from './components/property/components/section-hold-properties/section-hold-properties.component';
import { IsCriticalPropertyComponent } from './components/property/components/is-critical-property/is-critical-property.component';

import { NumericPropComponent } from './components/property/components/numeric-prop/numeric-prop.component';
import { DatePropComponent } from './components/property/components/date-prop/date-prop.component';
import { BooleanPropComponent } from './components/property/components/boolean-prop/boolean-prop.component';
import { CheckPropComponent } from './components/property/components/check-prop/check-prop.component';
import { FigurePropComponent } from './components/property/components/figure-prop/figure-prop.component';
import { TimedStepPropertiesComponent } from './components/property/components/timed-step-properties/timed-step-properties.component';
import { RepeatStepPropertiesComponent } from './components/property/components/repeat-step-properties/repeat-step-properties.component';
import { SignaturePropComponent } from './components/property/components/signature-prop/signature-prop.component';
import { EmbeddedPropertyComponent } from './components/property/components/embedded-property/embedded-property.component';
import { LinkPropComponent } from './components/property/components/link-prop/link-prop.component';
import { ProccedurePropComponent } from './components/property/components/proccedure-prop/proccedure-prop.component';
import { SectionPropertyComponent } from './components/property/components/section-property/section-property.component';
import { StepInfoPropertyComponent } from './components/property/components/step-info-property/step-info-property.component';
import { TablePropertiesComponent } from './components/property/components/table-properties/table-properties.component';
import { DateEditorPopupComponent } from './components/date-popup/date-popup.component';

let componets = [
  FormbuildComponent,
  ApplicabilityComponent,
  AlarmComponent,
  RulesComponent,
  SelectTemplateComponent,
  ActionComponent,
  LinkAssetsComponent,
  HighlightDirective,
  CtrlClickDirective,
  ComponentInfoComponent,
  DropdownItemsComponent,
  SetupURLComponent,
  StylesComponent,
  SetupComponent,
  FindAndReplaceComponent,
  RoleQualComponent,
  NumberDirective,
  LayoutComponent,
  TableaddComponent,
  TablepropertiesComponent,
  PropertyComponent,
  RuleInfoComponent,
  ShowDgTypeComponent,
  DocPropertyComponent,
  StyleToolbarComponent,
  TableToolbarComponent,
  HeaderfooterComponent,
  DocComponent,
  ShowlabelComponent,
  DgUniqueIdpropertyComponent,
  IntialDataEntryPropComponent,
  BasicPropertyComponent,
  BasicSectionPropComponent,
  VerificationComponentComponent,
  DataEntryPropComponent,
  TypeSteptypeNumComponent,
  SectionVerificationPropertyComponent,
  SectionHoldPropertiesComponent,
  IsCriticalPropertyComponent,
  NumericPropComponent,
  DatePropComponent,
  BooleanPropComponent,
  CheckPropComponent,
  FigurePropComponent,
  TimedStepPropertiesComponent,
  RepeatStepPropertiesComponent,
  SignaturePropComponent,
  EmbeddedPropertyComponent,
  LinkPropComponent,
  ProccedurePropComponent,
  SectionPropertyComponent,
  StepInfoPropertyComponent,
  TablePropertiesComponent,
  DateEditorPopupComponent,

];
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DynamicFormBuilderModule,
    HttpClientModule,
    DgSharedModule
  ],
  declarations: componets,
  exports: componets,
  providers: [DataSharingService]
})
export class BuilderModule { }
