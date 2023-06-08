import { FILTER_MODE, LIST_MODE } from '../const';
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
  #filterModel = null;

  constructor(listMode, filterModel) {
    super();
    this.#listMode = listMode;
    this.#filterModel = filterModel;
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
    const filterValue = this.#filterModel.getFilter();
    if (this.#listMode === LIST_MODE.EMPTY) {
      let newText = 'Click New Event to create your first point'; // default value
      if (filterValue === FILTER_MODE.FUTURE) {
        newText = 'There are no future events now';
      } else if (filterValue === FILTER_MODE.PAST) {
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
