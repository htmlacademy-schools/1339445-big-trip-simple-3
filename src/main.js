import TripPresenter from './presenter/TripPresenter';
import { render } from './render';
import FiltersView from './view/FiltersView';

const tripFiltersBlock = document.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');

const tripPresenter = new TripPresenter();

render(new FiltersView(), tripFiltersBlock);
tripPresenter.init(tripEventsSection);

