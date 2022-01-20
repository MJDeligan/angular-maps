import { LatLng } from "leaflet";
import { Performer } from "./performer";

export interface StreetEvent {
    displayName: string;
    start: Date;
    end: Date;
    description: string;
    performer: Performer;
    position: LatLng;
}
