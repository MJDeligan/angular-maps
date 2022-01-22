import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LocationSelectionMapComponent } from './components/location-selection-map/location-selection-map.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { MapViewPageComponent } from './pages/map-view-page/map-view-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { HttpClientModule } from '@angular/common/http';
import { LocationSelectionPageComponent } from './pages/location-selection-page/location-selection-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LocationSelectionMapComponent,
    MapViewComponent,
    MapViewPageComponent,
    MainPageComponent,
    LocationSelectionPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
