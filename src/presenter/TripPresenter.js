import { render } from '../framework/render';
import TripEventsListView from '../view/TripEventsListView';
import TripEventsSortingView from '../view/TripEventsSortingView';
import TripEventView from '../view/TripEventView';

class TripPresenter {
  init(container, tripModel) {
    this.container = container;
    this.tripModel = tripModel;
    this.tripEventsData = tripModel.getTripEvents();
    // console.log('Trip Events: ', this.tripEventsData); // Debug information

    const tripEvents = this.tripEventsData.map((tripData) => new TripEventView(tripData));
    this.tripListComponent = new TripEventsListView(tripEvents);

    render(new TripEventsSortingView(), this.container);
    render(this.tripListComponent, this.container);
  }
}

export default TripPresenter;
