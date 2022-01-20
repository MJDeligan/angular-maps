import { Performer } from "./performer";

export interface StreetEvent {
    displayName: string;
    date: Date;
    description: string;
    performer: Performer;
}
