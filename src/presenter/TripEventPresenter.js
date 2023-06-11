import { RenderPosition, remove, render, replace } from '../framework/render';
import TripEventsListView from '../view/TripEventsListView';
import TripEventsSortingView from '../view/TripEventsSortingView';
import { LIST_MODE, FORM_MODE, SORTING_BY, FILTER_MODE, FORM_STATUS } from '../const';
import TripEventsFormView from '../view/TripEventsFormView';
import TripEventView from '../view/TripEventView';
import { TRIP_MODEL_EVENT } from '../model/TripModel';
import { OFFER_MODEL_EVENT } from '../model/OfferModel';
import { DESTINATION_MODEL_EVENT } from '../model/DestinationModel';
import UiBlocker from '../framework/ui-blocker/ui-blocker';

export default class TripEventsPresenter {
  #container = null;
  #tripModel = null;
  #filterModel = null;
  #offerModel = null;
  #destinationModel = null;

  #tripEventsList = null;
  #sortingView = null;
  #formView = null;

  #listMode = LIST_MODE.LOADING;
  #sortingType = SORTING_BY.DAY;

  #activeTripEvent = null;
  #activeTripEventId = null;

  #addTripEventButton = null;

  #initState = {
    tripModel: false,
    offerModel: false,
    destinationModel: false,
  };

  #uiBlocker = new UiBlocker(300, 1500);


  init(container, tripModel, filterModel, offerModel, destinationModel) {
    this.#container = container;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;

    this.#sortingView = new TripEventsSortingView();
    this.#sortingView.setSortingFormChangeHandler((evt) => this.#sortingChangeHandler(evt));
    this.#sortingView.setCurrentSortingType(this.#sortingType);
    render(this.#sortingView, this.#container);

    this.#createEventsList();
    render(this.#tripEventsList, this.#container);
    this.#filterModel.addObserver(this.#onFilterChangeCallback);

    this.#formView = new TripEventsFormView(this.#offerModel, this.#destinationModel);
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        this.#closeForm();
      }
    });

    this.#tripModel.addObserver(this.#onTripModelCallback);
    this.#offerModel.addObserver(this.#onOfferModelCallback);
    this.#destinationModel.addObserver(this.#onDestinationModelCallback);

    this.#addTripEventButton = document.querySelector('.trip-main__event-add-btn');
    this.#addTripEventButton.addEventListener('click', () => this.#addTripEventButtonClickHandler());
  }

  #addTripEventButtonClickHandler() {
    this.#closeForm();
    this.#formView.setMode(FORM_MODE.NEW);
    this.#formView.createBlankForm(this.#tripModel);
    this.#applyFormHandlers();
    render(this.#formView, this.#tripEventsList.element, RenderPosition.BEFOREBEGIN);
    this.#restoreSortingAndFilters();
    this.#addTripEventButton.setAttribute('disabled', '');
  }

  #closeForm() {
    if (this.#formView.isActive()) {
      if (this.#activeTripEvent !== null) {
        replace(this.#activeTripEvent, this.#formView);
        this.#formView.removeElement();
        this.#activeTripEvent = null;
        this.#activeTripEventId = null;
      } else {
        remove(this.#formView);
      }
    }
    this.#addTripEventButton.removeAttribute('disabled');
  }

  _updateListMode(tripEventsDataArray) {
    if (!this.#isAllModelsInited()) {
      this.#listMode = LIST_MODE.LOADING;
    } else if (tripEventsDataArray.length === 0) {
      this.#listMode = LIST_MODE.EMPTY;
    } else {
      this.#listMode = LIST_MODE.DEFAULT;
    }
  }

  #recreateEventsList() {
    // replace old list with new
    const lastListComponent = this.#tripEventsList;
    this.#createEventsList();
    replace(this.#tripEventsList, lastListComponent);
  }

  #createEventsList() {
    // create events list and fill it
    // console.log('create new list'); // debug information
    const tripEventsDataArray = this.#getTripEventsWithSorting();
    this._updateListMode(tripEventsDataArray);
    this.#tripEventsList = new TripEventsListView(this.#listMode, this.#filterModel);
    if (this.#listMode === LIST_MODE.DEFAULT) {
      for (const tripEventData of tripEventsDataArray) {
        const tripEvent = this.#createNewTripEvent(tripEventData);
        this.#tripEventsList.append(tripEvent);
      }
    } else if (this.#listMode === LIST_MODE.EMPTY || this.#listMode === LIST_MODE.LOADING) {
      this.#tripEventsList.updateMessage();
    }
  }

  #onFilterChangeCallback = () => {
    this.#sortingType = SORTING_BY.DAY;
    this.#sortingView.setCurrentSortingType(this.#sortingType);
    this.#recreateEventsList();
  };

  #isAllModelsInited() {
    return Object.values(this.#initState).every((status) => status);
  }

  #onTripModelCallback = (event) => {
    // console.log(`trip model callback: ${ event}`);
    if (event === TRIP_MODEL_EVENT.INIT) {
      this.#initState.tripModel = true;
      if (this.#isAllModelsInited()) {
        this.#recreateEventsList();
      }

    } else if (event === TRIP_MODEL_EVENT.REQUEST_SUCCESS) {
      const formStatus = this.#formView.status;
      this.#formView.unlock();

      if (formStatus === FORM_STATUS.SAVING) {
        if (this.#formView.mode === FORM_MODE.NEW) {
          this.#addActiveTripEvent();
        } else {
          this.#updateActiveTripEvent();
        }
      } else if (formStatus === FORM_STATUS.DELETING) {
        this.#deleteActiveTripEvent();
      }

      this.#uiBlocker.unblock();

    } else if (event === TRIP_MODEL_EVENT.REQUEST_ERROR) {
      this.#formView.unlock();
      this.#formView.shake();

      this.#uiBlocker.unblock();
    }
  };

  #onOfferModelCallback = (event) => {
    if (event === OFFER_MODEL_EVENT.INIT) {
      this.#initState.offerModel = true;
      if (this.#isAllModelsInited()) {
        this.#recreateEventsList();
      }
    }
  };

  #onDestinationModelCallback = (event) => {
    if (event === DESTINATION_MODEL_EVENT.INIT) {
      this.#initState.destinationModel = true;
      if (this.#isAllModelsInited()) {
        this.#recreateEventsList();
      }
    }
  };

  #restoreSortingAndFilters() {
    this.#sortingType = SORTING_BY.DAY;
    this.#sortingView.setCurrentSortingType(this.#sortingType);
    this.#filterModel.updateFilter(FILTER_MODE.EVERYTHING);
    this.#recreateEventsList();
  }

  #compareISODate(firstDate, secondDate) {
    if (firstDate > secondDate) {
      return 1;
    }
    if (firstDate < secondDate) {
      return -1;
    }
    return 0;
  }

  #getTotalPriceOfTripEvent(tripEventData) {
    const offersByType = this.#offerModel.getOffersByType(tripEventData.type);
    const activeOffers = offersByType.filter(({id}) => tripEventData.offers.includes(id));
    return tripEventData['base_price'] +
      activeOffers.reduce((partialSum, {price}) => partialSum + price, 0);
  }

  #getTripEventsWithSorting() {
    let comparingFunction;
    switch (this.#sortingType) {
      case SORTING_BY.DAY:
      // case SORTING_BY.TIME: // the same sorting for TIME
        comparingFunction = (a, b) => {
          const dateFromResult = this.#compareISODate(a['date_from'], b['date_from']);
          if (dateFromResult === 0) {
            const dateToResult = this.#compareISODate(a['date_to'], b['date_to']);
            return dateToResult;
          }
          return dateFromResult;
        };
        break;
      case SORTING_BY.PRICE:
        comparingFunction = (a, b) => -(
          this.#getTotalPriceOfTripEvent(a) - this.#getTotalPriceOfTripEvent(b)
        );
        break;
      default:
        throw Error(`Unknown sorting type: "${this.#sortingType}"`);
    }

    let filterFunction;
    switch (this.#filterModel.getFilter()) {
      case FILTER_MODE.EVERYTHING:
        filterFunction = () => true;
        break;
      case FILTER_MODE.FUTURE:
        filterFunction = (tripEventData) => {
          const currentDate = new Date().toISOString();
          return tripEventData['date_from'] > currentDate;
        };
        break;
      case FILTER_MODE.PAST: // not implemented
        filterFunction = (tripEventData) => {
          const currentDate = new Date().toISOString();
          return tripEventData['date_to'] < currentDate;
        };
        break;
      default:
        throw Error(`Unknown filter type: "${this.#filterModel.getFilter()}"`);
    }

    const tripEventsDataArray = this.#tripModel.tripEvents.filter(filterFunction);
    return tripEventsDataArray.toSorted(comparingFunction);

  }

  addTripEvent(tripEventData) {
    // add new tripEvent to tripEventsList and show it
    this.#tripModel.addTrip(tripEventData);
    if (this.#listMode === LIST_MODE.EMPTY || this.#listMode === LIST_MODE.LOADING) {
      // now this.#listMode is not EMPTY, so we need to recreate list
      this.#recreateEventsList();
    }
    const tripEvent = this.#createNewTripEvent(tripEventData);
    this.#tripEventsList.append(tripEvent);
  }

  #createNewTripEvent(tripEventData) {
    const tripEvent = new TripEventView(tripEventData, this.#offerModel, this.#destinationModel);

    tripEvent.setArrowClickHandler(() => {
      // console.log('clicked');
      this.#closeForm();
      this.#activeTripEvent = tripEvent;
      this.#activeTripEventId = tripEventData.id;
      this.#formView.setMode(FORM_MODE.EDIT);
      this.#formView.updateElement(this.#tripModel.getTripById(this.#activeTripEventId));
      replace(this.#formView, tripEvent);
      this.#applyFormHandlers();
    });

    return tripEvent;
  }

  #startDeletingActiveTripEvent() {
    this.#uiBlocker.block();
    this.#formView.makeDeleting();
    this.#tripModel.removeTripById(this.#activeTripEventId);
  }

  #startUpdatingActiveTripEvent() {
    this.#uiBlocker.block();
    this.#formView.makeSaving();
    const newTripEventData = this.#formView.getState();
    this.#tripModel.updateTrip(newTripEventData);
  }

  #updateActiveTripEvent() {
    const newTripEventData = this.#formView.getState();
    this.#activeTripEvent.updateElement(newTripEventData);
    this.#closeForm();
  }

  #startAddingActiveTripEvent() {
    this.#uiBlocker.block();
    this.#formView.makeSaving();
    const newTripEventData = this.#formView.getState();
    this.#tripModel.addTrip(newTripEventData);
  }

  #addActiveTripEvent() {
    this.#closeForm();
    this.#recreateEventsList();
  }

  #deleteActiveTripEvent() {
    // console.log('deleting complete');
    this.#activeTripEvent = null;
    this.#activeTripEventId = null;

    this.#formView.element.parentElement.remove();
    this.#formView.removeElement();
  }

  #applyFormHandlers() {
    // console.log('form mode: ' + this.#formView.mode);
    if (this.#formView.mode === FORM_MODE.NEW) {
      this.#formView.setFormSubmitHandler(() => this.#startAddingActiveTripEvent());
      this.#formView.setCancelButtonClickHandler(() => this.#closeForm());
    } else { // if (this._mode === FormMode.EDIT)
      this.#formView.setFormSubmitHandler(() => this.#startUpdatingActiveTripEvent());
      this.#formView.setCancelButtonClickHandler(() => this.#startDeletingActiveTripEvent());
      this.#formView.setArrowClickHandler(() => this.#closeForm());
    }
  }

  #sortingChangeHandler(evt) {
    if (evt.target.name === 'trip-sort') {
      const newSortingType = evt.target.value;

      // debug checking
      if (!Object.values(SORTING_BY).includes(newSortingType)) {
        throw Error(`Unknown sorting type: "${newSortingType}"`);
      }

      if (newSortingType !== this.#sortingType) {
        this.#sortingType = newSortingType;
        this.#recreateEventsList();
      }
    }
  }
}
