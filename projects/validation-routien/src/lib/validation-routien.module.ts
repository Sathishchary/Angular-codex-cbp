import { NgModule } from '@angular/core';
import { ValidateService } from './validate.service';
import { ValidationRoutienComponent } from './validation-routien.component';
import { Validation } from './_utils/validation';




@NgModule({
  declarations: [
    ValidationRoutienComponent
  ],
  imports: [
  ],
  exports: [
    ValidationRoutienComponent,
  ],
  providers: [ValidateService, Validation]
})
export class ValidationRoutienModule { }
