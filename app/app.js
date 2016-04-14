/// Core application example for a photo browser. The app uses the Flickr API
/// to generate a set of images and reference their various sizes

require('./css/app.sass');
import ImageLoader from './image-loader.js';
import createImageNodeUsingTemplate from './create-image-node-using-template.js'

document.addEventListener('DOMContentLoaded', initialize);

function initialize () {
  const state = {
    photos: [],
    currentPhotoIndex: null
  };

  // Initialize router
  window.addEventListener("hashchange", () => updateRoute(state));

  // Tap lightbox to close
  document.querySelector('.lightbox').addEventListener('click', () => {
    window.location.hash = '#';
  });

  // Load data
  const imageLoader = new ImageLoader(state, () => displayResults(state));
  imageLoader.loadImages();

  updateRoute(state);
}

function updateRoute (state) {
  var currentPhotoIndex = window.location.hash.slice(7);

  state.currentPhotoIndex = currentPhotoIndex ?
    Number(currentPhotoIndex) :
    null;

  updateView(state);
}

/// When results arrive, populate DOM
function displayResults(state) {
  const container = document.createElement('div');
  const { photos } = state;

  for (var i = 0; i < photos.length; i++) {
    const node = createImageNodeUsingTemplate({
      photo: photos[i],
      templateId: 'photo',
      size: 's'
    });
    node.href = `#photo=${i}`;
    container.appendChild(node);
  }

  container.classList.add('photos');

  // Replace whole subtree in one operation
  const previousContainer = document.querySelector('.photos');
  previousContainer.parentNode.replaceChild(container, previousContainer);

  updateView(state);
}

/// Called whenever the state of the application changes
function updateView(state) {
  const { photos, currentPhotoIndex } = state;
  const lightbox = document.querySelector('.lightbox');
  const previousLink = lightbox.querySelector('.previous');
  const nextLink = lightbox.querySelector('.next');
  const showLightbox = typeof currentPhotoIndex === 'number';

  // Remove loading spinner once we have photos
  if (photos.length) {
    document.body.classList.remove('is-initial-load');
  }

  lightbox.classList.toggle('is-active', showLightbox);

  if (!showLightbox) {
    return;
  }

  // Update light box contents
  const hasPrevious = currentPhotoIndex;
  const hasNext = currentPhotoIndex < photos.length - 1;

  previousLink.classList.toggle('is-active', hasPrevious);
  if (hasPrevious) {
    previousLink.href = '#photo=' + (currentPhotoIndex - 1);
  }

  nextLink.classList.toggle('is-active', hasNext);
  if (hasNext) {
    nextLink.href = '#photo=' + (currentPhotoIndex + 1);
  }

  const photo = createImageNodeUsingTemplate({
    photo: photos[currentPhotoIndex],
    templateId: 'lightbox-photo',
    size: 'l'
  });
  const container = lightbox.querySelector('.photo-container');
  container.innerHTML = '';
  container.appendChild(photo);
}
