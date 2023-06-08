import { FILTER_MODE } from '../const';
import Observable from '../framework/observable';

export default class FilterModel extends Observable {
  // TODO Observable - make tripList change if filter value changed
  #filter = FILTER_MODE.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  set filter(value) {
    if (!Object.values(FILTER_MODE).includes(value)) {
      throw Error(`Unknow filter value: ${value}`);
    }
    this.#filter = value;
    this._notify();
  }

  updateFilter(value) {
    this.filter = value;
  }

  getFilter() {
    return this.filter;
  }
}
