import { render } from '../render';
import TripEventsListView from '../view/TripEventsListView';
import TripEventsSortingView from '../view/TripEventsSortingView';
import TripEventsFormView from '../view/TripEventsFormView';
import TripEvent from '../view/TripEvent';

class TripPresenter {
  tripListComponent = new TripEventsListView();

  init(container) {
    this.container = container;

    render(new TripEventsSortingView(), this.container);
    render(this.tripListComponent, this.container);
    this.tripListComponent.addComponent(new TripEventsFormView());

    for (let i = 0; i < 3; i++) {
      this.tripListComponent.addComponent(new TripEvent());
    }
  }
}

export default TripPresenter;
