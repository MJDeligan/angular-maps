import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LatLng } from 'leaflet';
import { ngMocks } from 'ng-mocks';
import { of } from 'rxjs';
import { MapComponent } from 'src/app/components/map/map.component';
import { ReverseGeocodeResult } from 'src/app/models/reverse-geocode-result';
import { ReverseGeocodeService } from 'src/app/services/reverse-geocode.service';

import { LocationSelectionPageComponent } from './location-selection-page.component';

describe('LocationSelectionPageComponent', () => {
  let reverseGeoCodeServiceSpy: jasmine.SpyObj<ReverseGeocodeService>;
  let component: LocationSelectionPageComponent;
  let fixture: ComponentFixture<LocationSelectionPageComponent>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ReverseGeoCodeService', ['reverseSearch']);

    await TestBed.configureTestingModule({
      declarations: [ LocationSelectionPageComponent, MapComponent ],
      providers: [{ provide: ReverseGeocodeService, useValue: spy }],
    })
    .compileComponents();

    reverseGeoCodeServiceSpy = TestBed.inject(ReverseGeocodeService) as jasmine.SpyObj<ReverseGeocodeService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSelectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call handler for output', () => {
    const map = ngMocks.findInstance(MapComponent);
    ngMocks.stubMember(
      component,
      'handleLocation',
      jasmine.createSpy()
    );

    const testPoint: LatLng = {lat: 0, lng: 0} as LatLng;
    map.locationResult.emit(testPoint);

    expect(component.handleLocation).toHaveBeenCalledWith(testPoint);
  });

  it('should call reverse search when handling location', () => {

    reverseGeoCodeServiceSpy.reverseSearch.and.returnValue(of(
      {
        display_name: '',
        name: '',
        address: {
            houseNumber: 0,
            road: '',
            suburb: '',
            city: '',
            county: '',
            state: '',
            postcode: 0,
            country: '',
            countryCode: '',
            town: ''
        }   
    } as ReverseGeocodeResult));

    const testPoint: LatLng = {lat: 0, lng: 0} as LatLng;
    component.handleLocation(testPoint);

    expect(reverseGeoCodeServiceSpy.reverseSearch).toHaveBeenCalledWith(testPoint);
  });

  it('should put a popup with text when handling location', () => {
    const msg = 'Hello World';

    reverseGeoCodeServiceSpy.reverseSearch.and.returnValue(of({} as ReverseGeocodeResult)); // value doesn't matter

    // @ts-ignore - Private but we just need some text to check if it's inserted.
    ngMocks.stubMember(component, 'buildAddress', () => msg);

    component.handleLocation({lat: 0, lng: 0} as LatLng);
    fixture.detectChanges();

    const popup = fixture.debugElement.query(By.css('.leaflet-popup'));

    expect(popup).toBeTruthy();
    expect(popup.nativeElement.textContent).toContain(msg);
  
  });

});
