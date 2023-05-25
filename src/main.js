import TripPresenter from './presenter/TripPresenter';
import { render } from './framework/render';
import FiltersView from './view/FiltersView';
import TripModel from './model/TripModel';

// nothing to change
const tripFiltersBlock = document.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');

const tripPresenter = new TripPresenter();
const tripModel = new TripModel();

render(new FiltersView(), tripFiltersBlock);
tripPresenter.init(tripEventsSection, tripModel);
