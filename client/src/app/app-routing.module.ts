import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LocationViewComponent }   from './location-view/location-view.component';

const routes: Routes = [
  { path: '', redirectTo: '/location', pathMatch: 'full' },
  { path: 'location', component: LocationViewComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}