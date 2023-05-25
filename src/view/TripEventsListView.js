import { createElement, render } from '../framework/render';
import AbstractView from '../framework/view/abstract-view';
import BaseView from './BaseView';

const createTripEventsListTemplate = () => `
  <ul class="trip-events__list"></ul>
`;

const createElementWrapperTemplate = () => `
  <li class="trip-events__item"></li>
`;

const createMessageTemplate = () => `
  <p class="trip-events__msg">Click New Event to create your first point</p>
`;

class TripEventsListView extends AbstractView {
  #tripFiltersForm = document.querySelector('.trip-filters');
  _filterValue = this.#tripFiltersForm.querySelector('input[name="trip-filter"]:checked').value;

  constructor(tripEvents) {
    super();
    this.tripEvents = tripEvents || [];

    this.setFiltersFormChangeHandler((evt) => {
      if (evt.target.name === 'trip-filter') {
        this.filterValue = evt.target.value;
        this.updateMessage();
      }
    });
  }

  #filtersFormHandler = (evt) => {
    evt.preventDefault();
    this._callback.filtersFormChange(evt);
  };

  setFiltersFormChangeHandler = (callback) => {
    this._callback.filtersFormChange = callback;
    this.#tripFiltersForm.addEventListener('change', this.#filtersFormHandler);
  };

  initList() {
    if (!this.isEmpty()) {
      this.tripEvents.forEach((component) => {
        this._appendComponent(component);
      });
    } else {
      this.updateMessage();
    }
  }

  isEmpty() {
    return this.tripEvents.length === 0;
  }

  get template() {
    if (this.isEmpty()) {
      return createMessageTemplate();
    } else {
      return createTripEventsListTemplate();
    }
  }

  afterCreateElement() {
    this.initList();
  }

  updateMessage() {
    if (this.isEmpty()) {
      let newText = 'Click New Event to create your first point'; // default value
      if (this._filterValue === 'future') {
        newText = 'There are no future events now';
      } else if (this._filterValue === 'past') {
        newText = 'There are no past events now';
      }

      this.element.innerText = newText;
    }
  }

  addComponent(component) {
    // add new component to this View and show it
    this.tripEvents.push(component);
    if (this.isEmpty()) {
      this.removeElement();
      this.element;
    } else {
      this._appendComponent(component);
    }
  }

  _appendComponent(component) {
    // makes this component visible on page
    const listElement = createElement(createElementWrapperTemplate());
    render(component, listElement);
    this.element.append(listElement);
  }
}

export default TripEventsListView;
