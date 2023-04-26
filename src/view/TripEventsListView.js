import { createElement, render } from '../render';
import BaseView from './BaseView';

const createTripEventsListTemplate = () => `
  <ul class="trip-events__list"></ul>
`;

const createElementWrapperTemplate = () => `
  <li class="trip-events__item"></li>
`;

class TripEventsListView extends BaseView {
  getTemplate() {
    return createTripEventsListTemplate();
  }

  addComponent(component) {
    const listElement = createElement(createElementWrapperTemplate());
    render(component, listElement);
    this.getElement().append(listElement);
  }
}

export default TripEventsListView;
