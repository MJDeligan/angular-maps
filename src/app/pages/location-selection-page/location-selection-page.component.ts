import { Component, OnInit, ViewChild } from '@angular/core';
import { LatLng } from 'leaflet';
import { LocationSelectionMapComponent } from 'src/app/components/location-selection-map/location-selection-map.component';
import { DetailedLocation } from 'src/app/models/detailed-location';
import { ReverseGeocodeResult } from 'src/app/models/reverse-geocode-result';
import { ReverseGeocodeService } from 'src/app/services/reverse-geocode.service';

@Component({
  selector: 'app-location-selection-page',
  templateUrl: './location-selection-page.component.html',
  styleUrls: ['./location-selection-page.component.scss']
})
export class LocationSelectionPageComponent implements OnInit {

  text = 'Click on the map or use the search bar';
  @ViewChild(LocationSelectionMapComponent) locationC!: LocationSelectionMapComponent;

  constructor(private reverseGeocodeService: ReverseGeocodeService) { }

  ngOnInit(): void {
  }

  handleLocation(latlng: LatLng) {
    this.reverseGeocodeService.reverseSearch(latlng).subscribe(
      (res: ReverseGeocodeResult) => {
        this.handleLocationResult({latlng, info: res})}
    );
  }

  private handleLocationResult(detailedLocation: DetailedLocation) {
    let address = '';
    if (detailedLocation.info.address.road) {
      address += detailedLocation.info.address.road;
      const housenumber = detailedLocation.info.display_name.match(/\d+/);
      if (housenumber && housenumber[0]) {
        address += ' ' + housenumber[0];
      }
    } else if (detailedLocation.info.address.suburb) {
      address += detailedLocation.info.address.suburb;
    } else {
      address += detailedLocation.info.display_name;
    }
    if (detailedLocation.info.address.city) {
      address += ', ' + detailedLocation.info.address.city;
    } else if (detailedLocation.info.address.town) {
      address += ', ' + detailedLocation.info.address.town;
    } else if (detailedLocation.info.address.state) {
      address += ', ' + detailedLocation.info.address.state;
    }
    if (detailedLocation.info.address.country) address += ', ' + detailedLocation.info.address.country;
    this.locationC.popup(address);
  }

}
