export const TRIP_EVENT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

export const LIST_MODE = {
  DEFAULT: 'DEFAULT',
  EMPTY: 'EMPTY',
};

export const FORM_MODE = {
  NEW: 'NEW',
  EDIT: 'EDIT',
};

export const SORTING_BY = {
  DAY: 'sort-day',
  // EVENT: 'sort-event', // not implemented
  // TIME: 'sort-time', // not implemented
  PRICE: 'sort-price',
  // OFFER: 'sort-offer', // not implemented
};

export const FILTER_MODE = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};
