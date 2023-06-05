import { render } from '../framework/render';
import FiltersView from '../view/FiltersView';
import TripEventPresenter from './TripEventPresenter';

export default class MainPresenter {
  _container = null;
  _filterContainer = null;
  _tripModel = null;

  _tripEventPresenter = null;

  _filtersView = null;

  init(container, filterContainer, tripModel) {
    this._container = container;
    this._filterContainer = filterContainer;
    this._tripModel = tripModel;
    console.log('Trip Events: ', this._tripModel.tripEvents); // Debug information

    this._filtersView = new FiltersView();
    render(this._filtersView, this._filterContainer);

    this._tripEventPresenter = new TripEventPresenter(this._container, this._tripModel);
    this._tripEventPresenter.init(this._filtersView, this._sortingView);
  }
}
