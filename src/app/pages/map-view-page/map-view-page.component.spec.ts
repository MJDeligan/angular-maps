import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LatLng } from 'leaflet';
import { InputFieldComponent } from 'src/app/components/base/input-field/input-field.component';
import { ModalComponent } from 'src/app/components/base/modal/modal.component';
import { GeosearchInputComponent } from 'src/app/components/geosearch-input/geosearch-input.component';
import { MapComponent } from 'src/app/components/map/map.component';
import { ResultListComponent } from 'src/app/components/result-list/result-list.component';
import { EventService } from 'src/app/services/event.service';
import { FormsModule } from '@angular/forms';

import { MapViewPageComponent } from './map-view-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MapViewPageComponent', () => {
  let component: MapViewPageComponent;
  let fixture: ComponentFixture<MapViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapViewPageComponent, MapComponent, ModalComponent, InputFieldComponent, GeosearchInputComponent ],
      providers: [{ provide: EventService, useValue: {
          getEvents: () => {
            return [{
              displayName: 'Event',
              description: 'An event',
              start: new Date(0),
              end: new Date(3600000),
              performer: {name: 'Artist'},
              position: {lat: 0, lng: 0} as LatLng
            }]
          }
        }
      }],
      imports: [ FormsModule ],
      schemas: [ NO_ERRORS_SCHEMA ] // Nested components are irrelevant
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly create a marker with popup after view is initialized', () => {

    const marker = fixture.debugElement.query(By.css('.leaflet-marker-icon'));
    expect(marker).toBeTruthy();

    marker.nativeElement.click();
    const popup = fixture.debugElement.query(By.css('.leaflet-popup'));
    expect(popup.nativeElement.textContent).toContain('An event');
  });

  it('should get the location when the locator button is pressed', () => {
    component.settingsModalOpen = true;
    fixture.detectChanges();

    const position: LatLng = {lat: 25, lng: 25} as LatLng;
    const fakePositionResult = {
      coords: {
        accuracy: 0,
        altitude: 0,
        altitudeAccuracy: 0,
        heading: 0,
        speed: 0,
        latitude: position.lat,
        longitude: position.lng
      },
      timestamp: (new Date(0)).getDate()
    }
    const fakeLocator = (success: PositionCallback, error: PositionErrorCallback) => { success(fakePositionResult) }
    const navigator = spyOn(window.navigator.geolocation, 'getCurrentPosition')
                        .and
                        .callFake(fakeLocator);
    
    const locatorButton = fixture.debugElement.query(By.css('#locator-btn'));
    locatorButton.nativeElement.click();
    fixture.detectChanges();

    expect(component.position).toEqual(position);
  });

  it('should correctly handle a change of settings', () => {

    const mapSpy = spyOn(component.map, 'centerView');
    const clearSpy = spyOn(component, 'removeMarkers');
    const markerSetSpy = spyOn(component, 'setMarkers');

    const newPosition: LatLng = {lat: 1, lng: 1} as LatLng;
    component.position = newPosition;

    component.handleSettingsConfirmed();

    expect(mapSpy)
      .withContext('View should have been centered on new position')
      .toHaveBeenCalledOnceWith(newPosition);

    expect(clearSpy)
      .withContext('Markers should be cleared')
      .toHaveBeenCalled();

    expect(markerSetSpy)
      .withContext('Markers should be set at new positions')
      .toHaveBeenCalled();
  });
});
