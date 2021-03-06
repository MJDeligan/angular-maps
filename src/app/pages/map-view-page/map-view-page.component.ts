import { AfterViewInit, Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Marker, Popup, LatLng } from 'leaflet';
import { MapComponent } from 'src/app/components/map/map.component';
import { GeoSearchResult } from 'src/app/models/geo-search-result';
import { StreetEvent } from 'src/app/models/street-event';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-map-view-page',
  templateUrl: './map-view-page.component.html',
  styleUrls: ['./map-view-page.component.scss']
})
export class MapViewPageComponent implements AfterViewInit, OnInit {

  events: StreetEvent[] = [];
  markers: Marker[] = [];
  menuActive = false;
  infoModalOpen = false;
  settingsModalOpen = false;
  position: LatLng = {lat: 48.1995, lng: 16.370809} as LatLng;
  eventAmount = 25;
  minAmount = 5;
  maxAmount = 50;
  @ViewChild(MapComponent) map!: MapComponent;

  constructor(private eventService: EventService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.events = this.eventService.getEvents(this.position, 0.025);
  }

  ngAfterViewInit(): void {
    this.setMarkers();
  }

  setMarkers() {
    this.events.forEach((event: StreetEvent) => {
      const marker = this.createMarkerFromEvent(event);
      this.map.setMarker(marker);
      this.markers.push(marker);
    });
  }

  removeMarkers() {
    this.markers.forEach((marker: Marker) => {
      this.map.removeMarker(marker);
    });
    this.markers = [];
  }

  handleGeoSearchResult(result: GeoSearchResult) {
    this.position = {lat: result.y, lng: result.x} as LatLng;
  }

  getLocation() {
    if (window.navigator?.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (pos: GeolocationPosition) => { this.position = {lat: pos.coords.latitude, lng: pos.coords.longitude} as LatLng;},
        (err: GeolocationPositionError) => { console.error(err) }
      );
    }
  }

  handleSettingsConfirmed() {
    this.settingsModalOpen = false;
    this.removeMarkers();
    this.events = this.eventService.getEvents(this.position, 0.025, this.eventAmount);
    this.setMarkers();
    this.map.centerView(this.position);
  }

  private createMarkerFromEvent(event: StreetEvent): Marker {
    const icon = this.map.defaultIcon;
    const marker = new Marker(
      [event.position.lat, event.position.lng],
      {
        icon
      }
    );
    // TODO: Replace hard-coded popup text with custom component
    const sanitizedTitle = this.sanitize(event.displayName);
    const sanitizedName = this.sanitize(event.performer.name);
    const sanitizedDescription = this.sanitize(event.description);
    const start = new Date(event.start);
    const end = new Date(event.end);
    const startString = this.formatTime(start);
    const endString = this.formatTime(end);
    const popup = new Popup({minWidth: 200, maxWidth: 300, offset: [0, -30]})
                    .setContent(
                      `<div class="d-flex" style="display: flex;">
                        <b>${sanitizedTitle}</b>
                        <small class="ml-auto" style="margin-left: auto;">${this.mapDayOfWeek(start.getDay())}. ${startString}-${endString}</small>
                      </div>
                      <div class="mt-1" style="margin-top: -4px;">
                        <small>by <i>${sanitizedName}</i></small>
                      </div>
                      <div class="mt-3" style="margin-top: 3px;">${sanitizedDescription}</div>`
                    );
    marker.bindPopup(popup);
    marker.on('click', () => marker.openPopup());
    return marker;
  }

  sanitize(unsafe: string) {
    const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, unsafe)
    return sanitized == null ? null : this.escapeHTML(sanitized);
  }

  // https://stackoverflow.com/questions/38577347/manually-sanitize-a-string
  // by user acdcjunior
  escapeHTML(unsafe: string) {
    return unsafe.replace(/</g, '&lt;').replace(/>/g, '&gt;')
                 .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  mapDayOfWeek(dayOfWeek: number) {
    const days = ['Sun', 'Mon', 'Tue','Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayOfWeek];
  }

  formatTime(date: Date) {
    const hours = date.getHours() >= 10 ? date.getHours().toString() : '0' + date.getHours();
    const minutes = date.getMinutes() >= 10 ? date.getMinutes().toString() : '0' + date.getMinutes();
    return `${hours}:${minutes}`;
  }

  // private getLocation() {
  //   if (window.navigator && window.navigator.geolocation) {
  //     window.navigator.geolocation.getCurrentPosition((pos) => {
  //       this.map.centerView(pos.coords.latitude, pos.coords.longitude);
  //     })
  //   }
  // }

  handleLocationResult(result: GeoSearchResult) {
    this.map.centerView({lat:result.y, lng: result.x} as LatLng);
  }

}
