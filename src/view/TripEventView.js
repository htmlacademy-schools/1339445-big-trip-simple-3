import dayjs from 'dayjs';
import { capitalize } from '../utils';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

const createTripEventTemplate = (tripEventData, offerModel, destinationModel) => {
  const dateFrom = dayjs(tripEventData['date_from']);
  const dateTo = dayjs(tripEventData['date_to']);
  const destination = destinationModel.getDestinationById(tripEventData.destination);
  const offersByType = offerModel.getOffersByType(tripEventData.type);
  const activeOffers = offersByType.filter(({id}) => tripEventData.offers.includes(id));

  const getDateString = (date) => date.format('YYYY-MM-DD'); // Format to 'YYYY-MM-DD'
  const humanizeDayOfMonth = (date) => date.format('MMM D').toUpperCase(); // Format like 'MAR 3'
  const getDateTimeString = (date) => date.format('YYYY-MM-DDTHH:mm'); // Format to 'YYYY-MM-DDTHH:mm'
  const humanizeTime = (date) => date.format('HH:mm'); // Format to 'HH:mm'

  const getTripTypeIconSrc = () => `img/icons/${tripEventData.type}.png`;
  const getTripEventTitle = () => `${capitalize(tripEventData.type)} ${destination.name}`;
  const getTotalPrice = () => tripEventData['base_price'] +
    activeOffers.reduce((partialSum, {price}) => partialSum + price, 0);

  const listActiveOffers = () => {
    if (tripEventData.offers.length === 0) {
      return `
        <li class="event__offer">
          <span class="event__offer-title">No additional offers</span>
        </li>
      `;
    }
    const resultList = [];
    for (const offer of activeOffers) {
      resultList.push(`
        <li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </li>
      `);
    }
    return resultList.join('');
  };

  return `
    <div class="event">
      <time class="event__date" datetime="${getDateString(dateFrom)}">${humanizeDayOfMonth(dateFrom)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="${getTripTypeIconSrc()}" alt="Event type icon">
      </div>
      <h3 class="event__title">${getTripEventTitle()}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${getDateTimeString(dateFrom)}">${humanizeTime(dateFrom)}</time>
          &mdash;
          <time class="event__end-time" datetime="${getDateTimeString(dateTo)}">${humanizeTime(dateTo)}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${getTotalPrice()}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${listActiveOffers()}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  `;
};

class TripEventView extends AbstractStatefulView {
  _state = null;
  #offerModel = null;
  #destinationModel = null;

  constructor(tripEventData, offerModel, destinationModel) {
    super();
    this._state = tripEventData;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;
  }

  get template() {
    return createTripEventTemplate(this._state, this.#offerModel, this.#destinationModel);
  }

  #arrowClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.arrowClick();
  };

  setArrowClickHandler = (callback) => {
    this._callback.arrowClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#arrowClickHandler);
  };

  _restoreHandlers() {
    if (this._callback.arrowClick) {
      this.setArrowClickHandler(this._callback.arrowClick);
    }
  }
}

export default TripEventView;
