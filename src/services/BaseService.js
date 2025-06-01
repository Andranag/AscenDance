import { responseUtils } from '../utils/response';
import { apiErrorUtils } from '../utils/apiError';

export default class BaseService {
  constructor(api, endpointPrefix) {
    this.api = api;
    this.endpointPrefix = endpointPrefix || '';
  }

  // Format URL with prefix if needed
  formatUrl(endpoint) {
    if (!endpoint.startsWith('/')) {
      return `/${endpoint}`;
    }
    return endpoint;
  }

  // Get full endpoint URL
  getEndpoint(endpoint) {
    return `${this.endpointPrefix}${this.formatUrl(endpoint)}`;
  }

  // Handle API requests with common error handling
  async request(config) {
    try {
      const response = await this.api.request(config);
      return responseUtils.isSuccess(response) ? response : responseUtils.error(response);
    } catch (error) {
      const errorResponse = apiErrorUtils.handleApiError(error);
      throw errorResponse;
    }
  }

  // Common HTTP methods
  async get(endpoint, config = {}) {
    return this.request({
      ...config,
      method: 'GET',
      url: this.getEndpoint(endpoint)
    });
  }

  async post(endpoint, data, config = {}) {
    return this.request({
      ...config,
      method: 'POST',
      url: this.getEndpoint(endpoint),
      data
    });
  }

  async put(endpoint, data, config = {}) {
    return this.request({
      ...config,
      method: 'PUT',
      url: this.getEndpoint(endpoint),
      data
    });
  }

  async delete(endpoint, config = {}) {
    return this.request({
      ...config,
      method: 'DELETE',
      url: this.getEndpoint(endpoint)
    });
  }
}
