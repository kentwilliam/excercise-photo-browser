// TODO
// document on DOM loaded
// prep a layout displaying the data we expect
// load the data from the endpoint
// fill in the layout with a nice animation
// tap on an item to show in a lightbox (on top of the rest)
// tap on next/previous to navigate

import request from './http-request.js';

const photos = [];
let currentPhotoIndex = 0;

const baseUrl = 'https://api.flickr.com/services/rest/';
const config = {
  api_key: '36357bcc49eb2158337eeb5520448f4c',
  method: 'flickr.photosets.getPhotos',
  photoset_id: '72157637612059163',
  format: 'json'
};
const queryString = Object
  .keys(config)
  .map((key) => `${key}=${config[key]}`)
  .join('&');
const url = `${baseUrl}?${queryString}`;

function getImages () {
  request('get', url, onSuccess, onFailure);

  function onSuccess (xhr) {
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

    Array.prototype.push.apply(photos, results.map((photo) => {
      return {
        data: photo,
        url: buildPhotoUrl(photo, 'm')
      };
    }));

    updateView();
  }

  function onFailure () {
    console.error('Failed to retriev data set!');
  }
}

/// Looks up an object property chain, if the property is not found it returns undefined.
function getProperty (object, path) {
  var pathSegments = path.split('.');
  var currentContext = object;

  while (pathSegments.length > 0) {
    var segment = pathSegments.shift();
    if (typeof currentContext !== 'object') {
      return;
    }
    currentContext = currentContext[segment];
  };

  return currentContext;
}

// Constructs the correct URI for the photo
// Format: https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
function buildPhotoUrl (photo, size = 'm') {
  const { farm, secret, server, id } = photo;
  return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_${size}.jpg`
}

// For some reason, the response string is wrapped in `jsonFlickrApi(…)`
function unwrap (jsonString) {
  return jsonString
    .replace(/^jsonFlickrApi\(/, '')
    .replace(/\)$/, '');
}

getImages();

function updateView() {
  let domNode = document.body;

  domNode.innerHTML = '';

  for (var i = 0; i < photos.length; i++) {
    const image = new Image();
    domNode.appendChild(image);
    image.src = photos[i].url;
  }
}

