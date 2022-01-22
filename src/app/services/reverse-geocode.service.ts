import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { LatLng } from 'leaflet';
import { ReverseGeocodeResult } from '../models/reverse-geocode-result';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReverseGeocodeService {

  private uri = 'https://nominatim.openstreetmap.org/reverse';
  private params = new HttpParams()
                    .set('zoom', '18')
                    .set('format', 'jsonv2'); // base params

  constructor(private httpclient: HttpClient) { }

  reverseSearch(latlng: LatLng): Observable<ReverseGeocodeResult> {
    const searchParams = this.params
                            .set('lat', latlng.lat.toString())
                            .set('lon', latlng.lng.toString());
    return this.httpclient.get(
      this.uri,
      {params: searchParams}
    ) as Observable<ReverseGeocodeResult>;
  }
}
