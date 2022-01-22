import { LatLng } from "leaflet";
import { ReverseGeocodeResult } from "./reverse-geocode-result";

export interface DetailedLocation {
    latlng: LatLng;
    info: ReverseGeocodeResult;
}
