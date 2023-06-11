import { STATUS } from '../api-service/TripApiService';
import Observable from '../framework/observable';

export const TRIP_MODEL_EVENT = {
  INIT: 'INIT',
  REQUEST_SUCCESS: 'REQUEST_SUCCESS',
  REQUEST_ERROR: 'REQUEST_ERROR',
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
      // console.log(err);
    }
    // console.log(this.#tripEvents);

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

  async removeTripById(id) {
    const i = this.#getIndexOfTripById(id);
    if (i !== -1) {
      const result = await this.#tripApiService.deleteTripEventById(id);
      if (result.status !== STATUS.success) {

        this._notify(TRIP_MODEL_EVENT.REQUEST_ERROR, result.data);
        return false;
      }

      this.#tripEvents.splice(i, 1);
      this._notify(TRIP_MODEL_EVENT.REQUEST_SUCCESS, result.data);
      return true;
    }
    throw Error(`Incorrect trip id: ${id}`);
    // this._notify(TRIP_MODEL_EVENT.REQUEST_ERROR);
    // return false;
  }

  getTripById(id) {
    const i = this.#getIndexOfTripById(id);
    return this.#tripEvents[i];
  }

  async updateTrip(tripEventData) {
    const i = this.#getIndexOfTripById(tripEventData.id);
    if (i !== -1) {
      const result = await this.#tripApiService.updateTripEvent(tripEventData);
      if (result.status !== STATUS.success) {
        this._notify(TRIP_MODEL_EVENT.REQUEST_ERROR, result.data);
        return false;
      }

      this.#tripEvents[i] = {...this.#tripEvents[i], ...tripEventData};
      this._notify(TRIP_MODEL_EVENT.REQUEST_SUCCESS, result.data);
      return true;
    }
    throw Error(`Incorrect trip id: ${tripEventData.id}`);
    // this._notify(TRIP_MODEL_EVENT.REQUEST_ERROR);
    // return false;
  }

  async addTrip(tripEventData) {
    const result = await this.#tripApiService.addTripEvent(tripEventData);
    if (result.status !== STATUS.success) {
      this._notify(TRIP_MODEL_EVENT.REQUEST_ERROR, result.data);
      return false;
    }

    this.#tripEvents.push(result.data);
    this._notify(TRIP_MODEL_EVENT.REQUEST_SUCCESS, result.data);
    return true;
  }

  getNextId() {
    // generate new unique id for tripEvent - String(max of ids + 1)
    return String(this.#tripEvents.reduce((prevMax, {id}) => Math.max(prevMax, +id), 0) + 1);
  }
}
