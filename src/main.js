import MainPresenter from './presenter/MainPresenter';
import TripModel from './model/TripModel';

const tripFiltersBlock = document.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');

const presenter = new MainPresenter();
const tripModel = new TripModel();

presenter.init(tripEventsSection, tripFiltersBlock, tripModel);
