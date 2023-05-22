import { createElement, render } from '../render';
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

class TripEventsListView extends BaseView {
  constructor(tripEvents) {
    super();

    this.tripEvents = tripEvents || [];
    this.filterValue = null;

    const tripFiltersForm = document.querySelector('.trip-filters');
    tripFiltersForm.addEventListener('change', (evt) => this._onFilterFormChange(evt));
    this.filterValue = tripFiltersForm.querySelector('input[name="trip-filter"]:checked').value;
  }

  _onFilterFormChange(evt) {
    if (evt.target.name === 'trip-filter') {
      this.filterValue = evt.target.value;
      this.updateMessage();
    }
  }

  initList() {
    if (!this.isEmpty()) {
      this.tripEvents.forEach((component) => {
        this._appendComponent(component);
      });
    } else {
      this.updateMessage();
    }
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
      this.initList();
    }
    return this.element;
  }

  isEmpty() {
    return this.tripEvents.length === 0;
  }

  getTemplate() {
    if (this.isEmpty()) {
      return createMessageTemplate();
    } else {
      return createTripEventsListTemplate();
    }
  }

  updateMessage() {
    if (this.isEmpty()) {
      let newText = 'Click New Event to create your first point'; // default value
      if (this.filterValue === 'future') {
        newText = 'There are no future events now';
      } else if (this.filterValue === 'past') {
        newText = 'There are no past events now';
      }

      this.element.innerText = newText;
    }
  }

  addComponent(component) {
    // add new component to this View and show it
    this.tripEvents.push(component);
    if (this.isEmpty()) {
      this.element = null;
      this.getElement();
    } else {
      this._appendComponent(component);
    }
  }

  _appendComponent(component) {
    // makes this component visible on page
    const listElement = createElement(createElementWrapperTemplate());
    render(component, listElement);
    this.getElement().append(listElement);
  }
}

export default TripEventsListView;
