import { render } from '../framework/render';
import FiltersView from '../view/FiltersView';
import TripEventsListView from '../view/TripEventsListView';
import TripEventsSortingView from '../view/TripEventsSortingView';
import TripEventView from '../view/TripEventView';
import TripEventPresenter from './TripEventPresenter';

export default class MainPresenter {
  _container = null;
  _filterContainer = null;
  _tripModel = null;

  _tripEventPresenter = null;

  _filtersView = null;
  _sortingView = null;

  init(container, filterContainer, tripModel) {
    this._container = container;
    this._filterContainer = filterContainer;
    this._tripModel = tripModel;
    // console.log('Trip Events: ', this.#tripModel.tripEvents); // Debug information

    this._filtersView = new FiltersView()
    render(this._filtersView, this._filterContainer);

    this._sortingView = new TripEventsSortingView();
    render(this._sortingView, this._container);

    this._tripEventPresenter = new TripEventPresenter(this._container, this._tripModel);
    this._tripEventPresenter.init(this._filtersView);
  }
}
