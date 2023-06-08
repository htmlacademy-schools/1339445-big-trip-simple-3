import TripEventPresenter from './TripEventPresenter';

export default class MainPresenter {
  _container = null;
  #tripModel = null;
  #filterModel = null;

  _tripEventPresenter = null;

  init(container, tripModel, filterModel) {
    this._container = container;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
    // console.log('Trip Events: ', this._tripModel.tripEvents); // Debug information

    this._tripEventPresenter = new TripEventPresenter();
    this._tripEventPresenter.init(this._container, this.#tripModel, this.#filterModel);
  }
}
