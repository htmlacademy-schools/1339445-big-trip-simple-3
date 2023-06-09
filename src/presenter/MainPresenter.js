import TripEventPresenter from './TripEventPresenter';

export default class MainPresenter {
  _container = null;
  #tripModel = null;
  #filterModel = null;
  #offerModel = null;
  #destinationModel = null;

  _tripEventPresenter = null;

  init(container, tripModel, filterModel, offerModel, destinationModel) {
    this._container = container;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;
    // console.log('Trip Events: ', this._tripModel.tripEvents); // Debug information

    this._tripEventPresenter = new TripEventPresenter();
    this._tripEventPresenter.init(
      this._container,
      this.#tripModel,
      this.#filterModel,
      this.#offerModel,
      this.#destinationModel
    );
  }
}
