import { RenderPosition, remove, render, replace } from '../framework/render';
import TripEventsListView from '../view/TripEventsListView';
import TripEventsSortingView from '../view/TripEventsSortingView';
import { LIST_MODE, FORM_MODE, SORTING_BY, FILTER_MODE } from '../const';
import TripEventsFormView from '../view/TripEventsFormView';
import TripEventView from '../view/TripEventView';

export default class TripEventsPresenter {
  #container = null;
  #tripModel = null;

  #tripEventsList = null;
  #filterModel = null;
  #sortingView = null;
  #formView = null;

  #listMode = null;
  #sortingType = SORTING_BY.DAY;

  #activeTripEvent = null;
  #activeTripEventId = null;


  init(container, tripModel, filterModel) {
    this.#container = container;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;

    this.#sortingView = new TripEventsSortingView();
    this.#sortingView.setSortingFormChangeHandler((evt) => this.#sortingChangeHandler(evt));
    this.#sortingView.setCurrentSortingType(this.#sortingType);
    render(this.#sortingView, this.#container);

    this.#createEventsList();
    render(this.#tripEventsList, this.#container);
    this.#filterModel.addObserver(this.#onFilterChangeCallback);

    this.#formView = new TripEventsFormView();
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        this.#closeForm();
      }
    });

    const addTripEventButton = document.querySelector('.trip-main__event-add-btn');
    addTripEventButton.addEventListener('click', () => this.#addTripEventButtonClickHandler());
  }

  #addTripEventButtonClickHandler() {
    this.#closeForm();
    this.#formView.setMode(FORM_MODE.NEW);
    this.#formView.createBlankForm();
    this.#applyFormHandlers();
    render(this.#formView, this.#tripEventsList.element, RenderPosition.BEFOREBEGIN);
    this.#restoreSortingAndFilters();
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
  }

  _updateListMode(tripEventsDataArray) {
    if (tripEventsDataArray.length === 0) {
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
    } else if (this.#listMode === LIST_MODE.EMPTY) {
      this.#tripEventsList.updateMessage();
    }
  }

  #onFilterChangeCallback = () => {
    this.#sortingType = SORTING_BY.DAY;
    this.#sortingView.setCurrentSortingType(this.#sortingType);
    this.#recreateEventsList();
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

  #getTripEventsWithSorting() {
    let comparingFunction;
    switch (this.#sortingType) {
      case SORTING_BY.DAY:
      // case SORTING_BY.TIME: // the same sorting for TIME
        comparingFunction = (a, b) => {
          const dateFromResult = this.#compareISODate(a.date_from, b.date_from);
          if (dateFromResult === 0) {
            const dateToResult = this.#compareISODate(a.date_to, b.date_to);
            return dateToResult;
          }
          return dateFromResult;
        };
        break;
      case SORTING_BY.PRICE:
        comparingFunction = (a, b) => -(a.base_price - b.base_price);
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
          return tripEventData.date_from > currentDate;
        };
        break;
      case FILTER_MODE.PAST: // not implemented
        filterFunction = (tripEventData) => {
          const currentDate = new Date().toISOString();
          return tripEventData.date_to < currentDate;
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
    if (this.#listMode.EMPTY) {
      // now this.#listMode is not EMPTY, so we need to recreate list
      this.#recreateEventsList();
    }
    const tripEvent = this.#createNewTripEvent(tripEventData);
    this.#tripEventsList.append(tripEvent);
  }

  #createNewTripEvent(tripEventData) {
    const tripEvent = new TripEventView(tripEventData);

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

  #deleteActiveTripEvent() {
    this.#tripModel.removeTripById(this.#activeTripEventId);
    this.#activeTripEvent = null;
    this.#activeTripEventId = null;

    this.#formView.element.parentElement.remove();
    this.#formView.removeElement();
  }

  #applyFormHandlers() {
    if (this.#formView.mode === FORM_MODE.NEW) {
      this.#formView.setFormSubmitHandler(() => {
        const newTripEventData = this.#formView.getState();
        this.#tripModel.addTrip(newTripEventData);
        this.#closeForm();
        this.#recreateEventsList();
      });
      this.#formView.setCancelButtonClickHandler(() => this.#closeForm());
    } else { // if (this._mode === FormMode.EDIT)
      this.#formView.setFormSubmitHandler(() => {
        const newTripEventData = this.#formView.getState();
        this.#tripModel.updateTrip(newTripEventData);
        this.#activeTripEvent.updateElement(newTripEventData);
        this.#closeForm();
      });
      this.#formView.setCancelButtonClickHandler(() => this.#deleteActiveTripEvent());
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
