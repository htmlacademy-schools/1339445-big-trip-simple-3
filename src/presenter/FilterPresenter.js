import { render } from '../framework/render';
import FiltersView from '../view/FiltersView';

export default class FilterPresenter {
  _container = null;
  #filterModel = null;

  #filterView = null;

  init(container, filterModel) {
    this._container = container;
    this.#filterModel = filterModel;

    this.#filterView = new FiltersView();
    this.#setFilterHandlers();
    render(this.#filterView, this._container);

    this.#filterModel.addObserver(this.#onFilterChangeCallback);
  }

  #setFilterHandlers() {
    this.#filterView.setFilterChangeHandler((evt) => {
      if (evt.target.name === 'trip-filter') {
        this.#filterModel.updateFilter(evt.target.value);
      }
    });
  }

  #onFilterChangeCallback = () => {
    const newFilterValue = this.#filterModel.getFilter();
    this.#filterView.element.querySelector(`input[value=${newFilterValue}]`).checked = true;
  };
}
