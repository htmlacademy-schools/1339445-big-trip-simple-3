import { remove, render, replace } from '../framework/render';
import TripEventsListView from '../view/TripEventsListView';
import TripEventsSortingView from '../view/TripEventsSortingView';
import { LIST_MODE, FORM_MODE, SORTING_BY } from '../const';
import TripEventsFormView from '../view/TripEventsFormView';
import TripEventView from '../view/TripEventView';

export default class TripEventsPresenter {
  #container = null;
  #tripModel = null;

  #tripEventsList = null;
  #filterView = null;
  #sortingView = null;
  #formView = null;

  #listMode = null;
  #sortingType = SORTING_BY.DAY;

  #activeTripEvent = null;
  #activeTripEventId = null;

  constructor(container, tripModel) {
    this.#container = container;
    this.#tripModel = tripModel;
  }

  init(filterView) {
    this.#filterView = filterView;

    this.#sortingView = new TripEventsSortingView();
    this.#sortingView.setSortingFormChangeHandler((evt) => this.#sortingChangeHandler(evt));
    render(this.#sortingView, this.#container);

    this.#createEventsList();
    render(this.#tripEventsList, this.#container);

    this.#formView = new TripEventsFormView();
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        this.#closeForm();
      }
    });
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

  _updateListMode() {
    if (this.#tripModel.tripEvents.length === 0) {
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
    this._updateListMode();
    this.#tripEventsList = new TripEventsListView(this.#listMode, this.#filterView);
    this.#applyListHandlers();
    if (this.#listMode === LIST_MODE.DEFAULT) {
      for (const tripEventData of this.#getTripEventsWithSorting()) {
        this.#displayNewTripEvent(tripEventData);
      }
    }
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
    return this.#tripModel.tripEvents.toSorted(comparingFunction);

  }

  #applyListHandlers() {
    this.#tripEventsList.setFiltersFormChangeHandler((evt) => {
      if (evt.target.name === 'trip-filter') {
        this.#tripEventsList.setFilterValue(evt.target.value);
        if (this.#listMode === LIST_MODE.EMPTY) {
          this.#tripEventsList.updateMessage();
        }
      }
    });
  }

  addTripEvent(tripEventData) {
    // add new tripEvent to tripEventsList and show it
    this.#tripModel.push(tripEventData);
    if (this.#listMode.EMPTY) {
      // now this.#listMode is not EMPTY, so we need to recreate list
      this.#recreateEventsList();
    }
    this.#displayNewTripEvent(tripEventData);
  }

  #displayNewTripEvent(tripEventData) {
    const tripEvent = new TripEventView(tripEventData);
    this.#tripEventsList.append(tripEvent);

    tripEvent.setArrowClickHandler(() => {
      // console.log('clicked');
      this.#closeForm();
      this.#formView.updateElement(tripEventData);
      this.#formView.setMode(FORM_MODE.EDIT);
      replace(this.#formView, tripEvent);
      this.#activeTripEvent = tripEvent;
      this.#activeTripEventId = tripEventData.id;
      this.#applyFormHandlers();
    });
  }

  #deleteActiveTripEvent() {
    this.#tripModel.removeTripById(this.#activeTripEventId);
    this.#activeTripEvent = null;
    this.#activeTripEventId = null;

    this.#formView.element.parentElement.remove();
    this.#formView.removeElement();
  }

  #applyFormHandlers() {
    this.#formView.setFormSubmitHandler(() => console.log('submit'));
    if (this.#formView.mode === FORM_MODE.NEW) {
      this.#formView.setCancelButtonClickHandler(() => this.#closeForm());
    } else { // if (this._mode === FormMode.EDIT)
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
