import Observable from '../framework/observable';

export const TRIP_MODEL_EVENT = {
  INIT: 'init',
};

export default class TripEventsModel extends Observable {
  #tripApiService = null;
  #tripEvents = [];

  constructor(tripApiService) {
    super();
    this.#tripApiService = tripApiService;
  }

  init = async () => {
    try {
      this.#tripEvents = await this.#tripApiService.tripEvents;
    } catch(err) {
      this.#tripEvents = [];
      console.log(err);
    }
    console.log(this.#tripEvents);

    this._notify(TRIP_MODEL_EVENT.INIT);
  };

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

      this.#tripApiService.removeTripById(id);

      return true;
    }
    return false;
  }

  getTripById(id) {
    const i = this.#getIndexOfTripById(id);
    return this.#tripEvents[i];
  }

  updateTrip(tripEventData) {
    const i = this.#getIndexOfTripById(tripEventData.id);
    if (i !== -1) {
      this.#tripEvents[i] = {...this.#tripEvents[i], ...tripEventData};

      this.#tripApiService.updateTripEvent(tripEventData);
    }
  }

  addTrip(tripEventData) {
    this.#tripEvents.push(tripEventData);

    this.#tripApiService.addTripEvent(tripEventData);
  }

  getNextId() {
    // generate new unique id for tripEvent - String(max of ids + 1)
    return String(this.#tripEvents.reduce((prevMax, {id}) => Math.max(prevMax, +id), 0) + 1);
  }
}
