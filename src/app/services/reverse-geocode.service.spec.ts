import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { LatLng } from 'leaflet';

import { ReverseGeocodeService } from './reverse-geocode.service';

describe('ReverseGeocodeService', () => {
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let service: ReverseGeocodeService;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: spy}],
    });
    httpSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    service = TestBed.inject(ReverseGeocodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make an http call', () => {
    service.reverseSearch({lat: 0, lng: 0} as LatLng);
    expect(httpSpy.get).toHaveBeenCalled();
  })
});
