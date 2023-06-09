import MainPresenter from './presenter/MainPresenter';
import TripModel from './model/TripModel';
import FilterPresenter from './presenter/FilterPresenter';
import FilterModel from './model/FilterModel';
import TripApiService from './api-service/TripApiService';
import OfferModel from './model/OfferModel';
import DestinationModel from './model/DestinationModel';
import OfferApiService from './api-service/OfferApiService';
import DestinationApiService from './api-service/DestinationApiService';

const AUTHORIZATION = 'Basic fS2nfS49wcl1HA22dfg';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const tripFiltersBlock = document.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');

const tripModel = new TripModel(new TripApiService(END_POINT, AUTHORIZATION));
const offerModel = new OfferModel(new OfferApiService(END_POINT, AUTHORIZATION));
const destinationModel = new DestinationModel(new DestinationApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const presenter = new MainPresenter();
const filterPresenter = new FilterPresenter();

presenter.init(tripEventsSection, tripModel, filterModel, offerModel, destinationModel);
filterPresenter.init(tripFiltersBlock, filterModel);

tripModel.init();
offerModel.init();
destinationModel.init();
