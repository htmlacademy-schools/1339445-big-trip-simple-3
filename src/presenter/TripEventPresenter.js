export default class TripEventPresenter {
  #tripEventsList = null;

  #tripEvent = null;
  #tripMode =

  constructor(tripEventsList) {
    this.#tripEventsList = tripEventsList;
  }

  init(tripEvent) {
    this.#tripEvent = tripEvent;
  }
}
