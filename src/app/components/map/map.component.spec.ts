import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Marker } from 'leaflet';

import { MapComponent } from './map.component';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the leaflet map', () => {
    const map = fixture.debugElement.query(By.css('.leaflet-container'));
    expect(map).toBeTruthy();
  })

  it('should set a marker on the map', () => {
    let markerEl = fixture.debugElement.query(By.css('.leaflet-marker-icon'));
    expect(markerEl).toBeFalsy();

    const marker = new Marker({lat: 0, lng: 0});
    component.setMarker(marker);

    markerEl = fixture.debugElement.query(By.css('.leaflet-marker-icon'));
    expect(markerEl).toBeTruthy();
  });

  it('should set the map to the right dimensions', () => {
    component.width = '300px';
    component.height = '400px';

    fixture.detectChanges();
    const map = fixture.debugElement.query(By.css('.leaflet-container'));
    
    expect(map.styles['width']).withContext('Comparing width').toBe('300px');
    expect(map.styles['height']).withContext('Comparing height').toBe('400px');

    
  });

  it('should remove a marker from the map', () => {
    let el = fixture.debugElement.query(By.css('.leaflet-marker-icon'));
    expect(el).toBeFalsy();

    const marker = new Marker({lat: 0, lng: 0});
    component.setMarker(marker);
    component.removeMarker(marker);

    el = fixture.debugElement.query(By.css('.leaflet-marker-icon'));
  });
});
