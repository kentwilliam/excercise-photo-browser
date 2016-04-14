import request from './http-request.js';
import getProperty from './get-property.js';
import unwrap from './unwrap.js'

// For now, the request configuration is just static
const baseUrl = 'https://api.flickr.com/services/rest/';
const config = {
  api_key: '36357bcc49eb2158337eeb5520448f4c',
  method: 'flickr.photosets.getPhotos',
  photoset_id: '72157637612059163',
  per_page: 60,
  extras: [
    'description',
    'url_l',
    'url_s',
  ].join(','),
  format: 'json'
};
const queryString = Object
  .keys(config)
  .map((key) => `${key}=${config[key]}`)
  .join('&');
const url = `${baseUrl}?${queryString}`;

export default class ImageLoader {
  constructor(state, update) {
    this.state = state;
    this.update = update;
  }

  loadImages () {
    request('get', url, this.onSuccess.bind(this), this.onFailure.bind(this));
  }

  onSuccess (xhr) {
    var response;

    try {
      response = JSON.parse(unwrap(xhr.response));
    } catch (error) {
      console.warn('Invalid JSON response from server', error);
    }

    const results = getProperty(response, 'photoset.photo');
    if (results == null) {
      console.warn('Unexpected data in JSON response from server', response);
      return;
    }

    Array.prototype.push.apply(this.state.photos, results);

    this.update();
  }

  onFailure () {
    console.error('Failed to retrieve data set!');
  }
}
