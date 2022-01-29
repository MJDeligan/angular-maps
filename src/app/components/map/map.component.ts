import { Component, AfterViewInit, Input, ViewChild, ElementRef, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Map, TileLayer, Marker, Icon, LeafletMouseEvent, LatLng, Control} from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnChanges {

  @Output() locationResult: EventEmitter<LatLng> = new EventEmitter();

  @Input() width? = '350px';
  @Input() height? = '217px';
  @Input() latitude? = 48.1995;
  @Input() longitude? = 16.370809;
  @Input() initialZoom? = 16;

  @ViewChild('map') private mapRef!: ElementRef;


  public frozen = false;
  private mapContainer!: HTMLElement;
  private map!: Map;
  private maxZoom = 18;
  private searchControl!: Control;

  constructor() { }

  get defaultIcon(): Icon {
    return new Icon({
      iconSize: [ 25, 41 ],
      iconAnchor: [ 13, 41 ],
      iconUrl: 'assets/svgs/markers/marker.svg',
      shadowUrl: 'assets/marker-shadow.png'
    });
  }

  /**
   * Centers the map view on the currently selected coordinates.
   */
  centerView(latlng: LatLng, zoom?: number): void;

  centerView(latlng: LatLng, zoom: number): void {
    zoom = zoom ?? this.initialZoom;
    this.map.setView(latlng, zoom);
  }

  /**
   * Invalidates the size of the map. This is needed when the dimensions of the map container change to
   * adjust the map itself.
   */
  resetSize() {
    this.map.invalidateSize();
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
    this.map.addControl(this.searchControl);
    const zoomControl = new Control.Zoom();
    this.map.addControl(zoomControl);
    this.map.zoomControl = zoomControl;
  }


  setMarker(marker: Marker): Marker {
    marker.addTo(this.map);
    return marker;
  }

  setMarkerFromIcon(point: LatLng, icon?: Icon): Marker {
    icon = icon ?? this.defaultIcon;
    const newMarker = new Marker(
      [point.lat, point.lng],
      {icon}
    );
    newMarker.addTo(this.map);
    return newMarker;
  }

  removeMarker(marker: Marker) {
    marker.removeFrom(this.map);
  }

  addControl(control: Control) {
    control.addTo(this.map);
  }

  ngAfterViewInit() {
    this.setupMap();
  }

  public clearMap() {
    this.map.eachLayer((layer) => {
      if (layer instanceof Marker) {
        layer.removeFrom(this.map);
      }
    });
  }

  private handleClick(e: LeafletMouseEvent) {
    this.locationResult.emit(e.latlng);
  }

  private setupMap(): void {
    this.mapContainer = this.mapRef.nativeElement;

    this.map = new Map(this.mapContainer);
    this.map.setView([this.latitude!, this.longitude!], this.initialZoom);

    const osmTileLayer = new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    maxZoom: this.maxZoom,
      minZoom: 4,
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    osmTileLayer.addTo(this.map);

    this.map.on('click', (e: LeafletMouseEvent) => this.handleClick(e));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map) {
      if (changes.width || changes.height) {
        setTimeout(() => this.map.invalidateSize());
      }
    }
  }


}
