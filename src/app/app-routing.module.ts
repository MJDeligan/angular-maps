import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationSelectionPageComponent } from './pages/location-selection-page/location-selection-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { MapViewPageComponent } from './pages/map-view-page/map-view-page.component';

const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'map-view', component: MapViewPageComponent},
  {path: 'location-selection', component: LocationSelectionPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule],
  providers: [{provide: APP_BASE_HREF, useValue : '/' }]
})
export class AppRoutingModule { }
