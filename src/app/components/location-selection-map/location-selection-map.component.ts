import { Component, AfterViewInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Map, TileLayer, Marker, Icon, LeafletMouseEvent, LatLng, Control, Popup } from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

/**
 * Displays a map with a searchbar. Uses geocoding to find
 * coordinates from addresses and reverse geocoding to find
 * addresses for coordinates depending on how the user inputs
 * the location.
 *
 * @inputs
 * @property {string} width? (default="350px") - The width of the map. (Can be any css-unit)
 * @property {string} height? (default="217px") - The height of the map. (golden ratio)
 * @property {number} latitude? (default: 48.1995) - The latitude of where the map is initially centered.
 * @property {number} longitude? (default: 16.370809) - The longitude of where the map is initially centered.
 *
 * @outputs
 * @property {DetailedLocation} locationResult - Is emitted when 'confirmed' is true, returns the selected location info.
 *
 */
@Component({
  selector: 'app-location-selection-map',
  templateUrl: './location-selection-map.component.html',
  styleUrls: ['./location-selection-map.component.scss']
})
export class LocationSelectionMapComponent implements AfterViewInit {

  @Output() locationResult: EventEmitter<LatLng> = new EventEmitter();

  @Input() width? = '350px';
  @Input() height? = '217px';
  @Input() latitude? = 48.1995;
  @Input() longitude? = 16.370809;

  @ViewChild('map') private mapRef!: ElementRef;


  public frozen = false;
  private mapContainer!: HTMLElement;
  private map!: Map;
  private maxZoom = 18;
  private marker!: Marker;
  private latlng!: LatLng;
  private searchControl!: Control;

  constructor() { }

  /**
   * Centers the map view on the currently selected coordinates.
   */
  centerOnMarker() {
    this.map.setView(this.latlng, 16);
  }

  /**
   * Disables all controls on the map.
   */
  freeze() {
    this.map.scrollWheelZoom.disable();
    this.map.touchZoom.disable();
    this.map.doubleClickZoom.disable();
    this.map.dragging.disable();
    this.map.boxZoom.disable();
    this.map.keyboard.disable();
    this.map.removeEventListener('click');
    this.map.removeEventListener('geosearch/showlocation');
    this.map.zoomControl.remove();
    this.map.removeControl(this.searchControl);
  }

  /**
   * Reenables all controls on the map.
   */
  unfreeze() {
    this.frozen = false;
    this.map.scrollWheelZoom.enable();
    this.map.touchZoom.enable();
    this.map.doubleClickZoom.enable();
    this.map.dragging.enable();
    this.map.boxZoom.enable();
    this.map.keyboard.enable();
    this.map.on('click', (e: LeafletMouseEvent) => this.handleClick(e));
    this.map.on('geosearch/showlocation', (e) => this.handleGeoSearch(e));
    this.map.addControl(this.searchControl);
    const zoomControl = new Control.Zoom();
    this.map.addControl(zoomControl);
    this.map.zoomControl = zoomControl;
  }

  setMarker(point: LatLng) {
    this.clearMap();
    this.latlng = new LatLng(point.lat, point.lng);
    const newMarker = new Marker(
      [point.lat, point.lng],
      {
        icon: this.defaultIcon
      }
    );
    this.marker = newMarker;
    newMarker.addTo(this.map);
  }

  popup(text: string) {
    if (!this.marker) return;
    const pop = new Popup({minWidth: 200, maxWidth: 300, offset: [0, -30]})
                      .setContent(text);
    this.marker.bindPopup(pop);
    this.marker.openPopup();
  }

  ngAfterViewInit() {
    this.setupMap();
    this.setupGeoSearchController();
  }

  get defaultIcon(): Icon {
    return new Icon({
      iconSize: [ 25, 41 ],
      iconAnchor: [ 13, 41 ],
      iconUrl: 'assets/svgs/markers/marker.svg',
      shadowUrl: 'assets/marker-shadow.png'
    });
  }

  private clearMap() {
    this.map.eachLayer((layer) => {
      if (layer instanceof Marker) {
        layer.removeFrom(this.map);
      }
    });
  }

  private setMarkerFromClick(e: LeafletMouseEvent) {
    this.clearMap();
    const icon = this.defaultIcon;
    const newMarker = new Marker(
      e.latlng,
      {icon}
    );
    this.marker = newMarker;
    newMarker.addTo(this.map);
  }

  private handleClick(e: LeafletMouseEvent) {
    this.setMarkerFromClick(e);
    this.latlng = e.latlng;
    this.locationResult.emit(this.latlng);
  }

  private handleGeoSearch(e: any) {
    if (this.marker) {
      this.marker.removeFrom(this.map);
    }
    this.latlng = new LatLng(e.location!.y, e.location!.x);
    this.setMarker(this.latlng);
    this.locationResult.emit(this.latlng);
  }

  private setupGeoSearchController(): void {
    const provider = new OpenStreetMapProvider();
    const searchControl = GeoSearchControl({
      provider,
      style: 'bar',
      marker: {
        icon: this.defaultIcon,
        draggable: false
      },
      searchLabel: 'Search address'
    });
    this.searchControl = searchControl;
    searchControl.addTo(this.map);
  }

  private setupMap(): void {
    this.mapContainer = this.mapRef.nativeElement;

    this.map = new Map(this.mapContainer);
    this.map.setView([this.latitude!, this.longitude!], 16);

    const osmTileLayer = new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    maxZoom: this.maxZoom,
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    osmTileLayer.addTo(this.map);

    this.map.on('click', (e: LeafletMouseEvent) => this.handleClick(e));
    this.map.on('geosearch/showlocation', (e) => this.handleGeoSearch(e));
  }


}