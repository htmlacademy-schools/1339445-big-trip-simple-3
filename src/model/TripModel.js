import { generateTripEvents } from '../mock/trip-event';

export default class TripEventsModel {
  #tripEvents = generateTripEvents(2);

  get tripEvents() {
    return this.#tripEvents;
  }
}
