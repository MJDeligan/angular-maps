import { Injectable } from '@angular/core';
import { LatLng } from 'leaflet-geosearch/dist/providers/provider';
import { Performer } from '../models/performer';
import { StreetEvent } from '../models/street-event';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor() { }

  /**
   * Returns events in a radius around the location.
   * @param {LatLng} location The geographics point around which events are searched.
   * @param {number} radius The radius in degrees around the location in which to search events.
   * @param {number} limit The number of maximum events to be returned @default 25.
   * @returns a list of {@link StreetEvent StreetEvents}.
   */
  public getEvents(location: LatLng, radius: number, limit?: number) : StreetEvent[] {
    limit = limit ?? 25;

    let positions: LatLng[] = [];
    for (let i = 0; i < limit; i++) {
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

  /**
   * Calculates a random geo-point around a center geo-point in a given radius
   * 
   * Uses a simplified algorithm generating random points within a circle, which only approximates 
   * a true geographical radius.
   * @param center The point to generate new points around.
   * @param radius The radius (in degrees) in which points will be generated.
   * @returns A randomly generated point (as {@link LatLng})
   */
  private getRandomPositionInRadius(center: LatLng, radius: number) : LatLng {
    // points near the center are closer together, bias random radius towards outside
    let randomDistance = Math.sqrt(Math.random()) * radius;
    let randomAngle = Math.random() * 2 * Math.PI; // random angle in circle
    let lat = center.lat + (Math.cos(randomAngle) * randomDistance);
    let lng = center.lng + (Math.sin(randomAngle) * randomDistance);
    return {lat, lng};
  }
}
