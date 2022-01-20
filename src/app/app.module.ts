import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { LocationSelectionMapComponent } from './components/location-selection-map/location-selection-map.component';
import { MapViewComponent } from './components/map-view/map-view.component';

@NgModule({
  declarations: [
    AppComponent,
    // LocationSelectionMapComponent,
    MapViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
