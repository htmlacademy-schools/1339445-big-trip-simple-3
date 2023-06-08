import { TRIP_EVENT_TYPES } from '../const';
import { getLoremIpsum, getRandomInt, getRandomElement, sample, getTrueWithChance } from '../utils';
import dayjs from 'dayjs';

// !!!!!!!!
// В этом файле многие некоторые ключи объектов названы не в стиле camelCase.
// Это было сделано намеренно для поддержания соответствия именования ключей
// как в ТЗ

const generatePictures = () => {
  const picturesNumber = getRandomInt(1, 6);
  const pictures = new Array(picturesNumber);
  for (let i = 0; i < pictures.length; ++i) {
    pictures[i] = {
      src: `http://picsum.photos/300/200?r=${getRandomInt(0, Number.MAX_SAFE_INTEGER)}`,
      description: getLoremIpsum(getRandomInt(1, 6)),
    };
  }
  return pictures;
};

// fill Destinations
const destinationNames = [
  'Amsterdam',
  'Geneva',
  'Chamonix',
];
const destinations = {}; // {Destination.id: Destination}
destinationNames.forEach((name, index) => {
  const id = index + 1;
  const destination = {
    id,
    description: `${name}, ${getLoremIpsum(21)}`,
    name,
    pictures: generatePictures(),
  };
  destinations[id] = destination;
});

// fill Offers
const offers = {}; // {Offer.id: Offer}
const offersNumber = getRandomInt(5, 11);
for (let id = 1; id < offersNumber + 1; ++id) {
  const offer = {
    id,
    title: `Offer ${id}`,
    price: getRandomInt(10, 81),
  };
  offers[id] = offer;
}

const generateDestination = () => +getRandomElement(Object.keys(destinations));

const generateTripType = () => getRandomElement(TRIP_EVENT_TYPES);

const generateDate = (initialDate = undefined) => {
  if (typeof initialDate === 'undefined') {
    initialDate = dayjs().subtract(1, 'days');
  }
  initialDate = initialDate.startOf('minute');

  // offset from initialDate
  const minMinutesOffset = 15;
  const maxMinutesOffset = 12 * 60;

  // duration of event
  const minMinutesDuration = 30;
  const maxMinutesDuration = 90;

  const minutesOffset = getRandomInt(minMinutesOffset, maxMinutesOffset + 1);
  const minutesDuration = getRandomInt(minMinutesDuration, maxMinutesDuration + 1);

  const dateFrom = initialDate.add(minutesOffset, 'minute');
  const dateTo = dateFrom.add(minutesDuration, 'minute');
  return {
    date_from: dateFrom,
    date_to: dateTo,
  };
};

export const generateOffers = () => {
  const offersKeys = Object.keys(offers).map((value) => +value);
  const offerIds = sample(
    offersKeys,
    getRandomInt(3, Math.min(5, offersKeys.length) + 1)
  )
    .sort((a, b) => a - b);
  const result = {};
  for (const offerId of offerIds) {
    result[offerId] = getTrueWithChance(0.3);
  }
  return result;
};

export const generateTripEvents = (tripsNumber) => {
  let initialDate = dayjs().subtract(1, 'days');
  const trips = new Array(tripsNumber);
  for (let i = 0; i < tripsNumber; ++i) {
    const { date_from, date_to } = generateDate(initialDate);

    initialDate = date_to;
    const trip = {
      id: i + 1,
      base_price: getRandomInt(500, 1501),
      date_from: date_from.toISOString(),
      date_to: date_to.toISOString(),
      destination: generateDestination(),
      offers: generateOffers(),
      type: generateTripType(),
    };
    trips[i] = trip;
  }
  return trips;
};

export { destinations, offers };
