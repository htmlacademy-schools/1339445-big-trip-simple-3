import { generateTripEvents } from '../mock/trip-event';

export default class TripEventsModel {
  #tripEvents = generateTripEvents(2);

  get tripEvents() {
    return this.#tripEvents;
  }

  #getIndexOfTripById(id) {
    for (let i = 0; i < this.#tripEvents.length; ++i) {
      if (this.#tripEvents[i].id === id) {
        return i;
      }
    }
    return -1;
  }

  removeTripById(id) {
    const i = this.#getIndexOfTripById(id);
    if (i !== -1) {
      this.#tripEvents.splice(i, 1);
      return true;
    }
    return false;
  }

  getTripById(id) {
    const i = this.#getIndexOfTripById(id);
    return this.#tripEvents[i];
  }

  updateTrip(tripEventData) {
    const id = tripEventData.id;
    const i = this.#getIndexOfTripById(id);
    this.#tripEvents[i] = {...this.#tripEvents[i], ...tripEventData};
  }

  addTrip(tripEventData) {
    this.#tripEvents.push(tripEventData);
  }
}
