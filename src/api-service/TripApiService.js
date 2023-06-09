import ApiService, { Method } from '../framework/api-service.js';

export const STATUS = {
  success: 'success',
  error: 'error',
};

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

    let status = STATUS.success;
    const parsedResponse = await ApiService.parseResponse(response);
    if (!response.ok) {
      status = STATUS.error;
    }
    return {
      status,
      data: parsedResponse,
    };
  };

  updateTripEvent = async (tripEventData) => {
    const response = await this._load({
      url: `points/${tripEventData.id}`,
      method: Method.PUT,
      body: JSON.stringify(tripEventData),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    let status = STATUS.success;
    const parsedResponse = await ApiService.parseResponse(response);
    if (!response.ok) {
      status = STATUS.error;
    }
    return {
      status,
      data: parsedResponse,
    };
  };

  deleteTripEventById = async (id) => {
    const response = await this._load({
      url: `points/${id}`,
      method: Method.DELETE,
    });

    let status = STATUS.success;
    if (!response.ok) {
      status = STATUS.error;
    }
    return {
      status,
      data: null,
    };
  };
}
