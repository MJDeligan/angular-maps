import { trigger, transition, style, animate } from '@angular/animations';
import {  AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import { Control, LatLng, Marker, Popup } from 'leaflet';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import { MapComponent } from 'src/app/components/map/map.component';
import { DetailedLocation } from 'src/app/models/detailed-location';
import { ReverseGeocodeResult } from 'src/app/models/reverse-geocode-result';
import { ReverseGeocodeService } from 'src/app/services/reverse-geocode.service';

@Component({
  selector: 'app-location-selection-page',
  templateUrl: './location-selection-page.component.html',
  styleUrls: ['./location-selection-page.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({opacity: 0}),
          animate('500ms', style({opacity: 1}))
        ]),
        transition(':leave', [
          style({opacity: 1}),
          animate('500ms', style({opacity: 0}))
        ])
      ]
    )
  ],
})
export class LocationSelectionPageComponent implements AfterViewInit {

  _showTip = false;
  _text = 'Click on the map or use the search bar';
  private searchControl!: Control;
  private marker!: Marker;
  @ViewChild(MapComponent) map!: MapComponent;

  constructor(private reverseGeocodeService: ReverseGeocodeService) { }

  @HostListener('window:resize')
  onResize() {
    this.map.resetSize();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this._showTip = true, 1000);
    this.setupGeoSearchController();
  }

  private setupGeoSearchController(): void {
    const provider = new OpenStreetMapProvider();
    const searchControl = GeoSearchControl({
      provider,
      style: 'bar',
      marker: {
        icon: this.map.defaultIcon,
        draggable: false
      },
      searchLabel: 'Search address'
    });
    this.searchControl = searchControl;
    this.map.addControl(this.searchControl)
  }

  handleLocation(latlng: LatLng) {
    if (this.marker) this.map.removeMarker(this.marker);
    this.marker = new Marker(latlng, {icon: this.map.defaultIcon});
    this.reverseGeocodeService.reverseSearch(latlng).subscribe(
      (res: ReverseGeocodeResult) => {
        this.map.setMarker(this.marker);
        this.handleLocationResult({latlng, info: res})
      }
    );
  }

  private handleLocationResult(detailedLocation: DetailedLocation) {
    let address = this.buildAddress(detailedLocation);
    
    const popUp = new Popup({minWidth: 200, maxWidth: 300, offset: [0, -30], closeOnClick: false})
                      .setContent(address);
    this.marker.bindPopup(popUp);
    this.marker.openPopup();
  }


  private buildAddress(detailedLocation: DetailedLocation) {
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
    if (detailedLocation.info.address.country)
      address += ', ' + detailedLocation.info.address.country;
    return address;
  }
}
