import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

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
});
