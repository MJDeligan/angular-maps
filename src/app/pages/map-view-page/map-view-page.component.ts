import { Component, OnInit } from '@angular/core';
import { StreetEvent } from 'src/app/models/street-event';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-map-view-page',
  templateUrl: './map-view-page.component.html',
  styleUrls: ['./map-view-page.component.scss']
})
export class MapViewPageComponent implements OnInit {

  events: StreetEvent[] = [];

  constructor(private eventService: EventService) { }
  ngOnInit(): void {
    this.events = this.eventService.getEvents({lng: 16.370809, lat: 48.1995}, 0.025);
  }

}
