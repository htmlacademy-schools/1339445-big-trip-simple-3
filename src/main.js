import MainPresenter from './presenter/MainPresenter';
import TripModel from './model/TripModel';
import FilterPresenter from './presenter/FilterPresenter';
import FilterModel from './model/FilterModel';

const tripFiltersBlock = document.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');

const presenter = new MainPresenter();
const filterPresenter = new FilterPresenter();

const tripModel = new TripModel();
const filterModel = new FilterModel();

presenter.init(tripEventsSection, tripModel, filterModel);
filterPresenter.init(tripFiltersBlock, filterModel);
