import { generateTripEvents } from '../mock/trip-event';

export default class TripEventsModel {
  tripEvents = generateTripEvents(0);

  getTripEvents = () => this.tripEvents;
}
