import Observable from '../framework/observable';

export const OFFER_MODEL_EVENT = {
  INIT: 'init',
};

export default class OfferModel extends Observable {
  #offerApiService = null;
  #offers = [];

  constructor(offerApiService) {
    super();
    this.#offerApiService = offerApiService;
  }

  init = async () => {
    try {
      this.#offers = await this.#offerApiService.offers;
    } catch(err) {
      this.#offers = [];
      // console.log(err);
    }
    // console.log(this.#offers);

    this._notify(OFFER_MODEL_EVENT.INIT);
  };

  get offers() {
    return this.#offers;
  }

  getOffersByType(offerType) {
    for (const {type, offers} of this.#offers) {
      if (offerType === type) {
        return offers;
      }
    }
    throw Error(`Unknown offer type: ${offerType}`);
  }

  static getOfferById(offers, id) {
    // offers - Array<Offer> with current type
    for (const offer of offers) {
      if (id === offer.id) {
        return offer;
      }
    }
    throw Error(`Cannot find offer with id: ${id}`);
  }

  getTypes() {
    return this.#offers.map((offer) => offer.type);
  }
}
