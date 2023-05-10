import { generateTripEvents } from '../mock/trip-event';

export default class TripEventsModel {
  tripEvents = generateTripEvents(4);

  getTripEvents = () => this.tripEvents;
}
