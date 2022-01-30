import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LatLng } from 'leaflet';
import { MapComponent } from 'src/app/components/map/map.component';
import { EventService } from 'src/app/services/event.service';

import { MapViewPageComponent } from './map-view-page.component';

describe('MapViewPageComponent', () => {
  let component: MapViewPageComponent;
  let fixture: ComponentFixture<MapViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapViewPageComponent, MapComponent ],
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
      }]}
    )
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
});
