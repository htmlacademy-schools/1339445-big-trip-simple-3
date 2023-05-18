import {createElement} from '../render.js';

class BaseView {
  constructor() {
    this.element = null;
  }

  getTemplate() {
    throw new Error('Not Implemented');
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }

  isActive() {
    return this.element && this.element.isConnected
  }
}

export default BaseView;
