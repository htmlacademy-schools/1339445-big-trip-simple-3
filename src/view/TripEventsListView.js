import { LIST_MODE } from '../const';
import { createElement, render } from '../framework/render';
import AbstractView from '../framework/view/abstract-view';

const createTripEventsListTemplate = () => `
  <ul class="trip-events__list"></ul>
`;

const createElementWrapperTemplate = () => `
  <li class="trip-events__item"></li>
`;

const createMessageTemplate = () => `
  <p class="trip-events__msg">Click New Event to create your first point</p>
`;

export default class TripEventsListView extends AbstractView {
  #listMode = null;
  #filterView = null;

  #filterValue = null;

  constructor(listMode, filterView) {
    super();
    this.#listMode = listMode;
    this.#filterView = filterView;

    this.#filterValue = this.#filterView.element.querySelector('input[name="trip-filter"]:checked').value;
  }

  #filtersFormHandler = (evt) => {
    evt.preventDefault();
    this._callback.filtersFormChange(evt);
  };

  setFiltersFormChangeHandler = (callback) => {
    this._callback.filtersFormChange = callback;
    this.#filterView.element.addEventListener('change', this.#filtersFormHandler);
  };

  setFilterValue(filterValue) {
    this.#filterValue = filterValue;
  }

  get template() {
    if (this.#listMode === LIST_MODE.EMPTY) {
      return createMessageTemplate();
    } else {
      return createTripEventsListTemplate();
    }
  }

  updateMessage() {
    // set message text if tripList is empty
    if (this.#listMode === LIST_MODE.EMPTY) {
      let newText = 'Click New Event to create your first point'; // default value
      if (this.#filterValue === 'future') {
        newText = 'There are no future events now';
      } else if (this.#filterValue === 'past') {
        newText = 'There are no past events now';
      }

      this.element.innerText = newText;
    }
  }

  append(component) {
    // makes this component visible on page
    const listElement = createElement(createElementWrapperTemplate());
    render(component, listElement);
    this.element.append(listElement);
  }
}
