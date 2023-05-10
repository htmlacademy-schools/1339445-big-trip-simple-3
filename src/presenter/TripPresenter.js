import { render } from '../render';
import TripEventsListView from '../view/TripEventsListView';
import TripEventsSortingView from '../view/TripEventsSortingView';
import TripEventsFormView from '../view/TripEventsFormView';
import TripEventView from '../view/TripEventView';

class TripPresenter {
  tripListComponent = new TripEventsListView();

  init(container, tripModel) {
    this.container = container;
    this.tripModel = tripModel;
    this.tripEvents = tripModel.getTripEvents();
    console.log('Trip Events: ', this.tripEvents);

    render(new TripEventsSortingView(), this.container);
    render(this.tripListComponent, this.container);
    this.tripListComponent.addComponent(new TripEventsFormView(this.tripEvents[0]));

    for (let i = 1; i < this.tripEvents.length; i++) {
      const tripEvent = this.tripEvents[i];
      this.tripListComponent.addComponent(new TripEventView(tripEvent));
    }
  }
}

export default TripPresenter;
