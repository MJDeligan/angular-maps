import {
  Component,
  AfterViewInit,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  SecurityContext,
  HostListener,
} from '@angular/core';
import { Map, TileLayer, Marker, LayerGroup, Icon, Popup } from 'leaflet';
import { DomSanitizer } from '@angular/platform-browser';
import { StreetEvent } from 'src/app/models/street-event';

/**
 * A component that display a map with icons representing events.
 *
 * @inputs
 * @property {[StreetEvent]} events? (default: []) - The events to display as markers on the map.
 * @property {boolean} infoPopUps? (default: true) - Whether to include popup boxes with the markers.
 * @property {number} latitude? (default: 48.1995) - The latitude of where the map is initially centered.
 * @property {number} longitude? (default: 16.370809) - The longitude of where the map is initially centered.
 * @property {number} initialZoom? (default: 16) - How much the map is initially zoomed in.
 * @property {string} width? (default: null) - The width of the map, if null 400px.
 * @property {string} height? (default: null) - The height of the map, if null 300px.
 *
 */
@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements AfterViewInit, OnChanges {

  @Input() longitude?: number = 16.370809;
  @Input() latitude?: number = 48.1995;
  @Input() initialZoom?: number = 16;
  @Input() events?: Array<StreetEvent> = [];
  @Input() infoPopUps?: boolean = true;
  @Input() width?: string;
  @Input() height?: string;
  @ViewChild('mapContainer') mapRef!: ElementRef;

  private mapContainer!: HTMLElement;
  private map!: Map;
  private maxZoom = 18;
  private markerGroup!: LayerGroup<Marker>;


  constructor(private sanitizer: DomSanitizer) { }

  @HostListener('window:resize')
  onResize() {
    this.map.invalidateSize();
  }

  get baseIcon(): Icon {
    return new Icon({
            iconSize: [ 25, 40 ],
            iconAnchor: [13, 40],
            iconUrl: 'assets/svgs/markers/marker.svg',
            shadowUrl: 'assets/marker-shadow.png'
          });
  }


  setupMap(): void {
    this.mapContainer = this.mapRef.nativeElement;

    this.map = new Map(this.mapContainer);
    this.map.setView([this.latitude!, this.longitude!], this.initialZoom);

    const osmTileLayer = new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    maxZoom: this.maxZoom,
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    osmTileLayer.addTo(this.map);
  }


  setUpAllMarkers(): void {
    const markers = this.events!.map((e: StreetEvent) => this.setUpMarkerFromEvent(e));
    this.markerGroup = new LayerGroup(markers);
    this.drawMarkers(this.markerGroup);
  }


  setUpMarkerFromEvent(event: StreetEvent): Marker {
    const icon = this.baseIcon;
    const marker = new Marker(
      [event.position.lat, event.position.lng],
      {
        icon
      }
    );
    if (this.infoPopUps) {
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
    }
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


  drawMarkers(markerGroup: LayerGroup<Marker>): void {
    this.map.addLayer(markerGroup);
  }


  removeMarkers(markerGroup: LayerGroup<Marker>): void {
    this.map.removeLayer(markerGroup);
  }


  centerView(latitude: number, longitude: number) {
    this.map.setView([latitude, longitude], this.initialZoom, {animate: true});
  }

  ngAfterViewInit(): void {
    this.setupMap();
    this.setUpAllMarkers();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (this.map) {
      // Only center view if either coordinate has changed and map is defined
      if (changes.latitude || changes.longitude) {
          this.centerView(this.latitude!, this.longitude!);
      }
      if (changes.events) {
        this.removeMarkers(this.markerGroup);
        this.setUpAllMarkers();
      }
      if (changes.width || changes.height) {
        setTimeout(() => this.map.invalidateSize());
      }
    }
  }

}
