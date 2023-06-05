import { generateTripEvents } from '../mock/trip-event';

export default class TripEventsModel {
  #tripEvents = generateTripEvents(2);

  get tripEvents() {
    return this.#tripEvents;
  }

  removeTripById(id) {
    for (let i = 0; i < this.#tripEvents.length; ++i) {
      if (this.#tripEvents[i].id === id) { // if found 'i' to remove
        this.#tripEvents.splice(i, 1);
        return true;
      }
    }
    return false;
  }
}
