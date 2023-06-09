import Observable from '../framework/observable';

export const DESTINATION_MODEL_EVENT = {
  INIT: 'init',
};

export default class DestinationModel extends Observable {
  #destinationApiService = null;
  #destinations = [];

  constructor(destinationApiService) {
    super();
    this.#destinationApiService = destinationApiService;
  }

  init = async () => {
    try {
      this.#destinations = await this.#destinationApiService.destinations;
    } catch(err) {
      this.#destinations = [];
      // console.log(err);
    }
    // console.log(this.#destinations);

    this._notify(DESTINATION_MODEL_EVENT.INIT);
  };

  get destinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    for (const destination of this.#destinations) {
      if (id === destination.id) {
        return destination;
      }
    }
    throw Error(`Cannot find destination with id: ${id}`);
  }

  getNextId() {
    // generate new unique id for destination (max of ids + 1)
    return this.#destinations.reduce((prevMax, {id}) => Math.max(prevMax, id)) + 1;
  }
}
