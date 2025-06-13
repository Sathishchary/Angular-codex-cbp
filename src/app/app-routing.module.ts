import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EwpExecuterComponent } from './ewp-executer/ewp-executer.component';

const routes: Routes = [
  { path: 'executor/:id', component:  EwpExecuterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
