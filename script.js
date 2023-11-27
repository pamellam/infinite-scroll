const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let initialLoad = true;

// Unsplash API
let count = 5;
const apiKey = 'DB-DetNxzooXJ06bVxTkTYLfxNJcFIdT65xUaIoUEG4';
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

// Check if all imagaes are loaded
function handleImageLoad() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
    initialLoad = false;
    count = 30;
  }
}

// Helper function to set attributes on DOM elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Create elements for links & photos; Add to the DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  // Run function for each object in photosArray
  photosArray.forEach((photo) => {
    // Create <a> to link to full photo
    const item = document.createElement('a');
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank',
    });
    // Create <img> for photo
    const img = document.createElement('img');
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });

    // Apply a transition for a smooth hover effect
    item.style.transition = 'transform 0.3s ease-in-out';

    // Add hover effect to make the image look bigger
    item.addEventListener('mouseover', () => {
      img.style.transform = 'scale(1.05)'; // Increase the scale for a bigger appearance
    });

    // Reset the scale on mouseout
    item.addEventListener('mouseout', () => {
      img.style.transform = 'scale(1)';
    });
    // Event Listener, check when each is finished loading
    img.addEventListener('load', handleImageLoad);
    // Put <img> inside <a>, then put both inside imageContainer Element
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

// Get photos from the Unsplash API
async function fetchPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
  } catch (error) {
    console.error('Error fetching data from Unsplash:', error);
    alert('Error fetching data from Unsplash');
  }
}

// Check to see if scrolling near bottom of page, Load More Photos
window.addEventListener('scroll', handleScroll);

function handleScroll() {
  const isNearBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000;

  if (isNearBottom && ready) {
    ready = false;
    fetchPhotos();
  }
}

// On Load
fetchPhotos();
