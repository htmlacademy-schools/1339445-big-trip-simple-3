import { remove, render, replace } from '../framework/render';
import TripEventsListView from '../view/TripEventsListView';
import { LIST_MODE, FORM_MODE } from '../const';
import TripEventsFormView from '../view/TripEventsFormView';
import TripEventView from '../view/TripEventView';

export default class TripEventsPresenter {
  #container = null;
  #tripModel = null;

  #tripEventsList = null;
  #filterView = null;
  #formView = null;

  #listMode = null;

  #activeTripEvent = null;

  constructor(container, tripModel) {
    this.#container = container;
    this.#tripModel = tripModel;
  }

  init(filterView) {
    this.#filterView = filterView;
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
    this._updateListMode();
    this.#tripEventsList = new TripEventsListView(this.#listMode, this.#filterView);
    this.#applyListHandlers();
    if (this.#listMode === LIST_MODE.DEFAULT) {
      for (const tripEventData of this.#tripModel.tripEvents) {
        this.#displayNewTripEvent(tripEventData);
      }
    }
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
      this._updateListMode();
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
      this.#formView.updateData(tripEventData, tripEvent);
      replace(this.#formView, tripEvent);
      this.#activeTripEvent = tripEvent;
      this.#applyFormHandlers();
    });
  }

  #deleteActiveTripEvent() {
    this.#formView.element.parentElement.remove();
    this.#formView.removeElement();
    this.#activeTripEvent = null;

    // TODO also delete from model
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
}
