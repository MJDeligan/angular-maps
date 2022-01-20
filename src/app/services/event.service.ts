import { Injectable } from '@angular/core';
import { LatLng } from 'leaflet-geosearch/dist/providers/provider';
import { Performer } from '../models/performer';
import { StreetEvent } from '../models/street-event';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor() { }

  public getEvents(location: LatLng, radius: number, max?: number) : StreetEvent[] {
    max = max ?? 25;

    let positions: LatLng[] = [];
    for (let i = 0; i < max; i++) {
      positions.push(this.getRandomPositionInRadius(location, radius));
    }

    let events: StreetEvent[] = positions.map((p, i) => {
      return {
        displayName: `Event-${i}`,
        start: new Date(),
        end: new Date(Date.now() + Math.trunc(3 * 3600 * 1000 * Math.random())),
        description: `This is the description of Event-${i}`,
        performer: {
          name: `Artist-${i}`
        } as Performer,
        position: p
      } as StreetEvent
    });
    
    return events;
  }

  private getRandomPositionInRadius(center: LatLng, radius: number) : LatLng {
    let lat = center.lat + (Math.random() - 0.5) * radius * 2;
    let lng = center.lng + (Math.random() - 0.5) * radius * 2;
    return {lat, lng};
  }
}
