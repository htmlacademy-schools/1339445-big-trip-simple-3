import ApiService, { Method } from '../framework/api-service.js';

export default class TripApiService extends ApiService {
  get tripEvents() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  addTripEvent = async (tripEventData) => {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(tripEventData),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  updateTripEvent = async (tripEventData) => {
    const response = await this._load({
      url: `points/${tripEventData.id}`,
      method: Method.PUT,
      body: JSON.stringify(tripEventData),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  deleteTripEventById = async (id) => {
    const response = await this._load({
      url: `points/${id}`,
      method: Method.DELETE,
    });

    return response;
  };
}
