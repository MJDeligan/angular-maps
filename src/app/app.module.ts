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
import { InputFieldComponent } from './components/base/input-field/input-field.component';
import { FormsModule } from '@angular/forms';
import { GeosearchInputComponent } from './components/geosearch-input/geosearch-input.component';
import { ResultListComponent } from './components/result-list/result-list.component';
import { MapComponent } from './components/map/map.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalComponent } from './components/base/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LocationSelectionMapComponent,
    MapViewComponent,
    MapViewPageComponent,
    MainPageComponent,
    LocationSelectionPageComponent,
    InputFieldComponent,
    GeosearchInputComponent,
    ResultListComponent,
    MapComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
